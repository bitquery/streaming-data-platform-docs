# Build AI Trading Agents with Bitquery Solana Data

In this section, we will explore how to use **Bitquery APIs and real-time streams** to build AI-powered trading agents for the **Solana blockchain**.

**Your AI Trading Agent's Mission:**

> You are a specialized trading agent operating on the Solana blockchain, you will optimize an existing portfolio by analyzing and trading trending tokens. Your primary goal is to identify profitable tokens in the market, assess wallet balances, and execute calculated swap decisions to enhance portfolio value.

### Investment Decision Process

Follow these steps when making portfolio optimization decisions:

1. Use trending data to identify promising tokens with potential profit.
2. For each trending token, retrieve detailed information to evaluate its market cap, liquidity, volatility, and security.
3. Check the wallet balance to understand the available assets and decide on a safe percentage to invest.
4. Execute swaps to acquire trending tokens, ensuring the chosen amount.
5. Continuously monitor token performance and adjust holdings to maximize profits. For this you can use [Bitquery Shred Streams](https://docs.bitquery.io/docs/streams/real-time-solana-data/#kafka-stream-by-bitquery) to monitor token prices, new token creation and other activities with sub-second latency.

# Key Bitquery Streams and Queries for Trading Agents

## 1. Top Trending Tokens

Detect tokens with rising popularity and trader activity.

**Docs:** [Top 10 Trending Solana Tokens](https://docs.bitquery.io/docs/examples/Solana/solana-dextrades/#top-10-trending-solana-tokens)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TrendingTokens {
  Solana {
    DEXTradeByTokens(
      limit: { count: 10 }
      orderBy: { descendingByField: "tradesCountWithUniqueTraders" }
    ) {
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
      }
      tradesCountWithUniqueTraders: count(distinct: Transaction_Signer)
    }
  }
}
```

</details>

**Use:** Filter tokens with rising trader activity to shortlist tokens to buy.

## 2. Volatility of a Token

Measure short-term price fluctuations to assess risk and profit potential.

**Query Link:** [Volatility of a Pair on Solana](https://ide.bitquery.io/Volatility-of-a-Pair-on-Solana)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query Volatility {
  Solana(dataset: realtime, network: solana) {
    DEXTrades(
      where: {
        Trade: {
          Buy: {
            Currency: {
              MintAddress: {
                is: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
              }
            }
          }
          Sell: {
            Currency: {
              MintAddress: {
                is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              }
            }
          }
        }
      }
    ) {
      volatility: standard_deviation(of: Trade_Buy_Price)
    }
  }
}
```

</details>

**Use:** High volatility can indicate short-term profit opportunities but also increased risk.

## 3. Liquidity Pool Analysis

Evaluate token liquidity to avoid low-volume or illiquid tokens.

**Docs:** [DEX Pools on Solana](https://docs.bitquery.io/docs/examples/Solana/solana-dexpools)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query LiquidityPools {
  Solana {
    DEXPools(
      limit: { count: 10 }
      orderBy: { descendingByField: "liquidityUSD" }
    ) {
      Pool {
        Address
      }
      liquidityUSD: sum(of: Reserve_USD)
      Token0 {
        Symbol
        MintAddress
      }
      Token1 {
        Symbol
        MintAddress
      }
    }
  }
}
```

</details>

**Use:** Focus on tokens with strong liquidity to ensure reliable entry and exit points.

## 4. Wallet Balances Monitoring

Review current portfolio composition before making swaps.

**Docs:** [Account Balances on Solana](https://docs.bitquery.io/docs/examples/Solana/solana-balance-updates/#get-all-the-tokens-owned-by-an-address)

[Run Query](https://ide.bitquery.io/tokens-owned-by-an-address)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    BalanceUpdates(
      where: { BalanceUpdate: { Account: { Owner: { is: "WALLET ADDRESS" } } } }
      orderBy: { descendingByField: "BalanceUpdate_Balance_maximum" }
    ) {
      BalanceUpdate {
        Balance: PostBalance(maximum: Block_Slot)
        Currency {
          Name
          Symbol
        }
      }
    }
  }
}
```

</details>

**Use:** Determine available assets and calculate safe investment amounts for token swaps.

## 5. DEX Trade Streams for Real-Time Insights

Subscribe to continuous streams of Solana DEX trades for live market intelligence.

**Docs:** [DEX Trades on Solana](https://docs.bitquery.io/docs/examples/Solana/solana-dextrades)

<details>
  <summary>Click to expand GraphQL Stream</summary>

```graphql
subscription LiveTrades {
  Solana {
    DEXTrades {
      Trade {
        Buy {
          Currency {
            Symbol
          }
          Amount
        }
        Sell {
          Currency {
            Symbol
          }
          Amount
        }
      }
      Transaction {
        Timestamp
      }
    }
  }
}
```

</details>

**Use:** React instantly to market movements and execute time-sensitive trades.

## 6. Token Holders Distribution (Security Check)

Check token decentralization to avoid risky, whale-dominated assets.

**Docs:** [Token Holders on Solana](https://docs.bitquery.io/docs/examples/Solana/solana-tokenholders)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query TokenHolders {
  Solana {
    TokenHolders(
      where: { Currency: { MintAddress: { is: "TOKEN_MINT_ADDRESS" } } }
      limit: { count: 10 }
      orderBy: { descendingByField: "Balance" }
    ) {
      Holder {
        Address
      }
      Balance
    }
  }
}
```

</details>

**Use:** Avoid tokens with highly concentrated ownership that may be vulnerable to manipulation.

## 7. Avoiding Bots with DEXRabbit (Built by Bitquery)

Your AI Trading Agent should monitor **bot activity** on DEXs. Bots can cause **sudden price spikes**, **wash trading**, or manipulate token prices, posing risks to human traders.

**[DexRabbit.com](https://dexrabbit.com/)**, built on Bitquery data, offers charts and dashboards to detect bot activity in real-time.

### Key Bot Activity Indicators to Monitor:

![DexRabbit Bot Detection using Charts](/img/usecases/gopher_bot.png)


| Indicator                              | Description                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| **Highly repetitive trade patterns**   | Identical trades happening in short intervals suggest bot activity.   |
| **Large trade bursts at odd hours**    | Bots often execute trades at low-liquidity times to influence price.  |
| **Frequent pump-and-dump patterns**    | Sharp price surges followed by rapid sell-offs indicate manipulation. |
| **Unusual token holder concentration** | Bots may use multiple wallets to appear as unique traders.            |



## Building the AI Trading Loop

Your AI Trading Agent combines the above streams as follows:

1. Fetch Top Trending Tokens to shortlist candidates.
2. For each token:

   - Analyze Liquidity, Volatility, and Holders Distribution.

3. Check Wallet Balances to calculate possible investment amount.
4. Use Real-Time Trade Streams to time the market entry.
5. Execute Swaps on high-potential tokens.
6. Continuously monitor market data and adjust holdings as needed.

## Next Steps

- Integrate these Bitquery APIs into your AI agent.
- Define risk management parameters, such as maximum percentage of balance per trade.
- Automate decision-making logic based on market data.
- Continuously refine and improve trading strategies using real-time data.

You can also integrate off-chain information like Twitter feeds to decide if a token is worth investing

- Combine with **NLP (Natural Language Processing)** to do **sentiment analysis** on tweets.
- Build **alert systems** based on specific keywords or sentiment spikes.
- Monitor tweets from key influencers and trigger trades based on their content.
- Use Twitter data as a factor in your **AI models' decision-making**.


-----

*This material is for educational and informational purposes only and is not intended as investment advice. The content reflects the author's personal research and understanding. While specific investments and strategies are mentioned, no endorsement or association with these entities is implied. Readers should conduct their own research and consult with qualified professionals before making any investment decisions. Bitquery is not liable for any losses or damages resulting from the application of this information.*

