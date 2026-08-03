---
title: "Solana Fee Anatomy - Base, Priority and Jito Tips"
sidebar_label: "Solana fee anatomy"
description: "Break a Solana transaction fee into base fee and priority fee, find what a wallet spends on fees, and understand why Jito tips are not part of the fee."
keywords:
  - Solana fee anatomy
  - Solana priority fee
  - Solana base fee lamports
  - Jito tip vs fee
  - Solana transaction cost API
  - priority fee distribution
---

# Solana fee anatomy

A Solana transaction costs money in up to three ways, and only two of them appear in
`Transaction.Fee`:

| Component | In `Transaction.Fee`? | What it is |
|---|---|---|
| **Base fee** | Yes | 5,000 lamports per signature, fixed by the protocol |
| **Priority fee** | Yes | compute unit price × compute units requested, set by the sender |
| **Jito tip** | **No** | a normal SOL transfer to a Jito tip account |

That third row is the one that causes miscounting. A Jito tip is a transfer instruction, not a
fee, so it never shows up in `Fee`. Add it separately from
[the Jito Bundle API](/docs/blockchain/Solana/Solana-Jito-Bundle-api/) if you want true
all-in cost.

## Splitting base from priority

The cube exposes the total `Fee` but not its components, so you derive the split. Base fee is
5,000 lamports per signature, so for a single-signature transaction:

```
priority_lamports = fee_lamports - 5000
```

```js
const feeLamports = Math.round(Number(tx.Fee) * 1e9);
const signatures  = 1;                       // see the caveat below
const baseFee     = 5000 * signatures;
const priorityFee = Math.max(0, feeLamports - baseFee);
```

:::caution Signature count is not exposed, so the split is inexact
`Transactions` does not return the number of signatures, and a two-signature transaction with
no priority fee costs exactly the same as a one-signature transaction paying 5,000 lamports of
priority. In a sample of recent successful transactions, fees cluster hard on 5,000 and 10,000
lamports, which are one and two signatures at zero priority.

Treat `fee - 5000` as an **upper bound** on the priority fee for an unknown transaction, and as
exact only where you know the transaction is single-signature.
:::

## How much priority is actually being paid

Quantiles answer this in one query, without pulling rows:

```graphql
query SolanaFeeDistribution {
  Solana {
    Transactions(where: { Transaction: { Result: { Success: true } } }, limit: { count: 1 }) {
      transactions: count
      p25: quantile(of: Transaction_Fee, level: 0.25)
      median: median(of: Transaction_Fee)
      p75: quantile(of: Transaction_Fee, level: 0.75)
      p99: quantile(of: Transaction_Fee, level: 0.99)
      maxFee: quantile(of: Transaction_Fee, level: 0.999)
    }
  }
}
```

The shape of the answer is consistent even as the numbers move: the median sits **at the base
fee**, the quartiles sit at or barely above it, and the distribution only lifts in the last
percentile or two. Most Solana transactions pay no meaningful priority fee at all; a small
minority bidding for block position accounts for nearly all of the priority spend.

This matters when you size a fee strategy. Comparing your fee against the mean puts you against
a number dragged upward by a handful of bots. Compare against the median and the p99 instead,
and decide which population you are competing with.

## Transactions that paid real priority

Filter on `Fee` to isolate the bidders:

```graphql
query HighPriorityTransactions {
  Solana {
    Transactions(
      where: { Transaction: { Result: { Success: true }, Fee: { gt: "0.0001" } } }
      orderBy: { descending: Block_Time }
      limit: { count: 25 }
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Fee
        FeeInUSD
        FeePayer
        InstructionsCount
      }
    }
  }
}
```

`0.0001` SOL is 100,000 lamports, twenty times the base fee, so anything returned is paying to
be included early rather than merely to be included.

## What a wallet spends on fees

Group by `FeePayer` to rank fee spend, which is a good proxy for who is running bots:

```graphql
query TopFeePayers {
  Solana {
    Transactions(
      where: { Transaction: { Result: { Success: true } } }
      orderBy: { descendingByField: "totalFee" }
      limit: { count: 25 }
    ) {
      Transaction {
        FeePayer
      }
      totalFee: sum(of: Transaction_Fee)
      totalFeeUsd: sum(of: Transaction_FeeInUSD)
      transactions: count
      avgFee: average(of: Transaction_Fee)
    }
  }
}
```

Drop the success filter and add `Transaction { Result { Success } }` to the selection to see how
much of a payer's spend goes on transactions that never landed.

## Failed transactions still cost money

Grouping by result is the query most worth running once:

```graphql
query FeeSpentOnFailures {
  Solana {
    Transactions(limit: { count: 4 }) {
      Transaction {
        Result {
          Success
        }
      }
      transactions: count
      totalFee: sum(of: Transaction_Fee)
      avgFee: average(of: Transaction_Fee)
    }
  }
}
```

Two things fall out of it, and both hold across runs:

- **Failed transactions pay a higher average fee than successful ones.** That is not a paradox.
  Priority fees are highest exactly where competition is fiercest, and most racers lose.
- **A substantial share of all fees paid on Solana is spent on transactions that fail.** If you
  are estimating the cost of a strategy from successful transactions alone, you are
  understating it, and the gap widens the more aggressively you bid.

This is also the honest counterweight to any landing-rate comparison: a venue that fails often
is not merely slower, it is charging you for the failures.

## Related

- [Jito Bundle API](/docs/blockchain/Solana/Solana-Jito-Bundle-api/) — tips, which sit outside `Fee`
- [Solana Fees API](/docs/blockchain/Solana/solana_fees_api/) — fees attached to trades and transfers
- [Solana Transactions API](/docs/blockchain/Solana/solana-transactions/)
- [Solana Blocks API](/docs/blockchain/Solana/solana-blocks-api/)
