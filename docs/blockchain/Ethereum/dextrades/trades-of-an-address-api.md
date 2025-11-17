---
sidebar_position: 7
---

# Address Trades API

## Latest Trades by Maker Address

This GraphQL query retrieves the latest trades executed by a particular maker on the Ethereum network. You can view the query in the IDE [here](https://ide.bitquery.io/latest-trades-by-market-maker)
```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Transaction: {From: {is: "0x9d6581468F04e5E55876a2660b5AeAbC12e3EFa0"}}}
      limit: {count: 10}
      orderBy: {descending: Block_Number}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Trade {
        Sender
        Buy {
          Buyer
          Seller
          Currency {
            Name
            SmartContract
          }
          Amount
          Price
        }
        Sell {
          Currency {
            Name
            SmartContract
          }
          Buyer
          Amount
          Seller
          Price
        }
      }
      Block {
        Number
        Time
      }
    }
  }
}

```

**Parameters**

- `limit`: retrieve only 10 trades
- `orderBy`: sort the trades by Block Number in descending order
- `where`: retrieve trades where the address was a maker

**Returned Data**

For each trade, the query retrieves the following data:

- `Block`: block number and timestamp of the block in which the trade occurred.

- `Transaction`: addresses of the transaction sender and receiver, and the transaction hash.

- `Trade`: details of the trade, including the amount of the currency bought and sold, the buyer and seller addresses, the currency name, symbol, and smart contract address, and the price of the trade.

##  Buys and Sells of a Specific Token Pair by an Address

You can view the query in the IDE [here](https://ide.bitquery.io/latest_buys_and_sell_)

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    Sells: DEXTrades(
      where: {Transaction: {From: {is: "0x9d6581468F04e5E55876a2660b5AeAbC12e3EFa0"}}, Trade: {Buy: {Currency: {SmartContract: {is: "0x7E744BBB1a49A44dfCC795014a4BA618E418FbBE"}}}, Dex: {SmartContract: {is: "0x8C13d5a6635216513EbFB4483397bE14D494aD76"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Number}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Block{
        Time
        Number
      }
      Trade {
        Sender
        Buy {
          Buyer
          Seller
          Currency {
            Name
            SmartContract
          }
          Amount
        }
      }
    }
    Buys: DEXTrades(
      where: {Transaction: {From: {is: "0x9d6581468F04e5E55876a2660b5AeAbC12e3EFa0"}}, Trade: {Sell: {Currency: {SmartContract: {is: "0x7E744BBB1a49A44dfCC795014a4BA618E418FbBE"}}}, Dex: {SmartContract: {is: "0x8C13d5a6635216513EbFB4483397bE14D494aD76"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Number}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Block{
        Time
        Number
      }
      Trade {
        Sell {
          Buyer
          Seller
          Currency {
            Name
            SmartContract
          }
          Amount
        }
      }
    }
  }
}

```


The "EVM" field contains two sub-queries: "Buys" and "Sells."

The "Buys" sub-query retrieves the 10 most recent trades where the specified address was the maker and the token was purchased.

The "Sells" sub-query retrieves the 10 most recent trades where the specified address was the maker and the token was sold.

**Parameters**

- `limit`: retrieve only 10 trades
- `orderBy`: sort the trades by Block_Number in descending order
- `where`: retrieve trades where the maker address matches "0x9d6581468F04e5E55876a2660b5AeAbC12e3EFa0" and token SmartContract and pair address is "0x7E744BBB1a49A44dfCC795014a4BA618E418FbBE" and "0x8C13d5a6635216513EbFB4483397bE14D494aD76" respectively

**Returned Data**

For each trade, the query retrieves the following data:

- `Block`: block number and timestamp of the block in which the trade occurred.

- `Transaction`:  The sender, reciever and the transaction hash

- `Trade`: details of the trade, including the amount of the currency bought and sold, the buyer and seller addresses, the currency name, symbol, and smart contract address, and the price of the trade.

## Subscribe to latest trades for a given address

You can check this query [here](https://ide.bitquery.io/Real-time-trades-of-an-ethereum-address).

```graphql
subscription {
  EVM(network: eth) {
    DEXTrades(
      orderBy: { descending: Block_Time }
      where: {
        any: [
          {
            Trade: {
              Buy: {
                Buyer: { is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d" }
              }
            }
          }
          {
            Trade: {
              Buy: {
                Seller: { is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d" }
              }
            }
          }
          {
            Transaction: {
              From: { is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d" }
            }
          }
        ]
      }
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
          Currency {
            Name
            SmartContract
            Symbol
          }
          Price
        }
      }
    }
  }
}
```

## Trades Where the Address is Buyer OR Seller

The below query gives you trades where the specified address is either as a buyer or a seller. This is achieved by utilizing the `any` filter, which acts as an OR condition to encompass both buyer and seller roles in the results.
You can find the query [here](https://ide.bitquery.io/Address-is-Buyer-or-Seller-V2)

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    DEXTrades(
      where: {any: [{Trade: {Buy: {Buyer: {is: "0xacefce78e31332cf2d1b9e770d609c31d26afc09"}}}},
      {Trade: {Buy: {Seller: {is: "0xacefce78e31332cf2d1b9e770d609c31d26afc09"}}}}]}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Buyer
          Amount
          Currency {
            Name
          }
        }
        Dex {
          ProtocolName
        }
        Sell {
          Buyer
          Price
          Currency {
            Name
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

## Top Trader for a given token for a pair (Trade's PnL analysis)

To get top traders of a given token and analyze their profit and loss, you can use the following query.

Run this query [using this link](https://ide.bitquery.io/Top-traders-in-eth_1).

```graphql
query TopTraders($token: String) {
  EVM(network: eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volume"}
      limit: {count: 20}
      where: {Trade: {Currency: {SmartContract: {is: $token}}}, TransactionStatus: {Success: true}}
    ) {
      Transaction {
        From
      }
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Currency {
          Symbol
          Name
          SmartContract
        }
        Side {
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
      bought: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
        selectWhere: {gt: "0"}
      )
      sold: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
        selectWhere: {gt: "0"}
      )
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
variables:
{
  "token": "0xC90242Cd9959b7Be6EC01B5e99702Ee21161f3Ad"
}
```
