---
sidebar_position: 6
title: "Solana Transactions API"
description: "Solana Transactions API: query and stream Solana on-chain data with Bitquery GraphQL examples for developers. See examples in the Bitquery IDE."
---
import FAQ from "@site/src/components/FAQ";

# Solana Transactions API

In this section we'll have a look at some examples using the Solana Transactions API.

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

<FAQ
  items={[
    { q: "How do I look up a Solana transaction?", a: "Query Solana.Transactions by signature, or filter by account address and block time." },
    { q: "Can I decode instruction data?", a: "Use Solana Instructions and balance update APIs for program-level detail beyond the raw transaction." },
  ]}
/>
