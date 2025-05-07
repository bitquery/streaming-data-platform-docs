---
title: EVM Fees API
---

<head>
<meta name="title" content="EVM Miner Rewards API"/>
<meta name="description" content= "EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain."/>
<meta name="keywords" content="EVM api, EVM balance, EVM balance history, EVM python api, EVM nft api, EVM scan api, EVM matic api, EVM api docs, EVM crypto api, EVM blockchain api,matic network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="EVM Miner Rewards API" />
<meta property="og:description" content="EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="EVM Miner Rewards API" />
<meta property="twitter:description" content="EVM balance API will help get the balance or balance history of any address or smart contract on the EVM blockchain." />
</head>

## Get Trades with Transaction fees

Get a list of successful DEX trades on EVM along with the transaction fee details for each trade.
You can test the query [here](https://ide.bitquery.io/trades-with-the-transaction-fees_1#).

```
query MyQuery {
  EVM {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true}}
    ) {
      Block {
        Time
      }
      Trade {
        AmountInUSD
        Amount
        Buyer
        Seller
        Currency {
          SmartContract
          Name
          Symbol
        }
        Side {
          Currency {
            Symbol
            SmartContract
            Name
          }
          Seller
          Buyer
          AmountInUSD
          Amount
        }
      }
      Transaction {
        From
        To
        Hash
      }
      joinTransactions(join: inner, Transaction_Hash: Transaction_Hash) {
        Fee {
          SenderFee
          SenderFeeInUSD
        }
      }
    }
  }
}
```

## Get Transfers by an address and Transaction fees paid for the transfer

Track wallet token transfers and get the fees paid for each by the address.
You can test the query [here](https://ide.bitquery.io/binancehot-wallet-transfers-with-transaction-fees).

```
query MyQuery {
  EVM {
    Transfers(
      where: {Transaction: {From: {is: "0xF977814e90dA44bFA03b6295A0616a897441aceC"}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Fee {
        SenderFee
        SenderFeeInUSD
      }
      Transfer {
        Currency {
          Name
          SmartContract
          Symbol
        }
        Amount
        AmountInUSD
      }
    }
  }
}
```

## Total transaction fees paid by an account

Get the total fees (in Eth and USD) paid by a specific EVM account across all transfers.
You can test the query [here](https://ide.bitquery.io/total-txn-fees-paid-by-binance-hot-wallet-in-a-day).

```
query MyQuery {
  EVM(dataset: combined, aggregates: yes) {
    Transfers(
      where: {Transaction: {From: {is: "0xF977814e90dA44bFA03b6295A0616a897441aceC"}}, TransactionStatus: {Success: true}, Block: {Time: {till: "2025-05-07T00:00:00Z", since: "2025-05-06T00:00:00Z"}}}
    ){
      Total_Transaction_Fees_paid_in_ETH:sum(of:Fee_SenderFee)
      Total_Transaction_Fees_paid_in_USD:sum(of:Fee_SenderFeeInUSD)
    }
  }
}
```

## Transaction fees paid by an account for each currency transfers

Get total fees paid by a EVM account for transferring each type of token.
You can test the query [here](https://ide.bitquery.io/Transaction-fees-paid-by-Binance-Hot-Wallet-aggregated-by-currency)

```
query MyQuery {
  EVM(dataset: combined, aggregates: yes) {
    Transfers(
      where: {Transaction: {From: {is: "0xF977814e90dA44bFA03b6295A0616a897441aceC"}}, TransactionStatus: {Success: true}, Block: {Time: {till: "2025-05-07T00:00:00Z", since: "2025-05-06T00:00:00Z"}}}
      orderBy: {descendingByField: "Total_Transaction_Fees_paid_in_USD"}
    ) {
      Transfer {
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      Total_Transaction_Fees_paid_in_ETH: sum(of: Fee_SenderFee)
      Total_Transaction_Fees_paid_in_USD: sum(of: Fee_SenderFeeInUSD)
    }
  }
}
```
