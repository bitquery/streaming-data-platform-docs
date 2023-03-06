---
sidebar_position: 10
---

# DEX Trades

DEXTrades api gives trading-related data from different DEXs such as Uniswap, Pancakeswap, 0x, etc.

API provides historical and real-time trades and pricing information for tokens.

The API allows different filters to query the Smart contract calls details from different dimensions, such as from different DEXs, protocols, tokens, trades, pools, etc.

Let's see an example.

```graphql
{
  EVM(dataset: combined, network: eth) {
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

You can see more example of Calls api in [here](docs/examples/dextrades/token-trades-apis.md).