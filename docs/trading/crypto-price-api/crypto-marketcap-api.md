---
title: "Crypto MarketCap API & Market Data"
description: "Real-time crypto market cap API by Bitquery: USD market cap, FDV & token supply on Solana, Ethereum & BSC. GraphQL subscriptions, Kafka trading.prices, multi-chain OHLC & DEX examples."
keywords:
  - crypto market cap API
  - Crypto Market data
  - real-time market capitalization API
  - multi-chain cryptocurrency market data
  - cryptocurrency market cap GraphQL
  - Bitquery Trading API
  - token supply FDV API
  - Solana Ethereum BSC market cap
  - multi-chain OHLC API
---

# Crypto MarketCap API and Market Data

The **Crypto MarketCap API** is part of the Crypto Price APIs: you can **query** USD **market capitalization** and related **supply** fields, or **stream** them in **real time** for many chains using GraphQL **subscriptions** or the **`trading.prices`** Kafka topic described in the [Crypto Price API introduction](/docs/trading/crypto-price-api/introduction). 

Those metrics are returned on the **`Supply`** object on **Currencies**, **Tokens**, and **Pairs** rows (`MarketCap`, `CirculatingSupply`, `TotalSupply`, and others). Field semantics are documented in the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields). For intervals, cubes, and streaming setup, use the [Crypto Price API introduction](/docs/trading/crypto-price-api/introduction).




## How do I get the USD market cap of a single token? {#how-do-i-get-usd-market-cap-of-a-single-token}

Set token **address** and read **`Supply.MarketCap`** from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/marketcap-of-pump-token)

```graphql
{
  Trading {
    Tokens(
      where: {Token: {Address: {is: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn"}}, 
        Interval: {Time: {Duration: {eq: 1}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
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
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
      Supply {
        TotalSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

## How do I list top tokens by market cap on a blockchain? {#how-do-i-list-top-tokens-by-market-cap-on-a-blockchain}

In this API, we fetch top tokens by MarketCap on Solana. Change Network fields to get top tokens for a different network or remove to get top tokens across all. We also add `Volume: {Usd: {gt: 1000}` filter to remove low-volume tokens.
 
 See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. 

You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/top-tokens-by-mcap-on-Solana-vol-gt-1000-USD)

```graphql
{
  Trading {
    Tokens(
      limit: {count: 50}
      limitBy: {count: 1, by: Token_Id}
      orderBy: {descending: Supply_MarketCap}
      where: {Interval: {Time: {Duration: {eq: 1}}}, Volume: {Usd: {gt: 1000}}, Token: {Network: {is: "Solana"}}}
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Price {
        Average {
          Mean(maximum: Block_Time)
        }
      }
      Volume {
        Base(maximum: Block_Time)
        Quote(maximum: Block_Time)
        Usd(maximum: Block_Time)
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap(maximum: Block_Time)
        FullyDilutedValuationUsd(maximum: Block_Time)
        TotalSupply(maximum: Block_Time)
      }
    }
  }
}

```

## How do I query total supply and circulating supply for a cryptocurrency? {#how-do-i-query-total-supply-and-circulating-supply}

Set a **currency id** on **Currencies** and read **`Supply.TotalSupply`** and related fields from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields. You can also stream this in real-time by adding the keyword "subscription" at the top.

```graphql
{
  Trading {
    Currencies(
      limit: { count: 1 }
      orderBy: { descending: Block_Time }
      where: {
        Currency: { Id: { is: "pump" } }
        Interval: { Time: { Duration: { eq: 60 } } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Supply {
        TotalSupply
        CirculatingSupply
        MaxSupply
        MarketCap
        FullyDilutedValuationUsd
      }
    }
  }
}
```

## How do I rank tokens by 1-hour market cap change? {#how-do-i-rank-tokens-by-1-hour-market-cap-change}

Set **`Token: { Network: { is: "..." } }`** and a **1 hour** interval and read ranked **`change_mcap`** from the query below. See the [Supply fields reference](/docs/trading/crypto-price-api/supply-fields) for related supply fields and [expressions](/docs/graphql/capabilities/expression/) for `calculate`. You can also stream this in real-time by adding the keyword "subscription" at the top.

[Run query ➤](https://ide.bitquery.io/top-tokens-by-mcap-change-1h-on-Solana)

```graphql
{
  Trading {
    Tokens(
      limit: { count: 50 }
      orderBy: { descendingByField: "change_mcap" }
      where: {
        Interval: { Time: { Duration: { eq: 3600 } } }
        Token: { Network: { is: "Solana" } }
      }
    ) {
      Currency {
        Id
        Name
        Symbol
      }
      Token {
        Network
        Symbol
        Address
      }
      Supply {
        MarketCap
        FullyDilutedValuationUsd
        CirculatingSupply
        TotalSupply
        MaxSupply
      }
      change_mcap: calculate(
        expression: "($Price_Ohlc_Close-$Price_Ohlc_Open) * Supply_TotalSupply"
      )
      Price {
        Ohlc {
          Open
          Close
        }
      }
    }
  }
}
```

## Crypto Market Data APIs — OHLCV, K-Line, Charts, Token Prices, Volume, Supply

This section aggregates commonly used queries for market data across chains, pairs, and exchanges. These examples show how to use Bitquery’s **real-time crypto price API** for getting crypto market data. You can also use the chat agent at the bottom of the docs site—it is trained on our documentation and IDE queries.

## How do I stream aggregated OHLC and market cap for all tokens on one chain? {#how-do-i-stream-ohlc-and-marketcap-on-one-chain}

Subscribe to **`Trading.Tokens`** with a **network** and **interval** to stream OHLC, volume, and **`Supply`** (including **MarketCap**) for many tokens on that chain in one feed.

The following stream provide 60 second aggregated data. For information on all available time intervals, see the supported intervals documentation [here](http://localhost:3000/docs/trading/crypto-price-api/introduction/#supported-time-intervals).

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
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
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

## How do I stream OHLC for a token pair across chains? {#how-do-i-stream-ohlc-for-a-token-pair-across-chains}

Use **`Trading.Pairs`** with **`Currency`** and **`QuoteCurrency`** ids and your desired **interval** (for example 1s) to stream OHLC, volume, and supply metrics for that pair.

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
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
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

## How do I get 5-minute price change % for high-liquidity tokens? {#how-do-i-get-5-minute-price-change-percent}

Query **`Trading.Tokens`** with a **300s** interval, filter by **minimum USD volume**, and use **`calculate`** on OHLC open/close to derive **% change**—ideal for short-term movers and dashboards.

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
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
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

## How do I subscribe to latest Solana DEX trades in real time? {#how-do-i-subscribe-to-latest-solana-dex-trades}

Stream **`Solana { DEXTrades { … } }`** as a **subscription** to receive each swap with **buy/sell**, **price in USD**, and **DEX protocol** as trades are indexed.

[Run Query](https://ide.bitquery.io/solana-trades-subscription_3)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXTrades {
      Block {
        Time
        Slot
      }
      Transaction {
        Signer
        Signature
        Index
        Result {
          Success
        }
      }
      Trade {
        Index
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            MintAddress
            Decimals
            Symbol
            Name
          }
          Price
          PriceInUSD
        }
        Market {
          MarketAddress
        }
        Sell {
          Amount
          AmountInUSD
          Account {
            Address
            Owner
          }
          Currency {
            Decimals
            Symbol
            Name
          }
          Price
          PriceInUSD
        }
      }
    }
  }
}
```

</details>

## How do I stream Ethereum DEX trades in real time? {#how-do-i-stream-ethereum-dex-trades-in-real-time}

Use **`EVM(network: eth) { DEXTrades { … } }`** in a **subscription** to stream decoded swaps with **transaction**, **log**, and **buy/sell** legs for EVM DEX activity.

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

## How do I stream BSC (PancakeSwap) DEX trades? {#how-do-i-stream-bsc-pancakeswap-dex-trades}

Subscribe to **`EVM(network: bsc).DEXTrades`** for **PancakeSwap** and other BSC DEX fills with **block**, **receipt**, and **trade** details.

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

## How do I stream Uniswap v1, v2, and v3 trades on Ethereum? {#how-do-i-stream-uniswap-v1-v2-v3-trades-on-ethereum}

Filter **`DEXTrades`** with **`ProtocolName` in `uniswap_v3`, `uniswap_v2`, `uniswap_v1`** to stream only **Uniswap** family pools on **mainnet**.

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

## How do I stream 1-second OHLC for a specific pair (e.g. BTC/USDT)? {#how-do-i-stream-1-second-ohlc-for-a-trading-pair}

**`Trading.Pairs`** with **1s** **`Interval`** streams open/high/low/close, **volume**, and **market cap** fields for the selected **base/quote** currency ids.

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
      Supply {
        TotalSupply
        FullyDilutedValuationUsd
        MarketCap
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

## How do I find cross-chain price arbitrage for the same pair? {#how-do-i-find-cross-chain-price-arbitrage}

Compare **`Trading.Pairs`** rows for the same **currency** / **quote** across **markets** and **networks**; use **`limitBy`** on **market address** to sample best venues for **arbitrage** research.

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

## How do I stream second-level Uniswap pair OHLC (K-line)? {#how-do-i-stream-uniswap-pairs-ohlc-seconds}

Subscribe to **`Trading.Pairs`** filtered by **Uniswap protocols** and **1s** interval to power **sub-minute** charts and **HFT** analytics.

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

## How do I stream PancakeSwap v3 liquidity adds on BSC? {#how-do-i-stream-pancakeswap-v3-liquidity-adds-on-bsc}

Listen to **`Mint`** logs on the **PancakeSwap v3** pool manager contract to catch **new liquidity** added to pools on **BNB Chain**.

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

## How do I stream PancakeSwap v3 liquidity removals on BSC? {#how-do-i-stream-pancakeswap-v3-liquidity-removals-on-bsc}

Filter **`Burn`** signatures on the same **PancakeSwap v3** manager to track **liquidity withdrawals** in real time.

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

## How do I stream Raydium liquidity adds on Solana? {#how-do-i-stream-raydium-liquidity-adds-on-solana}

Subscribe to **`Solana.DEXPools`** with **Raydium’s program** and **positive base change** to detect **new liquidity** deposited into **Raydium** pools.

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

## How do I stream Raydium liquidity removals on Solana? {#how-do-i-stream-raydium-liquidity-removals-on-solana}

Use the same **Raydium** program filter with **negative** **`ChangeAmount`** on the base side to stream **liquidity withdrawals**.

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

## How do I stream Orca Whirlpool liquidity adds on Solana? {#how-do-i-stream-orca-whirlpool-liquidity-adds}

Filter **`DEXPools`** by **Orca Whirlpool program address** and **positive** base **change** to stream **liquidity deposits** into **Whirlpool** pools.

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

## How do I stream Orca Whirlpool liquidity removals on Solana? {#how-do-i-stream-orca-whirlpool-liquidity-removals}

With **Orca’s program** and **negative** base **change**, stream **liquidity removals** from **Whirlpool** markets.

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

## How do I query Uniswap Router Burn events (liquidity removed) on Ethereum? {#how-do-i-query-uniswap-router-burn-liquidity-removed}

Query **`EVM(network: eth, dataset: combined).Events`** for **`Burn`** logs on the **Uniswap V2 Router** to track **liquidity** pulled from **pairs**.

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

## How do I find addLiquidityETH calls for a token pair on Ethereum? {#how-do-i-find-addliquidityeth-calls-on-ethereum}

Use **`EVM(dataset: archive).Calls`** with **`Call.Signature.Name`** **`addLiquidityETH`** and **argument** filters to audit **liquidity adds** routed through the **router** for a given **token** and **tx** pattern.

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

## Related DEX, launchpad & trading APIs {#related-dex-launchpad-trading-apis}

Use these pages when you need **protocol-specific** filters, **bonding curves**, **pool** events, or **full DEX** examples that pair with **Crypto Price** / **Trading** metrics above.

### Solana

- [Pump.fun API](/docs/blockchain/Solana/Pumpfun/Pump-Fun-API) — live trades, OHLCV, ATH, market cap, bonding curve, migrations to PumpSwap  
- [PumpSwap API](/docs/blockchain/Solana/Pumpfun/pump-swap-api) — PumpSwap trades, prices, pools, historical + realtime datasets  
- [Raydium DEX API](/docs/blockchain/Solana/Solana-Raydium-DEX-API) — Raydium swaps, pools, and liquidity  
- [Orca DEX API](/docs/blockchain/Solana/solana-orca-dex-api) — Orca / Whirlpool trades and pools  
- [Jupiter API](/docs/blockchain/Solana/solana-jupiter-api) — Jupiter aggregator swaps, routing, limit orders  
- [Solana DEX trades (hub)](/docs/blockchain/Solana/solana-dextrades) — `DEXTrades`, `DEXTradeByTokens`, and chain-wide patterns  
- [gRPC: Pump.fun streams](/docs/grpc/solana/examples/pump-fun-grpc-streams) — low-latency CoreCast example  

### BNB Chain (BSC)

- [PancakeSwap API (BSC)](/docs/blockchain/BSC/pancake-swap-api) — PancakeSwap v2/v3 trades and pools  
- [PancakeSwap Infinity (BSC)](/docs/blockchain/BSC/bsc-pancakeswap-infinity-api) — Infinity pools and hooks (where documented)  
- [BSC DEX trades](/docs/blockchain/BSC/bsc-dextrades) — general BSC DEX query patterns  
- [Four.meme API](/docs/blockchain/BSC/four-meme-api) — Four.meme launchpad and bonding on BSC  
- [BSC mempool stream](/docs/blockchain/BSC/bsc-mempool-stream) — pending / pre-confirmation monitoring  

### Ethereum & cross‑chain

- [DEX API (Ethereum hub)](/docs/blockchain/Ethereum/dextrades/dex-api) — Uniswap-style DEX patterns on Ethereum  
- [Crypto Price API introduction](/docs/trading/crypto-price-api/introduction) — Tokens, Pairs, Currencies cubes and Kafka `trading.prices`  
- [OHLC / K-line API](/docs/trading/crypto-price-api/crypto-ohlc-candle-k-line-api) — candlesticks and intervals for charting  

