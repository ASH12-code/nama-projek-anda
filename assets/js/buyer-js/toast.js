/**
 * Komponen Toast Universal ON Shop
 * File: assets/js/buyer-js/toast.js
 */

function showToast(message, type = "info", duration = 3000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `custom-toast toast-${type}`;

  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  const icon = iconMap[type] || "ℹ️";

  toast.innerHTML = `
    <span class="custom-toast-icon">${icon}</span>
    <span class="custom-toast-msg">${message}</span>
    <button class="custom-toast-close" type="button" aria-label="Tutup">&times;</button>
  `;

  // Tombol Tutup Manual
  const closeBtn = toast.querySelector(".custom-toast-close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  container.appendChild(toast);

  // Animasi Masuk
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto Dismiss
  const timer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(el) {
    clearTimeout(timer);
    el.classList.remove("show");
    el.addEventListener("transitionend", () => {
      if (el.parentElement) el.remove();
    }, { once: true });
  }
}

// Buka ke scope window agar dapat diakses semua script
window.showToast = showToast;