---
title: "Arc Testnet Calls & Traces API"
description: "Query and stream smart contract calls and internal traces on Circle's Arc testnet with Bitquery GraphQL: method calls by selector, internal calls of a transaction, contract deployments, reverts and top methods."
sidebar_position: 4
keywords:
  - Arc testnet calls API
  - Arc testnet internal transactions
  - Arc testnet traces API
  - Arc testnet contract deployments
  - Arc testnet debug_traceTransaction alternative
  - Arc testnet reverted calls
  - Circle Arc calls API
  - arc_testnet Calls
  - Bitquery Arc testnet
---
# Arc Testnet Calls & Traces API

Query and stream **smart contract calls on Arc testnet** with Bitquery GraphQL. The `EVM.Calls` cube on `network: arc_testnet` holds every call in every transaction, including internal calls, with the decoded method signature, the call path, value, gas, success and revert flags, and the enclosing transaction. It returns what `debug_traceTransaction` and `trace_filter` return, without running a node, and the same query runs as a subscription.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows.

:::warning Testnet: realtime only, USD fields are 0
Only `dataset: realtime` exists for Arc testnet; leave the `dataset` argument out. `Call.ValueInUSD` and the transaction `...InUSD` fields return 0.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Testnet API overview](/docs/blockchain/arc-testnet/) — network facts, every cube and stream in one place
- [Arc Testnet Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api/)
- [Arc Testnet Transactions API](/docs/blockchain/arc-testnet/arc-testnet-transactions-api/)
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
| Uniswap v4 PoolManager | `0x1d70945634f618eefdf9edaadb59b9a183cef929` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` |

---

## Stream calls to a contract

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-calls-to-contract)

Every call into the Uniswap v4 PoolManager, internal or top-level, as it happens.

```graphql
subscription {
  EVM(network: arc_testnet) {
    Calls(
      where: {Call: {To: {is: "0x1d70945634f618eefdf9edaadb59b9a183cef929"}}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-calls)

The most recent top-level calls, one per transaction.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-calls-of-a-method)

Filter on the decoded method name and the contract. This reads `transfer` calls into the ERC-20 USDC contract with their decoded arguments.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-calls-by-selector)

When the ABI is not registered, filter on the selector in `Call.Input` instead. This matches `approve(address,uint256)` by its `0x095ea7b3` prefix on any contract.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-internal-calls-of-transaction)

The full call tree of one transaction, ordered by call index. Replace the hash with any recent transaction from the [Transactions API](/docs/blockchain/arc-testnet/arc-testnet-transactions-api/).

```graphql
{
  EVM(network: arc_testnet) {
    Calls(
      orderBy: {ascending: Call_Index}
      where: {
        Transaction: {
          Hash: {is: "0x9be99a14a7db15fae9b78c68c3bfb41cfd67654a7b8cdf499f56e712d8349fe1"}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-contract-deployments)

`Call.Create: true` marks a call that deployed a contract. The new address is in `Receipt.ContractAddress` for top-level deployments; for factory deployments read `Call.To` on the create call.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-reverted-calls)

Calls that reverted, with the error string when the EVM returned one. Useful for debugging a contract under test.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-most-called-methods)

Method signatures ranked by call count over 24 hours. ERC-20 `transfer`, `balanceOf` and `approve` dominate, followed by Uniswap v4 hook callbacks.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-calls-with-value)

Internal calls that carried native USDC value. This is how value moves between contracts shows up, since those movements are not ERC-20 `Transfer` events.

```graphql
{
  EVM(network: arc_testnet) {
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
Yes. The gas token on Arc is USDC, so `Call.Value` and `Transaction.Value` are native USDC amounts. `ValueInUSD` is 0 on testnet even though the value is dollar-denominated.

**Does this replace `debug_traceTransaction`?**
For call trees, yes: `CallPath`, `Depth`, `Index`, gas per call and revert reasons are all here. Opcode-level traces are not.

**Can I read calls older than the realtime window?**
Not on the testnet; only `dataset: realtime` exists.
