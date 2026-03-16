# Deep SEO Audit & Implementation Plan
## Bitquery Docs (docs.bitquery.io)

**Audit date:** February 2026  
**Data source:** Google Search Console (keywords/ folder)  
**Methodology:** GSC analysis, codebase review, content structure, internal linking, technical SEO

---

## Part 1: Deep Audit Findings

### 1.1 SERP & CTR Analysis (GSC)

#### Query Clusters & Opportunity Matrix

| Cluster | Top Queries | Total Impressions (est.) | Avg CTR | Avg Pos | Priority |
|---------|-------------|---------------------------|---------|---------|----------|
| **Polymarket** | polymarket api, polymarket api documentation, polymarket docs | ~90K+ | 0.04–0.43% | 7–8 | High |
| **Pump.fun / PumpSwap** | pumpfun api, pump fun api, pumpswap, pump.fun api | ~40K+ | 2–19% | 2–7 | High (already strong) |
| **TradingView** | tradingview api, tradingview api key | ~17K | 0.09–1.66% | 6–9 | Medium |
| **DEXScreener** | dexscreener api, dexscreener api documentation | ~7K | 0–0.41% | 7–9 | Medium |
| **Solana** | solana api, solana shredstream, solana dex | ~3K | 0.06–1.11% | 7–15 | Medium |
| **Raydium** | raydium api, raydium launchpad | ~11K | 0.06–2.16% | 7–11 | Medium |

#### Quick-Win Queries (Position 4–8, CTR &lt; 1%)

These rank well but underperform in CTR. Title/description optimization likely to yield 2–3x CTR gain:

- **polymarket api** (43,978 impr, 0.43% CTR, pos 8.56)
- **polymarket api documentation** (23,435 impr, 0.04% CTR, pos 8.45)
- **polymarket docs** (6,067 impr, 0.16% CTR, pos 4.73)
- **dexscreener api** (6,327 impr, 0.41% CTR, pos 9.07)
- **crypto price api** (1,559 impr, 1.35% CTR, pos 6.18)
- **tradingview api** (16,860 impr, 0.09% CTR, pos 9.56)

#### Zero-Click Queries (High volume, 0 clicks)

Create or strengthen content for:

| Query | Impressions | Position | Action |
|-------|-------------|----------|--------|
| dexscreener api documentation | 6,905 | 7.73 | Create DEXScreener API landing + canonical |
| pump.fun program id solana | 4,066 | 9.15 | Add dedicated "Program ID" section to Pump-Fun API |
| polymarket api documentation 2026 | 3,078 | 7.65 | Add year/date to Polymarket API meta + intro |
| solana api | 1,263 | 15.61 | Strengthen Solana index page |
| tradingview chart api | 513 | 25.29 | Create TradingView Chart API hub |
| stablecoin api | 651 | 32.14 | Improve stablecoin APIs category |

---

### 1.2 Content Structure & On-Page SEO

#### H1 Analysis

| Page | Current H1 | Issue |
|------|------------|-------|
| intro.md | "Overview" | Not keyword-rich; "Bitquery API Documentation" would perform better |
| Polymarket API | "Polymarket API - Modern APIs for Prediction Markets" | OK; consider "Polymarket API - Trades, Prices & Market Data" |
| Pump fun → Pump swap | "Understanding Pump.fun: From Launchpad to PumpSwap" | Conceptual; add "API" for SERP intent |
| Solana Raydium DEX | "Solana Raydium API" | Too generic; add benefit ("Trades, Pools, OHLC") |
| Pump-Fun Marketcap/Bonding Curve | "Pump Fun Marketcap & Bonding Curve API" | Long; shorten for title tag |
| intro (graphql) | "Schema Outline" | Not user-facing; low SEO value |

#### Meta Description Gaps

- **~140 docs** have explicit `<meta name="description">`
- **~400+ docs** (graphql-reference, many usecases, category indexes) lack custom meta
- **intro.md** has no title/description in frontmatter
- **Category / generated-index** pages use Docusaurus defaults (generic)

#### Title Tag Best Practices

Pages that rank but have suboptimal titles (from current meta):

1. **Polymarket API** – "Polymarket API - Get Prices, Trades & Market Data" → Consider: "Polymarket API Documentation - Trades, Prices, Market Data | Bitquery"
2. **Pump fun → Pump swap** – Long descriptive title → Shorten for SERP: "Pump.fun to PumpSwap Token Migration API - Real-Time Tracking"
3. **Solana Raydium** – "Solana Raydium API - Latest Liquidity Pools & Trades" → Add "DEX" for query match: "Raydium DEX API - Solana Trades, Pools, OHLC"
4. **Pump-Fun Marketcap** – Meta focuses on bonding curve; title is long → "Pump.fun Bonding Curve & Market Cap API"

---

### 1.3 Internal Linking

#### Strengths

- Many docs link to related APIs (Pump Fun ↔ Four Meme ↔ Moonshot etc.)
- Learning path and start/first-query have good hub structure
- Cross-chain links (e.g., BSC ↔ Solana) exist

#### Gaps

1. **Solana index** (`docs/blockchain/Solana/`) – 89 clicks, 30K impr, 9.66 pos. Should link more prominently to:
   - Pump Fun, PumpSwap, Raydium, Meteora, GMGN, DEXScreener
   - "Solana API" hub for solana api queries

2. **Polymarket hub** – Polymarket API main page should link to:
   - polymarket-ctf-exchange (now polymarket-markets-api)
   - get-market-data
   - prediction-market APIs
   - With anchor text like "Polymarket CTF Exchange", "Polymarket market data"

3. **DEX API hub** – No single "DEX API" or "DEX Trades API" hub. Queries like "dex api", "solana dex api" could use a central page linking to Raydium, Orca, PumpSwap, etc.

4. **Category pages** – `docs/category/prediction-markets/` (93 clicks, 1.33% CTR) performs well; similar hub pages for "DEX APIs", "Solana APIs" could help.

---

### 1.4 URL & Redirects

#### Redirect Chain (Polymarket CTF)

- GSC still shows `polymarket-ctf-exchange` with 377K impressions.
- Redirect: `polymarket-ctf-exchange` → `polymarket-markets-api`
- **Action:** Ensure canonical on polymarket-markets-api points to itself. Google may still show old URL; over time it will consolidate. Consider adding "CTF Exchange" to polymarket-markets-api content/title for query match.
- **get-market-data** (87K impr in GSC) – no matching doc in repo; may be legacy. If URL returns 404, add redirect to polymarket-markets-api or polymarket-api.

#### Duplicate / Near-Duplicate Paths

- **examples/BSC/four-meme-api** redirects to **blockchain/BSC/four-meme-api** ✓
- No other significant duplicate content found.

#### URL Consistency

- Mix of `.md` and `.mdx` (fine for Docusaurus)
- Trailing slashes enabled ✓
- No broken redirects observed in config

---

### 1.5 Technical SEO

| Item | Status | Notes |
|------|--------|------|
| Sitemap | ✅ | changefreq: daily |
| Sitemap exclusions | ⚠️ | `graphql-reference/**` fully excluded; consider including high-traffic schema pages |
| Canonical | ✅ | Docusaurus default |
| robots.txt | ✅ | Docusaurus generates |
| Mobile | ⚠️ | Not audited; recommend Lighthouse |
| Core Web Vitals | ⚠️ | Not audited |
| Schema.org | ❌ | No TechArticle/Document schema on API docs |
| hreflang | N/A | Single locale |

---

### 1.6 Content Depth & Word Count

Spot-check of high-impression pages:

| Page | Est. Word Count | Assessment |
|------|-----------------|------------|
| Polymarket API main | ~800+ | Good depth |
| Pump fun → Pump swap | ~400 | Could add "Program ID" section |
| Solana Raydium DEX | ~2500+ | Long; ensure H2/H3 include keywords |
| Pump-Fun Marketcap | ~2000+ | Good |
| intro.md | ~350 | Thin; add "What you can build" + keyword-rich intro |
| blockchain introduction | ~800+ | Good |

---

## Part 2: Implementation Plan

### Phase 1: P0 – CTR Optimization (Week 1)

**Goal:** Improve CTR on top 5 highest-impression, lowest-CTR pages.

| # | File Path | Change | New Title (≤60 chars) | New Description (≤155 chars) |
|---|-----------|--------|------------------------|------------------------------|
| 1 | `docs/examples/polymarket-api/polymarket-api.md` | Update frontmatter + H1 | "Polymarket API - Trades, Prices, Market Data \| Bitquery" | "Query Polymarket trades, prices, and market data via GraphQL. Real-time prediction market API for developers. Free tier available." |
| 2 | `docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap.md` | Update head meta | "Pump.fun to PumpSwap API - Token Migration Tracking" | "Track Pump.fun token migrations to PumpSwap in real time. Bonding curve progress, graduation events, and DEX data via Bitquery API." |
| 3 | `docs/examples/polymarket-api/polymarket-markets-api.md` | Add/update meta (CTF redirect target) | "Polymarket CTF Exchange & Markets API" | "Query Polymarket conditional token market data, CTF events, and market creation. GraphQL API for prediction markets." |
| 4 | `docs/blockchain/Solana/Pumpfun/Pump-Fun-Marketcap-Bonding-Curve-API.mdx` | Update meta | "Pump.fun Bonding Curve & Market Cap API" | "Get bonding curve progress, market cap, and migration status for Pump.fun tokens. Real-time Solana API with GraphQL." |
| 5 | `docs/blockchain/Solana/Solana-Raydium-DEX-API.mdx` | Update meta + H1 | "Raydium DEX API - Solana Trades, Pools, OHLC" | "Real-time Raydium DEX data on Solana: liquidity pools, trades, OHLC. GraphQL API for Raydium AMM and CLMM." |

### Phase 2: P0 – Critical Meta Gaps (Week 1)

| # | File Path | Change |
|---|-----------|--------|
| 6 | `docs/intro.md` | Add frontmatter: title, description. Add H1 variant: "Bitquery API Documentation - Blockchain Data Platform" |
| 7 | `docs/blockchain/introduction.md` | Verify meta; already has title/description ✓ |

### Phase 3: P1 – Content Gaps (Weeks 2–3)

| # | Task | File(s) | Approach |
|---|------|---------|----------|
| 8 | DEXScreener API docs | Create `docs/blockchain/Solana/DEXScreener/solana_dexscreener.md` or enhance existing | Add H1 "DEXScreener API Documentation", meta targeting "dexscreener api documentation", "dexscreener api" |
| 9 | Pump.fun Program ID | `docs/blockchain/Solana/Pumpfun/Pump-Fun-API.mdx` | Add section "Pump.fun Program ID (Solana)" with program ID `6ef8rrecthr5dkzon8nwu78hrvfckubj14m5ubewf6p` and link from pump-fun-to-pump-swap |
| 10 | Polymarket 2026 freshness | `docs/examples/polymarket-api/polymarket-api.md` | Add "Updated 2026" or "2026 Documentation" in meta description; minor intro text |
| 11 | Solana API hub | `docs/blockchain/Solana/index.mdx` | Strengthen H1 to "Solana API - DEX, Trades, Token Data"; add "Solana API" in meta; internal links to all Solana APIs |
| 12 | TradingView API hub | `docs/usecases/tradingview-subscription-realtime/getting-started.md` | Ensure title/meta include "TradingView API", "TradingView chart API" |

### Phase 4: P1 – Top 30 Pages Meta (Weeks 2–3)

Add or refine meta for these pages (by GSC impressions):

1. `docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api.md` – 65K impr
2. `docs/blockchain/Solana/historical-aggregate-data/` – 114K impr
3. `docs/blockchain/Solana/DEXScreener/solana_dexscreener` – 131K impr
4. `docs/blockchain/Solana/solana-orca-dex-api` – 46K impr
5. `docs/blockchain/Solana/solana-jupiter-api` – 54K impr
6. `docs/blockchain/Solana/raydium-clmm-API` – 51K impr
7. `docs/blockchain/Solana/launchpad-raydium` – 25K impr
8. `docs/usecases/solana-sniper-bot` – 69K impr
9. `docs/blockchain/Solana/token-supply-cube` – 16K impr
10. `docs/examples/polymarket-api/main-polymarket-contract` – 36K impr (redirect target)
11. `docs/examples/polymarket-api/polymarket-markets-api` – 13K impr
12. `docs/blockchain/introduction` – 35K impr
13. `docs/start/starter-queries` – 32K impr
14. `docs/blockchain/Ethereum/dextrades/uniswap-api` – 13K impr
15. `docs/blockchain/Base/aerodrome-gauge-vaults-api` – 14K impr
16. `docs/blockchain/Base/apestore-base-api` – 5K impr
17. `docs/blockchain/Solana/solana-token-holders` – 3K impr
18. `docs/authorisation/how-to-use` – 7K impr
19. `docs/blockchain/Solana/Boop-Fun-API` – 3K impr
20. `docs/graphql/query` – 3K impr
21. `docs/subscriptions/backfilling-subscription` – 2.6K impr
22. `docs/examples/polymarket-api/polymarket-trade-apis` – 2.3K impr
23. `docs/blockchain/Ethereum/dextrades/uniswap-position-api` – 1.6K impr
24. `docs/category/polymarket-api` – 1.1K impr
25. `docs/subscriptions/google-bigquery/bigquery` – 1K impr
26. `docs/blockchain/Solana/solana-nft` – 1K impr
27. `docs/blockchain/BSC/bsc-calls-api` – 937 impr
28. `docs/blockchain/Ethereum/calls/smartcontract-filterby` – 923 impr
29. `docs/grpc/solana/topics/dexpools` – 886 impr
30. `docs/streams/protobuf/kafka-protobuf-js` – 853 impr

### Phase 5: P2 – Internal Linking (Week 4)

| # | Source Page | Add Links To | Anchor Text |
|---|-------------|--------------|-------------|
| 1 | `docs/blockchain/Solana/index.mdx` | Pump Fun, PumpSwap, Raydium, Meteora, GMGN, DEXScreener, Orca, Phoenix | "Pump.fun API", "Raydium DEX API", etc. |
| 2 | `docs/examples/polymarket-api/polymarket-api.md` | polymarket-markets-api, prediction-market-api | "CTF Exchange", "Market data", "Prediction trades" |
| 3 | Create `docs/category/dex-apis/` or strengthen existing | All DEX docs (Raydium, Orca, PumpSwap, PancakeSwap, etc.) | "DEX API", "DEX trades" |
| 4 | `docs/blockchain/introduction.md` | Solana, BSC, Base, Polymarket, Trading | "Solana API", "Polymarket API" |

### Phase 6: P2 – Technical (Week 4–5)

| # | Task | Location | Details |
|---|------|----------|---------|
| 1 | Sitemap | `docusaurus.config.js` | Review `ignorePatterns`; consider including top graphql-reference pages |
| 2 | Schema.org | Custom component or plugin | Add `TechArticle` or `Article` schema for key API docs (Pump Fun, Polymarket, Raydium) |
| 3 | Docusaurus SEO | `docusaurus.config.js` | Add `metadata` array if needed for additional meta |

### Phase 7: P3 – Monitoring & Iteration (Ongoing)

1. **GSC tracking:** Export Queries + Pages monthly; compare CTR and position.
2. **Dashboard:** Track top 50 pages and top 50 queries (Sheets or Looker Studio).
3. **A/B variants:** Test 2 title/description variants on 1–2 high-traffic pages if tools available.
4. **New content:** Apply meta template to all new docs.

---

## Part 3: Meta Tag Template

Use this structure for new and updated docs:

```yaml
---
title: "Primary Keyword - Secondary Benefit | Bitquery"
description: "60-155 chars. Benefit + keywords + optional CTA. E.g.: Get X, Y, Z via GraphQL. Real-time data. Free tier."
keywords:
  - primary keyword
  - api name
  - blockchain
  - use case
---
<head>
  <meta name="title" content="Same as title" />
  <meta name="description" content="Same as description" />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="..." />
  <meta property="twitter:description" content="..." />
</head>
```

**Rules:**
- Title: 50–60 characters, primary keyword first
- Description: 120–155 characters, include benefit + CTA
- H1: Should match or closely align with title
- Keywords: 5–15 terms, include query variants from GSC

---

## Part 4: Summary Checklist

| Phase | Tasks | Est. Effort |
|-------|-------|-------------|
| P0 CTR | 5 page title/description updates | 2–3 hours |
| P0 Meta | intro.md + blockchain intro | 1 hour |
| P1 Content | DEXScreener, Program ID, Solana hub, freshness | 4–6 hours |
| P1 Meta | Top 30 pages meta | 6–8 hours |
| P2 Linking | Internal linking improvements | 2–3 hours |
| P2 Technical | Sitemap, Schema | 2–4 hours |

**Total estimated effort:** 17–25 hours over 4–5 weeks.

---

*Generated from GSC data (keywords/) and codebase review. Update this plan as GSC data refreshes.*
