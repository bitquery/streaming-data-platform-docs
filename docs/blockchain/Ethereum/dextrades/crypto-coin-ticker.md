---
sidebar_position: 3
---

# Crypto Coin Ticker API

You can build your crypto coin ticker using our [DEX APIs](https://bitquery.io/products/dex) based on the requirements of the data field.
Also, you can set any time interval you need.
Let's see an example.
In this example, we are getting the [WETH](https://ide.bitquery.io/exploreapi/WETH/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) price against [USDT](https://ide.bitquery.io/exploreapi/USDT/0x7dd5f67a25afb9e73d4966b1ac578dabd9ccc986) on [Ethereum blockchain](https://bitquery.io/blockchains/ethereum-blockchain-api), aggregating different DEXs.

Open this API on our [GraphQL IDE](https://ide.bitquery.io/Coin-ticker-api_4).

```
{
  EVM(dataset: realtime) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Side: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}, Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, PriceAsymmetry: {lt: 0.1}}}
    ) {
      Block {
        Timefield: Time(interval: {in: minutes, count: 10})
        lastTradeTime: Time(maximum: Block_Time)
        FirstTradeTime: Time(minimum: Block_Time)
        LastTradeBlock: Number(maximum: Block_Number)
        FirstTradeBlock: Number(minimum: Block_Number)
      }
      volume: sum(of: Trade_Amount)
      Trade {
        Currency {
          Name
          Symbol
        }
        Side {
          Currency {
            Name
            Symbol
          }
        }
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
      count
    }
  }
}
```

We are getting OHLC (Open High Low Close) data, with the last trade details on 10-minute intervals.
You can change this interval like the following.

- Time(interval: {in: minutes, count: 5})
- Time(interval: {in: seconds, count: 10})
- Time(interval: {in: hours, count: 3})
- Time(interval: {in: days, count: 14})
- Time(interval: {in: weeks, count: 3})
- Time(interval: {in: months, count: 1})
- Time(interval: {in: years, count: 2})

You can also add additional information if you want; there are many more fields available.
