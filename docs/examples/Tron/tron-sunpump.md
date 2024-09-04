# Sun Pump API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Sun Pump data.

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

We are parsing Sunpump DEX, meanwhile you can try following APIs/Streams.

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
      where: {Transaction: {Data: {includes: "1cc2c911"}, Result: {Success: true}}, Contract: {Address: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}}
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
      where: {Transaction: {Data: {includes: "d19aa2b9"}, Result: {Success: true}}, Contract: {Address: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}}
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
      where: {Transaction: {Data: {includes: "2f70d762"}, Result: {Success: true}}, 
        Contract: {Address: {is: "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw"}}}
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