# Pump Swap API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to pump swap data. Additionally, we have the Pump Fun API available, and you can access its documentation [here](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Pump Swap API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Pump Swap based token through our Pump Swap API."/>
  <meta name="keywords" content="Pump Swap API,Pump Swap on-chain data API,Pump Swap token data API,Pump Swap blockchain API,Pump Swap DEX data API,Pump Swap API documentation,Pump Swap crypto API,Pump Swap web3 API,DEX Trades,Solana,Blast,Pump Swap memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to Get Pump Swap On-Chain Data with Pump Swap API"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Pump Swap based token through our Pump Swap API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Get Pump Swap On-Chain Data with Pump Swap API"/>
  <meta property="twitter:description" content="Get on-chain data of any Pump Swap based token through our Pump Swap API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Latest trades on PumpSwap

You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trades-API).

```graphql
{
  Solana(network: solana, dataset: realtime) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest trades on PumpSwap websocket

You can test out the query [here](https://ide.bitquery.io/pumpswap-trades).

```graphql
subscription {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProgramAddress: {
              is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
        }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Sell {
          Currency {
            Symbol
          }
        }
        Buy {
          Currency {
            Symbol
          }
        }
      }
      Transaction {
        Signature
      }
      Instruction {
        ExternalSeqNumber
        InternalSeqNumber
      }
    }
  }
}
```

## OHLC for PumpSwap token

You can test out the query [here](https://ide.bitquery.io/historical-ohlc-for-pumpswap).

```
{
  Solana(dataset: archive) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: "6qN87akZ3Ghs3JbGmnNMYP2rCHSBDwtiXttBV4Hspump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}, Instruction: {Program: {Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
      limit: {count: 10}
    ) {
      Block {
        Timefield: Time(interval: {in: hours, count: 1})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Slot)
        close: Price(maximum: Block_Slot)
      }
      count
    }
  }
}
```

## Latest trades of a trader

You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-api_1).

```
{
  Solana {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      limit: {count: 10}
      where: {
        Transaction:{
          Signer:{is:"78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}
        }
        Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest trades of a trader websocket

You can test out the query [here](https://ide.bitquery.io/Pumpswap-latest-Trade-for-a-trader-stream_1).

```
subscription {
  Solana {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {Transaction: {Signer: {is: "78mgMi3caj9CY5EdAW9FHhUoLcWB5suyfDF8dsQ2CNHR"}}, Trade: {Dex: {ProgramAddress: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Buy {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount
          AmountInUSD
          Account {
            Owner
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
            Fungible
            Uri
          }
        }
      }
      Transaction {
        Signature
        Signer
        FeePayer
      }
    }
  }
}
```

## Latest Trades for a token on Pumpswap

You can test out the query [here](https://ide.bitquery.io/Solana-trade-for-a-token_2).

```
{
  Solana {
    DEXTradeByTokens(
      where: {

        Trade: {
          Dex:{
            ProgramAddress:{
              is:"pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
            }
          }
          Currency:
        {MintAddress: {is: "63Fce97Uk5Ln1Y1F8Y73BJEN6iJL6p86AXmxTgZQpump"}}}}
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

## Latest Trades for a token on Pumpswap

You can test out the query [here](https://ide.bitquery.io/Solana-trade-for-a-token---stream).

```
subscription {
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Dex: {ProgramAddress:
        {is: "63Fce97Uk5Ln1Y1F8Y73BJEN6iJL6p86AXmxTgZQpump"}},
        Currency: {MintAddress:
          {is: "63Fce97Uk5Ln1Y1F8Y73BJEN6iJL6p86AXmxTgZQpump"}}}}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        Price
        PriceInUSD
        Amount
        AmountInUSD
        Price
        PriceInUSD
        Side {
          Type
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
      }
      Block {
        Time
        Height
        Slot
      }
      Transaction {
        Signature
        FeePayer
        Signer
      }
    }
  }
}
```

## Top Trader on Pumpswap

You can test out the query [here](https://ide.bitquery.io/top-traders-on-pumpswap).

```
{
  Solana(network: solana) {
    DEXTrades(
      where: {Instruction: {Program: {Address: {is: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"}}}}
      orderBy: {descendingByField: "txc"}
      limit: {count: 10}
    ) {
      txc: count
      trade_amount: sum(of: Trade_Buy_Amount)
      Trade {
        Buy {
          Account {
            Owner
            Address
            Token {
              Owner
            }
          }
        }
      }
    }
  }
}
```
