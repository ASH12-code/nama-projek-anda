/**
 * Logika Dompet & Penarikan Saldo Toko (Form Utility Tanpa Sidebar)
 * File: assets/js/seller-js/tarik-saldo.js
 */

var currentBalance = 0;
var adminFee = 2000;
var currentBankData = null;
var pendingWithdrawPayload = null;
var toastTimeout = null;

const WALLET_API = "../../api/seller/manage_wallet.php";

document.addEventListener("DOMContentLoaded", async () => {
  await loadWalletData();
});

// Tombol Kembali ke Dasbor
function handleGoBack() {
  if (document.referrer && document.referrer.includes("/seller/")) {
    window.history.back();
  } else {
    window.location.href = "dashbord-toko.html";
  }
}

// Toast Notifikasi
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  if (iconEl) iconEl.innerText = (type === "success") ? "✓" : "✕";

  toast.className = `toast-box toast-show ${type === "success" ? "toast-success" : "toast-error"}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 2800);
}

function formatRupiah(num) {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

// Ambil Data Dompet dari Backend
async function loadWalletData() {
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${WALLET_API}?action=get_wallet${authQuery}`);
    if (!res.ok) return;

    const result = await res.json();
    if (!result.status) return;

    currentBalance = Number(result.available_balance || 0);
    adminFee       = Number(result.admin_fee || 2000);

    // 1. Render Kartu Saldo
    const availEl  = document.getElementById("availableBalanceDisplay");
    const escrowEl = document.getElementById("escrowBalanceDisplay");
    if (availEl)  availEl.innerText  = formatRupiah(currentBalance);
    if (escrowEl) escrowEl.innerText = formatRupiah(result.escrow_balance || 0);

    // 2. Render Info Rekening Bank
    if (result.bank_accounts && result.bank_accounts.length > 0) {
      currentBankData = result.bank_accounts[0];
      const pBankName   = document.getElementById("primaryBankName");
      const pBankNum    = document.getElementById("primaryBankNumber");
      const pBankHolder = document.getElementById("primaryBankHolder");

      if (pBankName)   pBankName.innerText = currentBankData.bank;
      if (pBankNum)    pBankNum.innerText  = `${currentBankData.number}`;
      if (pBankHolder) pBankHolder.innerText = `a.n ${currentBankData.holder}`;

      const holderInput = document.getElementById("newAccountHolder");
      if (holderInput && !holderInput.value) holderInput.value = currentBankData.holder;
    }

    // 3. Render Riwayat Mutasi Dompet
    renderHistoryTable(result.history || []);
    calculateWithdrawSummary();

  } catch (err) {
    console.error("Gagal memuat dompet toko:", err);
    showToast("Terjadi gangguan koneksi data dompet", "error");
  }
}

// Hitung Ringkasan Dana Diterima Secara Realtime
function calculateWithdrawSummary() {
  const inputEl = document.getElementById("withdrawAmount");
  const netDisplay = document.getElementById("netAmountDisplay");
  if (!inputEl || !netDisplay) return;

  const amount = Number(inputEl.value || 0);
  const net = Math.max(0, amount - adminFee);
  netDisplay.innerText = formatRupiah(amount >= 50000 ? net : 0);
}

function setWithdrawAmount(val) {
  const input = document.getElementById("withdrawAmount");
  if (input) {
    input.value = val;
    calculateWithdrawSummary();
  }
}

function setWithdrawAll() {
  const input = document.getElementById("withdrawAmount");
  if (input) {
    input.value = Math.max(0, currentBalance);
    calculateWithdrawSummary();
  }
}

// Render Tabel Riwayat Transaksi
function renderHistoryTable(historyList) {
  const tbody = document.getElementById("withdrawHistoryBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (historyList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:18px; color:#64748b;">Belum ada riwayat transaksi dompet.</td></tr>`;
    return;
  }

  historyList.forEach((row) => {
    const tr = document.createElement("tr");

    let statusClass = "tag-success";
    const st = (row.status || "SUCCESS").toUpperCase();
    if (st === "DIPROSES") statusClass = "tag-process";
    if (st === "DITOLAK")  statusClass = "tag-rejected";

    const isWithdraw = row.transaction_type === "WITHDRAW" || row.amount < 0;
    const typeLabel = isWithdraw ? "Penarikan Bank" : "Pemasukan Toko";
    const typeClass = isWithdraw ? "tag-withdraw" : "tag-income";
    const nominalSign = isWithdraw ? "- " : "+ ";
    const nominalColor = isWithdraw ? "#ef4444" : "#2e8b57";

    tr.innerHTML = `
      <td>${row.date_formatted}</td>
      <td><span class="badge-tag ${typeClass}">${typeLabel}</span></td>
      <td>${escapeHtml(row.bank_info || row.transaction_code)}</td>
      <td style="color:${nominalColor}; font-weight:bold;">${nominalSign}${formatRupiah(row.amount)}</td>
      <td><span class="badge-tag ${statusClass}">${st}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Handle Form Submit Penarikan
function handleWithdrawSubmit(e) {
  e.preventDefault();
  const inputEl = document.getElementById("withdrawAmount");
  const amount = Number(inputEl.value || 0);

  if (amount < 50000) {
    showToast("Nominal penarikan minimal adalah Rp 50.000!", "error");
    return;
  }
  if (amount > currentBalance) {
    showToast(`Saldo tidak cukup! Saldo Anda: ${formatRupiah(currentBalance)}`, "error");
    return;
  }

  const bankInfoText = currentBankData 
    ? `${currentBankData.bank} (${currentBankData.number} a.n ${currentBankData.holder})`
    : "Rekening Terdaftar";

  pendingWithdrawPayload = {
    amount: amount,
    bank_info: bankInfoText
  };

  const modal = document.getElementById("confirmWithdrawModal");
  const detailBox = document.getElementById("confirmWithdrawDetails");
  const execBtn = document.getElementById("btnExecuteWithdraw");

  if (modal && detailBox && execBtn) {
    const netReceived = amount - adminFee;
    detailBox.innerHTML = `
      <div><strong>Tujuan Transfer:</strong> ${escapeHtml(bankInfoText)}</div>
      <div><strong>Nominal Penarikan:</strong> ${formatRupiah(amount)}</div>
      <div><strong>Biaya Admin:</strong> ${formatRupiah(adminFee)}</div>
      <div style="margin-top:6px; border-top:1px dashed #cbd5e1; padding-top:4px;">
        <strong>Total Dana Masuk Rekening:</strong> <span style="color:#2e8b57; font-weight:bold;">${formatRupiah(netReceived)}</span>
      </div>
    `;
    execBtn.onclick = executeWithdraw;
    modal.style.display = "flex";
  }
}

function closeConfirmWithdrawModal() {
  const modal = document.getElementById("confirmWithdrawModal");
  if (modal) modal.style.display = "none";
  pendingWithdrawPayload = null;
}

async function executeWithdraw() {
  if (!pendingWithdrawPayload) return;
  const payload = pendingWithdrawPayload;
  closeConfirmWithdrawModal();

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  const submitBtn = document.getElementById("btnSubmitWithdraw");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Memproses...";
  }

  try {
    const res = await fetch(`${WALLET_API}?action=submit_withdraw${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Pengajuan penarikan berhasil dikirim!", "success");
      const inputEl = document.getElementById("withdrawAmount");
      if (inputEl) inputEl.value = "";
      await loadWalletData();
    } else {
      showToast(result.message || "Gagal mengajukan penarikan.", "error");
    }
  } catch (err) {
    console.error("Gagal penarikan:", err);
    showToast("Terjadi kendala jaringan", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Tarik Saldo Sekarang";
    }
  }
}

// Modal Ubah Rekening Bank
function openAddBankModal() {
  const modal = document.getElementById("addBankModal");
  if (modal) modal.style.display = "flex";
}

function closeAddBankModal() {
  const modal = document.getElementById("addBankModal");
  if (modal) modal.style.display = "none";
}

async function handleSaveNewBank(e) {
  e.preventDefault();
  const bankName = document.getElementById("newBankSelect").value;
  const accNum   = document.getElementById("newAccountNumber").value.trim();
  const accHold  = document.getElementById("newAccountHolder").value.trim();

  if (!accNum || !accHold) {
    showToast("Nomor rekening dan nama pemilik wajib diisi!", "error");
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${WALLET_API}?action=save_bank_account${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bank_name: bankName,
        account_number: accNum,
        account_holder: accHold
      })
    });

    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Rekening berhasil diperbarui!", "success");
      closeAddBankModal();
      await loadWalletData();
    } else {
      showToast(result.message || "Gagal memperbarui rekening", "error");
    }
  } catch (err) {
    console.error("Gagal simpan rekening:", err);
    showToast("Terjadi kendala jaringan", "error");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}