---
title: BSC Data - BNB Chain Export for Snowflake, AWS S3, BigQuery
description: Export BSC (BNB Chain) blockchain data to cloud storage with Parquet datasets optimized for Snowflake, AWS S3, Google BigQuery, and data lakes. Get blocks, transactions, transfers, DEX trades, balance updates, and smart contract data for large-scale analytics.
keywords:
  - BSC blockchain data
  - BNB Chain data export
  - BSC data export
  - BSC DEX trades
  - BSC transfers
  - BSC balance updates
  - BSC transactions
  - BSC smart contracts
  - BSC events
  - BSC logs
  - BSC calls
  - BSC DEX pools
  - Parquet datasets
  - Snowflake BSC data
  - AWS S3 BSC
  - BigQuery BSC
  - GCP BigQuery BSC
  - Redshift BSC data
  - Databricks BSC
  - Athena BSC queries
  - Spark BSC data
  - BSC cloud storage
  - BSC historical data
  - BSC data lake
  - BSC analytics
  - BSC data warehouse
  - BSC Parquet files
  - BSC batch data
  - BSC data dumps
  - BNB Chain Parquet
  - BSC blockchain export
  - BSC data pipeline
  - BSC ETL data
  - BSC real-time data
  - BSC streaming data
  - BSC on-chain data
  - DeFi data export BSC
  - NFT data export BSC
  - Web3 data analytics BSC
  - BSC mainnet data
  - Binance Smart Chain data
  - BNB Chain analytics
  - PancakeSwap data
  - BSC DEX analytics
sidebar_position: 6
---

# BSC Data - BNB Chain

Bitquery provides **BSC (BNB Chain) blockchain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

## Available BSC Topics

For BSC (BNB Chain), Bitquery currently provides the following datasets:

-   **Blocks** – Block-level metadata
-   **Transactions** – Full transaction-level data
-   **Transfers** – Native BNB and token transfers (BEP-20)
-   **Balance Updates** – Account balance changes per block
-   **DEX Trades** – Executed trades on BSC DEXs (PancakeSwap, etc.)
-   **DEX Pools** – Decentralized exchange pool metadata
-   **Smart Contract Calls** – Function calls and contract interactions
-   **Events** – BSC event logs and emissions
-   **Miner Rewards** – Block rewards and transaction fees

## Sample BSC Cloud Dataset

You can explore schemas and validate your tooling using the **public BSC sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/bsc](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/bsc)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/bsc/balance_updates/<block_range>.parquet
```

## BSC Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── bsc/
    ├── balance_updates/
    │   ├── <start_block>_<end_block>.parquet
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── blocks/
    │   ├── <start_block>_<end_block>.parquet
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── calls/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── dex_pools/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── dex_trades/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── events/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── miner_rewards/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── transactions/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    └── transfers/
        ├── <start_block>_<end_block>.parquet
        └── ...
```

### Block Range Naming Convention

Each Parquet file name follows this format:

```
<start_block>_<end_block>.parquet
```

Example:

```
35000000_35000049.parquet
```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming BSC data**, Bitquery also provides:

-   [**Kafka streams**](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)
-   **GraphQL subscriptions**
