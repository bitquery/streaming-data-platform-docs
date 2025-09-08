# Solana Trader API

In this section we will see how to get Solana trader information using our API. More queries on DEX trades including latest trades, OHLC, and other data points can be found in the [Solana DEX Trades API page](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades/).

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

<head>
<meta name="title" content="Solana Trader API | Real-Time Data for DEX Trades with Pumpfun Insights" />
<meta name="description" content="Get detailed insights into Solana traders and their activities, including Pumpfun data, across DEX platforms like Raydium and Jupiter. Access on-chain trading pair details, liquidity pools, and transaction analytics through our comprehensive Solana Trader API." />
<meta name="keywords" content="Solana Trader API, Solana DEX Trades API, Solana trading API, Pumpfun data, Raydium API, Jupiter API, Solana liquidity pools, Solana trading pairs, Solana blockchain API, crypto trading data API, web3 Solana API, Solana on-chain data API, Solana DeFi API" />
<meta name="robots" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta property="og:title" content="Solana Trader API | Real-Time Data for DEX Trades with Pumpfun Insights" />
<meta property="og:description" content="Get detailed insights into Solana traders and their activities, including Pumpfun data, across DEX platforms like Raydium and Jupiter. Access on-chain trading pair details, liquidity pools, and transaction analytics through our comprehensive Solana Trader API." />

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Trader API | Real-Time Data for DEX Trades with Pumpfun Insights" />
<meta property="twitter:description" content="Get detailed insights into Solana traders and their activities, including Pumpfun data, across DEX platforms like Raydium and Jupiter. Access on-chain trading pair details, liquidity pools, and transaction analytics through our comprehensive Solana Trader API." />
</head>

## Top Traders of a token

This query will give you top traders for this token `59VxMU35CaHHBTndQQWDkChprM5FMw7YQi5aPE5rfSHN` on Solana's DEX platforms.
You can find the query [here](https://ide.bitquery.io/top-traders-of-a-token)

```
query TopTraders($token: String, $base: String) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Side: {Amount: {gt: "0"}, Currency: {MintAddress: {is: $base}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
{
  "token": "59VxMU35CaHHBTndQQWDkChprM5FMw7YQi5aPE5rfSHN",
  "base": "So11111111111111111111111111111111111111112"
}
```

![image](https://github.com/user-attachments/assets/d2f6cc5d-b6ed-4ca2-b6aa-0b15f10d378a)

Check data here on [DEXrabbit](https://dexrabbit.com/solana/pair/59VxMU35CaHHBTndQQWDkChprM5FMw7YQi5aPE5rfSHN/So11111111111111111111111111111111111111112#pair_top_traders).

## Trades of Wallets in Realtime

Below query will give you the trades of the wallets present in `addressList` in realtime. Try the query [here](https://ide.bitquery.io/Trades-of-wallets-in-realtime_1).

```
subscription MyQuery($addressList: [String!]) {
  Solana {
    DEXTrades(
      where: {Transaction: {Result: {Success: true}}, any: [{Trade: {Buy: {Account: {Address: {in: $addressList}}}}}, {Trade: {Buy: {Account: {Token: {Owner: {in: $addressList}}}}}}, {Trade: {Sell: {Account: {Address: {in: $addressList}}}}}, {Trade: {Sell: {Account: {Token: {Owner: {in: $addressList}}}}}}]}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          AmountInUSD
        }
        Sell {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          AmountInUSD
        }
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
{
  "addressList": ["7eWHXZefGY98o9grrrt1Z3j7DcPDEhA4UviQ1pVNhTXX", "6LNdbvyb11JH8qxAsJoPSfkwK4zJDQKQ6LNp4mxt8VpR"]
}
```

## Trades of Wallets with PreBalance, PostBalance

Below query will give you the trades of the wallets present in `addressList` along with the balance updates happened in those trades.. Try the query [here](https://ide.bitquery.io/Trades-of-wallets-with-balance-Updates-in-that-trades).

```
query MyQuery($addressList: [String!]) {
  Solana {
    DEXTrades(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}}, any: [{Trade: {Buy: {Account: {Address: {in: $addressList}}}}}, {Trade: {Buy: {Account: {Token: {Owner: {in: $addressList}}}}}}, {Trade: {Sell: {Account: {Address: {in: $addressList}}}}}, {Trade: {Sell: {Account: {Token: {Owner: {in: $addressList}}}}}}]}
    ) {
      Instruction {
        Program {
          Method
        }
      }
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          AmountInUSD
        }
        Sell {
          Amount
          Account {
            Address
          }
          Currency {
            Name
            Symbol
            MintAddress
            Decimals
          }
          AmountInUSD
        }
      }
      Transaction {
        Signature
        Signer
      }
      joinBalanceUpdates(join: left, Transaction_Signature: Transaction_Signature) {
        Block{
          Time
        }
        BalanceUpdate {
          PreBalance
          PostBalance
          Account {
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
{
  "addressList": ["HevtGooXxDjLfvLM1vUY2y7b9gyu59whR4ycnQj3UjUT"]
}
```

## Get count of Buys and Sells of a Trader

To get the count of Buys and Sells of a specific trader after a certain `timestamp`, use the following query.
Find the query [here](https://ide.bitquery.io/buys-and-sells-of-a-traders)

```
query MyQuery($timestamp: DateTime, $trader: String) {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: $timestamp}}, Trade: {Side: {Currency: {MintAddress: {in: ["So11111111111111111111111111111111111111112", "11111111111111111111111111111111"]}}}}, any: [{Trade: {Account: {Address: {is: $trader}}}}, {Trade: {Account: {Token: {Owner: {is: $trader}}}}}]}
    ) {
      buys: count(if: {Trade: {Side: {Type: {is: buy}}}})
      sells: count(if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
{
  "timestamp" : "2024-06-25T06:19:00Z",
  "trader" : "FeWbDQ9SpgWS8grNrpFesVquJfxVkRu1WNZerKsrkcbY"
}
```

## Subscribe to a Trader in Real-time

The below subscription query will fetch in real-time the trades done by a wallet. You can use websockets to build applications on this data. Read more [here](https://docs.bitquery.io/docs/subscriptions/websockets/)

To filter trades by a wallet we will use the condition `Account: {Address: {is}}`. Run the subscription query [here](https://ide.bitquery.io/trades-of-a-wallet_2)

You can convert this subscription to a `query` to get past trades of the wallet.

```
subscription {
  Solana {
    buy: DEXTrades(
      where: {Trade: {Buy: {Account: {Address: {is: "CP1d7VVnCMy321G6Q1924Bibp528rqibTX8x9UL6wUCe"}}}}}
    ) {
      Trade {
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
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Order {
            LimitPrice
            LimitAmount
            OrderId
          }
          Price
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
        }
      }
    }
    sell: DEXTrades(
      where: {Trade: {Sell: {Account: {Address: {is: "CP1d7VVnCMy321G6Q1924Bibp528rqibTX8x9UL6wUCe"}}}}}
    ) {
      Trade {
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
            IsMutable
            EditionNonce
            Decimals
            CollectionAddress
            Fungible
            Symbol
            Native
            Name
          }
          Order {
            LimitPrice
            LimitAmount
            OrderId
          }
          Price
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
        }
      }
    }
  }
}

```

## Get the First 100 buyers of a Token

The below query retrieves the first 100 buyers of a specified token.
You can run the query [here](https://ide.bitquery.io/get-first-100-buyers-of-a-token_1)

```graphql
query MyQuery {
  Solana {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              MintAddress: {
                is: "2Z4FzKBcw48KBD2PaR4wtxo4sYGbS7QqTQCLoQnUpump"
              }
            }
          }
        }
      }
      limit: { count: 100 }
      orderBy: { ascending: Block_Time }
    ) {
      Trade {
        Buy {
          Amount
          Account {
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
