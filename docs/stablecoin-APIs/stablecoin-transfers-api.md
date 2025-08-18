# Stablecoin Transfers API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Transfers data in this section.

## Stablecoin Realtime Transfers Stream

Below stream will give you realtime transfers of `USDC` on Solana. Test the stream [here](https://ide.bitquery.io/stablecoin-transfers-websocket).

```
subscription {
  Solana {
    Transfers(
      where: {Transfer: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
    ) {
      Transfer {
        Currency {
          MintAddress
          Symbol
          Name
          Fungible
          Native
        }
        Receiver {
          Address
        }
        Sender {
          Address
        }
        Amount
        AmountInUSD
      }
      Transaction{
        Signature
      }
    }
  }
}
```

## Stablecoin recieved and sent by an address

Below query will give you `EURC` transfers from/to `cHxJ2uC6vgcCfoFSfupkfCWbKHAkekrGfG39DXRamXT` on Solana. Test the query [here](https://ide.bitquery.io/stablecoin-Transfers-fromto-an-address).

```
{
  Solana {
    Transfers(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {any: [{Transfer: {Sender: {Address: {is: "cHxJ2uC6vgcCfoFSfupkfCWbKHAkekrGfG39DXRamXT"}}}}, {Transfer: {Receiver: {Address: {is: "cHxJ2uC6vgcCfoFSfupkfCWbKHAkekrGfG39DXRamXT"}}}}], Transfer: {Currency: {MintAddress: {is: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr"}}}}
    ) {
      Transaction {
        Signature
      }
      Transfer {
        Amount
        AmountInUSD
        Sender {
          Address
        }
        Receiver {
          Address
        }
      }
    }
  }
}
```
