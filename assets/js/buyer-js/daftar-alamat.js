document.addEventListener("DOMContentLoaded", function () {
  // --- 1. LOGIKA MODAL TAMBAH ALAMAT (Di halaman akun.html) ---
  const btnTambahAlamat = document.querySelector(
    '.btn-primary[content*="Tambah Alamat"]',
  ); // Mencari tombol secara dinamis
  const modalTambah = document.getElementById("modalTambahAlamat");
  const btnCloseTambah = document.getElementById("closeModalTambah");
  const formAlamat = document.getElementById("formAlamat");

  // Buka modal saat tombol tambah alamat diklik
  if (document.body.contains(modalTambah)) {
    // Asumsi tombol trigger memiliki class tertentu (sesuaikan jika perlu)
    document.querySelectorAll("button").forEach((btn) => {
      if (btn.innerText.includes("Tambah Alamat")) {
        btn.addEventListener(
          "click",
          () => (modalTambah.style.display = "flex"),
        );
      }
    });

    // Tutup modal
    btnCloseTambah.addEventListener(
      "click",
      () => (modalTambah.style.display = "none"),
    );

    // Simulasi simpan data
    formAlamat.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Alamat berhasil disimpan!");
      modalTambah.style.display = "none";
    });
  }

  // --- 2. LOGIKA AKSI KARTU ALAMAT (Hapus & Utama) ---
  const btnHapusList = document.querySelectorAll(".text-red");

  btnHapusList.forEach((btn) => {
    btn.addEventListener("click", function () {
      const konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus alamat ini?",
      );
      if (konfirmasi) {
        // Mencari elemen kartu alamat terluar dan menghapusnya dari layar
        this.closest(".address-card").remove();
        alert("Alamat berhasil dihapus.");
      }
    });
  });

  // --- 3. LOGIKA MODAL PILIH ALAMAT (Di halaman checkout.html) ---
  const modalPilih = document.getElementById("modalPilihAlamat");
  const btnClosePilih = document.getElementById("closeModalPilih");
  const btnKonfirmasiAlamat = document.getElementById("btnKonfirmasiAlamat");

  if (document.body.contains(modalPilih)) {
    // Mencari tombol "Pilih Alamat Lain"
    document.querySelectorAll(".btn-outline").forEach((btn) => {
      if (btn.innerText.includes("Pilih Alamat Lain")) {
        btn.addEventListener(
          "click",
          () => (modalPilih.style.display = "flex"),
        );
      }
    });

    // Tutup modal
    btnClosePilih.addEventListener(
      "click",
      () => (modalPilih.style.display = "none"),
    );

    // Saat memilih alamat baru
    btnKonfirmasiAlamat.addEventListener("click", function () {
      alert("Alamat pengiriman berhasil diubah!");
      modalPilih.style.display = "none";
      // Nantinya JavaScript akan mengganti teks di ringkasan alamat checkout secara dinamis di sini
    });
  }
});
