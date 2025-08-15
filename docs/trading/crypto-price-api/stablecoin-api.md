# Stablecoin API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins.

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

## Stablecoin trades

Below stream will give you realtime trades of `USDT` on Solana. Test the stream [here](https://ide.bitquery.io/solana-trades-subscription_10_1).

```
subscription {
  Solana {
    DEXTrades (where:{any:[{Trade:{Buy:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}},{Trade:{Sell:{Currency:{MintAddress:{is:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}}}}}]}){
      Block{
        Time
        Slot
      }
      Transaction{
        Signature
        Index
        Result{
          Success
        }
      }
      Trade {
        Index
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            MetadataAddress
            Key
            MintAddress
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
          Order {
            LimitPrice
            LimitAmount
            OrderId
          }

        }
        Market {
          MarketAddress
        }
        Sell {
          Account {
            Address
          }
          Currency {
            IsMutable
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

## Stablecoin price

Below query will give you realtime price of `PYUSD` on Solana. Test the query [here](https://ide.bitquery.io/Get-Latest-Price-of-a-stablecoin-in-USD).

```
query {
  Solana {
    DEXTradeByTokens(
      limit:{count:1}
      orderBy:{descending:Block_Time}
      where: {Trade: {Currency: {MintAddress: {is: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo"}}}}
    ) {
      Transaction {
        Signature
      }
      Trade {
        AmountInUSD
        Amount
        Currency {
          MintAddress
          Name
        }
        Dex {
          ProgramAddress
          ProtocolName
        }
        Price
        PriceInUSD
        Side {
          Account {
            Address
          }
          AmountInUSD
          Amount
          Currency {
            Name
            MintAddress
          }
        }
      }
    }
  }
}
```

## Stablecoin Balance of an Address

Below stream will give you balance of `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM` for `FDUSD` on Solana. Test the query [here](https://ide.bitquery.io/FDUSD-balance-of-an-address).

```
query MyQuery {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Account: {Owner: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}, Currency: {MintAddress: {is: "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u"}}}}
      orderBy: {descendingByField: "BalanceUpdate_Balance_maximum"}
    ) {
      BalanceUpdate {
        Balance: PostBalance(maximum: Block_Slot)
        Currency {
          Name
          Symbol
        }
      }
    }
  }
}

```

## Stablecoin recieved and sent by an address

Below query will give you `EURC` transfers from/to `cHxJ2uC6vgcCfoFSfupkfCWbKHAkekrGfG39DXRamXT` on Solana. Test the query [here]().

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
