# BSC NFT API

In this section we'll have a look at some examples using the BSC NFT API.

<head>
<meta name="title" content="BSC NFT API - The Ultimate Solution to get your NFT data"/>
<meta name="description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."/>
<meta name="keywords" content="BSC NFT API, NFT trades API, NFT balance api, NFT pricing history api, nft python api, nft api, rarible api, opensea api, nft api docs, nft crypto api, nft blockchain api,BSC network api, BSC web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC NFT API - The Ultimate Solution to get your NFT data"
/>
<meta
  property="og:description"
  content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC NFT API - The Ultimate Solution to get your NFT data"/>
<meta property="twitter:description" content="Get NFT data through our powerful and highly scalabe NFT API. Access all information about pricing history, NFT balances, and NFT trades." />
</head>

## Track Transfers of a specific NFT on BSC in Realtime

This query subscribes you to the real time non-fungible token (NFT) transfers of a specific nft contract on the BSC network.
You can find the query [here](https://ide.bitquery.io/Track-realtime-NFT-Transfers-of-a-specific-NFT-on-BSC-chain)

```
subscription {
  EVM(network: bsc) {
    Transfers(
      where: {Transfer: {Currency: {Fungible: false, SmartContract: {is: "0x3d2c83bbbbfb54087d46b80585253077509c21ae"}}}}
    ) {
      Block {
        Hash
        Number
      }
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
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
