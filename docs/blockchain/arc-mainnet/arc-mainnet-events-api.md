---
title: "Arc Mainnet Events API & WebSocket Streams"
description: "Stream every smart contract event on Circle's Arc mainnet with Bitquery GraphQL: decoded logs by contract, signature, topic0 or argument, plus Uniswap v4 Initialize, v3 PoolCreated and v2 PairCreated feeds."
sidebar_position: 3
keywords:
  - Arc mainnet events API
  - Arc mainnet smart contract events
  - Arc mainnet logs API
  - Arc mainnet eth_getLogs alternative
  - Arc mainnet event stream websocket
  - Arc mainnet Uniswap v4 Initialize
  - Arc mainnet new pools
  - Circle Arc events API
  - arc Events
  - Bitquery Arc mainnet
---
# Arc Mainnet Events API & WebSocket Streams

Stream **every smart contract event on Arc mainnet** with Bitquery GraphQL. The `EVM.Events` cube on `network: arc` returns each log with decoded, typed arguments for known signatures, the raw topics, and the transaction, internal call and receipt that produced it. It covers what `eth_getLogs` and `eth_subscribe("logs")` return, and adds server-side filtering on decoded values.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows.

:::info Availability checked 16 September 2026
The realtime path and USD fields returned live data. Leave the `dataset` argument out until `combined` and `archive` are enabled.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Mainnet Calls API](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/)
- [Arc Mainnet DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/)
- [Arc Mainnet Transfers API](/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/)
- [EVM Events schema](/docs/schema/evm/events/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
:::

**On this page:** [Event anatomy](#what-one-event-row-contains) · [Firehose](#stream-all-events) · [By contract](#events-from-one-contract) · [By signature](#one-event-across-all-contracts) · [By topic0](#filter-by-raw-topic0) · [By argument](#filter-by-a-decoded-argument) · [New v4 pools](#new-uniswap-v4-pools) · [New v3 and v2 pools](#new-uniswap-v3-and-v2-pools) · [Busiest contracts](#busiest-contracts-and-signatures) · [Undecoded events](#undecoded-events) · [FAQ](#faq)

---

## What one event row contains

| Group | What it gives you |
| --- | --- |
| `Log` | `SmartContract` (the code that produced the log), log `Index`, and `Signature` (`Name`, full `Signature`, `SignatureHash`) |
| `LogHeader` | `Address`, the emitting address as `eth_getLogs` would return it |
| `Topics` | The raw indexed topics; topic0 is the signature hash |
| `Arguments` | Decoded, typed values (`address`, `bigInteger`, `string`, `hex`, `bool`, `integer`) with names |
| `Transaction` | Hash, `From`, `To`, value, gas and fee fields |
| `Call` | The internal call that emitted the log, with its signature and success flags |
| `Receipt` | `GasUsed`, `CumulativeGasUsed`, deployed `ContractAddress` |
| `Block` | `Number`, `Time` |

Hash fields (`SignatureHash`, `Topics.Hash`) are hex strings **without** a `0x` prefix.

### Example addresses on this page

| Item | Address |
| --- | --- |
| Uniswap v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| Uniswap v3 factory seen at launch | `0xf0db7b58379503491d857db50ac9ece64c653918` |
| Uniswap v2 factory seen at launch | `0x89e5db8b5aa49aa85ac63f691524311aeb649eba` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` |
| EURC | `0xbef5f6d51cb62b58e6a8f77868681825c6fe21c1` |

---

## Stream all events

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-stream-all-events)

One socket, every event on the chain. Good for building an indexer; heavy for anything else, so use the filtered streams below in production.

```graphql
subscription {
  EVM(network: arc) {
    Events {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      LogHeader {
        Address
      }
      Log {
        Index
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      Topics {
        Hash
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

## Events from one contract

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-events-from-a-contract)

`LogHeader.Address` is the `address` filter of `eth_getLogs`. This reads the latest events of the ERC-20 USDC contract.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x3600000000000000000000000000000000000000"}}
      }
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

## One event across all contracts

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-swap-events)

Filter by decoded signature name to watch one event type from every contract that emits it. This catches every `Swap`, from Uniswap v2 pairs, v3 pools and the v4 PoolManager alike.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {is: "Swap"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          Signature
        }
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
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

---

## Filter by raw topic0

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-events-by-topic0)

When you have the signature hash rather than the name, filter on `Log.Signature.SignatureHash`. This is the ERC-20 `Transfer(address,address,uint256)` hash, written without `0x`.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        Log: {
          Signature: {
            SignatureHash: {is: "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}
          }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      LogHeader {
        Address
      }
      Topics {
        Hash
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

## Filter by a decoded argument

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-events-by-argument)

Server-side filtering on decoded values is what a node cannot do. This finds every event whose argument named `to` equals a wallet, across all contracts and signatures.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Name: {is: "to"}
            Value: {Address: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}
          }
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          Name
        }
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

## New Uniswap v4 pools

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-new-uniswap-v4-pools)

Uniswap v4 carried most launch-day swaps. A new pool is an `Initialize` event on the PoolManager; its arguments give the pool `id`, the two currencies, the fee tier, tick spacing, hook address and opening price.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
      }
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
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
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

Change `query` to `subscription` and drop `limit` and `orderBy` to get each new pool the moment it is created.

---

## New Uniswap v3 and v2 pools

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-new-v3-v2-pools)

Several v3 and v2 factory deployments appeared on mainnet, so filter on the event name rather than one factory address. `PoolCreated` is v3, `PairCreated` is v2; both carry the two tokens and the new pool address in their arguments.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Log: {Signature: {Name: {in: ["PoolCreated", "PairCreated"]}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      LogHeader {
        Address
      }
      Log {
        Signature {
          Name
        }
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
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
    }
  }
}
```

---

## Busiest contracts and signatures

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-busiest-event-contracts)

Which contracts and event types dominate the log stream over 24 hours. Run this first on any network you have not explored yet.

```graphql
{
  EVM(network: arc) {
    contracts: Events(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 24}}}}
    ) {
      LogHeader {
        Address
      }
      count
    }
    signatures: Events(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {Block: {Time: {since_relative: {hours_ago: 24}}}}
    ) {
      Log {
        Signature {
          Name
          Signature
        }
      }
      count
    }
  }
}
```

---

## Undecoded events

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-undecoded-events)

Events whose ABI is not registered arrive with an empty `Signature.Name` and no `Arguments`, but the raw `Topics` and `Log.SmartContract` are still there. This lists the contracts emitting the most undecoded events; if one matters to you, ask support to register its ABI.

```graphql
{
  EVM(network: arc) {
    Events(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Log: {Signature: {Name: {is: ""}}}
      }
    ) {
      LogHeader {
        Address
      }
      Topics {
        Hash
      }
      count
    }
  }
}
```

---

## FAQ

**How do I map my `eth_getLogs` filter?**
`address` becomes `LogHeader.Address`, `topics[0]` becomes `Log.Signature.SignatureHash` (without `0x`), and a fixed block range becomes a `Block.Number` filter. Everything else on this page is extra: decoded arguments, argument filters and joined transaction context.

**`LogHeader.Address` or `Log.SmartContract`?**
`LogHeader.Address` is the emitting address. `Log.SmartContract` is the code that produced the log, which differs behind proxies. Filter on `LogHeader.Address` to watch a deployed address.

**Why do some events have an empty name?**
Their ABI is not registered yet. The raw topics and data are still delivered. See [Undecoded events](#undecoded-events).

**Can I get history beyond the realtime window?**
Not yet. Only the realtime path answered on 16 September 2026. Retry `archive` and `combined` before using them.

**How do I follow one Uniswap v4 pool?**
Take the pool `id` from its `Initialize` event and filter `Swap` events on the PoolManager whose first argument (`id`) matches it, using the [argument filter](#filter-by-a-decoded-argument) with `Value: {Bytes: ...}`, or read the pool's trades through the [DEX Trades API](/docs/blockchain/arc-mainnet/arc-mainnet-trades-api/) by its two currencies.
