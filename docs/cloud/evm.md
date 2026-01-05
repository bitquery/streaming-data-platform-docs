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

Each sample file includes the **exact S3 URL** in a comment and follows a directory structure similar to:

```text
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balance_updates/24053500_24053549.parquet

bitquery-blockchain-dataset/
└── ethereum/
    └── balance_updates/
        ├── 24053500_24053549.parquet
        ├── 24053550_24053599.parquet
        ├── 24053600_24053649.parquet
        └── ...
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

