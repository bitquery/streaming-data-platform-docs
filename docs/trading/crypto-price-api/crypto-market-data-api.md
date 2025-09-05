# Crypto Market Data API

This page aggregates commonly used queries for market data across chains, pairs, and exchanges, linking to examples mentioned in other sections of our docs. These examples demonstrate how to use our real-time crypto price API for multi-chain cryptocurrency price data across various trading scenarios. You can also use the AI agent at the bottom to find an API, it is trained on our docs and IDE queries.

## OHLC Stream on a Chain

[Run Query](https://ide.bitquery.io/Aggregated-Price-of-all-tokens-in-real-time-on-one-chain_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Tokens(
      where: {
        Token: { Network: { is: "Solana" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Token {
        Id
        Symbol
        Network
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Usd
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
    }
  }
}
```

</details>

## OHLC of a Token Pair Across Chains

[Run Query](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Currency: { Id: { is: "bid:eth" } }
        QuoteCurrency: { Id: { is: "usdc" } }
      }
    ) {
      Token {
        Symbol
      }
      QuoteToken {
        Symbol
      }
      Interval {
        Time {
          Start
        }
      }
      Volume {
        Usd
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
    }
  }
}
```

</details>

## 5 Minute Price Change API

[Run Query](https://ide.bitquery.io/5-minute-price-change-api)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Trading {
    Tokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "change" }
      where: {
        Volume: { Usd: { gt: 100000 } }
        Interval: { Time: { Duration: { eq: 300 } } }
      }
    ) {
      Token {
        Address
        Did
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Currency {
        Symbol
        Id
        Name
      }
      Interval {
        VolumeBased
        Time {
          Start
          End
        }
      }
      Volume {
        Base
        BaseAttributedToUsd
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          Estimate
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      diff: calculate(expression: "Price_Ohlc_Close - Price_Ohlc_Open")
      change: calculate(expression: "round(($diff / Price_Ohlc_Open), 3) * 100")
    }
  }
}
```

</details>

## Solana — Latest Trades

[Run Query](https://ide.bitquery.io/solana-trades-subscription_3)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          Currency {
            Symbol
          }
          PriceInUSD
        }
        Sell {
          Amount
          Currency {
            Symbol
          }
        }
      }
    }
  }
}
```

</details>

## Ethereum — DEXTrades

[Run Query](https://ide.bitquery.io/Ethereum-dextrades)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription MyQuery {
  EVM(network: eth) {
    DEXTrades {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Log {
        Index
        SmartContract
        Signature {
          Signature
          Name
        }
      }
      Trade {
        Sender
        Buy {
          Buyer
          AmountInUSD
          Amount
          Seller
          PriceInUSD
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Dex {
          SmartContract
          ProtocolName
          ProtocolVersion
        }
        Sell {
          Buyer
          AmountInUSD
          Amount
          Seller
          PriceInUSD
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

</details>

## BSC — Pancakeswap Trades Stream

[Run Query](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades---Stream)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    DEXTrades {
      Block {
        Time
        Number
      }
      Receipt {
        ContractAddress
        Status
      }
      TransactionStatus {
        Success
      }
      Log {
        Signature {
          Name
        }
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
          OwnerAddress
        }
        Buy {
          Amount
          PriceInUSD
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
        Sell {
          Amount
          PriceInUSD
          Price
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

</details>

## Ethereum — Uniswap Live Trades (v1/v2/v3)

[Run Query](https://ide.bitquery.io/uniswap-all-versions-trades-stream)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Dex: {
            ProtocolName: { in: ["uniswap_v3", "uniswap_v2", "uniswap_v1"] }
          }
        }
      }
    ) {
      Block {
        Time
      }
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Amount
          Currency {
            Symbol
          }
        }
        Sell {
          Amount
          Currency {
            Symbol
          }
        }
      }
    }
  }
}
```

</details>

## Pairs OHLC (1s interval)

[Run Query](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Currency: { Id: { is: "bid:bitcoin" } }
        QuoteCurrency: { Id: { is: "usdt" } }
      }
    ) {
      Market {
        Name
        Network
        Address
      }
      Token {
        Symbol
      }
      QuoteToken {
        Symbol
      }
      Volume {
        Usd
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
    }
  }
}
```

</details>

## Find Price Arbitrage Across Chains

[Run Query](https://ide.bitquery.io/Find-arbitrage-opportunity-with-same-token-across-chains)

<details>
  <summary>Click to expand GraphQL query</summary>

```
{
  Trading {
    Pairs(
      where: {
        Currency: {Id: {is: "bid:bitcoin"}}
        QuoteCurrency: {Id: {is: "usdt"}}
      }
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      limitBy: {by: Market_Address, count: 1}
    ) {
      Currency {
        Name
        Id
      }
      Market {
        Name
        NetworkBid
        Network
        Address
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
        }
      }
      QuoteCurrency {
        Id
        Symbol
        Name
      }
      QuoteToken {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
      Token {
        Name
        Id
        NetworkBid
      }
    }
  }
}

```

</details>

## Uniswap — Pairs OHLC (Seconds)

[Run Query](https://ide.bitquery.io/Stream-all-Uniswap-Seconds-OHLC-Kline)

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription {
  Trading {
    Pairs(
      where: {Market: {Protocol: {in: ["uniswap_v3", "uniswap_v2"]}}, Interval: {Time: {Duration: {eq: 1}}}}
    ) {
      Currency { Name Id }
      Market { Name NetworkBid Network Address }
      Price { IsQuotedInUsd Average { Mean } }
      QuoteCurrency { Id Symbol Name }
      QuoteToken { Symbol Name Id NetworkBid Network Did Address }
      Token { Name Id NetworkBid }
    }
  }
}
```

</details>

## Pancakeswap v3 — Liquidity Add (BSC)

[Run Query](https://ide.bitquery.io/Stream---Liqiidity-add-for-all-tokens-on-PancakeSwap-v3)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    Events(
      orderBy: [
        { descending: Block_Time }
        { descending: Transaction_Index }
        { descending: Log_Index }
      ]
      where: {
        Log: { Signature: { Name: { is: "Mint" } } }
        Transaction: {
          To: { is: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364" }
        }
      }
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

</details>

## Pancakeswap v3 — Liquidity Remove (BSC)

[Run Query](https://ide.bitquery.io/Stream---Liquidity-remove-for-all-tokens-on-PancakeSwap-v3)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    Events(
      orderBy: [
        { descending: Block_Time }
        { descending: Transaction_Index }
        { descending: Log_Index }
      ]
      where: {
        Log: { Signature: { Name: { is: "Burn" } } }
        Transaction: {
          To: { is: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364" }
        }
      }
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

</details>

## Solana — Raydium Liquidity Add

[Run Query](https://ide.bitquery.io/liquidity-addition-for-radium_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Solana — Raydium Liquidity Remove

[Run Query](https://ide.bitquery.io/liquidity-removal-for-radium_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Solana — Orca Liquidity Add

[Run Query](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Solana — Orca Liquidity Remove

[Run Query](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Uniswap (EVM) — Liquidity Removed (Burn events)

[Run Query](https://ide.bitquery.io/uniswap-v2-liquidity-removed)

<details>
  <summary>Click to expand GraphQL query</summary>

```
{
  EVM(network: eth, dataset: combined) {
    Events(
      limit: {count: 100}
      where: {Transaction: {To: {is: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"}}, Log: {Signature: {Name: {in: ["Burn"]}}}}
    ) {
      Transaction { Hash From To }
      Block { Number }
      Log { Signature { Name } SmartContract }
      Transaction { From To Type }
      LogHeader { Address Index }
      Arguments {
        Value {
          ... on EVM_ABI_Integer_Value_Arg { integer }
          ... on EVM_ABI_String_Value_Arg { string }
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_Boolean_Value_Arg { bool }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
        Name
      }
    }
  }
}

```

</details>

## Uniswap (EVM) — Track addLiquidityETH Calls

[Run Query](https://ide.bitquery.io/addLiquidityETH_function)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(dataset: archive, network: eth) {
    Calls(
      where: {
        Transaction: {
          Hash: {
            is: "0x60ce9acd0053f20092e7871868afe5187c95ff6d7750ad65a8d4ff99a052c357"
          }
        }
        Call: { Signature: { Name: { is: "addLiquidityETH" } } }
        Arguments: {
          length: { eq: 6 }
          includes: [
            {
              Index: { eq: 0 }
              Value: {
                Address: { is: "0x9cbc0be914e480beee4014e190fdbfc48ed5a4a8" }
              }
            }
            {
              Index: { eq: 3 }
              Value: { BigInteger: { ge: "1000000000000000000" } }
            }
            { Index: { eq: 5 }, Value: { BigInteger: { ge: "1690878863" } } }
          ]
        }
      }
      limit: { count: 10 }
    ) {
      Arguments {
        Index
        Name
        Type
        Path {
          Name
          Index
          Type
        }
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Call {
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```

</details>
