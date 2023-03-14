---
sidebar_position: 5
---

# Pools API

With the Pools API, developers can easily retrieve information about liquidity providers, trading volumes, fees, and other key metrics for a variety of different pools.

## Latest pools for a specific DEX

```graphql
{
  EVM(dataset: combined, network: eth) {
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
        Path {
          Name
        }
        Type {
          Name
        }
        Value {
          String
        }
      }
    }
  }
}
```


You can find the query [here](https://graphql.bitquery.io/ide/Latest-pools-created-uniswap-v3)

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
  EVM(dataset: combined, network: eth) {
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
