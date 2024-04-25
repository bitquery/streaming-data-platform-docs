# OpBNB NFT API

In this section we'll have a look at some examples using the OpBNB NFT API.

This OpBNB API is part of our Early Access Program (EAP), which is intended for evaluation purposes.

This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

<head>
<meta name="title" content="OpBNB NFT API - The Ultimate Solution to get your NFT data"/>
<meta name="description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."/>
<meta name="keywords" content="OpBNB NFT API, NFT trades API, NFT balance api, NFT pricing history api, nft python api, nft api, rarible api, opensea api, nft api docs, nft crypto api, nft blockchain api,OpBNB network api, OpBNB web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="OpBNB NFT API - The Ultimate Solution to get your NFT data"
/>
<meta
  property="og:description"
  content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="OpBNB NFT API - The Ultimate Solution to get your NFT data"/>
<meta property="twitter:description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades." />
</head>

## Track transfers of an NFT in Realtime

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the OpBNB network.
You can find the query [here](https://ide.bitquery.io/Real-time-transfer-websocket-for-NFT-token_1)

```
subscription {
  EVM(network: opbnb) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x4083D2D748fC47fA15596D07baAC7B3Eb7022348" }
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
          Native
        }
        Sender
        Receiver
      }
    }
  }
}



```
