---
title: Blockchain Data in Your Cloud
description: Bitquery blockchain data dumps delivered via AWS, Google Cloud, Snowflake and other cloud solutions to plug into your existing data pipelines.
slug: /cloud/
---

Bitquery provides ready-to-use blockchain **data dumps** via popular cloud providers such as **AWS**, **Google Cloud**, and **Snowflake**.  
You can plug these datasets directly into your existing analytics stack (AWS, BigQuery, Snowflake, etc.) and build custom data pipelines without running your own blockchain infrastructure.

## Available Blockchain Data Dumps

Bitquery provides cloud data dumps for the following blockchains:

- **[EVM Chains](/docs/cloud/evm)** – Ethereum, BSC, Base, Polygon/Matic, Optimism, Arbitrum, and other EVM-compatible chains
- **[Solana](/docs/cloud/solana)** – Blocks, transactions, transfers, DEX data, and more
- **[Tron](/docs/cloud/tron)** – Blocks, transactions, transfers, balance updates, and DEX trades
- **[Bitcoin](/docs/cloud/bitcoin)** – Blocks, transactions, inputs, outputs, and OMNI Layer data

## Sample Parquet Data

To quickly explore the structure of the data and test your tooling, you can use our **public sample dataset**:

- GitHub repository with sample Parquet dumps:  
  [`https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main`](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main)

In the GitHub repo, **each sample file (per data point or topic)** includes the **exact S3 URL** in a comment, so you can:

- Point test pipelines to the same path
- Easily request more files from the same bucket/prefix if you need additional data

For example, an Ethereum balance updates dump might look like:

```text
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balance_updates/24053500_24053549.parquet

bitquery-blockchain-dataset/
└── ethereum/
    └── balance_updates/
        ├── 24053500_24053549.parquet
        ├── 24053550_24053599.parquet
        ├── 24053600_24053649.parquet
        ├── 24053650_24053699.parquet
        ├── 24053700_24053749.parquet
        ├── 24053750_24053799.parquet
        ├── 24053800_24053849.parquet
        ├── 24053850_24053899.parquet
        ├── 24053900_24053949.parquet
        └── 24053950_24053999.parquet
```

Use these samples to:

- Validate your ETL / analytics pipeline 
- Inspect column names and types before connecting to full buckets
- Benchmark query performance on realistic data sizes

