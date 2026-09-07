---
title: "Bitquery Glossary: EVM and Solana Terms Used in the Docs"
description: "Definitions for the arguments, cubes and fields that appear in Bitquery queries, split into EVM terms and Solana terms, with the sections readers look up most."
slug: /category/glossary
sidebar_label: "Glossary"
keywords:
  - Bitquery glossary
  - Bitquery terms
  - EVM builder terms
  - Solana builder terms
  - dataset parameter
  - currency field attributes
---

import FAQ from "@site/src/components/FAQ";

# Bitquery Glossary: EVM and Solana Terms Used in the Docs

The glossary explains every argument, cube and field name a Bitquery query can contain, in two pages: one for the EVM chains and one for Solana. Each page walks the same order: the dataset, network and filter arguments on the root, then the terms of each cube (balance updates, blocks, calls or instructions, DEX trades, events, transactions, rewards, transfers), then the attributes of the `Currency` object that appears in most of them. Use it when a field name in an example is unclear, or when the IDE autocompletes something you have not seen before.

## The two pages

| Page | Covers |
|---|---|
| [EVM builder terms](/docs/glossary/EVM) | `dataset`, `mempool` and `network` arguments, filter parameters, and the terms of the BalanceUpdates, Blocks, Calls, DEXTradeByTokens, DEXTrades, Events, Transactions, MinerRewards and Transfers cubes, plus `Currency` attributes |
| [Solana builder terms](/docs/glossary/solana) | `dataset` and filter arguments, and the terms of the BalanceUpdates, Blocks, DEXOrders, DEXTradeByTokens, DEXTrades, Instructions, Rewards, Transactions and Transfers cubes, plus `Currency` attributes |

## Most looked-up sections

| Term | Where |
|---|---|
| `dataset: realtime`, `archive`, `combined` | [EVM dataset parameters](/docs/glossary/EVM#dataset-parameters), [Solana dataset parameters](/docs/glossary/solana#dataset-parameters) |
| `mempool` argument | [EVM mempool parameter](/docs/glossary/EVM#mempool-parameter) |
| `network` argument | [EVM network parameter](/docs/glossary/EVM#network-parameter) |
| `where`, `orderBy`, `limit`, `limitBy` | [EVM filter parameters](/docs/glossary/EVM#filter-parameters), [Solana filter parameters](/docs/glossary/solana#filter-parameters) |
| DEX trade fields: `Buy`, `Sell`, `Dex`, `Side`, `PriceInUSD` | [EVM DEXTrades terms](/docs/glossary/EVM#dextrades-api-terms), [Solana DEXTrades terms](/docs/glossary/solana#dextrades-api) |
| Per-token trade aggregates | [EVM DEXTradeByTokens terms](/docs/glossary/EVM#dextradebytokens-api-terms), [Solana DEXTradeByTokens terms](/docs/glossary/solana#dextradebytokens-api) |
| Decoded calls and instructions | [EVM Calls terms](/docs/glossary/EVM#calls-api-terms), [Solana Instructions terms](/docs/glossary/solana#instructions-api) |
| `Currency` attributes: `Native`, `Fungible`, `SmartContract`, `MintAddress`, `Decimals` | [EVM currency attributes](/docs/glossary/EVM#currency-field-attributes-explained), [Solana currency terms](/docs/glossary/solana#currency-field-terms-explained) |

## Two terms in one query

`dataset: combined` on the root reaches history and the realtime tail together; `Currency.Native` marks the chain's own coin (ETH here) as opposed to a token. Run it in the [Bitquery IDE](https://ide.bitquery.io) on a free account.

```graphql
{
  EVM(network: eth, dataset: combined) {
    Transfers(
      limit: { count: 3 }
      orderBy: { descending: Block_Time }
      where: { Transfer: { Currency: { Native: true } } }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        Currency {
          Symbol
          Native
        }
      }
    }
  }
}
```

<FAQ
  items={[
    { q: "What does the dataset argument mean?", a: "It picks the storage a chain-level query reads: realtime for the freshest short window, archive for history, combined for both stitched together. Leaving it out means realtime." },
    { q: "What is the difference between a native currency and a token?", a: "The native currency is the chain's own coin, such as ETH or SOL, marked by Currency.Native being true. Tokens are contracts (EVM SmartContract) or mints (Solana MintAddress) and carry their own Decimals." },
    { q: "What do Buy and Sell mean in a DEX trade row?", a: "The two sides of one swap: the currency and amount received and the currency and amount given. In DEXTradeByTokens the row is one token's side, and Side describes the other token, so a trade appears twice, once per token." },
    { q: "Where are Solana instructions defined?", a: "In the Solana builder terms under Instructions API: program address, method, accounts, decoded arguments and the instruction index within the transaction." },
    { q: "Is there a glossary for the Trading cubes?", a: "Their fields are documented on the Crypto Price API and Crypto Trades API pages, which explain Tokens, Pairs, Currencies and Trades with examples." },
  ]}
/>

## Related pages

- [Understanding cubes](/docs/category/understanding-cubes)
- [GraphQL query capabilities](/docs/category/capabilities)
- [Crypto Price API](/docs/trading/crypto-price-api/)
