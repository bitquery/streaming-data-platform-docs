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

## Top Sun Pump tokens based on Marketcap

THis query will subscribe you to the latest created sun pump tokens. You will find the newly created token address in `Log { SmartContract }`.

Here’s [the query](https://ide.bitquery.io/New-tokens-on-sunpump_1#) to retrieve the latest tokens created on Sun Pump.

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
