---
title: Polymarket Data - Snowflake, AWS S3, BigQuery
description: "Polymarket Data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Polymarket data
  - Polymarket data export
  - Polymarket prediction trades
  - Polymarket settlements
  - Prediction market data
  - Polymarket DEX trades
  - Polygon Polymarket data
  - Parquet datasets
  - Snowflake Polymarket data
  - AWS S3 Polymarket
  - BigQuery Polymarket
  - Polymarket cloud storage
  - Polymarket historical data
  - Polymarket data lake
  - Polymarket analytics
  - Polymarket data warehouse
  - Polymarket Parquet files
  - Polymarket batch data
  - Polymarket data dumps
  - Gnosis CTF data
sidebar_position: 7
---
# Polymarket Data

Bitquery provides **Polymarket data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

Polymarket runs on **Polygon (Matic)**, so all Polymarket datasets live under the `matic/` prefix.

## Available Polymarket Topics

For Polymarket, Bitquery currently provides the following datasets:

-   **Prediction Trades** – Outcome-token trades with market question, outcome label, price, and collateral amounts
    
-   **Prediction Settlements** – Market resolution events such as payout redemptions
    
-   **DEX Trades** – Polymarket trades in the standard EVM DEX trades schema
    
## Sample Polymarket Cloud Dataset

You can explore schemas and validate your tooling using the **public Polymarket sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/polymarket](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/polymarket)

**Sample Parquet downloads (public S3)**

-   **Prediction Trades** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/polymarket/prediction_trades/84735000_84735049.parquet)
    
-   **Prediction Settlements** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/polymarket/PredictionSettlements/85230000_85230049.parquet)
    
-   **DEX Trades** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/dex_trades/polymarket/83713800_83713849.parquet)
    

## Polymarket Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── matic/
    ├── polymarket/
    │   ├── prediction_trades/
    │   │   ├── 84735000_84735049.parquet
    │   │   ├── 84735050_84735099.parquet
    │   │   └── ...
    │   └── PredictionSettlements/
    │       ├── 85230000_85230049.parquet
    │       ├── 85230050_85230099.parquet
    │       └── ...
    └── dex_trades/
        └── polymarket/
            ├── 83713800_83713849.parquet
            ├── 83713850_83713899.parquet
            └── ...

```

### Block Range Naming Convention

Each Parquet file name follows this format:

```
<start_block>_<end_block>.parquet

```

Example:

```
84735000_84735049.parquet

```

## Dataset Fields

**Prediction Trades** records an outcome-token trade together with the market it belongs to:

-   `Block_Number`, `Block_Time`, `Transaction_Hash`, `Transaction_From`
    
-   `Trade_OutcomeTrade_*` – buyer, seller, order id, amount, collateral amount, price, `IsOutcomeBuy`, plus USD equivalents
    
-   `Trade_Prediction_Question_*` – market question title, id, market id, resolution source, image, creation time
    
-   `Trade_Prediction_Outcome_*` – outcome id, index, and label (for example `Down`)
    
-   `Trade_Prediction_OutcomeToken_*` / `Trade_Prediction_CollateralToken_*` – ERC-1155 outcome token and ERC-20 collateral token (for example USDC) details
    
-   `Trade_Prediction_Marketplace_*` – protocol name, family (`Gnosis_CTF`), version, and contract
    

**Prediction Settlements** records how a market resolves for a holder:

-   `Settlement_EventType` (for example `Redemption`), `Settlement_Holder`, `Settlement_OutcomeTokenIds`
    
-   `Settlement_Amounts_*` – amount and collateral amount, with USD equivalents
    
-   `Settlement_Prediction_*` – same question, outcome, token, and marketplace structure as trades
    

**DEX Trades** uses the standard EVM DEX trades schema documented on the [EVM Data](/docs/cloud/evm/) page.

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Polymarket data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
