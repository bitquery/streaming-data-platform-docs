---
sidebar_position: 7
---

# Ethereum Transfer Balance Tracker

The Ethereum Transfer Balance Tracker API provides real-time balance updates for all addresses involved in Transfers on the Ethereum blockchain, and provides option to filter out based on the direction of transfer you want to target. The Ethereum Transfer Balance is tracked by marking the the `BalanceUpdateReason` equals `10`.

:::note
The queries covered this section are only valid for the Native Currency Transfer.
:::

<head>
<meta name="title" content="Ethereum Transfer Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to get real-time balance updates for all addresses in Ethereum transfers with balance change reasons using Bitquery's Transfer Balance API."/>
<meta name="keywords" content="ethereum transfer balance api, eth balance streams, ethereum balance api, balance change reason, transfer balance python api, ethereum transfer balance, balance updates api, ethereum network api, ethereum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Transfer Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to get real-time balance updates for all addresses in Ethereum transfers with balance change reasons using Bitquery's Transfer Balance API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Transfer Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to get real-time balance updates for all addresses in Ethereum transfers with balance change reasons using Bitquery's Transfer Balance API." />
</head>

## Get Balance Info for an Address after Transfer

[This](https://ide.bitquery.io/balance-update-from-transfer-for-an-address#) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a particular address after a transfer, irrespective of the direction of transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
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

[This](https://ide.bitquery.io/balance-update-from-transfer-for-an-address--stream#) subscription allows us to stream Balance Updates for an address due to transfer in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
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

## Get Balance Info for Multiple Addresses after Transfer

[This](https://ide.bitquery.io/balance-update-from-transfer-for-multiple-addresses#) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a list of addresses after a transfer, irrespective of the direction of transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
      orderBy: {descending: Block_Time}
      limitBy: {by:TokenBalance_Address count: 1}
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

## Stream Balance Update due to Transfer for Multiple Addresses in Real Time

[This](https://ide.bitquery.io/balance-update-from-transfer-for-multiple-addresses--stream#) subscription allows us to stream Balance Updates for a list of addresses due to transfer in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
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

## Get Balance Info for an Address after Transfer Sent

[This](https://ide.bitquery.io/Balance-update-after-transfer-sent_2) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a particular address after it sends a transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {From: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
      orderBy: {descending: Block_Time}
      limit: {count: 1}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Stream Balance Info for Transfer Sent in Real Time

[This](https://ide.bitquery.io/Balance-update-after-transfer-sent--stream_3) subscription allows us to stream Balance Updates for a transfer sent by an address in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {From: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Get Balance Info for Multiple Addresses after Transfer Sent

[This](https://ide.bitquery.io/Balance-update-after-transfer-sent-from-multiple-addresses) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a list of addresses after they send a transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {From: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
      orderBy: {descending: Block_Time}
      limitBy: {by:Transaction_From count: 1}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Stream Balance Info for Transfer Sent in Real Time

[This](https://ide.bitquery.io/Balance-update-after-transfer-sent-from-multiple-addresses--stream#) subscription allows us to stream Balance Updates for a list of addresses due to transfer sent in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {From: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>


## Get Balance Info for an Address after Transfer Recieved

[This](https://ide.bitquery.io/Balance-update-after-transfer-received_1) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a particular address after it recieves a transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {To: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
      orderBy: {descending: Block_Time}
      limit: {count: 1}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Stream Balance Info for Transfer Recieved in Real Time

[This](https://ide.bitquery.io/Balance-update-after-transfer-received--stream) subscription allows us to stream Balance Updates for a transfer recieved by an address in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {To: {is: "0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e"}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Get Balance Info for Multiple Addresses after Transfer Recieved

[This](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses_2) query returns the Balance Info such as PreBalance, PostBalance, Balances in USD and transfer amount for a list of addresses after they recieve a transfer.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {To: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
      orderBy: {descending: Block_Time}
      limitBy: {by:Transaction_To count: 1}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Stream Balance Info for Transfer Recieved in Real Time

[This](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses--stream) subscription allows us to stream Balance Updates for a list of addresses due to transfer recieved in Real Time.

<details>
<summary>Click here to expand</summary>
```graphql
subscription {
  EVM {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}}, Transaction: {To: {in: ["0xafd8cd311c7bf2635573ebebb97c1a3c7e90f00e", "0x5b43453fce04b92e190f391a83136bfbecedefd1"]}}}
    ) {
      Block{
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction{
        From
        To
        Hash
      }
      amount:calculate(expression: "$TokenBalance_PreBalance - $TokenBalance_PostBalance")
      amount_usd:calculate(expression: "$TokenBalance_PreBalanceInUSD - $TokenBalance_PostBalanceInUSD")
    }
  }
}
```
</details>

## Get Balance Updates for the Last 24 hours

Use [this](https://ide.bitquery.io/Balance-Updates-for-transfer-in-last-24-hours) API endpoint for getting Balance Updates due to Transfers for a particular address irrespective of the direction of Transfer. This could be used in applications that maintains a record for a wallet.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {is: "0xdadb0d80178819f2319190d340ce9a924f783711"}}, Block: {Time: {since_relative: {hours_ago: 24}}}}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction {
        From
        To
        Hash
      }
      transfer_amount: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      transfer_amount_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```
</details>

## Get Balance Updates for the Last 24 hours

Use [this](https://ide.bitquery.io/Balance-Updates-for-multiple-addresses-transfer-in-last-24-hours) API endpoint for getting Balance Updates due to Transfers for a list of addresses irrespective of the direction of Transfer. This could be used in Dashboard Applications that shows record for multiple wallets.

<details>
<summary>Click here to expand</summary>
```graphql
query MyQuery {
  EVM(network: eth) {
    TransactionBalances(
      where: {TokenBalance: {BalanceChangeReasonCode: {eq: 10}, Address: {in: ["0xdadb0d80178819f2319190d340ce9a924f783711", "0x396343362be2a4da1ce0c1c210945346fb82aa49"]}}, Block: {Time: {since_relative: {hours_ago: 24}}}}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      TokenBalance {
        PreBalance
        PostBalance
        PreBalanceInUSD
        PostBalanceInUSD
      }
      Transaction {
        From
        To
        Hash
      }
      transfer_amount: calculate(
        expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance"
      )
      transfer_amount_usd: calculate(
        expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD"
      )
    }
  }
}
```
</details>

## Get Historical Balance of an Address
