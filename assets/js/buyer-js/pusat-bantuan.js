/**
 * Logika Pusat Bantuan, FAQ Dummy, & Lapor Masalah Terintegrasi Admin MySQL
 * File: assets/js/buyer-js/pusat-bantuan.js
 */

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// =========================================================================
// 0. NAVIGASI KEMBALI CERDAS (GLOBAL)
// =========================================================================
function handleHelpBackNav() {
  if (
    document.referrer &&
    !document.referrer.includes("login.html") &&
    !document.referrer.includes("daftar.html")
  ) {
    window.location.href = document.referrer;
    return;
  }
  window.location.href = "index.html";
}

window.handleHelpBackNav = handleHelpBackNav;

// =========================================================================
// 1. DATA DUMMY FAQ (TETAP SESUAI TANGKAPAN LAYAR)
// =========================================================================
const faqDatabase = {
  pembayaran: {
    title: "Pembayaran & Tagihan",
    label: "💳 Pembayaran & Tagihan",
    items: [
      {
        q: "Bagaimana cara kerja metode pembayaran COD?",
        a: "Pesanan COD langsung berstatus 'Sedang Dikemas' agar penjual segera memaketkan barang. Pembayaran dilakukan tunai ke kurir saat paket tiba di alamat Anda."
      },
      {
        q: "Berapa lama batas waktu pembayaran Virtual Account (VA)?",
        a: "Nomor Virtual Account memiliki masa kedaluwarsa 24 jam sejak pesanan dibuat. Jika melewati batas waktu, pesanan dibatalkan otomatis oleh sistem."
      },
      {
        q: "Apakah perlu upload bukti transfer untuk pembayaran QRIS atau VA?",
        a: "Tidak perlu. Sistem verifikasi kami sudah terhubung otomatis sehingga status pembayaran langsung terverifikasi seketika setelah pembayaran sukses."
      },
      {
        q: "Metode pembayaran apa saja yang saat ini didukung ON Shop?",
        a: "Saat ini kami mendukung Transfer Virtual Account (BCA, BRI, Mandiri, BNI), QRIS instan, dan Bayar di Tempat (COD)."
      },
      {
        q: "Mengapa pembayaran saya gagal diverifikasi?",
        a: "Pastikan nominal transfer sesuai hingga 3 digit terakhir jika ada kode unik dan transfer dilakukan sebelum masa berlaku VA berakhir."
      }
    ]
  },
  pengiriman: {
    title: "Pengiriman & Kurir",
    label: "🚚 Pengiriman & Kurir",
    items: [
      {
        q: "Berapa lama estimasi pesanan sampai ke alamat tujuan?",
        a: "Layanan Reguler berkisar 2-3 hari kerja, Express 1-2 hari kerja, dan Hemat berkisar 3-5 hari kerja tergantung jarak pengiriman."
      },
      {
        q: "Di mana saya bisa melihat nomor resi pengiriman?",
        a: "Nomor resi akan muncul pada halaman 'Pesanan Saya' di bawah tab 'Dalam Pengiriman' segera setelah penjual menyerahkan paket ke ekspedisi."
      },
      {
        q: "Bagaimana jika pesanan saya belum bergerak lebih dari 3 hari?",
        a: "Anda dapat menghubungi layanan ekspedisi terkait atau mengirimkan tiket komplain pada form di bawah agar kami bantu tindak lanjuti."
      },
      {
        q: "Apakah bisa mengubah alamat pengiriman saat paket sudah dikirim?",
        a: "Alamat pengiriman tidak dapat diubah apabila penjual telah memproses resi dan menyerahkan barang ke pihak kurir."
      }
    ]
  },
  pengembalian: {
    title: "Retur & Pengembalian Dana",
    label: "🔄 Retur & Pengembalian",
    items: [
      {
        q: "Kapan saya bisa mengajukan komplain atau retur barang?",
        a: "Pengajuan retur dapat dilakukan saat pesanan berstatus 'Dalam Pengiriman' atau sesaat sebelum Anda mengonfirmasi penerimaan pesanan."
      },
      {
        q: "Apa saja alasan yang diterima untuk pengembalian barang?",
        a: "Kategori pengembalian mencakup barang rusak/cacat fisik, varian atau produk tidak sesuai pesanan, dan isi paket kurang lengkap."
      },
      {
        q: "Berapa lama proses pengembalian dana (refund)?",
        a: "Proses pengembalian dana memakan waktu 1-2 hari kerja ke saldo akun atau rekening bank Anda setelah barang retur diterima oleh penjual."
      }
    ]
  },
  akun: {
    title: "Akun & Keamanan",
    label: "👤 Akun & Keamanan",
    items: [
      {
        q: "Bagaimana cara mengganti alamat pengiriman utama?",
        a: "Buka menu 'Akun' pada navbar, lalu pilih tab Daftar Alamat untuk menambah atau mengubah alamat default pengiriman belanja Anda."
      },
      {
        q: "Apakah satu akun bisa menjadi pembeli sekaligus penjual?",
        a: "Bisa. Anda cukup mengklik tombol 'Mulai Jual' pada menu utama untuk mendaftarkan rincian toko tanpa perlu membuat akun baru."
      }
    ]
  },
  promo: {
    title: "Promo & Diskon",
    label: "🏷️ Promo & Diskon",
    items: [
      {
        q: "Bagaimana cara menggunakan voucher gratis ongkir?",
        a: "Voucher diskon atau gratis ongkir akan otomatis tersedia dan dapat dipilih pada halaman checkout sebelum Anda melakukan konfirmasi pembayaran."
      },
      {
        q: "Apakah voucher promo bisa digabungkan dengan diskon toko?",
        a: "Bisa. Potongan harga langsung dari toko tetap berlaku dan dapat diakumulasikan dengan voucher ongkir dari platform ON Shop."
      }
    ]
  },
  keamanan: {
    title: "Privasi & Kebijakan",
    label: "🛡️ Privasi & Kebijakan",
    items: [
      {
        q: "Bagaimana jika barang yang saya terima terindikasi palsu?",
        a: "Anda dapat segera mengajukan laporan pengaduan melalui form tiket di bawah dengan memilih kategori 'Laporan Kendala / Toko Bermasalah'."
      },
      {
        q: "Apakah data nomor telepon dan alamat saya aman?",
        a: "Data pribadi Anda dienkripsi dan hanya diteruskan ke mitra jasa kirim yang menangani pengiriman paket Anda."
      }
    ]
  }
};

// =========================================================================
// 2. STATE VARIABEL
// =========================================================================
let currentCategoryKey = "pembayaran";
let isCategoryVisible = true;
let isAnswersVisible = true;

// Paginasi Kategori (Sisi Kiri: 3 Baris)
let currentCategoryPage = 1;
const categoriesPerPage = 3;

// Paginasi Jawaban (Sisi Kanan: 3 Baris)
let currentAnswerPage = 1;
const answersPerPage = 3;
let activeAnswerList = [];

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi event tombol pencarian navbar
  initNavbarSearchEvents();

  // Render Kategori & Jawaban Awal
  renderCategoryPaging();
  selectFaqCategory(currentCategoryKey);
});

// Penanganan Pencarian Navbar
function initNavbarSearchEvents() {
  const searchInput = document.getElementById("navSearchInput");
  const searchBtn = document.getElementById("navSearchBtn");

  if (searchBtn && searchInput) {
    searchBtn.onclick = () => {
      const q = searchInput.value.trim();
      if (q) window.location.href = `search.html?keyword=${encodeURIComponent(q)}`;
    };

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }
}

// =========================================================================
// 3. LOGIKA KATEGORI (TOGGLE & PAGINASI 3 BARIS)
// =========================================================================
function toggleCategorySection() {
  const wrapper = document.getElementById("categoryCollapsibleContent");
  const icon = document.getElementById("toggleCategoryIcon");
  const text = document.getElementById("toggleCategoryText");

  isCategoryVisible = !isCategoryVisible;

  if (isCategoryVisible) {
    wrapper.classList.remove("collapsed");
    icon.textContent = "▼";
    text.textContent = "Sembunyikan";
  } else {
    wrapper.classList.add("collapsed");
    icon.textContent = "▲";
    text.textContent = "Tampilkan";
  }
}

function renderCategoryPaging() {
  const container = document.getElementById("categoryMenuList");
  const pageIndicator = document.getElementById("categoryPageIndicator");
  const btnPrev = document.getElementById("btnPrevCategory");
  const btnNext = document.getElementById("btnNextCategory");

  if (!container) return;

  const categories = Object.keys(faqDatabase).map((key) => ({
    key: key,
    label: faqDatabase[key].label || faqDatabase[key].title
  }));

  const totalPages = Math.ceil(categories.length / categoriesPerPage) || 1;

  if (currentCategoryPage < 1) currentCategoryPage = 1;
  if (currentCategoryPage > totalPages) currentCategoryPage = totalPages;

  const startIndex = (currentCategoryPage - 1) * categoriesPerPage;
  const currentItems = categories.slice(startIndex, startIndex + categoriesPerPage);

  container.innerHTML = "";

  currentItems.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `faq-cat-btn ${cat.key === currentCategoryKey ? "active" : ""}`;
    btn.innerHTML = `<span>${cat.label}</span>`;
    btn.onclick = () => selectFaqCategory(cat.key, btn);
    container.appendChild(btn);
  });

  pageIndicator.textContent = `${currentCategoryPage} / ${totalPages}`;
  btnPrev.disabled = currentCategoryPage === 1;
  btnNext.disabled = currentCategoryPage === totalPages;
}

function prevCategoryPage() {
  if (currentCategoryPage > 1) {
    currentCategoryPage--;
    renderCategoryPaging();
  }
}

function nextCategoryPage() {
  const totalPages = Math.ceil(Object.keys(faqDatabase).length / categoriesPerPage);
  if (currentCategoryPage < totalPages) {
    currentCategoryPage++;
    renderCategoryPaging();
  }
}

// =========================================================================
// 4. LOGIKA JAWABAN (TOGGLE & PAGINASI 3 BARIS)
// =========================================================================
function toggleAnswersSection() {
  const wrapper = document.getElementById("answersCollapsibleContent");
  const icon = document.getElementById("toggleAnswersIcon");
  const text = document.getElementById("toggleAnswersText");

  isAnswersVisible = !isAnswersVisible;

  if (isAnswersVisible) {
    wrapper.classList.remove("collapsed");
    icon.textContent = "▼";
    text.textContent = "Sembunyikan";
  } else {
    wrapper.classList.add("collapsed");
    icon.textContent = "▲";
    text.textContent = "Tampilkan";
  }
}

function selectFaqCategory(catKey, btnEl) {
  currentCategoryKey = catKey;
  currentAnswerPage = 1;

  document.querySelectorAll(".faq-cat-btn").forEach((btn) => btn.classList.remove("active"));
  if (btnEl) {
    btnEl.classList.add("active");
  } else {
    renderCategoryPaging();
  }

  const searchInput = document.getElementById("faqSearchInput");
  if (searchInput) searchInput.value = "";

  const data = faqDatabase[catKey];
  if (!data) return;

  const heading = document.getElementById("currentCategoryHeading");
  const countBadge = document.getElementById("faqResultCountText");

  heading.innerText = data.title;
  countBadge.innerText = `${data.items.length} Solusi Tersedia`;

  activeAnswerList = data.items;
  renderAnswerPaging();
}

function renderAnswerPaging() {
  const container = document.getElementById("faqListContainer");
  const pageIndicator = document.getElementById("answerPageIndicator");
  const btnPrev = document.getElementById("btnPrevAnswer");
  const btnNext = document.getElementById("btnNextAnswer");
  const paginationRow = document.getElementById("answerPaginationRow");

  if (!container) return;

  const totalPages = Math.ceil(activeAnswerList.length / answersPerPage) || 1;

  if (currentAnswerPage < 1) currentAnswerPage = 1;
  if (currentAnswerPage > totalPages) currentAnswerPage = totalPages;

  const startIndex = (currentAnswerPage - 1) * answersPerPage;
  const currentItems = activeAnswerList.slice(startIndex, startIndex + answersPerPage);

  container.innerHTML = "";

  if (currentItems.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #888;">
        <p>Tidak ada jawaban yang tersedia.</p>
      </div>
    `;
    paginationRow.style.display = "none";
    return;
  }

  paginationRow.style.display = "flex";

  currentItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "faq-item-card";
    card.innerHTML = `
      <div class="faq-question">Q: ${item.q}</div>
      <div class="faq-answer">${item.a}</div>
    `;
    container.appendChild(card);
  });

  pageIndicator.textContent = `${currentAnswerPage} / ${totalPages}`;
  btnPrev.disabled = currentAnswerPage === 1;
  btnNext.disabled = currentAnswerPage === totalPages;
}

function prevAnswerPage() {
  if (currentAnswerPage > 1) {
    currentAnswerPage--;
    renderAnswerPaging();
  }
}

function nextAnswerPage() {
  const totalPages = Math.ceil(activeAnswerList.length / answersPerPage);
  if (currentAnswerPage < totalPages) {
    currentAnswerPage++;
    renderAnswerPaging();
  }
}

// =========================================================================
// 5. PENCARIAN FAQ
// =========================================================================
function handleFaqSearch() {
  const keyword = document.getElementById("faqSearchInput").value.trim().toLowerCase();
  const heading = document.getElementById("currentCategoryHeading");
  const countBadge = document.getElementById("faqResultCountText");

  if (!keyword) {
    selectFaqCategory(currentCategoryKey);
    return;
  }

  heading.innerText = `Hasil Pencarian: "${keyword}"`;
  currentAnswerPage = 1;

  let matches = [];
  Object.keys(faqDatabase).forEach((key) => {
    faqDatabase[key].items.forEach((item) => {
      if (item.q.toLowerCase().includes(keyword) || item.a.toLowerCase().includes(keyword)) {
        matches.push(item);
      }
    });
  });

  countBadge.innerText = `${matches.length} Solusi Ditemukan`;
  activeAnswerList = matches;
  renderAnswerPaging();
}

// =========================================================================
// 6. PENGIRIMAN LAPOR MASALAH (MYSQL TERHUBUNG KE ADMIN)
// =========================================================================
async function handleTicketSubmit(e) {
  e.preventDefault();

  if (!currentUser || !currentUser.user_id) {
    if (typeof showToast === "function") {
      showToast("Silakan login terlebih dahulu untuk mengirim laporan masalah.", "warning");
    }
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  const subject = document.getElementById("ticketSubject").value.trim();
  const category = document.getElementById("ticketCategorySelect").value;
  const message = document.getElementById("ticketMessage").value.trim();

  if (!subject || !category || !message) {
    if (typeof showToast === "function") {
      showToast("Harap lengkapi seluruh kolom formulir laporan masalah!", "warning");
    }
    return;
  }

  const btnSubmit = document.getElementById("btnSubmitTicket");
  btnSubmit.disabled = true;
  btnSubmit.innerText = "Mengirim Laporan...";

  try {
    const res = await fetch("/on-shop/api/buyer/help_ticket.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        category: category,
        subject: subject,
        message: message
      })
    });

    const result = await res.json();

    if (result.status) {
      document.getElementById("ticketCodeDisplay").innerText = result.ticket_code;
      document.getElementById("ticketModal").classList.remove("hidden");
      document.getElementById("supportTicketForm").reset();
      if (typeof showToast === "function") {
        showToast("Laporan masalah Anda berhasil diteruskan ke Admin!", "success");
      }
    } else {
      if (typeof showToast === "function") {
        showToast(result.message || "Gagal membuat laporan masalah.", "error");
      }
    }
  } catch (err) {
    console.error("Gagal mengirim tiket:", err);
    if (typeof showToast === "function") {
      showToast("Terjadi kendala jaringan saat mengirim laporan.", "error");
    }
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerText = "Lapor Masalah";
  }
}

function closeTicketModal() {
  document.getElementById("ticketModal").classList.add("hidden");
}

// Daftarkan fungsi ke objek window global
window.toggleCategorySection = toggleCategorySection;
window.prevCategoryPage = prevCategoryPage;
window.nextCategoryPage = nextCategoryPage;
window.toggleAnswersSection = toggleAnswersSection;
window.prevAnswerPage = prevAnswerPage;
window.nextAnswerPage = nextAnswerPage;
window.handleFaqSearch = handleFaqSearch;
window.handleTicketSubmit = handleTicketSubmit;
window.closeTicketModal = closeTicketModal;