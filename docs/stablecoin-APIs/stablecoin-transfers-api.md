# Stablecoin Transfers API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Transfers data in this section.

## Ethereum

### Stablecoin Realtime Transfers Stream on Eth Mainnet

Below stream will give you realtime transfers of `USDC` on Eth mainnet. Test the stream [here](https://ide.bitquery.io/Stablecoin-Realtime-Payments-Stream-on-Eth-Mainnet).

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

### Stablecoin mint/burn on Ethereum

Below API query will give you mint/burn data of `USDT` on Ethereum. Test the API [here](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Ethereum).

```
query MyQuery {
  EVM(network: eth, dataset: combined) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xdAC17F958D2ee523a2206206994597C13D831ec7"}}, Success: true}}
    ) {
      minted: sum(
        of: Transfer_Amount
        if: {Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}}}
      )
      burned: sum(
        of: Transfer_Amount
        if: {Transfer: {Receiver: {is: "0x0000000000000000000000000000000000000000"}}}
      )
    }
  }
}

```

## Solana

### Stablecoin Realtime Transfers Stream

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

### Stablecoin recieved and sent by an address

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
