/**
 * Logika Rating & Ulasan Toko (Rombak Bersih dari Nol - Multi-Seller Safe)
 * File: assets/js/seller-js/ulasan-toko.js
 */

var allReviews = [];
var activeTabFilter = "all";
var selectedStarFilter = "all";
var selectedSortOrder = "newest";
var toastTimeout = null;

const REVIEWS_API = "../../api/seller/manage_reviews.php";

document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  await loadShopReviews();
});

// =========================================================
// 1. SISTEM NOTIFIKASI TOAST (PENGGANTI ALERT)
// =========================================================
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) {
    console.log(`[Toast ${type}]: ${message}`);
    return;
  }

  msgEl.innerText = message;
  if (iconEl) {
    iconEl.innerText = (type === "success") ? "✓" : "✕";
  }

  toast.className = `toast-box toast-show ${type === "success" ? "toast-success" : "toast-error"}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 2800);
}

// =========================================================
// 2. MENGAMBIL DATA ULASAN DARI SERVER
// =========================================================
async function loadShopReviews() {
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${REVIEWS_API}?action=list${authQuery}`);
    if (!res.ok) return;

    const result = await res.json();
    if (!result.status) return;

    allReviews = result.reviews || [];
    renderRatingSummary(result.summary || {});
    applyFilters();

  } catch (err) {
    console.error("Gagal memuat ulasan toko:", err);
    showToast("Terjadi gangguan koneksi ulasan", "error");
  }
}

// =========================================================
// 3. TAB FILTER & RINGKASAN SKOR
// =========================================================
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      activeTabFilter = this.getAttribute("data-filter");
      applyFilters();
    });
  });
}

function renderRatingSummary(summary) {
  const total = summary.total || 0;
  const avg = summary.average || "0.0";
  const starsBreakdown = summary.stars_breakdown || {1:0, 2:0, 3:0, 4:0, 5:0};

  document.getElementById("totalReviewsCount").innerText = total;
  document.getElementById("averageScoreText").innerText = avg;

  const starCount = Math.round(parseFloat(avg) || 0);
  document.getElementById("averageStarsVisual").innerText =
    "★".repeat(starCount) + "☆".repeat(5 - starCount);

  for (let i = 1; i <= 5; i++) {
    const count = starsBreakdown[i] || 0;
    const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
    const countEl = document.getElementById(`countStar${i}`);
    const barEl = document.getElementById(`bar${i}`);
    if (countEl) countEl.innerText = count;
    if (barEl) barEl.style.width = `${pct}%`;
  }

  const unreplied = summary.unreplied || 0;
  const replied = summary.replied || 0;

  document.getElementById("countTabAll").innerText = total;
  document.getElementById("countTabUnreplied").innerText = unreplied;
  document.getElementById("countTabReplied").innerText = replied;
}

// =========================================================
// 4. PENYARINGAN & PENGURUTAN ULASAN
// =========================================================
function applyFilters() {
  const starFilterEl = document.getElementById("starFilter");
  const sortOrderEl  = document.getElementById("sortOrder");

  selectedStarFilter = starFilterEl ? starFilterEl.value : "all";
  selectedSortOrder  = sortOrderEl ? sortOrderEl.value : "newest";

  let filtered = allReviews.filter((rev) => {
    const isReplied = Boolean(rev.seller_reply && rev.seller_reply.trim() !== "");
    if (activeTabFilter === "unreplied" && isReplied) return false;
    if (activeTabFilter === "replied" && !isReplied) return false;
    if (selectedStarFilter !== "all" && parseInt(rev.rating, 10) !== Number(selectedStarFilter)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    if (selectedSortOrder === "newest") return timeB - timeA;
    if (selectedSortOrder === "oldest") return timeA - timeB;
    if (selectedSortOrder === "rating_desc") return b.rating - a.rating;
    if (selectedSortOrder === "rating_asc") return a.rating - b.rating;
    return 0;
  });

  renderReviewList(filtered);
}

// =========================================================
// 5. RENDER DAFTAR KARTU ULASAN
// =========================================================
function renderReviewList(reviews) {
  const container = document.getElementById("reviewFeedContainer");
  const emptyState = document.getElementById("emptyReviewState");
  if (!container) return;

  container.innerHTML = "";

  if (reviews.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");

  reviews.forEach((rev) => {
    const isReplied = Boolean(rev.seller_reply && rev.seller_reply.trim() !== "");
    const card = document.createElement("div");
    card.className = `review-card ${isReplied ? "status-replied" : "status-unreplied"}`;

    const ratingVal = parseInt(rev.rating, 10) || 5;
    const starIcons = "★".repeat(ratingVal) + "☆".repeat(5 - ratingVal);
    const buyerInitial = (rev.buyer_name || "US").substring(0, 2).toUpperCase();
    const prodImg = rev.product_image || "https://placehold.co/100x100?text=Produk";

    card.innerHTML = `
      <div class="rev-header">
        <div class="buyer-info">
          <div class="buyer-avatar">${buyerInitial}</div>
          <div>
            <div class="buyer-name">${escapeHtml(rev.buyer_name)}</div>
            <div class="stars-gold" style="font-size: 13px;">${starIcons}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <span class="badge-reply-status ${isReplied ? "badge-replied" : "badge-unreplied"}">
            ${isReplied ? "Sudah Dibalas" : "Perlu Dibalas"}
          </span>
          <span class="rev-date">${rev.created_at_formatted || ''}</span>
        </div>
      </div>

      <div class="product-context-strip">
        <img src="${prodImg}" alt="Produk" class="prod-mini-thumb" onerror="this.src='https://placehold.co/100x100?text=Produk'" />
        <span><strong>${escapeHtml(rev.product_name)}</strong> <span class="prod-variant-label">(${escapeHtml(rev.variant_name)})</span></span>
      </div>

      <p class="rev-comment">"${escapeHtml(rev.comment || 'Pembeli tidak memberikan komentar tertulis.')}"</p>

      <div id="replySection_${rev.review_id}">
        ${
          isReplied
            ? `<div class="seller-reply-box">
                <div class="reply-content">
                  <strong>Balasan dari Toko Anda:</strong>
                  <p id="replyText_${rev.review_id}">${escapeHtml(rev.seller_reply)}</p>
                </div>
                <button type="button" class="btn-edit-reply" onclick="enableEditReply(${rev.review_id})">Ubah Balasan</button>
              </div>`
            : `<button type="button" class="btn-sm-action btn-reply-main" onclick="enableInlineReply(${rev.review_id})">Balas Ulasan</button>`
        }
      </div>
    `;

    container.appendChild(card);
  });
}

// =========================================================
// 6. BALAS DAN EDIT ULASAN
// =========================================================
function enableInlineReply(reviewId) {
  const box = document.getElementById(`replySection_${reviewId}`);
  if (!box) return;

  box.innerHTML = `
    <div class="reply-form-inline">
      <textarea id="replyInput_${reviewId}" rows="3" placeholder="Tuliskan respon santun atau ucapan terima kasih kepada pembeli..."></textarea>
      <div class="reply-form-actions">
        <button type="button" class="btn-sm-action btn-reply-main" onclick="submitReply(${reviewId})">Kirim Balasan</button>
        <button type="button" class="btn-sm-action btn-reply-cancel" onclick="applyFilters()">Batal</button>
      </div>
    </div>
  `;
  document.getElementById(`replyInput_${reviewId}`).focus();
}

function enableEditReply(reviewId) {
  const target = allReviews.find((r) => r.review_id === reviewId);
  if (!target) return;

  const box = document.getElementById(`replySection_${reviewId}`);
  if (!box) return;

  box.innerHTML = `
    <div class="reply-form-inline">
      <textarea id="replyInput_${reviewId}" rows="3">${target.seller_reply || ''}</textarea>
      <div class="reply-form-actions">
        <button type="button" class="btn-sm-action btn-reply-main" onclick="submitReply(${reviewId})">Simpan Perubahan</button>
        <button type="button" class="btn-sm-action btn-reply-cancel" onclick="applyFilters()">Batal</button>
      </div>
    </div>
  `;
  document.getElementById(`replyInput_${reviewId}`).focus();
}

async function submitReply(reviewId) {
  const input = document.getElementById(`replyInput_${reviewId}`);
  if (!input) return;

  const replyText = input.value.trim();
  if (!replyText) {
    showToast("Isi balasan tidak boleh kosong!", "error");
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authQuery  = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

  try {
    const res = await fetch(`${REVIEWS_API}?action=reply_review${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_id: reviewId,
        reply: replyText
      })
    });

    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Balasan berhasil dikirim!", "success");
      await loadShopReviews();
    } else {
      showToast(result.message || "Gagal mengirim balasan", "error");
    }
  } catch (err) {
    console.error("Gagal kirim balasan:", err);
    showToast("Terjadi gangguan koneksi", "error");
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}