# Address Trades API

## Latest Trades for a given address

This GraphQL query retrieves the latest 10 buy-side and sell-side trades from the DEXTrades dataset on the Ethereum network for a specific buyer/seller.
You can view the query in the IDE [here](https://graphql.bitquery.io/ide/Buy-and-sell-trades-for-a-given-address)

```
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
There are two sub-queries specified within the "EVM" field: "buyside" and "sellside".

The "buyside" sub-query retrieves the 10 most recent DEX trades where the specified address was the buyer. The results are ordered by the block time in descending order.

The "sellside" sub-query retrieves the 10 most recent DEX trades where the specified address was the seller. The results are also ordered by the block time in descending order.

**Parameters**

- `limit`: retrieve only 10 trades
- `orderBy`: sort the trades by Block_Time in descending order
- `where`: retrieve trades where the Buyer's address matches "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167"

**Returned Data**

For each trade, the query retrieves the following data:

- `Block`: block number and timestamp of the block in which the trade occurred.

- `Transaction`: addresses of the transaction sender and receiver, and the transaction hash.

- `Trade`: details of the trade, including the amount of the currency bought and sold, the buyer and seller addresses, the currency name, symbol, and smart contract address, and the price of the trade.

## Token trades for an specific address

You can view the query in the IDE [here](https://graphql.bitquery.io/ide/Trades-for-a-given-address-for-an-specific-currency)

```
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
There are two sub-queries specified within the "EVM" field: "buyside" and "sellside".

The "buyside" sub-query retrieves the 10 most recent DEX trades where the specified address was the buyer of a specific ERC20 token. The results are ordered by the block time in descending order.

The "sellside" sub-query retrieves the 10 most recent DEX trades where the specified address was the seller of a specific ERC20 token. The results are also ordered by the block time in descending order.

**Parameters**

- `limit`: retrieve only 10 trades
- `orderBy`: sort the trades by Block_Time in descending order
- `where`: retrieve trades where the Buyer's address matches "0x1f77dfeb0e6fed1ecf0b41d4c81330df6a6fb167" and SmartContract address is "0x497a9a79e82e6fc0ff10a16f6f75e6fcd5ae65a8"

**Returned Data**

For each trade, the query retrieves the following data:

- `Block`: block number and timestamp of the block in which the trade occurred.

- `Transaction`: addresses of the transaction sender and receiver, and the transaction hash.

- `Trade`: details of the trade, including the amount of the currency bought and sold, the buyer and seller addresses, the currency name, symbol, and smart contract address, and the price of the trade.







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

