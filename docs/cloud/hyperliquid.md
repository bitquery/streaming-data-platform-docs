---
title: Hyperliquid Data - Snowflake, AWS S3, BigQuery
description: "Hyperliquid Core (HyperCore) data - Snowflake, AWS S3, BigQuery from Bitquery cloud datasets using Parquet historical exports for S3, BigQuery, and Snowflake."
keywords:
  - Hyperliquid data
  - HyperCore data
  - Hyperliquid data export
  - Hyperliquid historical data
  - Hyperliquid fills
  - Hyperliquid order book
  - L4 order book data
  - perpetuals data export
  - perp DEX data
  - HIP-3 perps
  - Hyperliquid oracle prices
  - Hyperliquid TWAP
  - order book reconstruction
  - market microstructure data
  - Parquet datasets
  - Snowflake Hyperliquid data
  - AWS S3 Hyperliquid
  - GCP BigQuery Hyperliquid
  - Hyperliquid cloud storage
  - Hyperliquid data lake
  - Hyperliquid analytics
  - Hyperliquid data warehouse
  - Hyperliquid Parquet files
  - Hyperliquid batch data
  - Hyperliquid data dumps
sidebar_position: 10
---
# Hyperliquid (HyperCore) Data

Bitquery provides **Hyperliquid Core data dumps** in **Parquet format**, designed for backtesting, market microstructure research, and data lake integrations.
These datasets can be hosted directly in your own cloud storage (for example, **AWS S3**) and queried using engines like **Snowflake, BigQuery, Athena, Spark, etc**.

This dataset covers **HyperCore** — the L1 order-book exchange — not HyperEVM. It is an **event stream, not a state chain**: there are no blocks, transactions, or transfers tables. Every row is an exchange event (an order status change, a book delta, a match), and every row carries `Block_Number` and `Block_Time`, so datasets join on block without a separate blocks table.

## Available Hyperliquid Topics

| Topic | Grain | What it holds |
| --- | --- | --- |
| `order_statuses` | one row per order lifecycle event | Full order lifecycle: `open`, `canceled`, `filled`, `triggered`, and every `*Rejected` state, with TIF, trigger conditions, and TP/SL children |
| `book_diffs` | one row per order-level book delta | **L4** book changes — `new` / `update` / `remove`, each with the owning address, order id, price and size |
| `fills` | one row per counterparty per match | Both sides of every match, with realized PnL, fee, fee token, taker flag, and liquidation detail |
| `oracle_updates` | one row per oracle publication | Mark, spot, and external perp price inputs, plus the resulting oracle prices per coin |
| `misc_events` | one row per ledger event | Deposits, withdrawals, transfers, funding, delegation, validator rewards |
| `twap_statuses` | one row per TWAP state change | TWAP order state: total size, executed size and notional, duration, terminal status |
| `core_writer_actions` | one row per HyperEVM→HyperCore action | Actions submitted to HyperCore from HyperEVM contracts, with the originating EVM transaction hash |

Pick `fills` for executed volume and realized PnL, `order_statuses` for intent and rejection analysis, and `book_diffs` when you need to rebuild the book at an arbitrary instant.

### Why L4 Matters

Hyperliquid's own free archive publishes **L2 book snapshots** and asset contexts. This dataset is a different shape: `book_diffs` carries **per-order deltas** with the owning address and order id. An L2 snapshot tells you the book was 12 deep at a price; an L4 diff stream tells you *which* order moved and *whose* it was. Queue position, order lifetime, maker behaviour, and spoofing patterns are only recoverable at L4.

Likewise, `order_statuses` includes orders that **never traded**. Rejects and cancels are invisible in any trades-only dataset — and in the sample below they are 96% of all order events.

## Sample Hyperliquid Cloud Dataset

You can explore schemas and validate your tooling using the **public Hyperliquid sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/hyperliquid](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/hyperliquid)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/<topic>/<block_range>.parquet

```

**Sample Parquet downloads (public S3)**

-   **Order Statuses** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/order_statuses/1075858800_1075858999.parquet)
    
-   **Book Diffs (L4)** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/book_diffs/1075858800_1075858999.parquet)
    
-   **Fills** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/fills/1075858800_1075858999.parquet)
    
-   **Oracle Updates** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/oracle_updates/1075858800_1075858999.parquet)
    
-   **Misc Events** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/misc_events/1075858800_1075858999.parquet)
    
-   **TWAP Statuses** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/twap_statuses/1075858000_1075858199.parquet)
    
-   **Core Writer Actions** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/core_writer_actions/1075858000_1075858199.parquet)
    

The samples come from one continuous slice — blocks `1075858000`–`1075858999`, about **66 seconds** of live HyperCore. Event counts in that slice:

| Topic | Records |
| --- | ---: |
| `order_statuses` | 142,955 |
| `book_diffs` | 89,241 |
| `fills` | 1,552 |
| `misc_events` | 32 |
| `oracle_updates` | 24 |
| `core_writer_actions` | 10 |
| `twap_statuses` | 3 |

## Hyperliquid Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── hyperliquid/
    ├── book_diffs/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── core_writer_actions/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── fills/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── misc_events/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── oracle_updates/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── order_statuses/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    └── twap_statuses/
        ├── <start_block>_<end_block>.parquet
        └── ...

```

### Block Range Naming Convention

Each Parquet file name follows this format:

```
<start_block>_<end_block>.parquet

```

Files hold **200 blocks** each, and HyperCore produces roughly 14 blocks per second, so one file is about 14 seconds of market activity. File sizes track activity rather than block count — in the sample, two `order_statuses` files covering the same 200 blocks each are 279 KB and 6.4 MB.

**A range with no events produces no file.** `fills` and `book_diffs` have no file for `1075858000_1075858199` because nothing matched in those blocks. Discover files under a prefix rather than generating names from a stride.

## Common Columns

Every topic carries these two columns, and they are the join key across topics:

| Column | Type | Description |
| --- | --- | --- |
| `Block_Number` | string | HyperCore block height |
| `Block_Time` | string | Block timestamp, **epoch nanoseconds** |

Each topic then prefixes its own fields with the topic's singular name — `Fill_*`, `OrderStatus_*`, `BookDiff_*`, `OracleUpdate_*`, `MiscEvent_*`, `TwapStatus_*`, `CoreWriterAction_*` — with nested structures flattened using `_`, for example `OrderStatus_Order_Coin` and `OrderStatus_Builder_Fee`.

## Correctness Notes

Five things about this dataset will silently produce wrong numbers if you treat it like an EVM chain export.

### 1. Numbers Are Strings, Including `Block_Number`

Prices, sizes, PnL, fees, timestamps, and the block height itself are stored as **strings**, not numerics. This is deliberate — exchange decimals must not pass through a float. Cast explicitly, and use `Decimal` rather than `float` for money:

```python
from decimal import Decimal
df["px"] = df.Fill_Px.map(Decimal)
df["block"] = df.Block_Number.astype("int64")
```

Summing `Fill_Px` as float across a large export will drift; `Decimal` will not.

### 2. Every Match Appears Twice

`fills` carries **one row per counterparty**, so a single match produces two rows — one taker, one maker. In the sample, 1,552 fill rows are exactly 776 `Fill_Crossed = true` and 776 `false`, resolving to 781 unique `(Block_Number, Fill_Coin, Fill_Tid)` keys.

Summing `Fill_Sz` across the raw table **double-counts volume**. Filter to one side:

```sql
SELECT SUM(CAST(Fill_Sz AS DECIMAL(38,8)))
FROM hyperliquid_fills
WHERE Fill_Crossed = true        -- taker side only
```

### 3. `Fill_Hash` Is Not a Join Key

One L1 transaction spans many matches, and TWAP fills carry 32 zero bytes on both sides. In the sample, 1,552 rows share only 464 distinct hashes, and 156 rows have an all-zero hash.

Key trades on **`(Block_Number, Fill_Coin, Fill_Tid)`** instead.

### 4. Rejected Orders Dominate `order_statuses`

`order_statuses` is a record of *intent*, and most intent never trades. The sample's 142,955 order events break down as:

| Status | Records |
| --- | ---: |
| `badAloPxRejected` | 49,095 |
| `open` | 44,184 |
| `canceled` | 42,895 |
| `perpMarginRejected` | 2,979 |
| `iocCancelRejected` | 1,773 |
| `reduceOnlyCanceled` | 918 |
| `filled` | 793 |
| `insufficientSpotBalanceRejected` | 206 |
| `reduceOnlyRejected` | 59 |
| `minTradeNtlRejected` | 31 |

Only **793 of 142,955** events — about 0.55% — are `filled`. `badAloPxRejected` alone is a third of the file: post-only (`Alo`) orders priced through the book, rejected rather than crossed. `Alo` is 138,929 of the 142,955 `Tif` values, so this dataset is dominated by market makers quoting and requoting.

Filter on `OrderStatus_Status` for whatever you are measuring — never treat row count as order flow.

### 5. Time Units Differ by Field

Two different epochs are in play, and mixing them is a factor-of-a-million error:

| Field | Unit |
| --- | --- |
| `Block_Time` | nanoseconds |
| `OrderStatus_Time` | nanoseconds |
| `Fill_Time` | milliseconds |
| `OrderStatus_Order_Timestamp` | milliseconds |
| `TwapStatus_State_Timestamp` | milliseconds |

In the sample, the same event carries `Block_Time = 1784285089551711280` and `Fill_Time = 1784285089551`.

### Schema Varies Between Files

A column that is entirely null across one file is written with Parquet's **null type**, while the same column in a busier file is typed `string`. Concatenating files with a strict reader fails:

```python
# fails: Fill_TwapId is null in one file, string in the other
pa.concat_tables(tables)

# works
pa.concat_tables(tables, promote_options="permissive")
```

In Spark or Athena, declare the schema explicitly rather than inferring it from a single file.

## The `Coin` Namespace

`Fill_Coin`, `OrderStatus_Order_Coin`, and `BookDiff_Coin` cover four market types in one column. The sample holds 336 distinct coins:

| Form | Meaning | Sample events |
| --- | --- | ---: |
| `HYPE`, `BTC` | Plain perpetual | 83,665 |
| `xyz:...` | HIP-3 builder-deployed perp | 55,746 |
| `@107` | Spot pair, by index | 3,360 |
| `#1890` | Outcome / prediction token | 184 |

Filter by prefix to isolate a market type — HIP-3 perps are already 39% of order events in this slice, so leaving them in a "Hyperliquid perps" aggregate will not give you the numbers you expect.

## Topic Schemas

`Block_Number` and `Block_Time` are omitted below.

### fills

One row per counterparty per match. 1,552 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `Fill_User` | string | Address of this side of the match |
| `Fill_Coin` | string | Market — see the Coin namespace above |
| `Fill_Side` | string | `B` (buy) or `A` (sell/ask) |
| `Fill_Px`, `Fill_Sz` | string | Execution price and size |
| `Fill_StartPosition` | string | **Signed position before the fill** — negative is short. Not a money amount |
| `Fill_Dir` | string | Human-readable direction: `Open Long`, `Close Short`, `Long > Short`, `Buy`, `Sell` |
| `Fill_ClosedPnl` | string | Realized PnL on this fill. Non-zero on 704 of 1,552 sample rows |
| `Fill_Fee`, `Fill_FeeToken` | string | Fee paid and its token — `USDC` on 1,524 sample rows, also `HYPE` and spot indices |
| `Fill_Hash` | string | L1 transaction hash — **not unique per fill**, all-zero for TWAP |
| `Fill_Oid`, `Fill_Tid` | string | Order id and trade id. `Tid` identifies the match |
| `Fill_Crossed` | bool | `true` on the taker side, `false` on the maker side |
| `Fill_Time` | string | Fill timestamp, **epoch milliseconds** |
| `Fill_Cloid` | string | Client order id, when the trader supplied one |
| `Fill_TwapId` | string | Parent TWAP order, when the fill came from one |
| `Fill_BuilderFee`, `Fill_Builder` | string | Builder-code fee and the builder address |
| `Fill_DeployerFee` | string | HIP-3 deployer fee |
| `Fill_PriorityGas` | string | Priority gas paid |
| `Fill_Liquidation_*` | mixed | `LiquidatedUser`, `MarkPx`, `Method` — populated only on liquidations |
| `Fill_Extra` | string | Forward-compatibility map |

### order_statuses

One row per order lifecycle event. 142,955 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `OrderStatus_User` | string | Order owner |
| `OrderStatus_Status` | string | `open`, `canceled`, `filled`, `triggered`, or a `*Rejected` variant |
| `OrderStatus_Time` | string | Status timestamp, **epoch nanoseconds** |
| `OrderStatus_Order_Coin` | string | Market |
| `OrderStatus_Order_Side` | string | `B` or `A` |
| `OrderStatus_Order_LimitPx` | string | Limit price |
| `OrderStatus_Order_Sz` | string | Remaining size |
| `OrderStatus_Order_OrigSz` | string | Original size — compare with `Sz` to size a partial fill |
| `OrderStatus_Order_Oid` | string | Order id — join to `fills.Fill_Oid` and `book_diffs.BookDiff_Oid` |
| `OrderStatus_Order_Timestamp` | string | Order placement time, **epoch milliseconds** |
| `OrderStatus_Order_OrderType` | string | Order type |
| `OrderStatus_Order_Tif` | string | Time in force: `Alo`, `Ioc`, `Gtc`, `FrontendMarket` |
| `OrderStatus_Order_TriggerCondition` | string | Trigger condition text |
| `OrderStatus_Order_TriggerPx` | string | Trigger price |
| `OrderStatus_Order_IsTrigger` | bool | Whether this is a trigger order |
| `OrderStatus_Order_IsPositionTpsl` | bool | Position-level take-profit / stop-loss |
| `OrderStatus_Order_ReduceOnly` | bool | Reduce-only flag |
| `OrderStatus_Order_Cloid` | string | Client order id |
| `OrderStatus_Order_Children` | string | Child TP/SL bracket orders |
| `OrderStatus_Hash` | string | L1 transaction hash |
| `OrderStatus_Builder_Address`, `OrderStatus_Builder_Fee` | string, int64 | Builder code attribution |

### book_diffs

One row per order-level book change — the L4 stream. 89,241 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `BookDiff_User` | string | Owner of the order that changed |
| `BookDiff_Oid` | string | Order id |
| `BookDiff_Coin` | string | Market |
| `BookDiff_Side` | string | `B` (bid, 47,697 rows) or `A` (ask, 41,544 rows) |
| `BookDiff_Px` | string | Price level |
| `BookDiff_Kind` | string | `new` (43,699), `remove` (44,120), or `update` (1,422) |
| `BookDiff_Sz` | string | Size on `new` |
| `BookDiff_OrigSz`, `BookDiff_NewSz` | string | Size before and after on `update` |

Apply the diffs in `Block_Number` order to reconstruct the book at any instant. `new` and `remove` nearly balance in a steady market — the small excess of removals over additions is the book shrinking across the slice.

### oracle_updates

One row per oracle publication. 24 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `OracleUpdate_UpdateClass` | string | `Deployer` (19 rows) or `Fallback` (5 rows) |
| `OracleUpdate_MarkPxInputs` | string | Per-publisher mark price inputs |
| `OracleUpdate_SpotPxInputs` | string | Spot price inputs |
| `OracleUpdate_ExternalPerpPxInputs` | string | External venue perp prices |
| `OracleUpdate_OraclePxs_CoinToMarkPx` | string | Resulting mark price per coin |
| `OracleUpdate_OraclePxs_CoinToOraclePx` | string | Resulting oracle price per coin |
| `OracleUpdate_OraclePxs_CoinToExternalPerpPx` | string | External perp price per coin |

Oracle prices drive funding and liquidation, so join these to `fills` on `Block_Number` when reconstructing why a liquidation fired.

### misc_events

One row per ledger event. 32 rows in the sample, across `LedgerUpdate` (27), `CWithdrawal` (2), `GossipPriorityAuctionRestart` (2), and `ValidatorRewards` (1).

| Column | Type | Description |
| --- | --- | --- |
| `MiscEvent_InnerType` | string | Which event variant this row carries — read it before any other field |
| `MiscEvent_Time` | string | Event timestamp |
| `MiscEvent_Hash` | string | L1 transaction hash |
| `MiscEvent_LedgerUpdate_Users` | list\<string\> | Accounts affected |
| `MiscEvent_LedgerUpdate_Delta_Type` | string | Deposit, withdraw, transfer, spot transfer, and so on |
| `MiscEvent_LedgerUpdate_Delta_Amount`, `_Usdc`, `_UsdcValue` | string | Amounts, with the USDC-denominated value |
| `MiscEvent_LedgerUpdate_Delta_Fee`, `_FeeToken`, `_NativeTokenFee` | string | Fees on the ledger movement |
| `MiscEvent_CWithdrawal_*` | mixed | `Amount`, `User`, `IsFinalized` for chain withdrawals |
| `MiscEvent_CDeposit_*`, `MiscEvent_Delegation_*`, `MiscEvent_Funding_*` | mixed | Populated for their respective `InnerType` |

This is a **sparse union table**: only the column family matching `MiscEvent_InnerType` is populated on a given row, and unused families are null for the whole file. See the schema note above.

### twap_statuses

One row per TWAP state change. 3 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `TwapStatus_TwapId` | string | TWAP order id — join to `Fill_TwapId` |
| `TwapStatus_State_Coin`, `_User`, `_Side` | string | Market, owner, direction |
| `TwapStatus_State_Sz` | string | Total size to execute |
| `TwapStatus_State_ExecutedSz`, `_ExecutedNtl` | string | Size and notional executed so far |
| `TwapStatus_State_Minutes` | int64 | Duration the TWAP runs over |
| `TwapStatus_State_Timestamp` | string | Start time, **epoch milliseconds** |
| `TwapStatus_State_ReduceOnly`, `_Randomize` | bool | TWAP flags |
| `TwapStatus_Status` | string | Terminal status, e.g. `finished` |
| `TwapStatus_StatusError` | string | Error text when the TWAP failed |

### core_writer_actions

One row per action submitted to HyperCore from a HyperEVM contract. 10 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `CoreWriterAction_User` | string | Address that submitted the action |
| `CoreWriterAction_Nonce` | string | Action nonce |
| `CoreWriterAction_EvmTxHash` | string | **Originating HyperEVM transaction** — the bridge back to EVM data |
| `CoreWriterAction_Action_Type` | string | Action variant, e.g. `SystemSpotSendAction`, `SystemSendAssetAction` |
| `CoreWriterAction_Action_Destination`, `_Token`, `_Wei` | mixed | Transfer target, token index, amount |
| `CoreWriterAction_Action_DestinationDexOrSpot`, `_SourceDexOrSpot` | int64 | Venue routing |
| `CoreWriterAction_Action_Orders` | list | Orders placed by the action |
| `CoreWriterAction_Action_Builder`, `_MaxFeeRate` | mixed | Builder-code attribution |

`CoreWriterAction_EvmTxHash` is the join key to HyperEVM transaction data, making this the one table that links the two halves of Hyperliquid.

## Joining Topics

Every topic carries `Block_Number`, and the order id threads the trading tables together:

```sql
-- taker fills with the order that produced them
SELECT
  f.Fill_Coin,
  f.Fill_Px,
  f.Fill_Sz,
  f.Fill_ClosedPnl,
  o.OrderStatus_Order_Tif,
  o.OrderStatus_Order_ReduceOnly
FROM hyperliquid_fills f
JOIN hyperliquid_order_statuses o
  ON f.Fill_Oid = o.OrderStatus_Order_Oid
 AND o.OrderStatus_Status = 'filled'
WHERE f.Fill_Crossed = true
```

Because one order produces many status events and many fills, join on `Oid` plus a status filter, or aggregate one side first — otherwise you get a cross product.

## Reading Files in Python

```python
import pandas as pd
from decimal import Decimal

BASE = "https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/hyperliquid/"
RANGE = "1075858800_1075858999"

fills = pd.read_parquet(f"{BASE}fills/{RANGE}.parquet")
orders = pd.read_parquet(f"{BASE}order_statuses/{RANGE}.parquet")

# taker side only — every match is in the file twice
taker = fills[fills.Fill_Crossed]
taker = taker.assign(
    px=taker.Fill_Px.map(Decimal),
    sz=taker.Fill_Sz.map(Decimal),
)
print("matches:", len(taker), "of", len(fills), "fill rows")
print("notional:", (taker.px * taker.sz).sum())

# realized PnL by wallet
pnl = fills.assign(pnl=fills.Fill_ClosedPnl.map(Decimal)).groupby("Fill_User").pnl.sum()
print(pnl.sort_values().tail())

# order flow is mostly rejects, not trades
print(orders.OrderStatus_Status.value_counts().head())
```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Hyperliquid data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   [**Hyperliquid APIs and streams**](/docs/perpetuals/hyperliquid/)
    

The Parquet exports and the live streams share the same field definitions, so a backtest reading this archive and a production consumer reading the stream decode with the same generated code.
