(function () {
  document.getElementById('asof-label').textContent = 'as of Jul 6, 2026 · n=' + PRODUCTS.length + ' SKUs';

  const INK = '#111111';
  const MUTED = '#666666';
  const ACCENT = '#d0021b';
  const GRID = '#e5e5e5';
  const PAPER = '#ffffff';

  Chart.defaults.font.family = "'Helvetica Neue', Arial, sans-serif";
  Chart.defaults.color = INK;
  Chart.defaults.borderColor = GRID;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.animation = false;
  Chart.defaults.plugins.legend.labels = Object.assign({}, Chart.defaults.plugins.legend.labels, { boxWidth: 10, font: { size: 10 } });
  Chart.defaults.font.size = 10;

  const charts = [];

  // ---------- helpers ----------
  const has = v => v !== null && v !== undefined && !Number.isNaN(v);
  const nf = n => Math.round(n).toLocaleString();
  const money = n => '₱' + Math.round(n).toLocaleString();

  const rated = PRODUCTS.filter(p => has(p.rating));
  const sold = PRODUCTS.filter(p => has(p.sold));
  const reviewed = PRODUCTS.filter(p => has(p.reviews));

  const totalSold = sold.reduce((s, p) => s + p.sold, 0);
  const totalReviews = reviewed.reduce((s, p) => s + p.reviews, 0);
  const avgPrice = PRODUCTS.reduce((s, p) => s + p.price, 0) / PRODUCTS.length;
  const avgRating = rated.reduce((s, p) => s + p.rating, 0) / rated.length;

  // ---------- KPI cards ----------
  const kpis = [
    { label: 'Official Products', value: PRODUCTS.length, sub: '2 non-official reseller listings excluded' },
    { label: 'Total Units Sold', value: nf(totalSold), sub: `across ${sold.length} SKUs reporting sales (of ${PRODUCTS.length})` },
    { label: 'Average Price', value: money(avgPrice), sub: `range ${money(Math.min(...PRODUCTS.map(p=>p.price)))} – ${money(Math.max(...PRODUCTS.map(p=>p.price)))}` },
    { label: 'Average Rating', value: avgRating.toFixed(2) + ' ★', sub: `from ${rated.length} rated SKUs (${((rated.length/PRODUCTS.length)*100).toFixed(0)}% of catalog)` },
    { label: 'Total Reviews', value: nf(totalReviews), sub: `across ${reviewed.length} SKUs with review data` },
  ];

  const kpiRow = document.getElementById('kpi-row');
  kpiRow.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join('');

  // ---------- category aggregates ----------
  const catMap = {};
  PRODUCTS.forEach(p => {
    const c = p.category || 'Uncategorized';
    if (!catMap[c]) catMap[c] = { count: 0, priceSum: 0, revenue: 0 };
    catMap[c].count += 1;
    catMap[c].priceSum += p.price;
    catMap[c].revenue += p.price * (p.sold || 0);
  });
  const categories = Object.keys(catMap);
  const catByAvgPrice = [...categories].sort((a, b) => (catMap[b].priceSum / catMap[b].count) - (catMap[a].priceSum / catMap[a].count));
  const catByCount = [...categories].sort((a, b) => catMap[b].count - catMap[a].count);
  const catByRevenue = [...categories].sort((a, b) => catMap[b].revenue - catMap[a].revenue);

  // ---------- Chart: avg price by category ----------
  charts.push(new Chart(document.getElementById('chart-price-by-category'), {
    type: 'bar',
    data: {
      labels: catByAvgPrice,
      datasets: [{
        label: 'Avg. price (₱)',
        data: catByAvgPrice.map(c => Math.round(catMap[c].priceSum / catMap[c].count)),
        backgroundColor: catByAvgPrice.map(c => c === "Men's Shoes" ? ACCENT : INK),
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { title: ctx => catByAvgPrice[ctx[0].dataIndex] } }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { callback: v => '₱' + v } },
        y: {
          grid: { display: false },
          ticks: {
            font: { size: 10 },
            callback: function (value) {
              const label = catByAvgPrice[value];
              return label.length > 18 ? label.slice(0, 16) + '…' : label;
            }
          }
        }
      }
    }
  }));

  // ---------- Chart: category mix (doughnut) ----------
  charts.push(new Chart(document.getElementById('chart-category-count'), {
    type: 'doughnut',
    data: {
      labels: catByCount,
      datasets: [{
        data: catByCount.map(c => catMap[c].count),
        backgroundColor: catByCount.map((_, i) => i === 0 ? INK : `rgba(17,17,17,${1 - i * 0.11})`),
        borderColor: PAPER,
        borderWidth: 2,
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  }));

  // ---------- Chart: best sellers ----------
  const topSellers = [...sold].sort((a, b) => b.sold - a.sold).slice(0, 10);
  charts.push(new Chart(document.getElementById('chart-best-sellers'), {
    type: 'bar',
    data: {
      labels: topSellers.map(p => p.name.length > 28 ? p.name.slice(0, 26) + '…' : p.name),
      datasets: [{
        label: 'Units sold (lifetime)',
        data: topSellers.map(p => p.sold),
        backgroundColor: topSellers.map((_, i) => i === 0 ? ACCENT : INK),
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  }));

  // ---------- Chart: rating distribution ----------
  const ratingBuckets = { '1★': 0, '2★': 0, '3★': 0, '4★': 0, '5★': 0 };
  rated.forEach(p => {
    const r = Math.round(p.rating);
    const key = `${Math.min(Math.max(r, 1), 5)}★`;
    ratingBuckets[key] += 1;
  });
  charts.push(new Chart(document.getElementById('chart-rating-dist'), {
    type: 'bar',
    data: {
      labels: Object.keys(ratingBuckets),
      datasets: [{
        label: 'SKUs',
        data: Object.values(ratingBuckets),
        backgroundColor: Object.keys(ratingBuckets).map(k => k === '1★' ? ACCENT : INK),
        borderWidth: 0,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: GRID }, ticks: { stepSize: 1 } }
      }
    }
  }));

  // ---------- Chart: revenue proxy by category ----------
  charts.push(new Chart(document.getElementById('chart-revenue-category'), {
    type: 'bar',
    data: {
      labels: catByRevenue,
      datasets: [{
        label: 'Price × Units Sold (₱)',
        data: catByRevenue.map(c => Math.round(catMap[c].revenue)),
        backgroundColor: catByRevenue.map(c => c === "Men's Clothing" ? ACCENT : INK),
        borderWidth: 0,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { callback: v => '₱' + (v/1000) + 'k' } }
      }
    }
  }));

  // ---------- Chart: price vs sold scatter ----------
  charts.push(new Chart(document.getElementById('chart-price-vs-sold'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'SKU',
        data: sold.map(p => ({ x: p.price, y: p.sold })),
        backgroundColor: ACCENT,
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const p = sold[ctx.dataIndex];
              return `${p.name}: ₱${p.price} · ${p.sold} sold`;
            }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Price (₱)' }, grid: { color: GRID } },
        y: { title: { display: true, text: 'Units sold' }, grid: { color: GRID } }
      }
    }
  }));

  // ---------- Chart: data coverage ----------
  const coverageFields = [
    { label: 'Sold data', n: sold.length },
    { label: 'Rating data', n: rated.length },
    { label: 'Review data', n: reviewed.length },
    { label: 'Discount data', n: PRODUCTS.filter(p => has(p.discount_pct)).length },
  ];
  charts.push(new Chart(document.getElementById('chart-coverage'), {
    type: 'bar',
    data: {
      labels: coverageFields.map(f => f.label),
      datasets: [{
        label: '% of catalog with data',
        data: coverageFields.map(f => +(f.n / PRODUCTS.length * 100).toFixed(1)),
        backgroundColor: coverageFields.map(f => f.n === 0 ? ACCENT : INK),
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.parsed.x + '% (' + coverageFields[ctx.dataIndex].n + ' of ' + PRODUCTS.length + ')' } }
      },
      scales: {
        x: { min: 0, max: 100, grid: { color: GRID }, ticks: { callback: v => v + '%' } },
        y: { grid: { display: false } }
      }
    }
  }));

  // ---------- Chart: price histogram ----------
  const bucketSize = 500;
  const maxPrice = Math.max(...PRODUCTS.map(p => p.price));
  const bucketCount = Math.ceil((maxPrice + 1) / bucketSize);
  const histBuckets = Array(bucketCount).fill(0);
  PRODUCTS.forEach(p => {
    histBuckets[Math.floor(p.price / bucketSize)] += 1;
  });
  const histLabels = histBuckets.map((_, i) => `₱${i * bucketSize}–${(i + 1) * bucketSize}`);
  charts.push(new Chart(document.getElementById('chart-price-hist'), {
    type: 'bar',
    data: {
      labels: histLabels,
      datasets: [{
        label: 'SKUs',
        data: histBuckets,
        backgroundColor: INK,
        borderWidth: 0,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { stepSize: 2 } }
      }
    }
  }));

  // ---------- Flags ----------
  const flags = [];
  PRODUCTS.forEach(p => {
    if (has(p.rating) && p.rating < 3) {
      flags.push({ p, tag: 'Low Rating', severe: true, meta: `${p.rating.toFixed(1)}★ from ${p.reviews || 0} review(s)` });
    } else if (has(p.reviews) && p.reviews <= 2) {
      flags.push({ p, tag: 'Low Review Count', severe: false, meta: `${has(p.rating) ? p.rating.toFixed(1) + '★' : 'unrated'} · only ${p.reviews} review(s)` });
    }
  });

  const flagGrid = document.getElementById('flag-grid');
  flagGrid.innerHTML = (flags.length ? flags.map(f => `
    <div class="flag-card ${f.severe ? 'severe' : ''}">
      <div class="flag-name">${escapeHtml(f.p.name)}</div>
      <div class="flag-meta">${f.meta} · ${escapeHtml(f.p.category)}</div>
      <span class="flag-tag ${f.severe ? 'tag-accent' : ''}">${f.tag}</span>
    </div>
  `).join('') : '<div class="flag-empty">No flagged products.</div>') +
  `<div class="flag-card">
      <div class="flag-name">Discount fields entirely empty</div>
      <div class="flag-meta">0 of ${PRODUCTS.length} SKUs have original_price or discount_pct populated</div>
      <span class="flag-tag tag-accent">Data Gap</span>
    </div>`;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Insights ----------
  const priceSoldCorr = pearson(sold.map(p => p.price), sold.map(p => p.sold));
  const cheapest = [...PRODUCTS].sort((a, b) => a.price - b.price)[0];
  const priciest = [...PRODUCTS].sort((a, b) => b.price - a.price)[0];
  const topCatByCount = catByCount[0];
  const topCatByRevenue = catByRevenue[0];
  const topSeller = topSellers[0];

  const insights = [
    `<b>Discount data is completely absent</b> — none of the ${PRODUCTS.length} official listings have an original_price or discount_pct value, meaning every product is sold strictly at list price with no promotional markdowns detected on Lazada.`,
    `<b>Sales/rating visibility is thin</b> — only ${sold.length} of ${PRODUCTS.length} SKUs (${((sold.length/PRODUCTS.length)*100).toFixed(0)}%) report a lifetime sold count and just ${rated.length} (${((rated.length/PRODUCTS.length)*100).toFixed(0)}%) have a star rating, so most performance figures here describe a visible subset, not the full catalog.`,
    `<b>Price and units sold trend inversely</b> (r &asymp; ${priceSoldCorr.toFixed(2)} among the ${sold.length} SKUs with sales data) — the best sellers (${topSeller.name}, ${nf(topSeller.sold)} sold) sit in the &#8369;200&ndash;&#8369;770 range, while premium pieces above &#8369;1,500 show little to no visible sales traction.`,
    `<b>Men's Shoes carries the highest average price</b> (&#8369;${nf(catMap["Men's Shoes"].priceSum / catMap["Men's Shoes"].count)}) driven by the &#8369;4,570 Field Trainers, the single most expensive item in the catalog, while <b>${cheapest.name}</b> at &#8369;${nf(cheapest.price)} is the cheapest.`,
    `<b>${topCatByCount}</b> dominates the assortment by SKU count (${catMap[topCatByCount].count} of ${PRODUCTS.length}), but <b>${topCatByRevenue}</b> leads on the price&times;sold revenue proxy (&#8369;${nf(catMap[topCatByRevenue].revenue)}), showing volume sellers (tees, socks, bundles) outperform accessory-heavy categories despite fewer listings.`,
    `<b>Ratings skew almost perfectly positive</b> — of ${rated.length} rated SKUs, ${ratingBuckets['5★']} sit at 5★ and only one (a "Hitter" V3 tee, 1★ from a single review) drags the average down, suggesting the 1★ outlier may be a shipping/sizing complaint rather than a product quality trend.`,
  ];

  document.getElementById('insight-list').innerHTML = insights.map(i => `<li>${i}</li>`).join('');

  function pearson(xs, ys) {
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    return num / Math.sqrt(dx * dy);
  }

  // ---------- Tab switching ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  function activateTab(name) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    tabViews.forEach(v => v.classList.toggle('active', v.id === 'tab-' + name));
    // Charts inside a newly-visible tab need a resize pass since their
    // containers had zero size while the tab was display:none.
    requestAnimationFrame(() => {
      charts.forEach(c => c.resize());
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  window.addEventListener('resize', () => {
    charts.forEach(c => c.resize());
  });
})();
