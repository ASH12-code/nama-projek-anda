document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const orderCards = document.querySelectorAll(".order-card");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // 1. Menghapus class active dari semua tombol
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // 2. Menambahkan class active ke tombol yang sedang diklik
      this.classList.add("active");

      // 3. Mengambil nilai status dari tombol yang diklik
      const targetStatus = this.getAttribute("data-status");

      // 4. Logika filter menyembunyikan/menampilkan kartu
      orderCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");

        if (targetStatus === "semua" || targetStatus === cardCategory) {
          card.style.display = "block"; // Tampilkan
        } else {
          card.style.display = "none"; // Sembunyikan
        }
      });
    });
  });
});
