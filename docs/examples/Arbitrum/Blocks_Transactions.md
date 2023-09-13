---
sidebar_position: 6
---

# Arbitrum Blocks and Transactions Examples

## Latest Blocks

The query below retrieves the latest 10 blocks on the Arbitrum network.
You can find the query [here](https://ide.bitquery.io/Latest-Arbitrum-blocks)
```
query MyQuery {
  EVM(network: arbitrum) {
    Blocks(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Block {
        BaseFee
        Coinbase
        Difficulty
        Time
        Root
      }
    }
  }
}


```

## Latest Transactions

The query below retrieves the latest 10 transactions on the Arbitrum network.
You can find the query [here](https://ide.bitquery.io/Latest-Transactions_3)

```
query ($network: evm_network, $limit: Int!, $offset: Int!, $from: String, $till: String) {
  EVM(network: $network, dataset: archive) {
    Transactions(
      limit: {count: $limit, offset: $offset}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {since: $from, till: $till}}}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Transaction {
        To
        Hash
        Value
      }
      Receipt {
        GasUsed
      }
      Fee {
        EffectiveGasPrice
        SenderFee
      }
    }
  }
}
{
  "network": "arbitrum",
  "limit": 10,
  "offset": 0,
  "from": "2023-07-01",
  "till": "2023-07-15"
}
```