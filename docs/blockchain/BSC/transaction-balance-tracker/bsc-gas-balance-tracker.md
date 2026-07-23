---
sidebar_position: 6
title: "BSC Gas Balance Tracker"
description: "BSC Gas Balance Tracker: stream BNB Chain balance changes with reason codes using Bitquery GraphQL subscriptions. Works with WebSocket live subscriptions."
---
# BSC Gas Balance Tracker

The BSC Gas Balance Tracker API provides real-time balance updates related to Gas Fee activities, including transaction fee rewards, monitoring gas fee spent, and other GAS-related balance changes.

## Get Top Gas Fee Collectors

[This](https://ide.bitquery.io/top-gas-fee-collectors-bsc) API endpoint returns the list of top gas fee collectors. We are tracking the Gas Collection Event causing Balance Update by appliying condition on `BalanceChangeReasonCode` to be equal to `5`.

```graphql
query TopGasGainers {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 5}}}
      orderBy: {descendingByField: "gain", descending: Block_Time}
      limitBy: {by: TokenBalance_Address, count: 1}
    ) {
      TokenBalance {
        Address
        Currency {
          Name
          Symbol
          SmartContract
        }
        PreBalance
        PostBalance
      }
      gain: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
    }
  }
}
```

## Track the Balance after Latest Gas Fee Burn

[This](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-an-address-bsc) API endpoint returns the Balance and the Gas Fee burnt for a particular address after the latest Gas Fee Burn Event. We are tracking the Gas Burn Event causing Balance Update by appliying condition on `BalanceChangeReasonCode` to be equal to `6`.

```graphql
query MyQuery {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 6}, Address: {is: "0xYourAddressInput"}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD"
      )
    }
  }
}
```

## Track the Balance after Latest Gas Fee Burn for Multiple Addresses

[This](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-multiple-addresses-bsc) API endpoint returns the Balance and the Gas Fee burnt for a list of addresses after the latest Gas Fee Burn Event.

```graphql
query MyQuery {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 6}, Address: {in: ["0xYourAddressInput1", "0xYourAddressInput2"]}}}
      limitBy: {by: TokenBalance_Address count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD"
      )
    }
  }
}
```

## Monitoring Balance after Latest Gas Fee Burn

[This](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream-bsc) stream returns the Balance and the Gas Fee burnt for a particular address in real time.

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 6}, Address: {is: "0xYourAddressInput"}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD"
      )
    }
  }
}
```

## Monitoring Balance after Latest Gas Fee Burn for Multiple Addresses

[This](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-multiple-addresses--stream-bsc) stream returns the Balance and the Gas Fee burnt for a list of addresses in real time.

```graphql
query MyQuery {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 6}, Address: {in: ["0xYourAddressInput1", "0xYourAddressInput2"]}}}
      limitBy: {by: TokenBalance_Address count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD"
      )
    }
  }
}
```

## Track the Balance after Latest Gas Return

[This](https://ide.bitquery.io/Latest-balance-after-unused-gas-fee-returned--for-an-address-bsc) API endpoint returns the Balance and the Gas Returned for a particular address after the latest Gas Return Event. We are tracking the Gas Return Event causing Balance Update by appliying condition on `BalanceChangeReasonCode` to be equal to `7`.

```graphql
query MyQuery {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 7}, Address: {is: "0xYourAddressInput"}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```

## Track the Balance after Latest Gas Return for Multiple Addresses

[This](https://ide.bitquery.io/Latest-balance-after-unused-gas-fee-returned--for-multiple-addresses-bsc) API endpoint returns the Balance and the Gas Returned for a list of addresses after the latest Gas Return Event.

```graphql
query MyQuery {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 7}, Address: {in: ["0xYourAddressInput1", "0xYourAddressInput2"]}}}
      limitBy: {by:TokenBalance_Address count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```

## Monitoring Balance after Latest Gas Return

[This](https://ide.bitquery.io/Monitor-balance-after-unused-gas-fee-returned--for-an-address--stream-bsc) stream returns the Balance and the Gas Returned for a particular address in real time.

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 7}, Address: {is: "0xYourAddressInput"}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```

## Monitoring Balance after Latest Gas Return for Multiple Addresses

[This](https://ide.bitquery.io/Monitor-balance-after-unused-gas-fee-returned--for-multiple-addresses--stream-bsc) stream returns the Balance and the Gas Returned for a list of addresses in real time.

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 7}, Address: {in: ["0xYourAddressInput1", "0xYourAddressInput2"]}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      fee_paid: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      fee_paid_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```
