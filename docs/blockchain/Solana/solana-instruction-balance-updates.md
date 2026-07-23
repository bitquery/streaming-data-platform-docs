---
sidebar_position: 3
title: "Solana Instructions Balance Updates API"
description: "Get real time balance & balance updates of a Solana address associated with instruction invocation using Bitquery."
---
# Solana Instructions Balance Updates API

## Latest Solana Instructions Balance Updates

The query below gives you balance update associated with a instruction invocation.

You can run the query [here](https://ide.bitquery.io/balance-updates)

```
query {
  Solana(dataset: realtime) {
    InstructionBalanceUpdates(limit: {count: 10}) {
      BalanceUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}
```

## Latest liquidity locks on Streamflow

Using the below query, you can retrieve latest liquidity locks made using streamflow. Test the query [here](https://ide.bitquery.io/Liquidity-lock-using-instructions-balance-update)

```
{
  Solana {
    InstructionBalanceUpdates(limit: {count: 20}
    where:{
      BalanceUpdate:{
        Currency:{
          Native:false
        }
        Amount:{gt:"0"}
      }
      Instruction:{
        Program:{
          Method:{is:"create"}
          Address:{is:"strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m"}
        }
      }
    }
    ) {
      BalanceUpdate {
        Account {
          Address
          Owner
        }
        Amount
        Currency {
          Name
          Symbol
          MintAddress
          Decimals
        }
        Index
        Amount
        AmountInUSD
        PreBalance
        PreBalanceInUSD
        PostBalance
        PostBalanceInUSD
      }
      Instruction {
        Program {
          Method
          Address
        }
      }
      Transaction {
        Signature
        FeePayer
      }
      Block {
        Time
        Height
      }
    }
  }
}
```
