---
sidebar_position: 5
---

# Balances and Balance Update Examples

## Latest Balance of an Address on Arbitrum

The query returns the 11 most recent balance updates for the address `0xdef1c0ded9bec7f1a1670819833240f027b25eff` on the Arbitrum network. The balance updates will be sorted in descending order by the amount of token in the address.
The `sum` function is used to aggregate the `Amount` field for all balance updates in the list.
You can find the query [here](https://ide.bitquery.io/Address-balance-on-Arbitrum)

```
query ($network: evm_network, $address: String!, $limit: Int) {
  EVM(network: $network, dataset: combined) {
    BalanceUpdates(
      orderBy: {descendingByField: "sum"}
      where: {BalanceUpdate: {Address: {is: $address}}}
      limit: {count: $limit}
    ) {
      ChainId
      count
      Currency {
        Symbol
        SmartContract
      }
      sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0.0"})
    }
  }
}
{
  "limit": 11,
  "offset": 0,
  "network": "arbitrum",
  "address": "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
}

```

## Balance History of an Address on Arbitrum

The query returns the 10 most recent balance updates for the address `0xd292c50842fe5e52adfa20d9fe5dd18d00008fe5` on the Arbitrum network. The balance updates will be sorted in descending order by the block timestamp.

You can find the query [here](https://ide.bitquery.io/balance-updates-by-address-Arbitrum)

```
{
  EVM(dataset: combined, network: arbitrum) {
    BalanceUpdates(
      orderBy: {descending: Block_Time}
      where: {BalanceUpdate: {Address: {is: "0xd292c50842fe5e52adfa20d9fe5dd18d00008fe5"}}}
      limit: {count: 10}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      BalanceUpdate {
        Amount
      }
    }
  }
}


```

Each balance update contains the following information:

- `Block`: The block number and timestamp of the block where the balance update occurred.
- `Transaction`: The hash of the transaction that caused the balance update.
- `BalanceUpdate`: The amount of cryptocurrency that was added or subtracted from the balance.

The `orderBy` clause is used to sort the list of balance updates in descending order by the `Block_Time` field.
