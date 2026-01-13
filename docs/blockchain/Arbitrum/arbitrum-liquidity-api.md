---
sidebar_position: 4
---

# Arbitrum Liquidity API

In this section we will see how to get Arbitrum DEX pool liquidity information using Bitquery API. The liquidity API helps you monitor real-time liquidity changes, track pool reserves, and analyze liquidity depth for token pairs on Arbitrum DEX pools.

<head>
<meta name="title" content="Arbitrum DEX Pool Liquidity Data with Arbitrum Liquidity API"/>
<meta name="description" content="Get real-time liquidity and pool reserve data for Arbitrum DEX pools through our Liquidity API."/>
<meta name="keywords" content="Arbitrum liquidity api, Arbitrum DEX pool api, Arbitrum pool reserves api, Arbitrum liquidity monitoring api, Arbitrum DEX api, Arbitrum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Arbitrum DEX Pool Liquidity Data with Arbitrum Liquidity API"
/>
<meta
  property="og:description"
  content="Get real-time liquidity and pool reserve data for Arbitrum DEX pools through our Liquidity API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Arbitrum DEX Pool Liquidity Data with Arbitrum Liquidity API" />
<meta property="twitter:description" content="Get real-time liquidity and pool reserve data for Arbitrum DEX pools through our Liquidity API." />
</head>

## Understanding Liquidity and Pool Reserves

Liquidity in DEX pools refers to the amount of tokens available for trading. Pool reserves (the balance of each token in the pool) determine the pool's ability to handle trades without significant price impact. Monitoring liquidity changes helps you:

- Track when liquidity is added or removed from pools
- Monitor pool health and depth
- Identify liquidity events that may affect trading
- Analyze liquidity patterns across different pools

The DEXPoolEvents API provides real-time information about:

- Current liquidity reserves for both tokens in the pool
- Spot prices for both swap directions
- Pool and token pair information
- Transaction details for liquidity-changing events

For a comprehensive explanation of how DEX pools work, liquidity calculations, and when pool events are emitted, refer to the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/).

## Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Arbitrum. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

You can find the query [here](https://ide.bitquery.io/realtime-liquidity-stream_1)

```graphql
subscription MyQuery {
  EVM(network: arbitrum) {
    DEXPoolEvents {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          CurrencyA {
            Name
            SmartContract
            Symbol
          }
          CurrencyB {
            Name
            SmartContract
            Symbol
          }
          PoolId
          SmartContract
        }
      }
      Transaction {
        Gas
        Hash
      }
    }
  }
}
```

## Latest Liquidity Changes of a Specific Pool

This query retrieves the latest liquidity events for a specific DEX pool on Arbitrum. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

You can find the query [here](https://ide.bitquery.io/latest-liquidity-changes-of-a-specific-pool)

```graphql
query MyQuery {
  EVM(network: arbitrum) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: {
            SmartContract: { is: "0xff74c74359016e5e0deb882d6537c8271e3d1026" }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          CurrencyA {
            Name
            SmartContract
            Symbol
          }
          CurrencyB {
            Name
            SmartContract
            Symbol
          }
          PoolId
          SmartContract
        }
      }
      Transaction {
        Gas
        Hash
      }
    }
  }
}
```

> **Note:** Replace `"0xff74c74359016e5e0deb882d6537c8271e3d1026"` with your target pool address. This query can be converted to a subscription to monitor in real-time. Simply replace `query` with `subscription` to receive live updates whenever the pool's liquidity changes.

## Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Arbitrum. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

You can find the query [here](https://ide.bitquery.io/realtime-liquidity-stream-of-a-specific-pool)

```graphql
subscription MyQuery {
  EVM(network: arbitrum) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            SmartContract: { is: "0xff74c74359016e5e0deb882d6537c8271e3d1026" }
          }
        }
      }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          CurrencyA {
            Name
            SmartContract
            Symbol
          }
          CurrencyB {
            Name
            SmartContract
            Symbol
          }
          PoolId
          SmartContract
        }
      }
      Transaction {
        Gas
        Hash
      }
    }
  }
}
```

## Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Arbitrum. Here we have taken example of Uniswap V4.

You can find the query [here](https://ide.bitquery.io/latest-liquidity-changes-in-uniswap-v4-pools)

```graphql
subscription MyQuery {
  EVM(network: arbitrum) {
    DEXPoolEvents(
      where: { PoolEvent: { Dex: { ProtocolName: { is: "uniswap_v4" } } } }
    ) {
      Block {
        Time
        Number
      }
      PoolEvent {
        AtoBPrice
        BtoAPrice
        Dex {
          SmartContract
          ProtocolName
        }
        Liquidity {
          AmountCurrencyA
          AmountCurrencyB
        }
        Pool {
          CurrencyA {
            Name
            SmartContract
            Symbol
          }
          CurrencyB {
            Name
            SmartContract
            Symbol
          }
          PoolId
          SmartContract
        }
      }
      Transaction {
        Gas
        Hash
      }
    }
  }
}
```

> **Important Note:** In Uniswap V4, all pools' liquidity is stored in the PoolManager contract, so the DEX smart contract address will be the same (`0x360e68faccca8ca495c1b759fd9eee466db9fb32`) for all pairs. Use `PoolId` to differentiate between different pools. The `PoolId` field uniquely identifies each pool within the PoolManager.

## Realtime Liquidity Data via Kafka Streams

Liquidity data can also be obtained via Kafka streams for lower latency and better reliability. The Kafka topic for Arbitrum DEX pools is:

**`arbitrum.dexpools.proto`**

Kafka streams provide the same liquidity data as GraphQL subscriptions but with several advantages:

- Lower latency due to shorter data pipeline
- Better reliability with persistent connections
- Ability to read from latest offset without gaps
- Better scalability with multiple consumers

For detailed information on how to connect to Kafka streams, subscribe to topics, and parse messages, refer to the [Kafka Streaming Concepts documentation](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

> **Note:** IDE credentials will not work with Kafka Streams. You need separate Kafka credentials. Please contact sales on our official telegram channel or fill out the [form on our website](https://bitquery.io/forms/api).

## Understanding the Response

The `DEXPoolEvents` API response contains the following information:

- **`PoolEvent`**: Pool event information

  - **`Liquidity`**: Current pool reserves
    - `AmountCurrencyA`: Current balance of CurrencyA in the pool (in raw units)
    - `AmountCurrencyB`: Current balance of CurrencyB in the pool (in raw units)
  - **`AtoBPrice`**: Current spot price for swapping CurrencyA to CurrencyB
  - **`BtoAPrice`**: Current spot price for swapping CurrencyB to CurrencyA
  - **`Pool`**: Pool information
    - `SmartContract`: Pool contract address
    - `PoolId`: Unique pool identifier
    - `CurrencyA`: First token in the pair (name, symbol, smart contract address)
    - `CurrencyB`: Second token in the pair (name, symbol, smart contract address)
  - **`Dex`**: DEX protocol information
    - `SmartContract`: DEX router/factory contract address
    - `ProtocolName`: Protocol name (e.g., Uniswap V2, Uniswap V3, Uniswap V4)

- **`Block`**: Block information when the liquidity event occurred

  - `Time`: Timestamp of the block
  - `Number`: Block number

- **`Transaction`**: Transaction information
  - `Hash`: Transaction hash
  - `Gas`: Gas used for the transaction

For more details on when new pool events are emitted and how liquidity is calculated, see the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/#when-is-a-new-dexpool-record-emitted-in-the-apis--streams).

## Use Cases

### Real-Time Liquidity Monitoring

Use the liquidity API to monitor pool reserves in real-time:

- Track when large amounts of liquidity are added or removed
- Monitor pool health and detect potential liquidity issues
- Alert on significant liquidity changes that may affect trading

### Liquidity Depth Analysis

Analyze which pools have sufficient liquidity for your needs:

- Compare liquidity reserves across different pools
- Identify pools with deep liquidity for large trades
- Monitor liquidity trends over time

### Trading Applications

#### Pre-Trade Liquidity Checks

Before executing large trades, check current pool reserves:

- Verify sufficient liquidity exists for your trade size
- Monitor liquidity changes that may affect execution
- Identify optimal pools with best liquidity depth

#### Liquidity Event Detection

Track liquidity events that may create trading opportunities:

- Detect when new liquidity is added to pools
- Monitor liquidity removals that may signal pool abandonment
- Identify pools experiencing rapid liquidity growth

For more advanced use cases, refer to the [DEXPools Cube documentation](https://docs.bitquery.io/docs/cubes/evm-dexpool/#advanced-use-cases-and-processing-patterns).
