---
title: "EVM Cloud Data Exports"
description: "Access Bitquery EVM cloud datasets for historical blockchain exports in Parquet, ready for S3, BigQuery, Snowflake, and data lakes."
keywords:
  - EVM blockchain data
  - Ethereum data export
  - BSC blockchain data
  - Polygon data export
  - Base blockchain data
  - Optimism data export
  - Arbitrum data export
  - Avalanche data export
  - EVM DEX trades
  - EVM transfers
  - EVM balance updates
  - EVM transactions
  - EVM smart contracts
  - EVM events
  - EVM logs
  - EVM calls
  - EVM miner rewards
  - EVM uncle blocks
  - Parquet datasets
  - Snowflake EVM data
  - AWS S3 EVM
  - BigQuery EVM
  - Redshift EVM data
  - Databricks EVM
  - Athena EVM queries
  - Spark EVM data
  - EVM cloud storage
  - EVM historical data
  - EVM data lake
  - EVM analytics
  - EVM data warehouse
  - EVM Parquet files
  - EVM batch data
  - EVM data dumps
  - Ethereum Parquet
  - BSC Parquet
  - Polygon Parquet
  - Base Parquet
  - Optimism Parquet
  - Arbitrum Parquet
  - Avalanche Parquet
  - EVM blockchain export
  - EVM data pipeline
  - EVM ETL data
  - EVM real-time data
  - EVM streaming data
  - EVM on-chain data
  - DeFi data export
  - NFT data export
  - Web3 data analytics
  - Blockchain data warehouse
  - Crypto data lake
  - Multi-chain data
  - Cross-chain analytics
  - Layer 1 blockchain data
  - Ethereum mainnet data
  - BSC mainnet data
  - Polygon mainnet data
  - Base mainnet data
  - Optimism mainnet data
sidebar_position: 2
---
# EVM Data

Bitquery provides **blockchain data dumps for EVM-base chains like Ethereum, BSC, Base, Polygon/Matic, Optimism, Robinhood, etc.** in parquet format that you can host directly in your own cloud (for example AWS S3) and plug into your analytics stack or data lake.

## Available Topics

For EVM chains we currently provide the following topics:

- **Blocks** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/blocks.js)
- **Balance Updates** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/balance_updates.js)
- **Balances** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/balances.js), daily snapshots, see [Balances](#balances-daily-snapshots) below
- **DEX Trades** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/dextrades.js)
- **Uncle Blocks** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/uncle_blocks.js)
- **Transactions** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/transactions.js)
- **Transfers** – [sample file](https://github.com/bitquery/blockchain-cloud-data-dump-sample/blob/main/ethereum/transfers.js)

## Sample Ethereum Cloud Dataset

To explore the schema and test your tooling, use our **public sample EVM datasets** on GitHub:

- **Ethereum samples**:  
  [`https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ethereum`](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ethereum)

The GitHub repository includes one sample file. The complete list of Parquet files is stored in our public S3 bucket and can be accessed directly. For example:  
`https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balance_updates/24053500_24053549.parquet`

```text

bitquery-blockchain-dataset/
└── ethereum/
    ├── balances/
    │   ├── 2025-01-01.parquet
    │   ├── 2025-01-02.parquet
    │   └── ...
    ├── balance_updates/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── blocks/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── calls/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── dex_trades/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── events/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── miner_rewards/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── transactions/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    ├── transfers/
    │   ├── 24053500_24053549.parquet
    │   ├── 24053550_24053599.parquet
    │   ├── 24053600_24053649.parquet
    │   ├── 24053650_24053699.parquet
    │   ├── 24053700_24053749.parquet
    │   ├── 24053750_24053799.parquet
    │   ├── 24053800_24053849.parquet
    │   ├── 24053850_24053899.parquet
    │   ├── 24053900_24053949.parquet
    │   └── 24053950_24053999.parquet
    └── uncle_blocks/
        ├── 15535500_15535549.parquet
        ├── 15535550_15535599.parquet
        ├── 15535600_15535649.parquet
        ├── 15535650_15535699.parquet
        ├── 15535700_15535749.parquet
        ├── 15535750_15535799.parquet
        ├── 15535800_15535849.parquet
        └── 15535850_15535899.parquet
```

Use these samples to:

- **Validate your ETL / analytics pipeline** against realistic EVM data.
- **Inspect column names and types** before connecting to full buckets.
- **Benchmark query performance** on your preferred engines and hardware.

## Balances (Daily Snapshots)

The **Balances** topic is a daily snapshot of account balances, both native (ETH) and token. It differs from **Balance Updates** in two ways:

- **Balance Updates** are *deltas* — one row per balance change, which you must sum to reconstruct a balance.
- **Balances** are *levels* — one row per account/token with the balance **as of the end of that day**, already aggregated.

Files are partitioned by **date**, not block range:

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balances/<YYYY-MM-DD>.parquet

```

**Sample Parquet download (public S3)**

- **Ethereum Balances** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balances/2025-01-01.parquet)

Each daily file covers **only the accounts whose balance changed that day**, not the entire chain state. The `2025-01-01` sample holds about 954,000 rows across roughly 514,000 addresses and 13,000 currencies. To reconstruct full chain state at a date, carry forward the last known balance per account from earlier files.

### Balances Schema

| Column | Type | Description |
| --- | --- | --- |
| `Balance_Address` | string | Account holding the balance |
| `Block_Date` | date | Snapshot date, matches the file name |
| `Currency_SmartContract` | string | Token contract address; `0x` for native ETH |
| `Currency_Symbol` | string | Token symbol as declared by the contract |
| `Currency_Name` | string | Token name as declared by the contract |
| `Currency_ProtocolName` | string | Token standard, e.g. `erc20`, `erc721`, `erc1155`, `erc404_v1` |
| `Balance_Amount` | string | Balance at end of day, decimal string — see the precision note below |
| `Balance_FirstChangeTime` | datetime | First balance change on this date (UTC) |
| `Balance_LastChangeTime` | datetime | Last balance change on this date (UTC) |
| `Balance_UpdateCount` | uint64 | Number of balance changes on this date |
| `Balance_RowCount` | uint64 | Number of underlying aggregate rows merged into this row |

### Filter on the Contract Address, Never the Symbol

Token symbols are set by the contract, so anyone can deploy a token claiming any symbol. In the `2025-01-01` sample, **25 different contracts report the symbol `ETH`** and **34 report `USDT`**.

Filtering `Currency_Symbol = 'ETH'` picks up impostor ERC-20s and inflates the native ETH total by several orders of magnitude. Native ETH is identified by the contract address:

```sql
-- correct: native ETH
WHERE Currency_SmartContract = '0x'

-- correct: real USDT
WHERE Currency_SmartContract = '0xdac17f958d2ee523a2206206994597c13d831ec7'

-- wrong: matches impostor tokens too
WHERE Currency_Symbol = 'USDT'
```

Filtered correctly, the largest native ETH holders in the sample are the Beacon Deposit Contract (`0x00000000219ab540356cbb839cbe05303d7705fa`) and the WETH contract (`0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`), which you can cross-check on any block explorer.

### `Balance_Amount` Is a String

Balances are stored as **decimal strings**, not floats, so that 18-decimal values survive intact. Casting to a 64-bit float silently loses precision on large balances. Parse to a decimal type instead:

```python
from decimal import Decimal
df["amount"] = df["Balance_Amount"].map(Decimal)
```

In SQL, cast to a wide decimal — for example `CAST(Balance_Amount AS DECIMAL(38, 18))` — rather than `DOUBLE`. Note that a few scam tokens carry balances near `2^256`, which overflow even a `DECIMAL(38, 18)`; filter those out or cast to `DECIMAL(76, 18)` if your engine supports it.

### Row Grain and Deduplication

The grain is `(Balance_Address, Currency_SmartContract, Currency_ProtocolName)`. Hybrid tokens such as ERC-404 emit under more than one standard, so the same address and contract can appear on multiple rows — about 4,600 such pairs in the sample.

These rows often repeat the **same** balance under a different `Currency_ProtocolName`, so summing across them double-counts. Pick one `Currency_ProtocolName`, or deduplicate on the address and contract before aggregating.

### Reading a File in Python

```python
import pandas as pd
from decimal import Decimal

url = "https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ethereum/balances/2025-01-01.parquet"
df = pd.read_parquet(url)

# native ETH only, identified by contract address rather than symbol
native = df[df.Currency_SmartContract == "0x"].copy()
native["amount"] = native.Balance_Amount.map(Decimal)

print(len(native), "accounts changed ETH balance on this date")

# sort_values, not nlargest: pandas cannot rank an object/Decimal column
top = native.sort_values("amount", ascending=False).head(10)
print(top[["Balance_Address", "amount"]])
```

## Other Ways to Access EVM Data

Cloud data dumps are ideal for **batch analytics** and **historical workloads**.  
If you need **low-latency real-time data**, you can also consume Bitquery streams via **Kafka** and GraphQL subscriptions.

- **Kafka-based real-time streams** (mempool and committed data) are documented here:  
  [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts)

