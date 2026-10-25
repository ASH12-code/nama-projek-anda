/**
 * Logika Simulasi Pembayaran Virtual Account (VA) & Sinkronisasi Pesanan
 * File: assets/js/buyer-js/va.js
 */

let activeOrder = null;
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let countdownTimer = null;
let secondsRemaining = 5;

document.addEventListener("DOMContentLoaded", () => {
  const sessionData = sessionStorage.getItem("activeOrderSession");

  if (!sessionData) {
    if (typeof showToast === "function") {
      showToast("Data transaksi tidak ditemukan. Mengalihkan...", "warning");
    }
    setTimeout(() => {
      window.location.href = "pesanan-saya.html?tab=belum_bayar";
    }, 1500);
    return;
  }

  activeOrder = JSON.parse(sessionData);

  const urlParams = new URLSearchParams(window.location.search);
  const bank = (urlParams.get("bank") || "BCA").toUpperCase();

  const bankTitle = document.getElementById("bankNameDisplay");
  if (bankTitle) {
    bankTitle.innerText = `${bank} Virtual Account`;
  }

  const vaNumberEl = document.getElementById("vaNumberDisplay");
  if (vaNumberEl) {
    vaNumberEl.innerText = formatVaNumber(activeOrder.va_number || generateDummyVa(bank));
  }

  const totalDisplay = document.getElementById("vaGrandTotal");
  if (totalDisplay) {
    totalDisplay.innerText = `Rp ${Number(activeOrder.grand_total || 0).toLocaleString("id-ID")}`;
  }

  startCountdownDetection();
});

function formatVaNumber(va) {
  const str = String(va).replace(/\s+/g, "");
  return str.match(/.{1,4}/g)?.join(" ") || str;
}

function generateDummyVa(bank) {
  const prefix = bank === "MANDIRI" ? "8900" : bank === "BRI" ? "8801" : "8800";
  return prefix + Math.floor(1000000000 + Math.random() * 9000000000);
}

function startCountdownDetection() {
  const countdownEl = document.getElementById("countdownText");

  countdownTimer = setInterval(() => {
    secondsRemaining--;

    if (countdownEl) {
      countdownEl.innerText = `${secondsRemaining} detik`;
    }

    if (secondsRemaining <= 0) {
      clearInterval(countdownTimer);
      processVaPaymentSuccess();
    }
  }, 1000);
}

async function processVaPaymentSuccess() {
  if (!activeOrder) return;

  const timerNotice = document.getElementById("timerNotice");
  if (timerNotice) {
    timerNotice.innerHTML = `<span>⏳</span><span>Memproses mutasi rekening...</span>`;
  }

  const userId = currentUser ? currentUser.user_id : 12;

  try {
    const res = await fetch("/on-shop/api/buyer/orders.php?action=pay_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        master_order_id: activeOrder.master_order_id,
        user_id: userId
      })
    });

    const result = await res.json();

    if (result.status) {
      sessionStorage.removeItem("activeOrderSession");
      const modal = document.getElementById("paymentSuccessModal");
      if (modal) {
        modal.classList.remove("hidden");
      } else {
        redirectToOrders();
      }
    } else {
      sessionStorage.removeItem("activeOrderSession");
      redirectToOrders();
    }
  } catch (err) {
    console.error("Koneksi gagal saat update pembayaran VA:", err);
    sessionStorage.removeItem("activeOrderSession");
    redirectToOrders();
  }
}

function redirectToOrders() {
  window.location.href = "pesanan-saya.html?tab=dikemas";
}

window.redirectToOrders = redirectToOrders;