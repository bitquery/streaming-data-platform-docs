---
sidebar_position: 6
---

<head>
<meta name="title" content="How to get all Transaction details on Solana using Solana Transactions API"/>
<meta name="description" content="The Solana transactions API allows you to query for transactions on the Solana blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index."/>
<meta name="keywords" content="solana transaction api, solana transaction python api, solana transaction details api, solana transactions scan api, solana transaction api docs, solana transaction crypto api, transaction blockchain api, solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="How to get all Transaction details on Solana using Solana Transactions API" />
<meta property="og:description" content="The Solana transactions API allows you to query for transactions on the Solana blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get all Transaction details on Solana using Solana Transactions API" />
<meta property="twitter:description" content="The Solana transactions API allows you to query for transactions on the Solana blockchain. You can use this API to get information about specific transactions, such as the signature, block, transaction fee, success, fee payer, inner instructions count, instructions count, signer, and transaction index." />
</head>

# Solana Transactions API

In this section we'll have a look at some examples using the Solana Transactions API.
This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

# Subscribe to Recent Transactions

The subscription query below fetches the most recent transactions on the Solana blockchain
You can find the query [here](https://ide.bitquery.io/Realtime-Solana-Transactions)

```
subscription {
  Solana {
    Transactions(limit: {count: 10}) {
      Block {
        Time
        Hash
      }
      Transaction {
        BalanceUpdatesCount
        Accounts {
          Address
          IsWritable
        }
        Signer
        Signature
        Result {
          Success
          ErrorMessage
        }
        Index
        Fee
        TokenBalanceUpdatesCount
        InstructionsCount
      }
    }
  }
}

```
