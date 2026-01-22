---
title: EVM Blockchain Data Export - Ethereum, BSC, Polygon Datasets for Snowflake, AWS S3, BigQuery
description: Export EVM blockchain data for Ethereum, BSC, Base, Polygon, Optimism to cloud storage with Parquet datasets optimized for Snowflake, AWS S3, Google BigQuery, and data lakes. Get blocks, transactions, transfers, DEX trades, and balance updates.
keywords:
  - EVM blockchain data
  - Ethereum data export
  - BSC blockchain data
  - Polygon data export
  - Base blockchain data
  - Optimism data export
  - EVM DEX trades
  - EVM transfers
  - EVM balance updates
  - EVM transactions
  - Parquet datasets
  - Snowflake EVM data
  - AWS S3 EVM
  - BigQuery EVM
  - EVM cloud storage
  - EVM historical data
  - EVM data lake
  - EVM analytics
  - EVM data warehouse
  - EVM Parquet files
  - EVM batch data
  - EVM data dumps
  - Ethereum Parquet
  - BSC Parquet
  - Polygon Parquet
sidebar_position: 2
---

# EVM Data Export for Snowflake, AWS, Google Cloud etc

Bitquery provides **blockchain data dumps for EVM-base chains like Ethereum, BSC, Base, Polygon/Matic, Optimism, etc.** in parquet format that you can host directly in your own cloud (for example AWS S3) and plug into your analytics stack or data lake.

## Available Topics

For EVM chains we currently provide the following topics:

- **Blocks** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/blocks.js)
- **Balance Updates** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/balance_updates.js)
- **DEX Pools** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/dex_pools.js)
- **DEX Trades** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/dex_trades.js)
- **Uncle Blocks** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/uncle_blocks.js)
- **Transactions** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/transactions.js)
- **Transfers** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/transfers.js)


## Sample Ethereum Cloud Dataset

To explore the schema and test your tooling, use our **public sample EVM datasets** on GitHub:

- **Ethereum samples**:  
  [`https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ethereum`](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ethereum)


The GitHub repository includes one sample file. The complete list of Parquet files is stored in our public S3 bucket and can be accessed directly. For example:  
`https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balance_updates/24053500_24053549.parquet`

```text


bitquery-blockchain-dataset/
└── ethereum/
    ├── balance_updates/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── blocks/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── calls/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── dex_trades/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── events/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── miner_rewards/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── transactions/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── transfers/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    └── uncle_blocks/
        ├── 15535500_15535549.parquet
        ├── 15535550_15535599.parquet
        ├── 15535600_15535649.parquet
        ├── 15535650_15535699.parquet
        ├── 15535700_15535749.parquet
        ├── 15535750_15535799.parquet
        ├── 15535800_15535849.parquet
        └── 15535850_15535899.parquet
```

Use these samples to:

- **Validate your ETL / analytics pipeline** against realistic EVM data.
- **Inspect column names and types** before connecting to full buckets.
- **Benchmark query performance** on your preferred engines and hardware.

## Other Ways to Access EVM Data

Cloud data dumps are ideal for **batch analytics** and **historical workloads**.  
If you need **low-latency real-time data**, you can also consume Bitquery streams via **Kafka** and GraphQL subscriptions.

- **Kafka-based real-time streams** (mempool and committed data) are documented here:  
  [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts)

