/**
 * Logika Tambah & Edit Produk Universal (Strict Multi-Seller & Sinkron Gambar Varian)
 * Dirombak Total: Presisi Crop Fit-Contain + Ekspor Off-Screen HD 800x800px Anti-Buram
 * File: assets/js/seller-js/tambah-produk.js
 */

let rowCounter = 0;
let uploadedPhotoUrls = [null, null, null, null];

let cropTargetMode = null;     // 'main' atau 'variant'
let currentMainIndex = null;   
let currentTargetRowId = null; 
let originalImageObj = null;
let currentFileType = "image/jpeg";
let imgBaseWidth = 0;
let imgBaseHeight = 0;
let imgPosX = 0;
let imgPosY = 0;
let imgScale = 1;

let isDragging = false;
let startX = 0;
let startY = 0;
let toastTimeout = null;

// Ukuran tampilan kotak di layar peramban dan ukuran ekspor database
const DISPLAY_CANVAS_SIZE = 280;
const EXPORT_CANVAS_SIZE = 800;

function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) {
    console.log(`[Toast ${type}]: ${message}`);
    return;
  }

  msgEl.innerText = message;
  if (iconEl) iconEl.innerText = (type === "success") ? "✓" : "✕";

  toast.className = `toast-box toast-show ${type === "success" ? "toast-success" : "toast-error"}`;

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 2800);
}

function getRawPrice(value) {
  if (value === undefined || value === null || value === '') return 0;
  let strVal = String(value).trim();
  if (/\.\d{2}$/.test(strVal)) strVal = strVal.slice(0, -3);
  const cleanNumber = strVal.replace(/\D/g, '');
  return parseInt(cleanNumber, 10) || 0;
}

function formatRupiahDisplay(value) {
  const raw = getRawPrice(value);
  if (!raw && raw !== 0) return '';
  if (raw === 0 && String(value).replace(/\D/g, '') === '') return '';
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(raw);
}

function handlePriceInput(inputEl) {
  const raw = inputEl.value.replace(/\D/g, '');
  if (!raw) {
    inputEl.value = '';
    return;
  }
  inputEl.value = 'Rp ' + new Intl.NumberFormat('id-ID').format(parseInt(raw, 10));
}

document.addEventListener('DOMContentLoaded', async () => {
  initCropCanvasEvents();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId && parseInt(productId, 10) > 0) {
    const headingDesktop = document.getElementById('formPageHeading');
    const headingMobile  = document.getElementById('pageTitleMobile');
    const btnPublish     = document.getElementById('btnPublishLabel');

    if (headingDesktop) headingDesktop.innerText = 'Edit Produk Toko';
    if (headingMobile)  headingMobile.innerText  = 'Edit Produk Toko';
    if (btnPublish)     btnPublish.innerText      = 'Simpan Perubahan';

    document.getElementById('editProductId').value = productId;
    await prefillProductData(parseInt(productId, 10));
  } else {
    addVariantRow('Standar', '', '', '', 'RAK-01', null);
  }
});

function selectCategory(catId) {
  document.querySelectorAll('.cat-card-option').forEach(card => card.classList.remove('selected'));
  const target = document.querySelector(`.cat-card-option[data-id="${catId}"]`);
  if (target) {
    target.classList.add('selected');
    document.getElementById('selectedCategoryId').value = catId;
  }
}

function triggerMainPhotoUpload(index) {
  document.getElementById(`photoInput${index}`).click();
}

function openMainCropModal(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    showToast('Format foto tidak didukung! Gunakan JPG, PNG, atau WEBP.', 'error');
    event.target.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Ukuran foto terlalu besar! Maksimal 5 MB.', 'error');
    event.target.value = '';
    return;
  }

  cropTargetMode = 'main';
  currentMainIndex = index;
  currentFileType = file.type;

  loadAndOpenModal(file);
}

function removeMainPhoto(event, index) {
  event.stopPropagation();
  uploadedPhotoUrls[index - 1] = null;
  document.getElementById(`photoInput${index}`).value = '';
  document.getElementById(`photoPreview${index}`).style.display = 'none';
  document.getElementById(`slotPlaceholder${index}`).style.display = 'flex';
  document.getElementById(`removePhoto${index}`).style.display = 'none';
}

function addVariantRow(mainVal = '', subVal = '', priceVal = '', stockVal = '', skuVal = '', imgUrl = null) {
  rowCounter++;
  const tbody = document.getElementById('variantTableBody');
  const tr = document.createElement('tr');
  tr.id = `variantRow_${rowCounter}`;
  tr.setAttribute('data-row-id', rowCounter);
  if (imgUrl) {
    tr.setAttribute('data-variant-img', imgUrl);
  }

  const formattedPrice = formatRupiahDisplay(priceVal);
  const hasImg = imgUrl && imgUrl.trim() !== '';

  tr.innerHTML = `
    <td data-label="Varian Utama">
      <div class="var-photo-wrapper">
        <div class="var-thumb-btn" id="varThumbBtn_${rowCounter}" onclick="triggerVariantPhotoUpload(${rowCounter})" title="Pilih foto varian (1:1)">
          <span id="varThumbIcon_${rowCounter}" style="font-size:16px; color:#64748b; ${hasImg ? 'display:none;' : ''}">📷</span>
          <img id="varThumbImg_${rowCounter}" alt="Thumb Varian" src="${hasImg ? imgUrl : ''}" style="${hasImg ? 'display:block;' : 'display:none;'}">
          <input type="file" id="varFileInput_${rowCounter}" accept="image/jpeg,image/png,image/webp" class="hidden" onchange="openCropModal(event, ${rowCounter})">
          <input type="hidden" class="row-var-img" id="varImgInput_${rowCounter}" value="${hasImg ? imgUrl : ''}">
        </div>
        <input type="text" class="variant-row-input row-var-main" placeholder="Misal: Standar / Hitam" value="${mainVal}" oninput="syncShippingVariantTable()" required />
      </div>
    </td>
    <td data-label="Varian Opsional">
      <input type="text" class="variant-row-input row-var-sub" placeholder="Misal: XL / 120x60 cm" value="${subVal}" oninput="syncShippingVariantTable()" />
    </td>
    <td data-label="Harga Jual (Rp)">
      <input type="text" class="variant-row-input row-var-price" placeholder="Rp 0" value="${formattedPrice}" oninput="handlePriceInput(this)" required />
    </td>
    <td data-label="Stok">
      <input type="number" class="variant-row-input row-var-stock" placeholder="0" min="0" value="${stockVal}" required />
    </td>
    <td data-label="Kode Gudang">
      <input type="text" class="variant-row-input row-var-sku" placeholder="Contoh: RAK-01" value="${skuVal}" />
    </td>
    <td data-label="Aksi">
      <button type="button" class="btn-del-row" onclick="deleteVariantRow(${rowCounter})">Hapus</button>
    </td>
  `;
  tbody.appendChild(tr);
  syncShippingVariantTable();
  updateDeleteButtonsState();
}

function deleteVariantRow(rowId) {
  const rows = document.querySelectorAll('#variantTableBody tr');
  if (rows.length <= 1) {
    showToast('Minimal harus ada 1 baris varian produk!', 'error');
    return;
  }
  const row = document.getElementById(`variantRow_${rowId}`);
  if (row) {
    row.remove();
    syncShippingVariantTable();
    updateDeleteButtonsState();
  }
}

function updateDeleteButtonsState() {
  const rows = document.querySelectorAll('#variantTableBody tr');
  const delButtons = document.querySelectorAll('.btn-del-row');
  delButtons.forEach(btn => btn.disabled = rows.length <= 1);
}

function syncShippingVariantTable() {
  const shippingTbody = document.getElementById('shippingVariantTableBody');
  const varRows = document.querySelectorAll('#variantTableBody tr');

  let currentShipData = {};
  document.querySelectorAll('#shippingVariantTableBody tr').forEach(shipRow => {
    const rId = shipRow.getAttribute('data-ship-row-id');
    currentShipData[rId] = {
      weight: shipRow.querySelector('.ship-var-weight') ? shipRow.querySelector('.ship-var-weight').value : '',
      isDimOpen: shipRow.querySelector('.dim-input-group') ? shipRow.querySelector('.dim-input-group').classList.contains('show') : false,
      p: shipRow.querySelector('.ship-dim-p') ? shipRow.querySelector('.ship-dim-p').value : '',
      l: shipRow.querySelector('.ship-dim-l') ? shipRow.querySelector('.ship-dim-l').value : '',
      t: shipRow.querySelector('.ship-dim-t') ? shipRow.querySelector('.ship-dim-t').value : ''
    };
  });

  shippingTbody.innerHTML = '';

  varRows.forEach(vRow => {
    const rowId = vRow.getAttribute('data-row-id');
    const mainVal = vRow.querySelector('.row-var-main').value.trim() || 'Produk';
    const subVal = vRow.querySelector('.row-var-sub').value.trim();
    const combinedName = subVal ? `${mainVal} - ${subVal}` : mainVal;

    const prev = currentShipData[rowId] || { weight: '250', isDimOpen: false, p: '', l: '', t: '' };

    const shipTr = document.createElement('tr');
    shipTr.setAttribute('data-ship-row-id', rowId);
    shipTr.innerHTML = `
      <td data-label="Varian"><strong>${combinedName}</strong></td>
      <td data-label="Berat (Gram)">
        <input type="number" class="variant-row-input ship-var-weight" placeholder="Contoh: 350" min="1" value="${prev.weight}" required />
      </td>
      <td data-label="Dimensi Volumetrik">
        <div class="dim-action-wrapper">
          <button type="button" class="btn-toggle-dim ${prev.isDimOpen ? 'active' : ''}" onclick="toggleDimensionRow(${rowId}, this)">
            ${prev.isDimOpen ? '✓ Tutup Dimensi' : '+ Atur Dimensi (P x L x T)'}
          </button>
          <div class="dim-input-group ${prev.isDimOpen ? 'show' : ''}" id="dimGroup_${rowId}">
            <input type="number" class="ship-dim-p" placeholder="P" value="${prev.p}" min="1">
            <span>×</span>
            <input type="number" class="ship-dim-l" placeholder="L" value="${prev.l}" min="1">
            <span>×</span>
            <input type="number" class="ship-dim-t" placeholder="T" value="${prev.t}" min="1">
          </div>
        </div>
      </td>
    `;
    shippingTbody.appendChild(shipTr);
  });
}

function toggleDimensionRow(rowId, btnElement) {
  const group = document.getElementById(`dimGroup_${rowId}`);
  if (group.classList.contains('show')) {
    group.classList.remove('show');
    btnElement.classList.remove('active');
    btnElement.innerText = '+ Atur Dimensi (P x L x T)';
  } else {
    group.classList.add('show');
    btnElement.classList.add('active');
    btnElement.innerText = '✓ Tutup Dimensi';
  }
}

function applyBulkValues() {
  const bulkPriceEl = document.getElementById('bulkPrice');
  const bulkStockEl = document.getElementById('bulkStock');
  const pRaw = getRawPrice(bulkPriceEl.value);
  const sInput = bulkStockEl.value.trim();

  if (pRaw > 0) {
    const formatted = formatRupiahDisplay(pRaw);
    document.querySelectorAll('.row-var-price').forEach(el => el.value = formatted);
    bulkPriceEl.value = formatted;
  }
  if (sInput !== '') {
    document.querySelectorAll('.row-var-stock').forEach(el => el.value = sInput);
  }
  showToast('Harga & stok berhasil diterapkan ke semua varian!');
}

function applyBulkWeight() {
  const w = document.getElementById('bulkWeightInput').value;
  if (!w) {
    showToast('Masukkan nominal berat terlebih dahulu!', 'error');
    return;
  }
  document.querySelectorAll('.ship-var-weight').forEach(el => el.value = w);
  showToast('Berat berhasil diterapkan!');
}

function triggerVariantPhotoUpload(rowId) {
  document.getElementById(`varFileInput_${rowId}`).click();
}

function openCropModal(event, rowId) {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    showToast('Format foto tidak valid! Gunakan JPG, PNG, atau WEBP.', 'error');
    event.target.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Ukuran foto terlalu besar! Maksimal 5 MB.', 'error');
    event.target.value = '';
    return;
  }

  cropTargetMode = 'variant';
  currentTargetRowId = rowId;
  currentFileType = file.type;

  loadAndOpenModal(file);
}

// Buka Modal & Atur Gambar Muat Utuh (Contain / Fit) Tanpa Terpotong
function loadAndOpenModal(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    originalImageObj = new Image();
    originalImageObj.onload = function() {
      const modalOverlay = document.getElementById('cropModalOverlay');
      if (modalOverlay) modalOverlay.style.display = 'flex';

      const canvas = document.getElementById('cropCanvas');
      if (canvas) {
        canvas.width = DISPLAY_CANVAS_SIZE;
        canvas.height = DISPLAY_CANVAS_SIZE;
      }

      imgScale = 1;
      const zoomSlider = document.getElementById('zoomSlider');
      if (zoomSlider) {
        zoomSlider.value = 1;
        zoomSlider.min = 1;
        zoomSlider.max = 3;
        zoomSlider.step = 0.05;
      }

      // Proporsi FIT: Menampilkan produk utuh di dalam kotak 1:1
      const aspect = originalImageObj.width / originalImageObj.height;

      if (aspect >= 1) {
        // Landscape / Persegi Panjang Melebar
        imgBaseWidth = DISPLAY_CANVAS_SIZE;
        imgBaseHeight = DISPLAY_CANVAS_SIZE / aspect;
      } else {
        // Portrait / Gambar Memanjang
        imgBaseHeight = DISPLAY_CANVAS_SIZE;
        imgBaseWidth = DISPLAY_CANVAS_SIZE * aspect;
      }

      // Posisikan tepat di tengah kotak
      imgPosX = (DISPLAY_CANVAS_SIZE - imgBaseWidth) / 2;
      imgPosY = (DISPLAY_CANVAS_SIZE - imgBaseHeight) / 2;

      drawCropCanvas();
    };
    originalImageObj.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function closeCropModal() {
  const modalOverlay = document.getElementById('cropModalOverlay');
  if (modalOverlay) modalOverlay.style.display = 'none';

  if (cropTargetMode === 'variant' && currentTargetRowId) {
    const el = document.getElementById(`varFileInput_${currentTargetRowId}`);
    if (el) el.value = '';
  } else if (cropTargetMode === 'main' && currentMainIndex) {
    const el = document.getElementById(`photoInput${currentMainIndex}`);
    if (el) el.value = '';
  }
}

function drawCropCanvas() {
  if (!originalImageObj) return;
  const canvas = document.getElementById('cropCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background putih bersih
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Perbesaran terpusat di tengah gambar
  ctx.translate(imgPosX + (imgBaseWidth / 2), imgPosY + (imgBaseHeight / 2));
  ctx.scale(imgScale, imgScale);
  ctx.drawImage(
    originalImageObj, 
    -imgBaseWidth / 2, 
    -imgBaseHeight / 2, 
    imgBaseWidth, 
    imgBaseHeight
  );
  ctx.restore();
}

function handleZoomChange() {
  const slider = document.getElementById('zoomSlider');
  if (!slider) return;
  imgScale = parseFloat(slider.value) || 1;
  drawCropCanvas();
}

function initCropCanvasEvents() {
  const cropCanvas = document.getElementById('cropCanvas');
  if (!cropCanvas) return;

  cropCanvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - imgPosX;
    startY = e.clientY - imgPosY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    imgPosX = e.clientX - startX;
    imgPosY = e.clientY - startY;
    drawCropCanvas();
  });

  window.addEventListener('mouseup', () => { 
    isDragging = false; 
  });

  cropCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - imgPosX;
      startY = e.touches[0].clientY - imgPosY;
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    imgPosX = e.touches[0].clientX - startX;
    imgPosY = e.touches[0].clientY - startY;
    drawCropCanvas();
  }, { passive: false });

  window.addEventListener('touchend', () => { 
    isDragging = false; 
  });
}

// Ekspor ke Canvas Tersembunyi 800x800px Resolusi Tinggi
function applyCroppedImage() {
  if (!originalImageObj) return;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = EXPORT_CANVAS_SIZE;
  exportCanvas.height = EXPORT_CANVAS_SIZE;
  const exportCtx = exportCanvas.getContext('2d');

  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, EXPORT_CANVAS_SIZE, EXPORT_CANVAS_SIZE);

  const ratio = EXPORT_CANVAS_SIZE / DISPLAY_CANVAS_SIZE;

  exportCtx.save();
  exportCtx.translate((imgPosX + (imgBaseWidth / 2)) * ratio, (imgPosY + (imgBaseHeight / 2)) * ratio);
  exportCtx.scale(imgScale * ratio, imgScale * ratio);
  exportCtx.drawImage(
    originalImageObj, 
    -imgBaseWidth / 2, 
    -imgBaseHeight / 2, 
    imgBaseWidth, 
    imgBaseHeight
  );
  exportCtx.restore();

  const exportType = (currentFileType === 'image/webp') ? 'image/webp' : 'image/jpeg';
  const croppedBase64 = exportCanvas.toDataURL(exportType, 0.95);

  if (cropTargetMode === 'main') {
    const idx = currentMainIndex;
    uploadedPhotoUrls[idx - 1] = croppedBase64;
    const previewEl = document.getElementById(`photoPreview${idx}`);
    const placeholderEl = document.getElementById(`slotPlaceholder${idx}`);
    const removeBtn = document.getElementById(`removePhoto${idx}`);

    if (previewEl) {
      previewEl.src = croppedBase64;
      previewEl.style.display = 'block';
    }
    if (placeholderEl) placeholderEl.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'flex';

  } else if (cropTargetMode === 'variant') {
    const thumbImg = document.getElementById(`varThumbImg_${currentTargetRowId}`);
    const thumbIcon = document.getElementById(`varThumbIcon_${currentTargetRowId}`);
    const rowEl = document.getElementById(`variantRow_${currentTargetRowId}`);
    const hiddenInput = document.getElementById(`varImgInput_${currentTargetRowId}`);

    if (thumbImg) {
      thumbImg.src = croppedBase64;
      thumbImg.style.display = 'block';
    }
    if (thumbIcon) thumbIcon.style.display = 'none';

    if (rowEl) {
      rowEl.setAttribute('data-variant-img', croppedBase64);
    }
    if (hiddenInput) {
      hiddenInput.value = croppedBase64;
    }

    if (!uploadedPhotoUrls[0]) {
      uploadedPhotoUrls[0] = croppedBase64;
      const preview1 = document.getElementById('photoPreview1');
      const slot1 = document.getElementById('slotPlaceholder1');
      const rem1 = document.getElementById('removePhoto1');

      if (preview1) {
        preview1.src = croppedBase64;
        preview1.style.display = 'block';
      }
      if (slot1) slot1.style.display = 'none';
      if (rem1) rem1.style.display = 'flex';
    }
  }

  closeCropModal();
  showToast('Foto berhasil diproses dengan tajam & proporsional!');
}

async function prefillProductData(productId) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`../../api/seller/manage_catalog.php?action=get_single&id=${productId}${authQuery}`);
    const result = await res.json();
    if (!result.status) {
      showToast(result.message || "Gagal memuat produk.", "error");
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      return;
    }

    const prod = result.data;
    document.getElementById('prodName').value = prod.name || '';
    document.getElementById('prodDescription').value = prod.description || '';

    if (prod.category_id) selectCategory(prod.category_id);

    if (result.images && Array.isArray(result.images)) {
      result.images.forEach((img, index) => {
        if (index < 4 && img.image_url) {
          uploadedPhotoUrls[index] = img.image_url;
          const previewEl = document.getElementById(`photoPreview${index + 1}`);
          const placeholderEl = document.getElementById(`slotPlaceholder${index + 1}`);
          const removeBtn = document.getElementById(`removePhoto${index + 1}`);

          if (previewEl) {
            previewEl.src = img.image_url;
            previewEl.style.display = 'block';
          }
          if (placeholderEl) placeholderEl.style.display = 'none';
          if (removeBtn) removeBtn.style.display = 'flex';
        }
      });
    }

    const tbody = document.getElementById('variantTableBody');
    tbody.innerHTML = '';

    if (result.variants && Array.isArray(result.variants) && result.variants.length > 0) {
      result.variants.forEach(v => {
        const variantName = v.variant_combination || v.variant_name || '';
        const parts = variantName.split(' - ');
        const mainPart = parts[0] || variantName;
        const subPart = parts.length > 1 ? parts.slice(1).join(' - ') : '';
        addVariantRow(mainPart, subPart, v.price, v.stock, v.sku || '', v.image_url || null);
      });
    } else {
      addVariantRow('Standar', '', '', '', 'RAK-01', null);
    }

  } catch (err) {
    console.error('Gagal prefill:', err);
    showToast('Terjadi gangguan saat memuat data produk.', 'error');
  }
}

async function submitProductForm(isArchiveMode) {
  const form = document.getElementById('productForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const catId = document.getElementById('selectedCategoryId').value;
  if (!catId) {
    showToast('Pilih salah satu kategori produk terlebih dahulu!', 'error');
    return;
  }

  const vRows = document.querySelectorAll('#variantTableBody tr');
  let variants = [];

  vRows.forEach(vRow => {
    const rowId = vRow.getAttribute('data-row-id');
    const mainVal = vRow.querySelector('.row-var-main').value.trim();
    const subVal = vRow.querySelector('.row-var-sub').value.trim();
    const combinedName = subVal ? `${mainVal} - ${subVal}` : mainVal;
    const shipRow = document.querySelector(`#shippingVariantTableBody tr[data-ship-row-id="${rowId}"]`);

    const rawPrice = getRawPrice(vRow.querySelector('.row-var-price').value);
    
    const hiddenImgInput = vRow.querySelector('.row-var-img');
    const variantImg = (hiddenImgInput && hiddenImgInput.value) ? hiddenImgInput.value : (vRow.getAttribute('data-variant-img') || null);

    variants.push({
      name: combinedName,
      price: rawPrice,
      stock: parseInt(vRow.querySelector('.row-var-stock').value, 10) || 0,
      sku: vRow.querySelector('.row-var-sku').value.trim() || 'RAK-01',
      weight_grams: shipRow ? (parseInt(shipRow.querySelector('.ship-var-weight').value, 10) || 250) : 250,
      image_url: variantImg
    });
  });

  const payload = {
    product_id: parseInt(document.getElementById('editProductId').value, 10) || 0,
    name: document.getElementById('prodName').value.trim(),
    category_id: parseInt(catId, 10),
    description: document.getElementById('prodDescription').value.trim(),
    is_archived: isArchiveMode,
    images: uploadedPhotoUrls.filter(url => url !== null && url !== ''),
    variants: variants
  };

  const btnPublish = document.getElementById('btnPublishLabel');
  if (btnPublish) {
    btnPublish.disabled = true;
    btnPublish.innerText = 'Menyimpan...';
  }

  try {
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const authQuery = storedUser.user_id ? `&auth_user_id=${storedUser.user_id}` : "";

    const res = await fetch(`../../api/seller/manage_catalog.php?action=save_product${authQuery}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.status) {
      showToast(result.message || "Produk berhasil disimpan!", "success");
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showToast(result.message || "Gagal menyimpan produk.", "error");
      if (btnPublish) {
        btnPublish.disabled = false;
        btnPublish.innerText = 'Simpan Perubahan';
      }
    }
  } catch (err) {
    console.error('Gagal kirim form:', err);
    showToast('Terjadi gangguan koneksi ke server database.', 'error');
    if (btnPublish) {
      btnPublish.disabled = false;
      btnPublish.innerText = 'Simpan Perubahan';
    }
  }
}