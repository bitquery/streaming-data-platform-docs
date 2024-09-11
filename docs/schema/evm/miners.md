---
title:  EVM Miner Rewards API
---


<head>
<meta name="title" content="EVM Miner Rewards API"/>
<meta name="description" content= "EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain."/>
<meta name="keywords" content="EVM api, EVM balance, EVM balance history, EVM python api, EVM nft api, EVM scan api, EVM matic api, EVM api docs, EVM crypto api, EVM blockchain api,matic network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="EVM Miner Rewards API" />
<meta property="og:description" content="EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="EVM Miner Rewards API" />
<meta property="twitter:description" content="EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain." />
</head>

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
