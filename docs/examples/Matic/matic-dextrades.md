---
sidebar_position: 2
---

# Polygon (MATIC) DEX Trades API

In this section we will see how to get Matic DEX trades information using our API.

This Matic API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API"/>
<meta name="description" content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API."/>
<meta name="keywords" content="Polygon (MATIC) DEX Trades api,Polygon (MATIC) DEX Trades python api,Polygon (MATIC) DEX Trades token api,Polygon (MATIC) Dex NFT api, DEX Trades scan api, DEX Trades api, DEX Trades api docs, DEX Trades crypto api, DEX Trades blockchain api,Polygon (MATIC) network api, Polygon (MATIC) web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to Get Polygon (MATIC) Decentralized Exchange Data with DEX Trades API" />
<meta property="twitter:description" content="Get on-chain data of any Polygon (MATIC) based DEX through our DEX Trades API." />
</head>

## Subscribe to Latest Matic Trades

This subscription will return information about the most recent trades executed on Matic's DEX platforms.
You can find the query [here](https://ide.bitquery.io/Realtime-matic-dex-trades-websocket)

```
subscription {
  EVM(network: matic) {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
          SmartContract
        }
        Buy {
          Amount
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
          OrderId
        }
        Sell {
          Buyer
          Seller
          Currency {
            Decimals
            Fungible
            HasURI
            Name
            ProtocolName
            SmartContract
            Symbol
          }
        }
      }
    }
  }
}



```

## Subscribe to Latest Price of a Token in Real-time

This query provides real-time updates on price of AVAX `0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b` in terms of WMATIC `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`, including details about the DEX, market, and order specifics. Find the query [here](https://ide.bitquery.io/Price-of-a-AVAX-in-terms-of-WMATIC-on-matic_2)

```
subscription {
  EVM(network: matic) {
    DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b"}}}, Buy: {Currency: {SmartContract: {is: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"}}}}}
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Buyer
          Seller
          Price_in_terms_of_sell_currency: Price
          Currency {
            Name
            Symbol
            SmartContract
          }
          OrderId
        }
        Sell {
          Amount
          Buyer
          Seller
          Price_in_terms_of_buy_currency: Price
          Currency {
            Symbol
            SmartContract
            Name
          }
          OrderId
        }
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
          ProtocolVersion
        }
      }
    }
  }
}


```

## Latest USD Price of a Token

The below query retrieves the USD price of a token on Matic by setting `SmartContract: {is: "0xe06bd4f5aac8d0aa337d13ec88db6defc6eaeefe"}` . Check the field `PriceInUSD` for the USD value. You can access the query [here](https://ide.bitquery.io/Latest-USD-Price-of-a-Token-on-Matic).

```
subscription {
  EVM(network: matic) {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xe06bd4f5aac8d0aa337d13ec88db6defc6eaeefe"}}}}}
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
          PriceInUSD
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
        PriceAsymmetry(selectWhere: {lt: 1})
      }
    }
  }
}

```

## Get Top Gainers on Matic Network

This query retrieves information about the top-performing tokens on the Matic network based on trade volume and price appreciation in USD. It aggregates data from DEXs to provide insights into price trends over different time intervals like 10 minutes, 1 hour and 3 hours ago, and the overall trading volume.

We use `any` filter ( OR condition) to exclude `$wmatic`, `$weth`, `$usdc`, `$usdt`, `$usdcpos`, the smart contract addresses for common tokens on the Matic network from top tokens list.

You can run this query [here](https://ide.bitquery.io/top-tokens-on-matic-stats)

```
query pairs($min_count: String, $network: evm_network, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime, $time_ago: DateTime, $wmatic: String!, $weth: String!, $usdc: String!, $usdt: String!, $usdcpos: String!) {
  EVM(network: $network) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: $time_ago}}, any: [{Trade: {Side: {Currency: {SmartContract: {is: $usdt}}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdc}}}, Currency: {SmartContract: {notIn: [$usdt]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdcpos}}}, Currency: {SmartContract: {notIn: [$usdt, $usdc]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $weth}}}, Currency: {SmartContract: {notIn: [$usdc, $usdt, $usdcpos]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $wmatic}}}, Currency: {SmartContract: {notIn: [$weth, $usdc, $usdt, $usdcpos]}}}}, {Trade: {Side: {Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $wmatic]}}}, Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $wmatic, $usdcpos]}}}}]}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
          ProtocolName
        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
            ProtocolName
          }
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_10min_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_3h_ago}}}
        )
      }
      dexes: uniq(of: Trade_Dex_OwnerAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      sellers: uniq(of: Trade_Seller)
      buyers: uniq(of: Trade_Buyer)
      count(selectWhere: {ge: $min_count})
    }
  }
}
{
  "network": "matic",
  "time_10min_ago": "2024-11-13T03:49:19Z",
  "time_1h_ago": "2024-11-13T02:59:19Z",
  "time_3h_ago": "2024-11-13T00:59:19Z",
  "usdc": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  "usdcpos": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  "usdt": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  "weth": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  "wmatic": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  "min_count": "100"
}

```
This query is available as a heatmap on [https://dexrabbit.com/matic](https://dexrabbit.com/matic)

![](/img/dexrabbit/matic_toptokens.png)


## Top Traders of a Token

This query retrieves data on the top traders of a specific token on the Matic network. It aggregates trade volumes and categorizes them into bought and sold amounts, along with the total trading volume in both native and USD terms.

You can run the query [here](https://ide.bitquery.io/top-traders-of-a-token-on-matic)
```
query topTraders($network: evm_network, $time_ago: DateTime, $token: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}}, Block: {Time: {since: $time_ago}}}
    ) {
      Trade {
        Buyer
        Seller
        Dex {
          ProtocolFamily
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "network": "matic",
  "token": "0x4dba7eb38ab96987b2b9c267f9d399da367194e0",
  "time_ago": "2024-11-10T05:00:02Z"
}
```

This query is available as a chart and table on [https://dexrabbit.com/matic](https://dexrabbit.com/matic)

![](/img/dexrabbit/matic_toptraders.png)