/**
 * Komponen & Sinkronisasi Notifikasi Sidebar Super Admin ON Shop (Rombak dari 0)
 * File: assets/js/admin-js/sidebar-admin.js
 */

// Deteksi base URL otomatis agar tidak terjadi 404 pada path relatif maupun absolut
const getBadgeApiUrl = () => {
  const isLocalhostSubdir = window.location.pathname.includes("/on-shop/");
  return isLocalhostSubdir
    ? "/on-shop/api/admin/get_sidebar_badges.php"
    : "../../api/admin/get_sidebar_badges.php";
};

document.addEventListener("DOMContentLoaded", () => {
  fetchGlobalSidebarBadges();
});

/**
 * 1. AMBIL JUMLAH NOTIFIKASI PENDING DARI DATABASE
 */
async function fetchGlobalSidebarBadges() {
  try {
    const res = await fetch(getBadgeApiUrl(), {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });

    if (!res.ok) {
      console.warn("Gagal memanggil API badge sidebar, status:", res.status);
      return;
    }

    const result = await res.json();
    if (!result.status || !result.data) return;

    const data = result.data;

    // A. Badge Manajemen Toko (Toko butuh verifikasi)
    updateBadgeElement("badgePendingShops", data.pending_shops);

    // B. Badge Keuangan & Payout (Antrean tarik dana butuh transfer)
    updateBadgeElement("badgePendingPayouts", data.pending_payouts);

    // C. Badge Pusat Bantuan (Kasus sengketa butuh mediasi)
    updateBadgeElement("badgeOpenDisputes", data.pending_disputes);

  } catch (err) {
    console.warn("Kendala sinkronisasi badge sidebar admin:", err);
  }
}

/**
 * 2. TAMPILKAN ATAU SEMBUNYIKAN BADGE MERAH
 */
function updateBadgeElement(elementId, count) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const num = parseInt(count, 10) || 0;
  if (num > 0) {
    el.innerText = num > 99 ? "99+" : num;
    el.style.display = "inline-block";
  } else {
    el.innerText = "";
    el.style.display = "none";
  }
}

/**
 * 3. LOGIKA KELUAR (LOGOUT) SUPER ADMIN (Tujuan Redirect Diperbaiki ke buyer/login.html)
 */
async function handleAdminLogout() {
  try {
    // Bersihkan sesi browser lokal
    localStorage.removeItem("currentUser");
    localStorage.removeItem("adminToken");
    sessionStorage.clear();

    // Hapus sesi PHP backend jika endpoint logout tersedia
    const logoutUrl = window.location.pathname.includes("/on-shop/")
      ? "/on-shop/api/auth/logout.php"
      : "../../api/auth/logout.php";

    await fetch(logoutUrl, { 
      method: "POST", 
      credentials: "include" 
    }).catch(() => {});
  } catch (err) {
    console.warn("Logout error:", err);
  } finally {
    // Alihkan langsung ke halaman login resmi pembeli/seller
    window.location.href = "../buyer/login.html";
  }
}

// Buka fungsi ke level window agar bisa dipanggil dari elemen HTML dan skrip modul lain
window.fetchGlobalSidebarBadges = fetchGlobalSidebarBadges;
window.handleAdminLogout = handleAdminLogout;