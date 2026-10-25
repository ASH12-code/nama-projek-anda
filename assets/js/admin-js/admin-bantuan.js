/**
 * Logika Super Admin: Pusat Bantuan & Sidang Mediasi (Database Connected)
 * File: assets/js/admin-js/admin-bantuan.js
 */

const GET_DISPUTES_API = "../../api/admin/get_disputes.php";
const PROCESS_VERDICT_API = "../../api/admin/process_dispute_verdict.php";

let disputesData = [];
let currentTabFilter = "all";
let targetDisputeId = null;

// State Zoom Lightbox
let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 3.5;
const zoomStep = 0.25;

document.addEventListener("DOMContentLoaded", () => {
  loadDisputesData();

  const stage = document.getElementById("lightboxStage");
  if (stage) {
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomInImage();
      } else {
        zoomOutImage();
      }
    }, { passive: false });
  }
});

// A. Mengambil Data Sengketa dari Database MySQL
async function loadDisputesData() {
  try {
    const res = await fetch(GET_DISPUTES_API, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });
    const result = await res.json();

    if (result.status && result.data) {
      disputesData = result.data.disputes || [];
      const kpi = result.data.kpi;

      document.getElementById("metricPendingCountText").innerText = `${kpi.pending || 0} Kasus`;
      document.getElementById("metricReviewCountText").innerText = `${kpi.review || 0} Kasus`;
      document.getElementById("metricRefundedCountText").innerText = `${kpi.refunded || 0} Kasus`;
      document.getElementById("metricReleasedCountText").innerText = `${kpi.released || 0} Kasus`;

      updateTabCounters();
      renderDisputeTable();
    } else {
      showToast(result.message || "Gagal memuat data sengketa.", "error");
    }
  } catch (err) {
    showToast("Kendala koneksi saat memuat pusat bantuan.", "error");
  }
}

// B. Tab Filter & Penghitung
function switchDisputeTab(statusKey, btnEl) {
  currentTabFilter = statusKey;
  document.querySelectorAll(".tab-btn-pill").forEach((b) => b.classList.remove("active"));
  btnEl.classList.add("active");
  renderDisputeTable();
}

function updateTabCounters() {
  const allCount = disputesData.length;
  const pendingCount = disputesData.filter((d) => d.status === "PENDING").length;
  const reviewCount = disputesData.filter((d) => d.status === "IN_REVIEW").length;
  const refundedCount = disputesData.filter((d) => d.status === "REFUNDED").length;
  const releasedCount = disputesData.filter((d) => d.status === "RELEASED_TO_SELLER").length;

  document.getElementById("countAll").innerText = allCount;
  document.getElementById("countPending").innerText = pendingCount;
  document.getElementById("countReview").innerText = reviewCount;
  document.getElementById("countRefunded").innerText = refundedCount;
  document.getElementById("countReleased").innerText = releasedCount;

  const badge = document.getElementById("badgeOpenDisputes");
  if (badge) {
    badge.innerText = pendingCount;
    badge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }
}

// C. Render Tabel Sengketa
function renderDisputeTable() {
  const tbody = document.getElementById("disputeTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = document.getElementById("disputeSearchInput").value.trim().toLowerCase();

  let filtered = disputesData;
  if (currentTabFilter !== "all") {
    filtered = filtered.filter((d) => d.status === currentTabFilter);
  }

  if (query) {
    filtered = filtered.filter(
      (d) =>
        (d.invoice_number || "").toLowerCase().includes(query) ||
        (d.ticket_code || "").toLowerCase().includes(query) ||
        (d.buyer_name || "").toLowerCase().includes(query) ||
        (d.buyer_code || "").toLowerCase().includes(query) ||
        (d.shop_name || "").toLowerCase().includes(query) ||
        (d.reason || "").toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 25px;">Tidak ditemukan data kasus sengketa.</td></tr>`;
    return;
  }

  filtered.forEach((d) => {
    const tr = document.createElement("tr");

    let statusPill = "";
    if (d.status === "PENDING") statusPill = `<span class="status-pill pending">Kasus Baru</span>`;
    else if (d.status === "IN_REVIEW") statusPill = `<span class="status-pill review">Dalam Mediasi</span>`;
    else if (d.status === "REFUNDED") statusPill = `<span class="status-pill refunded">Refund Selesai</span>`;
    else if (d.status === "RELEASED_TO_SELLER") statusPill = `<span class="status-pill released">Diteruskan ke Toko</span>`;

    tr.innerHTML = `
      <td>
        <code>${escapeHtml(d.ticket_code)}</code><br/>
        <small style="color: #64748b;">${escapeHtml(d.invoice_number)}</small>
      </td>
      <td>
        <strong>${escapeHtml(d.buyer_name)}</strong>
        <span style="color: #64748b; font-size: 12.5px;">(${escapeHtml(d.buyer_code || "USR")})</span>
      </td>
      <td><strong>${escapeHtml(d.shop_name)}</strong></td>
      <td><strong style="color: #ea580c;">${formatRupiah(d.amount)}</strong></td>
      <td>${escapeHtml(d.reason)}</td>
      <td>${statusPill}</td>
      <td style="text-align: right;">
        <button class="btn-table-action inspect" onclick="openDisputeModal(${d.dispute_id})">
          ⚖️ Tinjau Sidang
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// D. Modal Sidang Mediasi
function openDisputeModal(disputeId) {
  targetDisputeId = disputeId;
  const d = disputesData.find((item) => item.dispute_id === disputeId);
  if (!d) return;

  document.getElementById("modalInvoiceText").innerText = `${d.ticket_code} (${d.invoice_number})`;
  document.getElementById("modalBuyerText").innerText = `${d.buyer_name} (${d.buyer_code || "USR"})`;
  document.getElementById("modalShopText").innerText = d.shop_name;
  document.getElementById("modalAmountText").innerText = formatRupiah(d.amount);
  document.getElementById("modalBuyerComplaint").innerText = d.buyer_complaint;

  const evImg = document.getElementById("modalEvidenceImage");
  evImg.src = d.evidence_image || "https://placehold.co/900x700?text=Tidak+Ada+Lampiran";

  document.getElementById("adminVerdictNotes").value = d.admin_verdict_notes || "";

  const isResolved = d.status === "REFUNDED" || d.status === "RELEASED_TO_SELLER";
  document.getElementById("btnRefundBuyer").style.display = isResolved ? "none" : "inline-block";
  document.getElementById("btnReleaseShop").style.display = isResolved ? "none" : "inline-block";

  document.getElementById("disputeModal").classList.remove("hidden");
}

function closeDisputeModal() {
  document.getElementById("disputeModal").classList.add("hidden");
}

// E. Eksekusi Putusan Vonis ke Backend
async function handleVerdict(verdictType) {
  const notes = document.getElementById("adminVerdictNotes").value.trim();
  if (!notes) {
    showToast("Harap berikan catatan pertimbangan putusan admin!", "warning");
    return;
  }

  try {
    const res = await fetch(PROCESS_VERDICT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        dispute_id: targetDisputeId,
        verdict: verdictType,
        notes: notes
      })
    });
    const result = await res.json();

    if (result.status) {
      showToast(result.message, "success");
      closeDisputeModal();
      await loadDisputesData();
    } else {
      showToast(result.message || "Gagal memproses vonis.", "error");
    }
  } catch (err) {
    showToast("Terjadi kendala saat menghubungi server.", "error");
  }
}

// F. Lightbox Image Viewer
function openLightboxViewer() {
  const modalImg = document.getElementById("modalEvidenceImage");
  const targetImg = document.getElementById("lightboxTargetImage");
  if (!modalImg || !targetImg) return;

  targetImg.src = modalImg.src;
  resetZoomImage();
  document.getElementById("lightboxOverlay").classList.remove("hidden");
}

function closeLightboxViewer() {
  document.getElementById("lightboxOverlay").classList.add("hidden");
}

function applyZoom() {
  const targetImg = document.getElementById("lightboxTargetImage");
  const textEl = document.getElementById("zoomPercentText");
  if (targetImg) {
    targetImg.style.transform = `scale(${currentZoom})`;
  }
  if (textEl) {
    textEl.innerText = `${Math.round(currentZoom * 100)}%`;
  }
}

function zoomInImage() {
  if (currentZoom < maxZoom) {
    currentZoom = Math.min(maxZoom, currentZoom + zoomStep);
    applyZoom();
  }
}

function zoomOutImage() {
  if (currentZoom > minZoom) {
    currentZoom = Math.max(minZoom, currentZoom - zoomStep);
    applyZoom();
  }
}

function resetZoomImage() {
  currentZoom = 1;
  applyZoom();
}

function filterDisputeTable() {
  renderDisputeTable();
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.className = "toast-box";

  if (type === "error") {
    toast.classList.add("toast-error");
    if (iconEl) iconEl.innerText = "✕";
  } else if (type === "warning") {
    toast.classList.add("toast-warning");
    if (iconEl) iconEl.innerText = "⚠";
  } else {
    toast.classList.add("toast-success");
    if (iconEl) iconEl.innerText = "✓";
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function formatRupiah(num) {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

function escapeHtml(text) {
  if (!text) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}