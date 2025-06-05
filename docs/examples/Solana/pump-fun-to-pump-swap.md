# Understanding Pump.fun: From Launchpad to PumpSwap

Pump fun is a Solana-based memecoin launchpad that has reshaped how tokens are created and traded. At its core is a bonding curve model, allowing anyone to launch a token with a fixed supply of 1 billion tokens, where around 800 million tokens are made available for bonding.

As traders buy into the curve, the price increases non-linearly—early buyers benefit the most. The bonding curve progress, a very useful metric for developers and traders, can be computed as:

:::note
**Simplified Formula**:
BondingCurveProgress = 100 - (((balance - 206900000) \* 100) / 793100000)
:::

,where balance is balance of the bonding curve for that specific token.

This helps identify tokens nearing sell-out, a common signal for tokens “about to pump.”

Once a token reaches full bonding (100%), it automatically migrates to PumpSwap, Pump fun’s native AMM DEX. From there, it trades like any other Solana token. No manual listing is needed; the system handles everything.

To help developers, traders, and analysts follow this journey, Bitquery offers a comprehensive real-time API suite that spans the entire lifecycle of a Pump fun token. Let’s walk through it:

<head>
  <meta name="title" content="Understanding Pump.fun Token Lifecycle with Bitquery APIs - Real-Time On-Chain Data"/>
  <meta name="description" content="Learn how Pump.fun tokens are created, traded, and graduated to PumpSwap—and how to track every step using real-time Bitquery APIs."/>
  <meta name="keywords" content="Pump.fun API, Solana memecoins, PumpSwap migration, Pump.fun token lifecycle, on-chain trading data, real-time blockchain API, Solana Shred Streams, token bonding curve, crypto analytics, Bitquery Pump.fun, DEX trades, token market cap, Solana developer tools"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Understanding Pump.fun Token Lifecycle with Bitquery APIs"/>
  <meta property="og:description" content="A complete guide to tracking Pump.fun token creation, trading, bonding curve, and migration to PumpSwap using Bitquery’s real-time APIs."/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Track the Full Lifecycle of Pump.fun Tokens with Bitquery APIs"/>
  <meta property="twitter:description" content="From token launch to trading and migration, explore how to monitor Pump.fun tokens in real-time using Bitquery's blockchain APIs."/>
</head>

## Track New Token Creations in Real-Time

Every token on Pump fun starts with a launch event. You can track these launches in real-time using a streaming API:

- [Track Pump Fun Token Creations in Real-Time Using Subscription](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#track-newly-created-pump-fun-tokens)

This API streams metadata like token name, symbol, mint, creator address, and timestamp the moment a new token is created.

## Follow Real-Time Market Data As They Are Traded on Pumpfun

Pumpfun tokens are actively traded while they climb the bonding curve. Traders need up-to-the-second price feeds and trade streams:

- [Track Price of a Token in Real-Time](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#track-price-of-a-token-in-real-time)

- [Get Real-Time Trades on Pump Fun](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#get-real-time-trades-on-pump-fun)

- [Get OHLC Data of a Token](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#get-ohlc-data-of-a-token)

These APIs provide:

- Price ticks per trade

- Trade sides (buy/sell)

- Volume and trader addresses

- 1-minute OHLC data for charting and analysis

## Analyze Token Performance

For deeper insights and analytics, developers can extract:

- [Token Price Change Over Time (Delta from X Minutes Back)](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#token-price-change-over-time-delta-from-x-minutes-back)

- [ATH Market Cap in a Specific Timeframe](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#ath-market-cap-in-a-specific-timeframe)

- [Get Market Cap, Price, Liquidity, Bonding Curve, and Volume](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#get-market-cap-price-liquidity-bonding-curve-and-volume)

- [Get Detailed Trade Stats: Volume, Buys, Sells, Makers, Buyers, Sellers](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#get-detailed-trade-stats-volume-buys-sells-makers-buyers-sellers)

These endpoints help answer questions like:

- What’s the token’s current liquidity?

- Has it reached its all-time high market cap?

- How many unique wallets are buying/selling?

## Identify Hot Tokens and Dev Insights

Traders constantly seek trending tokens or insider holds:

- [Top Pump Fun Tokens by Market Cap](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#top-pump-fun-tokens-by-market-cap)

- [Track “King of the Hill” Tokens (30K–35K Market Cap)](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#track-king-of-the-hill-tokens-30k35k-market-cap)

- [Get Dev’s Holdings of a Token](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-API/#get-devs-holdings-of-a-token)

These tools surface:

- Top-performing memecoins

- Tokens nearing PumpSwap graduation (30k–35k cap)

- Developer-controlled balances

## Graduation to PumpSwap and Further Trading

A Pump.fun token graduates (i.e., migrates to PumpSwap) when its bonding curve is fully sold out, meaning 100% of the 800 million tradable tokens have been bought.

Here’s what triggers graduation:

- Total tokens sold reaches the maximum sellable limit (excluding the reserved ~200M tokens)

- The market cap typically approaches $30K–$35K, depending on SOL price and trading dynamics

- The Pump.fun platform then automatically creates a PumpSwap liquidity pool for the token; no manual action is needed

Once graduated:

- Token trading stops on Pump.fun

- Trading resumes on PumpSwap as an AMM pair

You can track these graduation events in real-time using Bitquery’s API:

- [Track Pump Fun Token Migrations to PumpSwap](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-Marketcap-Bonding-Curve-API/#track-pump-fun-token-migrations-to-pumpswap)

Post-migration, tokens trade as standard AMM pairs. Bitquery continues to offer real-time data support:

- [Latest Trades for a Token on Pumpswap - Websocket](https://docs.bitquery.io/docs/examples/Solana/pump-swap-api/#latest-trades-for-a-token-on-pumpswap---websocket)

- [Get Buy Volume, Sell Volume, Buys, Sells, Makers, Total Trade Volume, Buyers, Sellers of a Specific Token](https://docs.bitquery.io/docs/examples/Solana/pump-swap-api/#get-buy-volume-sell-volume-buys-sells-makers-total-trade-volume-buyers-sellers-of-a-specific-token)

## Tracking Pumpfun Token Journey With Bitquery Shred Stream

Bitquery’s Kafka streams offer ultra-low-latency access to blockchain data by tapping directly into Solana’s Shred-level architecture. On Solana, a shred is the smallest fragment of a block — and it’s the first unit of data propagated between validators.

Bitquery’s Shred Streams capture transactions as they’re broadcast to validators, often before the block is finalized and even before timestamps are attached. This means you receive transaction data faster than any traditional block-based solution — giving you a true edge in latency-sensitive use cases like arbitrage, sniping, and real-time analytics.

Bitquery offers three main Kafka topics for Solana:

- `solana.dextrades.proto` — Includes all trade and liquidity pool change data
- `solana.tokens.proto` — Covers token transfers, supply changes, and balance updates at both the account and instruction level
- `solana.transactions.proto` — Delivers detailed data for blocks, transactions, and instructions

You can check out more details about Bitquery provided Solana Shred Streams [here](https://docs.bitquery.io/docs/streams/protobuf/chains/Solana-protobuf/) and Python code examples [here](https://docs.bitquery.io/docs/streams/protobuf/kafka-protobuf-python/).

## Conclusion

Pump fun has become the meme-fueled engine of Solana’s token economy. It has launched millions of tokens, introduced a playful but potent market dynamic, and evolved into a serious arena for real-time trading.

For developers and analysts who want to build tools around this phenomenon, Bitquery offers a plug-and-play data layer that covers every phase of a Pump fun token’s lifecycle—from minting to AMM trading.

Whether you’re building dashboards, bots, trading tools, or alpha groups, these APIs let you track the entire journey without writing indexers or running infra.

Start querying. Stay real-time. And ride the next pump.
