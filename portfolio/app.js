(function () {
  const grid = document.getElementById('grid');
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-by');
  const countLabel = document.getElementById('count-label');

  countLabel.textContent = PRODUCTS.length;

  const categories = Array.from(new Set(PRODUCTS.map(p => p.category_top).filter(Boolean))).sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  function starString(rating) {
    if (!rating) return '';
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function renderCard(p) {
    const hasDiscount = p.original_price && p.discount_pct;
    return `
      <article class="card">
        <div class="card-image">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        </div>
        <div class="card-body">
          ${p.category_top ? `<div class="card-category">${escapeHtml(p.category_top)}</div>` : ''}
          <div class="card-name">${escapeHtml(p.name)}</div>
          <div class="card-price-row">
            <span class="card-price">₱${p.price.toLocaleString()}</span>
            ${hasDiscount ? `<span class="card-original-price">₱${p.original_price.toLocaleString()}</span>
            <span class="card-discount">-${Math.round(p.discount_pct)}%</span>` : ''}
          </div>
          <div class="card-meta">
            <span>${p.rating ? starString(p.rating) + ' ' + p.rating.toFixed(1) : 'No ratings'}${p.reviews ? ' (' + p.reviews + ')' : ''}</span>
            <span>${p.sold ? p.sold + ' sold' : ''}</span>
          </div>
          ${p.description ? `<div class="card-desc">${escapeHtml(p.description)}</div>` : ''}
          <a class="card-link" href="${p.url}" target="_blank" rel="noopener">View on Lazada →</a>
        </div>
      </article>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;
    let list = PRODUCTS.filter(p => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
      const matchesCat = !cat || p.category_top === cat;
      return matchesQuery && matchesCat;
    });

    const sortBy = sortSelect.value;
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating-desc') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'sold-desc') list.sort((a, b) => (b.sold || 0) - (a.sold || 0));

    return list;
  }

  function render() {
    const list = getFiltered();
    countLabel.textContent = list.length + (list.length !== PRODUCTS.length ? ` of ${PRODUCTS.length}` : '');
    grid.innerHTML = list.length
      ? list.map(renderCard).join('')
      : '<div class="empty-state">No products match your filters.</div>';
  }

  searchInput.addEventListener('input', render);
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);

  render();
})();
