<head>
<meta name="title" content="Base NFT API - The Ultimate Solution to get your NFT data"/>
<meta name="description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."/>
<meta name="keywords" content="Base NFT API, NFT trades API, NFT balance api, NFT pricing history api, nft python api, nft api, rarible api, opensea api, nft api docs, nft crypto api, nft blockchain api,Base network api, Base web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Base NFT API - The Ultimate Solution to get your NFT data"
/>
<meta
  property="og:description"
  content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Base NFT API - The Ultimate Solution to get your NFT data"/>
<meta property="twitter:description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades." />
</head>

# Base Chain NFT API

In this section we'll have a look at some examples using the Base NFT API.
This Base API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Track all transfers of an NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Base network.
You can find the query [here](https://ide.bitquery.io/Transfers-of-a-particular-NFT_1#)

```
subscription {
  EVM(network: base) {
    Transfers(
      where: {
        Transfer: {
          Currency: {
            Fungible: false
            SmartContract: { is: "0x1195Cf65f83B3A5768F3C496D3A05AD6412c64B7" }
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
