---
title: "Solana Blocks API - Slots, Height & Skipped Slots"
sidebar_label: "Solana Blocks API"
description: "Query and stream Solana blocks: slot to timestamp lookup, block height vs slot, transaction counts per block, and detecting skipped slots."
keywords:
  - Solana Blocks API
  - Solana slot to timestamp
  - Solana block height vs slot
  - skipped slots Solana
  - Solana block stream
  - Solana TxCount per block
  - Solana chain tip
---

# Solana Blocks API

The `Blocks` cube is the chain's clock. Use it to convert a slot to a timestamp, watch the
chain tip, measure throughput, or detect skipped slots.

```
Block {
  Slot          the slot this block occupies
  Height        block height (not the same number as Slot, see below)
  ParentSlot    the slot of the previous block
  Time          block timestamp
  Date          block date
  Hash          block hash
  ParentHash    previous block hash
  TxCount       transactions in the block
  RewardsCount  reward entries in the block
}
```

## Slot is not height

This trips people up constantly, so it is worth stating plainly: on Solana `Slot` and `Height`
are different numbers, and the gap between them grows over time.

A slot is a scheduled time window for a leader to produce a block. When a leader fails to
produce one, the slot is **skipped**: no block ever exists at that slot, and height does not
advance. Height counts blocks that exist; slot counts opportunities that were scheduled.

If you are storing "block number" for Solana, decide which one you mean. Anything time-based
should key on `Slot`, since it maps to the network's schedule. Anything counting blocks should
use `Height`.

## Latest blocks

```graphql
query LatestSolanaBlocks {
  Solana {
    Blocks(limit: { count: 10 }, orderBy: { descending: Block_Slot }) {
      Block {
        Slot
        Height
        ParentSlot
        Time
        TxCount
        RewardsCount
        Hash
      }
    }
  }
}
```

## Stream the chain tip

`Blocks` is one of the cleaner streams to consume: one message per block, at Solana's block
cadence, with no filter required.

```graphql
subscription SolanaChainTip {
  Solana {
    Blocks {
      Block {
        Slot
        Height
        Time
        TxCount
        ParentSlot
      }
    }
  }
}
```

Useful as a heartbeat. If this stream goes quiet, the problem is your connection or the
network, not your filter, which is a helpful thing to be able to distinguish when a busier
subscription stops delivering.

## Detect skipped slots

`Slot - ParentSlot` is 1 when no slot was skipped. Anything larger means the leader for those
slots produced nothing.

```graphql
subscription SkippedSlots {
  Solana {
    Blocks {
      Block {
        Slot
        ParentSlot
        Time
      }
    }
  }
}
```

Compute the gap client-side:

```js
const skipped = Number(block.Slot) - Number(block.ParentSlot) - 1;
if (skipped > 0) console.log(`${skipped} slot(s) skipped before ${block.Slot}`);
```

A rising skip rate means leaders are failing to produce, which usually shows up as degraded
confirmation times before it shows up anywhere else. It is a cheap network-health signal, and
one you cannot get from trade or transfer data.

## Look up the timestamp for a slot

```graphql
query SlotToTime {
  Solana {
    Blocks(limit: { count: 1 }, where: { Block: { Slot: { eq: "436918084" } } }) {
      Block {
        Slot
        Height
        Time
        TxCount
      }
    }
  }
}
```

Replace the slot with the one you are looking up.

:::note An empty result usually means retention, not a bad slot
If a slot returns no rows, it is most often outside the history your plan retains rather than a
slot that does not exist. Check a recent slot first to confirm the query shape, then widen. A
genuinely skipped slot also returns nothing, so the two cases look identical — use
`ParentSlot` on the surrounding blocks to tell them apart.
:::

## Throughput per day

`TxCount` aggregates, so block and transaction throughput is one query rather than a scan over
transactions.

```graphql
query SolanaDailyThroughput {
  Solana {
    Blocks(limit: { count: 14 }, orderBy: { descending: Block_Date }) {
      Block {
        Date
      }
      blocks: count
      transactions: sum(of: Block_TxCount)
      rewards: sum(of: Block_RewardsCount)
    }
  }
}
```

Dividing `transactions` by `blocks` gives average transactions per block, which is a better
load measure than raw TPS because it is not distorted by skipped slots.

## Related

- [Solana Transactions API](/docs/blockchain/Solana/solana-transactions/)
- [Solana Rewards API](/docs/blockchain/Solana/solana-rewards/)
- [Solana Instructions API](/docs/blockchain/Solana/solana-instructions/)
- [Which cubes support subscriptions](/docs/subscriptions/which-cubes-stream/)
