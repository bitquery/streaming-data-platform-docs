---
title: "Bitquery in One Page — Complete Context for AI Assistants"
description: "A single self-contained page describing the Bitquery API: endpoints, chains, cubes, datasets, query rules and worked examples. Paste it into an AI assistant and it can write correct Bitquery queries without reading anything else."
keywords:
  [
    "Bitquery for AI",
    "Bitquery LLM context",
    "blockchain API for AI agents",
    "GraphQL blockchain schema",
    "Bitquery cheat sheet"
  ]
sidebar_position: 2
---

# Bitquery in One Page

This page is written to be handed to an AI assistant. It is deliberately self-contained: no
navigation, no links to click through, every query written out in full. Paste the whole page
into a model's context and it has enough to write correct Bitquery queries, pick the right
endpoint, and avoid the mistakes that produce silently wrong answers.

If you are a human, this also works as a one-screen reference.

---

## 1. What Bitquery is

Bitquery indexes blockchain data — trades, transfers, balances, holders, transactions, events,
contract calls, mempool — and serves it as GraphQL. You do not run nodes. You send a GraphQL
document over HTTP for historical questions, or over WebSocket for a live stream.

There are two generations of the API and **they are different products with different schemas**.
Choosing the wrong one is the single most common mistake.

---

## 2. Endpoints and authentication

| Purpose | Endpoint |
| --- | --- |
| V2 queries | `https://streaming.bitquery.io/graphql` |
| V2 subscriptions | `wss://streaming.bitquery.io/graphql` |
| V1 queries | `https://graphql.bitquery.io` |

Authentication is the same token on both:

```
Authorization: Bearer ory_at_YOUR_TOKEN
Content-Type: application/json
```

For WebSocket, use the `graphql-transport-ws` (or `graphql-ws`) subprotocol and pass the token
either as an `Authorization` header or as `?token=...` on the URL. Send `connection_init`, wait
for `connection_ack`, then send `subscribe`.

**Subscriptions only work over WebSocket.** Posting a `subscription` document to the HTTP
endpoint returns `subscriptions must be sent over a websocket connection, not HTTP`.

---

## 3. Which chain lives on which API

**V2 covers exactly these chains and no others.**

- EVM root, `network:` argument — `eth`, `bsc`, `base`, `arbitrum`, `optimism`, `matic`, `robinhood`
- `Solana` root — Solana
- `Tron` root — Tron
- `Hyperliquid` root — Hyperliquid perpetuals
- `Trading` root — cross-chain prices and trades, no `network` argument

**Everything else is V1 only**: Bitcoin, Litecoin, Bitcoin Cash, Dogecoin, Dash, Zcash,
Cardano, Ripple, Stellar, Algorand, Avalanche, Celo, Fantom, Cronos, Klaytn, Moonbeam.

V1 groups chains under a shared root with a `network` argument:

- `bitcoin(network: bitcoin | litecoin | bitcash | dogecoin | dash | zcash)`
- `ethereum(network: avalanche | celo_mainnet | fantom | cronos | klaytn | moonbeam | ...)`
- `cardano(network: cardano)`, `ripple(network: ripple)`, `stellar(network: stellar)`,
  `algorand(network: algorand)`, `solana(network: solana)`

**Ethereum, BSC, Tron and Polygon are being migrated off V1. Always query them on V2**, even
though the V1 schema still accepts them.

**Root names carry the version.** V1 roots are lowercase — `ethereum(`, `tron(`, `solana(`,
`bitcoin(`. V2 roots are capitalised — `EVM(`, `Tron(`, `Solana(`, `Trading`. If you see a
lowercase root, it is a V1 document and belongs on the V1 endpoint.

**Streaming is a V2 feature.** V1's schema does expose a subscription root, but only
`ethereum(network: ...)`, and there is no documented V1 WebSocket endpoint — use V2 for
anything live. Chains that exist only on V1 and are not in the V1 EVM family — Bitcoin and its
relatives, Cardano, Ripple, Stellar, Algorand — have no GraphQL stream at all.

---

## 4. The cubes — which one answers which question

A "cube" is a top-level dataset. Picking the right cube matters more than writing clever filters.

**`Trading` (cross-chain, no `network` argument)** — the primary source for prices and trades:

- `Trading.Pairs` — OHLC and volume for one trading pair on one market. **Use this to price a
  single token**, with a rank filter (see §6).
- `Trading.Tokens` — OHLC and volume for a token, blended across every pool it trades in.
- `Trading.Currencies` — a currency across all of its token representations and chains.
- `Trading.Trades` — individual normalised trades across chains.

**`EVM(network: ...)`** — `Balances`, `Blocks`, `Calls`, `DEXPoolEvents`, `DEXPoolSlippages`,
`DEXTradeByTokens`, `DEXTrades`, `Events`, `Holders`, `MinerRewards`, `PredictionManagements`,
`PredictionSettlements`, `PredictionTrades`, `TransactionBalances`, `Transactions`, `Transfers`,
`Uncles`.

**`Solana`** — `Blocks`, `DEXOrders`, `DEXPools`, `DEXTradeByTokens`, `DEXTrades`, `Instructions`,
`PerpetualFills`, `PerpetualMarketSummaries`, `PerpetualOrders`, `PerpetualPositions`,
`PerpetualPrices`, `Rewards`, `TokenSupplyUpdates`, `Transactions`, `Transfers`.

Note: **Solana has no `Balances` cube.** Solana balances are derived from `Transfers`.

Quick map from question to cube:

| Question | Cube |
| --- | --- |
| What is this token worth right now? | `Trading.Pairs` with rank 1 |
| Candles for a chart | `Trading.Pairs` (recent) or `DEXTradeByTokens` (older) |
| Every swap on a chain | `EVM.DEXTrades` / `Solana.DEXTrades` |
| Swaps grouped per token | `DEXTradeByTokens` |
| Who holds this token | `EVM.Holders` |
| What does this wallet hold | `EVM.Balances` |
| Token movements | `Transfers` |
| Raw transactions | `Transactions` |
| Decoded logs / contract calls | `Events` / `Calls` |
| Pool reserves, liquidity events | `DEXPoolEvents`, `DEXPools` |
| Pending, not yet mined | any EVM cube with `mempool: true` |

---

## 5. Datasets and how far back data goes

Every V2 root takes a `dataset` argument:

- `realtime` — the recent window. This is the **default** if you omit `dataset`.
- `archive` — deep history.
- `combined` — archive and realtime stitched together.

Retention on `realtime` is short and differs per cube: roughly 12 hours on Solana `DEXTrades`,
about 7 days on Solana `DEXTradeByTokens`, a few days on EVM DEX and transfer cubes, and about
30 days on the `Trading` cubes.

Two things about this cause most "the data is wrong" reports:

1. **`realtime` does not error when you ask beyond its window. It silently returns fewer rows.**
   A chart just starts late. Always check whether the window you asked for is inside retention.
2. **`archive` and `combined` are not deployed for every cube on every chain.** When they are
   not, you get a ClickHouse error like
   `no table can query <Cube> ... consider use realtime dataset`. That is not a bug in your
   query, it means that table does not exist for that chain.

Self-serve plans query `realtime`. Querying `archive` or `combined` needs the historical data
add-on on the plan.

---

## 6. Rules that keep answers correct

These are the mistakes that produce a plausible-looking wrong number rather than an error.

**Price one token with `Pairs` and rank 1, not with `Tokens`.** The `Tokens` price is
volume-weighted across every pool, so a thin pool drags it away from the real market. Add
`Ranking: {Position: {eq: 1}}` to take the token's top market only. Always pair it with
`Price: {IsQuotedInUsd: true}` — the rank filter picks the market, not the denomination.

**In the `Trading` cube, token addresses are stored lowercase and the filter is
case-sensitive.** A checksummed EVM address returns **zero rows and no error**. Lowercase every
address you put in a `Trading` filter.

**Balances are cumulative, so they cannot be answered from `realtime` alone.** A balance read
from the realtime window is the change over the last few hours, not the balance. Use `archive`
or `combined` for anything balance- or holder-shaped. The same applies to holder counts, token
ownership and net worth.

**Use the `Trading` cube for recent data and `DEXTradeByTokens` for older.** The `Trading` cubes
cover roughly the last 30 days. Beyond that, rebuild the same numbers from raw trades with
`DEXTradeByTokens`.

**A bare `EVM` root means Ethereum.** `EVM { ... }` without a `network` argument returns
Ethereum data. Be explicit.

**On V1, always bound a list query by date.** V1 sorts the whole table otherwise and the query
dies with ClickHouse `Code: 241, memory limit exceeded`. V1 has no relative-date filter, so pass
the date as a variable and move it as needed.

**Solana `combined` is currently broken** — every Solana cube returns a 500 on
`dataset: combined`. Use `realtime` for recent and `archive` for history.

**`BalanceUpdates` is being retired.** Do not write new queries against it.

---

## 7. Worked examples

Every query below was executed against the live API before being written down.

### Price of one token, from its top market

```graphql
query ($token: String!, $network: String!) {
  Trading {
    Pairs(
      where: {
        Token: { Address: { is: $token }, Network: { is: $network } }
        Ranking: { Position: { eq: 1 } }
        Interval: { Time: { Duration: { eq: 60 } } }
        Price: { IsQuotedInUsd: true }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 1 }
    ) {
      Token { Symbol Name Address Network }
      QuoteToken { Symbol Address }
      Market { Name Address }
      Price { Ohlc { Open High Low Close } Average { Mean } IsQuotedInUsd }
      Volume { Usd Base Quote }
      Block { Time }
    }
  }
}
```

Variables — note the lowercase address:

```json
{ "token": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "network": "Ethereum" }
```

`Network` accepts `Ethereum`, `Base`, `Binance Smart Chain`, `Arbitrum`, `Optimism`, `Solana`.

### Latest DEX trades for a token on an EVM chain

```graphql
{
  EVM(network: eth) {
    DEXTrades(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Trade: { Buy: { Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } } } } }
    ) {
      Block { Time }
      Transaction { Hash }
      Trade {
        Dex { ProtocolName ProtocolFamily }
        Buy { Amount Currency { Symbol SmartContract } Buyer }
        Sell { Amount Currency { Symbol SmartContract } }
      }
    }
  }
}
```

### What a wallet holds

Balances are cumulative, so this uses `combined`:

```graphql
query ($address: String!) {
  EVM(network: eth, dataset: combined) {
    Balances(where: { Balance: { Address: { is: $address } } }) {
      Currency { Symbol Name SmartContract }
      Balance { Amount(selectWhere: { gt: "0" }) AmountInUSD }
    }
  }
}
```

### Token transfers for a wallet

```graphql
{
  EVM(network: eth) {
    Transfers(
      limit: { count: 25 }
      orderBy: { descending: Block_Time }
      where: { Transfer: { Sender: { is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549" } } }
    ) {
      Block { Time }
      Transaction { Hash }
      Transfer { Amount Currency { Symbol SmartContract } Sender Receiver }
    }
  }
}
```

### Solana trades for a token

```graphql
{
  Solana {
    DEXTradeByTokens(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Trade: { Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } } } }
    ) {
      Block { Time }
      Trade {
        Currency { Symbol MintAddress }
        Side { Currency { Symbol MintAddress } }
        Dex { ProtocolName }
        Price
        PriceInUSD
        Amount
      }
    }
  }
}
```

### A live stream

Same document shape, `subscription` instead of `query`, sent over WebSocket:

```graphql
subscription {
  EVM(network: eth) {
    DEXTrades {
      Block { Time }
      Trade {
        Dex { ProtocolName }
        Buy { Amount Currency { Symbol } }
        Sell { Amount Currency { Symbol } }
      }
    }
  }
}
```

### A V1 chain — Bitcoin and its relatives

```graphql
{
  bitcoin(network: dogecoin) {
    blocks(options: { limit: 10, desc: "height" }) {
      height
      timestamp { time(format: "%Y-%m-%d %H:%M:%S") }
      transactionCount
    }
  }
}
```

Balance of a V1 UTXO address as of a date — received minus spent:

```graphql
query ($address: String!, $asof: ISO8601DateTime) {
  bitcoin(network: bitcoin) {
    received: outputs(outputAddress: { is: $address }, date: { till: $asof }) {
      value(calculate: sum)
      count
    }
    spent: inputs(inputAddress: { is: $address }, date: { till: $asof }) {
      value(calculate: sum)
      count
    }
  }
}
```

### Pending transactions, before they are mined

```graphql
{
  EVM(mempool: true, network: eth) {
    Transfers(limit: { count: 10 }) {
      Transaction { Hash From To }
      Transfer { Amount Currency { Symbol } Sender Receiver }
    }
  }
}
```

---

## 8. Errors and what they actually mean

| Message | Meaning |
| --- | --- |
| `subscriptions must be sent over a websocket connection, not HTTP` | Send the document to `wss://streaming.bitquery.io/graphql` instead. |
| `no table can query <Cube> ... consider use realtime dataset` | `archive`/`combined` is not deployed for that cube on that chain. |
| `access restricted: your plan only allows "realtime"` | The query asked for `archive` or `combined`; the plan needs the historical data add-on. |
| `402 No active billing period` | No active plan or points on the account. |
| `Code: 241 ... memory limit exceeded` | A V1 list query with no date bound. Add one. |
| `context deadline exceeded` | The server gave up. Narrow the filter or the time window. |
| Zero rows, no error | Either the window is outside `realtime` retention, or a `Trading` address filter was not lowercase. |

---

## 9. Choosing quickly

1. Is the chain on V2? If not, use V1 and expect no subscriptions.
2. Is the question about price? Use `Trading.Pairs` with rank 1.
3. Is it about balances, holders or ownership? Use `archive`/`combined` — never `realtime`.
4. Is it older than about 30 days? Use `DEXTradeByTokens`, not the `Trading` cubes.
5. Does it need to be live? Same document, `subscription`, over WebSocket.
