---
sidebar_position: 3
---

# Miner Rewards

Miner Rewards are the incentives paid out to miners for validating transactions and creating new blocks on the blockchain. You can access Miner Rewards data using the Bitquery API.

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    MinerRewards(limit: {count: 10}, orderBy: {descending: Block_Time}) {
      Reward {
        BurntFees
        Dynamic
        Static
        TxFees
        Total
      }
      Block {
        Time
      }
    }
  }
}
```

**Data**
`MinerRewards`: Returns an array of the top 10 miner rewards on the Ethereum network.

- `Reward`: Returns the details of the miner reward.

  - `BurntFees`: Returns the amount of fees that were burnt
  - `Dynamic`: Returns the amount of dynamic fees.
  - `Static`: Returns the amount of static fees.

  - `TxFees`: Returns the amount of transaction fees.
  - `Total`: Returns the total amount of the miner reward.

- `Block`: Returns the details of the block that the miner reward was received in.

  - `Time`: Returns the time that the block was created.
