/**
 * Logika Super Admin: Keuangan & Payout Merchant (Database Connected)
 * Menggabungkan Patch Bug 2 (Credentials) & Bug 3 (Integritas Enum Mutasi MySQL)
 * File: assets/js/admin-js/admin-keuangan.js
 */

const GET_FINANCE_API = "../../api/admin/get_finance_overview.php";
const PROCESS_PAYOUT_API = "../../api/admin/process_payout.php";

let withdrawalsData = [];
let mutationsData = [];
let currentTabFilter = "all";
let targetWithdrawalId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadFinanceOverview();
});

// =========================================================
// A. Mengambil Data Nyata Keuangan dari Database
// =========================================================
async function loadFinanceOverview() {
  try {
    const response = await fetch(GET_FINANCE_API, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });
    const result = await response.json();

    if (result.status && result.data) {
      const d = result.data;
      
      // Pasang Kartu KPI Nyata
      document.getElementById("metricEscrowText").innerText = formatRupiah(d.kpi.escrow_total);
      document.getElementById("metricCommissionText").innerText = formatRupiah(d.kpi.commission_total);
      document.getElementById("metricPendingAmountText").innerText = formatRupiah(d.kpi.pending_amount);
      document.getElementById("metricPendingCountText").innerText = `${d.kpi.pending_count} Permintaan Toko`;
      document.getElementById("metricSuccessPayoutText").innerText = formatRupiah(d.kpi.success_amount);

      withdrawalsData = d.withdrawals || [];
      mutationsData = d.mutations || [];

      updateTabCounters();
      renderPayoutTable();
    } else {
      showToast(result.message || "Gagal memuat data keuangan.", "error");
    }
  } catch (err) {
    showToast("Kendala koneksi saat memuat data keuangan.", "error");
  }
}

// =========================================================
// B. Tab Filter & Penghitung Status Payout
// =========================================================
function switchPayoutTab(statusKey, btnEl) {
  currentTabFilter = statusKey;
  document.querySelectorAll(".tab-btn-pill").forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");
  renderPayoutTable();
}

function updateTabCounters() {
  const allCount = withdrawalsData.length;
  const pendingCount = withdrawalsData.filter((w) => w.status === "PENDING").length;
  const successCount = withdrawalsData.filter((w) => w.status === "SUCCESS").length;
  const rejectedCount = withdrawalsData.filter((w) => w.status === "REJECTED").length;

  document.getElementById("countAll").innerText = allCount;
  document.getElementById("countPending").innerText = pendingCount;
  document.getElementById("countSuccess").innerText = successCount;
  document.getElementById("countRejected").innerText = rejectedCount;

  // Sinkronkan badge angka di sidebar admin
  const badge = document.getElementById("badgePendingPayouts");
  if (badge) {
    badge.innerText = pendingCount;
    badge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }
}

// =========================================================
// C. Render Tabel Antrean Payout
// =========================================================
function renderPayoutTable() {
  const tbody = document.getElementById("payoutTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = document.getElementById("payoutSearchInput").value.trim().toLowerCase();

  let filtered = withdrawalsData;
  if (currentTabFilter !== "all") {
    filtered = filtered.filter((w) => w.status === currentTabFilter);
  }

  if (query) {
    filtered = filtered.filter(
      (w) =>
        (w.shop_name || "").toLowerCase().includes(query) ||
        (w.bank_name || "").toLowerCase().includes(query) ||
        (w.bank_account_number || "").toLowerCase().includes(query) ||
        String(w.withdrawal_id).includes(query)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 25px;">Tidak ditemukan data penarikan.</td></tr>`;
    return;
  }

  filtered.forEach((w) => {
    const tr = document.createElement("tr");

    let statusPill = "";
    if (w.status === "PENDING") statusPill = `<span class="status-pill pending">Menunggu Transfer</span>`;
    else if (w.status === "SUCCESS") statusPill = `<span class="status-pill success">Berhasil Ditransfer</span>`;
    else if (w.status === "REJECTED") statusPill = `<span class="status-pill danger">Ditolak</span>`;

    tr.innerHTML = `
      <td><code>#WD-${w.withdrawal_id}</code></td>
      <td><strong>${escapeHtml(w.shop_name)}</strong></td>
      <td>
        <strong>${escapeHtml(w.bank_name)}</strong> - ${escapeHtml(w.bank_account_number)}
      </td>
      <td><strong style="color: #2e8b57;">${formatRupiah(w.amount)}</strong></td>
      <td>${w.created_at}</td>
      <td>${statusPill}</td>
      <td style="text-align: right;">
        ${
          w.status === "PENDING"
            ? `<button class="btn-table-action process" onclick="openProcessModal(${w.withdrawal_id})">⚡ Proses Payout</button>`
            : `<span style="color: #94a3b8; font-size: 12px;">Selesai</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================================================
// D. Modal Proses & Verifikasi Payout
// =========================================================
function openProcessModal(id) {
  targetWithdrawalId = id;
  const w = withdrawalsData.find((item) => item.withdrawal_id === id);
  if (!w) return;

  document.getElementById("modalShopName").innerText = w.shop_name;
  document.getElementById("modalAmount").innerText = formatRupiah(w.amount);
  document.getElementById("modalBankName").innerText = w.bank_name;
  document.getElementById("modalBankAccount").innerText = w.bank_account_number;

  document.getElementById("rejectReasonBox").classList.add("hidden");
  document.getElementById("btnRejectPayout").innerText = "Tolak";
  document.getElementById("processPayoutModal").classList.remove("hidden");
}

function closeProcessModal() {
  document.getElementById("processPayoutModal").classList.add("hidden");
}

async function handleApprovePayout() {
  await sendPayoutAction({
    withdrawal_id: targetWithdrawalId,
    action: "approve"
  });
  closeProcessModal();
}

function handleRejectClick() {
  const reasonBox = document.getElementById("rejectReasonBox");
  if (reasonBox.classList.contains("hidden")) {
    reasonBox.classList.remove("hidden");
    document.getElementById("btnRejectPayout").innerText = "Konfirmasi Tolak";
  } else {
    const reason = document.getElementById("rejectReasonInput").value.trim();
    if (!reason) {
      showToast("Harap isi alasan penolakan payout!", "warning");
      return;
    }

    sendPayoutAction({
      withdrawal_id: targetWithdrawalId,
      action: "reject",
      reason: reason
    });
    closeProcessModal();
  }
}

async function sendPayoutAction(payload) {
  try {
    const res = await fetch(PROCESS_PAYOUT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      await loadFinanceOverview();
    } else {
      showToast(result.message || "Gagal memproses payout.", "error");
    }
  } catch (err) {
    showToast("Terjadi kendala saat menghubungi server.", "error");
  }
}

// =========================================================
// E. Modal Mutasi Kas Global (Sinkron Penuh MySQL Enum)
// =========================================================
function openMutationLogsModal() {
  const tbody = document.getElementById("mutationTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (mutationsData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:18px; color:#64748b;">Belum ada riwayat mutasi kas.</td></tr>`;
  } else {
    mutationsData.forEach((m) => {
      const tr = document.createElement("tr");

      let typePill = `<span class="status-pill success">Pemasukan</span>`;
      let sign = "+";
      let color = "#2e8b57";

      if (m.type === "WITHDRAW") {
        typePill = `<span class="status-pill pending">Penarikan (Payout)</span>`;
        sign = "-";
        color = "#ea580c";
      } else if (m.type === "REFUND") {
        typePill = `<span class="status-pill danger">Pengembalian (Refund)</span>`;
        sign = "+";
        color = "#2563eb";
      } else if (m.type === "INCOME_SALES") {
        typePill = `<span class="status-pill success">Penjualan Toko</span>`;
        sign = "+";
        color = "#2e8b57";
      }

      tr.innerHTML = `
        <td>${m.created_at}</td>
        <td><strong>${escapeHtml(m.entity_name || m.shop_name || "Akun")}</strong></td>
        <td>${typePill}</td>
        <td><strong style="color: ${color}; font-size: 13px;">${sign}${formatRupiah(m.amount)}</strong></td>
        <td>${escapeHtml(m.description)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("mutationLogsModal").classList.remove("hidden");
}

function closeMutationLogsModal() {
  document.getElementById("mutationLogsModal").classList.add("hidden");
}

function filterPayoutTable() {
  renderPayoutTable();
}

// =========================================================
// F. Utilitas & Toast Notifikasi
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