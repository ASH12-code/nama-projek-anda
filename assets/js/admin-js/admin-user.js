/**
 * Logika Super Admin: Manajemen Pembeli & Akun Pengguna (Database Connected)
 * Menggabungkan Patch Bug 2 (Credentials) & Bug 6 (Integritas Riwayat Belanja)
 * File: assets/js/admin-js/admin-user.js
 */

const GET_USERS_API = "../../api/admin/get_users.php";
const UPDATE_USER_API = "../../api/admin/update_user_status.php";

let usersData = [];
let currentTabFilter = "all";
let targetUserId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadUsersFromDatabase();
});

// =========================================================
// A. Mengambil Data Nyata Pengguna dari Database MySQL
// =========================================================
async function loadUsersFromDatabase() {
  try {
    const response = await fetch(GET_USERS_API, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });
    const result = await response.json();

    if (result.status && Array.isArray(result.data)) {
      usersData = result.data;
      updateTabCounters();
      renderUserTable();
    } else {
      showToast(result.message || "Gagal memuat data pengguna.", "error");
    }
  } catch (err) {
    showToast("Kendala koneksi saat memuat data pengguna.", "error");
  }
}

// =========================================================
// B. Tab Filter & Penghitung
// =========================================================
function switchUserTab(tabKey, btnEl) {
  currentTabFilter = tabKey;
  document.querySelectorAll(".tab-btn-pill").forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");
  renderUserTable();
}

function updateTabCounters() {
  const allCount = usersData.length;
  const buyerOnlyCount = usersData.filter((u) => u.has_shop === 0 && u.is_banned === 0).length;
  const hasShopCount = usersData.filter((u) => u.has_shop === 1 && u.is_banned === 0).length;
  const bannedCount = usersData.filter((u) => u.is_banned === 1).length;

  document.getElementById("countAll").innerText = allCount;
  document.getElementById("countBuyerOnly").innerText = buyerOnlyCount;
  document.getElementById("countHasShop").innerText = hasShopCount;
  document.getElementById("countBanned").innerText = bannedCount;
}

// =========================================================
// C. Render Tabel Pengguna & Pencarian Cerdas
// =========================================================
function renderUserTable() {
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = document.getElementById("userSearchInput").value.trim().toLowerCase();

  let filtered = usersData;
  if (currentTabFilter === "buyer_only") {
    filtered = filtered.filter((u) => u.has_shop === 0 && u.is_banned === 0);
  } else if (currentTabFilter === "has_shop") {
    filtered = filtered.filter((u) => u.has_shop === 1 && u.is_banned === 0);
  } else if (currentTabFilter === "banned") {
    filtered = filtered.filter((u) => u.is_banned === 1);
  }

  if (query) {
    filtered = filtered.filter((u) => {
      const matchName = (u.name || "").toLowerCase().includes(query);
      const matchUserCode = (u.user_code || "").toLowerCase().includes(query);
      const matchUserId = String(u.user_id || "").toLowerCase().includes(query);
      const matchEmail = (u.email || "").toLowerCase().includes(query);
      const matchPhone = (u.phone || "").toLowerCase().includes(query);

      return matchName || matchUserCode || matchUserId || matchEmail || matchPhone;
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 25px;">Tidak ditemukan data pengguna yang cocok.</td></tr>`;
    return;
  }

  filtered.forEach((u) => {
    const tr = document.createElement("tr");

    const initial = (u.name || "U").charAt(0).toUpperCase();
    const avatarHtml = u.avatar_url
      ? `<img src="${u.avatar_url}" alt="${escapeHtml(u.name)}" onerror="this.src='https://placehold.co/100x100?text=${initial}'"/>`
      : initial;

    const roleBadge = u.has_shop === 1 ? `<span class="badge-seller-role">+ Seller</span>` : "";
    const statusPill =
      u.is_banned === 1
        ? `<span class="status-pill danger">Diblokir</span>`
        : `<span class="status-pill success">Aktif</span>`;

    tr.innerHTML = `
      <td>
        <div class="user-info-cell">
          <div class="user-avatar-circle">${avatarHtml}</div>
          <div>
            <strong>${escapeHtml(u.name)}</strong> ${roleBadge}<br/>
            <small style="color: #64748b;">${escapeHtml(u.user_code)} (ID: ${u.user_id})</small>
          </div>
        </div>
      </td>
      <td>
        <span>${escapeHtml(u.email || "-")}</span><br/>
        <small style="color: #64748b;">${escapeHtml(u.phone || "-")}</small>
      </td>
      <td><strong>${u.total_orders}</strong> Pesanan</td>
      <td><strong>${formatRupiah(u.total_spent)}</strong></td>
      <td>${u.created_at}</td>
      <td>${statusPill}</td>
      <td style="text-align: right;">
        <button class="btn-table-action inspect" onclick="openOrderHistory(${u.user_id})">📦 Riwayat</button>
        ${
          u.is_banned === 1
            ? `<button class="btn-table-action unban" onclick="unbanUser(${u.user_id})">🔓 Buka Blokir</button>`
            : `<button class="btn-table-action ban" onclick="openBanModal(${u.user_id})">🚫 Blokir</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================================================
// D. Modal Riwayat Belanja (Penanganan Array Orders MySQL)
// =========================================================
function openOrderHistory(userId) {
  const user = usersData.find((u) => u.user_id === userId);
  if (!user) return;

  const titleEl = document.getElementById("orderHistorySubTitle");
  if (titleEl) {
    titleEl.innerText = `Daftar transaksi pesanan dari ${user.name} (${user.user_code || "USR"})`;
  }

  const tbody = document.getElementById("orderHistoryTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const orderList = Array.isArray(user.orders) ? user.orders : [];

  if (orderList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 22px;">Pengguna ini belum pernah melakukan transaksi checkout belanja.</td></tr>`;
  } else {
    orderList.forEach((o) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><code>${escapeHtml(o.invoice_number)}</code></td>
        <td>${escapeHtml(o.recipient_info || "-")}</td>
        <td><strong style="color: #2e8b57;">${formatRupiah(o.grand_total)}</strong></td>
        <td>${escapeHtml(o.order_date || "-")}</td>
      `;
      tbody.appendChild(row);
    });
  }

  document.getElementById("orderHistoryModal").classList.remove("hidden");
}

function closeOrderHistoryModal() {
  document.getElementById("orderHistoryModal").classList.add("hidden");
}

// =========================================================
// E. Modal Blokir Akun Pengguna
// =========================================================
function openBanModal(userId) {
  targetUserId = userId;
  const user = usersData.find((u) => u.user_id === userId);
  if (!user) return;

  document.getElementById("banUserLabel").innerText = `Akun "${user.name}" (${user.user_code}) akan dinonaktifkan dari sistem.`;
  document.getElementById("banReasonInput").value = "";
  document.getElementById("banUserModal").classList.remove("hidden");
}

function closeBanModal() {
  document.getElementById("banUserModal").classList.add("hidden");
}

async function executeBanUser() {
  const reason = document.getElementById("banReasonInput").value.trim();
  if (!reason) {
    showToast("Harap isi alasan pemblokiran akun!", "warning");
    return;
  }

  await sendUserAction({
    user_id: targetUserId,
    action: "ban",
    reason: reason
  });
  closeBanModal();
}

async function unbanUser(userId) {
  await sendUserAction({
    user_id: userId,
    action: "unban"
  });
}

async function sendUserAction(payload) {
  try {
    const res = await fetch(UPDATE_USER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      await loadUsersFromDatabase();
    } else {
      showToast(result.message || "Gagal memproses aksi.", "error");
    }
  } catch (err) {
    showToast("Terjadi kendala saat menghubungi server.", "error");
  }
}

function filterUserTable() {
  renderUserTable();
}

// =========================================================
// F. Utilitas & Toast
// =========================================================
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.className = "toast-box";

  if (type === "error") {
    toast.classList.add("toast-error");
    if (iconEl) iconEl.innerText = "✕";
  } else if (type === "warning") {
    toast.classList.add("toast-warning");
    if (iconEl) iconEl.innerText = "⚠";
  } else {
    toast.classList.add("toast-success");
    if (iconEl) iconEl.innerText = "✓";
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function formatRupiah(num) {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}