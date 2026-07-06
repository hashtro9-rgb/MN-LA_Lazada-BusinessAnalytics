# MN+LA — Lazada Business Analytics

A business data analytics project for **MN+LA**, a Manila-based streetwear brand, built from scraped data on its official Lazada Philippines storefront (51 official product listings).

This repo is a portfolio piece covering the full analyst workflow: raw data → cleaned dataset → interactive product catalog → analytics dashboard → written business report with recommendations.

## Contents

| Folder | What it is |
|---|---|
| [`portfolio/`](portfolio/) | Browsable product catalog — search, filter by category, sort by price/rating/best-sellers |
| [`dashboard/`](dashboard/) | Interactive analytics dashboard — KPIs, category performance, best sellers, ratings, price vs. sales |
| [`reports/business_analysis.md`](reports/business_analysis.md) | Written business analysis: findings, data caveats, and actionable recommendations |
| [`data/mnla_official_products.csv`](data/mnla_official_products.csv) | Cleaned dataset (official listings only) used across the catalog, dashboard, and report |

## Key findings

- **Price and sales trend inversely** (r ≈ -0.55): the best sellers (Bandana socks, Classic Tee) are ₱200–₱770 basics; SKUs above ₱1,500 show almost no visible sales traction.
- **No discounting exists** — 0 of 51 SKUs have a discounted price, despite the negative price/sales relationship suggesting promos on higher-priced items could help.
- **Category mismatch** — Sports/Accessories items make up 45% of the catalog by SKU count but show little recorded sales, while Men's Clothing basics dominate both units sold and revenue proxy.
- **Data is sparse, not necessarily bad** — only ~24% of SKUs report sales figures and ~25% have ratings, so conclusions are directional signals from a small sample rather than statistically robust trends.

Full detail, methodology, and recommendations: [`reports/business_analysis.md`](reports/business_analysis.md).

## Running locally

Each site is static (plain HTML/CSS/JS, no build step):

```bash
cd portfolio && python -m http.server 8118   # http://localhost:8118
cd dashboard && python -m http.server 8119   # http://localhost:8119
```

## Publishing to GitHub Pages

Enable **Pages** in repo settings (source: `main` branch, root folder), then serve `portfolio/index.html` and `dashboard/index.html` directly, or configure a custom Pages routing/subdirectory as needed.

## Data source & caveats

Data was collected via a Lazada Philippines scraper against MN+LA's official storefront on 2026-07-06. It reflects a single point-in-time snapshot from one marketplace/region — see the caveats section in the business analysis report before drawing broader conclusions.
