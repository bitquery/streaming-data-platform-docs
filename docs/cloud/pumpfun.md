---
title: Pump.fun Data - Snowflake, AWS S3, BigQuery
description: "Pump.fun Data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Pumpfun data
  - Pump.fun data export
  - Pumpfun token creations
  - Pumpfun migrations
  - Pumpfun DEX trades
  - Pumpfun liquidity pools
  - Pumpfun OHLCV
  - Solana Pumpfun data
  - Parquet datasets
  - Snowflake Pumpfun data
  - AWS S3 Pumpfun
  - BigQuery Pumpfun
  - Pumpfun cloud storage
  - Pumpfun historical data
  - Pumpfun data lake
  - Pumpfun analytics
  - Pumpfun data warehouse
  - Pumpfun Parquet files
  - Pumpfun batch data
  - Pumpfun data dumps
sidebar_position: 6
---
# Pump.fun Data

Bitquery provides **Pump.fun data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

## Available Pump.fun Topics

For Pump.fun, Bitquery currently provides the following datasets:

-   **Creation & Migration Events** – Pump.fun token creation and migration events
    
-   **DEX Trades** – Executed trades on Pump.fun
    
-   **DEX Pools** – Liquidity pool metadata and activity
    
-   **OHLCV** – Open/High/Low/Close/Volume candles per token
    
## Sample Pump.fun Cloud Dataset

You can explore schemas and validate your tooling using the **public Pump.fun sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/solana](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/solana)

**Sample Parquet downloads (public S3)**

-   **Creation & Migration Events** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/solana/pumpfun_creation_migrations/2026-07-01.parquet)
    
-   **DEX Trades** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/solana/dex_trades/pumpfun/390740000_390740049.parquet)
    
-   **DEX Pools** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/Pumpfun_Sample/dex_pools/415261250_415261499.parquet)
    
-   **OHLCV** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/Pumpfun_Sample/ohlcv/2ra5idczuCQhDe1U5D52G8Rms6hzHuHeTqP51fdHpump.parquet)
    

## Pump.fun Dataset Directory Structure

```text
bitquery-blockchain-dataset/
├── solana/
│   ├── pumpfun_creation_migrations/
│   │   ├── 2026-07-01.parquet
│   │   ├── 2026-07-02.parquet
│   │   └── 2026-07-03.parquet
│   └── dex_trades/
│       └── pumpfun/
│           ├── 390740000_390740049.parquet
│           ├── 390740050_390740099.parquet
│           ├── 390740100_390740149.parquet
│           └── 390740150_390740199.parquet
└── Pumpfun_Sample/
    ├── dex_pools/
    │   ├── 415261250_415261499.parquet
    │   ├── 415261500_415261749.parquet
    │   ├── 415261750_415261999.parquet
    │   └── 415262000_415262249.parquet
    └── ohlcv/
        └── <MintAddress>.parquet

```

### File Naming Conventions

Path and naming differ per topic:

-   **Creation & Migration Events** – `solana/pumpfun_creation_migrations/`, partitioned by date, `<YYYY-MM-DD>.parquet`. Each file contains both creations (`create_v2`) and migrations (`migrate` / `migrate_v2`):

```
2026-07-01.parquet

```

-   **DEX Trades** – `solana/dex_trades/pumpfun/`, partitioned by slot range, `<start_slot>_<end_slot>.parquet`:

```
390740000_390740049.parquet

```

-   **DEX Pools** – `Pumpfun_Sample/dex_pools/`, partitioned by slot range, `<start_slot>_<end_slot>.parquet`:

```
415261250_415261499.parquet

```

-   **OHLCV** – `Pumpfun_Sample/ohlcv/`, one file per token, named by the token mint address, `<MintAddress>.parquet`:

```
2ra5idczuCQhDe1U5D52G8Rms6hzHuHeTqP51fdHpump.parquet

```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Pump.fun data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
    
