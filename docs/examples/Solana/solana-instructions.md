---
sidebar_position: 3
---

# Solana Instructions API

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Latest Solana Instructions

The subscription below fetches the latest instructions executed on the Solana blockchain including details like indices of preceding instructions signer, signature, balance updates, and program details 

You can run the query [here](https://ide.bitquery.io/Latest-Solana-Instructions)

```
subscription {
  Solana(network: solana) {
    Instructions(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Transaction {
        Signer
        Signature
        Result {
          Success
          ErrorMessage
        }
        Index
      }
      Instruction {
        Logs
        BalanceUpdatesCount
        AncestorIndexes
        TokenBalanceUpdatesCount
        Program {
          Name
          Method
        }
      }
      Block {
        Time
        Hash
      }
    }
  }
}

```