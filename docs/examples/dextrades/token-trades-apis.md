---
sidebar_position: 5
---

# Token Trades API

## Historical Token Trades & Price API

DEXTrades API can give you historical trades. Let's see an example where we get trades of [BLUR Token](https://explorer.bitquery.io/ethereum/token/0x5283d291dbcf85356a21ba090e6db59121208b44) in the past. As you can see, we are using Block -> Time filter, which includes the time. If you want to filter by date, then use Block -> Date. You can also use Block -> Number if you want to filter based on block height. We are setting the seller and buyer to 1inch router to get both buys and sells of the BLUR token. 


```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}, Seller: {is: "0x1111111254eeb25477b68fb85ed929f73a960582"}}}, Block: {Time: {since: "2023-03-03T01:00:00Z", till: "2023-03-05T05:15:23Z"}}}
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
      where: {Trade: {Sell: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}, Buyer: {is: "0x1111111254eeb25477b68fb85ed929f73a960582"}}}, Block: {Time: {since: "2023-03-03T01:00:00Z", till: "2023-03-05T05:15:23Z"}}}
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

Open the above query on GraphQL IDE using this [link](https://ide.bitquery.io/token-trades-both-buy-sell-1-inch).



## Latest Token Trades

To get the latest token trades you just need to sort by Block -> Time.

```
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}}
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
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}}
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

Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/latest-trades-for-a-token---both-buy-and-sell)



## Token trade from a specific DEX

If you are looking for token trades on a specific dex, use the following API as an example. Here we are getting [WETH Token](https://explorer.bitquery.io/ethereum/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) trades from the Uniswap V3 DEX. You can also use the factory contract of Uniswap-like protocols in the DEX ->  OwnerAddress filter to get trades for that DEX.


```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 5}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}, Dex: {ProtocolName: {is: "uniswap_v3"}}}}
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
        Dex {
          ProtocolFamily
          ProtocolName
          SmartContract
          Pair {
            SmartContract
          }
        }
      }
    }
  }
}

```

Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/token-trades-for-a-specific-DEX_1).




## Subscribe to new token trades (Webhook)

You can use GraphQL subscription (Webhook) to subscribe to latest trades. In the following example we are subscribing to latest trades for [WETH Token](https://explorer.bitquery.io/ethereum/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2).



```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    buyside: DEXTrades(
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}}}
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
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}}}
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

Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/latest-token-trades-subscription)
