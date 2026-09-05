---
title: "Robinhood Chain API: Trades, Pons Launchpad and Real-Time Streams"
description: "Robinhood Chain API (chain ID 4663): trades, transfers, balances, holders, liquidity, events, calls and the Pons launchpad via Bitquery GraphQL and WebSocket."
sidebar_position: 0
keywords:
  - Robinhood Chain API
  - Robinhood Chain data API
  - Robinhood Chain 4663
  - Robinhood Chain chain ID
  - Robinhood Chain GraphQL API
  - Robinhood Chain WebSocket
  - Robinhood Chain Kafka stream
  - Robinhood Chain launchpad API
  - Robinhood Chain launchpads
  - Pons launchpad API
  - Pons launchpad Robinhood Chain
  - Pons API
  - pools.trade API
  - Flap.sh Robinhood Chain
  - trench.today API
  - Klik Finance Robinhood Chain
  - Robinhood Chain Uniswap v4
  - Robinhood Chain new pools API
  - Robinhood Chain trending tokens API
  - Robinhood Chain token launches
  - Robinhood Chain memecoin API
  - Robinhood Chain holders API
  - Robinhood Chain liquidity API
  - Robinhood Chain explorer API
  - Arbitrum Orbit Robinhood Chain
  - Bitquery Robinhood API
---

import FAQ from "@site/src/components/FAQ";

# Robinhood Chain API: Trades, Pons Launchpad and Real-Time Streams

**Robinhood Chain** (`network: robinhood`, chain ID **4663**) is Robinhood's EVM Layer 2, built with the Arbitrum Orbit stack and live on mainnet since July 2026. Gas is paid in ETH, the chain carries the **USDG** stablecoin and Robinhood's **tokenized stocks and ETFs**, and it hosts a dense cluster of meme-coin launchpads, led by **Pons**. Bitquery indexes the whole chain — blocks, transactions, internal calls, decoded events, token transfers, balances, DEX trades and pool liquidity — and serves it through one GraphQL endpoint where any query can run as a live WebSocket stream.

This page is the map. Use it to pick the cube that answers your question, then jump to the linked guide. The **[Pons Launchpad API](#pons)** has its own section below because it is the launchpad developers ask about most.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

---

## Robinhood Chain at a glance {#network-facts}

| Property | Value |
| --- | --- |
| Bitquery network name | `robinhood` in `EVM(network: robinhood)`; `bid:robinhood` in the `Trading` cubes |
| Chain ID | `4663` |
| Stack | EVM, Arbitrum Orbit rollup |
| Gas token | ETH |
| Public explorer | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) — Bitquery is an indexed data API, not an explorer or an RPC node |
| WETH | `0x0bd7d308f8e1639fab988df18a8011f41eacad73` |
| USDG (Global Dollar, 6 decimals) | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` |
| Uniswap v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` — the chain-wide v4 singleton that Pons and pools.trade pools route through |
| GraphQL endpoint | `https://streaming.bitquery.io/graphql` for queries and subscriptions |

---

## Quick start: stream every trade on Robinhood Chain {#quick-start}

The `Trading` cubes carry live swaps with USD prices for Robinhood Chain and eight other chains in one schema. Paste this into the [Bitquery IDE](https://ide.bitquery.io) to watch the network trade in real time:

```graphql
subscription {
  Trading {
    Trades(
      where: {Pair: {Market: {NetworkBid: {is: "bid:robinhood"}}}}
    ) {
      Block { Time }
      Trader { Address }
      Pair {
        Token { Name Symbol Address }
        QuoteToken { Name Symbol Address }
      }
      Amounts { Base Quote }
      AmountsInUsd { Base }
    }
  }
}
```

Change `subscription` to `query`, add `limit: {count: 10}` and `orderBy: {descending: Block_Time}`, and the same selection set returns the latest trades instead. Prices, OHLCV candles, market cap, whale trades and top-trader leaderboards are on the [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) page.

:::tip Trading cubes for live data, DEXTrades for deep history
`Trading.Trades` / `Tokens` / `Pairs` cover real-time plus roughly the last 30 days with USD pricing baked in. Use the chain-level `DEXTrades` cube for older history or when you need the call and event context around a swap. See the [Trading data overview](/docs/trading/trading-data-overview/).
:::

---

## Pick the right API {#pick-the-right-api}

| What you want | Use this | Guide |
| --- | --- | --- |
| Live swaps, USD prices, OHLCV, market cap, top traders | `Trading` cubes; `DEXTrades` for older history | [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) |
| New pools, trending tokens, pair lookup, token search | `Events` (`Initialize`, `PoolCreated`) and `Trading` cubes | [New Pools & Trending Tokens API](/docs/blockchain/robinhood/robinhood-new-pools-trending) |
| Every new token, across all launchpads | `Transfers` (launch mints) and `Events` | [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) |
| Pons launches, curve trades, graduations, liquidity lock | `Events`, `Calls`, `Trading` | [Pons Launchpad API](/docs/blockchain/robinhood/pons-api) |
| Who sent what to whom, whale alerts, wallet ledgers | `Transfers` | [Robinhood Transfers API](/docs/blockchain/robinhood/robinhood-transfers) |
| A wallet's portfolio and balance history | `Balances` | [Robinhood Balances API](/docs/blockchain/robinhood/robinhood-balances-api) |
| Holder rankings, counts and distribution | `Holders` | [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api) |
| Total supply of a token or watchlist | `TransactionBalances` | [Robinhood Token Supply API](/docs/blockchain/robinhood/robinhood-token-supply) |
| Pool reserves, TVL, per-swap slippage | `DEXPools` | [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity) |
| Any decoded contract event, an `eth_getLogs` replacement | `Events` | [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api) |
| Method calls, internal traces, contract deployments, reverts | `Calls` | [Robinhood Calls & Traces API](/docs/blockchain/robinhood/robinhood-calls-api) |
| Transactions, receipts, status, gas and fees | `Transactions` | [Robinhood Transactions & Receipts API](/docs/blockchain/robinhood/robinhood-transactions-receipts-api) |
| Perp margin deposits and withdrawals on Lighter | `Transfers`, `Events`, `Calls` | [Lighter Perp DEX API](/docs/blockchain/robinhood/lighter-perp-dex-api) |

---

## Pons Launchpad API on Robinhood Chain {#pons}

**[Pons](https://www.ponsfamily.com/launchpad)** (Pons Family) is the bonding-curve launchpad on Robinhood Chain. Every launch mints a fixed **1 billion** supply into its own curve contract. Traders buy and sell against that curve until it takes in its graduation threshold (**4.2 ETH** for native-quoted launches; a per-asset amount for other quotes), at which point the curve is swept, the proceeds seed a **Uniswap v4 pool behind the Pons meme hook**, and the liquidity position is **permanently locked**. A creator can quote a launch in **ETH, USDG, cbBTC, or a tokenized stock or ETF** such as TSLA, NVDA or SPY.

The [Pons Launchpad API guide](/docs/blockchain/robinhood/pons-api) covers the full lifecycle with runnable queries:

- **New launches** — the decoded `TokenLaunched` event, a `Calls`-based launch feed with full archive history, and the on-chain token metadata (name, symbol, image, description, socials). See [Newly launched tokens](/docs/blockchain/robinhood/pons-api#newly-launched-tokens) and [Token metadata](/docs/blockchain/robinhood/pons-api#token-metadata).
- **Bonding-curve trades** — `CurveBuy` and `CurveSell` events with snipe-tax fields, plus the same trades as `Protocol: pons_v2` rows in the `Trading` cube for USD prices and OHLCV. See [Bonding-curve trades](/docs/blockchain/robinhood/pons-api#bonding-curve-trades).
- **Graduations** — `LaunchSwept` and `PoolGraduated`, the graduated v4 pool, and how to find the Pons pool of one token without picking up copycat pools. See [Graduation](/docs/blockchain/robinhood/pons-api#graduation).
- **Locked liquidity** — verifying the lock in `PonsV2LaunchLocker`. See [Verifying the Pons liquidity lock](/docs/blockchain/robinhood/pons-api#liquidity-lock).
- **Contract addresses and event reference** — every factory, curve, hook, router and locker event with its topic0. See [Contract addresses](/docs/blockchain/robinhood/pons-api#contract-addresses) and [Event reference](/docs/blockchain/robinhood/pons-api#event-reference).
- **After graduation** — holders, supply, pool liquidity and slippage for graduated tokens. See [Holders and supply](/docs/blockchain/robinhood/pons-api#holders-and-supply).

| Pons V2 contract | Address |
| --- | --- |
| Launch factory (`PonsV2LaunchFactory`) | `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e` |
| Launch router (`PonsV2LaunchAndBuy`) | `0xe33e9e479df8802cb0866d5d05258bec4cf62948` |
| Meme hook (`PonsV2MemeHook`), on every graduated pool | `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044` |
| Launch locker (`PonsV2LaunchLocker`) | `0x267444d099b10fb5ed7c3cc7b7c767adca574952` |
| Bonding curve | one contract per token — the receiver of the launch mint |

Stream every new Pons launch as it happens:

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: {
        Call: {
          To: {in: [
            "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e",
            "0xe33e9e479df8802cb0866d5d05258bec4cf62948"
          ]}
          Input: {startsWith: ["0xf35abbcf", "0xa72101af", "0xf85f8e41"]}
          Success: true
        }
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Call { To Value Input Output }
    }
  }
}
```

`Transaction.From` is the creator, and the first two 32-byte words of `Call.Output` are the new token and its curve. The [guide](/docs/blockchain/robinhood/pons-api#newly-launched-tokens) explains the selectors, the decoding, and why `launchTokenFor` is deliberately left out of the filter.

:::caution Pons and pools.trade are opposites
Pons has a real bonding curve and a graduation event. [pools.trade](/docs/blockchain/robinhood/pools-trade-api) tokens trade in a Uniswap v4 pool from block one with no curve and no graduation. Queries written for one return nothing on the other — see [How Pons differs from pools.trade](/docs/blockchain/robinhood/pons-api#pons-vs-poolstrade).
:::

---

## Other launchpads on Robinhood Chain {#launchpads}

Robinhood Chain launchpads are **not interchangeable**. Each has its own factory contracts, its own event signatures, and a different relationship to the DEX it trades on. Four more have dedicated guides:

| Launchpad | Model | Guide |
| --- | --- | --- |
| **pools.trade** | Uniswap v4 pool from block one, no curve and no graduation event; Crowd Launch auctions | [Pools.trade API on Robinhood](/docs/blockchain/robinhood/pools-trade-api) |
| **Flap.sh** | Bonding curve with per-token tax and progress events, graduates to a DEX; emits a decoded `TokenCreated` | [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api) |
| **trench.today** | Bonding-curve launchpad run from a single factory proxy; `TokenCreate`, `TokenPurchase`, `TokenSale` and `Sync` events expose launches, trades and live curve reserves | [trench.today API on Robinhood](/docs/blockchain/robinhood/trench-today-api) |
| **Bags.fm** | Creator-fee launchpad | [Bags.fm API on Robinhood](/docs/blockchain/robinhood/bags-fm-api) |

For a **cross-launchpad feed** — every new token on the network regardless of which factory minted it — use the [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches). It also carries per-launchpad launch queries for [hood.fun](/docs/blockchain/robinhood/robinhood-meme-coin-launches#hoodfun), [LaunchHood](/docs/blockchain/robinhood/robinhood-meme-coin-launches#launchhood), [Virtuals](/docs/blockchain/robinhood/robinhood-meme-coin-launches#virtuals), [Klik Finance](/docs/blockchain/robinhood/robinhood-meme-coin-launches#klik-finance), [Doppler](/docs/blockchain/robinhood/robinhood-meme-coin-launches#doppler-airlock) (the Airlock that Bankr and other front-ends launch through), [Ape.store](/docs/blockchain/robinhood/robinhood-meme-coin-launches#apestore) and [Clanker](/docs/blockchain/robinhood/robinhood-meme-coin-launches#clanker), and a query that [compares launch activity across launchpads](/docs/blockchain/robinhood/robinhood-meme-coin-launches#compare-launchpad-activity).

:::tip Feed for discovery, launchpad page for depth
The cross-launchpad feed answers *"what launched?"*. The per-launchpad guides answer *"what is this token doing?"* — curve trades, graduation progress, fee splits and pool state. Most production pipelines use the feed for discovery and one launchpad guide for depth.
:::

---

## Perpetual futures: Lighter on Robinhood Chain {#perps}

[Lighter](https://lighter.xyz) is the perp DEX behind in-app perpetuals in Robinhood Wallet. Its ZkLighter rollup contract lives on Robinhood Chain and receives every USDG margin deposit, pays every withdrawal, and records the rollup's batch lifecycle. The [Lighter Perp DEX API](/docs/blockchain/robinhood/lighter-perp-dex-api) shows how to track deposits, withdrawals, batch commits and the contract's flow history.

---

## Real-time streams: WebSocket, Kafka and MCP {#streaming}

- **WebSocket** — every query on every page above runs as a subscription: swap `query` for `subscription` and keep the same selection set. See [WebSocket subscriptions](/docs/subscriptions/websockets/) and [authorizing a WebSocket connection](/docs/authorization/websocket/).
- **Kafka** — for firehose-scale workloads, Robinhood Chain is published as protobuf topics: `robinhood.transactions.proto` (transactions, calls, events), `robinhood.tokens.proto` (transfers, balances), `robinhood.dextrades.proto` (DEX trades), `robinhood.dexpools.proto` (pool liquidity) and `robinhood.raw.proto` (raw blocks). See [Kafka streaming concepts](/docs/streams/kafka-streaming-concepts/) and the [streams overview](/docs/streams/).
- **MCP** — the [Bitquery MCP server](/docs/mcp/mcp-server/) exposes Robinhood Chain trades, prices and wallet history to AI agents alongside the other Trading-cube chains.

---

## Datasets and history {#datasets}

Robinhood Chain queries accept a `dataset` argument that decides how far back you can reach and how fresh the tail is.

- [`realtime`](/docs/graphql/dataset/realtime) — lowest latency, holds only the most recent days
- [`archive`](/docs/graphql/dataset/archive) — history back to when Bitquery started indexing Robinhood Chain, higher latency
- [`combined`](/docs/graphql/dataset/combined) — both, stitched
- [Data coverage and retention](/docs/graphql/data-coverage-retention) — what each window actually holds

Two rules of thumb. If a query works on recent data but returns nothing for older blocks, the dataset argument is almost always the reason. And a few cubes — `Transactions`, `DEXPools` and `TransactionBalances` — are realtime-only on Robinhood Chain; each guide's dataset section says what applies to it.

History is sold per chain. The free trial includes complete history; paid self-service plans are real-time only and add it through the Robinhood archive add-on on the [pricing page](https://bitquery.io/pricing), which unlocks `archive` and `combined` on `DEXTrades`, `DEXTradeByTokens`, `Calls` and `Events`. A second add-on covers historical `Transfers`, `Balances` and `Holders`. The Pons guide's [historical data section](/docs/blockchain/robinhood/pons-api#historical-data) walks through it.

---

<FAQ
  title="FAQ"
  items={[
    { q: "Is Robinhood Chain EVM-compatible, and what is its chain ID?", id: "is-robinhood-chain-evm-compatible-and-what-is-its-chain-id", a: "Yes. Robinhood Chain is an EVM Layer 2 built with Arbitrum Orbit, chain ID 4663, with gas paid in ETH. In Bitquery it is EVM(network: robinhood), and bid:robinhood in the Trading cubes. Solidity ABIs, topic0 hashes and 4-byte selectors work exactly as they do on Ethereum.",
      answer: <p>{"Yes. Robinhood Chain is an EVM Layer 2 built with Arbitrum Orbit, chain ID "}<strong>{"4663"}</strong>{", with gas paid in ETH. In Bitquery it is "}<code>{"EVM(network: robinhood)"}</code>{", and "}<code>{"bid:robinhood"}</code>{" in the "}<code>{"Trading"}</code>{" cubes. Solidity ABIs, topic0 hashes and 4-byte selectors work exactly as they do on Ethereum."}</p> },
    { q: "Does Bitquery have a Pons API?", id: "does-bitquery-have-a-pons-api", a: "Yes. The Pons Launchpad API covers new launches, bonding-curve trades, snipe tax, graduations, the liquidity lock, contract addresses and the full event reference, and Pons curve trades also appear as Protocol: pons_v2 rows in the Trading cube with USD prices. The Pons section above has the contract addresses and a live launch stream. The guide documents Pons V2 (PonsV2LaunchFactory); the V1 factory (PonsLaunchFactory) is a different protocol with different event signatures, called out in the same guide.",
      answer: <p>{"Yes. The "}<a href="/docs/blockchain/robinhood/pons-api">{"Pons Launchpad API"}</a>{" covers new launches, bonding-curve trades, snipe tax, graduations, the liquidity lock, contract addresses and the full event reference, and Pons curve trades also appear as "}<code>{"Protocol: pons_v2"}</code>{" rows in the "}<code>{"Trading"}</code>{" cube with USD prices. The "}<a href="#pons">{"Pons section above"}</a>{" has the contract addresses and a live launch stream. The guide documents "}<strong>{"Pons V2"}</strong>{" ("}<code>{"PonsV2LaunchFactory"}</code>{"); the V1 factory ("}<code>{"PonsLaunchFactory"}</code>{") is a different protocol with different event signatures, called out in the same guide."}</p> },
    { q: "How do I get every new token launched on Robinhood Chain?", id: "how-do-i-get-every-new-token-launched-on-robinhood-chain", a: "Use the cross-launchpad stream on the Robinhood Meme Coin Launches API page for discovery, then the launchpad's own guide (Pons, pools.trade, Flap.sh, trench.today, Bags.fm) for curve trades, graduation and pool state.",
      answer: <p>{"Use the cross-launchpad stream on the "}<a href="/docs/blockchain/robinhood/robinhood-meme-coin-launches">{"Robinhood Meme Coin Launches API"}</a>{" page for discovery, then the launchpad's own guide ("}<a href="/docs/blockchain/robinhood/pons-api">{"Pons"}</a>{", "}<a href="/docs/blockchain/robinhood/pools-trade-api">{"pools.trade"}</a>{", "}<a href="/docs/blockchain/robinhood/flap-sh-api">{"Flap.sh"}</a>{", "}<a href="/docs/blockchain/robinhood/trench-today-api">{"trench.today"}</a>{", "}<a href="/docs/blockchain/robinhood/bags-fm-api">{"Bags.fm"}</a>{") for curve trades, graduation and pool state."}</p> },
    { q: "Is this the Robinhood brokerage trading API?", id: "is-this-the-robinhood-brokerage-trading-api", a: "No. These pages document on-chain data for Robinhood Chain, the public blockchain. They do not place stock or crypto orders in a Robinhood account, and they do not cover Robinhood's off-chain products such as prediction markets.",
      answer: <p>{"No. These pages document "}<strong>{"on-chain data for Robinhood Chain"}</strong>{", the public blockchain. They do not place stock or crypto orders in a Robinhood account, and they do not cover Robinhood's off-chain products such as prediction markets."}</p> },
    { q: "Does Bitquery provide a Robinhood Chain RPC endpoint or block explorer?", id: "does-bitquery-provide-a-robinhood-chain-rpc-endpoint-or-block-explorer", a: "No. Bitquery is an indexed data API; the public explorer is robinhoodchain.blockscout.com. Every explorer lookup has an API equivalent here, and each is queryable in bulk and streamable: address history (Transfers, Balances), token holders (Token Holders), transaction receipts (Transactions & Receipts), contract logs (Events) and internal traces (Calls).",
      answer: <p>{"No. Bitquery is an indexed data API; the public explorer is "}<a href="https://robinhoodchain.blockscout.com">{"robinhoodchain.blockscout.com"}</a>{". Every explorer lookup has an API equivalent here, and each is queryable in bulk and streamable: address history ("}<a href="/docs/blockchain/robinhood/robinhood-transfers">{"Transfers"}</a>{", "}<a href="/docs/blockchain/robinhood/robinhood-balances-api">{"Balances"}</a>{"), token holders ("}<a href="/docs/blockchain/robinhood/robinhood-token-holders-api">{"Token Holders"}</a>{"), transaction receipts ("}<a href="/docs/blockchain/robinhood/robinhood-transactions-receipts-api">{"Transactions & Receipts"}</a>{"), contract logs ("}<a href="/docs/blockchain/robinhood/robinhood-events-api">{"Events"}</a>{") and internal traces ("}<a href="/docs/blockchain/robinhood/robinhood-calls-api">{"Calls"}</a>{")."}</p> },
    { q: "Can I get new pools, trending tokens and pair lookups for Robinhood Chain, like GeckoTerminal or DexScreener?", id: "can-i-get-new-pools-trending-tokens-and-pair-lookups-for-robinhood-chain-like-geckoterminal-or-dexscreener", a: "Yes \u2014 the New Pools & Trending Tokens API maps each of those endpoints to a Bitquery query: new pools from the Uniswap v4 Initialize and v3 PoolCreated events, trending tokens and pools from the Trading cubes, plus pair lookup by pool address and token search by symbol or name. Pool reserves and TVL are on the Liquidity API.",
      answer: <p>{"Yes \u2014 the "}<a href="/docs/blockchain/robinhood/robinhood-new-pools-trending">{"New Pools & Trending Tokens API"}</a>{" maps each of those endpoints to a Bitquery query: new pools from the Uniswap v4 "}<code>{"Initialize"}</code>{" and v3 "}<code>{"PoolCreated"}</code>{" events, trending tokens and pools from the "}<code>{"Trading"}</code>{" cubes, plus pair lookup by pool address and token search by symbol or name. Pool reserves and TVL are on the "}<a href="/docs/blockchain/robinhood/robinhood-liquidity">{"Liquidity API"}</a>{"."}</p> },
    { q: "How far back does Robinhood Chain data go?", id: "how-far-back-does-robinhood-chain-data-go", a: "The archive dataset reaches back to when Bitquery began indexing the chain, and the Trading cubes hold roughly the last 30 days. The realtime dataset holds only the most recent days, so add dataset: archive or dataset: combined to any historical query. Details are on the data coverage and retention page.",
      answer: <p>{"The "}<code>{"archive"}</code>{" dataset reaches back to when Bitquery began indexing the chain, and the "}<code>{"Trading"}</code>{" cubes hold roughly the last 30 days. The "}<code>{"realtime"}</code>{" dataset holds only the most recent days, so add "}<code>{"dataset: archive"}</code>{" or "}<code>{"dataset: combined"}</code>{" to any historical query. Details are on the "}<a href="/docs/graphql/data-coverage-retention">{"data coverage and retention"}</a>{" page."}</p> },
  ]}
/>
