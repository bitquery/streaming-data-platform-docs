# Sun Pump API

In this section, we will explore several examples related to Sun Pump data. These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Sun Pump API - Tron - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Sun Pump based token through our Sun Pump API."/>
  <meta name="keywords" content="Sun Pump API,Sun Pump on-chain data API,Sun Pump token data API,Sun Pump blockchain API,Sun Pump DEX data API,Sun Pump API documentation,Sun Pump crypto API,Sun Pump web3 API,DEX Trades,Tron,Sun Pump memecoins,Tron DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Get Sun Pump On-Chain Data with Sun Pump API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Sun Pump based token through our Sun Pump API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Get Sun Pump On-Chain Data with Sun Pump API"/>
  <meta property="twitter:description" content="Get on-chain data of any Sun Pump based token through our Sun Pump API."/>
</head>

## Latest Created Sunpump token

This query will subscribe you to the latest created sun pump tokens. You will find the newly created token address in `Log { SmartContract }`.

Here’s [the query](https://ide.bitquery.io/New-tokens-on-sunpump_1#) to retrieve the latest tokens created on Sun Pump.

If you remove `subscription` from the below GraphQL query it will become API, for example check [this api](https://ide.bitquery.io/latest-created-Sunpump-tokens).

```graphql
subscription MyQuery {
  Tron {
    Events(
      where: {
        Transaction: { Result: { Success: true } }
        Topics: {
          includes: {
            Hash: {
              in: [
                "8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
              ]
            }
          }
        }
      }
    ) {
      Log {
        SmartContract
      }
      Contract {
        Address
      }
      Transaction {
        Hash
        FeePayer
      }
    }
  }
}
```

## Latest Buy events on SunPump Tron

You can use following stream to get latest buys on Sunpump. You can try [this stream on IDE](https://ide.bitquery.io/latest-Buy-on-SunPump).

As I mentioned above, we are parsing Sunpump and then we will replace APIs.

```graphql
subscription {
  Tron(mempool: false) {
    BuyEvents: Events(
      where: {
        Transaction: {
          Data: { includes: "1cc2c911" }
          Result: { Success: true }
        }
        Contract: { Address: { is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw" } }
      }
    ) {
      Log {
        SmartContract
        Signature {
          Name
          SignatureHash
        }
      }
      Contract {
        Address
      }
      Transaction {
        Hash
        Timestamp
        Index
        FeePayer
      }
      LogHeader {
        Data
      }
      Block {
        Number
      }
      Topics {
        Hash
      }
    }
  }
}
```

## Latest Sell events on SunPump Tron

You can use following stream to get latest sells on Sunpump. You can try [this stream on IDE](https://ide.bitquery.io/sunpump-sell-event).

```graphql
subscription {
  Tron(mempool: false) {
    SellEvents: Events(
      where: {
        Transaction: {
          Data: { includes: "d19aa2b9" }
          Result: { Success: true }
        }
        Contract: { Address: { is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw" } }
      }
    ) {
      Log {
        SmartContract
        Signature {
          Name
          SignatureHash
        }
      }
      Contract {
        Address
      }
      Transaction {
        Hash
        Timestamp
        Index
        FeePayer
      }
      LogHeader {
        Data
      }
      Block {
        Number
      }
      Topics {
        Hash
      }
    }
  }
}
```

## First Time Buy Event on Sunpump

You can use follow stream to get stream of first time buy event for any new token.

You can try [this stream on IDE](https://ide.bitquery.io/Tron-sunpump-first-time-buy-event_1).

```graphql
subscription {
  Tron(mempool: false) {
    BuyEventsFirstTime: Events(
      where: {
        Transaction: {
          Data: { includes: "2f70d762" }
          Result: { Success: true }
        }
        Contract: { Address: { is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw" } }
      }
    ) {
      Log {
        SmartContract
        Signature {
          Name
          SignatureHash
        }
      }
      Contract {
        Address
      }
      Transaction {
        Hash
        Timestamp
        Index
        FeePayer
      }
      LogHeader {
        Data
      }
      Block {
        Number
      }
      Topics {
        Hash
      }
    }
  }
}
```

# Tron DEX Trade API

Currently Tron DEX trade API doesn't have Sunpump for now, but it has other DEXs including Sunswap and we are in process of adding Sunpump in DEX trades api.

You can try [this API on our IDE](https://ide.bitquery.io/Tron-dex-trades).

```
subscription {
  Tron(mempool: false) {
    DEXTrades(where: {Transaction: {Result: {Success: true}}}) {
      Trade {
        Dex {
          ProtocolName
          SmartContract
          OwnerAddress
          Pair {
            Name
            SmartContract
          }
        }
        Buy {
          Currency {
            AssetId
            SmartContract
            Symbol
            Fungible
          }
          Amount
          Buyer
          Seller
          Price
          Ids
          OrderId
        }
        Sell {
          Currency {
            AssetId
            SmartContract
            Symbol
            Fungible
          }
          Price
          Amount
        }
        Success
      }
      Transaction {
        Hash
        Index
        Result {
          Success
        }
        Timestamp
      }
      Block {
        Number
      }
    }
  }
}
```

## Track Token Launch to Sunswap

This query allows you to track when tokens are launched on SunSwap using the `launchToDEX` function. It returns the most recent 10 token launches, displaying details such as the token address, transaction hash, block timestamp, and the method call signature.

**Arguments**: Includes the `token` address and any other relevant parameters passed during the `launchToDEX` method call.
You can use the **token** argument to get the address of the token that was launched.
You can run the query [here](https://ide.bitquery.io/sunmpump-launchtoDEX_1)

```
query MyQuery {
  Tron(network: tron, dataset: realtime) {
    Calls(
      where: {Call: {To: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}, Signature: {Name: {is: "launchToDEX"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Call {
        Signature {
          Name
        }
      }
      Arguments {
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
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}

```

## Track Token Create Events on Sunpump

This query allows you to track `TokenPurchased` events on SunPump. It retrieves the 10 most recent token purchase events, showing important details such as the token address, buyer information, transaction hash, and token amount involved.
The arguments has key event parameters like the token address, buyer, transaction amount, fees, and token reserve values.

You can run the query [here](https://ide.bitquery.io/TokenPurchased-on-Sunpump)

```
{
  Tron {
    Events(
      where: {Log: {Signature: {Name: {is: "TokenPurchased"}}}}
      limit: {count: 10}
    ) {
      Log {
        Signature {
          Name
          SignatureHash
        }
      }
      Transaction {
        Hash
        Timestamp
      }
      Topics {
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
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
        }
      }
      Call {
        From
        To
      }
    }
  }
}

```

## Track Token Creation on Sunpump in Realtime

This subscription allows you to track new tokens being created on SunPump in real time. It captures the latest `TokenCreate` events, providing important details such as the token address, creator, and transaction information.

The `Arguments` include the token address, creator, and token index.
You can run it [here](https://ide.bitquery.io/Latest-tokens-created-on-Sunpump_2)

```
subscription{
  Tron {
    Events(
      where: {Log: {Signature: {Name: {is: "TokenCreate"}}}}

    ) {
      Log {
        Signature {
          Name
          SignatureHash
        }
      }
      Transaction {
        Hash
        Timestamp
      }
      Topics {
        Hash
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
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
        }
      }
      Call {
        From
        To
      }
    }
  }
}

```
