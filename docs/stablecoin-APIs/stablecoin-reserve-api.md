# Stablecoin Reserve API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime reserves data, realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Transfers data in this section.

## Ethereum

### USDT Stablecoin reserves on Ethereum

Below API query will give you realtime reserves data of `USDT` on Ethereum. Test the API [here](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Ethereum).

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

### USDC Stablecoin reserves on Solana

Below API query will give you realtime reserves data of `USDC` on Solana. Test the API [here](https://ide.bitquery.io/USDC-Stablecoin-reserves-on-Solana).

```
{
  Solana {
    TokenSupplyUpdates(
      limit:{count:1}
      orderBy:{descending:Block_Time}
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}}}}
    ) {
      TokenSupplyUpdate {
        Amount
        Currency {
          MintAddress
          Name
        }
        PreBalance
        PostBalance
      }
    }
  }
}
```
