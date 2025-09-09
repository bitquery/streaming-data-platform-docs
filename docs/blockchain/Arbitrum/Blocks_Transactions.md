---
sidebar_position: 6
---

# Arbitrum Transactions API

In this section we'll have a look at some examples using the Arbitrum Transactions API.

<head>
<meta name="title" content="Arbitrum Transaction API"/>
<meta name="description" content="The Arbitrum transactions API allows you to query for transactions on the Arbitrum blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index."/>
<meta name="keywords" content="Arbitrum transaction api, Arbitrum transaction python api, Arbitrum transaction details api, Arbitrum transactions scan api, Arbitrum transaction api docs, Arbitrum transaction crypto api, transaction blockchain api, Arbitrum network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="How to get all Transaction details on Arbitrum using Arbitrum Transactions API" />
<meta property="og:description" content="The Arbitrum transactions API allows you to query for transactions on the Arbitrum blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get all Transaction details on Arbitrum using Arbitrum Transactions API" />
<meta property="twitter:description" content="The Arbitrum transactions API allows you to query for transactions on the Arbitrum blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index." />
</head>

## Latest Transactions

The query below retrieves the latest 10 transactions on the Arbitrum network.
You can find the query [here](https://ide.bitquery.io/Latest-Transactions_3)

```
{
  EVM(network: arbitrum, dataset: archive) {
    Transactions(
      limit: {count: 10, offset: 0}
      orderBy: {descending: Block_Time}
      where: {Block: {Date: {since: "2023-07-01", till: "2023-07-15"}}}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Transaction {
        To
        From
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
```

## Latest Transactions From/To a Wallet

To retrieve the latest transactions from or to a specific wallet address we will be using the `any` filter which acts as the OR condition. This query fetches the 10 most recent transactions from/to the specified wallet address, ordered by the block time in descending order.

```
{
  EVM(network: arbitrum, dataset: archive) {
    Transactions(
      limit: {count: 10}
      where: {any: {Transaction: {From: {is: "0x16a92c43b270fbb1916501470f70c42cf6f00326"}, To: {is: "0x16a92c43b270fbb1916501470f70c42cf6f00326"}}}}
      orderBy: {descending: Block_Time}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Transaction {
        To
        From
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


```

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
