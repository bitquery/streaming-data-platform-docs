---
sidebar_position: 1
---

# Photon Solana API

This section will guide you through different APIs which will tell you how to get data like realtime trades just like how Photon shows for Solana.

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

import VideoPlayer from "../../../src/components/videoplayer.js";

## Latest Trades Routed via Photon

This query retrieves the latest 100 trades that were routed through Photon on Solana.
The query uses a `joinInstructions` function to filter trades that specifically involved Photon's routing program (address: `BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW`). For more information about using joins in Bitquery APIs, see our [graphQL joins documentation](https://docs.bitquery.io/docs/graphql/joins/).

[Run Query](https://ide.bitquery.io/Trades-Executed-on-Photon)

```
{
  Solana {
    DEXTrades(limit: {count: 100}, orderBy: {descending: Block_Time}) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
      joinInstructions(
        join: inner
        Block_Slot: Block_Slot
        Transaction_Signature: Transaction_Signature
        where: {Instruction: {Program: {Address: {is: "BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW"}}}}
      ) {
        Instruction {
          Program {
            Address
          }
        }
        Transaction {
          Signature
        }
      }
    }
  }
}


```

## Get Trade Transactions Of Photon For A Particular Pair

The query will get latest trades for a Solana pair executed via Photon
You can find the query [here](https://ide.bitquery.io/Trades-of-a-Pair-Executed-on-Photon)

```
{
  Solana {
    DEXTrades(
      limit: {count: 100}
      orderBy: {descending: Block_Time}
      where: {Trade: {Market:{MarketAddress:{is:"FsKeY7bWnGL3ucTVfWWWJZyGCqr1VGXbKVZWteUHPYzX"}}}}
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Buy {
          Currency {
            Symbol
          }
          Amount
          AmountInUSD
          Account {
            Address
          }
          Price
          PriceInUSD
        }
        Market {
          MarketAddress
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
      joinInstructions(
        join: inner
        Block_Slot: Block_Slot
        Transaction_Signature: Transaction_Signature
        where: {Instruction: {Program: {Address: {is: "BSfD6SHZigAfDWSjzD5Q41jw8LmKwtmjskPH9XW1mrRW"}}}}
      ) {
        Instruction {
          Program {
            Address
          }
        }
        Transaction {
          Signature
        }
      }
    }
  }
}

```

