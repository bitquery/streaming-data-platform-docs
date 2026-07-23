---
title: "Robinhood Transfers"
description: "Query and stream token transfers on Robinhood with Bitquery EVM Transfers APIs. Track senders, receivers, amounts, and token metadata in real time and historically."
sidebar_position: 2
keywords:
  - Robinhood transfers API
  - Robinhood token transfers
  - EVM Transfers Robinhood
  - Robinhood wallet transfers
  - Robinhood token transfers api
  - Robinhood wallet transfers api
---

# Robinhood Transfers

Bitquery exposes **Robinhood** transfer data through the **EVM Transfers** APIs. Use `network: robinhood` on the `EVM` root to scope queries and subscriptions to Robinhood.

:::tip Related docs
- [ERC20 Token Transfers API (Ethereum)](https://docs.bitquery.io/docs/blockchain/Ethereum/transfers/erc20-token-transfer-api/)
- [EVM Transfers](https://docs.bitquery.io/docs/schema/evm/transfers/)
- [Robinhood Trades](/docs/blockchain/robinhood/robinhood-trades)
:::

---

## Stream Real time Transfers on Robinhood

Stream real time transfers on Robinhood via a GraphQL subscription on `EVM.Transfers`.

▶️ [Run in IDE](https://ide.bitquery.io/real-time-transfers-on-robinhood)

```graphql
subscription {
  EVM(network: robinhood) {
    Transfers {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
          Native
        }
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Number
        Time
      }
    }
  }
}
```

---

## Latest Transfers on Robinhood

Query the most recent transfers on Robinhood that contains details such as transfer amount, amount in USD, token details, sneder and reciever address, tansfer time and transaction hash.

▶️ [Run in IDE](https://ide.bitquery.io/latest-transfers-on-robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Transfers for a specific token

Bitquery's Robinhood API allows us to fetch latest transfers for a specific token by filtering based on `Transfer.Currency.SmartContract` field.

▶️ [Run in IDE](https://ide.bitquery.io/Transfers-for-a-token-on-robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            SmartContract: { is: "0x0bd7d308f8e1639fab988df18a8011f41eacad73" }
          }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

## Transfers for a Wallet on Robinhood

We can filter out transfers involving a specific wallet, where the target address is either `Transfer.Sender` or `Transfer.Receiver`.

▶️ [Run in IDE](https://ide.bitquery.io/transfers-for-a-wallet-on-Robinhood)

```graphql
{
  EVM(network: robinhood, dataset: realtime) {
    Transfers(
      where: {
        any: [
          {Transfer: {Sender: {is: "0xcaf681a66d020601342297493863e78c959e5cb2"}}}
          {Transfer: {Receiver: {is: "0xcaf681a66d020601342297493863e78c959e5cb2"}}}
        ]
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

---

<!-- ## Historical transfers for a Wallet within Specific Dates

We can get the historical transfers for a wallet using `archive` or `combined` dataset. The below query will find the transfers involving the address which are since the past 2 months and until past one month using filters on `Block_Date`.

If looking for completely historical data then it woulf be best to use `archive` dataset. Use `combined` dataset only in cases where both historical and realtime data is required.

▶️ [Run in IDE](https://ide.bitquery.io/Historical-transfers-for-a-wallet-on-Robinhood)

```graphql
{
  EVM(network: robinhood, dataset: archive) {
    Transfers(
      where: {
        Block: {
          Date: {
            since_relative: {months_ago: 2}
            till_relative: {months_ago: 1}
          }
        }
        any: [
          {Transfer: {Sender: {is: "0xcaf681a66d020601342297493863e78c959e5cb2"}}}
          {Transfer: {Receiver: {is: "0xcaf681a66d020601342297493863e78c959e5cb2"}}}
        ]
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
``` -->
