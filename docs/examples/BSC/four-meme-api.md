# Four Meme API

In this section, we will see some APIs that return on-chain data related to Four Meme Exchange on BSC network. We will be using DEX Trades API to get insightful trades and trading activity related data.

## Get Newly Created Tokens on Four Meme

Using [this](https://ide.bitquery.io/FourMeme--Newly-Created-Token-by-Tracking-Transfer#) query we could get newly created tokens that are listed on the exchange.

```graphql
{
  EVM(dataset: combined, network: bsc) {
    Transfers(
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
      where: {
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Transfer: {
          Sender: { is: "0x0000000000000000000000000000000000000000" }
        }
      }
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
        }
        Id
        Index
        Success
        Type
        URI
        Sender
        Receiver
      }
      Call {
        From
        Value
        To
        Signature {
          Name
          Signature
        }
      }
      Log {
        SmartContract
        Signature {
          Name
        }
      }
      TransactionStatus {
        Success
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

You can refer to this [example](./bsc-dextrades.mdx/#get-latest-trades-on-a-specific-dex) to track latest trades of a token on other particular DEX's such as Pancake Swap.


## Subscribe the Latest Trades on Four Meme

Using subscriptions you can subscribe to the latest trades on Four Meme as shown in this [example](https://ide.bitquery.io/Latest-trades-on-fourmeme). The subscription returns latest trade info such as buyers and sellers, buy and sell currency details and amount of currency.

```graphql
subscription {
  EVM(network: bsc){
    DEXTrades(where: {
      Trade: {
        Dex: {
          ProtocolName: {
            is: "fourmeme_v1"
          }
        }
      }
    }){
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
        Sell {
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Get Latest Buys and Sells for a Four Meme Token

[This](https://ide.bitquery.io/Latest-buys-and-sells-for-a-four-meme-coin_1) query retrieves the most recent token buy and sell trades of a specific token on Four Meme Exchange.

```graphql

query MyQuery($currency: String) {
  EVM(network: bsc, dataset: combined) {
    buys: DEXTrades(
      where: {
        Trade: {
          Buy: {Currency: {SmartContract: {is: $currency}}},
          Success: true,
          Dex: {ProtocolName: {is: "fourmeme_v1"}}
        }
      }
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Amount
          Buyer
          Price
          PriceInUSD
          Seller
        }
        Sell {
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
    sells: DEXTrades(
      where: {
        Trade: {
          Sell: {Currency: {SmartContract: {is: $currency}}},
          Success: true,
          Dex: {ProtocolName: {is: "fourmeme_v1"}}
        }
      }
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Trade {
        Buy {
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          Buyer
          Price
          PriceInUSD
          Seller
        }
      }
    }
  }
}
```

```json
{
  "currency": "0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40"
}
```
You can also check if the token is listed on other DEX using this [example](./bsc-dextrades.mdx/#get-all-dexs-where-a-specific-token-is-listed).


## Monitor trades of traders on Four meme

You can use our streams to monitor real time trades of a trader on Four Meme, for example run [this stream](https://ide.bitquery.io/monitor-trades-of-a-trader-on-four-meme).

```graphql
subscription {
  EVM(network: bsc) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "fourmeme_v1"}},
          Success: true
        },
        Transaction: {
          From: {is: "0x7db00d1f5b8855d40827f34bb17f95d31990306e"}
        }
      }
    ) {
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
          Price
          PriceInUSD
        }
        Sell {
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Track Latest and Historical Trades of a Four Meme User

You can use DEX Trades API with combined dataset to get latest and historic trades of a user. Run [this query](https://ide.bitquery.io/Get-all-trades-of-a-trader-on-four-meme) for example.


```graphql
query MyQuery($address: String) {
  EVM(dataset:combined, network: bsc) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {ProtocolName: {is: "fourmeme_v1"}},
          Success: true
        }, 
        Transaction: {From: {is: $address}}
      }
      orderBy: {descending: Block_Time}
    ) {
      Block{
        Time
      }
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
          Price
          PriceInUSD
        }
        Sell {
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Amount
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

```json
{
  "address": "0x7db00d1f5b8855d40827f34bb17f95d31990306e"
}
```

## Top Buyers for a Token on Four Meme

[This](https://ide.bitquery.io/Top-buyers-of-a-four-meme-token) query returns top buyers of a particular token on Four Meme, with currency smart contract as `0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40` for this example.

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc, dataset: combined) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {Currency: {SmartContract: {is: $currency}}},
          Success: true,
          Dex: {ProtocolName: {is: "fourmeme_v1"}}
        }
      }
      limit: {count: 100}
    ) {
      Trade {
        Buy {
          Buyer
        }
      }
      trades: count
      bought: sum(of: Trade_Buy_Amount)
    }
	}
}
```

```json
{
  "currency": "0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40"
}
```

## Get Trade Volume and Number of Trades for a Four Meme Token

[This](https://ide.bitquery.io/volume-and-trades-for-a-token-in-different-time-frames_1) query returns the traded volume and number of trades for a particular Four Meme token in different time frames, namely 24 hours, 1 hour and 5 minutes.

```graphql
query MyQuery($currency: String, $time_24hr_ago: DateTime, $time_1hr_ago: DateTime, $time_5min_ago: DateTime) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {SmartContract: {is: $currency}},
          Success: true
        }, 
        Block: {Time: {since: $time_24hr_ago}}
      }
    ){
      Trade{
        Currency{
          Name
          Symbol
          SmartContract
        }
      }
      volume_24hr: sum(of: Trade_Side_AmountInUSD)
      volume_1hr: sum(of: Trade_Side_AmountInUSD, if: {Block: {Time: {since: $time_1hr_ago}}})
      volume_5min: sum(of: Trade_Side_AmountInUSD, if: {Block: {Time: {since: $time_5min_ago}}})
      trades_24hr: count
      trades_1hr: count(if: {Block: {Time: {since: $time_1hr_ago}}})
      trades_5min: count(if: {Block: {Time: {since: $time_5min_ago}}})
    }
  }
}
```

```json
{
  "currency": "0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40",
  "time_24hr_ago": "2024-03-23T15:00:00Z",
  "time_1hr_ago": "2024-03-24T14:00:00Z",
  "time_5min_ago": "2024-03-24T15:55:00Z",
}
```

## Get Market Cap of a Four Meme Token

To get the market cap of a token we need two things, the latest `PriceInUSD` and `total supply` of the token. [This](https://ide.bitquery.io/latest-token-price-in-usd) query helps with getting the latest USD price of a token.

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {Trade: {Currency: {SmartContract: {is: $currency}}}}
      orderBy: {descending: Block_Time}
      limit: {count:1}
    ){
      Trade{
        PriceInUSD
      }
    }
  }
}
```

```json
{
  "currency": "0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40"
}
```

Also, [this](https://ide.bitquery.io/Total-supply-of-a-four-meme-token) query returns the total supply of a token.

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc, dataset: combined) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: $currency}}, Success: true}}
    ) {
      minted: sum(of: Transfer_Amount, if: {Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}}})
      burned: sum(
        of: Transfer_Amount
        if: {Transfer: {Receiver: {is: "0x0000000000000000000000000000000000000000"}}}
      )
    }
  }
}
```

```json
{
  "currency": "0x9b48a54bcce09e59b0479060e9328ab7dbdb0d40"
}
```

Now, to get market cap we need to multiply the total supply and price, that is:

```
Market Cap = Total Supply * PriceInUSD
```

## Track Liquidity Add Events for All Tokens on Four Meme

This query tracks all liquidity addition events on the Four Meme Exchange. It listens for `LiquidityAdded` events emitted from the four meme exchange's smart contract (0x5c952063c7fc8610ffdb798152d69f0b9550762b)

You can run the query [here](https://ide.bitquery.io/Liquidity-Added-to-specific-tokens-on-Four-meme)

```
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      limit: {count: 20}
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}},
        Log: {Signature: {Name: {is: "LiquidityAdded"}}}}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```

## Track Liquidity Add Events for a Token on Four Meme

This query tracks liquidity addition events for a specific token on the Four Meme Exchange. It listens for `LiquidityAdded` events emitted from the exchange's smart contract (`0x5c952063c7fc8610ffdb798152d69f0b9550762b`) BNB network

In this example, the query monitors liquidity events for a specific token (`0x5a49ce64a1e44f6fce07e9ff38f54dde8a8a0e94`) by filtering the event arguments to only include actions related to this token.

You can run the query [here](https://ide.bitquery.io/Liquidity-Added-to-specific-tokens-on-Four-meme)

```
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      limit: {count: 20}
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {is: "LiquidityAdded"}}}, Arguments: {includes: {Name: {is: "token1"}, Value: {Address: {is: "0x5a49ce64a1e44f6fce07e9ff38f54dde8a8a0e94"}}}}}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```


## Building a Four Meme Dashboard

[Chinese Tutorial](https://learnblockchain.cn/article/12532)