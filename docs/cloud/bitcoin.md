# Bitcoin Data Export for Snowflake, AWS, Google Cloud, etc.

Bitquery provides **Bitcoin blockchain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.  
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.


## Available Bitcoin Topics

For Bitcoin, Bitquery currently provides the following datasets:

-   **Blocks** – Block-level metadata
    
-   **Transactions** – Full transaction-level data
    
-   **Inputs** – Transaction input data
    
-   **Outputs** – Transaction output data
    
-   **OMNI Transactions** – OMNI Layer protocol transactions
    
-   **OMNI Transfers** – OMNI Layer token transfers
    
## Sample Bitcoin Cloud Dataset

You can explore schemas and validate your tooling using the **public Bitcoin sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/bitcoin](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/bitcoin)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/bitcoin/blocks/<block_range>.parquet

```



## Bitcoin Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── bitcoin/
    ├── blocks/
    │   ├── <start_block>_<end_block>.parquet
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── transactions/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── inputs/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── outputs/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── omni_transactions/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    └── omni_transfers/
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
859350_859399.parquet

```

    


## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Bitcoin data**, Bitquery also provides:

-   [**Kafka streams**](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
    
