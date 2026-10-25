document.addEventListener("DOMContentLoaded", function () {
  // --- FITUR 1: UPDATE HARGA ONGKIR (Untuk file checkout.html) ---
  const radioPengiriman = document.querySelectorAll(".ship-input");
  const displayOngkir = document.getElementById("displayOngkir");

  if (radioPengiriman.length > 0 && displayOngkir) {
    radioPengiriman.forEach((radio) => {
      radio.addEventListener("change", function () {
        // Mengambil nilai ongkos kirim dari atribut 'value'
        const ongkir = parseInt(this.value);
        // Mengubah format angka menjadi Rupiah
        displayOngkir.innerText = "Rp " + ongkir.toLocaleString("id-ID");
      });
    });
  }

  // --- FITUR 2: SALIN NOMOR RESI (Untuk file lacak-paket.html) ---
  const btnSalin = document.getElementById("btnSalin");
  const teksResi = document.getElementById("teksResi");

  if (btnSalin && teksResi) {
    btnSalin.addEventListener("click", function () {
      // Mengambil teks nomor resi
      const resi = teksResi.innerText;

      // Menyalin ke clipboard (papan klip) bawaan browser
      navigator.clipboard.writeText(resi).then(() => {
        // Memberikan efek visual bahwa resi berhasil disalin
        btnSalin.innerText = "Tersalin!";
        btnSalin.style.backgroundColor = "#e0f7fa";

        // Mengembalikan teks tombol setelah 2 detik
        setTimeout(() => {
          btnSalin.innerText = "Salin Resi";
          btnSalin.style.backgroundColor = "#fff";
        }, 2000);
      });
    });
  }
});
