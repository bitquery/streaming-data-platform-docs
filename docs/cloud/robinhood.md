---
title: Robinhood Chain Data - Snowflake, AWS S3, BigQuery
description: "Robinhood Chain data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Robinhood Chain data
  - Robinhood blockchain data
  - Robinhood data export
  - tokenized equities data
  - tokenized stocks on-chain
  - RWA blockchain data
  - USDG data
  - Global Dollar
  - Robinhood DEX trades
  - Robinhood transfers
  - Robinhood events
  - Robinhood calls
  - Robinhood balances
  - Pons DEX data
  - EVM Parquet datasets
  - Parquet datasets
  - Snowflake Robinhood data
  - AWS S3 Robinhood
  - GCP BigQuery Robinhood
  - Robinhood cloud storage
  - Robinhood historical data
  - Robinhood data lake
  - Robinhood analytics
  - Robinhood data warehouse
  - Robinhood Parquet files
  - Robinhood batch data
  - Robinhood data dumps
sidebar_position: 11
---
# Robinhood Chain Data

Bitquery provides **Robinhood Chain data dumps** in **Parquet format**, designed for large-scale analytics, historical backfills, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

Robinhood Chain is an **EVM network** (chain ID `4663`), so these exports use the **same schema as Bitquery's other EVM chains** — Ethereum, BSC, Base, Polygon. A query or loader written against `ethereum/` runs unchanged against `robinhood/`.

What makes the chain distinctive is not the schema but what trades on it: **tokenized equities and RWAs** — `NVDA`, `SPY`, `SLV` — settle in the same `dex_trades` table as ordinary ERC-20s and memecoins, quoted against **USDG** rather than USDC.

## Available Robinhood Topics

| Topic | Grain | What it holds |
| --- | --- | --- |
| `dex_trades` | one row per DEX trade | Buy and sell side with token metadata, USD amounts, pool and protocol |
| `transfers` | one row per value movement | Native and ERC-20 transfers, with USD value and currency metadata |
| `balances` | one row per address per currency | Balance snapshot with first and last change time, and update count |
| `events` | one row per decoded log | Event logs with decoded arguments, topics, and the emitting call context |
| `calls` | one row per contract call | Internal and top-level calls with decoded arguments, returns, and state changes |

## Sample Robinhood Cloud Dataset

You can explore schemas and validate your tooling using the **public Robinhood sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/robinhood](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/robinhood)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/<topic>/<block_range>.parquet

```

**Sample Parquet downloads (public S3)**

-   **DEX Trades** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/dex_trades/56600000_56600049.parquet)
    
-   **Transfers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/transfers/56600000_56600049.parquet)
    
-   **Balances** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/balances/56600000_56600049.parquet)
    
-   **Events** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/events/56600000_56600049.parquet)
    
-   **Calls** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/calls/56600000_56600049.parquet)
    

All five samples cover the same 50 blocks, `56600000`–`56600049`:

| Topic | Records | File size |
| --- | ---: | ---: |
| `calls` | 7,885 | 543 KB |
| `events` | 2,211 | 283 KB |
| `transfers` | 1,374 | 66 KB |
| `balances` | 858 | 32 KB |
| `dex_trades` | 277 | 100 KB |

## Robinhood Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── robinhood/
    ├── balances/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── calls/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── dex_trades/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── events/
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

Files hold **50 blocks** each, matching the other EVM chains — but Robinhood Chain produces roughly **10 blocks per second**, so a 50-block file is about **5 seconds** of activity, not the ten minutes the same range covers on Ethereum. The sample range spans `05:54:47` to `05:54:52` UTC.

Size a backfill by time, not by file count: one hour of Robinhood Chain is roughly 720 files per topic.

## Common Columns

Most topics share the same block and transaction context, which makes joining across topics straightforward:

| Column | Type | Description |
| --- | --- | --- |
| `Block_Number` | uint64 | Block height |
| `Block_Date` | date | Date partition of the block |
| `Block_Time` | datetime | Block timestamp (UTC) |
| `Transaction_Hash` | string | Transaction hash — the join key across topics |
| `Transaction_Index` | uint64 | Position of the transaction within the block |
| `TransactionStatus_Success` | string | `"true"` / `"false"` — a **string**, not a boolean |
| `Fee_SenderFee` | string | Fee paid by the sender, as a decimal string |

Nested structures are flattened with `_`, so `Trade { Buy { Currency { Symbol } } }` becomes `Trade_Buy_Currency_Symbol`.

## Correctness Notes

Five things will silently produce wrong numbers if you treat these files casually.

### 1. Amounts Are Decimal Strings

`Transfer_Amount`, `Trade_Buy_Amount`, `Trade_Sell_Amount`, `Balance_Amount`, and `Fee_SenderFee` are **strings**, preserving full token precision. Their `*InUSD` companions are floats.

```python
from decimal import Decimal
df["amount"] = df.Transfer_Amount.map(Decimal)   # not .astype(float)
```

An 18-decimal token amount does not survive a float64 round trip. Use the string column for token quantities and the `InUSD` column for value.

### 2. Booleans Are Strings

`TransactionStatus_Success`, `Transfer_Currency_Native`, `Transfer_Currency_Fungible`, `Call_Reverted`, and `Call_Success` hold `"true"` / `"false"` as text. `WHERE Call_Success` will not do what you expect — compare to the string:

```sql
WHERE TransactionStatus_Success = 'true'
```

### 3. Native ETH Is Not a `token` Transfer

Robinhood Chain's native asset is ETH, carried with `Transfer_Currency_SmartContract = '0x'` and `Transfer_Currency_Native = 'true'`. It does **not** appear under `Transfer_Type = 'token'`. In the sample's 1,374 transfers:

| `Transfer_Type` | Rows | What it is |
| --- | ---: | --- |
| `token` | 962 | ERC-20 movements |
| `call` | 405 | Native ETH moved by an internal call |
| `transaction` | 7 | Native ETH moved by the transaction itself |

All 412 native rows are `call` or `transaction`. Filtering to `Transfer_Type = 'token'` silently drops every ETH movement on the chain.

Filter currencies on the **contract address**, never the symbol — symbols are not unique.

### 4. The Quote Asset Is USDG, Not USDC

Robinhood Chain settles in **USDG** (Global Dollar, `0x5fc5360d0400a0fd4f2af552add042d716f1d168`, **6 decimals**), not USDC. It is the most common leg in the sample — 150 of 554 trade sides — followed by WETH (93) and native ETH (38).

A pricing or volume query ported from Ethereum that hardcodes the USDC address returns **zero rows** here.

### 5. Tokenized Equities Share the ERC-20 Schema

`NVDA`, `SPY`, and `SLV` are ordinary ERC-20 contracts with 18 decimals, indistinguishable from a memecoin by schema alone. **54 of the sample's 277 trades** have an equity leg — a fifth of all trading.

| Symbol | Contract | Decimals |
| --- | --- | ---: |
| `NVDA` | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` | 18 |
| `SPY` | `0x117cc2133c37b721f49de2a7a74833232b3b4c0c` | 18 |
| `SLV` | `0x411efb0e7f985935daec3d4c3ebaea0d0ad7d89f` | 18 |

Maintain a contract allowlist if you need to separate RWA flow from crypto-native flow. Symbol matching is not safe: anyone can deploy a token called `NVDA`.

## DEX Landscape

Trades in the sample spread across six protocols, including **Pons**, which is native to Robinhood Chain:

| `Trade_Dex_ProtocolName` | Family | Trades |
| --- | --- | ---: |
| `uniswap_v4` | Uniswap | 109 |
| `uniswap_v3` | Uniswap | 106 |
| `pons_v2` | Pons | 49 |
| `uniswap_v2` | Uniswap | 7 |
| `pancakeswap_infinity` | PancakeSwapInfinity | 5 |
| `aerodrome_v1` | Aerodrome | 1 |

Group on `Trade_Dex_ProtocolFamily` for venue-level aggregates and `Trade_Dex_ProtocolName` to separate versions.

## Topic Schemas

Columns listed in [Common Columns](#common-columns) are omitted below.

### dex_trades

One row per DEX trade. 277 rows in the sample, across 159 transactions.

| Column | Type | Description |
| --- | --- | --- |
| `Trade_Buy_Amount`, `Trade_Sell_Amount` | string | Amounts, as decimal strings |
| `Trade_Buy_AmountInUSD`, `Trade_Sell_AmountInUSD` | float64 | USD value of each side |
| `Trade_Buy_Buyer`, `Trade_Buy_Seller` | string | Counterparties on the buy side |
| `Trade_Sell_Buyer`, `Trade_Sell_Seller` | string | Counterparties on the sell side |
| `Trade_Buy_Price`, `Trade_Buy_PriceInUSD` | float64 | Execution price, in the paired token and in USD |
| `Trade_*_Currency_*` | mixed | `Symbol`, `Name`, `SmartContract`, `Decimals`, `ProtocolName`, `Fungible`, `HasURI` per side |
| `Trade_Dex_SmartContract` | string | Router or pool manager contract |
| `Trade_Dex_ProtocolName`, `_ProtocolFamily`, `_ProtocolVersion` | string | Venue identification |
| `Trade_Dex_Pair_*` | mixed | Pair token metadata, where the protocol exposes one |
| `Trade_Fees` | string | JSON array of `[Amount, AmountInUSD, [Currency…], Payer, Recipient]` |
| `Trade_Index` | uint32 | Trade position within the transaction |
| `Trade_PriceAsymmetry` | float64 | Price divergence between the two legs |
| `Trade_Sender` | string | Address that initiated the swap |

### transfers

One row per value movement, native and ERC-20. 1,374 rows in the sample, across 200 transactions.

| Column | Type | Description |
| --- | --- | --- |
| `Transfer_Amount` | string | Amount, as a decimal string |
| `Transfer_AmountInUSD` | float64 | USD value |
| `Transfer_Sender`, `Transfer_Receiver` | string | Counterparties |
| `Transfer_Type` | string | `token`, `call`, or `transaction` — see note 3 above |
| `Transfer_Currency_SmartContract` | string | Token contract; `0x` for native ETH |
| `Transfer_Currency_Native` | string | `"true"` for native ETH |
| `Transfer_Currency_Symbol`, `_Name`, `_Decimals`, `_ProtocolName` | mixed | Token metadata |
| `Transfer_Currency_Fungible` | string | `"false"` marks NFTs |
| `Transfer_Id` | string | Token id for non-fungible transfers |
| `Transfer_Index` | uint32 | Position within the transaction |
| `Transfer_URI` | string | Token URI, for NFTs |

### balances

Balance snapshot — levels, not deltas. 858 rows covering 427 distinct addresses in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `Balance_Address` | string | Account holding the balance |
| `Balance_Amount` | string | Balance level, as a decimal string |
| `Balance_FirstChangeTime`, `_LastChangeTime` | datetime | First and last change in the covered range |
| `Balance_UpdateCount` | uint64 | Number of balance changes in the range |
| `Balance_RowCount` | uint64 | Always `1` — a per-row marker |
| `Currency_Name`, `_Symbol`, `_SmartContract`, `_ProtocolName` | string | Currency metadata |

Only accounts whose balance changed in the range appear. Native ETH is 284 of the sample's 858 rows, ERC-20s 570, and ERC-721s 4.

### events

One row per decoded log. 2,211 rows across 34 distinct event signatures in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `Arguments` | string | JSON array of `[Index, Name, Path, Type, Value]` |
| `Log_Signature_Name`, `_Signature`, `_SignatureHash` | string | Decoded event signature — `Transfer` (964), `Swap` (229), `Approval` (194) |
| `Log_SmartContract` | string | Contract that emitted the log |
| `Log_Index`, `Log_Pc` | uint32, uint64 | Log position and program counter |
| `LogHeader_Address`, `_Data`, `_Index` | mixed | Raw log address, data, and index |
| `Topics_Hash` | list\<string\> | Topic hashes, **without** the `0x` prefix |
| `Call_*` | mixed | The call that emitted the log — `From`, `To`, `Gas`, `Signature_Name`, `Value` |
| `ChainId` | uint64 | `4663` on every row |

384 of the sample's rows have an empty `Log_Signature_Name` — logs whose ABI Bitquery has not resolved. Their `LogHeader_Data` and `Topics_Hash` are still present, so you can decode them yourself.

### calls

One row per contract call, internal calls included. 7,885 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `Call_From`, `Call_To` | string | Caller and callee |
| `Call_Value`, `Call_ValueInUSD` | string, float64 | Native value attached to the call |
| `Call_Signature_Name`, `_Signature`, `_SignatureHash` | string | Decoded function — `balanceOf` (2,136), `transfer` (995), `transferFrom` (394) |
| `Call_Input`, `Call_Output` | string | Raw calldata and return data |
| `Arguments`, `Returns` | string | JSON arrays of `[Index, Name, Path, Type, Value]` |
| `StateChanges` | string | JSON array of `[Address, ChangeAfterCallIndex, Location, Value]` |
| `Call_Gas`, `_GasUsed` | uint64 | Gas supplied and consumed |
| `Call_Depth`, `_Index`, `_CallPath` | mixed | Position in the call tree |
| `Call_InternalCalls`, `_LogCount` | uint32 | Children and logs produced |
| `Call_Success`, `_Reverted`, `_Error` | string | Outcome — strings, not booleans |
| `Call_Opcode_Name`, `_Code` | string, uint32 | Call opcode, e.g. `CALL`, `STATICCALL`, `DELEGATECALL` |
| `Call_Create`, `_SelfDestruct`, `_Delegated` | string | Contract creation, destruction, and delegation flags |

Read-only calls dominate: `balanceOf` alone is 27% of the sample. Filter on `Call_Signature_Name` before aggregating, or you will measure RPC-style reads rather than economic activity.

## Joining Topics

Every topic carries `Transaction_Hash`, so it is the natural join key. To attach trades to the events that produced them:

```sql
SELECT
  t.Trade_Dex_ProtocolName,
  t.Trade_Buy_Currency_Symbol,
  t.Trade_Buy_AmountInUSD,
  e.Log_Signature_Name
FROM robinhood_dex_trades t
JOIN robinhood_events e
  ON t.Transaction_Hash = e.Transaction_Hash
WHERE t.TransactionStatus_Success = 'true'
  AND e.Log_Signature_Name = 'Swap'
```

One transaction fans out to many rows in `calls`, `events`, and `transfers`, so joining two of them on `Transaction_Hash` alone produces a cross product. Aggregate one side first, or add `Block_Number` and the per-row index columns to the join.

## Reading Files in Python

```python
import pandas as pd
from decimal import Decimal

BASE = "https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/robinhood/"
RANGE = "56600000_56600049"

trades = pd.read_parquet(f"{BASE}dex_trades/{RANGE}.parquet")
transfers = pd.read_parquet(f"{BASE}transfers/{RANGE}.parquet")

# venue mix
print(trades.Trade_Dex_ProtocolName.value_counts())

# tokenized equity flow, by contract not symbol
EQUITIES = {
    "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec",  # NVDA
    "0x117cc2133c37b721f49de2a7a74833232b3b4c0c",  # SPY
    "0x411efb0e7f985935daec3d4c3ebaea0d0ad7d89f",  # SLV
}
eq = trades[
    trades.Trade_Buy_Currency_SmartContract.isin(EQUITIES)
    | trades.Trade_Sell_Currency_SmartContract.isin(EQUITIES)
]
print(f"equity-leg trades: {len(eq)} of {len(trades)}")

# native ETH is NOT Transfer_Type == 'token'
native = transfers[transfers.Transfer_Currency_Native == "true"]
print("native ETH moved:", sum(native.Transfer_Amount.map(Decimal)))
print("types carrying it:", native.Transfer_Type.unique())
```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Robinhood Chain data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   [**Robinhood Chain APIs**](/docs/blockchain/robinhood/)
    
