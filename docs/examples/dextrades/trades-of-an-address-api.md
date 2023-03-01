## Latest Trades for a given address



```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Buyer: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}}}}
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
      where: {Trade: {Buy: {Seller: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}}}}
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

https://graphql.bitquery.io/ide/Buy-and-sell-trades-for-a-given-address



## Token trades for an specific address


```graphql
{
  EVM(dataset: combined, network: eth) {
    buyside: DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Buyer: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}, Currency: {SmartContract: {is: "0x497a9a79e82e6fc0ff10a16f6f75e6fcd5ae65a8"}}}}}
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
      where: {Trade: {Buy: {Seller: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}, Currency: {SmartContract: {is: "0x497a9a79e82e6fc0ff10a16f6f75e6fcd5ae65a8"}}}}}
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

https://graphql.bitquery.io/ide/Trades-for-a-given-address-for-an-specific-currency





## Subscribe to latest trades for a given address


```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    buyside: DEXTrades(
      orderBy: {descending: Block_Time}
      where: {Trade: {Buy: {Buyer: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}}}}
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
      where: {Trade: {Buy: {Seller: {is: "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"}}}}
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

https://graphql.bitquery.io/ide/subscribe-to-trades-for-a-given-address

