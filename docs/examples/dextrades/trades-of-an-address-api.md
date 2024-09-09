---
sidebar_position: 7
---

# Address Trades API

## Latest Trades for a given address

This GraphQL query retrieves the latest 10 buy-side and sell-side trades from the DEXTrades dataset on the Ethereum network for a specific buyer/seller.
You can view the query in the IDE [here](https://ide.bitquery.io/Trades-if-an-address)

```
{
  EVM(dataset: combined, network: eth) {
     DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {any: [{Trade: {Buy: {Buyer: {is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d"}}}}, {Trade: {Buy: {Seller: {is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d"}}}}]}
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

## Token trades for an specific address for a specific currency

You can view the query in the IDE [here](https://ide.bitquery.io/Trades-of-an-address-for-a-currency_1)

```
{
  EVM(network: eth, dataset: archive) {
    DEXTradeByTokens(
      where: {

        Trade: {
          Currency: {
          	SmartContract: {
              is: "0xcdf7028ceab81fa0c6971208e83fa7872994bee5"
            }
          }
        }

        any: [
      		{
            Transaction: {
              From: {
                is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d"
              }
            }
          }
          {
            Trade: {
              Buyer: {
                is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d"
              }
            }
          }
          {
            Trade: {
              Seller: {
                is: "0x152a04d9fde2396c01c5f065a00bd5f6edf5c88d"
              }
            }
          }
        ]}
    limit: {count: 10}
    ) {
      Transaction {
        From
        Hash
      }
      Trade {
        Amount
        Buyer
        Currency {
          Name
          Symbol
          SmartContract
        }
        Seller
        Price
        Dex {
          ProtocolName
          ProtocolVersion
          ProtocolFamily
          OwnerAddress
        }
        Side {
          Currency {
            SmartContract
            Symbol
            Name
          }
          Buyer
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
