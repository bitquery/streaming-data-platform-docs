---
sidebar_position: 6
---

# Solana Transactions API

In this section we'll have a look at some examples using the Solana Transactions API.



<head>
<meta name="title" content="Solana Transactions API | Get all Transaction details"/>
<meta name="description" content="Get information about specific transactions such as signature, block, transaction fee, success, fee payer, instructions count, signer, and transaction index."/>
<meta name="keywords" content="solana transaction api, solana transaction python api, solana transaction details api, solana transactions scan api, solana transaction api docs, solana transaction crypto api, transaction blockchain api, solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Solana Transactions API | Get all Transaction details" />
<meta property="og:description" content="Get information about specific transactions such as signature, block, transaction fee, success, fee payer, instructions count, signer, and transaction index." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Transactions API | Get all Transaction details" />
<meta property="twitter:description" content="Get information about specific transactions such as signature, block, transaction fee, success, fee payer, instructions count, signer, and transaction index." />
</head>

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

## Filtering Solana Transactions Based on Dynamic Criteria

In this subscription query we will see how to set dynamic filters for the transactions to be retrieved based on various transaction properties. Developers can monitor specific types of transactions on the Solana network, such as high-volume or high-fee transactions.

You can run the query [here](https://ide.bitquery.io/Solana-tx-dynamic-filter)

#### Variables

- **`$network`**: Specifies the Solana network.
- **`$tx_filter`**: A filter object used to specify the criteria for transactions to retrieve.

```
subscription(
   $network: solana_network
   $tx_filter: Solana_Transaction_Filter
) {
  Solana(network: $network) {
    Transactions(where:$tx_filter) {
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
<!-- Parameters -->

{
  "network": "solana",
  "tx_filter":{"Transaction": {"TokenBalanceUpdatesCount": {"gt": 10}, "FeeInUSD": {"ge": "0.0010"}}}
}

```
