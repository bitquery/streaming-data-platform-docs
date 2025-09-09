---
title: DEX Trades API
---

<head>
<meta name="title" content="DEX Trades API"/>
<meta name="description" content="Get address balance and history on the DEX Trades blockchain. Also, get address balance and history for tokens or NFTs on the DEX Trades blockchain."/>
<meta name="keywords" content="DEX Trades api, DEX Trades python api, DEX Trades nft api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,matic network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="DEX Trades, address balance and history API" />
<meta property="og:description" content="Get DEX trades data for EVM chains. Also, get address balance and history for tokens or NFTs on the EVM chain." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="DEX Trades API" />
<meta property="twitter:description" content="Get DEX trades data for EVM chains. Also, get address balance and history for tokens or NFTs on the EVM chain." />
</head>


DEXTrades api gives trading-related data from different DEXs such as Uniswap, Pancakeswap, 0x, etc.

API provides historical and real-time trades and pricing information for tokens. The API allows different filters to query the Smart contract calls details from different dimensions, such as from different DEXs, protocols, tokens, trades, pools, etc. 
You can find more examples [here](/docs/blockchain/Ethereum/dextrades/get-trading-pairs-of-token/)


## DEX Trades Cube

Dex Trades represent every swap of tokens on decentralised exchange. Every trade has
two sides, represented by currencies ( tokens or native currency ), which are exchanged.
Buyer and seller side in some cases are selected related to the "maker" side of the trade if
the DEX is limit orders type. In case of automated trading ( uniswap, balancer and others)
the trade is related to the pool smart contract, executing the trade.

Use DEX Trades Cube in case when you need to build query based on protocol or smart contracts, for example:

* total count of trades by protocols or smart contracts or oter dimensions
* gas spending on trades
* dynamics in time of DEX usage

## DEX Trades By Tokens

DEX Trades By Tokens exposes trades relative to the token. So every trade is represented by 2 records - by every token
participating in trade. This allows to build queries by tokens which take into account all orders for token
(buy side and sell side).

Use DEX Trades Cube in case when you need to build query based on token or pair of tokens, for example:

* query every pair the token is involved
* price of trading the token
* open-high-low-close OHLC graph building ( see example below )

:::caution
DEX Trades By Tokens has twice as much records for dex trades. Always use at least one filter by token
to query correctly! 
:::

:::tip
Use interval argument for date/time to build OHLC graph by time interval
:::

## Examples

Here are the sample queries to get started:

### OHLC API

Query price OHLC data for token pairs using DEX Trades By Tokens

```graphql


query MyQuery {
  EVM(dataset: archive) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_datefield"}
      #WETH-USDT trades on Uniswap V3
      where: {Trade: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, 
        Side: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}, 
        Dex: {SmartContract: {is: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36"}}}}
      limit: {count: 10}
    ) {
      Block {
       datefield: Date(interval: {in: days, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
        Currency {
          Name
        }
        Dex {
          ProtocolName
          SmartContract
        }
        Side {
          Currency {
            Name
            SmartContract
          }
        }
      }
      count
    }
  }
}


```

:::note
we applied filter by tokens, used [interval](/docs/graphql/datetime) and actual numbers 
calculated by  aggregated [metrics ( max/min )](/docs/graphql/calculations)
:::


```graphql
{
  EVM(dataset: archive, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}, Block: {Time: {since: "2023-03-03T01:00:00Z", till: "2023-03-05T05:15:23Z"}}}
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
    sellside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}, Block: {Time: {since: "2023-03-03T01:00:00Z", till: "2023-03-05T05:15:23Z"}}}
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

