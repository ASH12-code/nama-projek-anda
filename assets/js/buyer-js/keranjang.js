/**
 * Logika Keranjang Belanja Terintegrasi Database MySQL (Dari Nol)
 * Fitur: Multi-Varian, Kontrol Batas Stok, dan Tombol Kembali Mutlak ke Beranda
 * File: assets/js/buyer-js/keranjang.js
 */

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let cartShops = [];

// =============================================================
// NAVIGASI KEMBALI KERANJANG: MUTLAK KE BERANDA (ANTI-LOOP)
// =============================================================
function handleCartBackNav() {
  window.location.href = "index.html";
}

window.handleCartBackNav = handleCartBackNav;

document.addEventListener("DOMContentLoaded", () => {
  if (!currentUser || !currentUser.user_id) {
    if (typeof showToast === "function") {
      showToast("Silakan masuk terlebih dahulu untuk melihat keranjang belanja Anda.", "warning");
    }
    setTimeout(() => {
      window.location.href = "login.html?redirect=keranjang.html";
    }, 1200);
    return;
  }

  loadCartFromDatabase();
});

async function loadCartFromDatabase() {
  try {
    const res = await fetch(`/on-shop/api/buyer/cart.php?action=list&user_id=${currentUser.user_id}`);
    const result = await res.json();

    if (result.status) {
      cartShops = result.data || [];
      renderCartView();
    } else {
      console.error("Gagal memuat keranjang:", result.message);
    }
  } catch (err) {
    console.error("Gangguan koneksi keranjang:", err);
  }
}

function renderCartView() {
  const container = document.getElementById("shopGroupsContainer");
  const emptyState = document.getElementById("emptyCartState");
  if (!container || !emptyState) return;

  container.innerHTML = "";
  const totalItemCount = getTotalItemCount();

  const totalItemsCountEl = document.getElementById("totalItemsCount");
  if (totalItemsCountEl) totalItemsCountEl.innerText = totalItemCount;

  if (typeof window.initNavbarCartBadge === "function") {
    window.initNavbarCartBadge();
  }

  if (totalItemCount === 0) {
    emptyState.classList.remove("hidden");
    container.classList.add("hidden");
    recalculateCart();
    return;
  }

  emptyState.classList.add("hidden");
  container.classList.remove("hidden");

  cartShops.forEach((shop, shopIdx) => {
    if (!shop.items || shop.items.length === 0) return;

    const isShopAllChecked = shop.items.every(i => i.checked);
    const shopCard = document.createElement("div");
    shopCard.className = "shop-card-wrapper";

    shopCard.innerHTML = `
      <div class="shop-card-header">
        <input 
          type="checkbox" 
          class="shop-checkbox" 
          ${isShopAllChecked ? "checked" : ""} 
          onchange="toggleShopGroup(${shopIdx}, this.checked)"
        />
        <div class="shop-title-meta">
          <span class="shop-name-label">🏪 ${escapeHtml(shop.shop_name)}</span>
          <span class="shop-location-tag">📍 ${escapeHtml(shop.city || 'Indonesia')}</span>
        </div>
      </div>
      <div class="shop-items-list" id="shopItems_${shopIdx}"></div>
    `;

    container.appendChild(shopCard);

    const itemsContainer = shopCard.querySelector(`#shopItems_${shopIdx}`);
    shop.items.forEach((item, itemIdx) => {
      const row = document.createElement("div");
      row.className = "shop-item-row";

      const itemSubtotal = item.price * item.qty;

      row.innerHTML = `
        <input 
          type="checkbox" 
          class="item-checkbox" 
          ${item.checked ? "checked" : ""} 
          onchange="toggleItemCheckbox(${shopIdx}, ${itemIdx}, this.checked)"
        />
        <div class="item-thumb-wrapper">
          <img 
            src="${item.image}" 
            alt="${escapeHtml(item.name)}" 
            class="item-thumb" 
            onerror="this.src='https://placehold.co/100x100/2e8b57/ffffff?text=Produk'"
          />
        </div>
        <div class="item-details">
          <div class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
          <span class="item-variant-tag">Varian: ${escapeHtml(item.variant_name || 'Standar')}</span>
          <span class="item-stock-hint" style="font-size: 11px; color: #64748b; display: block; margin-top: 2px;">Tersisa: ${item.stock} buah</span>
        </div>
        <div class="item-price-column">
          Rp ${itemSubtotal.toLocaleString("id-ID")}
        </div>
        <div class="item-actions-column">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" onclick="updateItemQuantity(${shopIdx}, ${itemIdx}, -1)">-</button>
            <input type="text" class="qty-input" value="${item.qty}" readonly />
            <button type="button" class="qty-btn" onclick="updateItemQuantity(${shopIdx}, ${itemIdx}, 1)">+</button>
          </div>
          <button type="button" class="btn-remove-item" onclick="deleteSingleItem(${shopIdx}, ${itemIdx})" title="Hapus Barang">Hapus</button>
        </div>
      `;

      itemsContainer.appendChild(row);
    });
  });

  recalculateCart();
}

function toggleItemCheckbox(shopIdx, itemIdx, isChecked) {
  if (cartShops[shopIdx] && cartShops[shopIdx].items[itemIdx]) {
    cartShops[shopIdx].items[itemIdx].checked = isChecked;
    renderCartView();
  }
}

function toggleShopGroup(shopIdx, isChecked) {
  if (cartShops[shopIdx] && cartShops[shopIdx].items) {
    cartShops[shopIdx].items.forEach(item => (item.checked = isChecked));
    renderCartView();
  }
}

function toggleSelectAll(isChecked) {
  cartShops.forEach(shop => {
    if (shop.items) {
      shop.items.forEach(item => (item.checked = isChecked));
    }
  });
  renderCartView();
}

async function updateItemQuantity(shopIdx, itemIdx, delta) {
  const item = cartShops[shopIdx]?.items[itemIdx];
  if (!item) return;

  const newQty = item.qty + delta;

  if (newQty < 1) {
    if (typeof showToast === "function") {
      showToast("Jumlah minimal 1 barang. Klik 'Hapus' jika ingin membatalkan.", "warning");
    }
    return;
  }

  if (newQty > item.stock) {
    if (typeof showToast === "function") {
      showToast(`Maksimal ${item.stock} pcs sesuai sisa stok toko!`, "warning");
    }
    return;
  }

  try {
    const res = await fetch("/on-shop/api/buyer/cart.php?action=update_qty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        cart_id: item.cart_id,
        qty: newQty
      })
    });

    const result = await res.json();
    if (result.status) {
      item.qty = newQty;
      renderCartView();
    } else {
      if (typeof showToast === "function") showToast(result.message, "error");
    }
  } catch (err) {
    console.error("Gagal mengubah kuantitas:", err);
  }
}

async function deleteSingleItem(shopIdx, itemIdx) {
  const item = cartShops[shopIdx]?.items[itemIdx];
  if (!item) return;

  try {
    const res = await fetch("/on-shop/api/buyer/cart.php?action=delete_item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        cart_id: item.cart_id
      })
    });

    const result = await res.json();
    if (result.status) {
      if (typeof showToast === "function") {
        showToast("Barang berhasil dihapus dari keranjang.", "info");
      }
      cartShops[shopIdx].items.splice(itemIdx, 1);
      if (cartShops[shopIdx].items.length === 0) {
        cartShops.splice(shopIdx, 1);
      }
      renderCartView();
    } else {
      if (typeof showToast === "function") showToast(result.message, "error");
    }
  } catch (err) {
    console.error("Gagal menghapus item:", err);
  }
}

async function deleteSelectedItems() {
  const selectedIds = [];
  cartShops.forEach(shop => {
    shop.items.forEach(item => {
      if (item.checked) selectedIds.push(item.cart_id);
    });
  });

  if (selectedIds.length === 0) {
    if (typeof showToast === "function") {
      showToast("Pilih minimal satu barang yang ingin dihapus!", "warning");
    }
    return;
  }

  try {
    const res = await fetch("/on-shop/api/buyer/cart.php?action=delete_selected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        cart_ids: selectedIds
      })
    });

    const result = await res.json();
    if (result.status) {
      if (typeof showToast === "function") {
        showToast(`${selectedIds.length} barang terpilih berhasil dihapus.`, "success");
      }
      loadCartFromDatabase();
    } else {
      if (typeof showToast === "function") showToast(result.message, "error");
    }
  } catch (err) {
    console.error("Gagal menghapus produk terpilih:", err);
  }
}

function recalculateCart() {
  let totalPrice = 0;
  let totalCheckedItems = 0;
  let allItemsCount = 0;
  let allChecked = true;

  cartShops.forEach(shop => {
    shop.items.forEach(item => {
      allItemsCount++;
      if (item.checked) {
        totalPrice += (item.price * item.qty);
        totalCheckedItems += item.qty;
      } else {
        allChecked = false;
      }
    });
  });

  const priceDisplay = document.getElementById("totalPriceDisplay");
  const countText = document.getElementById("selectedItemCountText");
  const checkoutBadge = document.getElementById("checkoutBadgeCount");
  const selectAllBox = document.getElementById("selectAllCheckbox");

  if (priceDisplay) priceDisplay.innerText = `Rp ${totalPrice.toLocaleString("id-ID")}`;
  if (countText) countText.innerText = `${totalCheckedItems} Barang`;
  if (checkoutBadge) checkoutBadge.innerText = totalCheckedItems;
  if (selectAllBox) selectAllBox.checked = (allChecked && allItemsCount > 0);
}

function handleProceedCheckout() {
  const checkoutPayload = [];

  cartShops.forEach(shop => {
    const checkedItems = shop.items.filter(i => i.checked);
    if (checkedItems.length > 0) {
      checkoutPayload.push({
        shop_id: shop.shop_id,
        shop_name: shop.shop_name,
        city: shop.city,
        items: checkedItems
      });
    }
  });

  if (checkoutPayload.length === 0) {
    if (typeof showToast === "function") {
      showToast("Silakan centang minimal 1 barang untuk melanjutkan ke pembelian!", "warning");
    }
    return;
  }

  sessionStorage.setItem("cartCheckoutPayload", JSON.stringify(checkoutPayload));
  sessionStorage.removeItem("directCheckoutItem");
  window.location.href = "checkout.html";
}

function getTotalItemCount() {
  return cartShops.reduce((acc, shop) => acc + (shop.items ? shop.items.length : 0), 0);
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

window.toggleItemCheckbox = toggleItemCheckbox;
window.toggleShopGroup = toggleShopGroup;
window.toggleSelectAll = toggleSelectAll;
window.updateItemQuantity = updateItemQuantity;
window.deleteSingleItem = deleteSingleItem;
window.deleteSelectedItems = deleteSelectedItems;
window.handleProceedCheckout = handleProceedCheckout;