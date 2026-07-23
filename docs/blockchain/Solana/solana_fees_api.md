---
title: "Solana Fees API"
description: "Query and analyze Solana transaction fees using Bitquery’s Solana Fees API. Get data on DEX trades, wallet transfers, and total account fees"
---
# Solana Fees API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Solana Fees data.
We also have [PumpFun APIs](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/) to track Pump Fun token swaps, [PumpSwap APIs](/docs/blockchain/Solana/Pumpfun/pump-swap-api/) if you want to track the token after it has been migrated to PumpSwap AMM.
Additionally, you can also check out our [Moonshot APIs](/docs/blockchain/Solana/Moonshot-API/), [FourMeme APIs](/docs/blockchain/BSC/four-meme-api/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Get Trades with Transaction fees

Get a list of successful DEX trades on Solana along with the transaction fee details for each trade.
You can test the query [here](https://ide.bitquery.io/trades-with-transaction-fees#).

```
query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
        Slot
      }
      Trade {
        Account {
          Address
          Token {
            Owner
          }
        }
        AmountInUSD
        Amount
        PriceInUSD
        Price
        Dex {
          ProtocolName
        }
        Currency {
          MintAddress
          Name
        }
        Side {
          Account {
            Address
            Token {
              Owner
            }
          }
          Type
          AmountInUSD
          Amount
          Currency {
            Name
            MintAddress
          }
        }
      }
      Transaction {
        Signer
        Signature
        FeeInUSD
        Fee
        FeePayer
      }
    }
  }
}
```

## Get Transfers by an address and Transaction fees paid for the transfer

Track wallet token transfers and get the fees paid for each by the address.
You can test the query [here](https://ide.bitquery.io/wallet-transfers-with-transaction-fees-paid#).

```
query MyQuery {
  Solana {
    Transfers(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}}
    ) {
      Block {
        Time
      }
      Transfer {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Sender {
          Address
        }
        Receiver {
          Address
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signer
        Signature
      }
    }
  }
}
```

## Total transaction fees paid by an account

Get the total fees (in SOL and USD) paid by a specific Solana account across all transfers.
You can test the query [here](https://ide.bitquery.io/total-txn-fees-paid-by-the-Account#).

```
query MyQuery {
  Solana {
    Transfers(
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}}
    ) {
      Total_fees_paid_in_USD:sum(of:Transaction_FeeInUSD)
      Total_fees_paid_in_SOL:sum(of:Transaction_Fee)
  	}
	}
}
```

## Transaction fees paid by an account for each currency transfers

Get total fees paid by a Solana account for transferring each type of token.
You can test the query [here](https://ide.bitquery.io/Transaction-fees-paid-by-Account-aggregated-by-currency#).

```
query MyQuery {
  Solana {
    Transfers(
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}}
    ) {
      Transfer{
        Currency{
          Name
          Symbol
        }
      }
      Total_fees_paid_in_USD:sum(of:Transaction_FeeInUSD)
      Total_fees_paid_in_SOL:sum(of:Transaction_Fee)
  	}
	}
}
```

## Video Tutorial | How to get Total Fees paid by a Account on Solana

<VideoPlayer url="https://www.youtube.com/watch?v=xzNQ8S8L0-Q" />

## 🔗 Related Solana APIs

- **[Solana DEX Trades API](/docs/blockchain/Solana/solana-dextrades/)** - Monitor trading activities and their fees
- **[Solana Transfers API](/docs/blockchain/Solana/solana-transfers/)** - Track transfer fees and costs
- **[Solana Balance Updates API](/docs/blockchain/Solana/solana-balance-updates/)** - Monitor balance changes including fees
- **[Solana Instructions API](/docs/blockchain/Solana/solana-instructions/)** - Track instruction execution fees
- **[Solana Token Supply API](/docs/blockchain/Solana/token-supply-cube/)** - Monitor supply-related transaction fees
