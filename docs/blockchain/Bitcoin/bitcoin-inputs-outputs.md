---
title: Bitcoin Inputs and Outputs API - UTXO Data, Miner Rewards & BTC Price
sidebar_label: Bitcoin Inputs & Outputs API
description: Query Bitcoin UTXO inputs and outputs with Bitquery GraphQL. Get historical BTC price, address balance at a block height, miner block rewards, and per-address activity.
keywords:
  - Bitcoin inputs outputs API
  - Bitcoin UTXO API
  - Bitcoin miner rewards
  - Bitcoin historical price
  - Bitcoin balance at block height
  - Bitcoin GraphQL
  - BTC UTXO
  - Bitquery Bitcoin
---

# Bitcoin Inputs and Outputs API

Bitcoin runs on an unspent-transaction-output (UTXO) model — every transaction consumes previous outputs (inputs) and creates new ones (outputs). These APIs give you direct access to that UTXO data with BTC and USD values, block context, transaction hashes, and per-address filtering. They're the foundation for balance reconstruction, miner reward tracking, historical price lookups, and detailed wallet activity feeds.

:::info Endpoint
Bitcoin GraphQL queries are served at `https://graphql.bitquery.io`.
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Get the BTC price on a given date

Pulls the BTC/USD price implied by any output on a given date — Bitquery stores the spot value at the time of each transaction, so you can derive a historical price by dividing USD value by BTC value. [Run query](https://ide.bitquery.io/btc-price-in-2016).

```graphql
query MyQuery {
  bitcoin {
    outputs(date: {is: "2016-01-01"}) {
      value
      usd: value(in: USD)
      expression(get: "usd/value")
    }
  }
}
```

## Get a Bitcoin balance at a specific block height

Sum outputs and subtract inputs with a `height: {lteq: N}` cap to get the wallet's balance at a specific point on-chain. Useful for audits, tax snapshots, and point-in-time portfolio reporting. [Run query](https://ide.bitquery.io/bitcoin-balance-on-a-given-block-height).

```graphql
{
  bitcoin(network: bitcoin) {
    inputs(
      height: {lteq: 919195}
      inputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
    outputs(
      height: {lteq: 919195}
      outputAddress: {is: "bc1ppu6akjngyvpxwz0w38n4evcygwh08tjtmcc0dx6ft2zzgkxtd97stwehcq"}
    ) {
      count
      value
      value_usd: value(in: USD)
      min_date: minimum(of: date)
      max_date: maximum(of: date)
    }
  }
}
```

## List UTXO inputs and outputs for an address inside a block range

Returns spent and received UTXOs for a specific address between two block heights, with date, transaction hash, block height, address annotation, and value. [Run query](https://ide.bitquery.io/bitcoin-inputs-and-outputs-for-address).

```graphql
{
  bitcoin(network: bitcoin) {
    spendvolumes: inputs(
      inputAddress: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
      height: {between: [822372, 822376]}
    ) {
      date {
        date
      }
      any(of: amount)
      block {
        height
      }
      transaction {
        hash
      }
      inputAddress {
        annotation
        address
      }
      value
    }
    recievevolumes: outputs(
      height: {between: [822372, 822376]}
      outputAddress: {is: "bc1p4kufll9uhnpkgzuc65slcxd2qaw2hl9xecket3h8yyu4awglcsqslqaztd"}
    ) {
      date {
        date
      }
      any(of: amount)
      transaction {
        hash
      }
      block {
        height
      }
      outputAddress {
        annotation
        address
      }
      value
    }
  }
}
```

The same shape works with `date: {since: ..., till: ...}` instead of `height: {between: [...]}` when you want to filter by time rather than block range.

## Get daily miner block rewards on Bitcoin

Mining rewards live in coinbase outputs (the first transaction in every block, `txIndex: 0`) with `outputDirection: mining`. This query returns daily reward totals per miner address along with the number of unique blocks they mined — the standard view for tracking mining pool activity and reward distribution. [Run query](https://ide.bitquery.io/bitcoin-miners-rewards).

```graphql
query ($network: BitcoinNetwork!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
  bitcoin(network: $network) {
    outputs(
      options: {asc: "date.date"}
      date: {since: $from, till: $till}
      txIndex: {is: 0}
      outputDirection: {is: mining}
      outputScriptType: {notIn: ["nulldata", "nonstandard"]}
    ) {
      address: outputAddress {
        address
        annotation
      }
      date {
        date(format: $dateFormat)
      }
      reward: value
      count(uniq: blocks)
    }
  }
}
```

## Count miner activity in a time window

Pulls the activity count per miner address inside a date range. Drop or extend the date window to size the cohort however you need. [Run query](https://ide.bitquery.io/get-miners-activity-in-a-specific-timeframe).

```graphql
query MyQuery {
  bitcoin(network: bitcoin) {
    outputs(
      outputDirection: {is: mining}
      date: {since: "2025-01-01", till: "2025-01-10"}
      outputScriptType: {notIn: ["nulldata", "nonstandard"]}
    ) {
      outputAddress {
        address
      }
      count
    }
  }
}
```

## Find a miner's first mining activity

For a specific set of miner addresses, this query returns the first block each one mined. Useful for cohort analysis, miner onboarding studies, or building "first seen" timelines. [Run query](https://ide.bitquery.io/get-miners-first-activity).

```graphql
query MyQuery {
  bitcoin(network: bitcoin) {
    outputs(
      outputDirection: {is: mining}
      options: {asc: "block.timestamp.iso8601", limitBy: {each: "outputAddress.address", limit: 1}}
      outputAddress: {in: ["1K6KoYC69NnafWJ7YgtrpwJxBLiijWqwa6", "1KGG9kvV5zXiqyQAMfY32sGt9eFLMmgpgX"]}
      outputScriptType: {notIn: ["nulldata", "nonstandard"]}
    ) {
      outputAddress {
        address
      }
      block {
        timestamp {
          iso8601
        }
      }
    }
  }
}
```

## Video tutorial: daily miner rewards

<VideoPlayer url="https://youtu.be/3RC7Mxitfzg" />

## Related resources

- [Bitcoin Address API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-address-api) — balances and activity stats per address
- [Bitcoin Coinpath API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-coinpath-api) — multi-hop fund flow tracing
- [Bitcoin Transactions API](https://docs.bitquery.io/docs/blockchain/Bitcoin/bitcoin-transactions-api) — transaction-level totals and fees
- [Bitcoin Kafka stream](https://docs.bitquery.io/docs/streams/protobuf/chains/Bitcoin-protobuf) — real-time UTXO delivery
