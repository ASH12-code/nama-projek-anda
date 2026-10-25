/**
 * Logika Pendaftaran Buka Toko (Bebas Looping & Terintegrasi Sesi Seller)
 * File: assets/js/buyer-js/buka-toko.js
 */

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ==========================================
// BAGIAN 1: SISTEM NOTIFIKASI TOAST KUSTOM
// ==========================================
function showToast(message, type = "info", duration = 3000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || "ℹ"}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
}

// Navigasi Kembali Anti-Looping
function handleNavBack() {
  const ref = document.referrer || "";
  if (!ref || ref.includes("login.html") || ref.includes("daftar.html") || ref.includes("buka-toko.html")) {
    window.location.href = "index.html";
    return;
  }
  window.location.href = ref;
}

window.handleNavBack = handleNavBack;
window.showToast = showToast;

// ==========================================
// BAGIAN 2: VALIDASI SESI SAAT HALAMAN DIMUAT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Validasi Login Pengguna
  if (!currentUser || !currentUser.user_id) {
    showToast("Silakan masuk ke akun Anda terlebih dahulu untuk membuka toko.", "warning", 2500);
    setTimeout(() => {
      window.location.href = "login.html?redirect=buka-toko.html";
    }, 1200);
    return;
  }

  // 2. Jika sudah memiliki toko aktif, arahkan langsung ke gerbang seller index.php
  if (currentUser.has_shop == 1 || currentUser.role === "seller") {
    showToast("Anda sudah memiliki toko yang aktif. Mengalihkan ke Dashboard...", "info", 1500);
    setTimeout(() => {
      window.location.href = "../seller/index.php";
    }, 1000);
    return;
  }
});

// ==========================================
// BAGIAN 3: PENGIRIMAN FORMULIR BUKA TOKO
// ==========================================
async function handleOpenShopSubmit(e) {
  e.preventDefault();

  const shopName = document.getElementById("shopName").value.trim();
  const description = document.getElementById("shopDescription").value.trim();
  const pickupAddress = document.getElementById("pickupAddress").value.trim();
  const pickupCity = document.getElementById("pickupCity").value.trim();
  const pickupProvince = document.getElementById("pickupProvince").value.trim();
  const bankName = document.getElementById("bankName").value;
  const bankAccountNumber = document.getElementById("bankAccountNumber").value.trim();

  if (!shopName || !pickupAddress || !pickupCity || !pickupProvince || !bankName || !bankAccountNumber) {
    showToast("Harap lengkapi semua bidang bertanda bintang (*).", "warning");
    return;
  }

  const btn = document.getElementById("btnSubmitShop");
  btn.disabled = true;
  btn.innerText = "Mendaftarkan Toko...";

  const payload = {
    user_id: currentUser.user_id,
    shop_name: shopName,
    description: description,
    pickup_address: pickupAddress,
    pickup_city: pickupCity,
    pickup_province: pickupProvince,
    bank_name: bankName,
    bank_account_number: bankAccountNumber
  };

  try {
    const res = await fetch("/on-shop/api/buyer/open_shop.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const textRes = await res.text();
    let result;
    try {
      result = JSON.parse(textRes);
    } catch (parseErr) {
      console.error("Format respon bukan JSON:", textRes);
      showToast("Terjadi kesalahan pada respon server backend.", "error");
      btn.disabled = false;
      btn.innerText = "Daftarkan Toko Saya";
      return;
    }

    if (result.status) {
      showToast(result.message || "Selamat! Toko Anda berhasil didaftarkan.", "success", 2000);

      // Sinkronkan status toko pada penyimpanan lokal pembeli
      currentUser.has_shop = 1;
      currentUser.role = "seller";
      if (result.shop_id) currentUser.shop_id = result.shop_id;
      if (result.shop_name) currentUser.shop_name = result.shop_name;

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("on_shop_role", "seller");

      // Arahkan ke gerbang PHP seller untuk mengunci sesi secara utuh
      setTimeout(() => {
        window.location.href = "../seller/index.php";
      }, 1500);
    } else {
      showToast(result.message || "Gagal membuka toko.", "error");
      btn.disabled = false;
      btn.innerText = "Daftarkan Toko Saya";
    }
  } catch (err) {
    console.error("Gagal membuka toko:", err);
    showToast("Terjadi gangguan koneksi ke server.", "error");
    btn.disabled = false;
    btn.innerText = "Daftarkan Toko Saya";
  }
}

window.handleOpenShopSubmit = handleOpenShopSubmit;