---
title: "Robinhood Transactions & Receipts API (eth_getBlockReceipts equivalent)"
description: "Query Robinhood transactions and receipts with Bitquery GraphQL — block receipts, single-tx receipts, status, gas, and fees. A no-node eth_get*Receipt alternative."
sidebar_position: 6
keywords:
  - Robinhood transactions API
  - Robinhood receipts API
  - eth_getBlockReceipts Robinhood
  - eth_getTransactionReceipt alternative
  - eth_getTransactionByHash alternative
  - Robinhood transaction status
  - Robinhood gas used API
  - Robinhood failed transactions
  - Robinhood block receipts
  - Bitquery Robinhood transactions
---
# Robinhood Transactions & Receipts API

Query **transactions and their receipts on Robinhood** with Bitquery GraphQL. The `EVM.Transactions` cube returns one row per transaction with its **receipt** (status, gas used, cumulative gas, contract address, logs bloom), **fee breakdown** (effective gas price, burnt, miner reward), and header fields — a no-node replacement for the JSON-RPC receipt methods that also streams live over WebSocket.

This page is organized around the **RPC methods people migrate from** — `eth_getBlockReceipts`, `eth_getTransactionReceipt`, `eth_getTransactionByHash` — with the Bitquery equivalent for each. Every query was executed against the production endpoint before publishing, and the stream was verified live over WebSocket.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Events API](/docs/blockchain/robinhood/robinhood-events-api/) (logs — receipts don't nest them here)
- [Robinhood Calls & Traces API](/docs/blockchain/robinhood/robinhood-calls-api/)
- [Robinhood Transfers](/docs/blockchain/robinhood/robinhood-transfers/)
- [WebSocket authentication](/docs/authorization/websocket/)
:::

**On this page:** [RPC mapping](#rpc-method-mapping) · [Dataset caveat](#dataset-realtime-only) · [Block receipts](#eth_getblockreceipts-equivalent) · [Single receipt](#eth_gettransactionreceipt-equivalent) · [Transaction by hash](#eth_gettransactionbyhash-equivalent) · [Getting logs](#getting-the-logs-for-a-receipt) · [Latest & stream](#latest-transactions-and-live-stream) · [Failed txs](#failed-transactions) · [Account history](#transactions-for-an-account) · [Receipt fields](#receipt-field-reference) · [FAQ](#faq)

---

## RPC method mapping

| JSON-RPC method | Bitquery equivalent |
| --- | --- |
| `eth_getBlockReceipts` | `Transactions` filtered by `Block.Number` (or `Block.Hash`) — [below](#eth_getblockreceipts-equivalent) |
| `eth_getTransactionReceipt` | `Transactions` filtered by `Transaction.Hash` — [below](#eth_gettransactionreceipt-equivalent) |
| `eth_getTransactionByHash` | Same filter, selecting header fields incl. `Transaction.Data` — [below](#eth_gettransactionbyhash-equivalent) |
| `eth_getTransactionReceipt().logs` | `Events` cube, same block or tx filter — [below](#getting-the-logs-for-a-receipt) |
| `eth_getBlockTransactionCountByNumber` | `Transactions` + `count` on a block — [below](#block-transaction-stats) |
| `eth_subscribe("newHeads"/txs)` | `subscription { Transactions }` — [below](#latest-transactions-and-live-stream) |

---

## Dataset: realtime only

:::warning Use `dataset: realtime` for transactions and receipts
Unlike the [Events](/docs/blockchain/robinhood/robinhood-events-api/) and [Calls](/docs/blockchain/robinhood/robinhood-calls-api/) cubes, the **`Transactions` cube has no archive table on Robinhood**. `dataset: archive` errors (*"no table can query Transaction"*), and `combined` only serves blocks still inside the realtime window. So receipt queries work for **recent blocks** — the realtime window is a rolling span of recent days; measure it with the [window probe](#window-probe). Blocks older than the window need a [data export](https://bitquery.io/forms/api).
:::

The block and transaction identifiers in the examples are **illustrative recent values** — they roll out of the realtime window over time. Get a current block number from the [latest-transactions query](#latest-transactions-and-live-stream) and substitute it.

### Window probe

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions {
      count
      earliest: Block { Time(minimum: Block_Time) }
      latest: Block { Time(maximum: Block_Time) }
    }
  }
}
```

---

## `eth_getBlockReceipts` equivalent

Every transaction receipt in one block: filter `Block.Number` and order by `Transaction.Index` — each row is one receipt. Substitute a recent block number.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(
      where: { Block: { Number: { eq: "18038003" } } }
      orderBy: { ascending: Transaction_Index }
      limit: { count: 1000 }
    ) {
      Block {
        Number
        Hash
        Time
      }
      Transaction {
        Hash
        Index
        From
        To
        Type
        Nonce
        Value
      }
      Receipt {
        Status
        Type
        CumulativeGasUsed
        GasUsed
        ContractAddress
        Bloom
        PostState
      }
      Fee {
        EffectiveGasPrice
      }
      TransactionStatus {
        Success
      }
    }
  }
}
```

To target the block **by hash** (the other form `eth_getBlockReceipts` accepts), swap the filter:

```graphql
where: { Block: { Hash: { is: "0x69ab18694427b809459cad7a44b1ae369095897b2d86571410a1430902a9fb1d" } } }
```

:::note Robinhood is an Arbitrum-Orbit chain
Blocks include system/sequencer transactions (e.g. `Receipt.Type: 106` from the sequencer address `0x…000a4b05`) alongside user transactions — exactly what a node returns for the block. Filter them out by `Transaction.Type` or sender if you only want user activity.
:::

---

## `eth_getTransactionReceipt` equivalent

One transaction's receipt — filter `Transaction.Hash`.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(
      where: { Transaction: { Hash: { is: "0x01f956f16e7200e1a2054e3a701bf6b2496972a23544b4d2f122f0894a0f0835" } } }
    ) {
      Block {
        Number
        Hash
        Time
      }
      Transaction {
        Hash
        Index
        From
        To
        Type
        Nonce
        Value
        Gas
        GasPrice
      }
      Receipt {
        Status
        Type
        CumulativeGasUsed
        GasUsed
        ContractAddress
        Bloom
      }
      Fee {
        EffectiveGasPrice
        Burnt
        MinerReward
      }
      TransactionStatus {
        Success
        EndError
      }
    }
  }
}
```

`Receipt.Status` is the RPC-style `"1"`/`"0"`; `TransactionStatus.Success` is the same as a boolean, with `EndError` / `FaultError` carrying the revert reason when it failed.

---

## `eth_getTransactionByHash` equivalent

The same filter, selecting the transaction header — including `Transaction.Data` (the input calldata) and the fee-cap fields.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(
      where: { Transaction: { Hash: { is: "0x01f956f16e7200e1a2054e3a701bf6b2496972a23544b4d2f122f0894a0f0835" } } }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        Index
        From
        To
        Nonce
        Value
        Gas
        GasPrice
        GasFeeCap
        GasTipCap
        Type
        Data
      }
    }
  }
}
```

For the decoded function call and internal calls of a transaction, use the [Calls & Traces API](/docs/blockchain/robinhood/robinhood-calls-api/#full-call-tree-of-a-transaction) instead of raw `Data`.

---

## Getting the logs for a receipt

`eth_getTransactionReceipt` embeds a `logs` array; here logs live in the **[Events cube](/docs/blockchain/robinhood/robinhood-events-api/)**, decoded. Query them for the same transaction (or the whole block) and order by `Log.Index`:

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Events(
      where: { Transaction: { Hash: { is: "0x01f956f16e7200e1a2054e3a701bf6b2496972a23544b4d2f122f0894a0f0835" } } }
      orderBy: { ascending: Log_Index }
    ) {
      Log {
        Index
        SmartContract
        Signature {
          Name
          SignatureHash
        }
      }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
        }
      }
    }
  }
}
```

Swap the filter to `Block: { Number: { eq: "…" } }` for every log in a block (the `eth_getBlockReceipts` logs, flattened).

---

## Latest transactions and live stream

The newest transactions with their receipts — and the block numbers to plug into the examples above.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(limit: { count: 10 }, orderBy: { descending: Block_Time }) {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
        Value
        Type
      }
      Receipt {
        Status
        GasUsed
      }
      TransactionStatus {
        Success
      }
    }
  }
}
```

Stream every transaction as it is mined — the push-based counterpart, verified live over WebSocket:

```graphql
subscription {
  EVM(network: robinhood) {
    Transactions {
      Block {
        Number
        Time
      }
      Transaction {
        Hash
        From
        To
        Value
      }
      Receipt {
        Status
        GasUsed
      }
      TransactionStatus {
        Success
      }
    }
  }
}
```

:::tip WebSocket connection
Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). See [WebSocket authentication](/docs/authorization/websocket/).
:::

:::tip Prefer Kafka for the firehose
Consuming every transaction continuously? Bitquery also delivers Robinhood data as **Kafka streams** (protobuf topic `robinhood.transactions.proto`) with consumer-group scaling and replay. See [Kafka Streaming Concepts](/docs/streams/kafka-streaming-concepts/).
:::

---

## Failed transactions

Filter `TransactionStatus.Success: false` for reverted transactions with their error text — an error monitor across the chain.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { TransactionStatus: { Success: false } }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
        EndError
        FaultError
      }
      Receipt {
        Status
        GasUsed
      }
    }
  }
}
```

---

## Transactions for an account

Every top-level transaction sent by an address (`Transaction.From`), with receipts — an account history / nonce tracker. Swap in an active sender.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: { Transaction: { From: { is: "0xcc1120e4af58abbecae0c0e3c4b2d343c1283695" } } }
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        To
        Value
        Nonce
      }
      Receipt {
        Status
        GasUsed
      }
    }
  }
}
```

`Transaction.From` is the top-level sender (EOA). For a contract's inbound calls including internal ones, use the [Calls API](/docs/blockchain/robinhood/robinhood-calls-api/#stream-calls-to-one-contract).

---

## Block transaction stats

The count and gas of one block in a single aggregate — the `eth_getBlockTransactionCountByNumber` answer, plus success rate and total gas.

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transactions(where: { Block: { Number: { eq: "18038003" } } }) {
      txns: count
      success: count(if: { TransactionStatus: { Success: true } })
      gas: sum(of: Receipt_GasUsed)
    }
  }
}
```

---

## Receipt field reference

| JSON-RPC receipt field | Bitquery field |
| --- | --- |
| `blockNumber` / `blockHash` | `Block.Number` / `Block.Hash` |
| `transactionHash` / `transactionIndex` | `Transaction.Hash` / `Transaction.Index` |
| `from` / `to` | `Transaction.From` / `Transaction.To` |
| `status` | `Receipt.Status` (`"1"`/`"0"`) or `TransactionStatus.Success` (bool) |
| `cumulativeGasUsed` | `Receipt.CumulativeGasUsed` |
| `gasUsed` | `Receipt.GasUsed` |
| `contractAddress` | `Receipt.ContractAddress` |
| `logsBloom` | `Receipt.Bloom` |
| `effectiveGasPrice` | `Fee.EffectiveGasPrice` |
| `type` | `Receipt.Type` (or `Transaction.Type`) |
| `root` (pre-Byzantium) | `Receipt.PostState` |
| `logs` | [`Events` cube](#getting-the-logs-for-a-receipt) (separate, decoded) |

Also on `Fee`: `Burnt`, `MinerReward`, `PriorityFeePerGas`, `GasRefund`, `Savings` (plus `*InUSD` variants). On `Transaction`: `GasFeeCap`, `GasTipCap`, `Data`, `Nonce`, `CallCount`, `Protected`.

---

## Tips

1. Use **`dataset: realtime`** — the `Transactions` cube has no archive on Robinhood; older blocks need a [data export](https://bitquery.io/forms/api).
2. `Receipt.Status` is RPC-style `"1"`/`"0"`; `TransactionStatus.Success` is the boolean form and carries `EndError` / `FaultError` on failure.
3. Receipts don't nest logs here — pull them from the [Events cube](#getting-the-logs-for-a-receipt) by block or tx hash.
4. Block/tx identifiers in queries roll out of the realtime window over time; fetch current ones from the [latest-transactions query](#latest-transactions-and-live-stream).
5. Sequencer/system transactions (`Type: 106`) appear in blocks — filter by `Transaction.Type` or sender for user-only views.
6. For decoded function inputs and internal calls, use the [Calls API](/docs/blockchain/robinhood/robinhood-calls-api/); for token movement, use [Transfers](/docs/blockchain/robinhood/robinhood-transfers/).

---

## FAQ

### What is the eth_getBlockReceipts equivalent on Robinhood?

Query the `EVM.Transactions` cube filtered by `Block.Number` (or `Block.Hash`), ordered by `Transaction.Index`, selecting `Receipt`, `Fee`, and `TransactionStatus` — one row per receipt. See [the query](#eth_getblockreceipts-equivalent). Use `dataset: realtime`.

### How do I get a single transaction's receipt?

Filter `Transaction.Hash` on the same cube — the [`eth_getTransactionReceipt` equivalent](#eth_gettransactionreceipt-equivalent). Add `Transaction.Data` and fee-cap fields for the [`eth_getTransactionByHash`](#eth_gettransactionbyhash-equivalent) view.

### Where are the receipt logs?

Logs are a separate, decoded cube — [Events](/docs/blockchain/robinhood/robinhood-events-api/). Filter it by the same `Transaction.Hash` or `Block.Number` and order by `Log.Index`. See [Getting the logs](#getting-the-logs-for-a-receipt).

### Why does dataset archive fail for transactions?

The `Transactions` cube is realtime-only on Robinhood — there is no archive table, so `archive` errors and `combined` only covers the realtime window. Recent blocks work; for older history request a [data export](https://bitquery.io/forms/api).

### How do I check whether a transaction succeeded or reverted?

Read `TransactionStatus.Success` (boolean) with `EndError` / `FaultError` for the reason, or `Receipt.Status` for the `"1"`/`"0"` form. Filter `Success: false` to list [failed transactions](#failed-transactions).
