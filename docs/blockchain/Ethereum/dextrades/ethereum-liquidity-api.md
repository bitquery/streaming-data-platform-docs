---
sidebar_position: 6
---

# Ethereum Liquidity API

In this section we will see how to get Ethereum DEX pool liquidity information using Bitquery API. The liquidity API helps you monitor real-time liquidity changes, track pool reserves, and analyze liquidity depth for token pairs on Ethereum DEX pools.

> **Note:** This API also works for other EVM chains such as Base, BSC, and Arbitrum—just change the network parameters in your request.

<head>
<meta name="title" content="Ethereum DEX Pool Liquidity Data with Ethereum Liquidity API"/>
<meta name="description" content="Get real-time liquidity and pool reserve data for Ethereum DEX pools through our Liquidity API."/>
<meta name="keywords" content="Ethereum liquidity api, ETH liquidity api, Ethereum DEX pool api, Ethereum pool reserves api, Ethereum liquidity monitoring api, Ethereum DEX api, Ethereum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Ethereum DEX Pool Liquidity Data with Ethereum Liquidity API"
/>
<meta
  property="og:description"
  content="Get real-time liquidity and pool reserve data for Ethereum DEX pools through our Liquidity API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Ethereum DEX Pool Liquidity Data with Ethereum Liquidity API" />
<meta property="twitter:description" content="Get real-time liquidity and pool reserve data for Ethereum DEX pools through our Liquidity API." />
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

This subscription query returns real-time liquidity data for all DEX pools on Ethereum. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

You can find the query [here](https://ide.bitquery.io/Realtime-Liquidity-Stream_4#)

```graphql
subscription MyQuery {
  EVM(network: eth) {
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

This query retrieves the latest liquidity events for a specific DEX pool on Ethereum. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

You can find the query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_5#)

```graphql
query MyQuery {
  EVM(network: eth) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
      where: {
        PoolEvent: {
          Pool: {
            SmartContract: { is: "0x9c087eb773291e50cf6c6a90ef0f4500e349b903" }
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

## Get Liquidity of All Pools for a Token

This query returns current liquidity across all pools where a token appears as either `CurrencyA` or `CurrencyB`. It is useful when you want a token-wide liquidity view across multiple pools and DEXes.

You can find the query [here](https://ide.bitquery.io/liquidiy-of-all-token-pools_1)

```graphql
query MyQuery($token: String) {
  EVM {
    DEXPoolEvents(
      where: {
        TransactionStatus: { Success: true }
        any: [
          { PoolEvent: { Pool: { CurrencyA: { SmartContract: { is: $token } } } } }
          { PoolEvent: { Pool: { CurrencyB: { SmartContract: { is: $token } } } } }
        ]
      }
    ) {
      PoolEvent {
        Dex {
          SmartContract
        }
        Liquidity {
          AmountCurrencyA(maximum: Block_Time)
          AmountCurrencyAInUSD(maximum: Block_Time)
          AmountCurrencyB(maximum: Block_Time)
          AmountCurrencyBInUSD(maximum: Block_Time)
        }
        Pool {
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

```json
{
  "token": "0x8eD97a637A790Be1feff5e888d43629dc05408F6"
}
```

## Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Ethereum. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

You can find the query [here](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_4#)

```graphql
subscription MyQuery {
  EVM(network: eth) {
    DEXPoolEvents(
      where: {
        PoolEvent: {
          Pool: {
            SmartContract: { is: "0x9c087eb773291e50cf6c6a90ef0f4500e349b903" }
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

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Ethereum. Here we have taken example of Uniswap V4.

You can find the query [here](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_6#)

```graphql
subscription MyQuery {
  EVM(network: ethereum) {
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

> **Important Note:** In Uniswap V4, all pools' liquidity is stored in the PoolManager contract, so the DEX smart contract address will be the same for all pairs. Use `PoolId` to differentiate between different pools. The `PoolId` field uniquely identifies each pool within the PoolManager.

## Top Liquidity Pools on Ethereum (USDC, WBTC, WETH, USDT)

The following GraphQL query retrieves the top 10 most recent DEX pool events on Ethereum where either side of the pool is one of the major tokens: USDC, WBTC, WETH, or USDT. Pools are filtered so that CurrencyA or CurrencyB is in the following contracts:

- USDC: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
- WBTC: `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599`
- WETH: `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`
- USDT: `0xdac17f958d2ee523a2206206994597c13d831ec7`

Pools are sorted by latest block time and then by the largest dollar value of liquidity for both A and B sides. Only events from the last 2 minutes are retrieved.

You can run and modify this query in the [IDE example](https://ide.bitquery.io/top-liquidity-pools-on-Ethereum).

```graphql
query MyQuery {
  EVM(network: eth) {
    DEXPoolEvents(
      limit: { count: 10 }
      orderBy: [
        { descending: Block_Time }
        { descending: PoolEvent_Liquidity_AmountCurrencyAInUSD }
        { descending: PoolEvent_Liquidity_AmountCurrencyBInUSD }
      ]
      where: {
        any: [
          {
            PoolEvent: {
              Pool: {
                CurrencyA: {
                  SmartContract: {
                    in: [
                      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
                      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                      "0xdac17f958d2ee523a2206206994597c13d831ec7"
                    ]
                  }
                }
              }
            }
          }
          {
            PoolEvent: {
              Pool: {
                CurrencyB: {
                  SmartContract: {
                    in: [
                      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
                      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                      "0xdac17f958d2ee523a2206206994597c13d831ec7"
                    ]
                  }
                }
              }
            }
          }
        ]
        Block: { Time: { since_relative: { minutes_ago: 2 } } }
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
          AmountCurrencyAInUSD
          AmountCurrencyB
          AmountCurrencyBInUSD
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

## Top Liquidity Pools of a token on Ethereum

The following API query retrieves the top liquidity pools where shiba inu (`0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce`) is either token A or token B in the pool on the Base chain. This allows you to identify which pools have the most liquidity for cbBTC, filtered to exclude certain pools if necessary.

This query separates results by whether shiba inu is listed as the first token (`CurrencyA`) or the second token (`CurrencyB`) in the DEX pool, returning the 10 pools with the highest liquidity for each category. Exclusions (e.g., pools you want omitted from the results) are specified in the `SmartContract: {notIn: [...]}` filter.

To test run, visit the [IDE example](https://ide.bitquery.io/top-liquidity-pools-of-atoken-on-ethereum) or modify the pool filters to target another token as needed.

```graphql
query MyQuery {
  EVM(network: eth) {
    TokenIsCurrencyA: DEXPoolEvents(
      limit: { count: 10 }
      orderBy: {
        descendingByField: "PoolEvent_Liquidity_AmountCurrencyA_maximum"
      }
      where: {
        PoolEvent: {
          Pool: {
            CurrencyA: {
              SmartContract: {
                is: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
              }
            }
            SmartContract: {
              notIn: ["0x000000000004444c5dc75cB358380D2e3dE08A90"]
            }
          }
        }
      }
    ) {
      PoolEvent {
        Liquidity {
          AmountCurrencyA(maximum: Block_Time)
          AmountCurrencyB(maximum: Block_Time)
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
    TokenIsCurrencyB: DEXPoolEvents(
      limit: { count: 10 }
      orderBy: {
        descendingByField: "PoolEvent_Liquidity_AmountCurrencyB_maximum"
      }
      where: {
        PoolEvent: {
          Pool: {
            CurrencyB: {
              SmartContract: {
                is: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
              }
            }
            SmartContract: {
              notIn: ["0x000000000004444c5dc75cB358380D2e3dE08A90"]
            }
          }
        }
      }
    ) {
      PoolEvent {
        Liquidity {
          AmountCurrencyA(maximum: Block_Time)
          AmountCurrencyB(maximum: Block_Time)
        }
        Pool {
          PoolId
          SmartContract
          CurrencyA {
            Name
            Symbol
            SmartContract
          }
          CurrencyB {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

## Realtime Liquidity Data via Kafka Streams

Liquidity data can also be obtained via Kafka streams for lower latency and better reliability. The Kafka topic for Ethereum DEX pools is:

**`eth.dexpools.proto`**

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
