---
title: "Cross-Chain Blockchain Data API: One Query Across Chains"
description: "Three ways to read several blockchains in one Bitquery call: Trading cubes with one schema for nine chains, aliases over chain roots, and the Currencies cube."
slug: /category/cross-chain
sidebar_label: "Cross-Chain"
keywords:
  - cross-chain API
  - multi-chain blockchain API
  - query multiple blockchains one API
  - cross-chain token price
  - multi-chain NFT tracking
  - Bitquery multi-chain
---

import FAQ from "@site/src/components/FAQ";

# Cross-Chain Blockchain Data API: One Query Across Chains

Bitquery serves every chain from one GraphQL endpoint, and there are three ways to read more than one chain in a single call. The `Trading` cubes carry trades, prices, market cap and supply for Solana, Ethereum, BNB Chain, Base, Arbitrum, Optimism, Polygon, Tron and Robinhood Chain in one schema, so a filter on a token symbol returns rows from every network at once. GraphQL aliases let one query address several chain roots, such as `EVM(network: bsc)` and `EVM(network: eth)`, and return them side by side. And the `Currencies` cube aggregates one asset across networks into a single price, so `bid:bitcoin` is one row rather than a list of wrapped versions.

## Three ways to go cross-chain

| Approach | Use it when | Example |
|---|---|---|
| Trading cubes, one schema, nine chains | You want trades, candles, market cap or supply for a token wherever it trades | The USDC query below |
| Aliases over chain roots | You need chain-level cubes (transfers, balances, calls) for the same address or contract on several chains | [NFTs tracking across chains](/docs/examples/cross-chain/cross-chain-api) |
| `Trading.Currencies` | You want one price per asset regardless of chain | `Currency: { Id: { is: "bid:bitcoin" } }` on the [Crypto Price API](/docs/trading/crypto-price-api/) |

## USDC trades on every chain in one call

No network filter: the rows come back tagged with the network they happened on. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account.

```graphql
{
  Trading {
    Trades(
      where: {
        Pair: { Token: { Symbol: { is: "USDC" } } }
        Block: { Time: { since_relative: { minutes_ago: 10 } } }
      }
      limit: { count: 5 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Pair {
        Market {
          Network
          Protocol
        }
        Token {
          Symbol
          Network
        }
        QuoteToken {
          Symbol
        }
      }
      PriceInUsd
      AmountsInUsd {
        Base
      }
    }
  }
}
```

Add `Pair: { Market: { NetworkBid: { in: ["bid:eth", "bid:base"] } } }` to keep only the chains you care about, or group by `Pair_Market_Network` with `count` and `sum` to compare chains in one table.

## Aliases over several chain roots

A GraphQL alias names each root, so `binance: EVM(network: bsc) { ... }` and `ethereum: EVM(network: eth) { ... }` run in one request and come back as two keys. Fragments keep the selection identical across them. The [NFTs tracking across chains](/docs/examples/cross-chain/cross-chain-api) page shows the pattern for one wallet's NFTs on several chains; the same pattern applies to transfers, calls or events. Note that the cubes and field names must exist on every root you alias, so it works across the EVM chains, while Solana needs its own selection.

<FAQ
  items={[
    { q: "Can I query several blockchains in one API call?", a: "Yes. The Trading cubes return rows from all nine supported chains in one query, and GraphQL aliases let a single request address several chain roots, such as EVM(network: bsc) and EVM(network: eth), with the results side by side." },
    { q: "Which chains do the cross-chain Trading cubes cover?", a: "Solana, Ethereum, BNB Chain, Base, Arbitrum, Optimism, Polygon, Tron and Robinhood Chain, with the same fields and USD values on every row." },
    { q: "How do I get one price for an asset that exists on many chains?", a: "Use the Currencies cube with the asset id, such as bid:bitcoin, which aggregates trades of that asset across networks into one price series." },
    { q: "Can I compare the same wallet or contract across EVM chains?", a: "Yes. Alias the EVM root once per chain with the same address filter and selection, and the response carries one block per chain. The NFTs tracking page shows a complete example." },
    { q: "Does the same query syntax work on every chain?", a: "Yes for the EVM chains, which share cubes and field names. Solana has its own cubes such as Instructions and BalanceUpdates, so a Solana selection is written separately, while the Trading cubes hide the difference entirely." },
  ]}
/>

## Related pages

- [Crypto Price API](/docs/trading/crypto-price-api/)
- [Crypto Trades API](/docs/trading/crypto-trades-api/trades-api/)
- [Supported chains](/docs/blockchain/supported-chains)
- [Understanding cubes](/docs/category/understanding-cubes)
