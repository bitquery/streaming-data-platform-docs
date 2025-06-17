---
sidebar_position: 1
---

# How to Filter Events from Solana Logs Using Bitquery APIs and Regular Expressions

In this article, we are going to understand how we can track events like token lock and burn, which are necessary for investors and project teams in the quickly changing crypto space.

Token lockups and token burning provide the project with stability and confidence by restricting token sales or transfers for a certain amount of time and reducing the overall availability. The sudden release of a large number of tokens, however, may result in market instability. Tracking these occurrences allows stakeholders to anticipate market movements and make informed decisions.

Anyone can follow this guide to understand how to use Bitquery APIs to track vested tokens and receive alerts when unlocking events are about to occur.

## ​Understanding Token Minting and Burning

### What is Token Burn ?
Token burning is the process of permanently removing tokens from circulation, reducing the total supply. This mechanism is employed for several reasons.

- Supply Control: By burning tokens, projects can manage and control the token supply, potentially increasing the value of remaining tokens. This is akin to a share buyback in traditional finance, aimed at benefiting holders by reducing supply.
- Economic Stability: Token burning can help stabilize the token's price by creating scarcity. It can also be used as a method to combat inflation within the ecosystem, ensuring long-term sustainability.

### Why Track Token Mint and Burn?​

Tracking token minting and burning is crucial for:
- Investors: Understanding when new tokens are minted or burned helps investors anticipate changes in supply that could impact token prices. This knowledge can guide their investment decisions and trading strategies.
- Project Teams: Monitoring these processes ensures transparency and accountability. Clear communication about minting and burning schedules builds trust with the community and stakeholders, showcasing a commitment to sustainable and responsible token management.

## Key Data Points to Track​

When tracking token mint and burn events, the following data points are essential:
- Token Name and Address: Identify the token in question.
- Method Called: The method called from the token.
- Transaction Signer: The address that called the method in question.
- TimeStamp: UTC Time at which the method is called.
- Transaction Signature: Transaction signature to double check the results.

## Minting Token Method

In decentralized finance (DeFi), tokens are minted to reward participants within the network, to encourage the continued participation and support in the network's growth and security.

### Why It's Important​

Projects often mint tokens to raise capital during initial coin offerings (ICOs) or token sales. These funds are typically used for further development, marketing, and expanding the project's reach.

### How to Track​

Use Bitquery APIs to see when methods that include “mint” are called from the Solana Instruction Logs. This can indicate important moves by project teams or big investors. By monitoring these events, you can gain insights into market behavior and anticipate potential price changes.

### Example Query​

To track token minting, you can use a query shared below. Here’s a sample query to track [token minting](https://ide.bitquery.io/MInt-Token-Tracking-on-Solana-Logs) on the Solana network:

```gql
subscription{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Method: {includes: "mint"}}}}
    ) {
      Transaction {
        Signature
        Signer
      }
      Block {
        Time
      }
      Instruction {
        Logs
        Program {
          Method
          Name
          Address
        }
      }
    }
  }
}
```

This query helps identify token minting events, providing insights into market dynamics.

## Token Burn Method

In decentralized finance (DeFi), tokens are  burnt to manage and control the token supply,potentially increasing the value of remaining tokens.

### How to Track​

Use Bitquery APIs to see when methods that include “burn” are called from the Solana Instruction Logs. This can indicate important moves by project teams or big investors. By monitoring these events, you can gain insights into market behavior and anticipate potential price changes.

### Example Query​

To track token liquidity burn, you can use a query shared below. Here’s a sample query to track [token LP burn](https://ide.bitquery.io/Copy-of-Copy-of-Burn-Token-Tracking-on-Solana-Logs) on the Solana network:

```gql
{
  Solana(network: solana) {
    Instructions(
      where: {Instruction: {Program: {Method: {includes: "burn"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Transaction {
        Signature
        Signer
      }
      Block {
        Time
      }
      Instruction {
        Logs
        Program {
          Method
          Name
          Address
        }
        Accounts {
          Address
          Token {
            Mint
          }
        }
      }
    }
  }
}

```

This query helps identify token burning events, providing insights about the project team's next move and the progress of the project.

## Check the Programs with Paid Royalty

Set up a query to filter out the programs where  some non-zero [royalty is paid](https://ide.bitquery.io/Query-solana-logs) with the help of regular expressions like “includes” and “not includes”. For example:

```gql
query {
  Solana {
    Instructions(where: {
      Instruction: {
        Logs: {
          includes: {
            includes: "royalty_paid"
            notIncludes: "\"royalty_paid\":0"
          }
        }
      }
    }) {
      Transaction {
      	Signature
      }
      Instruction {
        Logs
      }
    }
  }
}
```

This query returns instructions that signal non-zero royalty payment, providing details about transaction hash and instructions logs.

## Tracking trades on an Exchange without knowing anything about it​

If you need to filter out the instructions from Solana logs that involve a particular exchange but you don’t have any information, like address and protocol, then you can use the “includes” keyword on Logs. For example, you can run this query to get the [Solana Zeta Market Logs](https://ide.bitquery.io/Solana-Zeta-Market-logs).

```gql
query {
  Solana {
    Instructions(
      where: {Instruction: {Logs: {includes: {includes: "ZETA"}}}}
      limit: {count: 10}
    ) {
      Transaction {
        Signature
      }
      Instruction {
        Logs
      }
    }
  }
}
```

This query will return the Solana Instructions Logs and transaction signature to double check the results and get more info.  


