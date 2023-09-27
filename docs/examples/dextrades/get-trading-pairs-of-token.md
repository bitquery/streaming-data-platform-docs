---
sidebar_position: 2
---

# Trading Pairs API

If you want to get all trades of a token, you might want to know all its trading pairs.
Protocols like Uniswap have pairs or pools. In this section we will see how we can get all pairs of currency for DEXs.

## Get all Trade Metrics (trade amount, tx count) for a Pair

This query can be used to get all trade metrics (trade amount, TX count) for a given pair ( in this case WETH/CaL) on a given EVM network over a particular time period.

```
query ($network: evm_network, $token: String!, $token2: String!) {
  EVM(network: $network, dataset: combined) {
    Unique_Buyers: DEXTrades(
      where: {Block: {Time: {since: "2023-09-27T01:00:00Z", till: "2023-09-27T02:00:00Z"}}, Trade: {Buy: {Currency: {SmartContract: {is: $token}}}, Sell: {Currency: {SmartContract: {is: $token2}}}}}
    ) {
      count(distinct: Trade_Buy_Buyer)
    }
    Unique_Sellers: DEXTrades(
      where: {Block: {Time: {since: "2023-08-26T01:00:00Z", till: "2023-08-26T02:00:00Z"}}, Trade: {Sell: {Currency: {SmartContract: {is: $token}}}, Buy:{Currency:{SmartContract:{is: $token2}}}}}
    ) {
      count(distinct: Trade_Sell_Seller)
    }
    Total_Transactions: DEXTrades(
      where: {Block: {Time: {since: "2023-09-27T01:00:00Z", till: "2023-09-27T02:00:00Z"}}, Trade: {Buy: {Currency: {SmartContract: {is: $token}}}, Sell: {Currency: {SmartContract: {is: $token2}}}}}
    ) {
      count(distinct: Transaction_Hash)
    }
    Total_Buy_Amount: DEXTrades(
      where: {Block: {Time: {since: "2023-09-27T01:00:00Z", till: "2023-09-27T02:00:00Z"}}, Trade: {Buy: {Currency: {SmartContract: {is: $token}}}, Sell: {Currency: {SmartContract: {is: $token2}}}}}
    ) {
      sum(of:Trade_Buy_Amount)
    }
    Total_Sell_Amount: DEXTrades(
      where: {Block: {Time: {since: "2023-09-27T01:00:00Z", till: "2023-09-27T02:00:00Z"}}, Trade: {Buy: {Currency: {SmartContract: {is: $token}}}, Sell: {Currency: {SmartContract: {is: $token2}}}}}
    ) {
      sum(of:Trade_Sell_Amount)
    }
  }
}

```

It returns:

- **Unique_Buyers:** The number of unique buyers for the given pair during the specified time period.
- **Unique_Sellers:** The number of unique sellers for the given pair during the specified time period.
- **Total_Transactions:** The total number of transactions for the given pair during the specified time period.
- **Total_Buy_Amount:** The total amount of the first token bought during the specified time period.
- **Total_Sell_Amount:** The total amount of the first token sold during the specified time period.

## Get all pairs of a token across different DEXs

Let's get all pairs of the [BLUR token](https://explorer.bitquery.io/ethereum/token/0x5283d291dbcf85356a21ba090e6db59121208b44). In the following query, we are not defining any DEX details; therefore, we will get pairs across DEXs supported by Bitquery.
We are just providing the BLUR token as buy currency.

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x5283d291dbcf85356a21ba090e6db59121208b44"
              }
            }
          }
        }
      }
      limit: { count: 10 }
      limitBy: { by: Trade_Sell_Currency_SmartContract, count: 1 }
    ) {
      Trade {
        Dex {
          ProtocolName
          OwnerAddress
          ProtocolVersion
          Pair {
            SmartContract
            Name
            Symbol
          }
        }
        Buy {
          Currency {
            Name
            SmartContract
          }
        }
        Sell {
          Currency {
            Name
            SmartContract
          }
        }
      }
    }
  }
}
```

Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/Pair-tokens-for-BLUR-token-for-all-DEXs_1)

**Parameters**

- `dataset: combined`: specifies that the data should be retrieved from a combined dataset, which includes both historical and realtime data.
- `network: eth`: specifies that the data should be retrieved from the Ethereum network.
- `DEXTrades`: specifies that we want to retrieve information on DEX trades.
- `where`: specifies a filter to apply to the results. In this case, we're filtering by the buy currency's smart contract address, which is set to "0x5283d291dbcf85356a21ba090e6db59121208b44".
- `limit`: specifies the maximum number of results to return. In this case, we're limiting the results to 10.
- `limitBy`: specifies how to limit the results. In this case, we're limiting the results by the smart contract address of the sell currency, and we're only returning 1 result per smart contract.

**Returned Data**

- `Trade`: represents the DEX trade, which includes information about the DEX itself (e.g. owner address, protocol version), the currency pair being traded (e.g. smart contract address, name, symbol), and the buy and sell currencies being exchanged (each represented as an object containing the currency's name and smart contract address).
- `Dex`: represents the DEX itself, including the protocol name, owner address, and protocol version.
- `Buy`: represents the currency being bought in the trade, including the currency's name and smart contract address.
- `Sell`: represents the currency being sold in the trade, including the currency's name and smart contract address.

## Get all pairs of a token from a specific DEX

Now, let's see an example of getting all pairs of a token for a specific DEX. In this example, we will get all pairs of the [BLUR token](https://explorer.bitquery.io/ethereum/token/0x5283d291dbcf85356a21ba090e6db59121208b44) for the Uniswap v3 protocol; therefore, we will mention [Uniswap v3 factory smart contract address](https://explorer.bitquery.io/ethereum/smart_contract/0x1f98431c8ad98523631ae4a59f267346ea31f984/transactions).

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              SmartContract: {
                is: "0x5283d291dbcf85356a21ba090e6db59121208b44"
              }
            }
          }
          Dex: {
            OwnerAddress: { is: "0x1f98431c8ad98523631ae4a59f267346ea31f984" }
          }
        }
      }
      limit: { count: 10 }
      limitBy: { by: Trade_Sell_Currency_SmartContract, count: 1 }
    ) {
      Trade {
        Dex {
          ProtocolName
          OwnerAddress
        }
        Buy {
          Currency {
            Name
            SmartContract
          }
        }
        Sell {
          Currency {
            Name
            SmartContract
          }
        }
      }
    }
  }
}
```

Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/pairs-of-blur-token-new-dataset_1)

**Parameters**:

- `dataset`: The dataset to use for the query, in this case `combined` which retrieves data from both historical and real-time sources.
- `network`: The blockchain network to retrieve data from, in this case `eth` for Ethereum.
- `where`: A filter object to narrow down the results to only the trades that match the specified criteria. In this case, the filter object is used to retrieve trades where the buy currency smart contract address is "0x5283d291dbcf85356a21ba090e6db59121208b44" and the DEX owner address is "0x1f98431c8ad98523631ae4a59f267346ea31f984".
- `limit`: The maximum number of results to return, in this case set to 10.
- `limitBy`: A grouping option to limit the number of results per group, in this case set to 1 for the smart contract address of the sell currency.

**Returned Data:**

The query returns an object containing a list of DEX trades, each with the following fields:

- `Dex`: An object containing information about the DEX, including the protocol name and owner address.
- `Buy`: An object containing information about the buy currency, including the name and smart contract address.
- `Sell`: An object containing information about the sell currency, including the name and smart contract address.
