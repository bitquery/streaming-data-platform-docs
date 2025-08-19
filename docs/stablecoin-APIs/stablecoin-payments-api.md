# Stablecoin Payments API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Payments data in this section.

## Ethereum

### Stablecoin Realtime Payments Stream on Eth Mainnet

Below stream will give you realtime payments of `USDC` on Eth mainnet. Test the stream [here](https://ide.bitquery.io/Stablecoin-Realtime-Payments-Stream-on-Eth-Mainnet).

```
subscription {
  EVM(network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}
```

## Solana

### Stablecoin Realtime Payments Stream on Solana

Below stream will give you realtime payments of `USDC` on Solana. Test the stream [here](https://ide.bitquery.io/stablecoin-transfers-websocket).

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
