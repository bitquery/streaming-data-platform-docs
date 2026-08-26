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
  - XRPL partial payments
  - XRPL issued tokens
  - XRPL trust lines
  - XRPL DEX offers
  - XRPL escrows
  - XRPL checks
  - XRPL NFT offers
  - XRP account balances
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

XRPL is a **ledger-object** chain rather than an account-and-contract chain. A transaction does not just move a balance — it creates, modifies, or deletes typed objects in the ledger: account roots, trust lines, DEX offers, escrows, checks, NFT offers. Most Bitquery topics mirror that structure, giving you **one row per affected ledger object per transaction**, with the transaction context attached.

## Available Ripple Topics

| Topic | Grain | What it holds |
| --- | --- | --- |
| `transactions_tx` | one row per transaction | Transaction envelope: type, fee, sequence, result code, memos, signers |
| `transfers_tx` | one row per value movement | Unified view of all value flow — payments, fees, trades, NFT trades, mints |
| `payments_tx` | one row per payment | `Payment` transactions with full amount / delivered / send-max / deliver-min detail |
| `balances` | one row per account per currency | Balance before and after each change, native and issued |
| `account_roots_tx` | one row per account object change | Account root state: XRP balance, owner count, sequence, domain, transfer rate |
| `ripple_states_tx` | one row per trust line change | Trust line (RippleState) balances between two accounts for an issued currency |
| `offers_tx` | one row per DEX offer change | Order book offers: taker gets / taker pays, before and after |
| `nftoken_offers_tx` | one row per NFT offer change | NFT buy and sell offers, with the NFToken and the asking price |
| `escrows_tx` | one row per escrow change | Escrow creation, finish, and cancel, with conditions and time locks |
| `checks_tx` | one row per check change | Checks — deferred payment authorizations |

Where a topic name ends in `_tx`, rows carry the transaction that caused the change. Pick `transfers_tx` when you want a single unified stream of value movement, and the object-level topics when you need XRPL-native state such as trust lines or order books.

## Sample Ripple Cloud Dataset

You can explore schemas and validate your tooling using the **public Ripple sample datasets**:

**GitHub reference (schemas & examples)**  
[https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ripple](https://github.com/bitquery/blockchain-cloud-data-dump-sample/tree/main/ripple)

**Example Parquet file (public S3)**

```
https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/<topic>/<block_range>.parquet

```

**Sample Parquet downloads (public S3)**

-   **Transactions** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/transactions_tx/93154950_93154999.parquet)
    
-   **Transfers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/transfers_tx/93155850_93155899.parquet)
    
-   **Payments** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/payments_tx/93154950_93154999.parquet)
    
-   **Balances** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/balances/93154950_93154999.parquet)
    
-   **Account Roots** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/account_roots_tx/93154950_93154999.parquet)
    
-   **Ripple States (trust lines)** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/ripple_states_tx/93154950_93154999.parquet)
    
-   **Offers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/offers_tx/93154950_93154999.parquet)
    
-   **NFToken Offers** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/nftoken_offers_tx/93154950_93155149.parquet)
    
-   **Escrows** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/escrows_tx/93154950_93155149.parquet)
    
-   **Checks** – [Download](https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/checks_tx/93154950_93155149.parquet)
    

## Ripple Dataset Directory Structure

```text
bitquery-blockchain-dataset/
└── ripple/
    ├── account_roots_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── balances/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── checks_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── escrows_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── nftoken_offers_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── offers_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── payments_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── ripple_states_tx/
    │   ├── <start_block>_<end_block>.parquet
    │   └── ...
    ├── transactions_tx/
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

Here `block` is the XRP Ledger **ledger index**.

**Range size varies by topic.** Busy topics are written in 50-ledger files, while sparse object types are batched into wider ranges so files do not become tiny. In the samples above, `transfers_tx` and `transactions_tx` cover 50 ledgers (`93154950_93154999`), while `checks_tx`, `escrows_tx`, and `nftoken_offers_tx` cover 200 (`93154950_93155149`). Discover the files under a prefix rather than assuming a fixed stride.

Density varies enormously. Across the same 50 ledgers the sample files hold about 4,400 transactions, 7,000 transfers, 9,600 balance rows, and 2,600 offers — but Checks are so rare that a **200**-ledger file contains a single row.

## Common Columns

Most topics share the same transaction-context columns, which makes joining across topics straightforward:

| Column | Type | Description |
| --- | --- | --- |
| `block` | uint32 | Ledger index |
| `tx_date` | date | Date partition of the ledger close time |
| `tx_time` | datetime | Ledger close time (UTC) |
| `tx_hash` | string | Transaction hash — the join key across every topic |
| `tx_index` | uint32 | Position of the transaction within the ledger |
| `tx_sender` | string | Account that submitted and signed the transaction |
| `tx_type` | string | XRPL transaction type, e.g. `Payment`, `OfferCreate`, `TrustSet` |
| `operation` | string | Ledger node change type — see below |
| `blockchain_id` | uint32 | Bitquery network identifier |
| `prev_txn_id` | string | Hash of the previous transaction that touched this ledger object |
| `prev_ledger_seq` | uint32 | Ledger index of that previous change |
| `flags` | uint32 | XRPL flag bitfield for the object or transaction |

### The `operation` Column

On the object-level topics, `operation` is the XRPL **AffectedNodes** change type, and it tells you what happened to the ledger object:

-   `CreatedNode` – the object came into existence, e.g. an offer was placed or a trust line opened. "Previous" columns are zero.
    
-   `ModifiedNode` – the object already existed and changed, e.g. an offer was partially filled or a balance moved.
    
-   `DeletedNode` – the object was removed, e.g. an offer was fully consumed or cancelled, or an escrow was finished. The value columns hold the object's **final** state before removal, not zeros.
    

A single transaction routinely produces rows across several topics. One `OfferCreate` that crosses the book can create an offer row, delete counterparty offer rows, and modify two account roots and several trust lines, all sharing one `tx_hash`.

## Correctness Notes

Four things about XRPL will silently produce wrong numbers if you treat the data like an EVM chain.

### 1. Use `delivered_value`, Not `amount_value`

XRPL supports **partial payments**, where the sender specifies a maximum `Amount` but the network delivers less. `amount_value` is the *requested ceiling*; `delivered_value` is what actually arrived. This is the exploit that historically drained exchanges that credited deposits from the wrong field.

In the `93154950_93154999` sample, 819 of 2,247 payments are flagged partial, and 346 of them delivered strictly less than the requested amount — sometimes by a factor of 10^15. Summing the wrong column is not a rounding error:

```
-- native XRP payments only (amount_currency_token_type = '-')
SUM(amount_value)     = 13,000,403,476,694 XRP   -- 130x the entire XRP supply
SUM(delivered_value)  =            482,083 XRP   -- correct
```

Always aggregate `delivered_value`. The `partial` column flags affected rows (`1` = partial); when `partial = 0`, the two columns are identical in every row of the sample, so `delivered_value` is safe to use unconditionally.

### 2. Drops vs XRP — Units Differ by Topic

XRPL's base unit is the **drop**, at 1,000,000 drops per XRP. The topics are not uniform:

| Topic and column | Unit | Type |
| --- | --- | --- |
| `transactions_tx.fee` | drops | string |
| `account_roots_tx.balance`, `prev_balance` | drops | string |
| `balances.balance`, `prev_balance` | XRP | float64 |
| `transfers_tx.amount_from`, `amount_to` | XRP | float64 |
| `payments_tx.*_value` | XRP | float64 |

Both drop-denominated columns are **strings**, so they must be cast before arithmetic. Verified against the sample: every one of the 4,394 transactions has `transactions_tx.fee` exactly 1,000,000× the matching `transfers_tx` fee row, and all 6,466 joinable account-root rows are exactly 1,000,000× the matching `balances` row.

```sql
CAST(fee AS BIGINT) / 1000000.0 AS fee_xrp
```

### 3. Failed Transactions Are Included

`transactions_tx` contains transactions that were **applied to the ledger but did not succeed** — they still consume a fee and occupy a sequence number. In the sample, 304 of 4,394 (about 7%) failed, with result codes such as `tecPATH_PARTIAL`, `tecPATH_DRY`, `tecUNFUNDED_OFFER`, and `tecINSUF_RESERVE_OFFER`.

Filter on `success = 1`, or equivalently `result = 'tesSUCCESS'`, before counting activity.

### 4. Issued Currency Codes Are Hex

XRPL supports two currency code formats. Three-character codes such as `XRP`, `POZ`, or `XPM` appear as-is. Longer codes are stored as the **40-character hex** the ledger itself carries, so decode them to get a readable ticker:

```python
bytes.fromhex("4D656F7752500000000000000000000000000000").rstrip(b"\x00").decode()
# 'MeowRP'
```

The same applies in SQL, for example in Athena or Snowflake:

```sql
SELECT
  rtrim(from_utf8(from_hex(currency_symbol)), chr(0)) AS symbol,
  sum(delivered_value) AS volume
FROM ripple_payments
WHERE currency_token_type = 'issued'
GROUP BY 1
ORDER BY 2 DESC
```

An issued token is only unique as the pair **(currency code, issuer)** — the same ticker can be issued by many accounts, and anyone may issue one. Filter on the issuer, or use `currency_id` as a single stable key. Native XRP carries `currency_token_type = '-'` and `currency_address = '-'`.

## Topic Schemas

Columns listed in [Common Columns](#common-columns) are omitted below.

### transactions_tx

One row per transaction. 4,394 rows in the 50-ledger sample.

| Column | Type | Description |
| --- | --- | --- |
| `fee` | string | Fee burned, **in drops** |
| `result` | string | XRPL result code, e.g. `tesSUCCESS`, `tecPATH_DRY` |
| `success` | uint8 | `1` when `result = 'tesSUCCESS'` |
| `sequence` | uint32 | Sender's account sequence number |
| `last_ledger_sequence` | uint32 | Last ledger the transaction was valid for |
| `account_txn_id` | string | Optional chained-transaction identifier |
| `source_tag` | uint32 | Sender-side routing tag |
| `memos` | string | JSON array of memos, each with `data_hex`, decoded `data`, `format`, `type` |
| `tx_signers` | string | JSON array of signers for multi-signed transactions |

### transfers_tx

One row per value movement — the unified stream. 7,041 rows in the `93155850_93155899` sample.

| Column | Type | Description |
| --- | --- | --- |
| `sender` | string | Account the value left; empty on mints |
| `receiver` | string | Account the value arrived at; empty on fees |
| `direction` | string | Transfer classification — see below |
| `amount_from` | float64 | Amount debited from `sender`, **in XRP** for native |
| `amount_to` | float64 | Amount credited to `receiver` |
| `currency_from_*` | mixed | `id`, `symbol`, `name`, `address`, `tokenType` of the sent asset |
| `currency_to_*` | mixed | Same set for the received asset |
| `tx_hash_bin` | binary | Transaction hash as raw bytes — cheaper to join and filter on |
| `tx_type_raw`, `transaction_type` | string | Raw and normalized transaction type |
| `tx_sender_raw`, `transaction_sender` | string | Raw and normalized submitting account |

One transaction produces several transfer rows. `direction` tells you what each row represents:

-   `payment` – a direct value transfer between two accounts, XRP or issued token
    
-   `fee` – the XRP burned to pay for the transaction. `receiver` is empty because the fee is destroyed, not paid to a validator
    
-   `trade` – a leg of a DEX order-book or AMM execution, where the sent and received currencies differ
    
-   `nft_trade` – an NFToken changing hands via `NFTokenAcceptOffer`
    
-   `mint` – an NFToken being created. `sender` is empty and `amount_from` is `0`
    
-   `other` – ledger effects that are not a completed value movement, such as `TrustSet` or `OfferCancel` bookkeeping
    

In the sample, `fee` rows alone are half the file (3,535 of 7,041), so filter to `direction = 'payment'` for economic volume and to `direction = 'fee'` for network fee revenue.

### payments_tx

One row per `Payment` transaction. 2,247 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `sender`, `receiver` | string | Payment source and destination |
| `amount_value` | float64 | Requested amount — **a ceiling, not what arrived** |
| `delivered_value` | float64 | Amount actually delivered — use this |
| `send_max_value` | float64 | Maximum the sender was willing to spend |
| `deliver_min_value` | float64 | Minimum the sender would accept delivering |
| `partial` | uint8 | `1` when the partial-payment flag was set |
| `amount_*`, `delivered_*`, `send_max_*`, `deliver_min_*` | mixed | Each carries its own `currency_id`, `currency_address`, `currency_name`, `currency_symbol`, `currency_token_type`, and `issuer` |
| `tag` | uint32 | Destination tag — identifies the end user at an exchange |
| `invoice` | string | Optional invoice identifier |

### balances

One row per account per currency per change. 9,640 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `account` | string | Account whose balance changed |
| `balance` | float64 | Balance after the change, **in XRP** for native |
| `prev_balance` | float64 | Balance before the change |
| `issuer` | string | Issuer of the currency; empty for native XRP |
| `currency_*` | mixed | `id`, `address`, `name`, `symbol`, `token_type` |

The per-row delta is `balance - prev_balance`. 252 rows in the sample have `balance = prev_balance`, so a change row does not guarantee a net movement.

### account_roots_tx

One row per AccountRoot object change — the account's own XRP balance and settings. 6,742 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `account` | string | The account |
| `balance` | string | XRP balance after the change, **in drops** |
| `prev_balance` | string | XRP balance before the change, **in drops** |
| `owner_count` | uint32 | Number of ledger objects the account owns, which sets its reserve |
| `sequence` | uint32 | Account sequence number |
| `domain` | string | Optional domain the account claims, hex encoded. Rare — 11 of 6,742 rows |
| `transfer_rate` | uint32 | Fee an issuer charges on transfers of its token |

Nearly all rows are `ModifiedNode`; `CreatedNode` marks account funding (16 in the sample).

### ripple_states_tx

One row per RippleState (trust line) change. Trust lines hold every issued-token balance on XRPL. 1,857 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `low_account` | string | The numerically lower of the two accounts |
| `high_account` | string | The numerically higher of the two accounts |
| `balance` | float64 | Trust line balance after the change |
| `pre_balance` | float64 | Trust line balance before the change |
| `currency_*` | mixed | `id`, `address`, `name`, `symbol`, `token_type` |

**The balance is signed, from the low account's perspective.** A positive balance means the low account holds the asset; a negative balance means the high account does. In the sample, 909 rows are negative, 562 positive, and 386 zero. Take the absolute value, and use the sign to decide which side holds the token — do not sum raw balances across trust lines.

### offers_tx

One row per DEX offer object change. 2,572 rows in the sample.

| Column | Type | Description |
| --- | --- | --- |
| `account` | string | Offer owner |
| `taker_gets_value` | float64 | What the taker receives, after the change |
| `taker_pays_value` | float64 | What the taker pays, after the change |
| `pre_taker_gets_value` | float64 | Same, before the change |
| `pre_taker_pays_value` | float64 | Same, before the change |
| `taker_gets_currency_*` | mixed | Currency the taker receives |
| `taker_pays_currency_*` | mixed | Currency the taker pays |
| `book_directory`, `book_node` | string | Order book placement |
| `expiration`, `sequence` | uint32 | Offer expiry and owner sequence |

Compare the `pre_*` and post columns to size a fill. On `CreatedNode` rows the `pre_*` values are zero; on `DeletedNode` rows the post columns retain the offer's final state rather than zeroing out, so a deletion is a cancel or a complete fill depending on whether the remaining value went to zero.

### nftoken_offers_tx

One row per NFT offer object change. 202 rows in the 200-ledger sample.

| Column | Type | Description |
| --- | --- | --- |
| `from_account` | string | Offer creator |
| `destination_account` | string | Restricted counterparty, when the offer targets one account |
| `nftoken_sell_offer` | string | Sell offer identifier, set on sell-side rows |
| `nftoken_buy_offer` | string | Buy offer identifier, set on buy-side rows |
| `nftoken_currency_*` | mixed | The NFToken being offered, with `token_type` of `nft` |
| `nftoken_value` | float64 | NFToken quantity, normally `1` |
| `currency_*` | mixed | Currency of the asking price — XRP in every sample row |
| `value` | float64 | Asking price |
| `book_directory`, `book_node` | string | Offer book placement |
| `expiration`, `sequence` | uint32 | Offer expiry and owner sequence |

Check which of `nftoken_sell_offer` / `nftoken_buy_offer` is populated to tell the two sides apart — 68 sell and 59 buy in the sample.

### escrows_tx

One row per Escrow object change. 12 rows in the 200-ledger sample.

| Column | Type | Description |
| --- | --- | --- |
| `account` | string | Escrow creator |
| `destination` | string | Escrow beneficiary |
| `amount` | float64 | Escrowed amount |
| `condition` | string | Crypto-condition that must be fulfilled to release |
| `finish_after` | uint32 | Earliest release time, **Ripple epoch seconds** |
| `cancel_after` | uint32 | Time after which the escrow can be cancelled back |
| `source_tag`, `destination_tag` | uint32 | Routing tags |
| `currency_*` | mixed | Escrowed currency |

`CreatedNode` rows are `EscrowCreate`; `DeletedNode` rows are `EscrowFinish` or `EscrowCancel` — read `tx_type` to distinguish them.

**Time fields use the Ripple epoch**, which starts at 2000-01-01T00:00:00Z. Add 946,684,800 to convert to Unix time.

### checks_tx

One row per Check object change. Checks are rare — the 200-ledger sample contains **one** row.

| Column | Type | Description |
| --- | --- | --- |
| `account` | string | Check writer |
| `destination` | string | Check recipient |
| `send_max` | float64 | Maximum amount the check can be cashed for |
| `expiration` | uint32 | Expiry, Ripple epoch seconds |
| `invoice_id` | string | Optional invoice identifier |
| `source_tag`, `destination_tag` | uint32 | Routing tags |
| `sequence` | uint32 | Owner sequence number |
| `currency_*` | mixed | Check currency |

## Joining Topics

Every topic carries `tx_hash`, so it is the natural join key. To attach fee and success to value movement:

```sql
SELECT
  p.sender,
  p.receiver,
  p.delivered_value,
  CAST(t.fee AS BIGINT) / 1000000.0 AS fee_xrp
FROM ripple_payments p
JOIN ripple_transactions t USING (tx_hash)
WHERE t.success = 1
```

Because one transaction fans out to many object rows, joining two object-level topics on `tx_hash` alone produces a cross product. Aggregate one side first, or add `block` and the object identity columns to the join.

## Reading Files in Python

```python
import pandas as pd

BASE = "https://bitquery-blockchain-dataset.s3.us-east-1.amazonaws.com/ripple/"
RANGE = "93154950_93154999"

tx = pd.read_parquet(f"{BASE}transactions_tx/{RANGE}.parquet")
pay = pd.read_parquet(f"{BASE}payments_tx/{RANGE}.parquet")

# fees are drops-as-string
tx["fee_xrp"] = tx.fee.astype("int64") / 1_000_000
print("fees burned:", tx.fee_xrp.sum(), "XRP over", len(tx), "transactions")
print("failed:", (tx.success == 0).sum())

# delivered_value, never amount_value
xrp = pay[pay.amount_currency_token_type == "-"]
print("XRP delivered:", xrp.delivered_value.sum())
print("if you used amount_value:", xrp.amount_value.sum())   # ~27,000,000x too high
```

## Real-Time vs Batch Data Access

Cloud data dumps are optimized for **batch analytics and historical workloads**.

If you require **low-latency or streaming Ripple data**, Bitquery also provides:

-   [**Kafka streams**](/docs/streams/kafka-streaming-concepts/)
    
-   **GraphQL subscriptions**
