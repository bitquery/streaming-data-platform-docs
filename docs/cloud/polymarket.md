---
title: "Polymarket Historical Data - Parquet, S3, Snowflake, BigQuery"
description: "Full Polymarket historical data as Parquet: every trade, price and settlement with market question and outcome labels, delivered to S3, Snowflake or BigQuery."
keywords:
  - Polymarket historical data
  - Polymarket historical data API
  - Polymarket historical data download
  - Polymarket trade history
  - Polymarket backtesting data
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
# Polymarket Historical Data

Bitquery provides **Polymarket historical data** as **Parquet files**: every on-chain trade, outcome price and settlement, already joined with the market question, outcome label and collateral token. It is built for backtesting, research, leaderboards and data lake integrations where paging through a REST API is too slow.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, DuckDB, etc**.

Polymarket runs on **Polygon (Matic)**, so all Polymarket datasets live under the `matic/` prefix.

## Which Polymarket data source should I use?

| Need | Use |
| --- | --- |
| Last ~7 days, ad-hoc queries and aggregations | [Polymarket API](/docs/examples/polymarket-api/) (GraphQL, `dataset: realtime`) |
| Live trades, whale alerts, odds as they change | [GraphQL subscriptions](/docs/examples/polymarket-api/) or [Kafka streams](/docs/streams/kafka-streaming-concepts/) |
| **Full history**, backtests, model training, warehouse joins | **Parquet exports on this page** |

Polymarket moved to new CTF Exchange contracts and pUSD collateral in April 2026. Each row carries `Trade_Prediction_Marketplace_SmartContract` and `Trade_Prediction_CollateralToken_*`, so you can separate trades before and after the migration.

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

## Get Full Access

The full dataset is delivered into your own cloud storage (S3, GCS) or warehouse share (Snowflake, BigQuery). To buy or trial it, [fill the API form](https://bitquery.io/forms/api) or contact **sales@bitquery.io**.

## Reading Files with DuckDB

You need no key or client library. Point DuckDB at the public sample directly:

```sql
SELECT *
FROM read_parquet('https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/polymarket/prediction_trades/84735000_84735049.parquet')
LIMIT 10;
```

## Example: daily Polymarket volume from the sample file

Aggregate directly over Parquet, no ETL step. Swap the single file for a glob over your own bucket to run it across the full history.

```sql
SELECT
  Trade_Prediction_Question_Title AS market,
  Trade_Prediction_Outcome_Label AS outcome,
  count(*) AS trades,
  sum(CAST(Trade_OutcomeTrade_CollateralAmountInUSD AS DOUBLE)) AS volume_usd,
  avg(CAST(Trade_OutcomeTrade_Price AS DOUBLE)) AS avg_price
FROM read_parquet('https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/polymarket/prediction_trades/84735000_84735049.parquet')
GROUP BY 1, 2
ORDER BY volume_usd DESC
LIMIT 20;
```

## Reading Files in Python

```python
import pandas as pd

df = pd.read_parquet("https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/matic/polymarket/prediction_trades/84735000_84735049.parquet")
print(df.info())
df.head()
```

## Real-Time vs Batch Data Access

Cloud data dumps are built for **batch analytics and historical workloads**.

If you require **low-latency or streaming Polymarket data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   [**GraphQL subscriptions and queries**](/docs/examples/polymarket-api/) for trades, odds, wallets and whale alerts

See also [Polymarket API vs Bitquery Polymarket API](/docs/API-Blog/polymarket-api-vs-bitquery-polymarket-api/) for how this compares with Polymarket's own Data API.
