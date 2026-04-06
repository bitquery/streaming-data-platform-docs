# Trades Cube

The **Trades** cube streams individual **swap-level** rows from the **Trading** API: each event includes **side**, **amounts** (base, quote, USD), **price**, **pair** (market, tokens, currencies), **trader**, **transaction** metadata, and a **supply** snapshot (**MarketCap**, **FDV**, circulating/total/max supply) for the token context on that row.

For **aggregated** token metrics across all pairs, use the **[Tokens cube](/docs/trading/crypto-price-api/tokens)**. For **pair-level** OHLC and volume intervals, use the **[Pairs cube](/docs/trading/crypto-price-api/pairs)**. Supply field meanings are documented under **[Supply fields](/docs/trading/crypto-price-api/supply-fields)**.

### Key points

- **Subscriptions**: These examples use **`subscription`** for real-time streams; you can often run the same selection as a **`query`** with an added time window on **`Block`** / **`Interval`** where supported.
- **Networks**: Filter with **`Pair.Market.Network`** (e.g. **`Solana`**, **`Ethereum`**).
- **Token filter**: Use **`Pair.Token.Id`** with the full id (e.g. **`bid:solana:<mint>`**, **`bid:eth:<lowercase_contract>`**) per your dataset conventions.
- **Trader filter**: Use **`Trader.Address`** for the wallet executing the trade.
- **USD vs quote**: **`PriceInUsd`** and **`AmountsInUsd`** are in USD where indexed; see **[Price Index Algorithm](/docs/trading/crypto-price-api/price-index-algorithm)** for how amounts and prices are derived.

More patterns: **[Crypto Price API examples](/docs/trading/crypto-price-api/examples)**.

---

## Stream new trades (multi-chain)

Subscribe to **new trades** across supported chains (e.g. Solana, Ethereum, BSC, Base, Arbitrum, Polygon) without a **`where`** filter on **`Trades`**, or adjust filters in the IDE for your use case.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/all-chains-New-Trades-Stream---Solana-eth-bsc-base--arbitrum-matic_2#).

```graphql
subscription {
  Trading {
    Trades {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

---

## All trades on Solana (with price, market cap, supply)

Filter **`Trades`** where the pair’s market is on **Solana**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-on-Solana-with-Price-Marketcap-supply).

```graphql
subscription {
  Trading {
    Trades(where: { Pair: { Market: { Network: { is: "Solana" } } } }) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

---

## Trades for a specific token on Solana

Filter by **`Pair.Token.Id`** (example: **`bid:solana:…`** mint) and **Solana** network.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/Trades-of-a-specific-token-on-Solana).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump" }
          }
        }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

---

## All trades for a specific Ethereum token (price, market cap, supply)

Same shape as Solana; filter **`Pair.Market.Network`** **`Ethereum`** and **`Pair.Token.Id`** **`bid:eth:…`** (use **lowercase** hex for EVM contracts in **`Id`** where required).

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-of-a-specific-Ethereum-token-with-Price-Marketcap-supply_1).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Ethereum" } }
          Token: {
            Id: { is: "bid:eth:0x8b1484d57abbe239bb280661377363b03c89caea" }
          }
        }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

---

## All trades for a trader on Solana

Filter **`Trader.Address`** and **Solana** market network.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/All-trades-of-a-trader).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: { Market: { Network: { is: "Solana" } } }
        Trader: { Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" } }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```

---

## Trades for a specific trader on a specific token (Solana)

Combine **`Pair`** (network + **`Token.Id`**) and **`Trader.Address`**. Note the **comma** between **`Pair`** and **`Trader`** inside **`where`**.

You can run this subscription [in the Bitquery IDE](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token).

```graphql
subscription {
  Trading {
    Trades(
      where: {
        Pair: {
          Market: { Network: { is: "Solana" } }
          Token: {
            Id: { is: "bid:solana:4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump" }
          }
        }
        Trader: { Address: { is: "GWcAopUZKokUUQAMDrNzd1YVHLJqbzJomu2pzNqLe9U3" } }
      }
    ) {
      Side
      Supply {
        MaxSupply
        TotalSupply
        FullyDilutedValuationUsd
        CirculatingSupply
        MarketCap
      }
      Trader {
        Address
      }
      TransactionHeader {
        Fee
        FeePayer
        Sender
        To
        Hash
        Index
      }
      Amounts {
        Base
        Quote
      }
      AmountsInUsd {
        Base
        Quote
      }
      Block {
        Date
        Time
        Timestamp
      }
      Pair {
        Currency {
          Id
          Name
          Symbol
        }
        Market {
          Address
          Program
          Network
        }
        QuoteCurrency {
          Id
          Name
          Symbol
        }
        Token {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
        QuoteToken {
          Address
          Id
          IsNative
          Symbol
          TokenId
          Network
        }
      }
      Price
      PriceInUsd
    }
  }
}
```
