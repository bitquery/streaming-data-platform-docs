import VideoPlayer from "../../../src/components/videoplayer.js";

# Binance Meme Rush API

Binance has launched Meme Rush, a new discovery feature inside the Binance Wallet that gives users early access to trending meme-coins from external launch platforms. Through a partnership with Four.Meme on the BNB Smart Chain, users can create and launch their own meme coins directly via Binance Wallet. Tokens launched in this way typically have contract addresses that start with `0x4444…`.

Get ultra low latency Binance Meme Rush memecoin data on BNB Chain: live trades, bonding curve progress, newly created tokens, prices, OHLC, liquidity, migrations, top traders and more.

The below GraphQL APIs and Streams are examples of data points you can get with Bitquery. If you have questions on other data points, reach out to [support](https://t.me/Bloxy_info).

Need zero-latency BSC data? Read about our Streams and contact us for a trial: https://docs.bitquery.io/docs/streams/

You may also be interested in:

- [Crypto Price API ➤](https://docs.bitquery.io/docs/trading/crypto-price-api/)
- [BSC Pancake Swap APIs ➤](https://docs.bitquery.io/docs/blockchain/BSC/pancake-swap-api/)
- [BSC DEX Trades ➤](https://docs.bitquery.io/docs/blockchain/BSC/bsc-dextrades/)
- [PumpFun API ➤](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/)

<head>
<title>Binance Meme Rush API - Live Trades, Bonding Curve, Prices, Liquidity on BSC</title>
<meta name="title" content="Binance Meme Rush API - Live Trades, Bonding Curve, Prices, Liquidity on BSC"/>

<meta
  name="description"
  content="Ultra low latency Binance Meme Rush memecoin data on BNB Chain: live trades, bonding curve progress, new tokens, prices, OHLC, liquidity, migrations, top traders. Access via GraphQL, streams, and Kafka."
/>

<meta
  name="keywords"
  content="Binance Meme Rush API,Binance Meme Rush bsc api,Binance Meme Rush trading api,Binance Meme Rush bonding curve api,Binance Meme Rush prices api,Binance Meme Rush liquidity api,Binance Meme Rush ohlc api,Binance Meme Rush memecoin api,bnb chain meme api,bsc meme token api,bitquery Binance Meme Rush api,real-time bsc trades,bsc websocket api,crypto trading api,blockchain market data api,memecoin analytics"
/>

<meta name="robots" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />

<meta
  property="og:title"
  content="Binance Meme Rush API - BSC - Live Trades, Bonding Curve, Prices"
/>

<meta
  property="og:description"
  content="Get Binance Meme Rush data on BNB Chain: trades, bonding curve progress, prices, liquidity, new tokens, migrations, and more."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />

<meta
  property="twitter:title"
  content="Binance Meme Rush API - BSC - Live Trades, Bonding Curve, Prices"
/>

<meta property="twitter:description" content="Get Binance Meme Rush data on BNB Chain: trades, bonding curve progress, prices, liquidity, new tokens, migrations, and more." />
</head>

::::note
To query or stream data via GraphQL outside the Bitquery IDE, you need to generate an API access token.

Follow the steps here to create one: https://docs.bitquery.io/docs/authorisation/how-to-generate/
::::

---

### Table of Contents

### 1. Token Lifecycle, Migrations & Bonding Curve

- [Track All Binance Meme Rush Tokens That Have Migrated to Pancakeswap ➤](#track-all-binance-meme-rush-tokens-that-have-migrated-to-pancakeswap)
- [Check if a Binance Meme Rush token has migrated or not ➤](#check-if-a-binance-meme-rush-token-has-migrated-or-not)
- [Bonding Curve Progress API for Binance Meme Rush token ➤](#bonding-curve-progress-api-for-binance-meme-rush-token)
- [Get Binance Meme Rush Tokens which are above 95% Bonding Curve Progress ➤](#get-binance-meme-rush-tokens-which-are-above-95-bonding-curve-progress)
- [Get Binance Meme Rush token creations on Four Meme ➤](#get-binance-meme-rush-token-creations-on-four-meme)
- [Get Meme Rush Tokens created by a specific Dev ➤](#get-meme-rush-tokens-created-by-a-specific-dev)
- [Get Dev Address of a Meme Rush token ➤](#get-dev-address-of-a-meme-rush-token)

### 2. Trading & Market Data

- [Subscribe the Latest Trades of Meme Rush tokens on Four Meme ➤](#subscribe-the-latest-trades-of-meme-rush-tokens-on-four-meme)
- [Get Latest Buys and Sells for a Meme Rush Token ➤](#get-latest-buys-and-sells-for-a-meme-rush-token)
- [Get Trade Metrics of a Meme Rush Token ➤](#get-trade-metrics-of-a-meme-rush-token)
- [Get latest price of a Meme Rush token ➤](#get-latest-price-of-a-meme-rush-token)
- [Get ATH price of a Meme Rush Token ➤](#get-ath-price-of-a-meme-rush-token)
- [Get Price Change Percentage for a Meme Rush Token ➤](#get-price-change-percentage-for-a-meme-rush-token)
- [Get OHLCV data of a Meme Rush Token ➤](#get-ohlcv-data-of-a-meme-rush-token)
- [Get Trade Volume and Number of Trades for a Meme Rush Token ➤](#get-trade-volume-and-number-of-trades-for-a-meme-rush-token)

### 3. Trader Insights & Analytics

- [Monitor Meme Rush trades of traders on Four.Meme ➤](#monitor-meme-rush-trades-of-traders-on-fourmeme)
- [Track Meme Rush Tokens in 14k to 18k Marketcap ➤](#track-meme-rush-tokens-in-14k-to-18k-marketcap)
- [Top Buyers for a Meme Rush Token on Four Meme ➤](#top-buyers-for-a-meme-rush-token-on-four-meme)
- [Top Traders of a Meme Rush token ➤](#top-traders-of-a-meme-rush-token)

### 4. Market Cap, Liquidity & Metadata

- [Get Realtime Market Cap and Price of a Meme Rush Token ➤](#get-realtime-market-cap-and-price-of-a-meme-rush-token)
- [Metadata for a Newly Created Meme Rush Token ➤](#metadata-for-a-newly-created-meme-rush-token)
- [Get liquidity of a Meme Rush token ➤](#get-liquidity-of-a-meme-rush-token)

### 5. Getting Started

- [Bitquery DEX Data Access Options ➤](#bitquery-dex-data-access-options)
- [Getting Started with Bitquery ➤](#getting-started-with-bitquery)

## Bitquery DEX Data Access Options

- **GraphQL APIs**: Query historical and real-time EVM data with flexible filtering and aggregation
- **Real-time Streams**: Subscribe to live EVM blockchain events via WebSocket subscriptions
- **Cloud Solutions**: Access EVM data through AWS, GCP, and Snowflake integrations
- **Kafka Streams**: High-throughput data streaming for enterprise applications

## Getting Started with Bitquery:

- [Learning Track](https://docs.bitquery.io/docs/start/learning-path/): Learning track to get started with Bitquery GraphQL APIs and streams.
- [BSC DEX Trades](https://docs.bitquery.io/docs/blockchain/BSC/bsc-dextrades/): Real time DEX Trading data via examples.
- [BSC Uniswap APIs](https://docs.bitquery.io/docs/blockchain/BSC/bsc-uniswap-api/): Uniswap Trades on BSC network with the help of examples.
- [BSC Pancake Swap APIs](https://docs.bitquery.io/docs/blockchain/BSC/pancake-swap-api/): Pancake swap Trades on BSC network with the help of examples.
- [Trade APIs](https://docs.bitquery.io/docs/trading/crypto-price-api/examples/): Multi-chain Trade API Examples.

## Track All Binance Meme Rush Tokens That Have Migrated to Pancakeswap

This query tracks Binance Meme Rush token migrations to Pancakeswap in realtime by monitoring transactions sent to the Four Meme factory address (`0x5c952063c7fc8610ffdb798152d69f0b9550762b`) and filtering for `PairCreated` and `PoolCreated` events. These events are emitted when a meme rush token graduates from Four Meme and migrates to Pancakeswap. Test it [here](https://ide.bitquery.io/binance-meme-rush-migration-to-pancakeswap).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    Events(
      where: {
        Log: { Signature: { Name: { in: ["PairCreated", "PoolCreated"] } } }
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Arguments: {
          includes: { Value: { Address: { startsWith: "0x4444" } } }
        }
      }
    ) {
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```

</details>

## Check if a Binance Meme Rush token has migrated or not

Below query will only show response if a the mentioned meme rush tokens have migrated to Pancakeswap. Note: Please use a `Block{Date}` filter to minimize the data processing and hence the query processing time and get fast responses.
Try the query [here](https://ide.bitquery.io/if-meme-rush-token-migrated-from-four-meme-or-not#).

<details>
  <summary>Click to expand GraphQL query</summary>
```graphql
{
  EVM(network: bsc, dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Date: {since: "2025-10-10"}}, Trade: {Dex: {OwnerAddress: {in: ["0xca143ce32fe78f1f7019d7d551a6402fc5350c73"]}}, Currency: {SmartContract: {in: ["0x4444ab6a517216ee356dc899b6f28a62249446b5", "0x44443eed3477fe8de8696e0b6021ff72cc6624ef"]}}}}
    ) {
      count
      Trade {
        Currency {
          SmartContract
        }
      }
    }
  }
}
```
</details>

## Bonding Curve Progress API for Binance Meme Rush token

Below query will give you amount of `left tokens` put it in the below given simplied formulae and you will get Bonding Curve progress for the meme rush token.

### Bonding Curve Progress Formula

- **Formula**:
  BondingCurveProgress = 100 - ((leftTokens \* 100) / initialRealTokenReserves)

Where:

- leftTokens = realTokenReserves - reservedTokens
- initialRealTokenReserves = totalSupply - reservedTokens

- **Definitions**:
  - `initialRealTokenReserves` = `totalSupply` - `reservedTokens`
    - `totalSupply`: 1,000,000,000 (Binance Meme Rush Token)
    - `reservedTokens`: 200,000,000
    - Therefore, `initialRealTokenReserves`: 800,000,000
  - `leftTokens` = `realTokenReserves` - `reservedTokens`
    - `realTokenReserves`: Token balance at the market address.

:::note
**Simplified Formula**:
BondingCurveProgress = 100 - (((balance - 200000000) \* 100) / 800000000)
:::

Try the API example [here](https://ide.bitquery.io/Get-bonding-curve-progress-for-a-specified-meme-rush-token).

<details>
  <summary>Click to expand GraphQL query</summary>
```graphql
query MyQuery ($token: String){
  EVM(dataset: combined, network: bsc) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x5c952063c7fc8610FFDB798152D69F0B9550762b"}}, Currency: {SmartContract: {is: $token}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount)
      BalanceUpdate {
        Address
      }
      Bonding_Curve_Progress_precentage: calculate(
        expression: "100 - ((($balance - 200000000) * 100) / 800000000)"
      )
    }
  }
}

````
</details>

<details>
  <summary>Click to expand Query Varibles (Paste this in variables section on IDE)</summary>
```json
{
  "token": "0x444478624cb7c53abe549d6449e024f4d8b51bec"
}
````

</details>

## Get Binance Meme Rush Tokens which are above 95% Bonding Curve Progress

Using the above Bonding Curve formula, we can calculate the token balances for the Four Meme Proxy contract (0x5c952063c7fc8610FFDB798152D69F0B9550762b) corresponding to approximately 95% to 100% progress along the bonding curve, that comes out to be `200,000,000` to `240,000,000`. The Binance Meme Rush tokens in the response are arranged in the ascending order of Bonding Curve Percentage, i.e., 95% to 100%. You can run and test the saved query [here](https://ide.bitquery.io/Meme-Rush-Tokens-between-95-and-100-bonding-curve-progress_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    BalanceUpdates(
      limit: { count: 10 }
      where: {
        BalanceUpdate: {
          Address: { is: "0x5c952063c7fc8610FFDB798152D69F0B9550762b" }
        }
        Currency: { SmartContract: { startsWith: "0x4444" } }
      }
      orderBy: { descendingByField: "balance" }
    ) {
      Currency {
        SmartContract
        Name
      }
      balance: sum(
        of: BalanceUpdate_Amount
        selectWhere: { ge: "200000000", le: "240000000" }
      )
      BalanceUpdate {
        Address
      }
      Bonding_Curve_Progress_precentage: calculate(
        expression: "100 - ((($balance - 200000000) * 100) / 800000000)"
      )
    }
  }
}
```

</details>

## Get Binance Meme Rush token creations on Four Meme

[Run Query](https://ide.bitquery.io/track-Binance-Meme-Rush-token-creations-on-Four-meme-token)

Binance Meme Rush is a new feature launched by Binance Wallet in collaboration with Four.Meme, aimed at enabling users to access meme tokens early in their initial stages, before they are listed on decentralized exchang
This query retrieves newly created Binance Meme Rush tokens on Four Meme by listening to the `TokenCreate` event and specifically filtering for event transactions which includes address value in arguments `0x4444`. The response provides:

**Token Information:**

- **creator**: Wallet address of the token creator
- **token**: Contract address of the newly created token
- **name**: Token name
- **symbol**: Token symbol/ticker
- **totalSupply**: Total supply (always 1 billion tokens)

**Launch Details:**

- **requestId**: Unique identifier for the token creation
- **launchTime**: Unix timestamp of when the token launched
- **launchFee**: Fee paid

 <details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      where: {
        Transaction: {
          To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
        }
        Log: { Signature: { Name: { is: "TokenCreate" } } }
        Arguments: {
          includes: { Value: { Address: { startsWith: "0x4444" } } }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Log {
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
        }
        Name
        Type
      }
      Transaction {
        Hash
        To
        From
      }
    }
  }
}
```

</details>

## Get Meme Rush Tokens created by a specific Dev

This API fetches Binance Meme Rush tokens created by a specific dev on BSC by tracking token minting transfers signed by a particular dev.
`Dev Address` here in example is `0xF4f3eb591c47d14614D3A54aCBA28019e2041066`. Use a date filter based on your needs — shorter time ranges mean faster execution and reduced query time.

[Run Query](https://ide.bitquery.io/meme-rush-tokens-created-by-specific-dev)

 <details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  EVM(network: bsc, dataset: combined) {
    Transfers(
      where: {
        Block: { Date: { since: "2025-08-01" } }
        Transfer: {
          Sender: { is: "0x0000000000000000000000000000000000000000" }
          Currency: { SmartContract: { startsWith: "0x4444" } }
        }
        Transaction: {
          From: { in: ["0xF4f3eb591c47d14614D3A54aCBA28019e2041066"] }
        }
      }
    ) {
      Transaction {
        From
        To
      }
      Transfer {
        Sender
        Receiver
        Amount
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

</details>

## Get Dev Address of a Meme Rush token

Fetches the developer address that created a specific Meme Rush token on BSC by tracing the minting transfer (from the zero address) of that token’s smart contract.
Use a date filter based on your needs — shorter time ranges make the query execute faster and return results more efficiently.
Token Address in this example is `0x44442f6b816d4308859470573cb32652c8eee0bb`.

[Run Query](https://ide.bitquery.io/check-who-created-this-meme-rush-token)

 <details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  EVM(network: bsc, dataset: combined) {
    Transfers(
      where: {
        Block: { Date: { since: "2025-08-01" } }
        Transfer: {
          Currency: {
            SmartContract: { is: "0x44442f6b816d4308859470573cb32652c8eee0bb" }
          }
          Sender: { is: "0x0000000000000000000000000000000000000000" }
        }
      }
    ) {
      Transaction {
        From
        To
      }
      Transfer {
        Sender
        Receiver
        Amount
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

</details>

## Subscribe the Latest Trades of Meme Rush tokens on Four Meme

Using subscriptions you can subscribe to the latest trades of Meme Rush tokens on Four Meme as shown in this [example](https://ide.bitquery.io/Latest-trades-of-meme-rush-tokens-on-fourmeme). The subscription returns latest trade info such as buyers and sellers, buy and sell currency details and amount of currency.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolName: { is: "fourmeme_v1" } } }
        any: [
          {
            Trade: {
              Buy: { Currency: { SmartContract: { startsWith: "0x4444" } } }
            }
          }
          {
            Trade: {
              Sell: { Currency: { SmartContract: { startsWith: "0x4444" } } }
            }
          }
        ]
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

</details>

## Get Latest Buys and Sells for a Meme Rush Token

[This](https://ide.bitquery.io/Latest-buys-and-sells-for-a-meme-rush-coin-on-four-meme-dex) query retrieves the most recent token buy and sell trades of a specific Meme Rush token on Four Meme Exchange.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc, dataset: combined) {
    buys: DEXTrades(
      where: {
        Trade: {
          Buy: { Currency: { SmartContract: { is: $currency } } }
          Success: true
          Dex: { ProtocolName: { is: "fourmeme_v1" } }
        }
      }
      orderBy: { descending: Block_Time }
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
          Sell: { Currency: { SmartContract: { is: $currency } } }
          Success: true
          Dex: { ProtocolName: { is: "fourmeme_v1" } }
        }
      }
      orderBy: { descending: Block_Time }
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
  "currency": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

You can also check if the token is listed on other DEX using this [example](https://docs.bitquery.io/docs/blockchain/BSC/bsc-dextrades/#get-all-dexs-where-a-specific-token-is-listed).

## Get Trade Metrics of a Meme Rush Token

Use the below query to get trade metrics like volume and trades for a token in different time frames, such as `24 hours`, `1 hour` and `5 minutes`. Test it [here](https://ide.bitquery.io/volume-and-trades-for-a-meme-rush-token-in-different-time-frames).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: $currency } }, Success: true }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      volume_24hr: sum(of: Trade_Side_AmountInUSD)
      volume_1hr: sum(
        of: Trade_Side_AmountInUSD
        if: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
      )
      volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: { Block: { Time: { since_relative: { minutes_ago: 5 } } } }
      )
      trades_24hr: count
      trades_1hr: count(
        if: { Block: { Time: { since_relative: { hours_ago: 1 } } } }
      )
      trades_5min: count(
        if: { Block: { Time: { since_relative: { minutes_ago: 5 } } } }
      )
    }
  }
}
```

```json
{
  "currency": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Get latest price of a Meme Rush token

We launched the [Price Index](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/) in August 2025, allowing you to track price of any token trading onchain.
Here's an example of [tracking Meme Rush token prices](https://ide.bitquery.io/latest-meme-rush-token-price-on-four-meme-dex#).

<details>
  <summary>Click to expand GraphQL query</summary>

```
{
  Trading {
    Pairs(
      where: {Price: {IsQuotedInUsd: false}, Market: {Network: {is: "Binance Smart Chain"}, Program: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Token: {Address: {is: "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"}}, Interval: {Time: {Duration: {eq: 60}}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Market {
        Address
        Network
        Program
        Protocol
        ProtocolFamily
      }
      Price {
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
      Token {
        Address
        Name
        Symbol
      }
      QuoteToken {
        Address
        Name
        Symbol
      }
      Volume {
        Base
        Usd
      }
    }
  }
}
```

</details>

## Get ATH price of a Meme Rush Token

Fetches the All-Time High (ATH) price of a specific Meme Rush token on BSC, using the `DEXTradeByTokens` dataset to calculate the 98th percentile of trade prices (approximate ATH).
Use a date filter suited to your needs — a shorter duration will make the query run faster and return results more efficiently. Try the API [here](https://ide.bitquery.io/meme-rush-token-ATH-price).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query tradingView(
  $network: evm_network
  $dataset: dataset_arg_enum
  $token: String
) {
  EVM(network: $network, dataset: $dataset) {
    DEXTradeByTokens(
      limit: { count: 1 }
      where: {
        Block: { Date: { since: "2025-10-10" } }
        TransactionStatus: { Success: true }
        Trade: {
          Side: { Currency: { SmartContract: { is: "0x" } } }
          Currency: { SmartContract: { is: $token } }
          Success: true
        }
      }
    ) {
      max: quantile(of: Trade_PriceInUSD, level: 0.98)
      Block {
        Time
      }
    }
  }
}
```

```json
{
  "network": "bsc",
  "token": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701",
  "dataset": "combined",
  "local": "EVM",
  "interval": 60
}
```

</details>

## Get Price Change Percentage for a Meme Rush Token

Use the below query to get the price change in percentage for various time fields including `24 hours`, `1 hour` and `5 minutes`. Try it [here](https://ide.bitquery.io/Percentage-price-change-for-a-meme-rush-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: $currency } }, Success: true }
        Block: { Time: { since_relative: { hours_ago: 24 } } }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
        }
        price_24hr: PriceInUSD(minimum: Block_Time)
        price_1hr: PriceInUSD(
          if: { Block: { Time: { is_relative: { hours_ago: 1 } } } }
        )
        price_5min: PriceInUSD(
          if: { Block: { Time: { is_relative: { minutes_ago: 1 } } } }
        )
        current: PriceInUSD
      }
      change_24hr: calculate(
        expression: "( $Trade_current - $Trade_price_24hr ) / $Trade_price_24hr * 100"
      )
      change_1hr: calculate(
        expression: "( $Trade_current - $Trade_price_1hr ) / $Trade_price_1hr * 100"
      )
      change_5min: calculate(
        expression: "( $Trade_current - $Trade_price_5min ) / $Trade_price_5min * 100"
      )
    }
  }
}
```

```json
{
  "currency": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Get OHLCV data of a Meme Rush Token

Use the below query to get meme rush token OHLCV data. Test it [here](https://ide.bitquery.io/OHLC-for-a-meme-rush-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query tradingView($network: evm_network, $token: String) {
  EVM(network: $network, dataset: combined) {
    DEXTradeByTokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "Block_Time" }
      where: {
        Trade: {
          Currency: { SmartContract: { is: $token } }
          PriceAsymmetry: { lt: 0.1 }
          Dex: { ProtocolName: { is: "fourmeme_v1" } }
        }
      }
    ) {
      Block {
        Time(interval: { count: 5, in: minutes })
      }
      Trade {
        open: PriceInUSD(minimum: Block_Number)
        close: PriceInUSD(maximum: Block_Number)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volumeUSD: sum(of: Trade_Side_AmountInUSD, selectWhere: { gt: "0" })
    }
  }
}
```

```json
{
  "network": "bsc",
  "token": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Monitor Meme Rush trades of traders on Four.Meme

You can use our streams to monitor real time trades of a trader on Four Meme, for example run [this stream](https://ide.bitquery.io/monitor-meme-rush-token-trades-of-a-trader-on-four-meme_1).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  EVM(network: bsc) {
    DEXTrades(
      where: {
        Trade: { Dex: { ProtocolName: { is: "fourmeme_v1" } }, Success: true }
        Transaction: {
          From: { is: "0x7db00d1f5b8855d40827f34bb17f95d31990306e" }
        }
        any: [
          {
            Trade: {
              Buy: { Currency: { SmartContract: { startsWith: "0x4444" } } }
            }
          }
          {
            Trade: {
              Sell: { Currency: { SmartContract: { startsWith: "0x4444" } } }
            }
          }
        ]
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

</details>

You can also get the trade activities of a user on Pancake Swap using our [Pancake Swap](./pancake-swap-api.md) APIs.

## Track Meme Rush Tokens in 14k to 18k Marketcap

Tracks live Meme Rush tokens on BSC with a market cap between $14K–$18K, filtered by 14k to 18k Marketcap.
Useful for spotting emerging small-cap meme tokens in real time.
Try the query [here](https://ide.bitquery.io/meme-rush-tokens-in-14K-to-17K-Marketcap).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Price: {
          IsQuotedInUsd: true
          Average: { Mean: { gt: 0.000014, le: 0.000018 } }
        }
        Market: {
          Protocol: { is: "fourmeme_v1" }
          Network: { is: "Binance Smart Chain" }
        }
        Volume: { Usd: { gt: 5 } }
        Token: { Address: { startsWith: "0x4444" } }
      }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
      Volume {
        Base
        Quote
        Usd
      }
      marketcap: calculate(expression: "Price_Average_Mean * 1000000000")
      Price {
        Average {
          Mean
        }
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

</details>

## Top Buyers for a Meme Rush Token on Four Meme

[This](https://ide.bitquery.io/Top-buyers-of-a-meme-rush-token) query returns top buyers of a particular Meme Rush token on Four Meme, with currency smart contract as `0x44442202ff27ee2297c128d0c1ae43a0fbb35701` for this example.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($currency: String) {
  EVM(network: bsc, dataset: combined) {
    DEXTrades(
      where: {
        Trade: {
          Buy: { Currency: { SmartContract: { is: $currency } } }
          Success: true
          Dex: { ProtocolName: { is: "fourmeme_v1" } }
        }
      }
      limit: { count: 100 }
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
  "currency": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Get Trade Volume and Number of Trades for a Meme Rush Token

[This](https://ide.bitquery.io/volume-and-trades-for-a-token-in-different-time-frames_4) query returns the traded volume and number of trades for a particular Meme Rush token in different time frames, namely 24 hours, 1 hour and 5 minutes.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery(
  $currency: String
  $time_24hr_ago: DateTime
  $time_1hr_ago: DateTime
  $time_5min_ago: DateTime
) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: {
        Trade: { Currency: { SmartContract: { is: $currency } }, Success: true }
        Block: { Time: { since: $time_24hr_ago } }
      }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      volume_24hr: sum(of: Trade_Side_AmountInUSD)
      volume_1hr: sum(
        of: Trade_Side_AmountInUSD
        if: { Block: { Time: { since: $time_1hr_ago } } }
      )
      volume_5min: sum(
        of: Trade_Side_AmountInUSD
        if: { Block: { Time: { since: $time_5min_ago } } }
      )
      trades_24hr: count
      trades_1hr: count(if: { Block: { Time: { since: $time_1hr_ago } } })
      trades_5min: count(if: { Block: { Time: { since: $time_5min_ago } } })
    }
  }
}
```

```json
{
  "currency": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701",
  "time_24hr_ago": "2025-10-23T15:00:00Z",
  "time_1hr_ago": "2025-10-24T14:00:00Z",
  "time_5min_ago": "2025-10-24T15:55:00Z"
}
```

</details>

## Get Realtime Market Cap and Price of a Meme Rush Token

To get the market cap of a token we need two things, the latest `PriceInUSD` and `total supply` of the token. Total Supply is 1,000,000,000 (1B) for four meme tokens so we just need to get price and multiply it with 1B. [This](https://ide.bitquery.io/Real-Time-Marektcap-and-price-of-a-meme-rush-token) query helps with getting the latest USD price of a token and hence its latest Marketcap.

```
Market Cap = Total Supply * PriceInUSD
```

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Price: { IsQuotedInUsd: true }
        Market: {
          Protocol: { is: "fourmeme_v1" }
          Network: { is: "Binance Smart Chain" }
        }
        Volume: { Usd: { gt: 5 } }
        Token: { Address: { is: "0x44442202ff27ee2297c128d0c1ae43a0fbb35701" } }
      }
    ) {
      Token {
        Name
        Symbol
        Address
      }
      Market {
        Protocol
        Program
        Network
        Name
        Address
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
      Volume {
        Base
        Quote
        Usd
      }
      marketcap: calculate(expression: "Price_Average_Mean * 1000000000")
      Price {
        Average {
          Mean
        }
        Ohlc {
          Close
          High
          Low
          Open
        }
      }
    }
  }
}
```

</details>

## Metadata for a Newly Created Meme Rush Token

This query will fetch you trade metrics, such as marketcap, trade volume, token holders and creation time for a newly created Meme Rush token on BSC network.
You can test the query [here](https://ide.bitquery.io/marketcap-total-holders-metrics-query).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery($token: String!) {
  EVM(network: bsc) {
    DEXTradeByTokens(
      where: { Trade: { Currency: { SmartContract: { is: $token } } } }
    ) {
      Block {
        createdAt: Time(minimum: Block_Time)
      }
      volume: sum(of: Trade_Side_AmountInUSD)
    }
    BalanceUpdates(where: { Currency: { SmartContract: { is: $token } } }) {
      holders: uniq(of: BalanceUpdate_Address, selectWhere: { gt: "0" })
    }
  }
  marketCap: Trading {
    Pairs(
      where: {
        Interval: { Time: { Duration: { eq: 1 } } }
        Market: { Network: { is: "Binance Smart Chain" } }
        Volume: { Usd: { gt: 5 } }
        Token: { Address: { is: $token } }
      }
      orderBy: { descending: Interval_Time_Start }
      limit: { count: 1 }
    ) {
      Price {
        Average {
          Mean
        }
      }
      marketcap: calculate(expression: "Price_Average_Mean * 1000000000")
    }
  }
}
```

```
{
  "token": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Top Traders of a Meme Rush token

This query will fetch you top traders of a meme rush token for the BSC network.
You can test the query [here](https://ide.bitquery.io/top-traders-of-a-meme-rush-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```
query topTraders($network: evm_network, $token: String) {
  EVM(network: $network, dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Currency: {SmartContract: {is: $token}}, Dex: {ProtocolName: {is: "fourmeme_v1"}}}}
    ) {
      Trade {
        Buyer
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      buyVolume: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sellVolume: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

```
{
  "network": "bsc",
  "token": "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"
}
```

</details>

## Get liquidity of a Meme Rush token

Using below API you can get the liquidity of a meme rush token. Subtract `200000000` from the Balance that this query returns because 200M tokens are reserved which gets transferred to pancakeswap when this meme rush token graduates. Test the API [here](https://ide.bitquery.io/Get-liquidity-of-a-meme-rush-token).

<details>
  <summary>Click to expand GraphQL query</summary>

```
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x5c952063c7fc8610FFDB798152D69F0B9550762b"}}, Currency: {SmartContract: {is: "0x44442202ff27ee2297c128d0c1ae43a0fbb35701"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount)
      BalanceUpdate {
        Address
      }
    }
  }
}
```

</details>
