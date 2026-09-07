---
title: "debug_traceCall with Bitquery: Trace Internal Calls Without a Node"
description: "Read decoded internal calls of executed Ethereum transactions with the Bitquery Calls cube instead of tracing them yourself, with limits stated plainly."
keywords:
  - debug_traceCall
  - Ethereum internal calls API
  - trace contract calls GraphQL
  - debug_traceCall alternative
  - internal transactions Ethereum API
---

import FAQ from "@site/src/components/FAQ";

# debug_traceCall with Bitquery: Trace Internal Calls Without a Node

`debug_traceCall` is the JSON-RPC method that executes a call against a block's state and returns the trace: every internal call with its sender, target, input, output, gas and value. It needs an archive node with the debug API enabled, and it traces one call you construct. The Bitquery `Calls` cube holds the same trace fields for every call that ran on chain, top-level and internal, already decoded, so you filter instead of simulating: all calls into a contract, calls from one sender, calls that carried ETH, one method by name. It does not simulate a hypothetical call; it returns what executed. Every query runs in the [IDE](https://ide.bitquery.io) on a free account, on Ethereum and, by changing `network`, on the other EVM chains.

## Calls into a contract

Every call whose target is the USDC contract in the last ten minutes, with the fields a trace returns. `Depth` separates top-level calls (0) from internal ones, `Success` flags reverts, and `Signature.Name` is the decoded method. The time bound keeps the scan small; widen it, or add `dataset: archive` for history.

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: { To: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      ChainId
      Block {
        Time
      }
      Call {
        From
        To
        Input
        Output
        Gas
        GasUsed
        Value
        Create
        Success
        Depth
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

`Gas` is the gas available to the call and `GasUsed` what it consumed, both in gas units; `Value` is in wei. The saved IDE version of this query is [here](https://ide.bitquery.io/debug_traceCall).

## Calls from a known sender

Add `From` to the filter. This ranks the addresses that called USDC most in the last hour, which is the quickest way to find an active sender to trace; then put that address in `From: { is: "..." }` with the selection above. Saved variant [here](https://ide.bitquery.io/debug_traceCall_1).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: { To: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 3 }
      orderBy: { descendingByField: "n" }
    ) {
      Call {
        From
      }
      n: count
    }
  }
}
```

## Calls that carried value

`Value` takes `eq`, `ne`, `gt`, `ge`, `lt` and `le`, where the RPC method only matches a fixed value. Calls into WETH with value above zero are deposits, most of them internal calls made by routers on a user's behalf. Saved variant [here](https://ide.bitquery.io/debug_traceCall_2).

```graphql
{
  EVM(network: eth) {
    Calls(
      where: {
        Call: { To: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }, Value: { gt: "0" } }
        Block: { Time: { since_relative: { hours_ago: 1 } } }
      }
      limit: { count: 5 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Call {
        From
        To
        Value
        Depth
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

## What the RPC method has that this does not, and the reverse

`debug_traceCall` simulates a call you have not sent, against any block state. Bitquery only returns calls that executed. In return you get filters across every transaction at once, decoded method names and arguments, `dataset: archive` for history, and a subscription form that streams new calls into a contract as they happen. For a full transaction's trace, filter `Transaction: { Hash: { is: "..." } }` and read the calls in `Call.Index` order.

<FAQ
  items={[
    { q: "Can Bitquery replace debug_traceCall?", a: "For tracing what executed on chain, yes: the Calls cube has from, to, input, output, gas, gas used, value, create and success for every top-level and internal call, plus decoded method names. It does not simulate a call that was never sent." },
    { q: "How do I get all internal calls of one transaction?", a: "Filter the Calls cube on Transaction.Hash and sort by Call.Index; Depth tells you the nesting level and Success whether a call reverted." },
    { q: "How do I get internal calls on BSC, Base or Polygon?", a: "Change the network name in EVM(network: ...). The Calls cube has the same fields on every EVM chain Bitquery indexes." },
    { q: "Can I stream calls into a contract in real time?", a: "Yes. Change query to subscription, keep the Call.To filter and drop limit and orderBy; each new call into the contract arrives as it is indexed." },
    { q: "Why does my Calls query time out?", a: "An unbounded scan over a busy contract is large. Add a time window with since_relative, keep a limit, and add dataset: archive only when you need history." },
  ]}
/>

## Related pages

- [EVM calls schema](/docs/schema/evm/calls)
- [Robinhood Calls and traces API](/docs/blockchain/robinhood/robinhood-calls-api)
- [eth_blockNumber with Bitquery](/docs/blockchain/Ethereum/ethers-library/eth_blockNumber)
- [Ethereum API hub](/docs/blockchain/Ethereum/)
