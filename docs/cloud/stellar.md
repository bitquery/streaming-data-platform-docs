---
title: Stellar Data - Snowflake, AWS S3, BigQuery
description: "Stellar Data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Stellar blockchain data
  - Stellar data export
  - Stellar payments
  - Stellar transfers
  - Stellar operations
  - Stellar effects
  - Stellar liquidity pools
  - XLM transfers
  - Parquet datasets
  - Snowflake Stellar data
  - AWS S3 Stellar
  - GCP BigQuery Stellar
  - Stellar cloud storage
  - Stellar historical data
  - Stellar data lake
  - Stellar analytics
  - Stellar data warehouse
  - Stellar Parquet files
  - Stellar batch data
  - Stellar data dumps
sidebar_position: 8
---
# Stellar Data

Bitquery provides **Stellar blockchain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

Stellar data is modelled around **ledgers → transactions → operations → effects**, so most topics carry the transaction and operation context alongside the topic-specific fields.

## Available Stellar Topics

For Stellar, Bitquery currently provides the following datasets:

-   **Blocks** – Ledger-level metadata (protocol version, base fee, base reserve, fee pool, total coins)
    
-   **Transactions** – Full transaction-level data with fee account, memo, sequence, and time bounds
    
-   **Operations** – Operation-level records with source account and operation details
    
-   **Payments** – Payment and path-payment operations, including source and destination assets
    
-   **Transfers** – Native XLM and issued-asset transfers with sender, receiver, and direction
    
-   **Effects** – Ledger effects produced by operations
    
-   **Effect Arguments** – Key/value arguments attached to each effect
    
-   **Balance Effects** – Account balance changes per asset
    
-   **Trade Effects** – DEX trades on the Stellar order book, with buy/sell assets and price
    
-   **Claimable Balance Effects** – Claimable balance creation and claiming, with claimant and sponsor
    
-   **Liquidity Pool Effects** – Liquidity pool deposits, withdrawals, and share changes
    
-   **Liquidity Pool Trade Effects** – Trades executed against liquidity pools
    
## Sample Stellar Cloud Dataset

You can explore schemas and validate your tooling using the **public Stellar sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/Stellar](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/Stellar)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/payments_tx/<block_range>.parquet

```

**Sample Parquet downloads (public S3)**

-   **Blocks** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/blocks/55080300_55080349.parquet)
    
-   **Transactions** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/transactions/55080300_55080349.parquet)
    
-   **Operations** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/operations_tx/55080300_55080349.parquet)
    
-   **Payments** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/payments_tx/55080300_55080349.parquet)
    
-   **Transfers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/transfers_tx/55080300_55080349.parquet)
    
-   **Trade Effects** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/stellar/trade_effects_tx/55080300_55080349.parquet)
    

## Stellar Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── stellar/
    ├── balance_effects_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── blocks/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── claimable_balance_effects/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── effect_arguments_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── effects_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── liquidity_pool_effects/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── liquidity_pool_trade_effects/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── operations_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── payments_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── trade_effects_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── transactions/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    └── transfers_tx/
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
55080300_55080349.parquet

```

Here `block` is the Stellar **ledger sequence number**.

### Common Fields

Most Stellar topics share the same transaction and operation context columns, which makes joining across topics straightforward:

-   `block`, `tx_date`, `tx_time` – ledger sequence, date partition, and ledger close time
    
-   `tx_hash`, `tx_hash_bin`, `tx_index`, `transaction_index` – transaction identity
    
-   `operation`, `op_index`, `operation_index`, `operation_name`, `op_source_account` – operation identity
    
-   `effect`, `effect_index`, `order` – effect identity on the effect-based topics
    
-   `*_annotation` fields – Bitquery address labels, empty when the address is unlabelled
    
-   Asset columns are prefixed per role: `currency_from_*` / `currency_to_*` on payments and transfers, `buy_currency_*` / `sell_currency_*` on trade effects
    

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Stellar data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
