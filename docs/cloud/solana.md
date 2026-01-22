---
title: Solana Blockchain Data Export - Cloud Datasets for Snowflake, AWS S3, BigQuery
description: Export Solana blockchain data to cloud storage with Parquet datasets optimized for Snowflake, AWS S3, Google BigQuery, and data lakes. Get blocks, transactions, transfers, balance updates, DEX trades, and rewards for large-scale analytics.
keywords:
  - Solana blockchain data
  - Solana data export
  - Solana DEX trades
  - Solana transfers
  - Solana balance updates
  - Solana DEX pools
  - Solana DEX orders
  - Solana rewards
  - Parquet datasets
  - Snowflake Solana data
  - AWS S3 Solana
  - BigQuery Solana
  - Solana cloud storage
  - Solana historical data
  - Solana data lake
  - Solana analytics
  - Solana data warehouse
  - Solana Parquet files
  - Solana batch data
  - Solana data dumps
  - SOL token transfers
  - SPL token transfers
sidebar_position: 5
---

# Solana Data Export for Snowflake, AWS, Google Cloud, etc.

Bitquery provides **Solana blockchain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.


## Available Solana Topics

For Solana, Bitquery currently provides the following datasets:

-   **Blocks** – Slot-level block metadata
    
-   **Transactions** – Full transaction-level data
    
-   **Transfers** – Native SOL and token transfers
    
-   **Balance Updates** – Account balance changes per slot
    
-   **DEX Pools** – Decentralized exchange pool metadata
    
-   **DEX Orders** – Order-level DEX activity
    
-   **DEX Trades** – Executed trades on Solana DEXs
    
-   **Rewards** – Validator and staking rewards
    
## Sample Solana Cloud Dataset

You can explore schemas and validate your tooling using the **public Solana sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/solana](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/solana)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/solana/balance_updates/390740000_390740049.parquet

```



## Solana Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── solana/
    ├── balance_updates/
    │   ├── 390740000_390740049.parquet
    │   ├── 390740050_390740099.parquet
    │   └── ...
    ├── blocks/
    │   ├── 390740000_390740049.parquet
    │   ├── 390740050_390740099.parquet
    │   └── ...
    ├── dex_orders/
    │   ├── 390740000_390740049.parquet
    │   └── ...
    ├── dex_pools/
    │   ├── 390740000_390740049.parquet
    │   └── ...
    ├── dex_trades/
    │   ├── 390740000_390740049.parquet
    │   └── ...
    ├── rewards/
    │   ├── 390740000_390740049.parquet
    │   └── ...
    ├── transactions/
    │   ├── 390740000_390740049.parquet
    │   └── ...
    └── transfers/
        ├── 390740000_390740049.parquet
        └── ...

```

### Slot Range Naming Convention

Each Parquet file name follows this format:

```
<start_slot>_<end_slot>.parquet

```

Example:

```
390740000_390740049.parquet

```

    


## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Solana data**, Bitquery also provides:

-   [**Kafka streams**](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
    
