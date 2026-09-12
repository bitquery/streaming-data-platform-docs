---
title: "EVM Cubes: Trades, Transfers, Balances, Calls and Events"
description: "The cubes under EVM(network: ...) for Ethereum, BNB Chain, Base, Arbitrum, Optimism, Polygon and Robinhood Chain: what each holds, how far back, which to query."
slug: /category/evm-cube
sidebar_label: "EVM Cubes"
keywords:
  - EVM cubes
  - Ethereum GraphQL API cubes
  - EVM DEXTrades
  - EVM Transfers cube
  - EVM Calls Events cube
  - Bitquery EVM schema
---

import FAQ from "@site/src/components/FAQ";

# EVM Cubes: Trades, Transfers, Balances, Calls and Events

Every EVM chain Bitquery indexes is queried through one root, `EVM(network: ...)`, with the same cubes underneath: `DEXTrades`, `DEXTradeByTokens`, `DEXPools`, `Transfers`, `Balances`, `Holders`, `BalanceUpdates`, `Transactions`, `Calls`, `Events`, `Blocks` and `MinerRewards`. A query written for Ethereum runs on BNB Chain, Base, Arbitrum, Optimism, Polygon or Robinhood Chain by changing the network name. Each cube takes `where`, `orderBy` and `limit`, supports `count`, `sum`, `uniq` and the other aggregates, and streams as a subscription. This page is the map; the [EVM builder terms](/docs/cubes/EVM) page lists every field.

## The cubes

| Cube | One row is | Reach for it when |
|---|---|---|
| `DEXTrades` | One swap with buy and sell sides, DEX, pool and trader | You need individual trades or a trade feed |
| `DEXTradeByTokens` | One token side of a swap | You want per-token volume, OHLC, buyers, sellers or top pairs |
| `DEXPools` | A pool event: creation, liquidity change, reserves | Pool discovery, TVL, slippage |
| `Transfers` | One token or native transfer | Wallet activity, whale alerts, holder movements |
| `Balances` and `Holders` | Current balance of an address, or holders of a token | Portfolios, holder rankings, distribution |
| `BalanceUpdates` | One balance change with its type | Balance history and reasons for a change |
| `Transactions` | One transaction with receipt, gas and status | Receipts, fees, failure rates |
| `Calls` | One call or internal call with decoded arguments | Method traces, contract deployments, reverts |
| `Events` | One decoded log | Any contract event, an `eth_getLogs` replacement |
| `Blocks` and `MinerRewards` | One block, one reward | Block metadata and validator or miner rewards |

## Networks

`eth`, `bsc`, `base`, `arbitrum`, `optimism`, `matic`, `robinhood` and `arc_testnet` work in `EVM(network: ...)`. Arc testnet is realtime-only with USD fields at 0; see the [Arc Testnet hub](/docs/blockchain/arc-testnet/). The chain hubs under [Blockchain](/docs/blockchain/Ethereum/) carry worked examples per chain; the schema is the same.

## Datasets and depth

Add `dataset: archive` or `dataset: combined` for history; without it a cube returns its realtime window only, which is hours to a few days depending on the cube. `DEXPools` is realtime-only on every chain: the archive and combined datasets do not exist for it. `Transactions` keeps full history on archive. The per-cube table is on [data coverage and retention](/docs/graphql/data-coverage-retention).

## Example: the busiest tokens on Ethereum in the last hour

`DEXTradeByTokens` with a relative time filter, sorted by an aggregate. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account; change `eth` to another network and it still runs.

```graphql
{
  EVM(network: eth) {
    DEXTradeByTokens(
      where: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
      orderBy: { descendingByField: "trades" }
      limit: { count: 5 }
    ) {
      Trade {
        Currency {
          Symbol
          SmartContract
        }
      }
      trades: count
      volume_usd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

## Pages in this section

| Page | Read it for |
|---|---|
| [EVM builder terms](/docs/cubes/EVM) | Every argument and field across the EVM cubes |
| [DEX Trades cube](/docs/cubes/dextrades) | Swap-level rows |
| [DEXTradeByTokens cube](/docs/cubes/dextradesbyTokens) | Per-token aggregates and OHLC |
| [DEXTrades vs DEXTradeByTokens vs Trades](/docs/cubes/dextrades-dextradebytokens-trading-trades) | Which trade cube to use |
| [DEXPools cube](/docs/cubes/evm-dexpool) | Pools, reserves, liquidity events |
| [Transaction cube](/docs/cubes/transaction-cube) | Transactions and receipts |
| [Balances and Holders cubes](/docs/cubes/balances-cube) | Current balances and holder rankings |
| [Balance Updates cube](/docs/cubes/balance-updates-cube) | Balance history |
| [Transfers cube](/docs/cubes/transfers-cube) | Token and native transfers |
| [EVM token holders schema](/docs/schema/evm/token-holders) | Holder field reference |

<FAQ
  items={[
    { q: "Which EVM chains share the same cubes?", a: "Ethereum, BNB Chain, Base, Arbitrum, Optimism, Polygon and Robinhood Chain. Change the network argument in EVM(network: ...) and the same query runs on another chain." },
    { q: "How do I get decoded contract events on an EVM chain?", a: "Use the Events cube with the contract address and the event name or topic0 in the filter. Arguments come back decoded by name, so it replaces eth_getLogs plus your own ABI decoding." },
    { q: "Which cube returns current token balances?", a: "Balances for what an address holds now and Holders for who holds a token. BalanceUpdates is the per-change history behind them." },
    { q: "How far back do EVM cubes go?", a: "It depends on the cube and the dataset. Realtime holds hours to a few days; archive and combined reach the chain's indexing start for most cubes, while DEXPools is realtime-only. The retention page lists each cube." },
    { q: "Can I get internal transactions on EVM chains?", a: "Yes. The Calls cube returns internal calls with depth, decoded arguments and success flags, alongside top-level method calls and contract deployments." },
  ]}
/>

## Related pages

- [Understanding cubes](/docs/category/understanding-cubes)
- [Ethereum API hub](/docs/blockchain/Ethereum/)
- [EVM schema reference](/docs/schema/evm/dextrades)
- [Data coverage and retention](/docs/graphql/data-coverage-retention)
