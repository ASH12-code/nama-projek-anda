/**
 * Logika Halaman Beranda Pembeli (Rekomendasi Produk & Kategori Presisi)
 * File: assets/js/buyer-js/index.js
 */

let allProducts = [];
let currentCategoryFilter = '';
let currentSearchKeyword = '';

const CATEGORY_MAP = {
  'Elektronik': 1,
  'Pria': 2,
  'Wanita': 3,
  'Sepatu': 4,
  'Tas': 5,
  'Rumah': 6,
  'Kecantikan': 7,
  'Makanan': 8,
  'Olahraga': 9,
  'Buku': 10
};

document.addEventListener('DOMContentLoaded', () => {
  loadBuyerProducts();
  setupSearchListener();
});

async function loadBuyerProducts(catParam = '', searchKeyword = '') {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b; font-size: 13px;">Memuat rekomendasi produk...</p>`;

  let catId = 0;
  if (typeof catParam === 'number') {
    catId = catParam;
  } else if (typeof catParam === 'string' && CATEGORY_MAP[catParam]) {
    catId = CATEGORY_MAP[catParam];
  }

  let apiUrl = `/on-shop/api/buyer/get_products.php?limit=30`;
  if (catId > 0) {
    apiUrl += `&category_id=${catId}`;
  }
  if (searchKeyword && searchKeyword.trim() !== '') {
    apiUrl += `&search=${encodeURIComponent(searchKeyword.trim())}`;
  }

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
          <p style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">Tidak ada produk ditemukan.</p>
          <p style="font-size: 12.5px;">Coba pilih kategori lain atau gunakan kata kunci pencarian berbeda.</p>
        </div>
      `;
      return;
    }

    allProducts = json.data;
    renderProductsGrid(allProducts);

  } catch (err) {
    console.error('Gagal mengambil data produk:', err);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444; font-size: 13px;">
        Gagal memuat produk. Periksa koneksi basis data.
      </div>
    `;
  }
}

function renderProductsGrid(products) {
  const container = document.getElementById('productGridContainer');
  if (!container) return;

  container.innerHTML = '';
  const defaultPlaceholder = 'https://placehold.co/300x300/f8fafc/475569?text=ON+Shop';

  products.forEach(p => {
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = `detail-produk.html?id=${p.product_id}`;

    const priceFormatted = Number(p.display_price || 0).toLocaleString('id-ID');
    const ratingDisplay = p.rating_avg ? Number(p.rating_avg).toFixed(1) : '5.0';
    const cityDisplay = p.shop_city || 'Indonesia';
    const thumbUrl = p.image_url ? p.image_url : defaultPlaceholder;

    // Struktur seragam dengan wrapper gambar persegi + body kartu flexbox
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${thumbUrl}" alt="${escapeHtml(p.product_name)}" class="product-thumb" onerror="this.src='${defaultPlaceholder}'" loading="lazy" />
      </div>
      <div class="product-card-body">
        <h4 class="product-title" title="${escapeHtml(p.product_name)}">${escapeHtml(p.product_name)}</h4>
        <div class="product-price">Rp ${priceFormatted}</div>
        <div class="product-meta-row">
          <span class="product-rating">⭐ ${ratingDisplay}</span>
          <span class="product-location">📍 ${escapeHtml(cityDisplay)}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterByCategory(catKey) {
  const catItems = document.querySelectorAll('.category-item');

  if (currentCategoryFilter === catKey) {
    currentCategoryFilter = '';
    catItems.forEach(el => el.classList.remove('active'));
    loadBuyerProducts('', currentSearchKeyword);
    return;
  }

  currentCategoryFilter = catKey;
  catItems.forEach(el => {
    const nameEl = el.querySelector('.category-name');
    if (nameEl && nameEl.innerText.toLowerCase().includes(catKey.toLowerCase())) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  loadBuyerProducts(catKey, currentSearchKeyword);
}

function setupSearchListener() {
  const searchInput = document.getElementById('navSearchInput');
  const searchBtn = document.getElementById('navSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.onclick = handleSearch;
  }
}

function handleSearch() {
  const searchInput = document.getElementById('navSearchInput');
  currentSearchKeyword = searchInput ? searchInput.value.trim() : '';
  loadBuyerProducts(currentCategoryFilter, currentSearchKeyword);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

window.filterByCategory = filterByCategory;
window.handleSearch = handleSearch;