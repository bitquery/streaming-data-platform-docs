---
sidebar_position: 3
---

# Balance API


The BalanceUpdates API allows you to retrieve the balance updates for a specific token contract on a given network, sorted by different parameters as per your need.

## Top 10 Wallets
Here's an example query to retrieve the top 10 balance updates for a specific token contract on the Binance Smart Chain network:

```
query MyQuery {
  EVM(dataset: realtime, network: bsc) {
    BalanceUpdates(
      orderBy: {descending: BalanceUpdate_Amount}
      limit: {count: 10}
      where: {Currency: {SmartContract: {is: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"}}, Block: {Date: {after: "2023-02-01"}}}
    ) {
      BalanceUpdate {
        Address
        Amount
      }
      Currency {
        Name
      }
    }
  }
}
```
In this query, you'll need to replace "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47" with the contract address of the token you'd like to retrieve balance updates for.
Here's a sample of the response:

```

    "BalanceUpdates": [
      {
        "BalanceUpdate": {
          "Address": "0xba51d1ab95756ca4eab8737ecd450cd8f05384cf",
          "Amount": "980.473690002807400000"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      },
      {
        "BalanceUpdate": {
          "Address": "0x51aa28cf73e5e0abb32deea73ea6e3802beca058",
          "Amount": "97.149127271688019074"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      },
      {
        "BalanceUpdate": {
          "Address": "0xba51d1ab95756ca4eab8737ecd450cd8f05384cf",
          "Amount": "956.556105801253600000"
        },
        "Currency": {
          "Name": "Cardano Token"
        }
      }, 

```
