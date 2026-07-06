# MN+LA — Lazada Storefront Business Analysis

**Prepared:** July 2026 | **Source:** Lazada Philippines storefront scrape, `mnla_data_20260706_223212.xlsx`
**Scope:** 51 official MN+LA listings (`is_official_mnla == True`), excluding 2 non-official reseller rows.

---

## 1. Executive Summary

MN+LA's official Lazada storefront carries **51 SKUs** spanning apparel, footwear, accessories, and lifestyle add-ons (fragrance, a pet-hat crossover, a paper bag novelty). Pricing ranges from **₱50 to ₱4,570**, with a median of **₱1,070** and a mean of **₱1,135**, positioning the brand solidly in the premium streetwear tier rather than budget fast-fashion.

Sales visibility is thin: only **12 of 51 products (24%)** show any recorded `sold_lifetime` units, and only **13 (25%)** have a customer rating. Among those with visible sales, the store has moved **688 total units**, led by the **MN+LA Bandana (150 units)** and **Classic Tee (129 units)** — both low-to-mid priced, high-repeat basics. Where ratings exist, quality perception is strong: the average rating across the 13 rated products is **4.65/5**, with most sitting at 4.7–5.0.

The headline tension for the business: the products with the most inventory depth (hats, chains, rings — 13 Fashion Accessories SKUs, 10 Sports Shoes/Clothing SKUs) are largely **unproven on this channel**, while a small cluster of low-price basics is quietly carrying the visible sales volume. No official product currently uses a markdown/discount — pricing is flat list-price across the board.

---

## 2. Category Performance

| Category | # SKUs | Avg Price (₱) | Total Units Sold* | Avg Rating* | Products w/ Sales Data |
|---|---:|---:|---:|---:|---:|
| Men's Clothing | 21 | 1,218 | 225 | 4.4 | 6 / 21 |
| Fashion Accessories | 13 | 1,147 | 163 | 5.0 | 2 / 13 |
| Sports Shoes and Clothing | 10 | 823 | 0 | 5.0 | 0 / 10 |
| Lingerie, Sleep, Lounge & Thermal Wear | 2 | 485 | 187 | 4.7 | 2 / 2 |
| Men's Shoes | 2 | 3,020 | 7 | n/a | 1 / 2 |
| Beauty | 1 | 1,070 | 106 | 4.8 | 1 / 1 |
| Toys & Games | 1 | 50 | 0 | n/a | 0 / 1 |
| Pet Supplies | 1 | 1,070 | 0 | n/a | 0 / 1 |

*Totals/averages computed only over products with recorded data — see Section 5 on nulls.

**Winning:** *Men's Clothing* is the volume engine (225 units across basics like tees), and the tiny **Lingerie/Sleep** category (socks, boxer briefs) punches far above its weight — only 2 SKUs but 187 units sold and a 4.7 average rating, the best units-per-SKU ratio in the catalog (93.5 avg). **Beauty** (the MN+LA Parfum, single SKU) is also a standout at 106 units and 4.8 rating, suggesting real appetite for brand-extension products beyond apparel.

**Underperforming / unproven:** *Sports Shoes and Clothing* is the second-largest category by SKU count (10 listings — mostly hats) but shows **zero recorded sales** across every single item. *Fashion Accessories* (13 SKUs — hats, chains, rings) shows sales on only 2 of 13 items. *Men's Shoes* is the highest-priced category (avg ₱3,020) but only 7 units sold on one of two SKUs. The single *Toys & Games* (₱50 paper bag) and *Pet Supplies* (branded pet hat) items are novelty long-tail SKUs with no visible traction.

---

## 3. Pricing Analysis

- **Distribution:** min ₱50, 25th pct ₱870, median ₱1,070, 75th pct ₱1,270, max ₱4,570 (std dev ₱720). The catalog is heavily clustered in the ₱770–₱1,270 band — this is effectively MN+LA's core price point.
- **Price vs. sales:** Among the 12 products with sales data, price and units sold are **negatively correlated (r = ‑0.55)** — cheaper items sell more. By price bucket: items **≤₱500** average **115 units sold**, items **₱501–1,000** average **49 units**, items **₱1,001–1,500** average **39 units**, and the four SKUs priced **₱1,500+** have **zero recorded sales**. This is a fairly clean signal that MN+LA's Lazada audience is price-sensitive relative to the brand's premium positioning.
- **Price vs. rating:** essentially no correlation (r = ‑0.10) — customers who do buy at higher price points aren't rating the product any worse, they simply aren't buying (or aren't yet reviewing) in visible numbers.
- **Discounting:** **Zero of the 51 official products carry a discount or original_price** in this snapshot — every official listing is at flat list price. (The only two discounted items in the raw dataset, at 97.3% off, belong to the excluded non-official reseller.) This means MN+LA currently has **no active promotional lever** on its own storefront to test against the price-sensitivity signal above.

---

## 4. Best Sellers, Laggards, and Warning Signs

**Top 5 sellers (by units sold):**
1. MN+LA Bandana (3 colorways) — ₱370, **150 units**, 5.0★ (36 reviews)
2. Classic Tee (4 colorways) — ₱770, **129 units**, 5.0★ (42 reviews)
3. Boxer Brief Bundle of 3 — ₱770, **107 units**, no rating recorded (39 reviews)
4. MN+LA Parfum 50ML — ₱1,070, **106 units**, 4.8★ (33 reviews)
5. MN+LA Sock – Single — ₱200, **80 units**, 4.7★ (28 reviews)

**Underperformers with data:** the "Call Me" Tee, Box Tee in Olive, and "Hitter" V3 Lounge Lite Tee each show only **5–6 units sold** with little to no review activity — these are likely newer SKUs or simply slow movers within the core Men's Clothing range.

**Concerning signals:**
- **"Hitter" V3 Chop Chop Lite Tee (Anthracite)** carries a **1.0/5 rating from its single review**, which is also its only 1-star vote (100% 1-star share). Sample size is tiny (n=1) so this shouldn't be over-weighted statistically, but it's the only outright negative signal in the dataset and warrants a manual QC check.
- **Review-to-sold ratios are consistently low (0.17–0.46)** across all 12 products with both metrics — e.g., the Bandana sold 150 units but has only 36 reviews (24% review rate), and the Boxer Brief Bundle sold 107 units on 39 reviews (36%). This is a normal e-commerce pattern (most buyers don't leave reviews) but it also means **rating averages are built on small, possibly non-representative samples** — a single bad review can swing a product's visible score sharply, as seen above.
- **34 of 51 products (67%) show absolutely no sales or review data at all** — no evidence of failure, but no evidence of traction either.

---

## 5. Data Quality Caveats

- **Nulls likely mean "no data yet," not "zero."** Lazada typically only surfaces a `sold_lifetime` counter once a product crosses a minimum threshold of orders; a blank cell is most plausibly a new or slow-moving listing rather than a confirmed zero. Treat the 39 products with blank `sold_lifetime` as *unknown*, not *unsold*.
- **Small sample size.** With only 51 SKUs and just 12–14 carrying any performance metrics, category-level averages (e.g., Beauty's single-SKU 106 units) are anecdotes, not statistically robust trends. Any percentage or correlation cited above should be read as directional, not conclusive.
- **Single platform, single region.** This snapshot reflects only Lazada Philippines. It says nothing about MN+LA's performance on Shopee, TikTok Shop, its own DTC site, or in physical retail, and PH-specific buyer behavior may not generalize to other markets the brand may consider.
- **Point-in-time snapshot.** This is one scrape (July 6, 2026); `sold_lifetime` is cumulative-to-date, not a recent-velocity metric, so a high number could reflect a product that has been listed far longer than a competitor with a low number.

---

## 6. Recommendations

1. **Double down on the ₱200–₱800 accessory/basics tier.** The Bandana, Sock, Boxer Brief, and Classic Tee — all under ₱800 — account for the majority of visible sales and carry near-perfect ratings. Expand colorways/bundle variants in this exact price band before investing further in the ₱1,500+ tier, which currently shows zero recorded sales on any SKU.

2. **Run a controlled discount test on the Sports Shoes/Clothing and Fashion Accessories hat lines.** These two categories account for 23 of 51 SKUs (45% of the catalog) yet show almost no recorded sales. Since price correlates negatively with units sold (r=‑0.55) and none of these items currently carry any discount, a time-boxed 10–15% promo on 3-5 hat SKUs would directly test whether price is the blocker versus simply low demand for that category on this channel.

3. **Investigate and potentially retire true long-tail novelty SKUs.** The Toys & Games paper bag (₱50) and Pet Supplies branded hat (₱1,070) are single-item categories with no sales signal and no clear strategic fit — confirm they're intentional brand-marketing loss-leaders or cross-promo tie-ins; if not, consider delisting to simplify the catalog.

4. **Investigate the MN+LA Parfum's success and consider a lifestyle-extension line.** A single fragrance SKU generated 106 units and a 4.8 rating — comparable to the brand's best apparel sellers — suggesting real demand for MN+LA as a lifestyle brand beyond clothing. Worth testing 1-2 additional non-apparel SKUs (e.g., a second scent, a home/lifestyle item) given the strong signal from n=1.

5. **Manually audit the "Hitter" V3 Chop Chop Lite Tee's single 1-star review** and treat low-review-count ratings generally with caution before using them in marketing (e.g., "5-star rated!" claims resting on 1-2 reviews are fragile). Prioritize collecting more reviews on the mid-tier sellers (Sock, Bracelets) to convert anecdote-level ratings into defensible social proof.

---

*Methodology note: all figures computed directly from the 51-row official-product filter of the source workbook; "average rating per category" and "total units sold per category" are computed only over rows with non-null values, per the caveats in Section 5.*
