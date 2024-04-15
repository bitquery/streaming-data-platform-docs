---
sidebar_position: 1
---

# Solana Balance & Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Solana blockchain

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Get Latest Balance Updates

The query will subscribe you to real-time updates for balance changes on the Solana blockchain, providing a continuous stream of data as new transactions are processed and recorded.
You can find the query [here](https://ide.bitquery.io/Solana-Balance-Updates)

```
subscription {
  Solana {
    InstructionBalanceUpdates(limit: {count: 10}) {
      Transaction {
        Index
        FeePayer
        Fee
        Signature
        Result {
          Success
          ErrorMessage
        }
      }
      Instruction {
        InternalSeqNumber
        Index
        CallPath
        Program {
          Address
          Name
          Parsed
        }
      }
      Block {
        Time
        Hash
        Height
      }
      BalanceUpdate {
        Account {
          Address
        }
        Amount
        Currency {
          Decimals
          CollectionAddress
          Name
          Key
          IsMutable
          Symbol
        }
      }
    }
  }
}

```

## Get Balance Updates of a Particular Wallet

To focus on the balance changes of a particular Solana wallet, this query filters the data stream to include only those updates relevant to the specified address. This is especially useful for wallet owners or services tracking specific accounts.

```
subscription {
  Solana {
    InstructionBalanceUpdates(
      limit: {count: 10}
      where: {BalanceUpdate: {Account: {Address: {is: "68sMd16LafqLfyS7ejieyWhMsAwKgywVKvSEumvK1RUp"}}}}
    ) {
      Transaction {
        Index
        FeePayer
        Fee
        Signature
        Result {
          Success
          ErrorMessage
        }
      }
      Instruction {
        InternalSeqNumber
        Index
        CallPath
        Program {
          Address
          Name
          Parsed
        }
      }
      Block {
        Time
        Hash
        Height
      }
      BalanceUpdate {
        Account {
          Address
        }
        Amount
        Currency {
          Decimals
          CollectionAddress
          Name
          Key
          IsMutable
          Symbol
        }
      }
    }
  }
}

```

## Track NFT Balance Updates in Real-Time

For those interested in the NFT market, this query is tailored to track balance updates involving non-fungible tokens (NFTs) on the Solana blockchain.

You can find the query [here](https://ide.bitquery.io/Solana-NFT-Balance-Updates)

```
subscription {
  Solana {
    InstructionBalanceUpdates(
      limit: {count: 10}
      where: {BalanceUpdate: {Currency: {Fungible: false}}}
    ) {
      Transaction {
        Index
        FeePayer
        Fee
        Signature
        Result {
          Success
          ErrorMessage
        }
      }
      Instruction {
        InternalSeqNumber
        Index
        CallPath
        Program {
          Address
          Name
          Parsed
        }
      }
      Block {
        Time
        Hash
        Height
      }
      BalanceUpdate {
        Account {
          Address
          Token {
            Owner
          }
        }
        Amount
        Currency {
          Decimals
          CollectionAddress
          Name
          Key
          IsMutable
          Symbol
        }
      }
    }
  }
}

```

## Latest Balance of an Address on Solana

The query will subscribe you to real-time updates for balance changes on the Solana blockchain for the address `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8`, The `PreBalance` and `PostBalance` functions are used here to get the balance.
You can find the query [here](https://ide.bitquery.io/Balance-of-the-raydium-liquidity-pool-address)

```
subscription {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Account: {Address: {is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"}}}}
    ) {
      BalanceUpdate {
        Account {
          Address
        }
        Amount
        Currency {
          Decimals
          CollectionAddress
          Name
          Key
          IsMutable
          Symbol
        }
        PreBalance
        PostBalance
      }
    }
  }
}


```