/**
 * Logika Simulasi Pembayaran QRIS & Sinkronisasi Pesanan
 * File: assets/js/buyer-js/qris.js
 */

let activeOrder = null;
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

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

  const totalDisplay = document.getElementById("qrisGrandTotal");
  if (totalDisplay) {
    totalDisplay.innerText = `Rp ${Number(activeOrder.grand_total || 0).toLocaleString("id-ID")}`;
  }

  const qrisImg = document.getElementById("qrisImgDisplay");
  if (qrisImg) {
    const qrPayload = `ONSHOP_INV_${activeOrder.invoice_number || Date.now()}_TOTAL_${activeOrder.grand_total}`;
    qrisImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;
  }
});

async function handlePaySuccess() {
  if (!activeOrder) return;

  const btnPay = document.getElementById("btnPayQris");
  if (btnPay) {
    btnPay.disabled = true;
    btnPay.innerText = "Memverifikasi Pembayaran...";
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
      alert(result.message || "Gagal memverifikasi pembayaran.");
      if (btnPay) {
        btnPay.disabled = false;
        btnPay.innerText = "Simulasi Pembayaran Selesai";
      }
    }
  } catch (err) {
    console.error("Gagal menghubungi server pembayaran:", err);
    sessionStorage.removeItem("activeOrderSession");
    redirectToOrders();
  }
}

function redirectToOrders() {
  window.location.href = "pesanan-saya.html?tab=dikemas";
}

window.handlePaySuccess = handlePaySuccess;
window.redirectToOrders = redirectToOrders;