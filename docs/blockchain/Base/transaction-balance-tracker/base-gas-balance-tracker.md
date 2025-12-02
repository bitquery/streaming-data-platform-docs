---
sidebar_position: 6
---

# Base Gas Balance Tracker

The Base Gas Balance Tracker API provides real-time balance updates related to Gas Fee activities, including transaction fee rewards, monitoring gas fee spent, and other GAS-related balance changes.

<head>
<meta name="title" content="Base Gas Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to track Base Gas-related balance changes, transaction fee rewards, Gas Fee Spent and GAS Fee returned  using Bitquery's Gas Balance Tracker API."/>
<meta name="keywords" content="base Gas balance, Gas tracker, Gas balance api, transaction fee rewards, Gas burnt, Gas returned, base Gas api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Base Gas Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to track Base Gas-related balance changes, transaction fee rewards, Gas Fee Spent and Gas Fee returned  using Bitquery's Gas Balance Tracker API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Base Gas Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to track Base Gas-related balance changes, transaction fee rewards, Gas Fee Spent and Gas Fee returned  using Bitquery's Gas Balance Tracker API." />
</head>

## Get Top Gas Fee Collectors

[This](https://ide.bitquery.io/top-gas-fee-collectors-base) API endpoint returns the list of top gas fee collectors. We are tracking the Gas Collection Event causing Balance Update by appliying condition on `BalanceChangeReasonCode` to be equal to `5`.

```graphql
query TopGasGainers {
  EVM(network: base) {
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

[This](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-an-address-base_1) API endpoint returns the Balance and the Gas Fee burnt for a particular address after the latest Gas Fee Burn Event. We are tracking the Gas Burn Event causing Balance Update by appliying condition on `BalanceChangeReasonCode` to be equal to `6`.

```graphql
query MyQuery {
  EVM(network: base) {
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

[This](https://ide.bitquery.io/Latest-balance-and-gas-fee-paid-for-multiple-addresses-base) API endpoint returns the Balance and the Gas Fee burnt for a list of addresses after the latest Gas Fee Burn Event.

```graphql
query MyQuery {
  EVM(network: base) {
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

[This](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream-base) stream returns the Balance and the Gas Fee burnt for a particular address in real time.

```graphql
subscription {
  EVM(network: base) {
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


