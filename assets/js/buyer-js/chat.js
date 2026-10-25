/**
 * Logika Chat Pembeli ON Shop (Dari Nol)
 * Navigasi Cerdas: Kembali ke produk jika dibuka dari barang, atau kembali ke Beranda jika dibuka umum
 * File: assets/js/buyer-js/chat.js
 */

let activeSellerId = null;
let currentPinnedProductId = null;
let chatRefreshTimer = null;

// =============================================================
// NAVIGASI KEMBALI CHAT BEBAS DARI RIWAYAT HANTU
// =============================================================
function handleSmartBackNav() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product_id");

  // Jika URL membawa product_id (berarti dibuka dari tombol Chat di Detail Produk)
  if (productId && productId !== "0" && productId !== "null") {
    const fromParam = urlParams.get("from");
    const backUrl = fromParam 
      ? `detail-produk.html?id=${productId}&from=${encodeURIComponent(fromParam)}`
      : `detail-produk.html?id=${productId}`;
    window.location.href = backUrl;
    return;
  }

  // Jika dibuka dari navbar atas secara umum, SELALU kembali ke Beranda
  window.location.href = "index.html";
}

window.handleSmartBackNav = handleSmartBackNav;

function getActiveBuyerId() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && user.user_id) {
    return parseInt(user.user_id, 10);
  }
  return null;
}

function closeMobileChatWindow() {
  const chatFrame = document.getElementById("chatFrame");
  if (chatFrame) chatFrame.classList.remove("view-active");
}

function openMobileChatWindow() {
  const chatFrame = document.getElementById("chatFrame");
  if (chatFrame) chatFrame.classList.add("view-active");
}

window.closeMobileChatWindow = closeMobileChatWindow;
window.openMobileChatWindow = openMobileChatWindow;

document.addEventListener("DOMContentLoaded", () => {
  const buyerId = getActiveBuyerId();

  if (!buyerId) {
    const currentTargetUrl = window.location.href;
    sessionStorage.setItem("redirectAfterLogin", currentTargetUrl);

    if (typeof showToast === "function") {
      showToast("Silakan login terlebih dahulu untuk mengakses pesan!", "warning");
    } else {
      alert("Silakan login terlebih dahulu untuk mengakses pesan!");
    }

    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(currentTargetUrl)}`;
    }, 800);
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const sellerIdParam  = urlParams.get("seller_id");
  const shopIdParam    = urlParams.get("shop_id");
  const productIdParam = urlParams.get("product_id");

  loadConversationsList();

  if (sellerIdParam !== null || shopIdParam !== null || productIdParam !== null) {
    initChatWithSeller(sellerIdParam, shopIdParam, productIdParam);
  }
});

async function initChatWithSeller(sellerId, shopId, productId) {
  const buyerId = getActiveBuyerId();
  if (!buyerId) return;

  try {
    const apiUrl = `/on-shop/api/buyer/manage_chats.php?action=init_chat&auth_user_id=${buyerId}&seller_id=${sellerId || 0}&shop_id=${shopId || 0}&product_id=${productId || 0}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status && json.seller) {
      activeSellerId = parseInt(json.seller.seller_id, 10);

      const shopName = json.seller.shop_name || "Toko Penjual";
      const nameEl = document.getElementById("activeShopName");
      const avatarEl = document.getElementById("activeShopAvatar");
      if (nameEl) nameEl.innerText = shopName;
      if (avatarEl) avatarEl.innerText = shopName.substring(0, 2).toUpperCase();

      const visitLink = document.getElementById("btnShopVisitLink");
      if (visitLink && json.seller.shop_id) {
        visitLink.href = `toko.html?id=${json.seller.shop_id}&product_id=${productId || 0}`;
      }

      if (json.related_product) {
        currentPinnedProductId = json.related_product.product_id;
        const pinnedBar = document.getElementById("pinnedProductBar");
        if (pinnedBar) pinnedBar.style.display = "flex";

        const pinnedImg = document.getElementById("pinnedImg");
        if (pinnedImg) pinnedImg.src = json.related_product.image_url;

        const pinnedTitle = document.getElementById("pinnedTitle");
        if (pinnedTitle) pinnedTitle.innerText = json.related_product.product_name;

        const pinnedPrice = document.getElementById("pinnedPrice");
        if (pinnedPrice) pinnedPrice.innerText = `Rp ${Number(json.related_product.display_price).toLocaleString("id-ID")}`;
      }

      openMobileChatWindow();
      await loadMessages();

      if (chatRefreshTimer) clearInterval(chatRefreshTimer);
      chatRefreshTimer = setInterval(loadMessages, 3000);
    }
  } catch (err) {
    console.error("Fetch init_chat error:", err);
  }
}

async function loadConversationsList() {
  const buyerId = getActiveBuyerId();
  if (!buyerId) return;

  const container = document.getElementById("storeChatList");
  if (!container) return;

  try {
    const res = await fetch(`/on-shop/api/buyer/manage_chats.php?action=get_conversations&auth_user_id=${buyerId}`);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:24px; color:#94a3b8; font-size:12px;">Belum ada riwayat pesan.</p>`;
      return;
    }

    container.innerHTML = "";
    json.data.forEach((item) => {
      const div = document.createElement("div");
      div.className = `chat-item ${activeSellerId == item.seller_id ? "active" : ""}`;
      div.onclick = () => selectSellerChat(item.seller_id, item.shop_name, item.shop_id);

      div.innerHTML = `
        <div class="chat-item-avatar">${item.shop_name.substring(0, 2).toUpperCase()}</div>
        <div class="chat-item-content">
          <div class="chat-item-title">
            <span>${escapeHtml(item.shop_name)}</span>
            <span class="chat-item-time">${item.last_time_formatted || ""}</span>
          </div>
          <div class="chat-item-snippet">
            ${escapeHtml(item.last_message || "")}
            ${item.unread_count > 0 ? `<span class="unread-pill">${item.unread_count}</span>` : ""}
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal muat sidebar chat:", err);
  }
}

function selectSellerChat(sellerId, shopName, shopId) {
  activeSellerId = parseInt(sellerId, 10);
  const nameEl = document.getElementById("activeShopName");
  const avatarEl = document.getElementById("activeShopAvatar");
  if (nameEl) nameEl.innerText = shopName;
  if (avatarEl) avatarEl.innerText = shopName.substring(0, 2).toUpperCase();

  const visitLink = document.getElementById("btnShopVisitLink");
  if (visitLink && shopId) {
    visitLink.href = `toko.html?id=${shopId}`;
  }

  openMobileChatWindow();
  loadConversationsList();
  loadMessages();

  if (chatRefreshTimer) clearInterval(chatRefreshTimer);
  chatRefreshTimer = setInterval(loadMessages, 3000);
}

async function loadMessages() {
  if (!activeSellerId) return;

  const buyerId = getActiveBuyerId();
  if (!buyerId) return;

  const msgContainer = document.getElementById("chatMessages");
  if (!msgContainer) return;

  try {
    const res = await fetch(`/on-shop/api/buyer/manage_chats.php?action=get_messages&auth_user_id=${buyerId}&seller_id=${activeSellerId}`);
    const json = await res.json();

    if (!json.status) return;

    if (!json.messages || json.messages.length === 0) {
      msgContainer.innerHTML = `<p style="text-align:center; margin:auto; color:#94a3b8; font-size:13px;">Mulai percakapan dengan penjual ini.</p>`;
      return;
    }

    const currentScroll = msgContainer.scrollTop;
    const isAtBottom = msgContainer.scrollHeight - msgContainer.scrollTop <= msgContainer.clientHeight + 80;

    msgContainer.innerHTML = "";
    json.messages.forEach((msg) => {
      const isOutgoing = msg.sender_id == json.buyer_id;
      const row = document.createElement("div");
      row.className = `bubble-row ${isOutgoing ? "outgoing" : "incoming"}`;

      row.innerHTML = `
        <div class="bubble">${escapeHtml(msg.message)}</div>
        <span class="msg-timestamp">${msg.created_at_formatted || ""}</span>
      `;
      msgContainer.appendChild(row);
    });

    if (isAtBottom || currentScroll === 0) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  } catch (err) {
    console.error("Gagal muat pesan:", err);
  }
}

async function handleSendBuyerChat(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("buyerChatInput");
  const msg = input ? input.value.trim() : "";
  const buyerId = getActiveBuyerId();

  if (!buyerId) return;
  if (!activeSellerId || !msg) return;

  try {
    const res = await fetch("/on-shop/api/buyer/manage_chats.php?action=send_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_user_id: buyerId,
        receiver_id: activeSellerId,
        message: msg,
        product_id: currentPinnedProductId || null
      })
    });
    const json = await res.json();

    if (json.status) {
      input.value = "";
      await loadMessages();
      await loadConversationsList();
    }
  } catch (err) {
    console.error("Gagal kirim pesan:", err);
  }
}

function sendInquiryProduct() {
  const title = document.getElementById("pinnedTitle")?.innerText || "";
  const price = document.getElementById("pinnedPrice")?.innerText || "";
  const input = document.getElementById("buyerChatInput");
  if (input) {
    input.value = `Halo kak, apakah produk "${title}" (${price}) ini masih ready stok?`;
    input.focus();
  }
}

function insertQuick(text) {
  const input = document.getElementById("buyerChatInput");
  if (input) {
    input.value = text;
    input.focus();
  }
}

function handleSearchStore() {
  const q = document.getElementById("storeSearchInput")?.value.toLowerCase() || "";
  const items = document.querySelectorAll(".chat-item");
  items.forEach((el) => {
    const name = el.querySelector(".chat-item-title span")?.innerText.toLowerCase() || "";
    el.style.display = name.includes(q) ? "flex" : "none";
  });
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

window.handleSendBuyerChat = handleSendBuyerChat;
window.sendInquiryProduct = sendInquiryProduct;
window.insertQuick = insertQuick;
window.handleSearchStore = handleSearchStore;