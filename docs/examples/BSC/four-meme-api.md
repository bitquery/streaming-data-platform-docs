# Four.Meme API

In this section, we will see some APIs that return on-chain data related to Four Meme Exchange on BSC network. The exchange is relatively new and thus not listed as a DEX, hence we will use Transfers and Call APIs to get trade related or any other on chain activity related to the exchange.

## Get Newly Created Tokens on Four Meme

Using [this](https://ide.bitquery.io/FourMeme--Newly-Created-Token-by-Tracking-Transfer#) query we could get newly created tokens that are listed on the exchange.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
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

## Get Latest Trades of a Four Meme Token

This query retrieves the most recent trades of a specific token on Four Meme Exchange. It tracks `TokenSale` events for the token using its smart contract address.

You can run the query [here](https://ide.bitquery.io/Trades-of-a-fourmeme-token)

```
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      where: {Log: {Signature: {Name: {is: "TokenSale"}}}, Arguments: {includes: {Value: {Address: {is: "0xfe6edde870ff03c039cafc4dba96533acc34a19f"}}}}}
      orderBy: {descending: Block_Time}
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

## Track Trades by a Four Meme User

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

## Latest Trades of a Token on Four Meme

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
