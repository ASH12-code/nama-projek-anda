/**
 * Logika Pengelolaan Daftar Produk Terhubung MySQL (Rombak dari 0)
 * File: assets/js/seller-js/daftar-produk.js
 */

var serverProducts = [];
var currentTab = "all";
var searchKeyword = "";
let toastTimeout = null;

const CATALOG_API = "../../api/seller/manage_catalog.php";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchServerCatalog();
});

function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.className = `toast-box toast-show ${type === "success" ? "toast-success" : "toast-error"}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 2600);
}

async function fetchServerCatalog() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`${CATALOG_API}?action=list${authQuery}`, {
      credentials: 'include'
    });
    const result = await res.json();

    if (!result.status) {
      showToast(result.message || "Gagal memuat produk", "error");
      return;
    }

    serverProducts = result.catalog || [];
    renderProductTable();

    // Update Counter di Tab
    if (result.counts) {
      document.getElementById("countAll").innerText = result.counts.all || 0;
      document.getElementById("countActive").innerText = result.counts.active || 0;
      document.getElementById("countOutOfStock").innerText = result.counts.out_of_stock || 0;
      document.getElementById("countArchived").innerText = result.counts.archived || 0;
    }
  } catch (err) {
    console.error("Gagal terhubung ke server produk:", err);
    showToast("Gangguan koneksi database", "error");
  }
}

function handleTabClick(statusKey, btnElement) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  btnElement.classList.add("active");
  currentTab = statusKey;
  renderProductTable();
}

function renderProductTable() {
  const tbody = document.getElementById("productTableBody");
  const emptyState = document.getElementById("emptyState");
  if (!tbody) return;

  tbody.innerHTML = "";

  const filtered = serverProducts.filter(p => {
    const isArchived = p.is_archived === 1;
    const stock = Number(p.total_stock || 0);

    if (currentTab === "active" && (isArchived || stock === 0)) return false;
    if (currentTab === "out_of_stock" && (isArchived || stock > 0)) return false;
    if (currentTab === "archived" && !isArchived) return false;

    if (searchKeyword && !p.product_name.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  filtered.forEach(p => {
    const tr = document.createElement("tr");
    const stock = Number(p.total_stock || 0);
    const isArchived = p.is_archived === 1;

    let statusBadge = `<span style="color:#2e8b57; font-weight:bold;">Aktif</span>`;
    if (isArchived) statusBadge = `<span style="color:#64748b; font-weight:bold;">Diarsipkan</span>`;
    else if (stock === 0) statusBadge = `<span style="color:#ef4444; font-weight:bold;">Habis</span>`;

    const imgUrl = p.image_url || "https://placehold.co/100x100?text=Produk";
    const formattedPrice = "Rp " + Number(p.display_price || 0).toLocaleString("id-ID");

    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${imgUrl}" alt="${p.product_name}" style="width:45px; height:45px; object-fit:cover; border-radius:6px;" onerror="this.src='https://placehold.co/100x100?text=Produk'">
          <div>
            <strong>${escapeHtml(p.product_name)}</strong>
            <div style="font-size:11px; color:#64748b;">ID Produk: #${p.product_id}</div>
          </div>
        </div>
      </td>
      <td><strong>${formattedPrice}</strong></td>
      <td><span class="${stock <= 5 ? 'stock-badge-low' : ''}">${stock} pcs</span></td>
      <td>${statusBadge}</td>
      <td>
        <div style="display:flex; gap:8px;">
          <a href="tambah-produk.html?id=${p.product_id}" style="color:#2e8b57; text-decoration:none; font-weight:bold; font-size:13px;">Ubah</a>
          <button type="button" onclick="deleteProduct(${p.product_id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; font-size:13px;">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  searchKeyword = input ? input.value.trim() : "";
  renderProductTable();
}

async function deleteProduct(productId) {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`${CATALOG_API}?action=delete${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ product_id: productId })
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Produk berhasil dihapus!");
      await fetchServerCatalog();
    } else {
      showToast(result.message || "Gagal menghapus produk", "error");
    }
  } catch (err) {
    console.error("Gagal hapus:", err);
    showToast("Terjadi gangguan koneksi", "error");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}