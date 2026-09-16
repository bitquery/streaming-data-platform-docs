---
title: "Arc Mainnet Calls & Traces API"
description: "Query and stream Arc mainnet smart contract calls and traces with Bitquery GraphQL, including selectors, internal calls, deployments, reverts and top methods."
sidebar_position: 4
keywords:
  - Arc mainnet calls API
  - Arc mainnet internal transactions
  - Arc mainnet traces API
  - Arc mainnet contract deployments
  - Arc mainnet debug_traceTransaction alternative
  - Arc mainnet reverted calls
  - Circle Arc calls API
  - arc Calls
  - Bitquery Arc mainnet
---
# Arc Mainnet Calls & Traces API

Query and stream **smart contract calls on Arc mainnet** with Bitquery GraphQL. The `EVM.Calls` cube on `network: arc` holds every call in every transaction, including internal calls, with the decoded method signature, the call path, value, gas, success and revert flags, and the enclosing transaction. It returns what `debug_traceTransaction` and `trace_filter` return, without running a node, and the same query runs as a subscription.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows.

:::info Availability checked 16 September 2026
The realtime path returned live calls and populated USD fields. Leave the `dataset` argument out until `combined` and `archive` are enabled.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Mainnet Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/)
- [Arc Mainnet Transactions API](/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/)
- [EVM Calls schema](/docs/schema/evm/calls/)
- [Transfers vs Events vs Calls](/docs/start/mental-model-transfers-events-calls/)
:::

**On this page:** [Call anatomy](#what-one-call-row-contains) · [Stream](#stream-calls-to-a-contract) · [Latest](#latest-calls) · [By method](#calls-of-one-method) · [By selector](#calls-by-4-byte-selector) · [Internal calls of a transaction](#internal-calls-of-a-transaction) · [Deployments](#contract-deployments) · [Reverts](#reverted-calls) · [Top methods](#most-called-methods) · [Value-carrying calls](#calls-that-move-native-usdc) · [FAQ](#faq)

---

## What one call row contains

| Group | What it gives you |
| --- | --- |
| `Call` | `From`, `To`, `Value`, `Input`, `Output`, `Gas`, `GasUsed`, `Success`, `Reverted`, `Error`, `Create`, `Delegated`, `SelfDestruct`, `CallPath`, `Index`, `Depth` |
| `Call.Signature` | `Name`, full `Signature`, `SignatureHash` (the 4-byte selector, without `0x`) |
| `Arguments` | Decoded, typed inputs for registered ABIs |
| `Transaction` | Hash, `From`, `To`, value, gas and fee fields |
| `Receipt` | `Status`, `GasUsed`, deployed `ContractAddress` |
| `Block` | `Number`, `Time` |

A transaction's top-level call has `Call.Index` 0 and an empty `CallPath`; internal calls have deeper paths. Filter `Call: {Index: {eq: 0}}` when you want one row per transaction.

### Example addresses on this page

| Item | Address |
| --- | --- |
| Uniswap v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` |

---

## Stream calls to a contract

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-stream-calls-to-contract)

Every call into the Uniswap v4 PoolManager, internal or top-level, as it happens.

```graphql
subscription {
  EVM(network: arc) {
    Calls(
      where: {Call: {To: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
      }
      Call {
        From
        To
        Value
        Success
        CallPath
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
    }
  }
}
```

---

## Latest calls

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-calls)

The most recent top-level calls, one per transaction.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Call: {Index: {eq: 0}}}
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
      }
      Call {
        From
        To
        Value
        Success
        Gas
        GasUsed
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

## Calls of one method

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-calls-of-a-method)

Filter on the decoded method name and the contract. This reads `transfer` calls into the ERC-20 USDC contract with their decoded arguments.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Call: {
          To: {is: "0x3600000000000000000000000000000000000000"}
          Signature: {Name: {is: "transfer"}}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Call {
        From
        Success
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
        }
      }
    }
  }
}
```

---

## Calls by 4-byte selector

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-calls-by-selector)

When the ABI is not registered, filter on the selector in `Call.Input` instead. This matches `approve(address,uint256)` by its `0x095ea7b3` prefix on any contract.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Call: {Input: {startsWith: "0x095ea7b3"}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Call {
        From
        To
        Input
        Success
        Signature {
          Name
        }
      }
    }
  }
}
```

---

## Internal calls of a transaction

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-internal-calls-of-transaction)

The full call tree of one transaction, ordered by call index. Replace the hash with any recent transaction from the [Transactions API](/docs/blockchain/arc-mainnet/arc-mainnet-transactions-api/).

```graphql
{
  EVM(network: arc) {
    Calls(
      orderBy: {ascending: Call_Index}
      where: {
        Transaction: {
          Hash: {is: "0x3fb2f3f18ae8ef86dbf6d25f268c861d2982f67308031df45574b5a7fcc02b9f"}
        }
      }
    ) {
      Call {
        Index
        Depth
        CallPath
        From
        To
        Value
        Gas
        GasUsed
        Success
        Reverted
        Delegated
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

---

## Contract deployments

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-contract-deployments)

`Call.Create: true` marks a call that deployed a contract. The new address is in `Receipt.ContractAddress` for top-level deployments; for factory deployments read `Call.To` on the create call.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Call: {Create: true}}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        From
      }
      Call {
        From
        To
        Success
        CallPath
      }
      Receipt {
        ContractAddress
      }
    }
  }
}
```

---

## Reverted calls

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-reverted-calls)

Calls that reverted, with the error string when the EVM returned one. Useful for debugging a contract under test.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Call: {Reverted: true}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
      }
      Call {
        From
        To
        Error
        CallPath
        Signature {
          Name
        }
      }
    }
  }
}
```

---

## Most called methods

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-most-called-methods)

Method signatures ranked by call count over 24 hours. ERC-20 `transfer`, `balanceOf` and `approve` dominate, followed by Uniswap v4 hook callbacks.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descendingByField: "count"}
      where: {
        Block: {Time: {since_relative: {hours_ago: 24}}}
        Call: {Signature: {Name: {not: ""}}}
      }
    ) {
      Call {
        Signature {
          Name
          Signature
          SignatureHash
        }
      }
      count
      contracts: uniq(of: Call_To)
    }
  }
}
```

---

## Calls that move native USDC

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-calls-with-value)

Internal calls that carried native USDC value. This is how value moves between contracts shows up, since those movements are not ERC-20 `Transfer` events.

```graphql
{
  EVM(network: arc) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {Call: {Value: {gt: "10"}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Call {
        From
        To
        Value
        Index
        Signature {
          Name
        }
      }
    }
  }
}
```

---

## FAQ

**How do I get one row per transaction?**
Filter `Call: {Index: {eq: 0}}`. Every other row is an internal call.

**Why is `Signature.Name` empty on some calls?**
The ABI is not registered. The raw `Input` and the selector prefix are still there, so filter with `Input: {startsWith: ...}`, and ask support to register the ABI if you need decoded arguments.

**Is `Call.Value` in USDC?**
Yes. The gas token on Arc is USDC, so `Call.Value` and `Transaction.Value` are native USDC amounts. `ValueInUSD` also returned populated values in the launch-day check.

**Does this replace `debug_traceTransaction`?**
For call trees, yes: `CallPath`, `Depth`, `Index`, gas per call and revert reasons are all here. Opcode-level traces are not.

**Can I read calls older than the realtime window?**
Not yet. Only the realtime path answered on 16 September 2026. Retry `archive` and `combined` before using them.
