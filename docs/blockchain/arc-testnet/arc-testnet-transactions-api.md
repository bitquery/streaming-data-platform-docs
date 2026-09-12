---
title: "Arc Testnet Transactions, Blocks & Fees API"
description: "Query and stream transactions, receipts, blocks and USDC gas fees on Circle's Arc testnet with Bitquery GraphQL: transaction by hash, address history, failed transactions, block stats and fee analytics."
sidebar_position: 5
keywords:
  - Arc testnet transactions API
  - Arc testnet blocks API
  - Arc testnet gas fees USDC
  - Arc testnet transaction by hash
  - Arc testnet receipts
  - Arc testnet block explorer API
  - Arc testnet eth_getTransactionByHash alternative
  - Circle Arc transactions API
  - arc_testnet Transactions
  - Bitquery Arc testnet
---
# Arc Testnet Transactions, Blocks & Fees API

Query and stream **transactions, receipts and blocks on Arc testnet** with Bitquery GraphQL. The `EVM.Transactions` and `EVM.Blocks` cubes on `network: arc_testnet` cover what a block explorer shows for a hash, an address or a block, with fees in **USDC** because USDC is the chain's gas token.

Every query on this page was executed against the production endpoint before publishing. Change `query` to `subscription` on any of them to stream the same rows.

:::warning Testnet: realtime only, USD fields are 0
Only `dataset: realtime` exists for Arc testnet; leave the `dataset` argument out. `ValueInUSD`, `CostInUSD`, `GasPriceInUSD` and the other `...InUSD` fields return 0. Fee fields such as `Fee.SenderFee` are native USDC and populated.
:::

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Arc Testnet API overview](/docs/blockchain/arc-testnet/) — network facts, every cube and stream in one place
- [Arc Testnet Calls API](/docs/blockchain/arc-testnet/arc-testnet-calls-api/) — the call tree inside a transaction
- [Arc Testnet Transfers API](/docs/blockchain/arc-testnet/arc-testnet-transfers-api/)
- [EVM Transactions schema](/docs/schema/evm/transactions/)
- [EVM Blocks schema](/docs/schema/evm/blocks/)
:::

**On this page:** [Stream](#stream-transactions) · [Latest](#latest-transactions) · [By hash](#transaction-by-hash) · [By address](#transactions-of-an-address) · [Failed](#failed-transactions) · [Fees](#gas-fees-in-usdc) · [Latest blocks](#latest-blocks) · [Block by number](#block-by-number) · [Block stats](#block-and-throughput-statistics) · [FAQ](#faq)

---

## Stream transactions

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-stream-transactions)

Every transaction as blocks are indexed. Arc produces a block well under every second, so expect a steady feed.

```graphql
subscription {
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-transactions)

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-transaction-by-hash)

The equivalent of `eth_getTransactionByHash` plus `eth_getTransactionReceipt` in one call. The example hash is a live USDC value transfer; replace it with any recent hash.

```graphql
{
  EVM(network: arc_testnet) {
    Transactions(
      where: {
        Transaction: {
          Hash: {is: "0x9be99a14a7db15fae9b78c68c3bfb41cfd67654a7b8cdf499f56e712d8349fe1"}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-transactions-of-an-address)

Sent and received transactions of one address, newest first. This is the explorer's address page.

```graphql
{
  EVM(network: arc_testnet) {
    Transactions(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        any: [
          {Transaction: {From: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
          {Transaction: {To: {is: "0x2de8906a641d65d490bc60a4179d961d59742bcb"}}}
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-failed-transactions)

Transactions whose receipt status is 0. Join the [reverted calls](/docs/blockchain/arc-testnet/arc-testnet-calls-api/#reverted-calls) query on the hash to see the revert reason.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-gas-fee-statistics)

Because gas is paid in USDC, `Fee.SenderFee` is already a dollar amount. This gives the average, median and total fee per hour along with the average effective gas price.

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-latest-blocks)

```graphql
{
  EVM(network: arc_testnet) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-block-by-number)

```graphql
{
  EVM(network: arc_testnet) {
    Blocks(where: {Block: {Number: {eq: "61696399"}}}) {
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

▶️ [Run in IDE](https://ide.bitquery.io/arc-testnet-block-statistics)

Blocks, transactions, average transactions per block and average gas per block for each of the last 24 hours. Divide the block count by 3600 to get blocks per second.

```graphql
{
  EVM(network: arc_testnet) {
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
Native USDC. Arc pays gas in USDC, so a fee of `0.0025` is a quarter of a cent. `CostInUSD` and `GasPriceInUSD` are still 0 on testnet because there is no price index, even though the native unit is a dollar.

**Why is `Transaction.GasPrice` 0 while the fee is not?**
Arc transactions are EIP-1559 type 2. Read `Fee.EffectiveGasPrice`, `Transaction.GasFeeCap` and `Transaction.GasTipCap`; the legacy `GasPrice` field is 0 for these.

**How fast are blocks?**
Well under a second on average. Measure the current rate with the [block statistics](#block-and-throughput-statistics) query rather than assuming a fixed interval.

**Can I get a transaction's internal calls and logs from here?**
Use the same hash on the [Calls API](/docs/blockchain/arc-testnet/arc-testnet-calls-api/#internal-calls-of-a-transaction) for the call tree and the [Events API](/docs/blockchain/arc-testnet/arc-testnet-events-api/) for the logs.

**Is there a block explorer?**
Circle's testnet explorer is at [testnet.arcscan.app](https://testnet.arcscan.app). Bitquery is an indexed data API rather than an explorer, and every explorer lookup on this page can be run in bulk or streamed.
