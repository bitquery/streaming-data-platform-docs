---
title: "Polymarket API vs Bitquery Polymarket API: Which One Should You Use?"
description:
  "A side-by-side comparison of Polymarket's official APIs (CLOB, Gamma, Data, Real-Time Data Socket) and Bitquery's on-chain Polymarket API (GraphQL queries, subscriptions, and Kafka streams on Polygon)."
keywords:
  - Polymarket API
  - Bitquery Polymarket API
  - CLOB API
  - Gamma API
  - Polymarket Data API
  - prediction market API comparison
  - Polymarket GraphQL
  - Polymarket websocket
  - on-chain prediction markets
---
# Polymarket API vs Bitquery Polymarket API

If you are building on Polymarket—whether a dashboard, a trading bot, a research tool, or a wallet leaderboard—you have two very different data stacks to choose from. Polymarket publishes a set of **official REST and WebSocket APIs** that serve the [polymarket.com](https://polymarket.com) application itself. Bitquery offers an **on-chain-derived GraphQL API** for the same Polymarket markets on Polygon, plus subscriptions and Kafka streams.

Both give you Polymarket data. They are built for different jobs. This article walks through what each one does well, what it does not do, and when to combine them.

## TL;DR

The official Polymarket APIs are the right tool when you need to **place orders**, read the **live order book**, or fetch Polymarket's own metadata (events, tags, user profiles, positions, bridge status). Those are off-chain order-book concerns. They are useful for execution and application views, but they stop where the trader's real questions begin.

Bitquery's Polymarket API is the right tool for **traders and researchers**: on-chain-grounded trades, realized P&L, wallet histories, whale filtering, top-trader leaderboards, settlement flows, and cross-market analytics. An off-chain order book can tell you the current bid and your own fills; it cannot tell you **who the best traders on Polymarket are, how much every wallet has won or lost, which markets are seeing whale accumulation, or how flows move between outcomes across the protocol**. That is what on-chain trade data, exposed as GraphQL, subscriptions, and Kafka streams, is for.

In most serious production stacks the two complement each other: CLOB for execution and event/market metadata, Bitquery for trader analytics, P&L, streaming, history, and anything that needs GROUP BY.

## Polymarket's official API surface

Polymarket splits its public surface into three REST APIs plus two WebSocket streams.

The **Gamma API** at gamma-api.polymarket.com is the market-discovery layer. It indexes every event, market, tag, sports category, and series on the platform, and exposes endpoints such as /events, /markets, /public-search, /tags, /series, and /sports, along with lookups by market ID or slug. It requires no authentication, supports filtering by active/closed and tag, sorting by 24h volume, liquidity, start/end date, and returns Polymarket's canonical structure: events are top-level questions, markets are tradable binary outcomes nested inside them. Rate limits are generous for read traffic, at roughly 4,000 requests per 10 seconds overall, with per-endpoint caps such as /events at 500/10s and /markets at 300/10s. Gamma does not serve price history, on-chain balances, or order placement.

The **CLOB API** at clob.polymarket.com is the trading layer. It handles order submission, order-book reads, price history (/prices-history), trade history, and user order management. Authenticated endpoints use API-key credentials derived from wallet signatures (Ethereum/Polygon private key signing with HMAC-SHA256 request signing), while order-book and price endpoints are public. Order submission is rate-limited in the order of 10 requests per second, and WebSocket connections are capped at around 5 concurrent per IP. The CLOB is also where you subscribe to the real-time market and user channels at wss://ws-subscriptions-clob.polymarket.com/ws/market and /ws/user.

The **Data API** at data-api.polymarket.com is the user-data layer. Endpoints like GET /positions, GET /activity, and GET /trades fetch a wallet's current positions (size, average price, cash PnL, % PnL), trade history, and activity feed. Profile fields (name, pseudonym, bio, profile image) are joined inline. Polymarket also runs a public-profile endpoint on Gamma (`GET /public-profile?address=<wallet>`) and a Bridge API for deposits/withdrawals.

Finally, the **Real-Time Data Socket** at wss://ws-live-data.polymarket.com broadcasts activity and trades. In practice it is most useful for fills and order-book deltas; filtering by market_slug or event_slug has known gaps, and Polymarket does not currently support unsubscribing from channels mid-session.

A few characteristics fall out of this design. The official APIs reflect the [polymarket.com](https://polymarket.com) application view: canonical market metadata, your own positions, and real-time fills, at high rate limits. They are tightly scoped to single-entity reads. They do not natively support aggregate queries like "top 100 wallets by Polymarket volume in the last 5 days" or "largest whale trades across every Bitcoin market", and they do not expose on-chain-level fields like transaction hash, block time, log signature, condition ID events, or split/merge settlements in a single query. Historical data depth is whatever the CLOB has persisted, which is fine for order history but less convenient for ad-hoc aggregates.

## Bitquery's Polymarket API

Bitquery takes a different approach. It indexes the Polymarket contracts on Polygon directly, normalizes the events into a GraphQL schema, and exposes the same operations as REST queries, GraphQL subscriptions (WebSocket), or Kafka streams. Every Polymarket query lives under EVM(network: matic) with dataset: realtime, and filters on Marketplace.ProtocolName: "polymarket".

The pages under **`docs/examples/polymarket-api/`** in this repo correspond to these guides:

- [Polymarket API overview](/docs/examples/polymarket-api/polymarket-api/): the entry point, covering the core PredictionTrades query, live subscriptions, whale trades, and top buyers and sellers.
- [Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api/): filter markets by market_slug, condition_id, or token_id through PredictionManagements.
- [Polymarket Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api/): recent trade counts, collateral totals, and distinct-market counts for any wallet, plus guidance on which fields belong to Polymarket's Profile, Gamma, or Bridge APIs.
- [Polymarket Advanced Analytics API](/docs/examples/polymarket-api/polymarket-advanced-analytics-api/): USDC TVL in core contracts, daily volume, maker/taker splits, order flow by market, whale subscriptions, settlement flows, and top markets by volume.
- [Polymarket Sports API](/docs/examples/polymarket-api/polymarket-sports-api/): cricket, sports, and esports markets filtered by ResolutionSource, description, or outcome label.
- [Polymarket Commodity API](/docs/examples/polymarket-api/polymarket-commodity-api/): oil, gold, and commodity-linked prediction markets.
- [Bitcoin Up or Down Polymarket API](/docs/examples/polymarket-api/bitcoin-polymarket-api/): BTC direction markets, live odds, and top winners from settlements.
- [Polymarket Wallet Realized PnL](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/): PnL derived from on-chain fills.

Underneath, Bitquery's primary operations are PredictionTrades (buys and sells with buyer, seller, amount, price, USD-denominated collateral, and full market metadata), PredictionManagements (creation, resolution, and other lifecycle events), and PredictionSettlements (splits, merges, redemptions). Each can be run as a query for history or as a subscription for live streaming; swapping the single keyword is the only change required. For low-latency pipelines, Bitquery also publishes Kafka topics matic.predictions.proto and matic.broadcasted.predictions.proto (mempool), which require separate credentials.

Because everything is GraphQL, aggregations, limitBy, orderBy: descendingByField, and computed expressions (e.g. `calculate(expression: "$buyUSD + $sellUSD")`) are first-class. That is what makes queries like "top 100 Polymarket markets by volume over a window" or "all whale trades above $10k across Polymarket in real time" one query instead of a client-side batch job over the CLOB.

The one caveat is retention on the live endpoint: dataset: realtime holds roughly the **last 7 days**. For longer windows, a **full historical dataset is available via [Bitquery Cloud](/docs/cloud/) on request**, with no need to self-persist the stream.

## Side-by-side comparison

| Capability | Polymarket official APIs | Bitquery Polymarket API |
| --- | --- | --- |
| **Place orders** | Yes, via CLOB /order with signed requests | No (read-only) |
| **Live order book (bids/asks/depth)** | Yes, via CLOB REST + WS market channel | No; trades and settlements, not the L2 book |
| **Event, market, tag, series metadata** | Yes, via Gamma API, canonical | Partial: market ID, question, outcomes, condition ID, resolution source (on-chain derived) |
| **User positions / PnL** | Yes, via Data API /positions | Derivable from trades + settlements; [realized PnL example](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/) |
| **User activity feed** | Yes, via Data API /activity | Yes, via [Wallet API](/docs/examples/polymarket-api/polymarket-wallet-api/) |
| **Price history per token** | Yes, via CLOB /prices-history | Yes, via PredictionTrades with time filter |
| **On-chain fields** (tx hash, block time, log signatures, condition ID events) | Limited | Yes, native on every row |
| **Aggregations** (top N markets by volume, top wallets, maker/taker split) | Client-side | Native GraphQL: sum, count(distinct:), limitBy, orderBy: descendingByField |
| **Whale trade filtering across all markets** | Manual | One subscription; see the [whale trades example](/docs/examples/polymarket-api/polymarket-api/) |
| **Real-time streaming** | WebSocket (ws-subscriptions-clob, ws-live-data), cannot unsubscribe, some filter gaps | GraphQL subscriptions plus Kafka matic.predictions.proto |
| **Settlement (split / merge / redeem) analytics** | Indirect | Native; see [Advanced Analytics](/docs/examples/polymarket-api/polymarket-advanced-analytics-api/) |
| **Cross-market vertical APIs** (sports, commodity, BTC up/down) | Filter manually on Gamma | Purpose-built: [Sports](/docs/examples/polymarket-api/polymarket-sports-api/), [Commodity](/docs/examples/polymarket-api/polymarket-commodity-api/), [Bitcoin Up or Down](/docs/examples/polymarket-api/bitcoin-polymarket-api/) |
| **TVL / USDC custody balances** | Not exposed | Yes, via TransactionBalances on Conditional Tokens + neg-risk collateral |
| **Historical depth** | Full CLOB history | realtime dataset ~last 7 days; full historical dataset available via [Bitquery Cloud](/docs/cloud/) on request |
| **Auth** | API-key + HMAC-SHA256 (CLOB); none (Gamma) | Bitquery API token; Kafka requires separate creds |
| **Rate limits** | 4,000/10s (Gamma), ~10 orders/sec (CLOB) | No data or rate limits on streams; Kafka for enterprise streaming and scaling to 1,000+ simultaneous users |

## When to use which

Reach for the **official APIs** when you are executing orders, showing a user their own positions and PnL as Polymarket displays them, reading live order-book depth for market-making or pricing, pulling the canonical event tree (tags, series, sports categories, cover images, resolution links), or wiring into Polymarket's deposit/withdrawal bridge. These are the authoritative source for "what does [polymarket.com](https://polymarket.com) show right now for this account."

Reach for **Bitquery** when you need GraphQL aggregations, server-side filtering, and on-chain fields in a single request. Typical use cases include:

- Leaderboards of top buyers and sellers by USD volume over a rolling window.
- Whale monitors streaming every trade above a USD threshold across all markets from a single subscription.
- Volume rankings for the top 100 Polymarket markets by buy-plus-sell USD in the last 24 hours.
- Category dashboards for BTC up/down, sports, or commodity markets with live odds.
- Settlement flow analytics using split/merge/redeem totals as a liquidity and open-interest proxy.
- Low-latency pipelines consuming matic.predictions.proto from Kafka for mempool-level insight.
- Cross-wallet clustering for forensic tracing of Polymarket activity.

More advanced (alpha-focused) use cases:

- **Alpha signals from order flow**: net buy-pressure imbalance per market as a directional signal, with USD-weighted buy vs sell sums over rolling windows.
- **Smart-money tracking**: identify historically profitable wallets via realized PnL and copy their live trades through whale subscriptions filtered on Buyer/Seller.
- **Mean-reversion on odds dislocations**: detect markets where outcome price moves sharply against thin liquidity by joining trade size to pre-trade mid-price.
- **Momentum from whale accumulation**: flag condition IDs where top-N wallets turn net-long above a threshold within the last hour.
- **News-vs-odds divergence**: cross-reference ResolutionSource updates against live odds subscriptions to surface mispriced markets around breaking events.
- **Event-driven alpha**: pre-load markets by slug or tag (elections, earnings, fights, matches) and subscribe to whale trades as the event unfolds.
- **Cross-market arbitrage**: correlate implied probabilities between related Polymarket markets (e.g. winner vs margin-of-victory) and flag inconsistent pricing.
- **Settlement/redemption signals**: watch PredictionSettlements for large merges or redeems as a leading indicator that informed traders are closing positions.
- **Mempool front-running detection**: use matic.broadcasted.predictions.proto to spot pending whale trades before they confirm, useful for both MEV research and defensive execution.
- **Cohort-based backtests**: segment wallets by realized-PnL percentile over a window, replay their trades against historical odds, and test whether following the top cohort produces alpha.
- **Liquidity-migration detection**: track USDC TVL changes across Conditional Tokens and neg-risk collateral to flag when capital is rotating between market clusters.
- **Sentiment indices**: roll up weighted outcome probabilities across a category (macro, geopolitics, crypto) into a single index consumable by trading models.
- **Risk and exposure monitoring**: for funds or market makers, aggregate position exposure across every condition ID a wallet has touched in real time.

A reasonable production architecture looks like this:

- **Gamma** for canonical market catalogs.
- **CLOB** for execution and order-book depth.
- **Data API** for user-facing account screens.
- **Bitquery** for analytics, alerting, long-running streams, and any query that needs GROUP BY.

## A practical starting set

If you are new to Bitquery's Polymarket coverage, four queries exercise most of the surface area:

1. The basic recent-trades query from the [Polymarket API overview](/docs/examples/polymarket-api/polymarket-api/), which confirms your API token and shows the shape of a PredictionTrade.
2. The volume-ranking query from the same doc, which demonstrates limitBy, orderBy: descendingByField, and the computed sumBuyAndSell expression.
3. A live whale-trade subscription: swap the query keyword for subscription and filter on `CollateralAmountInUSD: { gt: "10000" }` to push events as they happen.
4. The daily volume and maker/taker split from the [Advanced Analytics page](/docs/examples/polymarket-api/polymarket-advanced-analytics-api/), which shows how far GraphQL takes you before any client-side aggregation is required.

All of these are runnable from the Bitquery IDE (linked inline from each docs page) before you ever issue an API token.

## See it live

If you want a visual reference for what Bitquery's Polymarket data looks like rendered as a live dashboard—showing top markets, whale trades, odds, and volumes—the [DexRabbit Polymarket Predictions dashboard](https://dexrabbit.bitquery.io/polymarket-predictions) runs directly on these APIs. Each panel ships with a "Get API" button that exposes the exact GraphQL query behind the chart, which you can copy into your own stack.

## Bottom line

The two APIs are not rivals; they answer different questions. The official Polymarket APIs tell you **what Polymarket the application knows about your account and the current book**. Bitquery tells you **what actually happened on-chain across every Polymarket market, in a shape you can aggregate, stream, and replay**. Picking the right one, or more often using both, comes down to whether your next query starts with "place this order" or "across all markets…".

## Further reading

Canonical Bitquery Polymarket references:

- [Polymarket API, Trade, Prices & Market Data](/docs/examples/polymarket-api/polymarket-api/)
- [Polymarket Markets API](/docs/examples/polymarket-api/polymarket-markets-api/) for CTF Exchange, condition_id, and token_id lookups
- [Polymarket Wallet & User Activity API](/docs/examples/polymarket-api/polymarket-wallet-api/)
- [Polymarket Advanced Analytics API](/docs/examples/polymarket-api/polymarket-advanced-analytics-api/)

Vertical guides:

- [Polymarket Sports API](/docs/examples/polymarket-api/polymarket-sports-api/)
- [Polymarket Commodity API](/docs/examples/polymarket-api/polymarket-commodity-api/)
- [Bitcoin Up or Down Polymarket API](/docs/examples/polymarket-api/bitcoin-polymarket-api/)
- [Polymarket Wallet Realized PnL](/docs/examples/polymarket-api/polymarket-wallet-realized-pnl/)

Infrastructure and live reference:

- [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/)
- [DexRabbit Polymarket Predictions dashboard](https://dexrabbit.bitquery.io/polymarket-predictions)
