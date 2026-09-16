---
title: "Arc Mainnet Transactions, Blocks & Fees API"
description: "Query and stream Arc mainnet transactions, blocks and USDC gas fees with Bitquery GraphQL, including hashes, address history, failures and fee analytics."
sidebar_position: 5
keywords:
  - Arc mainnet transactions API
  - Arc mainnet blocks API
  - Arc mainnet gas fees USDC
  - Arc mainnet transaction by hash
  - Arc mainnet receipts
  - Arc mainnet block explorer API
  - Arc mainnet eth_getTransactionByHash alternative
  - Circle Arc transactions API
  - arc Transactions
  - Bitquery Arc mainnet
---
# Arc Mainnet Transactions, Blocks & Fees API

Query and stream **transactions, receipts and blocks on Arc mainnet** with Bitquery GraphQL. The `EVM.Transactions` and `EVM.Blocks` cubes on `network: arc` cover what a block explorer shows for a hash, an address or a block, with fees in **USDC** because USDC is the chain's gas token.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows.

:::info Availability checked 16 September 2026
The realtime path returned transactions and blocks. `CostInUSD`, `GasPriceInUSD` and `Fee.SenderFeeInUSD` were populated. Leave the `dataset` argument out until `combined` and `archive` are enabled.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Mainnet API overview](/docs/blockchain/arc-mainnet/) — network facts, every cube and stream in one place
- [Arc Mainnet Calls API](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/) — the call tree inside a transaction
- [Arc Mainnet Transfers API](/docs/blockchain/arc-mainnet/arc-mainnet-transfers-api/)
- [EVM Transactions schema](/docs/schema/evm/transactions/)
- [EVM Blocks schema](/docs/schema/evm/blocks/)
:::

**On this page:** [Stream](#stream-transactions) · [Latest](#latest-transactions) · [By hash](#transaction-by-hash) · [By address](#transactions-of-an-address) · [Failed](#failed-transactions) · [Fees](#gas-fees-in-usdc) · [Latest blocks](#latest-blocks) · [Block by number](#block-by-number) · [Block stats](#block-and-throughput-statistics) · [FAQ](#faq)

---

## Stream transactions

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-stream-transactions)

Every transaction as blocks are indexed. Arc produces a block well under every second, so expect a steady feed.

```graphql
subscription {
  EVM(network: arc) {
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
        Gas
        Type
        Nonce
      }
      Receipt {
        Status
        GasUsed
        ContractAddress
      }
      Fee {
        SenderFee
        EffectiveGasPrice
      }
    }
  }
}
```

---

## Latest transactions

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-transactions)

```graphql
{
  EVM(network: arc) {
    Transactions(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
    ) {
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
      Fee {
        SenderFee
      }
    }
  }
}
```

---

## Transaction by hash

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-transaction-by-hash)

The equivalent of `eth_getTransactionByHash` plus `eth_getTransactionReceipt` in one call. The example hash is a live USDC value transfer; replace it with any recent hash.

```graphql
{
  EVM(network: arc) {
    Transactions(
      where: {
        Transaction: {
          Hash: {is: "0x3fb2f3f18ae8ef86dbf6d25f268c861d2982f67308031df45574b5a7fcc02b9f"}
        }
      }
    ) {
      Block {
        Number
        Time
        Hash
      }
      Transaction {
        Hash
        From
        To
        Value
        Gas
        GasPrice
        GasFeeCap
        GasTipCap
        Nonce
        Type
        Index
      }
      Receipt {
        Status
        GasUsed
        CumulativeGasUsed
        ContractAddress
      }
      Fee {
        SenderFee
        EffectiveGasPrice
        PriorityFeePerGas
        Burnt
      }
    }
  }
}
```

---

## Transactions of an address

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-transactions-of-an-address)

Sent and received transactions of one address, newest first. This is the explorer's address page.

```graphql
{
  EVM(network: arc) {
    Transactions(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {Transaction: {From: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
          {Transaction: {To: {is: "0xada5bb90d0de0bd1b6f3938708f49295a8d1f7cb"}}}
        ]
      }
    ) {
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
      }
      Fee {
        SenderFee
      }
    }
  }
}
```

---

## Failed transactions

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-failed-transactions)

Transactions whose receipt status is 0. Join the [reverted calls](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/#reverted-calls) query on the hash to see the revert reason.

```graphql
{
  EVM(network: arc) {
    Transactions(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {TransactionStatus: {Success: false}}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
        To
        Gas
      }
      Receipt {
        GasUsed
      }
      Fee {
        SenderFee
      }
    }
  }
}
```

---

## Gas fees in USDC

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-gas-fee-statistics)

Because gas is paid in USDC, `Fee.SenderFee` is already a dollar amount. This gives the average, median and total fee per hour along with the average effective gas price.

```graphql
{
  EVM(network: arc) {
    Transactions(
      orderBy: {descendingByField: "Block_Time"}
      limit: {count: 24}
    ) {
      Block {
        Time(interval: {in: hours, count: 1})
      }
      count
      totalFees: sum(of: Fee_SenderFee)
      avgFee: average(of: Fee_SenderFee)
      medianFee: median(of: Fee_SenderFee)
      avgGasPrice: average(of: Fee_EffectiveGasPrice)
      avgGasUsed: average(of: Receipt_GasUsed)
    }
  }
}
```

---

## Latest blocks

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-latest-blocks)

```graphql
{
  EVM(network: arc) {
    Blocks(
      limit: {count: 20}
      orderBy: {descending: Block_Number}
    ) {
      Block {
        Number
        Time
        Hash
        TxCount
        GasUsed
        GasLimit
        BaseFee
        Coinbase
      }
    }
  }
}
```

Change `query` to `subscription` and drop `limit` and `orderBy` to receive each block header as it is indexed.

---

## Block by number

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-block-by-number)

```graphql
{
  EVM(network: arc) {
    Blocks(where: {Block: {Number: {eq: "21124027"}}}) {
      Block {
        Number
        Time
        Hash
        ParentHash
        TxCount
        GasUsed
        GasLimit
        BaseFee
        Coinbase
        Difficulty
      }
    }
  }
}
```

---

## Block and throughput statistics

▶️ [Run in IDE](https://ide.bitquery.io/arc-mainnet-block-statistics)

Blocks, transactions, average transactions per block and average gas per block for each of the last 24 hours. Divide the block count by 3600 to get blocks per second.

```graphql
{
  EVM(network: arc) {
    Blocks(
      orderBy: {descendingByField: "Block_Time"}
      limit: {count: 24}
    ) {
      Block {
        Time(interval: {in: hours, count: 1})
      }
      blocks: count
      transactions: sum(of: Block_TxCount)
      avgTxPerBlock: average(of: Block_TxCount)
      avgGasUsed: average(of: Block_GasUsed)
      medianGasUsed: median(of: Block_GasUsed)
    }
  }
}
```

---

## FAQ

**What unit is `Fee.SenderFee` in?**
Native USDC. Arc pays gas in USDC, so a fee of `0.0025` is a quarter of a cent. The USD fee fields were also populated in the launch-day check.

**Which gas-price field should I use?**
For EIP-1559 type 2 transactions, use `Fee.EffectiveGasPrice` for the price paid. `Transaction.GasFeeCap` and `Transaction.GasTipCap` show the sender's limits.

**How fast are blocks?**
Well under a second on average. Measure the current rate with the [block statistics](#block-and-throughput-statistics) query rather than assuming a fixed interval.

**Can I get a transaction's internal calls and logs from here?**
Use the same hash on the [Calls API](/docs/blockchain/arc-mainnet/arc-mainnet-calls-api/#internal-calls-of-a-transaction) for the call tree and the [Events API](/docs/blockchain/arc-mainnet/arc-mainnet-events-api/) for the logs.

**Is there a block explorer?**
Arc's mainnet explorer is [explorer.arc.io](https://explorer.arc.io). Bitquery is an indexed data API rather than an explorer, and every explorer lookup on this page can be run in bulk or streamed.
