# SEO Audit: Bitquery Docs (docs.bitquery.io)

**Audit date:** February 2026  
**Data source:** Google Search Console export (keywords/ folder, March 2026)  
**Scope:** docs.bitquery.io documentation site

---

## 1. Executive Summary

The Bitquery docs site is already ranking for many high-intent developer and API queries. The main opportunities are:
- **Low CTR on high-impression pages** — several pages get 100K–500K impressions but &lt;0.2% CTR
- **Inconsistent SEO metadata** — many docs still lack proper titles and descriptions
- **Content gaps** — some high-volume queries have 0 clicks or weak positions
- **Brand visibility** — "bitquery docs" and "bitquery api" perform well (position 1–2, strong CTR); scope to expand similar visibility

---

## 2. Keywords Folder & Git

**Status:** `keywords/` has been added to `.gitignore`.  
The folder (with GSC exports) will not be committed or pushed to the repository.

---

## 3. Top Performing Queries (GSC Data)

| Query | Clicks | Impressions | CTR | Avg Position |
|-------|--------|-------------|-----|--------------|
| pumpfun api | 207 | 2,960 | 6.99% | 3.73 |
| polymarket api | 191 | 43,978 | 0.43% | 8.56 |
| pump fun api | 161 | 2,372 | 6.79% | 4.74 |
| pumpswap | 124 | 25,697 | 0.48% | 6.89 |
| gmgn api | 113 | 3,480 | 3.25% | 5.4 |
| pump.fun api | 96 | 4,530 | 2.12% | 4.68 |
| pumpswap api | 92 | 476 | **19.33%** | 1.78 |
| pancakeswap api | 73 | 588 | 12.41% | 3.27 |
| bitquery | 52 | 10,654 | 0.49% | 2.5 |
| bitquery docs | 45 | 73 | **61.64%** | **1** |
| bitquery api docs | 31 | 41 | **75.61%** | **1** |

**Insights:**
- Pumpfun/Pump Swap and Polymarket queries drive large volumes but differ sharply in CTR.
- Branded terms ("bitquery docs", "bitquery api docs") rank #1 with very high CTR.
- "Pumpswap api" shows strong CTR (19.33%) and position (1.78) — a model for other API pages.

---

## 4. Top Performing Pages

| Page | Clicks | Impressions | CTR | Position |
|------|--------|-------------|-----|----------|
| Polymarket API (main) | 1,116 | 534,923 | 0.21% | 7.52 |
| Pump-Fun API | 1,017 | 316,932 | 0.32% | 6.62 |
| Pump Swap API | 426 | 92,077 | 0.46% | 6.55 |
| Pump fun → Pump swap | 372 | 450,134 | **0.08%** | 5.91 |
| Polymarket Get Market Data | 282 | 87,635 | 0.32% | 7.42 |
| Pancake Swap API | 232 | 32,338 | 0.72% | 10.39 |
| Crypto Price API intro | 227 | 112,860 | 0.20% | 9.75 |
| Letsbonk API | 213 | 42,171 | 0.51% | 5.9 |
| TradingView getting started | 204 | 66,414 | 0.31% | 8.97 |
| Homepage | 203 | 19,696 | 1.03% | 3.13 |

---

## 5. Critical Issues

### 5.1 High Impressions, Very Low CTR (Title/Description Optimization)

These pages receive massive traffic but convert poorly in SERPs:

| Page | Impressions | CTR | Position | Issue |
|------|-------------|-----|----------|-------|
| Polymarket API (main) | 534,923 | 0.21% | 7.52 | Generic title, weak differentiation |
| Pump fun → Pump swap | 450,134 | **0.08%** | 5.91 | Likely confusing or unclear snippet |
| Polymarket CTF Exchange | 377,216 | **0.03%** | 4.62 | Technical title, low appeal |
| Pump-Fun Marketcap/Bonding Curve | 203,981 | **0.07%** | 5.11 | Long title, unclear value |
| Solana Raydium DEX API | 112,877 | **0.06%** | 9.83 | Generic "API" title |

**Recommendation:** Rewrite titles and meta descriptions for these pages to:
1. Lead with the main benefit or outcome (e.g., "Real-time pump.fun token migration tracking").
2. Include primary keywords near the start.
3. Keep meta descriptions under 155 characters and action-oriented.

### 5.2 Missing SEO Metadata

- About **~140 docs** have explicit `<meta name="description">` tags.
- **~350+ docs** (including graphql-reference and many use-case pages) appear to rely on Docusaurus defaults or have no custom meta.
- `intro.md` (main docs overview) has no custom title/description.

**Recommendation:** Add structured frontmatter and/or `<head>` meta blocks for:
1. All main landing/category pages.
2. Top 50 pages by impressions (from GSC).
3. All new docs going forward.

### 5.3 Content Gaps (High Volume, 0 Clicks or Poor Position)

| Query | Impressions | Clicks | Position | Gap |
|-------|-------------|--------|----------|-----|
| dexscreener api documentation | 6,905 | 0 | 7.73 | No focused landing page |
| pump.fun program id solana | 4,066 | 0 | 9.15 | Needs dedicated section |
| polymarket api documentation 2026 | 3,078 | 0 | 7.65 | Freshness/date in content |
| tradingview api | 16,860 | 15 | 9.56 | Low CTR, could improve with clearer content |
| solana api | 1,263 | 14 | 15.61 | Solana overview could be stronger |
| dex api | 151 | 3 | 10.62 | Generic; needs stronger hub page |

**Recommendation:** Create or update targeted pages for these queries (e.g., "DEXScreener API Docs", "Pump.fun Program ID Reference", "Polymarket API 2026 Guide").

---

## 6. Technical SEO

### 6.1 Current Setup (Docusaurus)

| Element | Status | Notes |
|---------|--------|------|
| Sitemap | ✅ | `sitemap.xml`, changefreq daily, custom URLs added |
| Sitemap exclusions | ⚠️ | `graphql-reference/**` excluded — consider partial inclusion |
| Canonical URLs | ✅ | Via Docusaurus defaults |
| Trailing slashes | ✅ | `trailingSlash: true` |
| Google Analytics | ✅ | G-ZWB80TDH9J |
| Google Tag Manager | ✅ | GTM-5GC69JH6 |
| robots.txt | — | Not in `static/`; Docusaurus may generate at build |
| Schema.org (JSON-LD) | ❓ | Not explicitly configured |

**Recommendation:**
- Evaluate including top graphql-reference pages in sitemap.
- Consider Document schema (e.g., `@type: "TechArticle"`) for key API docs.

### 6.2 Redirects

- Many redirects from old paths (`/examples/`, `/category/`) to new ones.
- No obvious 404s in the redirect map.

### 6.3 Mobile & Performance

- Not fully audited in this report; recommend using Lighthouse and PageSpeed Insights for Core Web Vitals.

---

## 7. Meta Tag Patterns

### 7.1 Recommended Structure for Docs

```yaml
---
title: "Page Title - Primary Keyword | Bitquery"
description: "60-155 chars: benefit + keywords + CTA"
keywords:
  - primary keyword
  - secondary keyword
  - related term
---
<head>
  <meta name="title" content="Page Title - Primary Keyword | Bitquery" />
  <meta name="description" content="..." />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <meta property="twitter:card" content="summary_large_image" />
</head>
```

### 7.2 Pages Needing Priority Metadata

From GSC and structure:

1. **intro.md** – Main docs entry point.
2. **Polymarket API** – `/docs/examples/polymarket-api/`.
3. **Pump fun → Pump swap** – `/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/`.
4. **Polymarket CTF Exchange** – `/docs/examples/polymarket-api/polymarket-ctf-exchange/`.
5. **Solana Raydium DEX API** – `/docs/blockchain/Solana/Solana-Raydium-DEX-API/`.
6. **Homepage** – `docusaurus.config.js` (title, tagline used as meta).
7. **Category pages** – Prediction markets, DEX trades, etc.

---

## 8. Action Plan (Priority Order)

### P0 – Immediate

1. **Optimize titles and descriptions** for the five highest-impression, lowest-CTR pages:
   - Polymarket API (main)
   - Pump fun → Pump swap
   - Polymarket CTF Exchange
   - Pump-Fun Marketcap/Bonding Curve
   - Solana Raydium DEX API

2. **Add SEO meta** to `intro.md` and the main docs landing page.

### P1 – Short term (1–2 weeks)

3. Add meta tags to the **top 30 pages by impressions**.
4. Create or update pages for:
   - DEXScreener API documentation
   - Pump.fun program ID reference
   - Polymarket API 2026 / documentation guide

5. Review sitemap scope (including graphql-reference for high-traffic pages).

### P2 – Medium term

6. Add meta tags to **all remaining docs** (template + batch update).
7. Add Document / TechArticle schema where relevant.
8. Add internal links from hub pages (e.g., Solana overview) to specific API docs.
9. Monitor GSC for new high-impression, low-CTR queries and iterate.

---

## 9. Keyword Themes to Reinforce

From GSC, these themes are important and should appear in titles, H1s, and descriptions:

- **Pumpfun / Pump Swap** – pumpfun api, pump.fun api, pumpswap, pump fun api documentation.
- **Polymarket** – polymarket api, polymarket data, polymarket analytics, polymarket historical data.
- **Bitquery brand** – bitquery, bitquery docs, bitquery api, bitquery polymarket.
- **DEX APIs** – pancakeswap api, gmgn api, raydium api, dexscreener api.
- **TradingView** – tradingview api, tradingview subscription, custom datafeed.
- **Solana** – solana api, solana dex, solana shredstream, solana token holders.

---

## 10. Tracking Recommendations

- Use GSC to track:
  - CTR by page and query.
  - Average position for target keywords.
  - Impression growth for new/updated pages.
- Set up simple dashboards (e.g., in Sheets) for top 50 pages and top 50 queries.

---

*Audit based on GSC data from `keywords/docs.bitquery.io-Performance-on-Search-2026-03-13/` and review of the Docusaurus configuration and doc structure.*
