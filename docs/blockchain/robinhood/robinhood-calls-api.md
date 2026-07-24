---
title: "Robinhood Calls & Traces API — WebSocket Streams"
description: "Stream Robinhood contract calls and internal traces over GraphQL WebSockets — decoded inputs, call trees, deployments, reverts. A debug_traceTransaction alternative."
sidebar_position: 5
keywords:
  - Robinhood calls API
  - Robinhood traces API
  - Robinhood internal transactions
  - debug_traceTransaction alternative
  - trace_filter alternative Robinhood
  - Robinhood contract calls websocket
  - Robinhood smart contract function calls
  - Robinhood contract deployments stream
  - Robinhood reverted transactions
  - 4-byte selector filter
  - Bitquery Robinhood Calls API
---
# Robinhood Calls & Traces API — WebSocket Streams

Stream **every contract call and internal trace on Robinhood** with Bitquery GraphQL — top-level calls and nested internal calls, with **decoded input arguments**, gas accounting, revert errors, and the surrounding transaction and receipt joined into one record. The `EVM.Calls` cube on `network: robinhood` replaces a tracing node: no `debug_traceTransaction` loops, no 4-byte databases, no trace decoding pipeline.

Open **one WebSocket that carries every call on the chain**, or narrowly filtered sockets — per contract, per function, per selector, deployments-only, reverts-only. Every subscription on this page was verified live over WebSocket, and every query was executed against the production endpoint before publishing.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/)
- [WebSocket authentication](/docs/authorization/websocket/)
:::

**On this page:** [Why not a tracing node](#why-stream-calls-instead-of-tracing-a-node) · [Datasets & history](#datasets-and-history) · [Call anatomy](#what-one-call-row-contains) · [Firehose](#stream-all-calls-firehose) · [By contract](#stream-calls-to-one-contract) · [By function](#stream-by-function-name-or-selector) · [Deployments](#stream-contract-deployments) · [Reverts](#stream-reverted-calls) · [Value traces](#internal-eth-value-transfers) · [By wallet](#calls-from-a-wallet) · [Call tree](#full-call-tree-of-a-transaction) · [Analytics](#top-called-contracts) · [FAQ](#faq)

---

## Why stream calls instead of tracing a node

| | Tracing node (`debug_traceTransaction` / `trace_filter`) | Bitquery Calls stream |
| --- | --- | --- |
| Infrastructure | Archive node with tracing enabled — heavy to run and sync | One WebSocket to `streaming.bitquery.io` |
| Decoding | Raw calldata; you maintain ABIs and 4-byte lookups | `Arguments` arrive **decoded and typed** for known signatures |
| Scope | Per-transaction or per-block tracing loops | Server-side filters: contract, function name, selector, caller, `Create`, `Reverted`, value, time |
| Context | Trace only — separate calls for tx and receipt | Transaction and `Receipt` joined onto every call |
| Deployments | Diff traces for `CREATE` frames yourself | `Call: { Create: true }` is a filter |
| Backfill | Re-trace history block by block | Same query with `dataset: archive` / `combined` |

---

## Datasets and history

- **`realtime`** (the default) — a rolling window of recent blocks whose depth varies; measure it with the probe below rather than assuming it.
- **`archive`** — deep call history, retained up to roughly the **last 3 months** (Robinhood is a newer chain, so today the archive holds its complete history; older data ages out as the cap applies); its head lags the chain by minutes.
- **`combined`** — archive + realtime union; the safe choice for fixed windows (24h, 7d).

For older or bulk history, Bitquery can provide **data exports** — [contact support](https://bitquery.io/forms/api).

### Check the calls window

```graphql
{
  EVM(network: robinhood) {
    Calls {
      count
      earliest: Block { Time(minimum: Block_Time) }
      latest: Block { Time(maximum: Block_Time) }
    }
  }
}
```

---

## What one call row contains

| Group | What it gives you |
| --- | --- |
| **`Call`** | `From`/`To`, `Value` (+USD), gas fields, `Signature` (function `Name`, full `Signature`, 4-byte `SignatureHash`), flags: `Create`, `Delegated`, `Reverted`, `Success`, `SelfDestruct`, `Error`, plus tree position (`Index`, `CallerIndex`, `CallPath`, `InternalCalls`) |
| **`Arguments`** | Decoded, typed **function input values** (`address`, `bigInteger`, `string`, `hex`, `bool`, `integer`) with parameter names |
| **`Transaction`** | Hash, `From`/`To`, value, full gas and fee fields (incl. USD) |
| **`Receipt`** | `GasUsed`, `CumulativeGasUsed`, `ContractAddress`, receipt `Type` |
| **`Block`** | `Number`, `Time`, `Nonce` |

Tree semantics: `Index` numbers each call within the transaction, `CallerIndex` points to the parent call's index, and `CallPath` is the position path from the top-level call (e.g. `[2, 0]` = first sub-call of call 2) — enough to rebuild the entire trace tree client-side.

For calls, `Signature.SignatureHash` is the **4-byte selector** as uppercase hex **without** a `0x` prefix (e.g. `A9059CBB` for `transfer(address,uint256)`). Calls with an empty `Name` are undecoded selectors — still streamed and filterable by hash. Note that on-chain `balanceOf`-style reads made by contracts also appear: this cube sees every call executed, not just state-changing ones.

---

## Stream all calls (firehose)

One socket, every call on the chain — top-level and internal — with decoded inputs and full context. Events arrive in per-block batches.

:::warning Very high volume
Calls are the highest-volume cube on a busy chain (every transaction fans out into many internal calls). Use the firehose for exploration and full indexers; filter in production.
:::

```graphql
subscription {
  EVM(network: robinhood) {
    Calls {
      Block {
        Number
        Time
        Nonce
      }
      Call {
        CallPath
        InternalCalls
        From
        To
        Signature {
          Name
          Parsed
          Signature
          SignatureHash
          SignatureType
        }
        CallerIndex
        Create
        Delegated
        Error
        Gas
        GasUsed
        Index
        Reverted
        SelfDestruct
        Success
        Value
        ValueInUSD
      }
      Receipt {
        CumulativeGasUsed
        ContractAddress
        Type
        GasUsed
      }
      Transaction {
        From
        To
        Type
        Cost
        CostInUSD
        Gas
        GasFeeCap
        GasFeeCapInUSD
        GasPriceInUSD
        GasPrice
        GasTipCapInUSD
        GasTipCap
        Hash
        Value
        ValueInUSD
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

:::tip WebSocket connection
Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). See [WebSocket authentication](/docs/authorization/websocket/). Any subscription on this page also runs as a query — add `limit` and `orderBy` and drop the `subscription` keyword.
:::

:::tip Prefer Kafka for the firehose
Consuming the full call feed continuously? Bitquery also delivers Robinhood data as **Kafka streams** — decoded transactions, calls, and events on the protobuf topic `robinhood.transactions.proto` — with consumer-group scaling and replay. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/).
:::

---

## Stream calls to one contract

**Protocol ops:** every function invocation of one contract — including internal calls from other contracts, which a mempool or tx-level watcher misses. Example: the Uniswap V4 pool manager.

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { To: { is: "0x8366a39cc670b4001a1121b8f6a443a643e40951" } } }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Signature {
          Name
          SignatureHash
        }
        GasUsed
        Success
      }
      Transaction {
        Hash
      }
    }
  }
}
```

---

## Stream by function name or selector

**Method-level feeds:** filter by decoded function name to receive one method across **every** contract — for example, every ERC-20 `transfer` call on the chain.

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { Signature: { Name: { is: "transfer" } } } }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Signature {
          Name
          SignatureHash
        }
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

To pin one exact ABI variant — or to match an **undecoded** method — filter the 4-byte selector instead (uppercase hex, no `0x`):

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { Signature: { SignatureHash: { is: "70A08231" } } } }
    ) {
      Block {
        Time
      }
      Call {
        To
        Signature {
          Name
          SignatureHash
        }
      }
    }
  }
}
```

---

## Stream contract deployments

**New-contract radar:** `Call: { Create: true }` matches every `CREATE`/`CREATE2` frame — top-level and factory-internal. On these rows **`Call.To` is the newly deployed contract address** and `Call.From` is the deployer (`Receipt.ContractAddress` is populated only for top-level deployment transactions). When tested live, this stream caught a launchpad factory deploying a new token contract within seconds.

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { Create: true } }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Create
        Success
      }
      Transaction {
        Hash
        From
      }
    }
  }
}
```

---

## Stream reverted calls

**Error monitoring:** every failed call with its revert reason — watch your own contracts for breakage, or the whole chain for failing bots and exploits in progress. `Call.Error` carries the message (commonly `execution reverted`).

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { Reverted: true } }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Error
        Reverted
        Success
        Signature {
          Name
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

Scope it with a `Call.To` filter to alert only on your own deployments.

---

## Internal ETH value transfers

**Value tracing:** calls that move native ETH (`Call.Value > 0`) — including internal transfers that never appear as top-level transaction values. The [Transfers cube](/docs/blockchain/robinhood/robinhood-transfers/) models the same movements with USD enrichment; use Calls when you want them inside their execution context.

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { Value: { gt: "0" } } }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Value
        ValueInUSD
        Signature {
          Name
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

---

## Calls from a wallet

Everything one address executes — as transaction sender or as an internal caller (routers and bots show up here with their full fan-out). Swap in any address; rows appear only while it is active.

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: { Call: { From: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" } } }
    ) {
      Block {
        Time
      }
      Call {
        To
        Value
        Signature {
          Name
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

---

## Full call tree of a transaction

**The `debug_traceTransaction` replacement:** every call frame of one transaction, ordered by `Call_Index`, with `CallerIndex`/`CallPath` to rebuild the tree and decoded arguments per frame.

```graphql
{
  EVM(network: robinhood) {
    Calls(
      orderBy: { ascending: Call_Index }
      where: {
        Transaction: {
          Hash: {
            is: "0x816be7f8f359f85066599fcd2585cbf7c3b544590315afc5298dc7e538b3678b"
          }
        }
      }
    ) {
      Call {
        Index
        CallerIndex
        CallPath
        From
        To
        Delegated
        Create
        Success
        GasUsed
        Value
        Signature {
          Name
        }
      }
    }
  }
}
```

---

## Top called contracts

**Discovery:** the most-invoked contracts over a window, with how many distinct methods each serves.

```graphql
{
  EVM(network: robinhood) {
    Calls(
      limit: { count: 10 }
      orderBy: { descendingByField: "calls" }
      where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
    ) {
      Call {
        To
      }
      calls: count
      signatures: count(distinct: Call_Signature_SignatureHash)
    }
  }
}
```

---

## Top function signatures

Which methods dominate the chain — grouped by signature with counts. Rows with an empty `Name` are undecoded selectors.

```graphql
{
  EVM(network: robinhood) {
    Calls(limit: { count: 15 }, orderBy: { descendingByField: "count" }) {
      Call {
        Signature {
          Name
          SignatureHash
        }
      }
      count
    }
  }
}
```

---

## Top gas-burning contracts

**Gas analytics:** rank contracts by total gas consumed over a window — where the chain's compute actually goes.

```graphql
{
  EVM(network: robinhood) {
    Calls(
      limit: { count: 10 }
      orderBy: { descendingByField: "gas" }
      where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
    ) {
      Call {
        To
      }
      gas: sum(of: Call_GasUsed)
      calls: count
    }
  }
}
```

---

## Call volume in a time window

One-row stats for dashboards: total calls, distinct callers, distinct called contracts. Use `dataset: combined` when the window must be complete regardless of realtime depth.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Calls(where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }) {
      count
      callers: count(distinct: Call_From)
      contracts: count(distinct: Call_To)
    }
  }
}
```

---

## Use-case patterns

| Goal | Approach |
| --- | --- |
| Trace explorer / tx debugger | [Per-transaction call tree](#full-call-tree-of-a-transaction) with `Index`/`CallerIndex`/`CallPath` |
| New-contract & token-factory radar | [`Create: true` stream](#stream-contract-deployments) — `Call.To` is the deployed address |
| Contract error alerting | [`Reverted: true`](#stream-reverted-calls) scoped to your `Call.To` |
| Method-level analytics | [Name / selector streams](#stream-by-function-name-or-selector); counts via [top signatures](#top-function-signatures) |
| Internal ETH flow tracing | [`Value > 0` calls](#internal-eth-value-transfers), or [Transfers](/docs/blockchain/robinhood/robinhood-transfers/) for USD-priced movements |
| Bot / router monitoring | [`Call.From` stream](#calls-from-a-wallet) for the full execution fan-out |
| Chain ops dashboards | [Top called contracts](#top-called-contracts), [gas burners](#top-gas-burning-contracts), [window stats](#call-volume-in-a-time-window) |
| Event-side view of the same activity | [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api/) |

---

## Tips

1. **Filter production streams.** The calls firehose outweighs every other cube — per-contract, per-selector, deployments-only, and reverts-only sockets are cheap.
2. For calls, `SignatureHash` is the **4-byte selector, uppercase hex, no `0x`** (events use the full 32-byte topic hash instead).
3. `Create: true` rows put the **deployed contract in `Call.To`**; `Receipt.ContractAddress` fills only for top-level deployment transactions.
4. Function names collide across ABIs and undecoded methods have empty names — pin exact behavior with the selector filter.
5. Every executed call appears, including contract-to-contract `balanceOf`-style reads — filter by name/selector to cut that noise from analytics.
6. Rebuild trace trees client-side from `Index`, `CallerIndex`, and `CallPath`; `InternalCalls` tells you how many children a frame has.
7. Realtime depth varies — measure with the [window probe](#check-the-calls-window); use `combined` for fixed windows. Archive retains up to roughly the last 3 months of calls; for older or bulk data, ask about [exports](https://bitquery.io/forms/api).
8. Decoded `Arguments` are the function **inputs**; for emitted results, join the same transaction on the [Events API](/docs/blockchain/robinhood/robinhood-events-api/).

---

## FAQ

### Can I trace Robinhood transactions without a tracing node?

Yes — filter `EVM.Calls` by `Transaction.Hash` and order by `Call_Index` to get every internal call frame with decoded inputs, gas, and revert state: a `debug_traceTransaction` replacement served over GraphQL. Stream the same cube for live traces.

### How do I detect new contract deployments in real time?

Subscribe with `Call: { Create: true }`. Each row's `Call.To` is the freshly deployed contract address and `Call.From` its deployer — factory-internal deployments included. See [Stream contract deployments](#stream-contract-deployments).

### How do I monitor failed or reverted calls?

Subscribe with `Call: { Reverted: true }` (optionally scoped by `Call.To` to your contracts) and read `Call.Error` for the revert reason. See [Stream reverted calls](#stream-reverted-calls).

### How do I filter by a 4-byte function selector?

Use `Call.Signature.SignatureHash` with the selector as uppercase hex without `0x` — e.g. `A9059CBB` for `transfer(address,uint256)`. This also matches methods whose ABI is unknown (empty `Name`).

### How far back does Robinhood calls data go?

`archive` retains up to roughly the last 3 months of calls (on a newer chain like Robinhood that is currently its complete history), and `realtime` holds a rolling recent window — measure either with the [window probe](#check-the-calls-window). For older or bulk history, Bitquery can provide data exports on request.

### Which cube should I use — Calls, Events, or Transfers?

`Calls` is execution: who invoked what, with inputs, gas, and reverts. [`Events`](/docs/blockchain/robinhood/robinhood-events-api/) is what contracts emitted. [`Transfers`](/docs/blockchain/robinhood/robinhood-transfers/) is pre-modeled asset movement with USD enrichment. See [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/).
