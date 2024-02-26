---
sidebar_position: 5
---

# Pools API

With the Pools API, developers can easily retrieve information about liquidity providers, trading volumes, fees, and other key metrics for a variety of different pools.

## Latest pools for a specific DEX

```graphql
{
  EVM(dataset: archive, network: eth) {
    Events(
      orderBy: {descending: Block_Number}
      limit: {count: 10}
      where: {Log: {SmartContract: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}, Signature: {Name: {is: "PoolCreated"}}}}
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
        SmartContract
      }
      Transaction {
        Hash
      }
      Block {
        Date
        Number
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
        Name
      }
    }
  }
}

```


You can find the query [here](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_4)

 **Parameters**
-   `dataset`: Specifies the dataset used for the query. In this case, it is set to "combined".
-   `network`: Specifies the network on which the query is executed. In this case, it is set to "eth".
-   `where`: A filter used to retrieve events related to the creation of a Uniswap V2 pool on the specified DEX. It is applied to both "Log" and "Signature" objects and uses the "is" operator to specify the smart contract address of the DEX and the name of the event signature respectively.
-   `orderBy`: Specifies the order in which the events are returned. In this case, it is ordered in descending order based on block number.
-   `limit`: Limits the number of events returned in the query. In this case, it is set to 10.

**Returned Data** 
-   `Log`: Returns information about the log event, including the signature and the smart contract address.
-   `Transaction`: Returns information about the transaction in which the event occurred, including the transaction hash.
-   `Block`: Returns information about the block in which the event occurred, including the block number and the block timestamp.
-   `Arguments`: Returns the arguments associated with the event, including the token addresses and initial liquidity of the pool.


Based on the arguments used we can query the latest pools using [this query below](https://graphql.bitquery.io/ide/Latest-Pair-Created-by-timeStamp-after) in the https://graphql.bitquery.io endpoint.

The following GraphQL query retrieves data on the latest 50 PairCreated events on the Ethereum network, along with their associated block timestamp, token0 address and name. It uses the ethereum network and the arguments from the query above to filter events based on specific criteria.

```graphql
{
  ethereum(network: ethereum) {
    arguments(
      options: {desc: ["block.timestamp.time"], limit: 50}
      smartContractEvent: {is: "PairCreated"}
      time: {after: "2023-03-11T18:47:55+00:00"}
    ) {
      block {
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      token0: any(of: argument_value, argument: {is: "token0"})
      token0Name: any(of: argument_value, argument: {is: "token0"}, as: token_name)
    }
  }
}
```
 **Parameters**
-   `network`: Specifies the network used for the query. In this case, it is set to "ethereum".
-   `smartContractEvent`: Filters the events to include only those with the `PairCreated` event signature.
-   `time`: Filters the events to include only those occurring after the specified time.
-   `options`: Specifies additional options for the query. In this case, it sorts the events in descending order based on block timestamp and limits the number of events returned to 50.

**Returned Data** 
-   `block`: Returns information about the block in which the event occurred, including the block timestamp.
-   `timestamp`: Returns the block timestamp in a specified format.
-   `token0`: Returns the `token0` address associated with the event.
-   `token0Name`: Returns the name of the `token0` token, using the `as` parameter to specify the field name.




## Trade Stats for a particular Pool on a specific DEX

Here's an example GraphQL query that retrieves the sum of sell amounts for trades between WETH and USDT made on the Uniswap V3 exchange .
```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    DEXTrades(
      where: {Block: {Date: {after: "2023-03-12"}}, Trade: {Dex: {SmartContract: {is: "0x11b815efB8f581194ae79006d24E0d814B7697F6"}}}} ##Uniswap V3 pool to exchange between WETH and USDT.
    ) {
      sum(of: Trade_Sell_Amount)
      Block {
        Date
      }
    }
  }
}
```
You can find the query [here](https://graphql.bitquery.io/ide/Daily-Trade-Amount-of-a-Pool)

**Parameters**
-   `dataset` : Specifies the dataset used for the query. In this case, it is set to "combined".
-   `network` : Specifies the network on which the query is executed. In this case, it is set to "eth".
-   `where` : A filter used to retrieve trades executed on the Uniswap V3 exchange for WETH and USDT within a specific time period. It is applied to both "Block" and "Trade" objects and uses the "after" operator to specify the start date of the time period. The "is" operator is used to specify the smart contract address of the Uniswap V3 pool used for the exchange.

**Returned Data**

-   `sum` : Calculates the sum of a specific field, which in this case is "Trade_Sell_Amount".
-   `Block` : Returns information about the block in which the trade was executed, including the date of the block in the "Date" subfield.


## Tokens in the Pair

If you have the address of a smart contract for a liquidity pool (aka a trading pair), and you want to find out which tokens are part of this pool, you can use the following query. 

This query will provide you with information about the tokens used in the pool, including their name, symbol, smart contract address, and other details such as the token type (erc20 or erc1155) and much more.

You can run [this query](https://ide.bitquery.io/details-of-tokens-in-a-pair) in our IDE to check out the results.

```graphql
{
  EVM(dataset: archive, network: arbitrum) {
    DEXTrades(
      limit: {count: 1, offset: 0}
      orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {SmartContract: {is: "0xcda53b1f66614552f834ceef361a8d12a0b8dad8"}}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          SmartContract
          Pair {
            SmartContract
          }
        }
        Buy {
          Currency {
            SmartContract
            Symbol
            Name
            ProtocolName
          }
        }
        Sell {
          Currency {
            SmartContract
            Symbol
            Name
            ProtocolName
          }
        }
      }
    }
  }
}
```


## Liquidity of a Pool

The below query finds the liquidity of USDT-WBTC-WETH pool on Curve.Fi using the pool address `0xD51a44d3FaE010294C616388b506AcdA1bfAAE46`. With this query we can get what tokens are in the pool and in what proportions in the pool.
You can find the query [here](https://ide.bitquery.io/Curvefi-USDTWBTCWETH-Pool-liquidity)
```
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```


## Initial Liquidity, Current Liquidity and Trade Volume for a given pair

The below query finds the inital liquidity, current liquidity and trade volume of USDT-WETH pool on Uniswap using the pool address `0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852`.

You can find the query [here](https://ide.bitquery.io/Pools-details_1)
```
{
  EVM(dataset: archive, network: eth) {
    Initial_liquidity: Transfers(
      limit: {count: 2}
      orderBy: {ascending: Block_Time}
      where: {Transfer: {Receiver: {is: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          SmartContract
          Name
          Symbol
        }
      }
    }
    Current_liquidity: BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"}}, Currency: {SmartContract: {in: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
        SmartContract
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
    volume: DEXTrades(
      where: {Block: {Time: {since: "2023-12-28T10:01:55.000Z"}}, Trade: {Dex: {Pair: {SmartContract: {is: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"}}}}}
    ) {
      token1_vol: sum(of: Trade_Buy_Amount)
      token2_vol: sum(of: Trade_Sell_Amount)
    }
  }
}


```


