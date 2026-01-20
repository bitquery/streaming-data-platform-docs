# Tron Data Export for Snowflake, AWS, Google Cloud, etc.

Bitquery provides **Tron blockchain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.  
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.


## Available Tron Topics

For Tron, Bitquery currently provides the following datasets:

-   **Blocks** – Block-level metadata
    
-   **Transactions** – Full transaction-level data
    
-   **Transfers** – Native TRX and token transfers
    
-   **Balance Updates** – Account balance changes per block
    
-   **DEX Trades** – Executed trades on Tron DEXs
    
## Sample Tron Cloud Dataset

You can explore schemas and validate your tooling using the **public Tron sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/tron](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/tron)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/tron/balance_updates/<block_range>.parquet

```



## Tron Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── tron/
    ├── balance_updates/
    │   ├── <start_block>_<end_block>.parquet
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── blocks/
    │   ├── <start_block>_<end_block>.parquet
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── dex_trades/
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
78861100_78861149.parquet

```

    


## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Tron data**, Bitquery also provides:

-   [**Kafka streams**](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
    
