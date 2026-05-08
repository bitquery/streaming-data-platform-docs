# Tron Transfers API

In this section we'll have a look at some examples using the Tron Transfers API.

<head>
<meta name="title" content="Tron Transfers API"/>
<meta name="description" content="Get all historical & realtime transfers details for an address or a 
contract, capturing internal transfers, external transfers and token transfers."/>
<meta name="keywords" content="Real time Tron transfers, Stream Tron transfers, Tron transfers subscription, Tron transfer websocket, Tron whale transfers stream, Tron transfers api, Tron transfers python api, Tron transfers scan api, Tron transfers api docs, transfers crypto api, transfers blockchain api, Tron network api, Tron Kafka stream"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Tron Transfers API"
/>
<meta
  property="og:description"
  content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Tron Transfers API" />
<meta property="twitter:description" content="Get all historical & realtime transfers for an address or a contract, capturing internal transfers, external transfers and token transfers." />
</head>

## Subscribe to Recent Whale Transactions of a particular currency

The subscription query below fetches the whale transactions on the Tron network. We have used USDT address `TThzxNRLrW2Brp9DcTQU8i4Wd9udCWEdZ3`. You can find the query [here](https://ide.bitquery.io/Whale-transfers-of-USDT-on-Tron)

```
subscription{
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TThzxNRLrW2Brp9DcTQU8i4Wd9udCWEdZ3"}}, Amount: {ge: "10000"}}}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          SmartContract
          Symbol
          Name
          Fungible
          Native
        }
        Id
      }
    }
  }
}


```

## Top Transfers of a Token

This query retrieves the top 10 transfers by amount of the token `TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT`. Try the query [here](https://ide.bitquery.io/top-transfers-of-a-token_2).

```
query MyQuery {
  Tron {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT"}}}, TransactionStatus: {Success: true}}
      orderBy: {descending: Transfer_Amount}
      limit: {count: 10}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
    }
  }
}
```

## Transfers of a wallet address

This query fetches you the recent 10 transfers of a specific wallet address `TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7`. Try the query [here](https://ide.bitquery.io/Transfers-of-a-wallet-API).

```
{
  Tron {
    Transfers(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {any: [{Transfer: {Sender: {is: "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"}}}, {Transfer: {Receiver: {is: "TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7"}}}]}
    ) {
      Transaction {
        Hash
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Name
          SmartContract
        }
      }
    }
  }
}

```

## Sender is a particular address

This websocket retrieves transfers where the sender is a particular address `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`. For this subscription query we use `where` keyword and in that we specify `{Transfer: {Sender: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}` to get the desired data. You can find the query [here](https://ide.bitquery.io/Sender-is-particular-address)

```
subscription {
   Tron {
    Transfers(
      where: {Transfer: {Sender: {is: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf"}}}
    ) {
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
          Native
          Symbol
          Fungible
        }
        Receiver
        Sender
      }
      Transaction {
        Hash
      }
    }
  }
}

```

## Daily Transfer Volume of a Tron Token

Aggregate **daily transfer volume in USD** for any TRC20 token for analytics dashboards, weekly newsletters, and on-chain reports for stablecoins, governance tokens, and memecoins on Tron.

Run this query [here](https://ide.bitquery.io/daily-transfer-volume-tron).

```graphql
query DailyTransferVolume($token: String, $since: DateTime) {
  Tron {
    Transfers(
      where: {
        Transfer: { Currency: { SmartContract: { is: $token } } }
        Block: { Time: { since: $since } }
        TransactionStatus: { Success: true }
      }
      orderBy: { ascendingByField: "Block_Date" }
    ) {
      Block {
        Date(interval: { count: 1, in: days })
      }
      Transfer {
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      transfers: count
      unique_senders: uniq(of: Transfer_Sender)
      unique_receivers: uniq(of: Transfer_Receiver)
      volume: sum(of: Transfer_Amount)
      volume_usd: sum(of: Transfer_AmountInUSD)
    }
  }
}
```

Variables:
```
{
  "token": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "since": "2025-01-01T00:00:00Z"
}
```

## Detect Centralized Exchange (CEX) Deposits on Tron

Identify large deposits flowing **into known centralized exchange wallets** on Tron — a classic on-chain signal for **selling pressure** and **whale accumulation**. Replace the receiver list with the exchange addresses you want to monitor (Binance, OKX, Bybit, KuCoin, etc.).

Try this subscription [here](https://ide.bitquery.io/cex-deposits-tron).

```graphql
subscription CEXDepositsTron {
  Tron {
    Transfers(
      where: {
        Transfer: {
          Receiver: {
            in: [
              "TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9",
              "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax",
              "TWd4WrZ9wn84f5x1hZhL4DHvk738ns5jwb"
            ]
          }
          Amount: { ge: "10000" }
        }
      }
    ) {
      Block {
        Time
      }
      Transfer {
        Amount
        AmountInUSD
        Sender
        Receiver
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Top USDT TRC20 Whale Receivers (Last 24 Hours)

Rank addresses by **total USDT TRC20 received** in the last 24 hours — the most-searched Tron whale leaderboard query. Replace the smart contract with any TRC20 token to reuse the pattern.

Run the query [here](https://ide.bitquery.io/top-usdt-receivers-24h-tron).

```graphql
query TopUSDTReceivers24h {
  Tron {
    Transfers(
      where: {
        Transfer: {
          Currency: { SmartContract: { is: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" } }
        }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
        TransactionStatus: { Success: true }
      }
      orderBy: { descendingByField: "received_usd" }
      limit: { count: 50 }
    ) {
      Transfer {
        Receiver
        Currency {
          Symbol
          SmartContract
        }
      }
      received_usd: sum(of: Transfer_AmountInUSD)
      received_amount: sum(of: Transfer_Amount)
      txs: count
    }
  }
}
```

## Subscribe to the latest NFT token transfers on Tron

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following NFT Token Transfers API, we will be subscribing to all NFT token transfers on Tron network. You can run the query [here](https://ide.bitquery.io/NFT-Token-Transfers-API_5)

```
subscription {
  Tron {
    Transfers(where: {Transfer: {Currency: {Fungible: false}}}) {
      Transfer {
        Amount
        Currency {
          Name
          SmartContract
          Symbol
          Fungible
          HasURI
          Decimals
        }
        URI
        Sender
        Receiver
      }
      Transaction {
        Hash
      }
    }
  }
}


```
