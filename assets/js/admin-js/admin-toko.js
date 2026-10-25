/**
 * Logika Super Admin: Manajemen Toko & Verifikasi Merchant (Database Connected)
 * File: assets/js/admin-js/admin-toko.js
 */

const GET_MERCHANTS_API = "../../api/admin/get_merchants.php";
const UPDATE_MERCHANT_API = "../../api/admin/update_merchant_status.php";

let merchantsData = [];
let currentTabFilter = "all";
let targetShopId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadMerchantsFromDatabase();
});

// A. Mengambil Data Toko Nyata dari Database MySQL
async function loadMerchantsFromDatabase() {
  try {
    const response = await fetch(GET_MERCHANTS_API, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });
    const result = await response.json();

    if (result.status && Array.isArray(result.data)) {
      merchantsData = result.data;
      updateTabCounters();
      renderMerchantTable();
    } else {
      showToast(result.message || "Gagal memuat data toko.", "error");
    }
  } catch (err) {
    showToast("Kendala koneksi ke server API.", "error");
  }
}

// B. Tab Filter & Penghitung
function switchMerchantTab(statusKey, btnEl) {
  currentTabFilter = statusKey;
  document.querySelectorAll(".tab-btn-pill").forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");
  renderMerchantTable();
}

function updateTabCounters() {
  const allCount = merchantsData.length;
  const pendingCount = merchantsData.filter((m) => m.status === "pending").length;
  const verifiedCount = merchantsData.filter((m) => m.status === "verified").length;
  const suspendedCount = merchantsData.filter((m) => m.status === "suspended").length;

  document.getElementById("countAll").innerText = allCount;
  document.getElementById("countPending").innerText = pendingCount;
  document.getElementById("countVerified").innerText = verifiedCount;
  document.getElementById("countSuspended").innerText = suspendedCount;

  const badge = document.getElementById("badgePendingShops");
  if (badge) {
    badge.innerText = pendingCount;
    badge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }
}

// C. Render Tabel Toko
function renderMerchantTable() {
  const tbody = document.getElementById("merchantTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = document.getElementById("merchantSearchInput").value.trim().toLowerCase();

  let filtered = merchantsData;
  if (currentTabFilter !== "all") {
    filtered = filtered.filter((m) => m.status === currentTabFilter);
  }
  if (query) {
    filtered = filtered.filter(
      (m) =>
        m.shop_name.toLowerCase().includes(query) ||
        m.owner_name.toLowerCase().includes(query) ||
        m.city.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 25px;">Tidak ditemukan data toko pada kategori ini.</td></tr>`;
    return;
  }

  filtered.forEach((m) => {
    const tr = document.createElement("tr");

    let statusPill = "";
    if (m.status === "verified") statusPill = `<span class="status-pill success">Aktif Beroperasi</span>`;
    else if (m.status === "pending") statusPill = `<span class="status-pill pending">Menunggu Verifikasi</span>`;
    else if (m.status === "suspended") statusPill = `<span class="status-pill danger">Dibekukan</span>`;
    else if (m.status === "rejected") statusPill = `<span class="status-pill danger">Ditolak</span>`;

    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(m.shop_name)}</strong>
        ${m.is_official ? '<span class="badge-official">Official Mall</span>' : m.status === 'verified' ? '<span class="badge-verified-store">Verified</span>' : ''}
      </td>
      <td>${escapeHtml(m.owner_name)}</td>
      <td>${escapeHtml(m.city)}</td>
      <td><strong>${m.active_products}</strong> Produk</td>
      <td>⭐ ${m.rating > 0 ? m.rating.toFixed(1) : '-'}</td>
      <td>${statusPill}</td>
      <td style="text-align: right;">
        ${renderActionButtons(m)}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderActionButtons(m) {
  let buttons = "";

  if (m.status === "pending") {
    buttons += `<button class="btn-table-action inspect" onclick="openApprovalModal(${m.shop_id})">🔍 Periksa Berkas</button>`;
  }

  if (m.status === "verified") {
    buttons += `<button class="btn-table-action official" onclick="toggleOfficialBadge(${m.shop_id})">
      ${m.is_official ? 'Hapus Official' : '★ Set Official'}
    </button>`;
    buttons += `<button class="btn-table-action suspend" onclick="openSuspendModal(${m.shop_id})">🚫 Bekukan</button>`;
  }

  if (m.status === "suspended") {
    buttons += `<button class="btn-table-action unsuspend" onclick="unsuspendStore(${m.shop_id})">🔓 Buka Blokir</button>`;
  }

  return buttons;
}

// D. Modal Verifikasi Berkas (Approval)
function openApprovalModal(shopId) {
  targetShopId = shopId;
  const shop = merchantsData.find((m) => m.shop_id === shopId);
  if (!shop) return;

  document.getElementById("modalShopName").innerText = shop.shop_name;
  document.getElementById("modalOwnerName").innerText = shop.owner_name;
  document.getElementById("modalShopPhone").innerText = shop.phone;
  document.getElementById("modalShopCity").innerText = shop.city;
  document.getElementById("modalShopBank").innerText = shop.bank_account;
  document.getElementById("modalKtpImage").src = shop.ktp_image;

  document.getElementById("rejectReasonBox").classList.add("hidden");
  document.getElementById("btnShowRejectBox").innerText = "Tolak Berkas";
  document.getElementById("approvalModal").classList.remove("hidden");
}

function closeApprovalModal() {
  document.getElementById("approvalModal").classList.add("hidden");
}

async function confirmApproveStore() {
  await sendMerchantAction({
    shop_id: targetShopId,
    action: "approve"
  });
  closeApprovalModal();
}

function showRejectInput() {
  const box = document.getElementById("rejectReasonBox");
  if (box.classList.contains("hidden")) {
    box.classList.remove("hidden");
    document.getElementById("btnShowRejectBox").innerText = "Kirim Penolakan";
  } else {
    const reason = document.getElementById("rejectReasonInput").value.trim();
    if (!reason) {
      showToast("Silakan isi alasan penolakan!", "warning");
      return;
    }
    sendMerchantAction({
      shop_id: targetShopId,
      action: "reject",
      reason: reason
    });
    closeApprovalModal();
  }
}

// E. Toggle Official Mall Badge
async function toggleOfficialBadge(shopId) {
  await sendMerchantAction({
    shop_id: shopId,
    action: "toggle_official"
  });
}

// F. Modal Suspend Toko
function openSuspendModal(shopId) {
  targetShopId = shopId;
  const shop = merchantsData.find((m) => m.shop_id === shopId);
  if (!shop) return;

  document.getElementById("suspendShopLabel").innerText = `Toko "${shop.shop_name}" akan dinonaktifkan dari katalog pasar.`;
  document.getElementById("suspendReasonInput").value = "";
  document.getElementById("suspendModal").classList.remove("hidden");
}

function closeSuspendModal() {
  document.getElementById("suspendModal").classList.add("hidden");
}

function toggleSuspendDuration(isTemp) {
  const selBox = document.getElementById("durationSelectBox");
  if (isTemp) selBox.classList.remove("hidden");
  else selBox.classList.add("hidden");
}

async function executeSuspendStore() {
  const type = document.querySelector('input[name="suspendType"]:checked').value;
  const days = document.getElementById("suspendDurationSelect").value;
  const reason = document.getElementById("suspendReasonInput").value.trim();

  if (!reason) {
    showToast("Harap berikan alasan pembekuan operasional toko!", "warning");
    return;
  }

  await sendMerchantAction({
    shop_id: targetShopId,
    action: "suspend",
    type: type,
    days: days,
    reason: reason
  });
  closeSuspendModal();
}

async function unsuspendStore(shopId) {
  await sendMerchantAction({
    shop_id: shopId,
    action: "unsuspend"
  });
}

// G. Kirim Mutasi Status ke Backend Database
async function sendMerchantAction(payload) {
  try {
    const res = await fetch(UPDATE_MERCHANT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      await loadMerchantsFromDatabase();
    } else {
      showToast(result.message || "Gagal memproses aksi.", "error");
    }
  } catch (err) {
    showToast("Terjadi kendala saat menghubungi server.", "error");
  }
}

function filterMerchantTable() {
  renderMerchantTable();
}

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

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}