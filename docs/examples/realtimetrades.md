---
sidebar_position: 8
---

# Uniswap API

Uniswap is a decentralized exchange built on the Ethereum blockchain that allows users to trade Ethereum-based tokens.

Bitquery's APIs allows you to retrieve information about trades that have occurred between two tokens on the Uniswap exchange. This endpoint returns a list of trades, along with various details about each trade, such as the amount of tokens exchanged, the price of the trade, and the timestamp of the trade.

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

## Uniswap v3 Trades

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
      limit: {count: 10}
      orderBy: {descending: Fee_Burnt}
    ) {
      Transaction {
        From
        To
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
          Pair {
            Name
          }
          OwnerAddress
        }
        Buy {
          Currency {
            Name
          }
          Price
          Amount
        }
        Sell {
          Amount
          Currency {
            Name
          }
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

- `EVM`: The data set for Ethereum data.
- `DEXTrades`: The endpoint that returns information about the trades on the DEX.
- `where`: The condition to filter the trades by the DEX owner address. In this case, it's set to `0x1f98431c8ad98523631ae4a59f267346ea31f984`, which is the factory address of Uniswap V3.
- `limit`: The maximum number of trades to return. In this case, it's set to 10.
- `orderBy`: The field to order the results by. In this case, it's set to `Fee_Burnt` in descending order.
- `Transaction`: The transaction object, which contains the `From` and `To` addresses of the trade.
- `Trade`: The trade object, which contains information about the DEX, the tokens involved in the trade, and the prices.
- `Dex`: The DEX object, which contains the name of the protocol, the smart contract address, the name of the pair, and the owner address.
- `Buy`: The object that represents the token being bought in the trade.
- `Sell`: The object that represents the token being sold in the trade.
- `Currency`: The object that contains the name of the token.
- `Amount`: The amount of the token being traded.
- `Price`: The price of the token being traded.
- `Block`: The block object, which contains the timestamp of the block in which the trade was executed.

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
