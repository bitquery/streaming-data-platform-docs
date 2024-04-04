# Solana Transactions


# Subscribe to Recent Transactions

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