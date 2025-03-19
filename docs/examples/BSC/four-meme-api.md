# Four Meme API

In this section, we will see some APIs that return on-chain data related to Four Meme Exchange on BSC network. The exchange is relatively new and thus not listed as a DEX, hence we will use Transfers and Call APIs to get trade related or any other on chain activity related to the exchange.

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


## Latest Token Buy and Sell Trades Stream for Four Meme

You can track TokenPurchase and TokenSale events to track all new buy and sell events on four meme.

Here is the [stream](https://ide.bitquery.io/Latest-Token-Buy-and-Sell-Trades-Stream-for-Four-Meme) you can run to test it out.


```
subscription {
  EVM(network: bsc) {
    Events(
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {in: ["TokenPurchase", "TokenSale"]}}}}
    ) {
      LogHeader {
        Address
      }
      Log {
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        Value
        Type
        Hash
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
        Name
      }
    }
  }
}
```






## Get Latest Buy of a Four Meme Token

This query retrieves the most recent token buy trades of a specific token on Four Meme Exchange. It tracks `TokenPurchase` events for the token using its smart contract address.

You can run the query [here](https://ide.bitquery.io/Get-Latest-Buy-of-a-Four-Meme-Token)

```
{
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {Block: {Date: {is: "2025-03-19"}}, LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {is: "TokenPurchase"}}}, Arguments: {includes: {Value: {Address: {is: "0xa6af9d9966de5568d7708e435cca19caec8fb84a"}}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Log {
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        Value
        Type
        Hash
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
        Name
      }
    }
  }
}

```

You can also check if the token is listed on other DEX using this [example](./bsc-dextrades.mdx/#get-all-dexs-where-a-specific-token-is-listed).

## Get Latest Sell of a Four Meme Token

This query retrieves the most recent sell trades of a specific token on Four Meme Exchange. It tracks `TokenSale` events for the token using its smart contract address.

You can run the query [here](https://ide.bitquery.io/Get-Latest-Sell-of-a-Four-Meme-Token)

```
{
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {is: "TokenSale"}}}, Arguments: {includes: {Value: {Address: {is: "0xfe6edde870ff03c039cafc4dba96533acc34a19f"}}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Log {
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        Value
        Type
        Hash
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
        Name
      }
    }
  }
}
```

You can also check if the token is listed on other DEX using this [example](./bsc-dextrades.mdx/#get-all-dexs-where-a-specific-token-is-listed).


## Monitor trades of traders on Four meme

You can use our streams to monitor real time trades of a trader, for example run [this stream](https://ide.bitquery.io/Monitor-trades-of-traders-on-Four-meme).

```
subscription {
  EVM(network: bsc) {
    Events(
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {in: ["TokenSale", "TokePurchase"]}}}, Arguments: {includes: {Name: {is: "account"}, Value: {Address: {is: "0x8fdca747e60dd6f3c78fb607e24a30ca53a17336"}}}}}
    ) {
      Log {
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        Value
        Type
        Hash
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
        Name
      }
    }
  }
}
```

## Track Trades by a Four Meme User using Events API Historical

You can use event API to get trades of a user using our event API. Run [this query](https://ide.bitquery.io/Track-Trades-by-a-Four-Meme-User-using-Events-API) for example.


```
{
  EVM(dataset: combined, network: bsc) {
    Events(
      where: {LogHeader: {Address: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Log: {Signature: {Name: {in: ["TokenSale", "TokePurchase"]}}}, Arguments: {includes: {Name: {is: "account"}, Value: {Address: {is: "0x8fdca747e60dd6f3c78fb607e24a30ca53a17336"}}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Log {
        Signature {
          Name
        }
      }
      Transaction {
        From
        To
        Value
        Type
        Hash
      }
      Arguments {
        Type
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
        Name
      }
    }
  }
}

```

## Track Trades by a Four Meme User using Transfers

[This](https://ide.bitquery.io/trades-by-an-user-on-Four-Meme_1) query returns trade activities (buys and sells) of an user on Four Meme Exchange, with the user address as `0xf0C66cc94c7568F63d421be93eBdb1Ce7d163c74` for this example. Such data have a wide range of use cases from wallet trackers to copy trading bots.

```graphql
{
  EVM(dataset: combined, network: bsc) {
    buys: Transfers(
      orderBy: { descending: Block_Time }
      where: {
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Transfer: {
          Receiver: { is: "0xf0C66cc94c7568F63d421be93eBdb1Ce7d163c74" }
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
    sells: Transfers(
      orderBy: { descending: Block_Time }
      where: {
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Transfer: {
          Sender: { is: "0xf0C66cc94c7568F63d421be93eBdb1Ce7d163c74" }
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

## Latest Trades of a Token on Four Meme using Transfers

[This](https://ide.bitquery.io/latest-trades-for-a-token-on-four-memes#) query returns latest trades for a particular token on Four Meme, with currency smart contract as `0x8863de06c617e75e7bbb453934bc04d0835eb87c` for this example.

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
          Currency: {
            SmartContract: { is: "0x8863de06c617e75e7bbb453934bc04d0835eb87c" }
          }
        }
        TransactionStatus: { Success: true }
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
        Sender
        Receiver
      }
      Transaction {
        Hash
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

## Top Buyers for a Token on Four Meme

[This](https://ide.bitquery.io/top-buyers-for-a-token#) query returns top buyers of a particular token on Four Meme, with currency smart contract as `0x8863de06c617e75e7bbb453934bc04d0835eb87c` for this example.

```graphql
{
  EVM(dataset: combined, network: bsc) {
    Transfers(
      orderBy: { descending: Block_Time, descendingByField: "total" }
      where: {
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Transfer: {
          Currency: {
            SmartContract: { is: "0x8863de06c617e75e7bbb453934bc04d0835eb87c" }
          }
          Sender: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        TransactionStatus: { Success: true }
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
        Buyer: Receiver
      }
      total: sum(of: Transfer_Amount)
    }
  }
}
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


### Building a Four Meme Dashboard

[Chinese Tutorial](https://learnblockchain.cn/article/12532)