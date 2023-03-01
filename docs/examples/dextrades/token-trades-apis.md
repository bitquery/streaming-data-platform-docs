## Historical Token Trades

```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}, Block: {Time: {since: "2023-03-03T01:00:00", till: "2023-03-05T05:15:23"}}}
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
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}, Block: {Time: {since: "2023-03-03T01:00:00", till: "2023-03-05T05:15:23"}}}
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

https://graphql.bitquery.io/ide/token-trades-bw-a-time_1


## Token price using trades at a given past day/time




```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 1}
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}, Sell: {Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}, Block: {Time: {since: "2023-02-01T01:00:00Z", till: "2023-02-01T01:15:23Z"}}}
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

https://graphql.bitquery.io/ide/WETH-price-against-USDT-at-a-specific-time_1

## Latest Token Trades 

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

https://graphql.bitquery.io/ide/latest-trades-for-a-token---both-buy-and-sell



## Token trade from a specific DEX

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

https://graphql.bitquery.io/ide/token-trades-for-a-specific-DEX_1




## Subscribe to new token trades

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

https://graphql.bitquery.io/ide/latest-token-trades-subscription