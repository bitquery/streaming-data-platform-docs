---
title: "Tron Fees API"
description: "Tron Fees API: analyze Tron transaction fees and costs with Bitquery GraphQL queries and streams. Scale further with Kafka or gRPC streams."
---
# Tron Fees API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Tron Fees data.
For related memecoin fee and trade analytics on other chains, see [Pump.fun](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/), [PumpSwap](/docs/blockchain/Solana/Pumpfun/pump-swap-api/), [Moonshot](/docs/blockchain/Solana/Moonshot-API/), and [Four.meme](/docs/blockchain/BSC/four-meme-api/).
These APIs can also be delivered through Kafka streams for low-latency use cases — contact us on Telegram.

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Get Trades with Transaction fees

Get a list of successful DEX trades on Tron along with the transaction fee details for each trade.
You can test the query [here](https://ide.bitquery.io/tron-trades-with-transaction-fees#).

```
query MyQuery {
  Tron {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
        Number
      }
      Trade {
        Buyer
        Seller
        AmountInUSD
        Amount
        PriceInUSD
        Price
        Dex {
          ProtocolName
        }
        Currency {
          SmartContract
          Name
        }
        Side {
          Buyer
          Seller
          Type
          AmountInUSD
          Amount
          Currency {
            Name
            SmartContract
          }
        }
      }
      Transaction {
        Hash
        FeeInUSD
        Fee
        FeePayer
        Signatures
      }
    }
  }
}
```

## Get Transfers by an address and Transaction fees paid for the transfer

Track wallet token transfers and get the fees paid for each by the address.
You can test the query [here](https://ide.bitquery.io/tron-wallet-transfers-with-transaction-fees-paid).

```
query MyQuery {
  Tron {
    Transfers(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "TBgP9dqfZPfxLXPKPyXZCUT1XScTa3L3YW"}}}
    ) {
      Block {
        Time
      }
      Transfer {
        Currency {
          Name
          SmartContract
          Symbol
        }
        Sender
        Receiver
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Hash
        Signatures
      }
    }
  }
}
```

## Total transaction fees paid by an account

Get the total fees (in SOL and USD) paid by a specific Tron account across all transfers.
You can test the query [here](https://ide.bitquery.io/Tron-total-txn-fees-paid-by-the-Account#).

```
query MyQuery {
  Tron {
    Transfers(
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "TBgP9dqfZPfxLXPKPyXZCUT1XScTa3L3YW"}}}
    ) {
      Total_fees_paid_in_USD:sum(of:Transaction_FeeInUSD)
      Total_fees_paid_in_TRX:sum(of:Transaction_Fee)
  	}
	}
}
```

## Transaction fees paid by an account for each currency transfers

Get total fees paid by a Tron account for transferring each type of token.
You can test the query [here](https://ide.bitquery.io/Tron-Transaction-fees-paid-by-Account-aggregated-by-currency).

```
query MyQuery {
  Tron {
    Transfers(
      where: {Transaction: {Result: {Success: true}, FeePayer: {is: "TBgP9dqfZPfxLXPKPyXZCUT1XScTa3L3YW"}}}
    ) {
      Transfer{
        Currency{
          Name
          Symbol
        }
      }
      Total_fees_paid_in_USD:sum(of:Transaction_FeeInUSD)
      Total_fees_paid_in_TRX:sum(of:Transaction_Fee)
  	}
	}
}
```

## Video Tutorial | How to get Total Fees paid by a Account on Tron Network

<VideoPlayer url="https://www.youtube.com/watch?v=D-9Vp4zrPaU" />
