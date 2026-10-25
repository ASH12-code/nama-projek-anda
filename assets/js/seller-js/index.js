/**
 * Logika Katalog Seller, Pin Produk & Sinkronisasi Database MySQL (Rombak dari 0)
 * File: assets/js/seller-js/index.js
 */

var catalogData = [];
var pinnedList = [];
var activeTab = 'all';
let toastTimeout = null;
let pendingDeleteId = null;

document.addEventListener("DOMContentLoaded", async () => {
  initTabNavigation();
  await loadShopCatalog();
});

// =========================================================
// 1. SISTEM NOTIFIKASI TOAST (PENGGANTI ALERT)
// =========================================================
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) {
    console.log(`[Toast ${type}]: ${message}`);
    return;
  }

  msgEl.innerText = message;
  if (iconEl) {
    iconEl.innerText = (type === "success") ? "✓" : "✕";
  }

  toast.className = `toast-box toast-show ${type === "success" ? "toast-success" : "toast-error"}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 2600);
}

// =========================================================
// 2. NAVIGASI TAB & LOAD DATA
// =========================================================
function initTabNavigation() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", function() {
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      activeTab = this.getAttribute("data-tab");
      renderCatalogView();
    });
  });
}

async function loadShopCatalog() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    // Menggunakan credentials: 'include' agar kuki sesi PHP selalu terbawa otomatis
    const res = await fetch(`../../api/seller/manage_catalog.php?action=list${authQuery}`, {
      credentials: 'include'
    });
    const result = await res.json();

    if (!result.status) {
      if (res.status === 403 || res.status === 401) {
        showToast("Sesi Anda berakhir, dialihkan ke login...", "error");
        setTimeout(() => { window.location.href = "../buyer/login.html"; }, 1500);
        return;
      }
      showToast(result.message || "Gagal memuat katalog", "error");
      return;
    }

    catalogData = result.catalog || [];
    pinnedList  = result.pinned || [];

    // Pasang Counter Tab
    const cAll = document.getElementById("countAll");
    const cActive = document.getElementById("countActive");
    const cOutOfStock = document.getElementById("countOutOfStock");
    const cArchived = document.getElementById("countArchived");
    const pinLabel = document.getElementById("pinCountLabel");

    if (cAll && result.counts) cAll.innerText = result.counts.all;
    if (cActive && result.counts) cActive.innerText = result.counts.active;
    if (cOutOfStock && result.counts) cOutOfStock.innerText = result.counts.out_of_stock;
    if (cArchived && result.counts) cArchived.innerText = result.counts.archived;
    if (pinLabel) pinLabel.innerText = `(${pinnedList.length} / 10 Dipilih)`;

    renderCatalogView();

    if (typeof applyBadgeCounts === 'function' && result.counts) {
      applyBadgeCounts(".badge-slot-stock", result.counts.out_of_stock);
    }

  } catch (err) {
    console.error("Gagal memuat katalog:", err);
    showToast("Terjadi gangguan koneksi ke server", "error");
  }
}

// =========================================================
// 3. RENDER TAMPILAN KATALOG
// =========================================================
function renderCatalogView() {
  const pinnedBox = document.getElementById("pinnedGridBox");
  if (pinnedBox) {
    pinnedBox.innerHTML = "";
    if (pinnedList.length === 0) {
      pinnedBox.innerHTML = `<p style="grid-column: 1/-1; font-size: 12.5px; color: #92400e;">Belum ada produk yang disematkan di baris atas.</p>`;
    } else {
      pinnedList.forEach(prod => {
        pinnedBox.innerHTML += buildCardHtml(prod, true);
      });
    }
  }

  const allBox = document.getElementById("allProductGridBox");
  if (allBox) {
    allBox.innerHTML = "";

    const filtered = catalogData.filter(prod => {
      if (activeTab === 'active') return prod.is_archived === 0 && prod.total_stock > 0;
      if (activeTab === 'out_of_stock') return prod.is_archived === 0 && prod.total_stock === 0;
      if (activeTab === 'archived') return prod.is_archived === 1;
      return true;
    });

    if (filtered.length === 0) {
      allBox.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 35px; color: #64748b; font-size: 13px;">Tidak ada produk pada filter ini.</p>`;
      return;
    }

    filtered.forEach(prod => {
      const isPinned = prod.is_pinned === 1;
      allBox.innerHTML += buildCardHtml(prod, isPinned);
    });
  }
}

function buildCardHtml(p, isPinned) {
  const isOutOfStock = p.total_stock === 0;
  const isArchived = p.is_archived === 1;
  const tooltipText = isPinned ? "Lepas pin produk" : "Pin produk ini";

  return `
    <div class="product-card" id="card-${p.product_id}">
      <div class="card-img-box">
        <img src="${p.image_url}" alt="${p.product_name}" onerror="this.src='https://placehold.co/300x300/e2e8f0/475569?text=No+Image'">
        
        <button 
          type="button" 
          class="btn-pin-badge-top ${isPinned ? 'pinned' : ''}" 
          data-tooltip="${tooltipText}"
          onclick="togglePinDatabase(${p.product_id})">
          📌
        </button>

        ${isOutOfStock ? '<span class="badge-status-tag habis">Habis</span>' : ''}
        ${isArchived ? '<span class="badge-status-tag arsip">Diarsipkan</span>' : ''}
      </div>

      <h4 class="card-title" title="${p.product_name}">${p.product_name}</h4>
      <div class="card-price">Rp ${Number(p.display_price).toLocaleString("id-ID")}</div>
      <div class="card-stock">Stok: <strong>${p.total_stock}</strong> pcs</div>

      <div class="action-row-3">
        <a href="tambah-produk.html?id=${p.product_id}" class="btn-act-3 btn-act-edit-3">Edit</a>
        <button type="button" class="btn-act-3 btn-act-archive-3" onclick="toggleArchiveDatabase(${p.product_id})">
          ${isArchived ? 'Buka' : 'Arsip'}
        </button>
        <button type="button" class="btn-act-3 btn-act-delete-3" onclick="confirmDeleteProduct(${p.product_id})">Hapus</button>
      </div>
    </div>
  `;
}

// =========================================================
// 4. AKSI PIN & ARSIP
// =========================================================
async function togglePinDatabase(productId) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`../../api/seller/manage_catalog.php?action=toggle_pin${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId })
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      await loadShopCatalog();
    } else {
      showToast(result.message || "Gagal mengubah pin", "error");
    }
  } catch (err) {
    console.error("Gagal pin produk:", err);
    showToast("Gangguan koneksi saat menyematkan produk", "error");
  }
}

async function toggleArchiveDatabase(productId) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`../../api/seller/manage_catalog.php?action=toggle_archive${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId })
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      await loadShopCatalog();
    } else {
      showToast(result.message || "Gagal mengubah status arsip", "error");
    }
  } catch (err) {
    console.error("Gagal arsipkan produk:", err);
    showToast("Gangguan koneksi saat mengarsipkan produk", "error");
  }
}

// =========================================================
// 5. AKSI HAPUS PRODUK
// =========================================================
function confirmDeleteProduct(productId) {
  pendingDeleteId = productId;
  const modal = document.getElementById("deleteConfirmModal");
  const execBtn = document.getElementById("btnExecuteDelete");

  if (modal && execBtn) {
    execBtn.onclick = executeDeleteProduct;
    modal.style.display = "flex";
  }
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById("deleteConfirmModal");
  if (modal) modal.style.display = "none";
  pendingDeleteId = null;
}

async function executeDeleteProduct() {
  if (!pendingDeleteId) return;
  const productId = pendingDeleteId;
  closeDeleteConfirmModal();

  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`../../api/seller/manage_catalog.php?action=delete${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId })
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Produk berhasil dihapus!", "success");
      await loadShopCatalog();
    } else {
      showToast(result.message || "Gagal menghapus produk", "error");
    }
  } catch (err) {
    console.error("Gagal menghapus produk:", err);
    showToast("Gangguan koneksi saat menghapus produk", "error");
  }
}