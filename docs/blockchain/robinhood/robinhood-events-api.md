---
title: "Robinhood Events API & WebSocket Streams"
description: "Stream every Robinhood smart contract event over GraphQL WebSockets — decoded logs, topics, call & receipt context. A no-node alternative to eth_getLogs."
sidebar_position: 4
keywords:
  - Robinhood events API
  - Robinhood smart contract events
  - Robinhood event stream websocket
  - Robinhood logs API
  - Robinhood eth_getLogs alternative
  - Robinhood eth_subscribe logs
  - decoded event logs Robinhood
  - Robinhood topic0 filter
  - Robinhood contract monitoring
  - real-time EVM events Robinhood
  - Bitquery Robinhood Events API
---
# Robinhood Events API & WebSocket Streams

Stream **every smart contract event on Robinhood** with Bitquery GraphQL — decoded arguments, raw topics, and the emitting transaction, call, and receipt joined into one record. The `EVM.Events` cube on `network: robinhood` is a drop-in **alternative to running your own node**: no RPC infrastructure, no log-decoding pipeline, no ABI management for known signatures.

Open **one WebSocket that listens to everything**, or **hundreds of narrowly filtered sockets** — per contract, per event signature, per raw topic hash, even per decoded argument value. Every subscription on this page was verified live over WebSocket, and every query was executed against the production endpoint before publishing.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [EVM Events schema](/docs/schema/evm/events/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity/)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches/)
- [WebSocket authentication](/docs/authorization/websocket/)
:::

**On this page:** [Why not a node](#why-stream-events-instead-of-running-a-node) · [Datasets & history](#datasets-and-history) · [Event anatomy](#what-one-event-row-contains) · [Firehose](#stream-all-events-firehose) · [By contract](#stream-events-from-one-contract) · [By signature](#stream-one-event-across-all-contracts) · [By topic0](#stream-by-raw-topic0-signature-hash) · [By argument](#watch-an-address-across-all-decoded-arguments) · [By wallet](#events-from-a-wallets-transactions) · [Historical queries](#latest-events-query) · [Use cases](#use-case-patterns) · [FAQ](#faq)

---

## Why stream events instead of running a node

| | Your own node (`eth_subscribe` / `eth_getLogs`) | Bitquery Events stream |
| --- | --- | --- |
| Infrastructure | Run and sync a Robinhood node, manage reconnects and reorgs | One WebSocket to `streaming.bitquery.io` |
| Decoding | Raw topics + data; you maintain ABIs and decoders | `Arguments` arrive **decoded and typed** for known signatures; raw `Topics` always included |
| Context | Logs only — separate calls for tx, trace, receipt | Transaction, internal `Call`, and `Receipt` joined onto every event |
| Filtering | Address + topics only | Address, signature name, signature hash, **decoded argument values**, tx sender, time — server-side |
| Backfill | Separate `eth_getLogs` pagination logic | Same query with `dataset: archive` / `combined` |
| Scale | One node, you shard consumers | One firehose socket or hundreds of filtered sockets |

If you are migrating node code: your `eth_getLogs` `address` filter maps to `LogHeader.Address`, and `topics[0]` maps to `Log.Signature.SignatureHash`.

---

## Datasets and history

- **`realtime`** (the default) — a rolling window of recent blocks whose depth varies; don't assume it, measure it with the probe below.
- **`archive`** — deep event history, retained up to roughly the **last 3 months** (Robinhood is a newer chain, so today the archive holds its complete history; older data ages out as the cap applies); its head lags the chain by minutes.
- **`combined`** — archive + realtime union; the safe choice for fixed windows (24h, 7d).

Need bulk history beyond what you want to page through the API? Bitquery can also provide **historical data exports** — [contact support](https://bitquery.io/forms/api).

### Check the events window

Run this against `realtime` (or `archive`) to see exactly what the dataset currently holds:

```graphql
{
  EVM(network: robinhood) {
    Events {
      count
      earliest: Block { Time(minimum: Block_Time) }
      latest: Block { Time(maximum: Block_Time) }
    }
  }
}
```

---

## What one event row contains

| Group | What it gives you |
| --- | --- |
| **`Log`** | Emitting context: `SmartContract`, log `Index`, and the `Signature` (`Name`, full `Signature`, `SignatureHash`, `Parsed`) |
| **`Topics`** | The raw indexed topics (`Hash` array — topic0 is the event signature hash) |
| **`Arguments`** | Decoded, typed argument values (`address`, `bigInteger`, `string`, `hex`, `bool`, `integer`) with names |
| **`Transaction`** | Hash, `From`/`To`, value, full gas and fee fields (incl. USD) |
| **`Call`** | The internal call that emitted the log: call path, signature, gas, revert/error flags |
| **`Receipt`** | `GasUsed`, `CumulativeGasUsed`, deployed `ContractAddress`, receipt `Type` |
| **`Block`** | `Number`, `Time`, `Nonce` |

:::info LogHeader.Address vs Log.SmartContract
`LogHeader.Address` is the **emitting address** — the `address` field a node would return in `eth_getLogs`. `Log.SmartContract` is the **code that produced the log**, which differs behind proxies: several major Robinhood tokens (WETH, USDG) emit through proxy addresses backed by separate implementation contracts. Filter `LogHeader.Address` to watch a deployed address; read `Log.SmartContract` to group proxies that share one implementation.
:::

Hash fields (`SignatureHash`, `Topics.Hash`) are hex strings **without** a `0x` prefix.

---

## Stream all events (firehose)

One socket, every event on the chain, with the full record — decoded arguments, raw topics, transaction, call, and receipt. Events arrive in per-block batches.

:::warning High volume
The unfiltered firehose delivers every event on a busy chain — great for exploration and building your own indexer, heavy for everything else. Use the filtered streams below in production.
:::

```graphql
subscription {
  EVM(network: robinhood) {
    Events {
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
      Topics {
        Hash
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
      Log {
        Signature {
          Name
          Abi
          Parsed
          Signature
          SignatureHash
          SignatureType
        }
        SmartContract
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
      }
    }
  }
}
```

:::tip WebSocket connection
Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). See [WebSocket authentication](/docs/authorization/websocket/). Any subscription on this page also runs as a query — add `limit` and `orderBy` and drop the `subscription` keyword.
:::

:::tip Prefer Kafka for the firehose
Consuming the full event feed continuously? Bitquery also delivers Robinhood data as **Kafka streams** — decoded transactions, calls, and events on the protobuf topic `robinhood.transactions.proto` — with consumer-group scaling and replay. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/).
:::

---

## Stream events from one contract

**Protocol monitoring:** everything a single deployed address emits — the streaming equivalent of an `eth_getLogs` address filter. Example: WETH.

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: { LogHeader: { Address: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" } } }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
        SmartContract
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

### Multiple contracts, one socket

Watch a whole list of contracts with `Address.in` — one socket per protocol instead of one per contract.

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        LogHeader: {
          Address: {
            in: [
              "0x0bd7d308f8e1639fab988df18a8011f41eacad73"
              "0x5fc5360d0400a0fd4f2af552add042d716f1d168"
            ]
          }
        }
      }
    ) {
      Block {
        Time
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Arguments {
        Name
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

---

## Stream one event across all contracts

**Network-wide feeds:** filter by decoded signature name to receive one event type from **every** contract — for example, every ERC-20 `Transfer` on Robinhood in a single socket (the backbone of a token indexer). Works the same for `Swap`, `Approval`, `OwnershipTransferred`, or any launchpad event (see [Flap.sh](/docs/blockchain/robinhood/flap-sh-api/) and [Bags.fm](/docs/blockchain/robinhood/bags-fm-api/) for protocol-specific examples).

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: { Log: { Signature: { Name: { is: "Transfer" } } } }
    ) {
      Block {
        Time
      }
      Log {
        SmartContract
      }
      Arguments {
        Name
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

:::note Names can collide
Different ABIs reuse the same event name — Robinhood carries more than one distinct `Swap` signature, for instance. A name filter catches all variants; pin one exact ABI with the [signature-hash filter](#stream-by-raw-topic0-signature-hash) below.
:::

---

## Stream by raw topic0 (signature hash)

Filter on `Log.Signature.SignatureHash` — the keccak of the event signature, i.e. `topics[0]` — **without the `0x` prefix**. This pins one exact ABI variant, and it also works for **undecoded events**: rows where `Signature.Name` is empty and `Parsed` is `false` still carry their hash and raw `Topics`, so no log on the chain is out of reach.

Example: the canonical ERC-20 `Transfer(address,address,uint256)` topic0.

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        Log: {
          Signature: {
            SignatureHash: {
              is: "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Log {
        Signature {
          Name
          SignatureHash
        }
        SmartContract
      }
      Topics {
        Hash
      }
    }
  }
}
```

---

## Watch an address across all decoded arguments

**Wallet / token surveillance:** match events where **any decoded argument** equals an address — transfers in or out, approvals, swaps, or protocol events mentioning it, in one stream, regardless of event type or contract. This is a filter a raw node cannot do server-side.

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: {
        Arguments: {
          includes: {
            Value: { Address: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" } }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Transaction {
        Hash
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

Add `Name: { is: "token" }` (or any argument name) inside `includes` to match a specific argument instead of any position. As a historical query, argument matching scans widely — combine it with a `Block.Time` window or a contract filter for speed.

---

## Events from a wallet's transactions

Everything emitted by transactions **sent** by one address — a debugging and bot-monitoring view (which pools did my router touch, which events did my deployment emit).

```graphql
subscription {
  EVM(network: robinhood) {
    Events(
      where: { Transaction: { From: { is: "0xcaf681a66d020601342297493863e78c959e5cb2" } } }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
    }
  }
}
```

Rows appear only while the wallet is actively sending transactions — swap in any sender you care about.

---

## Latest events query

The query counterpart of the firehose: page through recent events, newest first.

```graphql
{
  EVM(network: robinhood) {
    Events(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        Signature {
          Name
          SignatureHash
        }
        SmartContract
        Index
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

---

## All events in one transaction

**Forensics / debugging:** decompose a transaction into its ordered event log. A DEX swap, for example, unrolls into its `Transfer`s, pool `Sync`/`Swap` events, and any protocol hooks — with decoded arguments for each.

```graphql
{
  EVM(network: robinhood) {
    Events(
      orderBy: { ascending: Log_Index }
      where: {
        Transaction: {
          Hash: {
            is: "0xdb0f8aed6d900da3751670f311dbb8a7ae3f44022d15eff2b72a5d0863a1750f"
          }
        }
      }
    ) {
      Log {
        Index
        Signature {
          Name
        }
        SmartContract
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

---

## Top event signatures

**Discovery:** which events dominate the chain right now — grouped by signature with counts. Rows with an empty `Name` are undecoded signatures; their `SignatureHash` still identifies them.

```graphql
{
  EVM(network: robinhood) {
    Events(limit: { count: 15 }, orderBy: { descendingByField: "count" }) {
      Log {
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

## Most active event emitters

Which contracts emit the most events over a window, and how many distinct signatures each uses — a fast map of what's hot on chain.

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: { count: 10 }
      orderBy: { descendingByField: "count" }
      where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
    ) {
      Log {
        SmartContract
      }
      count
      signatures: count(distinct: Log_Signature_SignatureHash)
    }
  }
}
```

---

## Event volume in a time window

One-row stats for dashboards: total events and distinct emitting contracts. Use `dataset: combined` when the window must be complete regardless of the realtime depth.

```graphql
{
  EVM(network: robinhood) {
    Events(where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }) {
      count
      contracts: count(distinct: Log_SmartContract)
    }
  }
}
```

---

## Use-case patterns

| Goal | Approach |
| --- | --- |
| Token indexer without a node | Stream `Signature.Name: "Transfer"` (or pin the [topic0 hash](#stream-by-raw-topic0-signature-hash)); backfill with the same query on `dataset: archive` |
| DEX analytics | Stream `Swap` by signature hash per ABI variant; join context from `Transaction` / `Call` |
| Launchpad detection | Creation events per protocol — see [Meme Coin Launches](/docs/blockchain/robinhood/robinhood-meme-coin-launches/), [Flap.sh](/docs/blockchain/robinhood/flap-sh-api/), [Bags.fm](/docs/blockchain/robinhood/bags-fm-api/) |
| Pool reserve / price state | Purpose-built cubes are easier — [DEXPoolEvents](/docs/blockchain/robinhood/robinhood-liquidity/) |
| Wallet / compliance watch | [Argument address filter](#watch-an-address-across-all-decoded-arguments) — one stream, every event type |
| Protocol ops & alerting | [Contract filter](#stream-events-from-one-contract) on your deployments; alert on `OwnershipTransferred`, role changes, pauses |
| Incident forensics | [Per-transaction event log](#all-events-in-one-transaction), plus `Call.Reverted` / `Receipt` context |
| Chain discovery | [Top signatures](#top-event-signatures) and [top emitters](#most-active-event-emitters) |

---

## Tips

1. **Filter production streams.** The firehose is for exploration and full indexers; per-contract, per-signature, and per-hash sockets are cheap — open as many as you need, or multiplex several subscriptions over one WebSocket connection.
2. `LogHeader.Address` = emitting address (node-style filter); `Log.SmartContract` = the code behind it — they differ for proxy contracts.
3. Hash fields have **no `0x` prefix** — `SignatureHash` and `Topics.Hash` are bare hex.
4. Event **names collide across ABIs** (multiple `Swap` variants exist) — filter by `SignatureHash` when exact ABI identity matters.
5. Undecoded events (`Name: ""`, `Parsed: false`) are still delivered and filterable by hash — nothing on chain is invisible.
6. Realtime depth varies — measure it with the [window probe](#check-the-events-window); use `combined` for fixed windows and `archive` for full history (its head lags the chain by minutes).
7. Decoded-argument filters scan broadly as historical queries — scope them with a time window or contract filter; as subscriptions they are cheap.
8. For bulk backfills beyond API paging, ask Bitquery about [historical data exports](https://bitquery.io/forms/api).

---

## FAQ

### Can I listen to Robinhood contract events without running a node?

Yes — that is this API's core use. A GraphQL `subscription` on `EVM(network: robinhood) { Events }` over WebSocket replaces `eth_subscribe("logs")`, with decoded arguments and joined transaction/call/receipt context that a node doesn't provide. Backfill uses the same query with `dataset: archive`.

### Should I open one WebSocket or many?

Both work. One firehose socket can feed your own router, or you can open a separate narrowly-filtered subscription per contract, signature, or address — hundreds of concurrent filtered sockets are a supported pattern, and several subscriptions can also share one connection.

### Are event arguments decoded?

Yes — `Arguments` returns named, typed values (`address`, `bigInteger`, `string`, `hex`, `bool`, `integer`) for known signatures. Unknown signatures still stream with raw `Topics` and their `SignatureHash`.

### How do I filter by raw topic0?

Use `Log.Signature.SignatureHash` with the keccak hash of the event signature, **without** the `0x` prefix — see [the topic0 stream](#stream-by-raw-topic0-signature-hash).

### How far back does Robinhood events data go?

`archive` retains up to roughly the last 3 months of events (on a newer chain like Robinhood that is currently its complete history), and `realtime` holds a rolling recent window — measure either with the [window probe](#check-the-events-window). For older or bulk history, Bitquery can provide data exports on request.

### How do I get every event a specific transaction emitted?

Filter `Transaction.Hash` and order by `Log_Index` — see [All events in one transaction](#all-events-in-one-transaction).

### Which cube should I use — Events, Transfers, or Calls?

`Events` is the decoded-log firehose. For token movements specifically, [Transfers](/docs/blockchain/robinhood/robinhood-transfers/) is pre-modeled with USD enrichment; for pool state, use [DEXPoolEvents](/docs/blockchain/robinhood/robinhood-liquidity/). See [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/).
