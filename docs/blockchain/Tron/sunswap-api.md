---
title: "Tron Sunswap API"
description: "Tron Sunswap API: query and stream Tron on-chain data with Bitquery GraphQL examples for developers. See examples in the Bitquery IDE."
---
# Tron SunSwap API

**[Bitquery](https://bitquery.io)** provides useful tron activity through **GraphQL** (on-demand queries and live **subscriptions**), and high-throughput Kafks streams for enterprise teams.

This page documents **SunSwap**-related examples on **Tron**—events, contracts, and streams you can copy into the IDE. For general Tron DEX trade patterns, see the [Tron DEX Trades API](/docs/blockchain/Tron/tron-dextrades). If you are new here, start with [Your first query](/docs/start/first-query).

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## New Tokens on Sunpump and Sell event in Tron Mempool

You can use following query to get new tokens and sell event using following stream.

Here is [link]( https://ide.bitquery.io/Events-with-argumens) using which you can run it on our IDE.

```graphql
subscription {
  Tron(mempool: true) {
    NewTokenEvents: Events(
      where: {Log: {SmartContract: {not: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}, Transaction: {Result: {Success: true}, Data: {includes: "2f70d762"}}, Topics: {includes: {Hash: {in: ["8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"]}}}, Contract: {Address: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}}
      orderBy: {descending: Block_Time}
    ) {
      Log {
        SmartContract
      }
      Transaction {
        FeePayer
      }
    }
    SellEvents: Events(
      where: {Log: {SmartContract: {not: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}, Transaction: {Data: {includes: "d19aa2b9"}, Result: {Success: true}}, Contract: {Address: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}}
      orderBy: {descending: Block_Time}
    ) {
      Log {
        SmartContract
        Signature {
          Signature
        }
      }
      Transaction {
        FeePayer
      }
      Arguments {
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

## Latest Trades on Sunswap

To fetch the most recent trades on SunSwap, you can filter the trades by using the SunSwap router address `TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax`. This query will return the latest 100 trades most recent first.

The query retrieves details about each trade, including the amounts and prices of tokens bought and sold, as well as information about the trading pair.
You can find the query [here](https://ide.bitquery.io/sunswap-v2-latest-Trades)

```graphql
query MyQuery {
  Tron(dataset: realtime, network: tron) {
    DEXTrades(
      where: {Contract: {Address: {is: "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax"}}}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Amount
          Currency {
            Name
            SmartContract
          }
          Buyer
          Price
        }
        Dex {
          ProtocolName
          Pair {
            SmartContract
            Name
          }
        }
        Sell {
          Amount
          Price
          Currency {
            Name
          }
        }
      }
    }
  }
}

```

## Latest Trades of a Token on Sunswap

You can run the query [here](https://ide.bitquery.io/sunswap-latest-Trades-of-token)
```graphql
query MyQuery {
  Tron(dataset: realtime, network: tron) {
    DEXTrades(
      where: {Contract: {Address: {is: "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax"}},
        any:[ {Trade: {Buy: {Currency: {SmartContract: {is: "TM3k1FoDYhn3Yadaeqb5aCyvWo7ZbHWjng"}}}}},{Trade: {Sell: {Currency: {SmartContract: {is: "TM3k1FoDYhn3Yadaeqb5aCyvWo7ZbHWjng"}}}}}]}
      limit: {count: 100}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Amount
          Currency {
            Name
            SmartContract
          }
          Buyer
          Price
        }
        Dex {
          ProtocolName
          Pair {
            SmartContract
            Name
          }
        }
        Sell {
          Amount
          Price
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
