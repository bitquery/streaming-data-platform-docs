---
title: "Which Cubes Support Subscriptions"
sidebar_label: "Which cubes stream"
description: "Every Bitquery cube accepts a subscription, but not every cube pushes data. Which cubes stream, which are query-only, and which need a filter."
keywords:
  - Bitquery subscription support
  - GraphQL cube streaming
  - which cubes stream
  - WebSocket close 1013
  - subscription returns no data
  - query-only cube
  - Bitquery streaming limits
---

# Which cubes support subscriptions

Every cube on `EVM`, `Solana`, `Trading` and `Tron` appears on the subscription schema. A
subscription against any of them is a valid document and the server accepts it.

That does not mean every cube pushes data.

:::danger A valid subscription is not a working subscription
Three cubes accept your subscription and then disconnect you under load. Five accept it and
never send a single message. In both cases you get no error from the schema, no rejection at
subscribe time, and nothing in your logs except silence. This page tells you which is which.
:::

---

## The three behaviours

| Behaviour | What you see | What to do |
|---|---|---|
| **Streams** | Messages arrive within seconds | Nothing, it works |
| **Needs a filter** | Some messages, then the socket closes with code `1013` | Add a `where` filter, consume asynchronously |
| **Query-only** | Socket stays open, no message ever arrives | Use a query, or stream a different cube |

---

## Matrix

Relative volume is a rough guide to what your consumer has to keep up with, not a throughput
guarantee.

### Solana

| Cube | Subscription | Volume |
|---|---|---|
| `Blocks` | Streams | High |
| `Transactions` | Streams | High |
| `Transfers` | Streams | High |
| `TokenSupplyUpdates` | Streams | High |
| `DEXPools` | Streams | High |
| `DEXTrades` | Streams | Moderate |
| `DEXTradeByTokens` | Streams | Moderate |
| `Rewards` | Streams | Moderate |
| `DEXOrders` | Streams | Low |
| `PerpetualOrders` | Streams | Moderate |
| `PerpetualFills` | Streams | Low |
| `PerpetualPositions` | Streams | Low |
| `PerpetualPrices` | Streams | Low |
| `PerpetualMarketSummaries` | Streams | Low |
| `Instructions` | **Filter required** | Very high |
| `BalanceUpdates` | **Filter required** | Very high |
| `InstructionBalanceUpdates` | **Filter required** | Very high |

### EVM

| Cube | Subscription | Volume |
|---|---|---|
| `MinerRewards` | Streams | High |
| `Events` | Streams | Moderate |
| `Transactions` | Streams | Moderate |
| `Transfers` | Streams | Moderate |
| `Blocks` | Streams | Low (block cadence) |
| `Calls` | Streams | Low |
| `DEXTrades` | Streams | Low |
| `DEXTradeByTokens` | Streams | Low |
| `DEXPoolEvents` | Streams | Low |
| `DEXPoolSlippages` | Streams | Low |
| `TransactionBalances` | Streams | Low |
| `PredictionTrades` | Streams (`network: matic`) | Moderate |
| `PredictionSettlements` | Streams (`network: matic`) | Moderate |
| `PredictionManagements` | Streams (`network: matic`) | Low |
| `Balances` | **Query-only** | — |
| `Holders` | **Query-only** | — |
| `Uncles` | **Query-only** | — |

### Trading

| Cube | Subscription | Volume |
|---|---|---|
| `Trades` | Streams | Very high |
| `Pairs` | Streams | Very high |
| `Currencies` | Streams | Very high |
| `Tokens` | Streams | Very high |

All four Trading cubes are among the busiest streams on the platform. Filter them.

### Tron

| Cube | Subscription | Volume |
|---|---|---|
| `Transfers` | Streams | Moderate |
| `Transactions` | Streams | Moderate |
| `DEXTradeByTokens` | Streams | Low |
| `Events` | Streams | Low |
| `Blocks` | Streams | Low (block cadence) |
| `Calls` | Streams | Low |
| `DEXTrades` | Streams | Low |
| `Balances` | **Query-only** | — |
| `Holders` | **Query-only** | — |

---

## Filter-required cubes and close code 1013

`Solana.Instructions`, `Solana.BalanceUpdates` and `Solana.InstructionBalanceUpdates` carry
every instruction and every balance change on Solana. Subscribing without a filter asks for
the entire firehose, and when your client cannot drain the socket fast enough the server
closes it:

```
close code 1013 — client is not consuming messages fast enough
```

`1013` is "Try Again Later" in the WebSocket spec. Nothing is wrong with your query. The
server is shedding a consumer that fell behind.

The failure is worse than a clean error because it is **load-dependent**. The same unfiltered
subscription can run fine during a quiet minute and get dropped during a busy one, so it
passes in development and fails in production.

### The fix

Add a `where` filter so the server sends you only what you need. An unfiltered
`BalanceUpdates` subscription is dropped; the same subscription narrowed to a single token
runs cleanly:

```graphql
subscription {
  Solana {
    BalanceUpdates(
      where: {
        BalanceUpdate: {
          Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }
        }
      }
    ) {
      BalanceUpdate {
        Amount
        Currency { Symbol }
        Account { Address }
      }
    }
  }
}
```

The same applies to `Instructions`. Filter by program:

```graphql
subscription {
  Solana {
    Instructions(
      where: {
        Instruction: { Program: { Address: { is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" } } }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      Instruction { Program { Method } }
    }
  }
}
```

Filtering is not only a throughput fix. It is also cheaper, since you are not paying to
receive rows you discard.

### Also drain the socket asynchronously

A filter reduces the rate; it does not make a blocking consumer safe. Push each message onto a
queue and process it elsewhere, so parsing or database writes never stall the read loop. See
[Reconnect automatically after disconnect](/docs/subscriptions/silent-disconnect-reconnect/)
for a working consumer and reconnect loop.

---

## Query-only cubes

These accept a subscription and never emit, and the reason is structural. `Balances` and
`Holders` are backed by **aggregate-state tables** (`balances_by_address` and
`balances_by_currency`) holding **daily** balance aggregates rather than individual changes.
A daily grain has no per-event row to push, so there is nothing for a subscription to deliver.

That is also what makes them fast to query and what gives them `combined` support, so the
trade-off is deliberate rather than a gap.

:::info These are the current cubes, not legacy ones
`Balances` and `Holders` **supersede** the deprecated `BalanceUpdates` and `TokenHolders`
cubes. If you are migrating: `Holders` takes its currency filter through the standard `where:`
argument instead of the old required `tokenSmartContract` / `date` arguments, and both new
cubes support `realtime`, `archive` and `combined`.

So the move to `Balances`/`Holders` trades a streamable per-change event log for cheap daily
aggregates. Where you previously streamed `BalanceUpdates`, stream `Transfers` (or
`TransactionBalances` on EVM) instead and apply the deltas yourself.

`EVM.BalanceUpdates`, `EVM.TokenHolders` and `Tron.BalanceUpdates` **sunset on 10 August 2026**.
:::

| Cube | Use instead |
|---|---|
| `EVM.Balances` | Query it on a schedule, or stream `EVM.TransactionBalances` / `EVM.Transfers` and apply deltas |
| `EVM.Holders` | Query it on a schedule; stream `EVM.Transfers` for the token to know when to refresh |
| `Tron.Balances` | Query on a schedule, or stream `Tron.Transfers` |
| `Tron.Holders` | Query on a schedule, or stream `Tron.Transfers` |
| `EVM.Uncles` | Query with `dataset: archive`. Ethereum has produced no uncles since the Merge |

The pattern for a live balance is to read the balance once, then keep it current from the
transfer stream, rather than polling the balance cube in a loop.

---

## Cubes that need a specific network or dataset

Some cubes exist on the `EVM` root but only carry data on one network or one dataset. The
error message is the only place this is stated today, so it is worth listing:

| Cube | Requirement |
|---|---|
| `EVM.PredictionTrades` | `network: matic` |
| `EVM.PredictionManagements` | `network: matic` |
| `EVM.PredictionSettlements` | `network: matic` |
| `EVM.Uncles` | `dataset: archive` |
| `EVM.TransactionBalances` | realtime only, no archive tables |

Querying `EVM.PredictionTrades` on `network: eth` returns
`no data available yet to query dataset realtime eth for PredictionTrade`, which reads like an
outage but is a routing mistake.

---

## How this was measured

Every row was tested against `wss://streaming.bitquery.io/graphql` with the `graphql-ws`
subprotocol, one socket per cube, using a minimal selection set generated from schema
introspection. Cubes that produced nothing in the first pass were retried on a longer window,
because some low-frequency cubes take longer than 20 seconds to deliver their first message.

Classification rules:

- **Streams** — at least one message on a socket held open long enough for the cube's cadence.
- **Filter required** — reproducibly closed with `1013` when unfiltered, and delivered normally
  once a `where` clause was added.
- **Query-only** — no message and no error across repeated runs, while control subscriptions on
  the same chain in the same session delivered normally.

The controls matter: a chain-level failure would have shown up as every cube on that chain
going quiet, and that did not happen.

---

## Related

- [Reconnect automatically after disconnect](/docs/subscriptions/silent-disconnect-reconnect/)
- [Subscriptions overview](/docs/subscriptions/subscription/)
- [WebSocket authorization](/docs/authorization/websocket/)
- [Backfilling a subscription](/docs/subscriptions/backfilling-subscription/)
