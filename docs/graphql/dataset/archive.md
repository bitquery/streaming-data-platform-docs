---
sidebar_position: 5
title: "GraphQL Archive Dataset"
description: "Query historical blockchain data with Bitquery’s archive dataset, including retention notes, limits, and GraphQL examples."
---
# Archive Database

Archive database contains the data with the **delay from tens of minutes to several hours**,
depending on the blockchain. It contains the data from the first (genesis).

You need to query it when you need:

* statistics, where the latest data does not contribute much value
* all the blocks including the blockchain
* aggregated queries, like balances, counts, volumes

:::tip
Archive Database features:

* includes all blocks from the genesis (first one)
* has a strong consistency of the data
* only trunk blocks included
* has significant delay of data (from tens of minutes to hours)
* queries need to be optimized, as the archive size quite significant

:::

Also Check [Combined](/docs/graphql/dataset/combined) and [RealTime](/docs/graphql/dataset/realtime) dataset.

## Do I need anything to query the archive dataset? {#access}

Yes. Self-serve plans query `realtime` by default. To run a query with
`dataset: archive` or `dataset: combined` you add a **historical data add-on**
for the chain you want, from **Account → Billing**. Without it the query is
rejected with:

```
access restricted: your plan only allows "realtime",
but the request uses "archive:eth:Transactions"
```

That message names exactly what you asked for, so it also tells you which
add-on to buy.

### Chains with a self-serve historical add-on

| Chain | Add-ons available |
| --- | --- |
| Ethereum, BNB Chain (BSC), Base, Arbitrum, Optimism, Polygon, Tron, Robinhood | Historical Trading Data · Historical Transfers + Balances + Holders |
| Solana | Historical OHLCV & Token Price · Historical Token Transfers & Balances |
| Bitcoin, Bitcoin Cash, Litecoin, Dogecoin, Dash, Zcash | Chain Data (historical included) |
| Polymarket | Historical Data |

Bundles cover all EVM chains at once, and all six UTXO chains at once. Current
prices are on the [pricing page](https://bitquery.io/pricing).

### Chains that are Enterprise only

Cardano, Ripple, Stellar, Algorand, Filecoin, Avalanche, Celo, Cronos and
Klaytn have **no self-serve historical add-on**. Historical access to those is
part of an Enterprise plan — [contact sales](https://bitquery.io/forms/api).

:::caution Archive is not deployed for every cube on every chain
Even with the add-on, some cube and chain combinations have no archive table.
Those return a ClickHouse error such as
`no table can query <Cube> ... consider use realtime dataset`. That is not a
problem with your query. Check the
[Data Coverage & Retention matrix](/docs/graphql/data-coverage-retention/)
for what exists where.
:::

## Does Bitquery have data for all historical blocks since genesis? {#does-bitquery-have-data-for-all-historical-blocks-since-genesis}

With the exception of Solana, Bitquery provides complete historical data (from genesis onward) for all supported blockchains. For Solana, full historical token transfers are available via the V1 API, while in V2, Bitquery offers price aggregates starting from 2024.
