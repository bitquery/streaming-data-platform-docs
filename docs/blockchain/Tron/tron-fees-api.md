# Tron Fees API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Tron Fees data.
We also have [PumpFun APIs](https://docs.bitquery.io/docs/blockchain/Tron/Pump-Fun-API/) to track Pump Fun token swaps, [PumpSwap APIs](https://docs.bitquery.io/docs/blockchain/Tron/pump-swap-api/) if you want to track the token after it has been migrated to PumpSwap AMM.
Additionally, you can also check out our [Moonshot APIs](https://docs.bitquery.io/docs/blockchain/Tron/Moonshot-API/), [FourMeme APIs](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Tron Fees API - Track Transaction Fees on Tron DApps"/>
  <meta name="description" content="Query and analyze Tron transaction fees using Bitquery’s Tron Fees API. Get data on DEX trades, wallet transfers, and total account fees."/>
  <meta name="keywords" content="Tron Fees API,Tron transaction fees,Tron Blockchain Data API,Track Tron DEX fees,Tron wallet fee analytics,crypto fees,Tron gas fees,Tron API,Kafka Tron API,Blockchain Data API,Tron token fees,Tron fee explorer"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Track Tron Transaction Fees with Tron Fees API" />
  <meta property="og:description" content="Analyze transaction fees on Tron including DEX trades, wallet transfers, and account-level metrics using Bitquery’s Tron Fees API." />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Track Tron Transaction Fees with Tron Fees API"/>
  <meta property="twitter:description" content="Analyze transaction fees on Tron including DEX trades, wallet transfers, and account-level metrics using Bitquery’s Tron Fees API."/>
</head>

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
