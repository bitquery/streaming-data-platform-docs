---
title: Ripple (XRP Ledger) Data - Snowflake, AWS S3, BigQuery
description: "Ripple (XRP Ledger) Data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Ripple blockchain data
  - XRP Ledger data
  - XRPL data export
  - Ripple data export
  - XRP transfers
  - XRPL payments
  - XRPL issued tokens
  - XRPL NFT data
  - XRP transaction fees
  - Parquet datasets
  - Snowflake Ripple data
  - AWS S3 XRP Ledger
  - GCP BigQuery XRPL
  - Ripple cloud storage
  - Ripple historical data
  - XRPL data lake
  - XRP analytics
  - Ripple data warehouse
  - XRPL Parquet files
  - Ripple batch data
  - Ripple data dumps
sidebar_position: 9
---
# Ripple (XRP Ledger) Data

Bitquery provides **Ripple / XRP Ledger data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

XRPL data is modelled around **ledgers → transactions → transfers**, so every transfer row carries its full transaction context (hash, index, type, and the account that submitted it).

## Available Ripple Topics

For Ripple, Bitquery currently provides the following dataset:

-   **Transfers** – Every value movement on the ledger: native XRP payments, issued-token (IOU) payments, DEX and AMM trades, NFT trades and mints, and the XRP burned as a transaction fee

Additional XRPL topics can be exported on request — [contact us](https://bitquery.io/forms/api) with the topics and block ranges you need.

## Sample Ripple Cloud Dataset

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ripple](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ripple)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/transfers_tx/<block_range>.parquet

```

**Sample Parquet download (public S3)**

-   **Transfers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/transfers_tx/93155850_93155899.parquet)
    

## Ripple Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── ripple/
    └── transfers_tx/
        ├── 93154950_93154999.parquet
        ├── 93155000_93155049.parquet
        ├── 93155050_93155099.parquet
        ├── 93155100_93155149.parquet
        ├── 93155150_93155199.parquet
        ├── 93155200_93155249.parquet
        ├── 93155250_93155299.parquet
        ├── 93155300_93155349.parquet
        ├── 93155350_93155399.parquet
        ├── 93155400_93155449.parquet
        ├── 93155450_93155499.parquet
        ├── 93155500_93155549.parquet
        ├── 93155550_93155599.parquet
        ├── 93155600_93155649.parquet
        ├── 93155650_93155699.parquet
        ├── 93155700_93155749.parquet
        ├── 93155750_93155799.parquet
        ├── 93155800_93155849.parquet
        ├── 93155850_93155899.parquet
        ├── 93155900_93155949.parquet
        └── 93155950_93155999.parquet

```

### Block Range Naming Convention

Each Parquet file name follows this format:

```
<start_block>_<end_block>.parquet

```

Example:

```
93155850_93155899.parquet

```

Here `block` is the XRP Ledger **ledger index**. Each file covers 50 ledgers, which is roughly 3 minutes of XRPL activity — the sample file above holds about 7,000 transfer rows.

## Transfers Schema

| Column | Type | Description |
| --- | --- | --- |
| `block` | uint32 | Ledger index |
| `tx_date` | date | Date partition of the ledger close time |
| `tx_time` | datetime | Ledger close time (UTC) |
| `tx_hash` | string | Transaction hash, hex |
| `tx_hash_bin` | binary | Transaction hash, raw bytes — cheaper to join and filter on |
| `tx_index` | uint32 | Position of the transaction inside the ledger |
| `tx_type_raw` | string | Raw XRPL transaction type, e.g. `Payment`, `OfferCreate`, `NFTokenAcceptOffer` |
| `transaction_type` | string | Normalized transaction type |
| `tx_sender_raw` | string | Account that submitted and signed the transaction |
| `transaction_sender` | string | Normalized submitting account |
| `sender` | string | Account the value left; empty on mints |
| `receiver` | string | Account the value arrived at; empty on fees and burns |
| `direction` | string | Transfer classification — see below |
| `amount_from` | float64 | Amount debited from `sender` |
| `amount_to` | float64 | Amount credited to `receiver` |
| `currency_from_id` | uint64 | Bitquery currency ID of the sent asset |
| `currency_from_symbol` | string | Symbol of the sent asset |
| `currency_from_name` | string | Name of the sent asset |
| `currency_from_address` | string | Issuer of the sent asset; `-` for XRP |
| `currency_from_tokenType` | string | `-` for native XRP, `issued` for IOUs, `nft` for NFTokens |
| `currency_to_id` | uint64 | Bitquery currency ID of the received asset |
| `currency_to_symbol` | string | Symbol of the received asset |
| `currency_to_name` | string | Name of the received asset |
| `currency_to_address` | string | Issuer of the received asset; `-` for XRP |
| `currency_to_tokenType` | string | Asset type of the received asset |

### The `direction` Column

Unlike account-based chains, one XRPL transaction produces several transfer rows. `direction` tells you what each row represents:

-   `payment` – A direct value transfer between two accounts, XRP or issued token
    
-   `fee` – The XRP burned to pay for the transaction. `receiver` is empty because the fee is destroyed, not paid to a validator
    
-   `trade` – A leg of a DEX order-book or AMM execution, where `currency_from_*` and `currency_to_*` differ
    
-   `nft_trade` – An NFToken changing hands via `NFTokenAcceptOffer`
    
-   `mint` – An NFToken being created. `sender` is empty and `amount_from` is `0`
    
-   `other` – Ledger effects that are not a completed value movement, such as `TrustSet` or `OfferCancel` bookkeeping
    

To sum real economic volume, filter to `direction = 'payment'`. To measure network fee revenue, filter to `direction = 'fee'` — that subset alone is typically half the rows in a file.

### Issued Currency Codes Are Hex

XRPL supports two currency code formats. Three-character codes such as `XRP`, `POZ`, or `XPM` appear as-is. Longer codes are stored as the **40-character hex** the ledger itself carries, so decode them to get a readable ticker:

```python
bytes.fromhex("4D656F7752500000000000000000000000000000").rstrip(b"\x00").decode()
# 'MeowRP'
```

The same applies in SQL, for example in Athena or Snowflake:

```sql
SELECT
  rtrim(from_utf8(from_hex(currency_from_symbol)), chr(0)) AS symbol,
  sum(amount_from) AS volume
FROM ripple_transfers
WHERE direction = 'payment'
  AND currency_from_tokenType = 'issued'
GROUP BY 1
ORDER BY 2 DESC
```

An issued token is only unique as the pair `(currency_from_symbol, currency_from_address)` — the same ticker can be issued by many accounts. Use `currency_from_id` when you want a single stable key.

### Reading a File in Python

```python
import pandas as pd

url = "https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/transfers_tx/93155850_93155899.parquet"
df = pd.read_parquet(url)

# XRP payment volume in this ledger range
xrp = df[(df.direction == "payment") & (df.currency_from_symbol == "XRP")]
print(len(xrp), xrp.amount_from.sum())

# XRP burned as fees
print(df[df.direction == "fee"].amount_from.sum())
```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Ripple data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
