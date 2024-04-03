# Solana Balance Updates

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