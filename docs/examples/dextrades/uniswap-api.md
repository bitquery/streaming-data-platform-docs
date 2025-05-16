---
sidebar_position: 8
---

# Uniswap API

Uniswap is a decentralized exchange built on the Ethereum blockchain that allows users to trade Ethereum-based tokens.

Bitquery's APIs allows you to retrieve information about trades that have occurred between two tokens on the Uniswap exchange. This endpoint returns a list of trades, along with various details about each trade, such as the amount of tokens exchanged, the price of the trade, and the timestamp of the trade.

All the DEX Trade queries and streams mentioned in other sections can be modified to track solely for the Uniswap protocol.

You can also check Uniswap APIs on other EVM Chains like [BNB](https://docs.bitquery.io/docs/examples/BSC/bsc-uniswap-api/),[Base](https://docs.bitquery.io/docs/examples/Base/base-uniswap-api/) and [Matic/Polygon](https://docs.bitquery.io/docs/examples/Matic/matic-uniswap-api/)

<head>
  <meta name="title" content="Uniswap API - Ethereum On-Chain Token & Trade Data" />
  <meta name="description" content="Access real-time on-chain data for Uniswap tokens using the Bitquery-powered Uniswap API. Track trades, liquidity, token prices, and more on Ethereum." />
  <meta name="keywords" content="Uniswap API,Uniswap token data,Ethereum API,Uniswap on-chain data,Uniswap DEX API,Ethereum tokens,Bitquery API,crypto trading API,Uniswap blockchain data,token analytics API,DeFi analytics,Ethereum memecoins,Uniswap liquidity data" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Uniswap API - Ethereum On-Chain Token & Trade Data" />
  <meta property="og:description" content="Explore token analytics and real-time data from Uniswap projects on Ethereum with the Bitquery API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Uniswap API - Token & Trade Data on Ethereum" />
  <meta property="twitter:description" content="Monitor token trades, prices, and liquidity for Uniswap tokens using Bitquery's on-chain API." />
</head>

## Realtime Uniswap v1, v2, v3 Trades

We track the latest trades on all Uniswap versions using the DEX protocol name filter.
You can run the query [here](https://ide.bitquery.io/Realtime-Uniswap-v1-Uniswap-v2-Uniswap-V3-Trades)

```
subscription {
  EVM(network: eth) {
    DEXTrades(where: {Trade: {Dex: {ProtocolName: {in:["uniswap_v3","uniswap_v2","uniswap_v1"]}}}}) {
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

## Latest Trades of a Pair on Uniswap

This query retrieves the latest trades of a specific token pair (WETH/USDC) on the Ethereum network, for the Uniswap protocol (all versions: v1, v2, and v3).
You can run the query [here](https://ide.bitquery.io/latest-trades-of-pair-on-Uniswap)

```
query LatestTrades {
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}}}, Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, Dex: {ProtocolName: {in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"]}}}}
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

## Top Traders of a Token

This query identifies the top 100 traders of a specific token (USDC) on the Ethereum network, for the Uniswap protocol (all versions: v1, v2, and v3). It ranks traders by their total trading volume in USD.
You can run the query [here](https://ide.bitquery.io/Top-Traders-of-a-token-on-Uniswap-on-ETH)

```
query topTraders {
  EVM(network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}}, Dex: {ProtocolName: {in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"]}}}}
    ) {
      Trade {
        Buyer
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}

```

## Uniswap v2 Pair Trade Stats

In this query, we will get the trade statistics of the ChefDog (CHEF) and WETH pair using `0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75` on Uniswap V2. The results provide insights into how much was bought, sold, and the total trading volume in both CHEF and USD.
You can run the query [here](https://ide.bitquery.io/chefdog-weth-trade-stats)

```
query pairTopTraders {
  EVM(network:eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Dex: {Pair: {SmartContract: {is: "0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75"}}}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}

```

## Latest Pools Created on Uniswap V2

We will track event logs to get newest pools created on Uniswap V2. You can Modify the same query to track Uniswap V3 pool creation using the factory address.
You can run the query [here](https://ide.bitquery.io/Latest-pools-created-uniswap-v2)

```

{
  EVM(dataset: combined, network: eth) {
    Events(
      orderBy: {descending: Block_Number}
      limit: {count: 10}
      where: {Log: {SmartContract: {is: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"}, Signature: {Name: {is: "PairCreated"}}}}
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

## Active Traders on Uniswap in the Last 7 Days

In this query we filter for Uniswap V3 trades using the factory address
and include trades from the last 7 days. We then group results by trader address.
You can run the query [here](https://ide.bitquery.io/Most-Active-Traders-on-Uniswap-v3)

```
query ActiveUniswapTraders {
  EVM(dataset: archive, network: eth) {
    DEXTradeByTokens(
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}, Block: {Date: {after: "2025-04-01"}}}
      limit: {count: 100}
      orderBy: {descendingByField: "tradeCount"}
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
