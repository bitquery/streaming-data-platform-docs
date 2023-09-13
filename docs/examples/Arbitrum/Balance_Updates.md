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
