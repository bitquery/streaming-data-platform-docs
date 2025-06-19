# Uniswap API

Uniswap is a decentralized exchange on Ethereum for trading ERC-20 tokens. Bitquery’s APIs let you fetch Uniswap trades, pool creations, and active user metrics across v1, v2, and v3.

You can also explore Uniswap-style APIs on other chains:

- [BNB Smart Chain](https://docs.bitquery.io/docs/examples/BSC/bsc-uniswap-api/)
- [Base](https://docs.bitquery.io/docs/examples/Base/base-uniswap-api/)
- [Polygon](https://docs.bitquery.io/docs/examples/Matic/matic-uniswap-api/)

import VideoPlayer from "../../../src/components/videoplayer.js";

<Head>
  <meta name="title" content="Uniswap API - Ethereum On-Chain Token & Trade Data" />
  <meta name="description" content="Access real-time on-chain data for Uniswap tokens using the Bitquery-powered Uniswap API. Track trades, liquidity, token prices, and more on Ethereum." />
  <meta name="keywords" content="Uniswap API,Uniswap token data,Ethereum API,Uniswap on-chain data,Uniswap DEX API,Ethereum tokens,Bitquery API,crypto trading API,Uniswap blockchain data,token analytics API,DeFi analytics,Ethereum memecoins,Uniswap liquidity data" />
  <meta name="robots" content="index, follow" />
  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Uniswap API - Ethereum On-Chain Token & Trade Data" />
  <meta property="og:description" content="Explore token analytics and real-time data from Uniswap projects on Ethereum with the Bitquery API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Uniswap API - Token & Trade Data on Ethereum" />
  <meta property="twitter:description" content="Monitor token trades, prices, and liquidity for Uniswap tokens using Bitquery's on-chain API." />
</Head>

## Realtime Uniswap v1, v2, v3 Trades

Track live trades across all Uniswap versions:

<details>
  <summary>Click to expand GraphQL subscription</summary>

```graphql
subscription {
  EVM(network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProtocolName: { in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"] }
          }
        }
      }
    ) {
      Block {
        Number
        Time
      }
      Transaction {
        From
        To
        Hash
      }
      Trade {
        Dex {
          Delegated
          DelegatedTo
          OwnerAddress
          Pair {
            Decimals
            Name
            SmartContract
          }
          ProtocolFamily
          ProtocolName
          ProtocolVersion
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
        }
        Sell {
          Amount
          Buyer
          Currency {
            Name
            SmartContract
            Symbol
          }
          Seller
          Price
        }
      }
    }
  }
}
```

</details>

## Latest Trades of a Pair on Uniswap

Retrieve the 50 most recent WETH/USDC trades on Uniswap v1–v3:

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LatestTrades {
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descending: Block_Time }
      limit: { count: 50 }
      where: {
        Trade: {
          Side: {
            Amount: { gt: "0" }
            Currency: {
              SmartContract: {
                is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
              }
            }
          }
          Currency: {
            SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
          }
          Dex: {
            ProtocolName: { in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"] }
          }
        }
      }
    ) {
      Block {
        allTime: Time
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Price
        AmountInUSD
        Amount
        Side {
          Type
          Currency {
            Symbol
            SmartContract
            Name
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
```

</details>

## Top Traders of a Token

Identify the top 100 USDC traders by USD volume on Uniswap v1–v3:

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query topTraders {
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 100 }
      where: {
        Trade: {
          Currency: {
            SmartContract: { is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }
          }
          Dex: {
            ProtocolName: { in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"] }
          }
        }
      }
    ) {
      Trade {
        Buyer
      }
      bought: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      sold: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

</details>

## Uniswap v2 Pair Trade Stats

Get CHEFDOG/WETH v2 pooled stats (volume, bought, sold):

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query pairTopTraders {
  EVM(network: eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: { descendingByField: "volumeUsd" }
      limit: { count: 100 }
      where: {
        Trade: {
          Dex: {
            Pair: {
              SmartContract: {
                is: "0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75"
              }
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: buy } } } }
      )
      sold: sum(
        of: Trade_Amount
        if: { Trade: { Side: { Type: { is: sell } } } }
      )
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

</details>

## Latest Pools Created on Uniswap V2

Track the last 10 `PairCreated` events from the Uniswap V2 factory:

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  EVM(dataset: combined, network: eth) {
    Events(
      orderBy: { descending: Block_Number }
      limit: { count: 10 }
      where: {
        Log: {
          SmartContract: { is: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" }
          Signature: { Name: { is: "PairCreated" } }
        }
      }
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
        SmartContract
      }
      Transaction {
        Hash
      }
      Block {
        Date
        Number
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

</details>

## Active Traders on Uniswap in the Last 7 Days

Identify the top 100 active Uniswap v3 traders since April 1, 2025:

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query ActiveUniswapTraders {
  EVM(dataset: archive, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Dex: {
            OwnerAddress: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          }
        }
        Block: { Date: { after: "2025-04-01" } }
      }
      limit: { count: 100 }
      orderBy: { descendingByField: "tradeCount" }
    ) {
      Trader: Trade {
        Seller
      }
      tradeCount: count
      uniqueTokens: count(distinct: Trade_Currency_SmartContract)
    }
  }
}
```

</details>
