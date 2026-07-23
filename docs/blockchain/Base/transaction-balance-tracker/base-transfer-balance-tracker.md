---
sidebar_position: 7
title: "Base Transfer Balance Tracker"
description: "Base Transfer Balance Tracker: monitor Base native and token transfers in real time with Bitquery GraphQL APIs. Copy GraphQL snippets for production apps."
---
# Base Transfer Balance Tracker

The Base Transfer Balance Tracker API provides real-time balance updates for all addresses involved in Transfers on the Base blockchain, and provides option to filter out based on the direction of transfer you want to target. The Base Transfer Balance is tracked by marking the the `BalanceUpdateReason` equals `10`.

:::note
The queries covered this section are only valid for the Native Currency Transfer.
:::

## Get Balance Info for an Address after Transfer

[This](https://ide.bitquery.io/balance-update-from-transfer-for-an-address-base) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a particular address after a transfer, irrespective of the direction of transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM(network: base) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {is: "0xYourAddressInput"}}}
      orderBy: {descending: Block_Time}
      limit: {count: 1}
    ) {
      Block {
        Time
      }
      TokenBalance {
        PostBalance
        PostBalanceInUSD
        PreBalance
        PreBalanceInUSD
      }
      amt: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      amt_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
      Transaction {
        From
        To
      }
    }
  }
}
```
</details>

## Stream Balance Info for Transfer in Real Time

[This](https://ide.bitquery.io/balance-update-from-transfer-for-an-address--stream-base) subscription allows us to stream Balance Updates for an address due to transfer in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM(network: base) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {is: "0xYourAddressInput"}}}
    ) {
      Block {
        Time
      }
      TokenBalance {
        PostBalance
        PostBalanceInUSD
        PreBalance
        PreBalanceInUSD
      }
      amt: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      amt_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
      Transaction {
        From
        To
      }
    }
  }
}
```
</details>
