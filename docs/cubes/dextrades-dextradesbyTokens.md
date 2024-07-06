# DEXTrades vs DEXTradesByTokens

### DEXTrades Cube

The **DEXTrades Cube** provides detailed information about decentralized exchange (DEX) trading data, focusing on the perspective of the pool involved in the trade. Here's a breakdown of its features:

- **Trade Perspective**: The data is presented from the pool's perspective. In every trade, one of the participants must be a pool, and the cube shows the pool's buy and sell details.
- **Buyer and Seller Identification**: The cube clearly differentiates the buyer and seller based on the pool's perspective. The pool’s buy details include the currency bought by the pool, while the sell details include the currency sold by the pool.
- **Filtering**: Allows filtering of trades based on various criteria such as buy currency, sell currency, buyer, seller, DEX, pool, sender, receiver, transaction, time, etc.
- **Aggregation**: Supports aggregation of data based on time, amount, address, currency, type, buyer, seller, DEX, pool address, block time, etc.
- **Metrics**: Offers metrics for sum, count, average, median, maximum, minimum, etc., enabling comprehensive trade analysis.

Example API call from DEXTrades Cube:

```graphql
{
  EVM(dataset: archive, network: eth) {
    DEXTrades(
      limit: { count: 2 }
      where: {
        Transaction: {
          Hash: {
            is: "0x672b64a68f612667111fb2e1329dc1b47279042e1b84d894aa64119ae34a989f"
          }
        }
      }
    ) {
      Transaction {
        Hash
      }
      Trade {
        Buy {
          AmountInUSD
          Buyer
          Currency {
            Name
          }
          Seller
          Currency {
            Name
          }
          AmountInUSD
        }
        Sell {
          AmountInUSD
          Buyer
          Currency {
            Name
          }
          Seller
          Currency {
            Name
          }
          AmountInUSD
        }
      }
    }
  }
}
```

### DEXTradesByTokens Cube

The **DEXTradesByTokens Cube** provides a more granular view of the DEX trading data, including details from both sides of the trade for each participant. Here's a breakdown of its features:

- **Trade Perspective**: The data includes both participants' perspectives in a trade. Each user is shown as both a buyer and a seller.
- **Buyer and Seller Identification**: The cube displays each user involved in the trade as both a buyer and a seller, reflecting the trade from both perspectives.
- **Filtering**: Allows filtering of trades based on currency, buyer, seller, DEX, pool, sender, transaction, time, etc.
- **Aggregation**: Supports aggregation of data based on trade currency, amount, seller, buyer, address, DEX, pool address, block time, etc.
- **Metrics**: Offers metrics similar to the DEXTrades cube for sum, count, average, median, maximum, minimum, etc., with a focus on token-specific trade analysis.

Example API call from DEXTradesByTokens Cube:

```graphql
{
  EVM(network: bsc, dataset: combined) {
    DEXTradeByTokens(
      where: {
        Transaction: {
          Hash: {
            is: "0xf23cd0e4d85e0a66d58cf68af929b1fab34d72c3f0df0199d221fa8809e702b1"
          }
        }
      }
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


Both cubes support advanced filtering, aggregation, and metric calculations, allowing for detailed and customizable data retrieval and analysis for DEX trades.

You can read in detail about dextrades cube [here](https://docs.bitquery.io/docs/cubes/dextrades/)
