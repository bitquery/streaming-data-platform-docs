# DEXTradesByTokens Cube

The DexTradesByTokens cube provides comprehensive information about the dex trading data, such as buyer, seller, token prices, pairs, transactions, OHLC, etc.

Let's understand the concept of buyer and seller when a trade occurs between User A and User B, and Token X and Token Y are swapped between them.

![](/img/tokenAB.png)

We see the trade from user A's side, then we get the following:

- User A becomes the seller of token X.
- User A becomes the buyer of token Y.

Now, if we see the trade from a user B side, we get the following.

- User B becomes the seller of token Y.
- User B becomes the buyer of token X.

Therefore, buyers and sellers change relatively when the trade sides change.

> Important note: If a trade occurs between User A and User B, the DexTradesByTokens API shows User A as both buyer and a seller, and similarly for User B. The result includes both perspectives, displaying each user as a buyer and then as a seller.

[Run this API for better understanding](https://ide.bitquery.io/DEXTradeByTokens-API_1). When you run this API you get the following result.

```
{
  "EVM": {
    "DEXTradeByTokens": [
      {
        "Trade": {
          "AmountInUSD": "4294.551848660284",
          "Buyer": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Currency": {
            "Name": "Wrapped Ether"
          },
          "Seller": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Side": {
            "Amount": "160.404506514911311463",
            "AmountInUSD": "4276.354136374763",
            "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
            "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a"
          }
        }
      },
      {
        "Trade": {
          "AmountInUSD": "4276.354136374763",
          "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Currency": {
            "Name": "Ethereum Name Service"
          },
          "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Side": {
            "Amount": "1.132838451259439863",
            "AmountInUSD": "4294.551848660284",
            "Buyer": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
            "Seller": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c"
          }
        }
      }
    ]
  }
}

```

In the above result, User A (0x925...) is included as both a buyer and a seller. The same applies to User B (0xa69...), who is also shown as both a buyer and a seller. If one become a buyer then other automatically become a seller.

> Important note: Let's say currency X and currency Y are swapped in trade. Then, the trade side currency of X is Y, and the trade side currency of Y is X. Therefore, the trade side currency is relatively changed based on the currency that is traded against it.

## Filtering in DEXTradeByTokens Cube

Filtering helps to fetch the exact data you are looking for. DexTradeByTokens Cube can filter based on currency, buyer, seller, dex, pool, sender, transaction, time, etc.

Everything inside the “where” clause filters; it follows the `AND’ condition by default.

### DEXTradeByTokens cube Filtering Examples

In the following example, we retrieve the price of multiple currencies. Therefore, we use a Trade Currency Smart Contract filter to specify these currencies. It is important to note that any currency price is always retrieved against another currency. Thus, we specify this side currency, too, using a Trade Side Currency filter.

Moreover, we want the latest price of these currencies. Hence, we sort by block time. Additionally, we use limitby "Trade Currency Smart Contract" with count 1 to ensure that distinct trade currencies are pulled only once.

[Run this API using this link](https://ide.bitquery.io/Latest-price-of-multiple-currency) to retrieve the latest price of [ChainLink](https://explorer.bitquery.io/ethereum/token/0x514910771AF9Ca656af840dff83E8264EcF986CA), [Uniswap](https://explorer.bitquery.io/ethereum/token/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984), and [BITCOIN](https://explorer.bitquery.io/ethereum/token/0x72e4f9f808c49a2a61de9c5896298920dc4eeea9)

tokens against the [USDT](https://explorer.bitquery.io/ethereum/token/0xdac17f958d2ee523a2206206994597c13d831ec7) token in the ethereum network, we mentioned all these currencies using in ( AND operator)

> Important note: If no trade occurs between two currencies, then price can’t be determined against the side currency. Thus, the price depends on the trades.

```

{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {in:
        ["0x514910771AF9Ca656af840dff83E8264EcF986CA",
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        "0x72e4f9f808c49a2a61de9c5896298920dc4eeea9"]}}, Side: {Currency: {SmartContract: {is: "
0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}}
      orderBy: {descending: Block_Time}
      limitBy: {by: Trade_Currency_SmartContract, count: 1}
    ) {
      Trade {
        PriceInUSD
        Currency {
          SmartContract
          Symbol
        }
      }
      Block {
        Date
        Time
      }
    }
  }
}

```

Result:

```

{
  "EVM": {
    "DEXTradeByTokens": [
      {
        "Block": {
          "Date": "2024-06-07",
          "Time": "2024-06-07T07:41:23Z"
        },
        "Trade": {
          "Currency": {
            "SmartContract": "0x514910771af9ca656af840dff83e8264ecf986ca",
            "Symbol": "LINK"
          },
          "PriceInUSD": 17.54289221766591
        }
      },
      {
        "Block": {
          "Date": "2024-06-06",
          "Time": "2024-06-06T22:02:23Z"
        },
        "Trade": {
          "Currency": {
            "SmartContract": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            "Symbol": "UNI"
          },
          "PriceInUSD": 10.63797650267276
        }
      },
      {
        "Block": {
          "Date": "2024-03-04",
          "Time": "2024-03-04T13:42:47Z"
        },
        "Trade": {
          "Currency": {
            "SmartContract": "0x72e4f9f808c49a2a61de9c5896298920dc4eeea9",
            "Symbol": "BITCOIN"
          },
          "PriceInUSD": 0.17635968422424397
        }
      }
    ]
  }
}

```

Next, we retrieve the trade details using the particular transaction hash in the Bsc network. Therefore, we use a transaction hash filter to specify the transaction hash and mention all other details we are interested in retrieving, such as trading pair currencies, their trade amount, seller/buyer, and price.

[Run this API using this link.](https://ide.bitquery.io/trade-details-using-transaction-hash)

```
{
  EVM(network: bsc, dataset: combined) {
    DEXTradeByTokens(

      where: {Transaction: {Hash: {is: "0xf23cd0e4d85e0a66d58cf68af929b1fab34d72c3f0df0199d221fa8809e702b1"}}}
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Trade {
        Seller
        Buyer
        Amount
        Currency {
          SmartContract
          Symbol
        }
        Price
        Side {
          Amount
          Currency {
            SmartContract
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}

```

## Aggregation in DEXTradeByTokens Cube

DexTradesByTokens cube aggregates the data based on trade currency, amount, seller, buyer, address, dex (dex owner address), pool address (dex smart contract), block time, etc.

We aggregate the following API using the Trade Currency Smartcontract and Trade Side Currency filter. Then, we retrieve the total trade volume by summing all the trade amounts over specific time intervals. We can also retrieve the OHLC (Open-High-Low-Close) data, which contains the first trade time with a block number, the last trade time with a block number, the highest and lowest price, and the open and close price in each time interval.

[Run this query](https://ide.bitquery.io/Copy-of-OHLC) to retrieve the total trade volume of WETH along with OHLC data sequentially every 10-minute time interval in the ethereum network.

```
{
  EVM(dataset: realtime, network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Time_Field"}
      where: {Trade: {Side: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}, Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}
    ) {
      Block {
        Time_Field: Time(interval: {in: minutes, count: 10})
        lastTradeTime: Time(maximum: Block_Time)
        FirstTradeTime: Time(minimum: Block_Time)
        LastTradeBlock: Number(maximum: Block_Number)
        FirstTradeBlock: Number(minimum: Block_Number)
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
    }
  }
}

```

Next, we aggregated the following API to retrieve the top traders of specific currencies based on the highest number of trades in the specific pool and their trade volume of traded currencies. We used the Trade Currency Smartcontract filter to specify the traded currency and the Dex SmartContract filter to specify the pool.

In the following example, we extract the top traders of the MONKE token (“0xb62..”) in the MONKE / ETH pool (“0x622…”) in the ethereum network. Run the API using this link.

```
{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Total_number_of_trades"}
      limitBy: {count: 1, by: Trade_Buyer}
      limit: {count: 10}
      where: {Trade:  {Currency: {SmartContract: {is: "0xb624960aaad05d433075a5c9e760adec26036934"}},
        Dex: {SmartContract:
          {is: "0x62220cca3fa08e9b35bb2c775d20cf63a8de7ac5"}}}}
    ) {
      buy: sum(of: Trade_AmountInUSD)
      sell: sum(of: Trade_Side_AmountInUSD)
      Total_number_of_trades:  count
      Trade {
        Buyer
        Currency {
          SmartContract
          Symbol
          Name
        }
      }
    }
  }
}
```

## DEXTradeByTokens Metrics

In this example, we use the count metric to retrieve a specific token's total number of trades that occur in specific Dex of the ethereum network. [Run this API](https://ide.bitquery.io/Count-of-trade-on-Uniswap-of-pepe) to find the total trades of [PEPE](https://explorer.bitquery.io/ethereum/token/0x6982508145454ce325ddbe47a25d4ec3d2311933) tokens in the [Uniswap v3 factory](https://explorer.bitquery.io/ethereum/token/0x6982508145454ce325ddbe47a25d4ec3d2311933). We have specified the PEPE token address using the Trade Currency SmartContract filter. And we specified the Uniswap v3 factory dex address using the Dex OwnerAddress filter.

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true},
        Trade: {Currency:
          {SmartContract:
            {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}},
          Dex:
          {OwnerAddress:
            {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}},
        Block: {Date:
          {since: "2024-01-01", till: "2024-06-02"}}}
    ) {
      total_trades: count
    }
  }
}
```

Using the sum metric, we retrieve the total trade volume of MMM tokens: 1799228141.67, transferred by address 0xf9ca… until February 1st, 2024. Run this API using this link.

```

{
  EVM(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {till: "2024-02-01T00:00:00Z"}},
        Trade: {Currency: {SmartContract: {is: "0x4d55B39eC653fB96E70f986988A128e39EC70d35"}}}, Transaction:
        {From: {in: ["0xf9cafeb32467994e3affd61e30865e5ab32abe68"]}}}
    ) {
      sum(of: Trade_Amount)
    }
  }
}
```

Result: 1799228141.673992845889896448 MMM tokens.

Next, we use the count metric to retrieve the most traded token in any dex.

We use the Trade Dex OwnerAddress filter to specify the Dex address and count metric to count the top trade currencies on Uniswap v3 factory Dex in the ethereum network. Run the following API using this link.

```

{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1F98431c8aD98523631AE4a59f267346ea31F984"}}}}
    ) {
      Trade {
        Currency {
          Name
          SmartContract
        }
        Dex {
          ProtocolName
        }
      }
      count
    }
  }
}
```
