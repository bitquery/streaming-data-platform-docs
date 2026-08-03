---
sidebar_position: 3
title: "Solana Instructions Balance Updates API"
description: "Solana Instructions Balance Updates API: fetch current and historical Solana balances with Bitquery GraphQL balance queries."
---
# Solana Instructions Balance Updates API

This cube attaches balance changes to the instruction that caused them. That makes it the
practical way to answer **"which currency moved, and how much"** for any program: the raw
`Instructions` cube returns account addresses and raw integers, while this one returns
`Currency` with symbol and decimals, a signed decimal `Amount`, and `AmountInUSD`.

## Latest Solana Instructions Balance Updates

The query below gives you balance update associated with a instruction invocation.

You can run the query [here](https://ide.bitquery.io/balance-updates)

```graphql
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

```graphql
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

## Stream balance updates for one program

:::caution This cube requires a filter when streaming
`InstructionBalanceUpdates` carries every balance change on Solana. An unfiltered subscription
is dropped by the server with `close code 1013 — client is not consuming messages fast enough`.
Always scope it to a program, token or account. See
[which cubes support subscriptions](/docs/subscriptions/which-cubes-stream/).
:::

Filtering by program gives you a live, currency-resolved feed of everything that program moves.
The example below streams Jupiter Z RFQ fills; swap the address for the program you care about.

```graphql
subscription ProgramBalanceUpdates {
  Solana {
    InstructionBalanceUpdates(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: { Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" } }
        }
        BalanceUpdate: { Currency: { Native: false } }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      BalanceUpdate {
        Amount
        AmountInUSD
        Currency { Symbol MintAddress Decimals }
        Account { Address Token { Owner } }
      }
    }
  }
}
```

Negative `Amount` is the sender's leg, positive is the receiver's. `Account.Token.Owner` tells
you which wallet each leg belongs to.

:::note Native SOL legs
`Currency: { Native: false }` keeps the SPL token legs and drops lamport noise. When one side
of a trade is native SOL, that side disappears from the results. Remove the filter to catch it,
but expect a native SOL leg to emit both a lamport movement and a WSOL token update for the
same value, so do not sum them.
:::
