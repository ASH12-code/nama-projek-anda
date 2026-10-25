/**
 * Logika Modul Pesan Pelanggan (Rombak Bersih dari Nol)
 * File: assets/js/seller-js/chat-pelanggan.js
 */

var conversations = [];
var currentBuyerId = null;
var currentBuyerName = "";
var currentSellerId = null;
var searchKeyword = "";
var chatPollInterval = null;

const API_CHAT_URL = "../../api/seller/manage_chats.php";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchConversations();

  // Buka percakapan pertama secara otomatis jika dibuka di desktop
  if (window.innerWidth > 768 && conversations.length > 0) {
    selectConversation(conversations[0].buyer_id, conversations[0].buyer_name);
  }

  // Polling data pesan setiap 4 detik
  chatPollInterval = setInterval(async () => {
    if (currentBuyerId) {
      await fetchMessages(currentBuyerId, false);
    }
    await fetchConversations(false);
  }, 4000);
});

/**
 * 1. AMBIL DAFTAR ROOM CHAT DARI SERVER
 */
async function fetchConversations(render = true) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${API_CHAT_URL}?action=get_conversations${authQuery}`);
    if (!res.ok) return;

    const result = await res.json();
    if (!result.status) return;

    conversations = result.data || [];
    if (render) renderConversationList();
    updateUnreadCounter();
  } catch (err) {
    console.error("Gagal memuat kontak obrolan:", err);
  }
}

/**
 * 2. RENDER DAFTAR PERCAKAPAN
 */
function renderConversationList() {
  const container = document.getElementById("conversationListContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered = conversations.filter(c =>
    (c.buyer_name || "").toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:20px; color:#64748b; font-size:12px;">Tidak ada obrolan.</p>`;
    return;
  }

  filtered.forEach(item => {
    const isActive = item.buyer_id == currentBuyerId;
    const initial  = (item.buyer_name || "US").substring(0, 2).toUpperCase();

    const row = document.createElement("div");
    row.className = `conv-item ${isActive ? "active" : ""}`;
    row.onclick = () => selectConversation(item.buyer_id, item.buyer_name);

    row.innerHTML = `
      <div class="conv-avatar">${initial}</div>
      <div class="conv-info">
        <div class="conv-header-row">
          <span class="conv-name">${escapeHtml(item.buyer_name)}</span>
          <span class="conv-time">${item.last_time || ''}</span>
        </div>
        <div class="conv-snippet">${escapeHtml(item.last_message || 'Mulai percakapan...')}</div>
      </div>
      ${parseInt(item.unread_count || 0, 10) > 0 ? `<span class="unread-dot-badge">${item.unread_count}</span>` : ''}
    `;
    container.appendChild(row);
  });
}

/**
 * 3. MEMILIH RUANG PERCAKAPAN
 */
async function selectConversation(buyerId, buyerName) {
  currentBuyerId = buyerId;
  currentBuyerName = buyerName;

  const nameEl   = document.getElementById("activeUserName");
  const avatarEl = document.getElementById("activeUserAvatar");
  const linkEl   = document.getElementById("btnCheckOrderLink");

  if (nameEl) nameEl.innerText = buyerName;
  if (avatarEl) avatarEl.innerText = buyerName.substring(0, 2).toUpperCase();
  if (linkEl) linkEl.href = `kelola-pesanan.html?search=${encodeURIComponent(buyerName)}`;

  // Hapus badge unread secara optimistik
  const target = conversations.find(c => c.buyer_id == buyerId);
  if (target) target.unread_count = 0;
  updateUnreadCounter();
  renderConversationList();

  // Buka tampilan penuh di mobile
  if (window.innerWidth <= 768) {
    const frame = document.getElementById("chatCardFrame");
    if (frame) frame.classList.add("mobile-active");
  }

  await fetchMessages(buyerId, true);
}

function closeChatOnMobile() {
  const frame = document.getElementById("chatCardFrame");
  if (frame) frame.classList.remove("mobile-active");
  currentBuyerId = null;
  renderConversationList();
}

/**
 * 4. AMBIL DETAIL PESAN PERCAKAPAN
 */
async function fetchMessages(buyerId, shouldScrollToBottom = false) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${API_CHAT_URL}?action=get_messages&buyer_id=${buyerId}${authQuery}`);
    if (!res.ok) return;

    const result = await res.json();
    if (!result.status) return;

    currentSellerId = result.seller_id;
    renderMessages(result.messages || [], result.related_product);

    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  } catch (err) {
    console.error("Gagal mengambil pesan:", err);
  }
}

function renderMessages(messages, relatedProduct) {
  const container = document.getElementById("messagesScrollBody");
  if (!container) return;
  container.innerHTML = "";

  // Sematan produk pesanan terakhir
  const pinBar = document.getElementById("pinnedProductBar");
  if (pinBar) {
    if (relatedProduct && relatedProduct.product_name) {
      pinBar.style.display = "flex";
      document.getElementById("pinnedProdImg").src = relatedProduct.product_image_url || "https://placehold.co/100x100?text=Produk";
      document.getElementById("pinnedProdTitle").innerText = relatedProduct.product_name;
      document.getElementById("pinnedProdPrice").innerText = "Rp " + new Intl.NumberFormat("id-ID").format(relatedProduct.price_at_purchase || 0);
      document.getElementById("pinnedOrderCode").innerText = relatedProduct.sub_order_number || "ORDER";
    } else {
      pinBar.style.display = "none";
    }
  }

  if (messages.length === 0) {
    container.innerHTML = `<p style="text-align:center; margin:auto; color:#64748b; font-size:12px;">Belum ada riwayat pesan. Kirim pesan pertama Anda kepada ${escapeHtml(currentBuyerName)}.</p>`;
    return;
  }

  messages.forEach(msg => {
    const isOutgoing = msg.sender_id == currentSellerId;
    const row = document.createElement("div");
    row.className = `msg-row ${isOutgoing ? "outgoing" : "incoming"}`;

    row.innerHTML = `
      <div class="msg-bubble">${escapeHtml(msg.message)}</div>
      <span class="msg-time">${msg.created_at_formatted}</span>
    `;
    container.appendChild(row);
  });
}

/**
 * 5. KIRIM PESAN
 */
async function handleSendSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("chatInputMessage");
  if (!input) return;

  const text = input.value.trim();
  if (!text || !currentBuyerId) return;

  input.value = "";
  const container = document.getElementById("messagesScrollBody");
  if (container) {
    const tempRow = document.createElement("div");
    tempRow.className = "msg-row outgoing";
    tempRow.innerHTML = `
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <span class="msg-time">Mengirim...</span>
    `;
    container.appendChild(tempRow);
    scrollToBottom();
  }

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${API_CHAT_URL}?action=send_message${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: currentBuyerId,
        message: text
      })
    });
    const result = await res.json();

    if (result.status) {
      await fetchMessages(currentBuyerId, true);
      await fetchConversations(true);
    }
  } catch (err) {
    console.error("Gagal mengirim pesan:", err);
  }
}

function handleInputKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendSubmit();
  }
}

function scrollToBottom() {
  const container = document.getElementById("messagesScrollBody");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function updateUnreadCounter() {
  const total = conversations.reduce((sum, c) => sum + parseInt(c.unread_count || 0, 10), 0);
  if (typeof applyBadgeCounts === "function") {
    applyBadgeCounts(".badge-slot-chats", total);
  }
}

function handleSearchBuyer() {
  const input = document.getElementById("buyerSearchInput");
  searchKeyword = input ? input.value.trim() : "";
  renderConversationList();
}

function insertQuickReply(text) {
  const input = document.getElementById("chatInputMessage");
  if (!input) return;
  input.value = text;
  input.focus();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}