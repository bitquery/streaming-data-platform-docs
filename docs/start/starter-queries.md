---
title: "Starter Queries - Bitquery API Examples by Chain"
description: "Curated, tested Bitquery API queries organised by chain and data type — trades, transfers, balances, holders, prices, liquidity, events and mempool."
keywords:
  [
    "Bitquery starter queries",
    "Bitquery examples",
    "blockchain API examples",
    "GraphQL blockchain",
    "Bitquery IDE"
  ]
---
# Starter Queries

Every query below is saved in the [Bitquery IDE](https://ide.bitquery.io) and was executed against the live API before publishing. Pick a chain, then a data type. Queries marked as needing history use the `archive` or `combined` dataset — the comment at the top of each of those queries shows the single line to change.

## Table of Contents

- [Bitcoin](#bitcoin)
- [Solana](#solana)
- [Robinhood Chain](#robinhood-chain)
- [Polymarket](#polymarket)
- [Perpetuals](#perpetuals)
- [TRON](#tron)
- [Cross-Chain](#cross-chain)
- [Ethereum](#ethereum)
- [BSC](#bsc)
- [Base](#base)
- [Arbitrum](#arbitrum)
- [Optimism](#optimism)
- [Polygon](#polygon)
- [Avalanche](#avalanche)
- [Celo](#celo)
- [Cronos](#cronos)
- [Klaytn](#klaytn)
- [Litecoin](#litecoin)
- [Bitcoin Cash](#bitcoin-cash)
- [Dogecoin](#dogecoin)
- [Dash](#dash)
- [Zcash](#zcash)
- [Cardano](#cardano)
- [Ripple](#ripple)
- [Stellar](#stellar)
- [Algorand](#algorand)
- [Filecoin](#filecoin)
- [Trading API](#trading-api)
- [Stablecoins](#stablecoins)
- [NFTs](#nfts)
- [Futures DEXs](#futures-dexs)
- [x402](#x402)

## Bitcoin

### Transfers

#### Inflows and Outflows of a wallet

This API returns all incoming and outgoing transactions for a specific Bitcoin wallet address.

▶️ [Inflows and Outflows of a wallet](https://ide.bitquery.io/Inflows-and-Outflow-of-a-bitcoin-wallet)

### Balances & Holders

#### Balance of an address at a past date

What one Bitcoin address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Bitcoin-Balance-of-an-address-at-a-past-date)

#### Bitcoin Balance for multiple addresses

This query calculates the combined balance of multiple Bitcoin wallet addresses by summing their total inflows and outflows: Balance = Total Output - Total Input. You can also set a date to get balances as of a specific point in time.

▶️ [Bitcoin Balance for multiple addresses](https://ide.bitquery.io/BTC-balance-api-for-multiple-addresses)

#### BTC balance api for multiple addresses

Pass an array of addresses to `inputAddress` and `outputAddress` with `{in: [...]}` to get per-wallet totals in a single request. Useful for exchanges, custodians, and portfolio dashboards that monitor many wallets at once.

▶️ [BTC balance api for multiple addresses](https://ide.bitquery.io/BTC-balance-API-for-multiple-addresses)

#### Bitcoin balance

Returns total BTC sent (inputs) and received (outputs) for an address, along with USD-equivalent values and first / last activity dates. Subtract `inputs.value` from `outputs.value` to get the current balance.

▶️ [Bitcoin balance](https://ide.bitquery.io/Bitcoin-balance_5)

#### Bitcoin balance at a given height

Need to know what a wallet held at a particular point in time? The `height` filter caps inputs and outputs at a given block number, which is exactly what you need for audits, tax reporting, and point-in-time portfolio snapshots.

▶️ [Bitcoin balance at a given height](https://ide.bitquery.io/bitcoin-balance-at-a-given-height)

#### Bitcoin balance on a given block height

Sum outputs and subtract inputs with a `height: {lteq: N}` cap to get the wallet's balance at a specific point on-chain. Useful for audits, tax snapshots, and point-in-time portfolio reporting.

▶️ [Bitcoin balance on a given block height](https://ide.bitquery.io/bitcoin-balance-on-a-given-block-height)

### Price & OHLC

#### Btc price in 2016

Pulls the BTC/USD price implied by any output on a given date — Bitquery stores the spot value at the time of each transaction, so you can derive a historical price by dividing USD value by BTC value.

▶️ [Btc price in 2016](https://ide.bitquery.io/btc-price-in-2016)

### Transactions

#### Details of Bitcoin Transaction

This API provides comprehensive details of a specific Bitcoin transaction in a single query.

▶️ [Details of Bitcoin Transaction](https://ide.bitquery.io/Details-of-Bitcoin-Transaction)

### Blocks & Validators

#### Bitcoin miners rewards

Mining rewards live in coinbase outputs (the first transaction in every block, `txIndex: 0`) with `outputDirection: mining`.

▶️ [Bitcoin miners rewards](https://ide.bitquery.io/bitcoin-miners-rewards)

#### Get miners activity in a specific timeframe

Pulls the activity count per miner address inside a date range. Drop or extend the date window to size the cohort however you need.

▶️ [Get miners activity in a specific timeframe](https://ide.bitquery.io/get-miners-activity-in-a-specific-timeframe)

#### Get miners first activity

For a specific set of miner addresses, this query returns the first block each one mined. Useful for cohort analysis, miner onboarding studies, or building "first seen" timelines.

▶️ [Get miners first activity](https://ide.bitquery.io/get-miners-first-activity)

## Solana

### Trades

#### Get Swaps by Pair Address

Get all trades related transactions for a specific pair address. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get Swaps by Pair Address](https://ide.bitquery.io/swaps-for-a-market-address-on-Solana)

#### Get Trades by Wallet Address

Get all trades related transactions (buy, sell) for a specific wallet address. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get Trades by Wallet Address](https://ide.bitquery.io/Solana-dextrades-by-a-trader_2)

#### Get Volume Stats for Solana Chain

Traded volume, trade count and active wallets for Solana over a stated window, from `DEXTradeByTokens`. Three things this query has to work around. `Solana.DEXTrades` keeps about 12 hours and has no archive, so it cannot answer this at all. `since_relative` does not filter this cube - 1, 2, 3 and 6 days back all return the same totals - so the window is an explicit timestamp you edit. And a `uniq` in the same selection as `sum` and `count` changes those other aggregates by roughly 10x, so active wallets is computed in its own aliased call. The volume sum also excludes single trades above $1M, which are mispriced rows; without that guard the total reads about $32 quadrillion a day instead of about $16 billion.

▶️ [Get Volume Stats for Solana Chain](https://ide.bitquery.io/Chain-stats-like-total-volume-traded-total-transactions-active-wallets_1)

#### Get Multiple Token Analytics — historical (beyond 30 days)

Returns analytics data for multiple token addresses. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Multiple Token Analytics — historical (beyond 30 days)](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-multiple-solana-tokens)

#### Get Token Metadata — historical (beyond 30 days)

Get the token metadata for contract (mint, standard, name, symbol). Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Token Metadata — historical (beyond 30 days)](https://ide.bitquery.io/Solana-currency-details)

#### Get Token Pair Stats — historical (beyond 30 days)

Get the pair stats by using pair address. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Token Pair Stats — historical (beyond 30 days)](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair)

#### Get Token Pairs by Address — historical (beyond 30 days)

Get the supported pairs for a specific token address. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Token Pairs by Address — historical (beyond 30 days)](https://ide.bitquery.io/traded-pairs-of-a-token_2)

#### Realised PnL, avg buy price, buy volume, sell volume of a Trader for specific token — historical (beyond 30 days)

Get realised PnL, average buy price, buy volume, and sell volume for a token on Solana of a trader for over a time window. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Realised PnL, avg buy price, buy volume, sell volume of a Trader for specific token — historical (beyond 30 days)](https://ide.bitquery.io/Realised-Pnl-avg-buy-price-Buy-volume-Sell-Volume-Solana_2)

#### Search tokens by name, symbol, mint address — historical (beyond 30 days)

Search for tokens based on contract address, token name or token symbol. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Search tokens by name, symbol, mint address — historical (beyond 30 days)](https://ide.bitquery.io/Token-Search-API---trump-symbol)

#### Buys Sells BuyVolume SellVolume Makers TotalTradedVolume PriceinUSD for solana token pair — historical (beyond 30 days)

Returns the essential stats for a token such as buy volume, sell volume, total buys, total sells, makers, total trade volume, buyers, sellers (in last 5 min, 1 hour) of a specific token. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Buys Sells BuyVolume SellVolume Makers TotalTradedVolume PriceinUSD for solana token pair — historical (beyond 30 days)](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair00_2)

### Transfers

#### Simple SOL transfers (Transactions not trades)

This API returns simple SOL transfers; in other words, it contains transactions that are simple token transfers, not trades.

▶️ [Simple SOL transfers (Transactions not trades)](https://ide.bitquery.io/Simple-SOL-transfers-Transactions-not-trades)

#### Solana Token Transfers for a Specific Address

This API retrieves the history of token transfers (both sent and received) for a specific Solana address within a defined time period.

▶️ [Solana Token Transfers for a Specific Address](https://ide.bitquery.io/Solana-historical-token-transfers-of-an-address-between-a-time)

#### Solana Transfers

This query gets the latest 10 transfers on Solana. You can increase the limit to get more transfers. This query only uses real-time data.

▶️ [Solana Transfers](https://ide.bitquery.io/Solana-transfers0_5)

#### Solana Historical Transfers

Solana Historical Transfers.

▶️ [Solana Historical Transfers](https://ide.bitquery.io/solana-historical-transfers_1)

#### Currency with elon inclusion

You can search tokens on Solana using names or symbols case insensitively also using our APIs and get prices and other details.

▶️ [Currency with elon inclusion](https://ide.bitquery.io/Currency-with-elon-inclusion)

#### Solana token transfers of Bags fm tokens

Track all transfers of Bags FM tokens across wallets. This Bags FM token transfers endpoint provides complete transfer history. 🔗.

▶️ [Solana token transfers of Bags fm tokens](https://ide.bitquery.io/Solana-token-transfers-of-Bags-fm-tokens)

#### Total txn fees paid by the Account

Get the total fees (in SOL and USD) paid by a specific Solana account across all transfers.

▶️ [Total txn fees paid by the Account](https://ide.bitquery.io/total-txn-fees-paid-by-the-Account)

#### Transaction fees paid by Account aggregated by currency

Get total fees paid by a Solana account for transferring each type of token.

▶️ [Transaction fees paid by Account aggregated by currency](https://ide.bitquery.io/Transaction-fees-paid-by-Account-aggregated-by-currency)

#### Transfers of a wallet

Fetches the recent 10 transfers of a specific wallet address `9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8`.

▶️ [Transfers of a wallet](https://ide.bitquery.io/Transfers-of-a-wallet_1)

#### Wallet transfers with transaction fees paid

Track wallet token transfers and get the fees paid for each by the address.

▶️ [Wallet transfers with transaction fees paid](https://ide.bitquery.io/wallet-transfers-with-transaction-fees-paid)

### Balances & Holders

#### Solana Instruction Balance Updates

This query returns Solana balance update info for any balance update event, including the address, amount, currency details, and the details of the program responsible for this update.

▶️ [Solana Instruction Balance Updates](https://ide.bitquery.io/Solana-InstructionBalanceUpdates)

#### Balance updates

Returns balance update associated with a instruction invocation.

▶️ [Balance updates](https://ide.bitquery.io/balance-updates)

#### Solana balance updates executing burn instruction

The query below uses the InstructionBalanceUpdates API to fetch balance updates that occur when token burn instructions execute.

▶️ [Solana balance updates executing burn instruction](https://ide.bitquery.io/solana-balance-updates-executing-burn-instruction)

#### Trades of wallets with balance Updates in that trades

Below query will give you the trades of the wallets present in `addressList` along with the balance updates happened in those trades..

▶️ [Trades of wallets with balance Updates in that trades](https://ide.bitquery.io/Trades-of-wallets-with-balance-Updates-in-that-trades)

### Price & OHLC

#### Token price from top market (rank 1)

Prices SOL from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Solana-Token-price-from-top-market-rank-1)

#### Get OHLCV by Pair Address

You can get charting data easily with this query. Adjust the intervals as necessary. This query supports historical data. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC-for-a-token_8)

#### Get Latest Price of a Token in USD

Get Latest Price of a Token in USD. Uses the `Pairs` cube. Replace the address in the `where` clause to use it. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get Latest Price of a Token in USD](https://ide.bitquery.io/Pumpfun-token-latest-price-USD)

#### Historical Price and Volume Data (Volume & Price, Last 24h using Trading API)

Use this API to get historical price and volume for a specific token over the past 24 hours. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Historical Price and Volume Data (Volume & Price, Last 24h using Trading API)](https://ide.bitquery.io/24h-historical-price-and-historical-volume-on-Solana)

#### Get Token Prices on Solana — historical (beyond 30 days)

Returns price information for multiple Solana tokens in a single request. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Token Prices on Solana — historical (beyond 30 days)](https://ide.bitquery.io/Get-multiple-Token-Prices)

#### Price change 5min, 1hr, 6hr precentage of a specific token — historical (beyond 30 days)

With this, you can get the price change 5min, 1hr, 6hr precentage of a specific token. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price change 5min, 1hr, 6hr precentage of a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_5)

#### Top 10 solana tokens by price change in last 1 hr — historical (beyond 30 days)

With this, you can get top 10 solana tokens by price change in last 1 hr. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 solana tokens by price change in last 1 hr — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-solana-tokens-by-price-change-in-last-1-hr_4)

#### ATH of multiple tokens quantile Solana — historical (beyond 30 days)

ATH of multiple tokens quantile Solana. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [ATH of multiple tokens quantile Solana — historical (beyond 30 days)](https://ide.bitquery.io/ATH-of-multiple-tokens-quantile-Solana)

#### ATH with price delta Solana — historical (beyond 30 days)

Fetches a Solana token’s ATH price, ATH date, and price change percentages over the past 24h, 7d, and 30d using Bitquery Solana APIs. Try the. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [ATH with price delta Solana — historical (beyond 30 days)](https://ide.bitquery.io/ATH-with-price-delta-Solana)

#### AldrinAmm OHLC for specific pair — historical (beyond 30 days)

If you want to get OHLC data for any specific currency pair on AldrinAmm, you can use this api. Only use. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [AldrinAmm OHLC for specific pair — historical (beyond 30 days)](https://ide.bitquery.io/AldrinAmm-OHLC-for-specific-pair)

#### Get Latest Price of Apple xStock in USD Real-time — historical (beyond 30 days)

You can use the following query to get the latest price of a Apple xStock on Solana. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Latest Price of Apple xStock in USD Real-time — historical (beyond 30 days)](https://ide.bitquery.io/Get-Latest-Price-of-Apple-xStock-in--USD-Real-time)

### Supply & Market Cap

#### Sandisk - Backpack Securities MCAP

See the Pairs cube for full field reference. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Sandisk - Backpack Securities MCAP](https://ide.bitquery.io/Sandisk---Backpack-Securities-MCAP)

#### Top Tokens by Market Cap on solana

Ranks tokens on Solana by `Supply.MarketCap`, with 24h window, 1s interval, $1,000+ USD volume, `limitBy` per `Token_Id`, up to 50 rows. `Token.Network` is Solana. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Top Tokens by Market Cap on solana](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-solana)

#### Bags.fm token creation using Solana token supply updates

Bags.fm token creation using Solana token supply updates. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Bags.fm token creation using Solana token supply updates](https://ide.bitquery.io/Bagsfm-token-creation-using-Solana-token-supply-updates)

#### Market cap of token

You can fetch Marketcap of a token using below query.

▶️ [Market cap of token](https://ide.bitquery.io/market-cap-of-token_1)

#### Token burn example solana

You can also track real-time token burn using the TokenSupplyUpdates API. Check out the.

▶️ [Token burn example solana](https://ide.bitquery.io/token-burn-example-solana)

#### Token supply

Will return the latest token supply of a specific token. We are getting here supply for this `6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui` token `PostBalance` will give you the current supply for this token.

▶️ [Token supply](https://ide.bitquery.io/token-supply_2)

#### Tokens with market cap range

Lets say we need to get the tokens whose marketcap has crossed the `1M USD` mark but is less than `2M USD` for various reasons like automated trading. We can get the token details that have crossed a particular marketcap using.

▶️ [Tokens with market cap range](https://ide.bitquery.io/tokens-with-market-cap-range)

#### Top 10 marketcap jump tokens in last 1hr

Use below query to get top 10 marketcap jump tokens in last 1hr.

▶️ [Top 10 marketcap jump tokens in last 1hr](https://ide.bitquery.io/top-10-marketcap-jump-tokens-in-last-1hr)

#### Top Solana tokens based on market cap

Top Solana tokens based on market cap. Uses the `TokenSupplyUpdates` cube.

▶️ [Top Solana tokens based on market cap](https://ide.bitquery.io/top-Solana-tokens-based-on-market-cap)

#### Marketcap of tokens — historical (beyond 30 days)

Returns the ATH (All-Time High) market cap, starting market cap, and related price metrics for multiple tokens. It calculates market cap using a 1 billion token supply and uses quantile to find the ATH price. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Marketcap of tokens — historical (beyond 30 days)](https://ide.bitquery.io/Marketcap-of-tokens)

### Liquidity & Pools

#### All Token Pairs Across DEXs with Current Liquidity

This query retrieves all instances of a specific token pair across decentralized exchanges (DEXs) on Solana, along with their current liquidity.

▶️ [All Token Pairs Across DEXs with Current Liquidity](https://ide.bitquery.io/All-Liquidity-pairs-of-a-token-and-current-liquidity-on-solana)

#### Latest Pools Created on Launchpad

This query returns the latest created pools on Raydium launchpad. You can set the limit here also.

▶️ [Latest Pools Created on Launchpad](https://ide.bitquery.io/Launchpad-latest-pool-created)

#### Liquidity of All Pools of a Token on Solana

Get latest liquidity snapshots for all pools where a token is either base or quote currency.

▶️ [Liquidity of All Pools of a Token on Solana](https://ide.bitquery.io/liqidity-of-all-pools-of-a-token)

#### Solana Pool Liquidity Changes

This query retrieves the latest changes to liquidity pools on Solana, including the change amount and the price at which the change happened. This query also uses only the real-time data set.

▶️ [Solana Pool Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools)

#### All liquidity add instructions track on Solana

Tracks liquidity addition events on Solana DEX pools by monitoring specific instructions.

▶️ [All liquidity add instructions track on Solana](https://ide.bitquery.io/All-liquidity-add-instructions-track-on-Solana)

#### CPMM pools created

The mint addresses for the tokens being used in the pool are listed for example `tokenMint1` and `tokenMint0` , indicating which tokens the CPMM will support.

▶️ [CPMM pools created](https://ide.bitquery.io/CPMM-pools-created_1)

#### Get LP Latest liqudity on Solana

Get LP Latest liqudity on Solana. Uses the `DEXPools` cube. Replace the address in the `where` clause to use it.

▶️ [Get LP Latest liqudity on Solana](https://ide.bitquery.io/Get-LP-Latest-liqudity-on-Solana)

#### Get all the liquidity pools info for a particular token

Will give the information on all the liquidity pools of a particular token `EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm`.

▶️ [Get all the liquidity pools info for a particular token](https://ide.bitquery.io/get-all-the-liquidity-pools-info-for-a-particular-token_1)

#### Liquidity change in recent month

Liquidity change in recent month. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Liquidity change in recent month](https://ide.bitquery.io/liquidity-change-in-recent-month)

#### Liquidity lock using instructions balance update

Using the below query, you can retrieve latest liquidity locks made using streamflow.

▶️ [Liquidity lock using instructions balance update](https://ide.bitquery.io/Liquidity-lock-using-instructions-balance-update)

### Events & Calls

#### Not Anchor Error Solana Logs

To exclude instructions containing specific log phrases such as 'AnchorError' you can use the `notLike` filter.

▶️ [Not Anchor Error Solana Logs](https://ide.bitquery.io/Not-Anchor-Error-Solana-Logs)

#### Solana Zeta Market logs

If you need to filter out the instructions from Solana logs that involve a particular exchange but you don’t have any information, like address and protocol, then you can use the “includes” keyword on Logs.

▶️ [Solana Zeta Market logs](https://ide.bitquery.io/Solana-Zeta-Market-logs)

### Pump.fun

#### First buyers of a token (sniper detection)

The earliest buyers of a token, in time order - snipers are the first rows, buying within seconds of launch at the lowest price. Replace `token` in the Variables pane.

▶️ [First buyers of a token (sniper detection)](https://ide.bitquery.io/Solana---First-buyers-of-a-Pumpfun-token-sniper-detection)

#### Top 10 pump fun tokens by Marketcap change in last 5mins

This query returns the top 10 pump fun tokens by Marketcap change in last 5mins. You can increase the limit to get more tokens.

▶️ [Top 10 pump fun tokens by Marketcap change in last 5mins](https://ide.bitquery.io/Top-10-pump-fun-tokens-by-Marketcap-change-in-last-5mins_1)

#### Top PumpFun Tokens by Marketcap

Top Pump.fun and PumpSwap tokens on Solana over the last hour, ranked by USD volume. Ranked by volume rather than market cap on purpose: Solana market caps in the cube saturate against whatever ceiling you filter on, so sorting by them surfaces tokens with broken supply figures. `Supply.MarketCap` is still returned for reference. The previous version sorted `Solana.DEXTrades` by raw buy price over a window 18 months outside that cube's ~12 hour retention and returned USDC as the top Pump.fun token.

▶️ [Top PumpFun Tokens by Marketcap](https://ide.bitquery.io/top-tokens-by-mktcap-on-pump-fun-in-last-15-min)

#### Get Bonding Curve Progress of a Token on Pump Fun

Returns Bonding Curve Percentage of a Token on the Pump Fun.

▶️ [Get Bonding Curve Progress of a Token on Pump Fun](https://ide.bitquery.io/get-the-bonding-curve-progress-percentage_1)

#### ATH Market Cap of Pump Fun Tokens in a Specific Timeframe

Use Bitquery's `DEXTradeByTokens` with `dataset: combined`, `Trade.PriceInUSD(maximum: Trade_PriceInUSD)`, and `quantile(of: Trade_PriceInUSD, level: 0.98)` to get ATH price. Market cap = ATH price × 1 billion (Pump.fun tokens have 1B supply).

▶️ [ATH Market Cap of Pump Fun Tokens in a Specific Timeframe](https://ide.bitquery.io/ATH-Market-Cap-of-Pump-Fun-Tokens-in-a-Specific-Timeframe)

#### All tokens traded on Pump.fun in the last 1 hour

To get all tokens traded on Pump.fun in the last 1 hour, use a query that filters trades by the Pump.fun protocol and a block time within the past hour.

▶️ [All tokens traded on Pump.fun in the last 1 hour](https://ide.bitquery.io/all-tokens-traded-on-Pumpfun-in-the-last-1-hour_1)

#### How do I get tokens that reached a specific market cap on Pump.fun?

To find tokens on Pump.fun that have reached a specific market capitalization threshold, you can use the following Bitquery GraphQL example.

▶️ [How do I get tokens that reached a specific market cap on Pump.fun?](https://ide.bitquery.io/How-do-I-get-tokens-that-reached-a-specific-market-cap-on-Pumpfun)

#### Latest creator fee transfers on pumpfun amm

Latest creator fee transfers on pumpfun amm. Uses the `InstructionBalanceUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Latest creator fee transfers on pumpfun amm](https://ide.bitquery.io/latest-creator-fee-transfers-on-pumpfun-amm)

#### Pumpfun transfers type v1 to pumpfun migrations

Retrieve Pump.fun token migrations on a specific date. The API returns transfers to the PumpSwap migration receiver address for the given date.

▶️ [Pumpfun transfers type v1 to pumpfun migrations](https://ide.bitquery.io/pumpfun-transfers-type-v1-to-pumpfun-migrations_1)

#### Pumpswap latest Trades API

Latest PumpSwap trades from the Trading cube, with USD price and trade size on every row. The Trading cube reaches back about 30 days on Solana; `Solana.DEXTrades` keeps only about 12 hours.

▶️ [Pumpswap latest Trades API](https://ide.bitquery.io/Pumpswap-latest-Trades-API)

#### Top 10 pump fun tokens by Price change in last 5min

Use the below query to get top 10 Pump.fun tokens by price change in the last 5 minutes.

▶️ [Top 10 pump fun tokens by Price change in last 5min](https://ide.bitquery.io/Top-10-pump-fun-tokens-by-Price-change-in-last-5min_1)

#### Top 100 graduating pump fun tokens in last 5 minutes

We can use below query to get top 100 About to Graduate Pump Fun Tokens. You can run and test the saved query.

▶️ [Top 100 graduating pump fun tokens in last 5 minutes](https://ide.bitquery.io/Top-100-graduating-pump-fun-tokens-in-last-5-minutes_2)

#### Top traders on pumpswap

Aggregate `DEXTradeByTokens` by `Transaction.Signer` with `limitBy` and `orderBy` on trade count or volume (USD). Filter `Dex.ProgramAddress` to PumpSwap and optionally WSOL as the side currency to rank active wallets on the AMM.

▶️ [Top traders on pumpswap](https://ide.bitquery.io/top-traders-on-pumpswap_2)

#### All Pump fun tokens created by an address

All Pump fun tokens created by an address. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [All Pump fun tokens created by an address](https://ide.bitquery.io/all-Pump-fun-tokens-created-by-an-address_3)

#### First transfers of a pump fun token

Retrieves the first transfer of a token to each address, providing the timestamp when each address first received the token.

▶️ [First transfers of a pump fun token](https://ide.bitquery.io/first-transfers-of-a-pump-fun-token_1)

### Meteora

#### Get the Top Traders of a specific Token on Meteora DAMM v2 DEX

The below query gets the Top Traders of the specified Token on Meteora DAMM v2. This provides insights into the most active traders and their trading patterns.

▶️ [Get the Top Traders of a specific Token on Meteora DAMM v2 DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DAMM-v2-DEX_1)

#### Get the Top Traders of a specific Token on Meteora DLMM DEX

The below query gets the Top Traders of the specified Token on Meteora DLMM. This provides insights into the most active traders and their trading patterns.

▶️ [Get the Top Traders of a specific Token on Meteora DLMM DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DLMM-DEX)

#### Get the Top Traders of a specific Token on Meteora DYN DEX

The below query gets the Top Traders of the specified Token `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` on Meteora DYN.

▶️ [Get the Top Traders of a specific Token on Meteora DYN DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DYN-DEX)

#### Meteora DAMM v2 OHLC API

If you want to get OHLC (Open, High, Low, Close) data for any specific currency pair on Meteora DAMM v2, you can use this API. This provides technical analysis data for charting and trading strategies.

▶️ [Meteora DAMM v2 OHLC API](https://ide.bitquery.io/Meteora-DAMM-v2-OHLC-API)

#### Meteora DLMM OHLC API

If you want to get OHLC (Open, High, Low, Close) data for any specific currency pair on Meteora DLMM, you can use this API. This provides technical analysis data for charting and trading strategies.

▶️ [Meteora DLMM OHLC API](https://ide.bitquery.io/Meteora-DLMM-OHLC-API)

#### Meteora DYN OHLC API

If you want to get OHLC data for any specific currency pair on Meteora DYN, you can use this api. Only use.

▶️ [Meteora DYN OHLC API](https://ide.bitquery.io/Meteora-DYN-OHLC-API)

#### Volatility of WSOL USDC Pair on AldrinAmm Dex on Solana

Standard deviation of the WSOL/USDC price on AldrinAmm over the last six days. Uses `DEXTradeByTokens`, which keeps about 7 days, rather than `Solana.DEXTrades`, which keeps about 12 hours and has no archive. `trades` is returned alongside the volatility so an empty window reads as 0 trades instead of passing for zero volatility.

▶️ [Volatility of WSOL USDC Pair on AldrinAmm Dex on Solana](https://ide.bitquery.io/Volatility-of-WSOL-USDC-Pair-on-AldrinAmm-Dex-on-Solana_1)

#### Volatility of WSOL USDC Pair on Lifinity Dex on Solana

Standard deviation of the WSOL/USDC price on Lifinity over the last six days. This pair is currently inactive on Lifinity, so the query returns 0 trades - change the `ProtocolFamily` to a busier venue such as Raydium or Meteora to see a live figure. Uses `DEXTradeByTokens`, which keeps about 7 days, rather than `Solana.DEXTrades`, which keeps about 12 hours and has no archive. `trades` is returned alongside the volatility so an empty window reads as 0 trades instead of passing for zero volatility.

▶️ [Volatility of WSOL USDC Pair on Lifinity Dex on Solana](https://ide.bitquery.io/Volatility-of-WSOL-USDC-Pair-on-Lifinity-Dex-on-Solana)

#### Volatility of a Pair on Meteora Dynamic

Standard deviation of the WSOL/USDC price on Meteora over the last six days. The previous version asked `Solana.DEXTrades` for a two-hour window more than a year old and reported a volatility of 0, which meant no data rather than no movement. Uses `DEXTradeByTokens`, which keeps about 7 days, rather than `Solana.DEXTrades`, which keeps about 12 hours and has no archive. `trades` is returned alongside the volatility so an empty window reads as 0 trades instead of passing for zero volatility.

▶️ [Volatility of a Pair on Meteora Dynamic](https://ide.bitquery.io/Volatility-of-a-Pair-on-Meteora-Dynamic)

#### Get the Top Traders of a specific Token on Meteora DBC

The below query gets the Top Traders of the specified Token `4kJkgxzuk1gcjsgRSVhdeSiC15ibQLRDKTuqtf2i16Dm` on Meteora DBC.

▶️ [Get the Top Traders of a specific Token on Meteora DBC](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DBC)

### Raydium

#### Top 100 About to Graduate Raydium Launchpad Tokens

Returns top 100 About to Graduate Raydium Launchpadn Tokens.

▶️ [Top 100 About to Graduate Raydium Launchpad Tokens](https://ide.bitquery.io/Top-100-graduating-raydium-launchlab-tokens-in-last-5-minutes)

#### Historical PumpFun Migrated Token on Raydium and Pumpswap.

Historical PumpFun Migrated Token on Raydium and Pumpswap. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Historical PumpFun Migrated Token on Raydium and Pumpswap.](https://ide.bitquery.io/all-pumpfun-migrated-token-query_4)

#### Get Bonding Curve Progress of a Raydium Launchpad Token

Returns Bonding Curve Percentage of a Raydium Launchpad Token.

▶️ [Get Bonding Curve Progress of a Raydium Launchpad Token](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-letsbonkfun-token)

#### Latest Price of a Token on Raydium Launchpad

This query returns the latest price of a token on the Raydium launchpad.

▶️ [Latest Price of a Token on Raydium Launchpad](https://ide.bitquery.io/Latest-Price-of-a-Token-on-Launchpad)

#### Latest Trades for a specific currency on Raydium

This query returns the latest trades for a token on Raydium. You can set the limit here also.

▶️ [Latest Trades for a specific currency on Raydium](https://ide.bitquery.io/Trades-for-a-token-on-Raydium-on-Solana)

#### DecreaseLiquidityV2 latest raydium clmm

DecreaseLiquidityV2 latest raydium clmm. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [DecreaseLiquidityV2 latest raydium clmm](https://ide.bitquery.io/decreaseLiquidityV2-latest-raydium-clmm_1)

#### IncreaseLiquidityV2 latest raydium clmm

IncreaseLiquidityV2 latest raydium clmm. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [IncreaseLiquidityV2 latest raydium clmm](https://ide.bitquery.io/increaseLiquidityV2-latest-raydium-clmm)

#### Live price of token on raydium - updated

You can use the following query to get the latest price of a token on Raydium DEX on Solana.

▶️ [Live price of token on raydium - updated](https://ide.bitquery.io/live-price-of-token-on-raydium---updated)

#### Raydium CLMM Pool Creation

The mint addresses for the tokens being used in the pool are listed for example `tokenMint1` could be any newly deployed token and `tokenMint0` can be WSOL , indicating which tokens the CLMM pool will support.

▶️ [Raydium CLMM Pool Creation](https://ide.bitquery.io/Raydium-CLMM-Pool-Creation)

#### Raydium OHLC for specific pair

If you want to get OHLC data for any specific currency pair on Raydium DEX, you can use.

▶️ [Raydium OHLC for specific pair](https://ide.bitquery.io/Raydium-OHLC-for-specific-pair_5)

#### Top Bought Solana Tokens

Will give most bought Solana Tokens on Raydium.

▶️ [Top Bought Solana Tokens](https://ide.bitquery.io/Top-Bought-Solana-Tokens)

#### Top sold Solana Tokens

Will give most sold Solana Tokens on Raydium.

▶️ [Top sold Solana Tokens](https://ide.bitquery.io/Top-sold-Solana-Tokens)

### LetsBonk.fun

#### Latest Price of a LetsBonk.fun Token on Launchpad

Provides the most recent price data for a specific LetsBonk.fun token `token Mint Address` launched on Raydium Launchpad. You can filter by the token’s `MintAddress`, and the query will return the last recorded trade price.

▶️ [Latest Price of a LetsBonk.fun Token on Launchpad](https://ide.bitquery.io/Latest-Price-of-a-LetsBonkfun-Token-on-Launchpad)

#### Latest Trades of a letsbonk.fun token on Launchpad

Fetches the most recent trades of a LetsBonk.fun Token `token Mint Address` on the Raydium Launchpad. Run the query.

▶️ [Latest Trades of a letsbonk.fun token on Launchpad](https://ide.bitquery.io/Latest-Trades-of-a-letsbonkfun-token-on-Launchpad)

#### Liquidity for a Letsbonk.fun token pair

Liquidity for a Letsbonk.fun token pair. Uses the `DEXPools` cube. Replace the address in the `where` clause to use it.

▶️ [Liquidity for a Letsbonk.fun token pair](https://ide.bitquery.io/liquidity-for-a-Letsbonkfun-token-pair_2)

#### Ohlc for letsbonk.fun token

Ohlc for letsbonk.fun token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Ohlc for letsbonk.fun token](https://ide.bitquery.io/ohlc-for-letsbonkfun-token)

#### Pool address for letsbonk.fun token

Pool address for letsbonk.fun token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Pool address for letsbonk.fun token](https://ide.bitquery.io/pool-address-for-letsbonkfun-token_1)

#### Top buyers of a letsbonk.fun token on launchpad

Top buyers of a letsbonk.fun token on launchpad. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a letsbonk.fun token on launchpad](https://ide.bitquery.io/top-buyers-of-a-letsbonkfun-token-on-launchpad)

#### Top sellers of a letsbonk.fun token on launchpad

Top sellers of a letsbonk.fun token on launchpad. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top sellers of a letsbonk.fun token on launchpad](https://ide.bitquery.io/top-sellers-of-a-letsbonkfun-token-on-launchpad_1)

## Robinhood Chain

### Trades

#### Largest Trades on Robinhood Chain (24h, USD)

Largest Trades on Robinhood Chain (24h, USD). Uses the `Trades` cube.

▶️ [Largest Trades on Robinhood Chain (24h, USD)](https://ide.bitquery.io/largest-swaps-robinhood-chain)

#### Pools trade Latest trades for a token

Tokens also migrate onto other venues once liquid — the same token can show `uniswap_v3` and `pancake_swap_v3` markets with `WETH` and `USDG` quotes.

▶️ [Pools trade Latest trades for a token](https://ide.bitquery.io/Pools-trade-Latest-trades-for-a-token)

#### Pools trade Top tokens by volume

The two-step pattern: pass a token set harvested from `TokenCreated` into the `Trading` cube.

▶️ [Pools trade Top tokens by volume](https://ide.bitquery.io/Pools-trade-Top-tokens-by-volume)

#### Pools trade Crowd Launch bids

The launch transaction also contains the token's mint, the entry contract's `TokenCreated`, and the auction's first `TickInitialized` / `ClearingPriceUpdated` events, so one transaction hash links token, creator, and auction contract.

▶️ [Pools trade Crowd Launch bids](https://ide.bitquery.io/Pools-trade-Crowd-Launch-bids)

#### Pools trade Latest launches

The decoded `TokenCreated` event on the two entry contracts is the cleanest launch feed — one row per launch.

▶️ [Pools trade Latest launches](https://ide.bitquery.io/Pools-trade-Latest-launches)

#### Pools trade Launches per day

Grouping by `LogHeader.Address` too shows the split between the two entry contracts.

▶️ [Pools trade Launches per day](https://ide.bitquery.io/Pools-trade-Launches-per-day)

#### Pools trade Most active token creators

Useful for spotting spam-bot deployers — a single wallet can mint hundreds of tokens a day.

▶️ [Pools trade Most active token creators](https://ide.bitquery.io/Pools-trade-Most-active-token-creators)

#### Pools trade PoolKey from TokenLaunched

Pools trade PoolKey from TokenLaunched. Uses the `Events` cube.

▶️ [Pools trade PoolKey from TokenLaunched](https://ide.bitquery.io/Pools-trade-PoolKey-from-TokenLaunched)

#### Pools trade Token description and image

The filter below pins the factory by address because the entry contract emits a *different* `TokenCreated` under the same name (see Reading decoded arguments).

▶️ [Pools trade Token description and image](https://ide.bitquery.io/Pools-trade-Token-description-and-image)

#### Pools trade TokenDistributed decoded event

Topic0 filtering remains available and is the precise way to pin one exact signature — useful for the overloaded `TokenCreated` above. Supply the hash without a `0x` prefix; see the dataset note below for its one limitation.

▶️ [Pools trade TokenDistributed decoded event](https://ide.bitquery.io/Pools-trade-raw-event-by-topic0)

### Transfers

#### Ape.store Newly created tokens

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Ape.store Newly created tokens](https://ide.bitquery.io/Apestore-Newly-created-tokens)

#### Bags.fm Newly created tokens

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Bags.fm Newly created tokens](https://ide.bitquery.io/Bagsfm-Newly-created-tokens)

#### Bankr Bot Newly created tokens

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Bankr Bot Newly created tokens](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens)

#### Flap.sh Newly created tokens using transfer data

Track Flap.sh mints as transfers from the zero address with amount `1000000000` in transactions sent to the Flap.sh contract.

▶️ [Flap.sh Newly created tokens using transfer data](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-transfer-data)

#### Klik Finance Newly created tokens using transfers

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Klik Finance Newly created tokens using transfers](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers)

#### Robinhood Chain API - Latest Token Transfers

Robinhood Chain API - Latest Token Transfers. Uses the `Transfers` cube.

▶️ [Robinhood Chain API - Latest Token Transfers](https://ide.bitquery.io/latest-transfers-on-robinhood)

#### Robinhood Chain Token Lookup by Contract Address

Metadata splits across two sources. Name, symbol, decimals, and contract are indexed on every transfer's `Currency` object — one query against the launch mint gives you all four for any token.

▶️ [Robinhood Chain Token Lookup by Contract Address](https://ide.bitquery.io/Pools-trade-Token-name-symbol-decimals)

#### Token Lookup by Contract Address - Robinhood Chain

Follow the steps here: How to generate Bitquery API token ➤.

▶️ [Token Lookup by Contract Address - Robinhood Chain](https://ide.bitquery.io/token-lookup-by-address-robinhood-chain)

#### Transfers for a token on robinhood

Filter with `Transfer.Currency.SmartContract`. Example: WETH on Robinhood.

▶️ [Transfers for a token on robinhood](https://ide.bitquery.io/Transfers-for-a-token-on-robinhood)

#### Transfers for a wallet on Robinhood

Filter where the address is either `Transfer.Sender` or `Transfer.Receiver` to build a full transfer history. Replace the sample address with your wallet or contract.

▶️ [Transfers for a wallet on Robinhood](https://ide.bitquery.io/transfers-for-a-wallet-on-Robinhood)

### Balances & Holders

#### Pools trade Per-transaction balance changes

A stream of this filtered to `SlippageBasisPoints: {gt: 100}` is a ready-made "toxic fill" alert for a token's pool.

▶️ [Pools trade Per-transaction balance changes](https://ide.bitquery.io/Pools-trade-Per-transaction-balance-changes)

#### Wallet Token Balances on Robinhood Chain

Wallet Token Balances on Robinhood Chain. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Wallet Token Balances on Robinhood Chain](https://ide.bitquery.io/wallet-token-balances-robinhood-chain)

### Price & OHLC

#### Latest price of a token on a pool

This API endpoint retrieves the latest price of a token for a particular token pair or liquidity pool using the `Trading.Pairs` cube.

▶️ [Latest price of a token on a pool](https://ide.bitquery.io/latest-price-of-a-token-on-a-pool)

#### Latest price of a token

If you want to monitor price for a particular pool, we suggest usage of `Trading.Pairs` instead of `Trading.Tokens` where you could specify the pool address.

▶️ [Latest price of a token](https://ide.bitquery.io/latest-price-of-a-token_10)

#### Pools trade OHLCV price candles

Deduplicate on `(TransactionHeader.Hash, Block.Time, Side, Amounts.Base, Pair.QuoteToken.Symbol, Trader.Address)` before aggregating.

▶️ [Pools trade OHLCV price candles](https://ide.bitquery.io/Pools-trade-OHLCV-price-candles)

### Supply & Market Cap

#### Pools trade Token holders and supply

Pools trade Token holders and supply. Uses the `Holders` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Pools trade Token holders and supply](https://ide.bitquery.io/Pools-trade-Token-holders-and-supply)

### Liquidity & Pools

#### Pools trade Per-swap slippage

Pools trade Per-swap slippage.

▶️ [Pools trade Per-swap slippage](https://ide.bitquery.io/Pools-trade-Per-swap-slippage)

#### Pools trade Pool creation Initialize

The v4 PoolManager's `Initialize` is decoded, so you can read the same `PoolKey` without manual decoding — at the cost of having to scope it to a token.

▶️ [Pools trade Pool creation Initialize](https://ide.bitquery.io/Pools-trade-Pool-creation-Initialize)

### Transactions

#### Daily Active Wallets on Robinhood Chain

Daily Active Wallets on Robinhood Chain. Uses the `Transactions` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Daily Active Wallets on Robinhood Chain](https://ide.bitquery.io/robinhood-chain-active-wallets)

#### Robinhood Chain Daily Transaction Count

Robinhood Chain Daily Transaction Count. Uses the `Transactions` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Robinhood Chain Daily Transaction Count](https://ide.bitquery.io/robinhood-chain-daily-transactions)

#### Robinhood Chain Gas Usage and Gas Price

Robinhood Chain Gas Usage and Gas Price. Uses the `Transactions` cube.

▶️ [Robinhood Chain Gas Usage and Gas Price](https://ide.bitquery.io/robinhood-chain-gas-fees)

### Events & Calls

#### All events from Flap.sh

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [All events from Flap.sh](https://ide.bitquery.io/All-events-from-Flapsh)

#### Flap.sh Newly created tokens using logs TokenCreated

Filter Flap.sh `TokenCreated` events and decode argument values (token address, metadata fields, and related parameters).

▶️ [Flap.sh Newly created tokens using logs TokenCreated](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-logs-TokenCreated)

#### New Contracts Deployed on Robinhood Chain

To pin one exact ABI variant — or to match an undecoded method — filter the 4-byte selector instead (uppercase hex, no `0x`)

▶️ [New Contracts Deployed on Robinhood Chain](https://ide.bitquery.io/new-contracts-deployed-robinhood-chain)

### Blocks & Validators

#### Robinhood Chain Blocks per Day and Block Time

Robinhood Chain Blocks per Day and Block Time. Uses the `Blocks` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Robinhood Chain Blocks per Day and Block Time](https://ide.bitquery.io/robinhood-chain-block-time)

### Uniswap

#### Uniswap v4 Pools on Robinhood Chain

New Uniswap v4 pools: decoded Initialize events on the PoolManager with currencies, fee tier, tick spacing and hooks.

▶️ [Uniswap v4 Pools on Robinhood Chain](https://ide.bitquery.io/uniswap-v4-pools-on-robinhood-chain)

#### Uniswap v4 Hooks in Use on Robinhood Chain

Uniswap v4 Hooks in Use on Robinhood Chain. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Uniswap v4 Hooks in Use on Robinhood Chain](https://ide.bitquery.io/uniswap-v4-hooks-robinhood-chain)

#### Uniswap v4 Pool Liquidity on Robinhood Chain (pools.trade)

Three realtime cubes carry data traders usually have to compute themselves. All three are realtime-only on Robinhood — `dataset: archive` and `dataset: combined` both error — so use them for live monitoring and persist what you need.

▶️ [Uniswap v4 Pool Liquidity on Robinhood Chain (pools.trade)](https://ide.bitquery.io/Pools-trade-Live-pool-liquidity)

## Polymarket

### Trades

#### Latest Trades

Fetch the most recent prediction market trades with full details, ordered by block time.

▶️ [Latest Trades](https://ide.bitquery.io/latest-prediction-market-trades_8)

#### Total Volume and Yes/No Volume for a Market

Aggregate USD volume for a market over a time window: total volume plus volume per outcome (e.g. Yes/No). Pass the market's outcome token AssetIds in `$marketAssets`.

▶️ [Total Volume and Yes/No Volume for a Market](https://ide.bitquery.io/total-volume-outcome-1-volume-outcome-2-volume-of-a-market_1)

#### Trades for a Specific Trader

Fetch all trades where the given address is either Buyer or Seller. Pass the trader address as the `$trader` variable.

▶️ [Trades for a Specific Trader](https://ide.bitquery.io/Trades-for-a-specific-trader_1)

#### How do I count trades for a specific Polymarket trader?

Use `PredictionTrades` with `any` filter on `Buyer` or `Seller` to return the total trade count for a wallet. Add `ProtocolName: "polymarket"` to restrict to Polymarket only. Replace the address with your target wallet.

▶️ [How do I count trades for a specific Polymarket trader?](https://ide.bitquery.io/How-do-I-count-trades-for-a-specific-Polymarket-trader)

#### How do I get top buyers and sellers on Polymarket by volume?

Use `PredictionTrades` with `limitBy` and `sum(of: Trade_OutcomeTrade_CollateralAmountInUSD)` grouped by Buyer (or Seller) to rank the top 100 wallets by volume over the last 5 days. Useful for leaderboards, whale tracking, and trader analytics.

▶️ [How do I get top buyers and sellers on Polymarket by volume?](https://ide.bitquery.io/How-do-I-get-top-buyers-and-sellers-on-Polymarket-by-volume)

#### Latest prediction market trades

Fetch the most recent prediction market trades with full details, ordered by block time.

▶️ [Latest prediction market trades](https://ide.bitquery.io/latest-prediction-market-trades)

#### Prediction_trades

Prediction_trades.

▶️ [Prediction_trades](https://ide.bitquery.io/prediction_trades)

#### Top 100 markets by volumein last24 hrs

Rank Polymarket markets by buy + sell collateral USD, with buy/sell breakdown, trade count, distinct buyers/sellers, and optional resolution join. Uses `limitBy: Trade_Prediction_Question_Id` so each row is one market.

▶️ [Top 100 markets by volumein last24 hrs](https://ide.bitquery.io/top-100-markets-by-volumein-last24-hrs_1)

#### Top AI markets by volume Polymarket

Returns AI markets (title includes the standalone word " AI ") ranked by USD trading volume in the last 24 hours, with buyer and seller counts. Adjust `time_ago`, `limit`, and the title keyword as needed.

▶️ [Top AI markets by volume Polymarket](https://ide.bitquery.io/Top-AI-markets-by-volume-Polymarket)

#### Top Buyers/Sellers of Bitcoin up down market

Returns the top 10 buyers and top 10 sellers by traded volume in Bitcoin Up or Down markets on Polymarket over the last 24 hours. Results are aggregated by trader address and ordered by `buy_amount` (buyers) or `sell_amount` (sellers).

▶️ [Top Buyers/Sellers of Bitcoin up down market](https://ide.bitquery.io/Top-BuyersSellers-of-Bitcoin-up-down-market)

### Markets

#### Created vs Resolved Count (Last 24 Hours)

Count how many Created and Resolved events occurred in the last 24 hours.

▶️ [Created vs Resolved Count (Last 24 Hours)](https://ide.bitquery.io/last-24-hr-resolution-and-ceated-count_1)

#### Latest Creations + Resolutions

Fetch the most recent creation and resolution events with full details, ordered by block time.

▶️ [Latest Creations + Resolutions](https://ide.bitquery.io/latest-Prediction-managements-resolutions-creations_1)

#### Latest Market Creations

Fetch the most recent Created events (new markets). All possible outcomes per market are in Prediction.Condition.Outcomes.

▶️ [Latest Market Creations](https://ide.bitquery.io/latest-polymarket-creations_1)

#### Latest Market Resolutions

Query that returns the 10 most recent Resolved events. Winning outcome is in Prediction.Outcome; Prediction.OutcomeToken holds the asset ID and contract details.

▶️ [Latest Market Resolutions](https://ide.bitquery.io/latest-polymarket-resolutions_2)

#### Latest Prediction managements (resolutions, creations)

Fetch the most recent creation and resolution events with full details, ordered by block time.

▶️ [Latest Prediction managements (resolutions, creations)](https://ide.bitquery.io/latest-Prediction-managements-resolutions-creations)

#### Latest polymarket creations

Fetch the most recent Created events. For each market, all possible outcomes are listed under Prediction.Condition.Outcomes.

▶️ [Latest polymarket creations](https://ide.bitquery.io/latest-polymarket-creations)

#### Latest polymarket resolutions

Latest polymarket resolutions.

▶️ [Latest polymarket resolutions](https://ide.bitquery.io/latest-polymarket-resolutions_1)

#### Latest resolved crudeoil markets

Returns the 10 most recent Resolved events for Polymarket Crude Oil markets.

▶️ [Latest resolved crudeoil markets](https://ide.bitquery.io/latest-resolved-crudeoil-markets)

#### Latest resolved sports markets

Returns the 10 most recent Resolved sports markets (management description includes `"sports"`), including the resolved/winning Outcome and full question metadata. Use this to grade results and settle bets.

▶️ [Latest resolved sports markets](https://ide.bitquery.io/Latest-resolved-sports-markets)

#### Query latest created resolved prediction markets for Bitcoin

Query latest created resolved prediction markets for Bitcoin.

▶️ [Query latest created resolved prediction markets for Bitcoin](https://ide.bitquery.io/Query-latest-created-resolved-prediction-markets-for-Bitcoin)

### Settlements

#### Latest Settlements

Fetch the most recent settlements with full details, ordered by block time.

▶️ [Latest Settlements](https://ide.bitquery.io/latest-prediction-market-settlements_3)

#### Latest Whale Settlements

Find the most recent high-value redemptions (e.g. amount ≥ 10,000 in outcome token units). Useful for tracking large payouts and whale activity.

▶️ [Latest Whale Settlements](https://ide.bitquery.io/latest-whale-settlements-on-prediction-market_3)

#### Redemption / Merge / Split Count (Last 1 Hour)

Count how many settlement events occurred in the last hour, grouped by event signature (Split, Merge, Redemption).

▶️ [Redemption / Merge / Split Count (Last 1 Hour)](https://ide.bitquery.io/redemptions-merge-split-count-in-last-1-hour_1)

#### Top 10 Market Questions by Redeemed Amount (Last 1 Hour)

Aggregate redemptions by market question and sort by total redeemed amount. See which markets had the most payout activity recently.

▶️ [Top 10 Market Questions by Redeemed Amount (Last 1 Hour)](https://ide.bitquery.io/top-10-market-questions-in-last-1-hour_3)

#### Top 10 Redeemers (Last 1 Hour)

Rank addresses by total amount redeemed in the last hour across all markets. Useful for leaderboards and whale tracking.

▶️ [Top 10 Redeemers (Last 1 Hour)](https://ide.bitquery.io/top-10-redeemers_1)

#### Top 10 Winners of a Specific Market Question

Rank holders by total redeemed amount for one market (filter by question title).

▶️ [Top 10 Winners of a Specific Market Question](https://ide.bitquery.io/top-10-winners-of-a-market-question_2)

#### Latest prediction market settlements

Fetch the most recent settlements with full details, ordered by block time.

▶️ [Latest prediction market settlements](https://ide.bitquery.io/latest-prediction-market-settlements_2)

#### Latest whale settlements on prediction market

Find the most recent high-value redemptions (e.g. amount ≥ 10,000 USD). Useful for tracking large payouts and whale activity.

▶️ [Latest whale settlements on prediction market](https://ide.bitquery.io/latest-whale-settlements-on-prediction-market_2)

#### Redemptions, merge, split count in last 1 hour

Count how many settlement events occurred in the last hour, grouped by event signature (Split, Merge, Redemption).

▶️ [Redemptions, merge, split count in last 1 hour](https://ide.bitquery.io/redemptions-merge-split-count-in-last-1-hour)

#### Top 10 redeemers

Rank addresses by total amount redeemed in the last hour across all markets. Useful for leaderboards and whale tracking.

▶️ [Top 10 redeemers](https://ide.bitquery.io/top-10-redeemers)

### Transfers

#### Freshwallet check for polymarket

Look up the buyer's earliest on-chain activity. If the wallet's first transfer is close to the time of its first big bet, it is a fresh wallet and scores high. Replace the address with the buyer from Step 1.

▶️ [Freshwallet check for polymarket](https://ide.bitquery.io/freshwallet-check-for-polymarket)

#### FundingSource for poylmarket

FundingSource for poylmarket. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [FundingSource for poylmarket](https://ide.bitquery.io/FundingSource-for-poylmarket)

#### SiblingWallets for polymarket

Take the funder from Step 3 and list every other wallet it funded. Wallets sharing a funder are likely controlled by the same operator. A large cluster placing correlated bets is a strong signal.

▶️ [SiblingWallets for polymarket](https://ide.bitquery.io/SiblingWallets-for-polymarket)

### Balances & Holders

#### Polymarket TVL

Summarize USDC.e (`0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`) held by Conditional Tokens and neg-risk wrapped collateral contracts. Extend the `Address` list if you track additional custodians.

▶️ [Polymarket TVL](https://ide.bitquery.io/Polymarket-TVL)

### Price & OHLC

#### Current Price per Outcome (Latest Trade)

Get the latest trade price for each outcome in a market. Uses `limitBy` for one row per outcome, with Price and PriceInUSD at the most recent block time.

▶️ [Current Price per Outcome (Latest Trade)](https://ide.bitquery.io/Current-price-inside-the-market-for-all-options-based-on-latest-trade_1)

#### Current price inside the market for all options based on latest trade

Get the latest trade price for each outcome in a market (e.g. Yes/No, Up/Down—each market defines its own outcome labels).

▶️ [Current price inside the market for all options based on latest trade](https://ide.bitquery.io/Current-price-inside-the-market-for-all-options-based-on-latest-trade)

#### Latest price of outcomes of a crude oil market

Returns the latest trade price (and price in USD) per outcome for a single market by `MarketId`. Replace `"1570893"` with the target Crude Oil market ID from Polymarket or from the creation/resolution queries above.

▶️ [Latest price of outcomes of a crude oil market](https://ide.bitquery.io/latest-price-of-outcomes-of-a-crude-oil-market)

#### OHLC of a outcome of a gold market

Returns OHLC (Open, High, Low, Close) in USD for one outcome of a Gold market, bucketed by time (e.g. 1-minute intervals). Replace `MarketId` `"1606192"` and outcome `"Down"` with the desired market and outcome label (e.g. `"Up"` or `"Down"`).

▶️ [OHLC of a outcome of a gold market](https://ide.bitquery.io/OHLC-of-a-outcome-of-a-gold-market)

#### Polymarket AI odds movement OHLC

Returns OHLC (Open, High, Low, Close) in USD for one outcome of an AI market, bucketed by interval (here 5 minutes). It shows how the implied probability moved over time, and powers charts and backtests. Replace `"<MARKET_ID>"` and `"<OUTCOME_LABEL>"`

▶️ [Polymarket AI odds movement OHLC](https://ide.bitquery.io/Polymarket-AI-odds-movement-OHLC)

#### Polymarket sports odds movement OHLC

Returns OHLC (Open, High, Low, Close) in USD for one outcome of a game, bucketed by interval (here 5 minutes). It shows how the win probability moved over time, and powers line-movement charts and strategy backtests.

▶️ [Polymarket sports odds movement OHLC](https://ide.bitquery.io/Polymarket-sports-odds-movement-OHLC)

### Liquidity & Pools

#### Top cricket Markets by Liquidity

Returns the top 100 cricket related polymarkets sorted by liquidity position in the past 24 hours.

▶️ [Top cricket Markets by Liquidity](https://ide.bitquery.io/Top-cricket-Markets-by-Liquidity)

#### Top FIFA World Cup Markets by Liquidity

Returns the top 100 FIFA World Cup related polymarkets sorted by liquidity position in the past 24 hours. Here `position` is the metric used for sorting, hence it could be regarded as the liquidity position of the particular market.

▶️ [Top FIFA World Cup Markets by Liquidity](https://ide.bitquery.io/Top-FIFA-World-Cup-Markets-by-Liquidity)

## Perpetuals

### Hyperliquid

#### Hyperliquid BTC Perp Trades

Hyperliquid BTC Perp Trades. Uses the `Trades` cube.

▶️ [Hyperliquid BTC Perp Trades](https://ide.bitquery.io/hyperliquid-btc-perp-trades)

#### Hyperliquid Latest Trades (Perps + Spot + HIP-3)

Each fill carries the execution (price, size, side, aggressor flag), the position it changed (leverage, margin mode, size before, realized PnL) and fees. `Direction` is one of `Open Long`, `Open Short`, `Close Long`, `Close Short`.

▶️ [Hyperliquid Latest Trades (Perps + Spot + HIP-3)](https://ide.bitquery.io/hyperliquid-latest-trades)

#### Hyperliquid Trader Leverage Updates

Hyperliquid Trader Leverage Updates.

▶️ [Hyperliquid Trader Leverage Updates](https://ide.bitquery.io/hyperliquid-leverage-updates)

#### Hyperliquid BTC OHLCV Candles (1 minute)

The `Candles` cube provides OHLCV per market and interval. `Interval.Time.Duration` is the candle length in seconds (e.g. `60` for one minute), `Start` the interval open time. OHLCV values are floats.

▶️ [Hyperliquid BTC OHLCV Candles (1 minute)](https://ide.bitquery.io/hyperliquid-btc-ohlcv-candles)

#### Hyperliquid Mark Prices (All Markets)

Follow the steps here: How to generate Bitquery API token ➤.

▶️ [Hyperliquid Mark Prices (All Markets)](https://ide.bitquery.io/hyperliquid-mark-prices)

### Phoenix

#### Phoenix Perps Fills by Trader Wallet - Solana

Stream every stop-loss and take-profit placement as it happens.

▶️ [Phoenix Perps Fills by Trader Wallet - Solana](https://ide.bitquery.io/sol_perps_filled_orders_by_signer)

#### Trader Realized PnL on Solana Perps

Rows with `Size: 0` are markets they've fully closed — drop them and the rest is the live book, with entry prices.

▶️ [Trader Realized PnL on Solana Perps](https://ide.bitquery.io/solana-perps-trader-pnl)

#### Whale Trades on Solana Perps (Phoenix)

Positive = received, negative = paid. Replace the field list with `total: sum(of: Position_Funding)` for the net carry cost of holding their positions.

▶️ [Whale Trades on Solana Perps (Phoenix)](https://ide.bitquery.io/solana-perps-whale-trades)

#### Solana Perps OHLC Candles from Mark Price

As a `query`, add `orderBy: { descending: Block_Time }` and a `limit` for the recent whale prints.

▶️ [Solana Perps OHLC Candles from Mark Price](https://ide.bitquery.io/solana-perps-ohlc-candles)

#### Collateral deposits and withdrawals

Deposits and withdrawals of collateral on Phoenix perpetuals, newest first, with trader, signer and fee. Filter by Type for one side only.

▶️ [Collateral deposits and withdrawals](https://ide.bitquery.io/Solana---Phoenix-collateral-deposits-and-withdrawals)

## TRON

### Trades

#### Historical Tron Token Trades within 30 Days

This query returns the historical trades on the TRON network for a token with the time window of past 30 days. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Historical Tron Token Trades within 30 Days](https://ide.bitquery.io/Historical-Tron-trades-for-a-token-within-30-days)

#### Tron DEX Trades

This query returns the latest trades on the TRON network from a trader perspective. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Tron DEX Trades](https://ide.bitquery.io/Tron-Trades)

#### Tron Dex Trade By Tokens

This query returns the latest token trades on the TRON network. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Tron Dex Trade By Tokens](https://ide.bitquery.io/Tron-trades-for-a-token)

#### Sunmpump launchtoDEX

This query allows you to track when tokens are launched on SunSwap using the `launchToDEX` function. It returns the most recent 10 token launches, displaying details such as the token address, transaction hash, block timestamp, and the method call signature.

▶️ [Sunmpump launchtoDEX](https://ide.bitquery.io/sunmpump-launchtoDEX_1)

#### Sunswap v2 latest Trades — historical (beyond 30 days)

Retrieves details about each trade, including the amounts and prices of tokens bought and sold, as well as information about the trading pair. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Sunswap v2 latest Trades — historical (beyond 30 days)](https://ide.bitquery.io/sunswap-v2-latest-Trades)

#### Historical Tron Token Trades beyond 30 Days — historical (beyond 30 days)

This query returns the historical token trades on the TRON network for time window beyond 30 days. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Historical Tron Token Trades beyond 30 Days — historical (beyond 30 days)](https://ide.bitquery.io/Historical-tron-token-trades-beyond-30-days)

#### All dexs info — historical (beyond 30 days)

Fetches all the DEXs information on Tron network such as unique sellers, unique buyers etc. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [All dexs info — historical (beyond 30 days)](https://ide.bitquery.io/all-dexs-info)

#### DEX Markets for a token — historical (beyond 30 days)

Fetches the DEXs where a specific token is being traded on Tron network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [DEX Markets for a token — historical (beyond 30 days)](https://ide.bitquery.io/DEX-Markets-for-a-token_1)

#### First 100 buyers tron token — historical (beyond 30 days)

Find the earliest buyers of any Tron token by using Tron `DEXTradeByTokens` API. This is widely used for memecoin sniper detection, early-holder analysis, and alpha groups monitoring SunPump / SunSwap launches. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [First 100 buyers tron token — historical (beyond 30 days)](https://ide.bitquery.io/first-100-buyers-tron-token)

#### Peg health tron — historical (beyond 30 days)

Browse multi-chain stablecoin DEX prices on DEXrabbit's Stablecoins category. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Peg health tron — historical (beyond 30 days)](https://ide.bitquery.io/peg-health-tron)

### Transfers

#### Historical TRON Transfers for a Wallet

This query returns the historical transfers for a wallet in a given time window on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.

▶️ [Historical TRON Transfers for a Wallet](https://ide.bitquery.io/Historical-Tron-transfers-for-a-wallet)

#### Latest TRON Transfers

This query returns the most recent transfers on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.

▶️ [Latest TRON Transfers](https://ide.bitquery.io/Tron-transfer_10_1)

#### Daily transfer volume tron

Aggregate daily transfer volume in USD for any TRC20 token for analytics dashboards, weekly newsletters, and on-chain reports for stablecoins, governance tokens, and memecoins on Tron.

▶️ [Daily transfer volume tron](https://ide.bitquery.io/daily-transfer-volume-tron)

#### Top transfers of a token

Retrieves the top 10 transfers by amount of the token `TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT`.

▶️ [Top transfers of a token](https://ide.bitquery.io/top-transfers-of-a-token_2)

#### Tron total txn fees paid by the Account

Get the total fees (in SOL and USD) paid by a specific Tron account across all transfers.

▶️ [Tron total txn fees paid by the Account](https://ide.bitquery.io/Tron-total-txn-fees-paid-by-the-Account)

#### Transfers of a wallet API

Fetches the recent 10 transfers of a specific wallet address `TFXttAWURRrXrd9JvFPVLEh1esJK8NHxn7`.

▶️ [Transfers of a wallet API](https://ide.bitquery.io/Transfers-of-a-wallet-API)

#### Tron Transaction fees paid by Account aggregated by currency

Get total fees paid by a Tron account for transferring each type of token.

▶️ [Tron Transaction fees paid by Account aggregated by currency](https://ide.bitquery.io/Tron-Transaction-fees-paid-by-Account-aggregated-by-currency)

#### Tron wallet transfers with transaction fees paid

Track wallet token transfers and get the fees paid for each by the address.

▶️ [Tron wallet transfers with transaction fees paid](https://ide.bitquery.io/tron-wallet-transfers-with-transaction-fees-paid)

### Balances & Holders

#### Historical Balance of a Wallet for a Currency

This query returns the current balance of a wallet for all currencies on the TRON network.

▶️ [Historical Balance of a Wallet for a Currency](https://ide.bitquery.io/Historical-Tron-Wallet-Balance-for-a-currency)

#### Top token holders of a token

Returns the top holders of a token ranked by current balance. Use the Holders API with `orderBy` and `limit`.

▶️ [Top token holders of a token](https://ide.bitquery.io/top-token-holders-of-a-token)

#### Tron Balances for Native currency

Returns the native TRX balance for a wallet (not TRC10 or TRC20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

▶️ [Tron Balances for Native currency](https://ide.bitquery.io/Tron-Balances-for-Native-currency)

#### Tron USDT Balance At Date (Balances Cube)

Unlike summing Transfers, this includes mints, burns, and genesis supply.

▶️ [Tron USDT Balance At Date (Balances Cube)](https://ide.bitquery.io/tron-usdt-balance-at-date)

#### Tron balances by date

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

▶️ [Tron balances by date](https://ide.bitquery.io/tron-balances-by-date)

#### Tron token balance

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name.

▶️ [Tron token balance](https://ide.bitquery.io/tron-token-balance)

#### TronWalletPortfolio Tron

Returns balances for all the currecies owned by a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances and `dataset: combined` for the latest balances.

▶️ [TronWalletPortfolio Tron](https://ide.bitquery.io/TronWalletPortfolio-Tron)

#### SunPump Bonding Curve TRX Balance

TRX balance in bonding curve based on dex trades. Calculated as `balance = in_sum - out_sum`

▶️ [SunPump Bonding Curve TRX Balance](https://ide.bitquery.io/SunPump-Bonding-Curve-TRX-Balance)

#### SunPump Historical Bonding Curve TRX Balance

Calculated as `balance = in_sum - out_sum`

▶️ [SunPump Historical Bonding Curve TRX Balance](https://ide.bitquery.io/SunPump-Historical-Bonding-Curve-TRX-Balance)

### Liquidity & Pools

#### Sun Pump Virtual Liquidity Pools

Sun Pump does not use a dedicated pool for each pair; instead, all liquidity is managed within a single contract. You can query the virtual liquidity pools directly by running the following query.

▶️ [Sun Pump Virtual Liquidity Pools](https://ide.bitquery.io/Sun-Pump-Virtual-Liquidity-Pools_1)

### Events & Calls

#### Latest created Sunpump tokens

If you remove `subscription` from the below GraphQL query it will become API, for example check.

▶️ [Latest created Sunpump tokens](https://ide.bitquery.io/latest-created-Sunpump-tokens)

#### Latest tokens created on Sunpump

The `Arguments` include the token address, creator, and token index. You can run it.

▶️ [Latest tokens created on Sunpump](https://ide.bitquery.io/Latest-tokens-created-on-Sunpump_2)

#### TokenPurchased on Sunpump

This query allows you to track `TokenPurchased` events on SunPump. It retrieves the 10 most recent token purchase events, showing important details such as the token address, buyer information, transaction hash, and token amount involved.

▶️ [TokenPurchased on Sunpump](https://ide.bitquery.io/TokenPurchased-on-Sunpump)

## Cross-Chain

### Trades

#### Volume of Multiple Tokens Across Different Chains

Get volume and price change data for multiple tokens trading on different chains (Solana, Ethereum, BSC, Tron) in a single query. Returns volume for 1h, 4h, and 24h periods, plus price change percentages. > **Note:** For EVM chains (Ethereum, BSC, etc.) in the Trading API, use **all lowercase…

▶️ [Volume of Multiple Tokens Across Different Chains](https://ide.bitquery.io/volume-of-a-token_2)

### Price & OHLC

#### SMA and Volume Data (for past 28, 14 and 7 Days Time)

Use this API to get SMA and volume over the past 28 days, with 14 days, and 7 days breakdowns. Note that the oldest possible data it could return is 30 days ago. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [SMA and Volume Data (for past 28, 14 and 7 Days Time)](https://ide.bitquery.io/multiple-tokens-volume-and-SMA)

#### Historical OHLC of a Token Pair Across Chains

This query fetches historical OHLC (Open, High, Low, Close) price data for a token pair across different blockchains for as long back as 30 days. For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH). Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Historical OHLC of a Token Pair Across Chains](https://ide.bitquery.io/Historical-Token-OHLC-Multi-Chains_1)

#### Latest Price of Any Token

This query gives you bitcoin currency 1-sec OHLC across different blockchains. You can adjust duration in `Duration: {eq: 1}` filter. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Latest Price of Any Token](https://ide.bitquery.io/Latest-bitcoin-price-on-across-chains_5)

#### OHLC of a currency on multiple blockchains

This query retrieves the OHLC (Open, High, Low, Close) prices of a currency(in this eg Bitcoin; it will include all sorts of currencies whose underlying asset is Bitcoin like cbBTC, WBTC, etc) across all supported blockchains, aggregated into a given time interval (e.g., 60 seconds in this example). Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [OHLC of a currency on multiple blockchains](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains_2)

#### Historical Price and Volume Data for a Token Pair beyond 30 days

Use this API to get historical price and volume for a specific token pair address on a specific network for the time window beyond the 30 days. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Historical Price and Volume Data for a Token Pair beyond 30 days](https://ide.bitquery.io/historical-price-and-historical-volume)

#### All time High Trade Price for a Token — historical (beyond 30 days)

Retrieves the all-time high (ATH) price in USD for a specified token contract. All time high price could lie beyond the 30 days window provided by Trading API, hence we use these network specific APIs to get the ATH for a token. While this provides the option to go beyond the 30 days time…. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [All time High Trade Price for a Token — historical (beyond 30 days)](https://ide.bitquery.io/ATH-of-eth-token_1)

## Ethereum

### Trades

#### Latest DEX trades for a token

Most recent swaps for one token across every Ethereum DEX. Change the token address in the `Currency: {SmartContract:}` filter. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Latest DEX trades for a token](https://ide.bitquery.io/Ethereum-Trades-of-a-Token_1)

#### Trades by a wallet

Every buy and sell made by one address. Replace the wallet in `Transaction: {From:}`. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Trades by a wallet](https://ide.bitquery.io/Ethereum-Trades-of-a-Trader_1)

#### All events on fluid DEX VaultFactory

Get a comprehensive list of all events emitted by the Fluid DEX Vault Factory contract. This query aggregates event counts by signature to identify which events are most frequently emitted, helping you understand the contract's activity patterns.

▶️ [All events on fluid DEX VaultFactory](https://ide.bitquery.io/all-events-on-fluid-DEX-VaultFactory)

#### Address is Buyer or Seller V2 — historical (beyond 30 days)

Returns trades where the specified address is either as a buyer or a seller. This is achieved by utilizing the `any` filter, which acts as an OR condition to encompass both buyer and seller roles in the results. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Address is Buyer or Seller V2 — historical (beyond 30 days)](https://ide.bitquery.io/Address-is-Buyer-or-Seller-V2)

#### First 500 buyers of a token — historical (beyond 30 days)

Earliest buyers of a token in order, useful for launch and insider analysis. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [First 500 buyers of a token — historical (beyond 30 days)](https://ide.bitquery.io/first-500-buyers-of-a-ERC20-token_1)

#### Realised PnL, buy and sell volume — historical (beyond 30 days)

Profit and loss for a wallet on one token, from its own trade history. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Realised PnL, buy and sell volume — historical (beyond 30 days)](https://ide.bitquery.io/Realised-Pnl-Buy-volume-Sell-Volume-Ethereum_1)

#### Buys, Sells, BuyVolume, SellVolume, Makers, TotalTradedVolume, PriceinUSD for a eth pair — historical (beyond 30 days)

Will fetch the buys, sells, buy volume, sell volume and also the number of makers for a particular token just like how DEXScreener shows in its UI. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Buys, Sells, BuyVolume, SellVolume, Makers, TotalTradedVolume, PriceinUSD for a eth pair — historical (beyond 30 days)](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-eth-pair)

#### Coin ticker api — historical (beyond 30 days)

Coin ticker api. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Coin ticker api — historical (beyond 30 days)](https://ide.bitquery.io/Coin-ticker-api_4)

#### Dex info — historical (beyond 30 days)

Will fetch a specific DEX stats for the selected network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Dex info — historical (beyond 30 days)](https://ide.bitquery.io/dex-info)

#### Dex markets — historical (beyond 30 days)

Will fetch all the DEXs info for the selected network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Dex markets — historical (beyond 30 days)](https://ide.bitquery.io/dex-markets)

### Transfers

#### ERC-20 transfers by wallet

Recent token transfers in and out of one address. Replace the address in the `where` clause.

▶️ [ERC-20 transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet_7)

#### ERC-20 transfers over a past period

Token transfers for a wallet between two dates. Change `since` and `till`. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ERC-20 transfers over a past period](https://ide.bitquery.io/Get-historical-ERC20-token-transfers-by-wallet_1)

#### Array_intersect example for 2 addresses

Find addresses that have interacted with multiple addresses from a given list. This query uses the `array_intersect` function to identify addresses that have sent or received funds to/from every address in your list.

▶️ [Array_intersect example for 2 addresses](https://ide.bitquery.io/array_intersect-example-for-2-addresses_2)

#### Binance:hot wallet transfers with transaction fees

Track wallet token transfers and get the fees paid for each by the address. `SenderFee` and `SenderFeeInUSD` fields in query are the transaction fees in ETH and transaction fees in USD respectively.

▶️ [Binance:hot wallet transfers with transaction fees](https://ide.bitquery.io/binancehot-wallet-transfers-with-transaction-fees)

#### Find earliest transfer to an account

Find the first transfer ever received by a specific wallet address. This is useful for wallet age analysis, first transaction tracking, and onboarding analytics.

▶️ [Find earliest transfer to an account](https://ide.bitquery.io/Copy-of-find-earliest-transfer-to-an-account)

#### Get Contract Type in v2

To determine the type of a contract and its details, we can use the Transfer API. By fetching the earliest transfer to the contract, we can get relevant details that indicate the contract type.

▶️ [Get Contract Type in v2](https://ide.bitquery.io/Get-Contract-Type-in-v2)

#### Get Minted Address of the ICO Token

In most of the ICOs, the token is minted to a smart contract that contains various methods for distributing the token whenever the conditions set by project owners are satisfied.

▶️ [Get Minted Address of the ICO Token](https://ide.bitquery.io/Get-Minted-Address-of-the-ICO-Token)

#### Number of Purchasers in ICO

Number of Purchasers in ICO. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Number of Purchasers in ICO](https://ide.bitquery.io/Number-of-Purchasers-in-ICO)

#### Transfers sent OR received by an address

Both sides of an address's transfer history in one result, using an OR filter. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Transfers sent OR received by an address](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-on-Ethereum)

#### Total txn fees paid by binance hot wallet in a day

Get the total fees (in Eth and USD) paid by a specific EVM account across all transfers. `SenderFee` and `SenderFeeInUSD` fields in query are the transaction fees in ETH and transaction fees in USD respectively.

▶️ [Total txn fees paid by binance hot wallet in a day](https://ide.bitquery.io/total-txn-fees-paid-by-binance-hot-wallet-in-a-day)

### Balances & Holders

#### Current balance of an address

Every token balance held by one wallet, with USD value. Balances are cumulative, so this reads the full history. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Current balance of an address](https://ide.bitquery.io/Ethereum-Balance-of-an-Address_2)

#### Token holder count

How many addresses hold a token right now. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token holder count](https://ide.bitquery.io/Copy-of-token-holders-count-eth)

#### Balance of an address at a past date

What a wallet held on a given day. Change the `date` argument. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Historical-Balance-of-an-Address_1)

#### Token holders on a specific date

A holder snapshot for any past day, with per-holder stats. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token holders on a specific date](https://ide.bitquery.io/tokens-holders-of-a-token_10)

#### Token Holders of Multiple Tokens until last month

This API provides a list of top holders along with relevant statistics for a given token liston a specific date using BalanceUpdates API.

▶️ [Token Holders of Multiple Tokens until last month](https://ide.bitquery.io/Top-10-historical-holders-of-multiple-tokens-on-ETH)

#### Average Tip in terms of avg gas Fee

Compares average user tip to average total gas fee per block across the last 10 blocks.

▶️ [Average Tip in terms of avg gas Fee](https://ide.bitquery.io/Average-Tip-in-terms-of-avg-gas-Fee_4)

#### Balance Updates for multiple addresses transfer in last 24 hours

Balance Updates for multiple addresses transfer in last 24 hours. Uses the `TransactionBalances` cube.

▶️ [Balance Updates for multiple addresses transfer in last 24 hours](https://ide.bitquery.io/Balance-Updates-for-multiple-addresses-transfer-in-last-24-hours)

#### Balance Updates for transfer in last 24 hours

Balance Updates for transfer in last 24 hours. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance Updates for transfer in last 24 hours](https://ide.bitquery.io/Balance-Updates-for-transfer-in-last-24-hours)

#### Balance update after transfer received from multiple addresses

Balance update after transfer received from multiple addresses. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer received from multiple addresses](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses_2)

#### Balance update after transfer sent from multiple addresses

Balance update after transfer sent from multiple addresses. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer sent from multiple addresses](https://ide.bitquery.io/Balance-update-after-transfer-sent-from-multiple-addresses)

### Price & OHLC

#### Token price from top market (rank 1)

Prices WETH from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Ethereum-Token-price-from-top-market-rank-1)

#### Ohlc of a token pair 1 hour interval

Fetches the Open, High, Low, and Close (OHLC) price data (USD-quoted) for a given token pair across DEXs, using a specified quote token and time interval (in seconds). Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Ohlc of a token pair 1 hour interval](https://ide.bitquery.io/ohlc-of-a-token-pair-1-hour-interval)

#### Historical Price and Volume Data for a Token Pair beyond 30 days

Use this API to get historical price and volume for a specific token pair address on a specific network for the time window beyond the 30 days. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Historical Price and Volume Data for a Token Pair beyond 30 days](https://ide.bitquery.io/historical-price-and-historical-volume)

#### Pepe historical ohlcv 30days

Fetch hourly OHLCV candles for the past 30 days. Change `Duration` for different intervals, such as 60 (1 minute) or 300 (5 minutes). Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Pepe historical ohlcv 30days](https://ide.bitquery.io/pepe-historical-ohlcv-30days)

#### Prices for multiple tokens at once — historical (beyond 30 days)

Latest USD price for a list of tokens in a single request. Add addresses to the `in` filter. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Prices for multiple tokens at once — historical (beyond 30 days)](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime)

#### Price of a token in realtime — historical (beyond 30 days)

Will give the latest Price of a specified token using DEXTrades API. Here we have calculated the price of a token in USD and also against the sell currency. Here is the. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price of a token in realtime — historical (beyond 30 days)](https://ide.bitquery.io/Price-of-a-token-in-realtime)

#### All-time high price of a token — historical (beyond 30 days)

Highest price a token has ever traded at, with the date it happened. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [All-time high price of a token — historical (beyond 30 days)](https://ide.bitquery.io/ATH-of-eth-token)

#### OHLCV by pair address — historical (beyond 30 days)

Open, high, low, close and volume candles for one pair. Change the interval to re-bucket the candles. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [OHLCV by pair address — historical (beyond 30 days)](https://ide.bitquery.io/OHLC0_8)

#### Price change over 5m, 1h, 6h and 24h — historical (beyond 30 days)

Percentage moves across four windows for one token in one query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price change over 5m, 1h, 6h and 24h — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_4)

#### Top 10 tokens by price change, last hour — historical (beyond 30 days)

Biggest movers on Ethereum over the past hour, ranked. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 tokens by price change, last hour — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-eth-tokens-by-price-change-in-last-1-hr_2)

#### Price change 5min, 1hr, 6hr precentage of a specific token — historical (beyond 30 days)

Price change 5min, 1hr, 6hr precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price change 5min, 1hr, 6hr precentage of a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_1)

### Supply & Market Cap

#### Pepe volume marketcap

Provides the latest trade volume for the past one hour along with the latest market cap.

▶️ [Pepe volume marketcap](https://ide.bitquery.io/pepe-volume-marketcap)

#### Top tokens by market cap

Ethereum tokens ranked by market capitalisation.

▶️ [Top tokens by market cap](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Ethereum)

#### Total supply and market cap of a token

Current circulating supply and market cap for one token.

▶️ [Total supply and market cap of a token](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_4)

#### Latest supply of USDT and USDC

Live supply for the two largest stablecoins; swap the addresses for any other tokens.

▶️ [Latest supply of USDT and USDC](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain_1)

#### Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific ERC-20 token. This query provides on-chain market cap data.

▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap)

#### Latest token supply on USDT and USDC on ethereum chain

Get the current total supply for specific tokens like USDC and USDT on Ethereum or any EVM network. This is ideal for stablecoin tracking and portfolio applications.

▶️ [Latest token supply on USDT and USDC on ethereum chain](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain)

#### Total Supply and onchain Marketcap of a specific token

This API gives you latest Supply and Marketcap of a token on EVM (here as example we have taken BITGET Token `0x54D2252757e1672EEaD234D27B1270728fF90581` ). Try it out.

▶️ [Total Supply and onchain Marketcap of a specific token](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token)

### Liquidity & Pools

#### Latest liquidity of a pool

Current reserves on both sides of one pool. Replace the pool address.

▶️ [Latest liquidity of a pool](https://ide.bitquery.io/latest-liquidity-of-a-EVM-pool_1)

#### Liquidity across all pools of a token

Total liquidity for a token summed across every pool it trades in.

▶️ [Liquidity across all pools of a token](https://ide.bitquery.io/liquidiy-of-all-token-pools_2)

#### Top liquidity pools for a token

The deepest pools holding a token, ranked by liquidity.

▶️ [Top liquidity pools for a token](https://ide.bitquery.io/top-liquidity-pools-of-atoken-on-ethereum_1)

#### Decoded arguments of a specific function call

Every call to one function with its arguments decoded. Change the method name to track a different function. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Decoded arguments of a specific function call](https://ide.bitquery.io/addLiquidityETH_function)

#### BlackRock USD Institutional Digital Liquidity Fund Latest Issuance

You can use the same as a `subscription` to monitor issuances in real-time.

▶️ [BlackRock USD Institutional Digital Liquidity Fund Latest Issuance](https://ide.bitquery.io/BlackRock-USD-Institutional-Digital-Liquidity-Fund-Latest-Issuance)

#### Liquidiy of all token pools

Returns current liquidity across all pools where a token appears as either `CurrencyA` or `CurrencyB`. It is useful when you want a token-wide liquidity view across multiple pools and DEXes.

▶️ [Liquidiy of all token pools](https://ide.bitquery.io/liquidiy-of-all-token-pools_1)

#### Top liquidity pools of atoken on ethereum

This query separates results by whether shiba inu is listed as the first token (`CurrencyA`) or the second token (`CurrencyB`) in the DEX pool, returning the 10 pools with the highest liquidity for each category.

▶️ [Top liquidity pools of atoken on ethereum](https://ide.bitquery.io/top-liquidity-pools-of-atoken-on-ethereum)

#### Top liquidity pools on Ethereum

You can run and modify this query in the.

▶️ [Top liquidity pools on Ethereum](https://ide.bitquery.io/top-liquidity-pools-on-Ethereum)

#### Latest Liquidity Changes of a Specific Pool

Retrieves the latest liquidity events for a specific DEX pool on Ethereum. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_5)

### Transactions

#### Transactions by wallet

Recent transactions sent from or to an address.

▶️ [Transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_7)

#### Look up a transaction by hash

Full detail for a single transaction. Paste the hash into the `where` clause.

▶️ [Look up a transaction by hash](https://ide.bitquery.io/Get-a-transaction-by-hash)

#### Transaction value in USD

Converts transaction value to USD at the time it was mined.

▶️ [Transaction value in USD](https://ide.bitquery.io/Transaction-value-in-USD)

#### Debug traceTransaction

To trace a transaction using the debug_traceTransaction we need the `transaction hash`. We are using.

▶️ [Debug traceTransaction](https://ide.bitquery.io/debug_traceTransaction)

#### Eth getBlockReceipt

In this section we will build an API that serves as an alternative to the eth_getBlockReceipts JSON RPC method that takes `Block Number` as an input and returns all transaction receipts for the given block.

▶️ [Eth getBlockReceipt](https://ide.bitquery.io/eth_getBlockReceipt)

#### Eth getTransactionByHash

Eth getTransactionByHash. Uses the `Transactions` cube.

▶️ [Eth getTransactionByHash](https://ide.bitquery.io/eth_getTransactionByHash_1)

#### Eth getTransactionReceipt

In this section, we will build an alternative to the eth_getTransactionReceipt JSON RPC method using the Bitquery APIs. The method is used to provide the receipt of a transaction given `transaction hash`.

▶️ [Eth getTransactionReceipt](https://ide.bitquery.io/eth_getTransactionReceipt_1)

#### Internal transactions of a transaction

The internal calls a transaction produced — what a block explorer shows as internal txns.

▶️ [Internal transactions of a transaction](https://ide.bitquery.io/internal-transactions-for-a-particular-tx)

### Events & Calls

#### Latest smart contract calls

Decoded contract calls with their arguments.

▶️ [Latest smart contract calls](https://ide.bitquery.io/Recent-Calls-on-Ethereum_2)

#### Latest events and logs

Decoded event logs as they land. Filter by contract or by event name.

▶️ [Latest events and logs](https://ide.bitquery.io/Recents-Events-and-Logs-on-Ethereum_3)

#### All aave v3 events latest

Shows latest 10 events emitted by the AAVE V3 contract. The `Log` field in the results will contain information about the event, including its signature, smart contract address, and transaction hash.

▶️ [All aave v3 events latest](https://ide.bitquery.io/All-aave-v3-events-latest)

#### ByteCode of A Token

Will return the most recent transaction that created the token contract. The `Output` field of the Call object in the transaction contains the encoded bytecode of the contract.

▶️ [ByteCode of A Token](https://ide.bitquery.io/ByteCode-of-A-Token)

#### Find the deployer of a contract

Returns which address created a given contract, and when. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Find the deployer of a contract](https://ide.bitquery.io/creator--deployer-of-an-address_1)

#### Debug_traceCall

In this section, we will discuss how we can use Bitquery APIs as an alternative to the debug_traceCall JSON RPC method, which runs an eth_call within the context of the given block execution using the final state of parent block as the base.

▶️ [Debug_traceCall](https://ide.bitquery.io/debug_traceCall)

#### ETH/BSC SC creates count over date

This query below, will return the number of new smart contracts created on the Ethereum and Binance Smart Chain networks since a particular date. It will also return the date of each day on which new smart contracts were created.

▶️ [ETH/BSC SC creates count over date](https://ide.bitquery.io/ETHBSC-SC-creates-count-over-date)

#### Eth getLogs with filters

Now, just like the orignal eth_getLogs method, Bitquery APIs provides the option to filter out the `Logs` based on the following parameeters.

▶️ [Eth getLogs with filters](https://ide.bitquery.io/eth_getLogs-with-filters)

### Mempool

#### Get next available nonce

The following query helps you determine the next available nonce for an Ethereum account by getting the latest transaction in the mempool (broadcasted transactions). The returned nonce is the highest nonce used by the account in the mempool.

▶️ [Get next available nonce](https://ide.bitquery.io/get-next-available-nonce)

#### Simulating Pending Transactions

Retrieves information about in-flight transactions, helping you simulate the most recent state. It is a way to see if they will succeed without sending them on-chain.

▶️ [Simulating Pending Transactions](https://ide.bitquery.io/Simulating-Pending-Transactions_1)

### Blocks & Validators

#### Aggregate Self-Destruct Statistics

Calculate total ETH destroyed or received from self-destructs using aggregation functions.

▶️ [Aggregate Self-Destruct Statistics](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics)

#### QuasarBuilder MEV Payout Transaction Balance

This query focuses on a block builder address and returns the most recent payouts, including the token metadata, pre/post balances, and USD valuations, so you can quickly see how large each MEV reward was.

▶️ [QuasarBuilder MEV Payout Transaction Balance](https://ide.bitquery.io/QuasarBuilder-MEV-Payout-Transaction-Balance)

#### Self-Destruct Balance Decrease API

Monitor contract balance decrease when contracts are self-destructing.

▶️ [Self-Destruct Balance Decrease API](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API)

#### Self-Destruct Balance Increase API

Monitor contract balance increase when contracts are self-destructing.

▶️ [Self-Destruct Balance Increase API](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API)

#### Top validators by total tips in last 24 hrs

Ranks validators by cumulative priority fees (reason code 5) received in the last 24 hours.

▶️ [Top validators by total tips in last 24 hrs](https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs)

#### Total tips received by a validator in last 24 hrs

Returns the total priority fees (native and USD) earned by a specific validator over the last 24 hours.

▶️ [Total tips received by a validator in last 24 hrs](https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs)

### Uniswap

#### Latest slippage on a Uniswap v3 pool

Per-trade slippage for one v3 pool, to size orders before sending them.

▶️ [Latest slippage on a Uniswap v3 pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3-Ethereum_1)

#### All Pool_Ids for currency

These swaps use the chain-specific DEXTrades cube via `EVM { DEXTrades }`: `Trade.PoolId`, pool-relative Buy/Sell (DEXTrades cube). USD can be thin on small pools—use live swaps above when you want the Trading row shape.

▶️ [All Pool_Ids for currency](https://ide.bitquery.io/All-Pool_Ids-for-currency)

#### Fee collection on Uniswap v3 Positions

It returns decoded arguments—including the Uniswap position `tokenId`, the `recipient` address, and the collected `amount0` and `amount1` values (raw integer amounts).

▶️ [Fee collection on Uniswap v3 Positions](https://ide.bitquery.io/Fee-collection-on-Uniswap-v3-Positions)

#### Latest ModifyLiquidity Events on Uniswap v4

Track the most recent liquidity modifications on Uniswap V4 by querying `ModifyLiquidity` events from the PoolManager contract.

▶️ [Latest ModifyLiquidity Events on Uniswap v4](https://ide.bitquery.io/Latest-ModifyLiquidity-Events-on-Uniswap-v4)

#### Latest trades of a Uniswap pair

Trades for one Uniswap pair. Replace the pair address.

▶️ [Latest trades of a Uniswap pair](https://ide.bitquery.io/Latest-Trades-of-a-Pair-on-Uniswap)

#### Latest liquidity for a currency pair across all v4 pools

This API endpoint provides latest liquidity event for every Uniswap V4 pool for a given currency pair. This info includes the Price of currencies in terms of other, Price of currencies in USD, Currency Details and `PoolIDs`.

▶️ [Latest liquidity for a currency pair across all v4 pools](https://ide.bitquery.io/latest-liquidity-for-a-currency-pair-across-all-v4-pools_1)

#### Latest liquidity for an individual pool on uniswap v4

Returns the most recent liquidity event for a single Uniswap v4 pool. Replace `$poolId` with your target `PoolId` (from trades UI, subgraph, or a prior `DEXTradeByTokens` / `DEXPoolEvents` discovery query).

▶️ [Latest liquidity for an individual pool on uniswap v4](https://ide.bitquery.io/latest-liquidity-for-an-individual-pool-on-uniswap-v4)

#### Latest slippage of a pool on Uniswap v3 Ethereum

Retrieves the latest slippage data for a specific DEX pool on Ethereum. Use it to calculate slippage and check Uniswap V3 price impact slippage for a particular token pair before trading.

▶️ [Latest slippage of a pool on Uniswap v3 Ethereum](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3-Ethereum)

#### Latest trade price of uniswap pair

Here's an example of tracking Uniswap token pair trading price.

▶️ [Latest trade price of uniswap pair](https://ide.bitquery.io/latest-trade-price-of-uniswap-pair)

#### Latest trades for a Pool Id on uniswap v4

Latest trades for a Pool Id on uniswap v4. Uses the `DEXTrades` cube.

▶️ [Latest trades for a Pool Id on uniswap v4](https://ide.bitquery.io/Latest-trades-for-a-Pool-Id-on-uniswap-v4)

### PancakeSwap

#### Latest Trades on PancakeSwap V3 ETH

The PancakSwap DEX Data is also available for view as a dashboard at DEXRABBIT.

▶️ [Latest Trades on PancakeSwap V3 ETH](https://ide.bitquery.io/Latest-Trades-on-PancakeSwap-V3-ETH)

#### Top Traders of a token on PancakeSwap on ETH

Top Traders of a token on PancakeSwap on ETH. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top Traders of a token on PancakeSwap on ETH](https://ide.bitquery.io/Top-Traders-of-a-token-on-PancakeSwap-on-ETH)

#### Top token pairs on PancakeSwap v3

Top token pairs on PancakeSwap v3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top token pairs on PancakeSwap v3](https://ide.bitquery.io/Top-token-pairs-on-PancakeSwap-v3)

## BSC

### Trades

#### BSC DEX Trades

This query returns the latest trades on the BSC network from a trader perspective and returns useful metrics such as marketcap and pool ranking. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [BSC DEX Trades](https://ide.bitquery.io/BSC-dextrades_9)

#### BSC Dex Trade By Tokens

This query returns the latest trades on the BSC network. This is useful when looking for trades of a token. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [BSC Dex Trade By Tokens](https://ide.bitquery.io/BSC-dextrades-for-a-token)

#### Get Trades by a Trader

Get all trades by a particular trader. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get Trades by a Trader](https://ide.bitquery.io/BSC-dextrades-by-a-trader)

#### First 500 buyers of a specific BSC chain token — historical (beyond 30 days)

Below API gets you the first 500 buyers of a specific BSC token, here as example we have taken this token `0x031b41e504677879370e9DBcF937283A8691Fa7f`. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [First 500 buyers of a specific BSC chain token — historical (beyond 30 days)](https://ide.bitquery.io/first-500-buyers-of-a-specific-BSC-chain-token_2)

#### Get all the DEXs on BSC network — historical (beyond 30 days)

Retrieves all the DEXes operating on BSC network and gives info such as `ProtocolName` , `ProtocolVersion` and `ProtocolFamily`. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get all the DEXs on BSC network — historical (beyond 30 days)](https://ide.bitquery.io/Get-all-the-DEXs-on-BSC-network)

#### Latest Flap.sh trades using DEXTrades API — historical (beyond 30 days)

Monitor all recent trades across Flap.sh tokens using the DEXTrades API. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest Flap.sh trades using DEXTrades API — historical (beyond 30 days)](https://ide.bitquery.io/Latest-Flapsh-trades-using-DEXTrades-API)

#### Top Gainers on BSC — historical (beyond 30 days)

Get Top Gainers for the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top Gainers on BSC — historical (beyond 30 days)](https://ide.bitquery.io/bsc-top-gainers)

#### All dexs info on bsc — historical (beyond 30 days)

Will fetch all the DEXs info for the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [All dexs info on bsc — historical (beyond 30 days)](https://ide.bitquery.io/all-dexs-info-on-bsc)

#### Get all dex markets for a token — historical (beyond 30 days)

Will fetch all the DEXs where a token is listed for the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get all dex markets for a token — historical (beyond 30 days)](https://ide.bitquery.io/get-all-dex-markets-for-a-token)

#### Latest Flap.sh trades for a specific token — historical (beyond 30 days)

Get trading activity for a specific Flap.sh token using DEXTradeByTokens API. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest Flap.sh trades for a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Latest-Flapsh-trades-for-a-specific-token)

### Settlements

#### Gra fun redeem transactions

Gra fun redeem transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Gra fun redeem transactions](https://ide.bitquery.io/Gra-fun-redeem-transactions)

### Transfers

#### Get Historical ERC20 token transfers by wallet

Get ERC20 token transfers for an address in a given historical time window

▶️ [Get Historical ERC20 token transfers by wallet](https://ide.bitquery.io/Get-historical-ERC20-token-transfers-by-wallet-bsc)

#### Get token transfers by wallet

Get token transactions ordered by block number in descending order.

▶️ [Get token transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet-bsc)

#### Check if an address interacted with predict.fun ever

Predict.fun flows on BSC often show up as USDT (`0x55d398326f99059fF775485246999027B3197955`) transfers from the user's wallet to one of the protocol contract addresses listed below.

▶️ [Check if an address interacted with predict.fun ever](https://ide.bitquery.io/check-if-an-address-interacted-with-predictfun-ever)

#### Check who created this meme rush token

Fetches the developer address that created a specific Meme Rush token on BSC by tracing the minting transfer (from the zero address) of that token’s smart contract.

▶️ [Check who created this meme rush token](https://ide.bitquery.io/check-who-created-this-meme-rush-token)

#### Check who created this token

Fetches the developer address that created a specific Four.Meme token on BSC by tracing the minting transfer (from the zero address) of that token’s smart contract.

▶️ [Check who created this token](https://ide.bitquery.io/check-who-created-this-token)

#### First transfers of a token

Retrieves the first transfer of a token to each address, providing the timestamp when each address first received the token.

▶️ [First transfers of a token](https://ide.bitquery.io/first-transfers-of-a-token_5)

#### Meme rush tokens created by specific dev

This API fetches Binance Meme Rush tokens created by a specific dev on BSC by tracking token minting transfers signed by a particular dev. `Dev Address` here in example is `0xF4f3eb591c47d14614D3A54aCBA28019e2041066`.

▶️ [Meme rush tokens created by specific dev](https://ide.bitquery.io/meme-rush-tokens-created-by-specific-dev)

#### New Flap.sh Tokens Created Using Transfers API

Track newly created Flap.sh tokens by monitoring transfers from the zero address with token addresses ending in the vanity suffix.

▶️ [New Flap.sh Tokens Created Using Transfers API](https://ide.bitquery.io/New-Flapsh-Tokens-Created-Using-Transfers-API)

#### Sender OR Receiver Transfer Example BSC

Sender OR Receiver Transfer Example BSC. Uses the `Transfers` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Sender OR Receiver Transfer Example BSC](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-Example-BSC)

#### Token created by specific dev

This API fetches Four.Meme tokens created by a specific dev on BSC by tracking token minting transfers signed by a particular dev. `Dev Address` here in example is `0x9c75588640605d46b42f2d64c5c2e993de251210`.

▶️ [Token created by specific dev](https://ide.bitquery.io/token-created-by-specific-dev)

### Balances & Holders

#### Get latest BNB balance of an wallet

Get latest BNB balance of an wallet.

▶️ [Get latest BNB balance of an wallet](https://ide.bitquery.io/Latest-native-balance-of-an-address-bsc)

#### Average Tip in terms of avg gas Fee bsc

Compares average user tip to average total gas fee per block across the last 10 blocks.

▶️ [Average Tip in terms of avg gas Fee bsc](https://ide.bitquery.io/Average-Tip-in-terms-of-avg-gas-Fee-bsc)

#### Latest balance of an address for a specific token bsc

This API gives you latest balance of a specific address (here in example `0x238a358808379702088667322f80ac48bad5e6c4`) for a specific token (here we have taken example of USDC `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`). Try it out.

▶️ [Latest balance of an address for a specific token bsc](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token-bsc)

#### Top 10 holders percentage

Calculates the percentage of total supply held by the top 10 holders of a specific Four Meme token on BSC.

▶️ [Top 10 holders percentage](https://ide.bitquery.io/top-10-holders-percentage)

#### Track recent ephemeral contract patterns bsc

Many MEV bots and arbitrage executors create contracts that are destroyed within the same transaction. These short-lived contracts are used for.

▶️ [Track recent ephemeral contract patterns bsc](https://ide.bitquery.io/Track-recent-ephemeral-contract-patterns-bsc)

#### Balance Updates for multiple addresses transfer in last 24 hours bsc

Balance Updates for multiple addresses transfer in last 24 hours bsc. Uses the `TransactionBalances` cube.

▶️ [Balance Updates for multiple addresses transfer in last 24 hours bsc](https://ide.bitquery.io/Balance-Updates-for-multiple-addresses-transfer-in-last-24-hours-bsc)

#### Balance Updates for transfer in last 24 hours bsc

Balance Updates for transfer in last 24 hours bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance Updates for transfer in last 24 hours bsc](https://ide.bitquery.io/Balance-Updates-for-transfer-in-last-24-hours-bsc)

#### Balance update after transfer received bsc

Balance update after transfer received bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer received bsc](https://ide.bitquery.io/Balance-update-after-transfer-received-bsc)

#### Balance update after transfer received from multiple addresses bsc

Balance update after transfer received from multiple addresses bsc. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer received from multiple addresses bsc](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses-bsc)

#### Balance update after transfer sent bsc

Balance update after transfer sent bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer sent bsc](https://ide.bitquery.io/Balance-update-after-transfer-sent-bsc)

### Price & OHLC

#### Token price from top market (rank 1)

Prices WBNB from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/BSC-Token-price-from-top-market-rank-1)

#### OHLCV data for specific Flap.sh token against BNB

Get OHLCV data for Flap.sh tokens paired with BNB. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [OHLCV data for specific Flap.sh token against BNB](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-against-BNB)

#### OHLCV data for specific Flap.sh token in USD

Get OHLCV (Open, High, Low, Close, Volume) data for Flap.sh tokens quoted in USD. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [OHLCV data for specific Flap.sh token in USD](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-in-USD)

#### BEP-20 Token Price — historical (beyond 30 days)

Get the latest price of a BEP-20 token on BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [BEP-20 Token Price — historical (beyond 30 days)](https://ide.bitquery.io/realtime-usd-price-of-a-token)

#### Get Price Change 5min, 1h, 6h and 24h of a specific BSC token — historical (beyond 30 days)

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific BSC token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_3)

#### OHLC for a BEP-20 Token — historical (beyond 30 days)

Get OHLC statistics for a BEP-20 token on BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [OHLC for a BEP-20 Token — historical (beyond 30 days)](https://ide.bitquery.io/OHLC-for-a-token-on-bsc_1)

#### Top 10 BSC Tokens by Price Change in last 1h — historical (beyond 30 days)

This query gets you top 10 BSC Tokens by Price Change in last 1h. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 BSC Tokens by Price Change in last 1h — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-bsc-tokens-by-price-change-in-last-1-hr)

#### BSC OHLC API For Token Pair — historical (beyond 30 days)

Will fetch the OHLC of a token pair for the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [BSC OHLC API For Token Pair — historical (beyond 30 days)](https://ide.bitquery.io/BSC-OHLC-API-For-Token-Pair)

#### Meme rush token ATH price — historical (beyond 30 days)

Fetches the All-Time High (ATH) price of a specific Meme Rush token on BSC, using the `DEXTradeByTokens` dataset to calculate the 98th percentile of trade prices (approximate ATH). Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Meme rush token ATH price — historical (beyond 30 days)](https://ide.bitquery.io/meme-rush-token-ATH-price)

#### Latest price of a token on bsc — historical (beyond 30 days)

Will fetch latest trades for a token pair for the BSC network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest price of a token on bsc — historical (beyond 30 days)](https://ide.bitquery.io/Latest-price-of-a-token-on-bsc)

#### Percentage price change for a meme rush token — historical (beyond 30 days)

Use the below query to get the price change in percentage for various time fields including `24 hours`, `1 hour` and `5 minutes`. Try it. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Percentage price change for a meme rush token — historical (beyond 30 days)](https://ide.bitquery.io/Percentage-price-change-for-a-meme-rush-token)

### Supply & Market Cap

#### Top Tokens by Market Cap on bsc

Ranks tokens on BNB Smart Chain by `Supply.MarketCap`, with 24h window, 1s interval, $1,000+ USD volume, `limitBy` per `Token_Id`, up to 50 rows. `Token.Network` is Binance Smart Chain.

▶️ [Top Tokens by Market Cap on bsc](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-bsc)

#### Get Total Supply and Marketcap of an ERC20 token

Get Total Supply and Marketcap of an ERC20 token.

▶️ [Get Total Supply and Marketcap of an ERC20 token](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc_1)

#### Total Supply and onchain Marketcap of a specific token bsc

This API gives you latest Supply and Marketcap of a token on BSC (here as example we have taken a BEP-20 token `0x55d398326f99059ff775485246999027b3197955`). Try it out.

▶️ [Total Supply and onchain Marketcap of a specific token bsc](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc)

### Liquidity & Pools

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on BSC. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Pancakeswap)

#### Latest Liquidity Changes of a Specific Pool

Retrieves the latest liquidity events for a specific DEX pool on BSC. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_2)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.

▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_6)

#### Gra fun buy transactions

Retrieve all buy transactions from GRA.fun using.

▶️ [Gra fun buy transactions](https://ide.bitquery.io/Gra-fun-buy-transactions)

#### Gra fun sell transactions

Retrieve all sell transactions on GRA fun using.

▶️ [Gra fun sell transactions](https://ide.bitquery.io/Gra-fun-sell-transactions)

### Events & Calls

#### Latest Calls on BSC network

Retrieves the latest successful smart contract calls on the BNB Smart Chain (BSC). It fetches details about contract interactions, transaction metadata, and associated block information.

▶️ [Latest Calls on BSC network](https://ide.bitquery.io/Latest-Calls-on-BSC-network)

#### Latest flap.sh token created using events data

Monitor token creation events directly from the Flap.sh portal contract for more detailed information.

▶️ [Latest flap.sh token created using events data](https://ide.bitquery.io/Latest-flapsh-token-created-using-events-data_1)

### Blocks & Validators

#### Aggregate Self-Destruct Statistics bsc

Calculate total ETH destroyed or received from self-destructs using aggregation functions.

▶️ [Aggregate Self-Destruct Statistics bsc](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-bsc)

#### Self-Destruct Balance Decrease API bsc

Monitor contract balance decrease when contracts are self-destructing.

▶️ [Self-Destruct Balance Decrease API bsc](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API-bsc)

#### Self-Destruct Balance Increase API bsc

Monitor contract balance increase when contracts are self-destructing.

▶️ [Self-Destruct Balance Increase API bsc](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API-bsc)

#### Top validators by total tips in last 24 hrs bsc

Ranks validators by cumulative priority fees (reason code 5) received in the last 24 hours.

▶️ [Top validators by total tips in last 24 hrs bsc](https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs-bsc)

#### Historical Miner Balance Data bsc

Historical Miner Balance Data bsc. Uses the `TransactionBalances` cube.

▶️ [Historical Miner Balance Data bsc](https://ide.bitquery.io/Historical-Miner-Balance-Data-bsc)

#### Total tips received by a validator in last 24 hrs bsc

Returns the total priority fees (native and USD) earned by a specific validator over the last 24 hours.

▶️ [Total tips received by a validator in last 24 hrs bsc](https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs-bsc)

### PancakeSwap

#### OHLC of a Token on PancakeSwap

Get the OHLC stats of a token traded on Pancakeswap.

▶️ [OHLC of a Token on PancakeSwap](https://ide.bitquery.io/OHLC-of-a-Token-on-pancake_swap_v3)

#### Price of a Token on PancakeSwap

Get the latest price of a token traded on Pancakeswap.

▶️ [Price of a Token on PancakeSwap](https://ide.bitquery.io/BSC-PancakeSwap-v3-Price-for-a-token)

#### Trades on Pancakeswap

Get the latest trades on Pancakeswap.

▶️ [Trades on Pancakeswap](https://ide.bitquery.io/BSC-dextrades-for-pancakeswap)

#### All pools of a token on pancake swap

All pools of a token on pancake swap. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [All pools of a token on pancake swap](https://ide.bitquery.io/All-pools-of-a-token-on-pancake-swap_2)

#### Bsc pancakeswap ohlc using trading api

Bsc pancakeswap ohlc using trading api. Uses the `Pairs` cube.

▶️ [Bsc pancakeswap ohlc using trading api](https://ide.bitquery.io/bsc-pancakeswap-ohlc-using-trading-api)

#### Get Latest Price of a token on PancakeSwap Infinity

Below query will get you Latest Price of a token on PancakeSwap Infinity.

▶️ [Get Latest Price of a token on PancakeSwap Infinity](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity_1)

#### Get metadata for bsc pancakeswap infnity token

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`.

▶️ [Get metadata for bsc pancakeswap infnity token](https://ide.bitquery.io/get-metadata-for-bsc-pancakeswap-infnity-token)

#### Get metadata pancakeswap

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`.

▶️ [Get metadata pancakeswap](https://ide.bitquery.io/get-metadata-pancakeswap)

### Four Meme

#### Get Dev and Age of Four Meme Token

Below query retrieves the Dev address and time when a Four Meme Token was created.

▶️ [Get Dev and Age of Four Meme Token](https://ide.bitquery.io/get-dev-and-age-of-a-four-meme-token)

#### Get Newly Created Tokens on Four Meme

This query retrieves newly created tokens on Four Meme by listening to the `TokenCreate` event. The response provides token information including creator address, token contract address, name, symbol, total supply, and launch details.

▶️ [Get Newly Created Tokens on Four Meme](https://ide.bitquery.io/track-Four-meme-token-creation-using-events)

#### Liquidity Addition for Four Meme Token

Get the liquidity addition events for a specific token on the Four Meme Exchange.

▶️ [Liquidity Addition for Four Meme Token](https://ide.bitquery.io/Liquidity-Added-to-specific-tokens-on-Four-meme)

#### Four meme - token ATH price

Fetches the All-Time High (ATH) price of a specific Four.Meme token on BSC, using the `DEXTradeByTokens` dataset to calculate the 98th percentile of trade prices (approximate ATH).

▶️ [Four meme - token ATH price](https://ide.bitquery.io/four-meme---token-ATH-price)

#### Get first buys of an address list of a specific token

This query checks if the addresses from Query 1 ever bought the token and when. Pass the address array from Query 1 as a variable to this query.

▶️ [Get first buys of an address list of a specific token](https://ide.bitquery.io/get-first-buys-of-an-address-list-of-a-specific-token_2)

#### If meme rush token migrated from four meme or not

Below query will only show response if a the mentioned meme rush tokens have migrated to Pancakeswap. Note: Please use a `Block{Date}` filter to minimize the data processing and hence the query processing time and get fast responses.

▶️ [If meme rush token migrated from four meme or not](https://ide.bitquery.io/if-meme-rush-token-migrated-from-four-meme-or-not)

#### If token migrated from four meme or not

Below query will only show response if a the mentioned four meme tokens have migrated to Pancakeswap. Note: Please use a `Block{Date}` filter to minimize the data processing and hence the query processing time and get fast responses.

▶️ [If token migrated from four meme or not](https://ide.bitquery.io/if-token-migrated-from-four-meme-or-not_4)

#### Top buyers of a four meme token

Top buyers of a four meme token. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top buyers of a four meme token](https://ide.bitquery.io/Top-buyers-of-a-four-meme-token)

#### Top buyers of a meme rush token

Top buyers of a meme rush token. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top buyers of a meme rush token](https://ide.bitquery.io/Top-buyers-of-a-meme-rush-token)

#### Top tokens by launch marketcap on fourmeme

Below API can be used to get top four meme tokens by launch marketcap (marketcap at the time of launching). You can get all the data through us and create a min and max marketcap filter in your application.

▶️ [Top tokens by launch marketcap on fourmeme](https://ide.bitquery.io/top-tokens-by-launch-marketcap-on-fourmeme_1)

### Uniswap

#### Trading Pairs on a BSC DEX

Get all trading pairs present on a BSC network DEX.

▶️ [Trading Pairs on a BSC DEX](https://ide.bitquery.io/trading-pairs-on-BNB-by-USD-volume)

#### Get metadata

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`.

▶️ [Get metadata](https://ide.bitquery.io/get-metadata_1)

#### Latest Trades for a currency pair on bsc

Latest Trades for a currency pair on bsc. Uses the `DEXTrades` cube.

▶️ [Latest Trades for a currency pair on bsc](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-bsc)

#### OHLC on BSC Uniswap v3

Retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval.

▶️ [OHLC on BSC Uniswap v3](https://ide.bitquery.io/OHLC-on-BSC-Uniswap-v3)

#### Top bought tokens on bsc uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top bought tokens on bsc uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-bsc-uniswap-v3)

#### Top buyers of a currency on uniswap v4 bsc

Top buyers of a currency on uniswap v4 bsc. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a currency on uniswap v4 bsc](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-bsc)

#### Top sellers of a token on uniswap v4 pool bsc

Top sellers of a token on uniswap v4 pool bsc. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top sellers of a token on uniswap v4 pool bsc](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-bsc)

#### Top sold tokens on bsc uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top sold tokens on bsc uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-bsc-uniswap-v3)

#### Top traders of a token on uniswapv3 bsc

Will fetch top traders of a token for the selected network.

▶️ [Top traders of a token on uniswapv3 bsc](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-bsc)

#### Trade stats for a token pair on uniswap v4 bsc

Trade stats for a token pair on uniswap v4 bsc. Uses the `DEXTradeByTokens` cube.

▶️ [Trade stats for a token pair on uniswap v4 bsc](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-bsc_1)

## Base

### Trades

#### Base DEX Trades

This query returns the latest trades on the Base network from a trader perspective and returns useful metrics such as marketcap and pool ranking. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Base DEX Trades](https://ide.bitquery.io/base-dextrades_3)

#### Base Dex Trade By Tokens

This query returns the latest trades on the Base network. This is useful when looking for trades of a token. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Base Dex Trade By Tokens](https://ide.bitquery.io/base-dextrades-for-a-token)

#### Get Trades by a Trader

Get all trades by a particular trader. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Get Trades by a Trader](https://ide.bitquery.io/base-dextrades-by-a-trader)

#### Top Traders by PnL of a specific base pool

Rank traders by `PnL` on one pool: filter `Pair.Market.Address`, last 30 minutes, `limit: 10`, and `orderBy` `PnL` descending. Useful for leaderboards, smart-money screens, and pool-specific trader analytics. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Top Traders by PnL of a specific base pool](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-base-pool_1)

#### Ape store token trades

Ape store token trades. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape store token trades](https://ide.bitquery.io/ape-store-token-trades)

#### First 500 buyers of a specific base token — historical (beyond 30 days)

Below API gets you the first 500 buyers of a specific Base chain token, here as example we have taken this token `0x58538e6A46E07434d7E7375Bc268D3cb839C0133`. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [First 500 buyers of a specific base token — historical (beyond 30 days)](https://ide.bitquery.io/first-500-buyers-of-a-specific-base-token)

#### Latest Trades of a Token on Zora Base — historical (beyond 30 days)

Latest Trades of a Token on Zora Base. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest Trades of a Token on Zora Base — historical (beyond 30 days)](https://ide.bitquery.io/Latest-Trades-of-a-Token-on-Zora-Base)

#### Latest Zora Trades on Base — historical (beyond 30 days)

Fetches the latest DEX trades on the Zora protocol (`zora_v4`) on Base blockchain. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest Zora Trades on Base — historical (beyond 30 days)](https://ide.bitquery.io/Latest-Zora-Trades-on-Base)

#### Most Traded Tokens on Aerodome Last Month — historical (beyond 30 days)

Discover the most actively traded tokens on Aerodrome Finance over any time period. This query analyzes all DEX trades within a specified timeframe and ranks tokens by trade count, helping you identify trending tokens and market activity patterns. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Most Traded Tokens on Aerodome Last Month — historical (beyond 30 days)](https://ide.bitquery.io/Most-Traded-Tokens-on-Aerodome-Last-Month)

### Transfers

#### Get Historical ERC20 token transfers by wallet

Get ERC20 token transfers for an address in a given historical time window

▶️ [Get Historical ERC20 token transfers by wallet](https://ide.bitquery.io/Get-historical-ERC20-token-transfers-by-wallet-base_2)

#### Get token transfers by wallet

Get token transactions ordered by block number in descending order.

▶️ [Get token transfers by wallet](https://ide.bitquery.io/Get-token-transfers-by-wallet-base_1)

#### Newly created zora tokens

Retrieves the list of newly created tokens on Zora Launchpad by monitoring transfers where new tokens are minted (sender is the zero address) with a specific amount.

▶️ [Newly created zora tokens](https://ide.bitquery.io/Newly-created-zora-tokens)

#### Tx from to base address

We use the `any` filter [ OR condition] to get transactions from or to a wallet.

▶️ [Tx from to base address](https://ide.bitquery.io/tx-from-to-base-address)

### Balances & Holders

#### Current balance of an address

Every token balance held by one Base address. Balances are cumulative, so this reads the whole history — replace the address to use it.

▶️ [Current balance of an address](https://ide.bitquery.io/Base-Current-balance-of-an-address)

#### Real-Time Holders of Multiple Tokens

This API leverages the balanceUpdate endpoint to deliver real-time holder data for multiple tokens.

▶️ [Real-Time Holders of Multiple Tokens](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-Base_2)

#### Token Holder Count on a Specific Date

This API returns the total number of holders for a specific token on a given date.

▶️ [Token Holder Count on a Specific Date](https://ide.bitquery.io/token-holders-count-base)

#### Token Holders and Stats on a Specific Date - TokenHolders API

This API provides a list of all holders along with relevant statistics for a given token on a specific date.

▶️ [Token Holders and Stats on a Specific Date - TokenHolders API](https://ide.bitquery.io/tokens-holders-of-a-token-base)

#### Token Holders of Multiple Tokens on a speicifc date

This API provides a list of top holders along with relevant statistics for a given token liston a specific date using Holders API.

▶️ [Token Holders of Multiple Tokens on a speicifc date](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-Base-at-a-specific-time-holder-api)

#### Get All Token Balances for an Address

Retrieve all token balances held by a specific address. This query returns balances for all tokens the address holds.

▶️ [Get All Token Balances for an Address](https://ide.bitquery.io/Get-All-Token-Balances-for-an-Address_4)

#### Get latest token balance of a wallet

Get latest token balance of a wallet.

▶️ [Get latest token balance of a wallet](https://ide.bitquery.io/Get-Latest-Token-Balance-for-an-Address_4)

#### Base balances address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

▶️ [Base balances address](https://ide.bitquery.io/base-balances-address)

#### Base native balances address

Returns the native ETH balance for a wallet on Base (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

▶️ [Base native balances address](https://ide.bitquery.io/base-native-balances-address)

#### Latest balance of an address for a specific token base

This API gives you latest balance of a specific address (here in example `0x238a358808379702088667322f80ac48bad5e6c4`) for a specific token (here we have taken example of USDC `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`). Try it out.

▶️ [Latest balance of an address for a specific token base](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token-base)

#### Token holder snapshot base

The number of unique holders, token supply, and Gini coefficient for the balance amount before a specific timestamp can be derived using the query below. These stats provide a useful holder snapshot for any given time.

▶️ [Token holder snapshot base](https://ide.bitquery.io/token-holder-snapshot-base)

### Price & OHLC

#### Token price from top market (rank 1)

Prices WETH from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Base-Token-price-from-top-market-rank-1)

#### Get Multiple Token Prices — historical (beyond 30 days)

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Multiple Token Prices — historical (beyond 30 days)](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime_1)

#### Get ATH Price of a token — historical (beyond 30 days)

Retrieves the all-time high (ATH) price in USD for a specified token contract. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get ATH Price of a token — historical (beyond 30 days)](https://ide.bitquery.io/ATH-of-base-token)

#### Get OHLCV by Pair Address — historical (beyond 30 days)

Get the OHLCV candle stick by using pair address. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get OHLCV by Pair Address — historical (beyond 30 days)](https://ide.bitquery.io/OHLC--base)

#### Get Price Change 5min, 1h, 6h and 24h of a specific token — historical (beyond 30 days)

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the Base network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_6)

#### Top 10 Base Tokens by Price Change in last 1h — historical (beyond 30 days)

This query gets you top 10 Base Tokens by Price Change in last 1h. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 Base Tokens by Price Change in last 1h — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-base-tokens-by-price-change-in-last-1-hr_1)

#### OHLC-of-AERO-Coin — historical (beyond 30 days)

OHLC-of-AERO-Coin. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [OHLC-of-AERO-Coin — historical (beyond 30 days)](https://ide.bitquery.io/OHLC-of-AERO-Coin_1)

#### Price change 5min, 1hr, 6hr, 24h precentage of a specific token — historical (beyond 30 days)

Price change 5min, 1hr, 6hr, 24h precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price change 5min, 1hr, 6hr, 24h precentage of a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-24h-precentage-of-a-specific-token)

#### Top 10 base tokens by price change in last 1 hr — historical (beyond 30 days)

Top 10 base tokens by price change in last 1 hr. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 base tokens by price change in last 1 hr — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-base-tokens-by-price-change-in-last-1-hr)

### Supply & Market Cap

#### Top Tokens by Market Cap on Base

This query ranks Base tokens by `Supply.MarketCap`. It uses roughly the last 24 hours (`since_relative: { hours_ago: 24 }`), 1-second intervals, at least $1,000 USD volume, `limitBy` one row per `Token_Id`, and up to 50 tokens.

▶️ [Top Tokens by Market Cap on Base](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Base)

#### Bankr token latest marketcap OHLC

Bankr token latest marketcap OHLC. Uses the `Tokens` cube.

▶️ [Bankr token latest marketcap OHLC](https://ide.bitquery.io/Bankr-token-latest-marketcap-OHLC)

#### Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific token. This query provides on-chain market cap data.

▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_5)

#### Total supply of a AERO on Base

Total supply of a AERO on Base. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Total supply of a AERO on Base](https://ide.bitquery.io/Total-supply-of-a-AERO-on-Base)

#### Total Supply and onchain Marketcap of a specific token base

This API gives you latest Supply and Marketcap of a token on Base. Try it out.

▶️ [Total Supply and onchain Marketcap of a specific token base](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-base)

### Liquidity & Pools

#### Latest Liquidity of Base Pool

Get the latest liquidity of an Base DEX pool (e.g., Uniswap v3 pool).

▶️ [Latest Liquidity of Base Pool](https://ide.bitquery.io/latest-liquidity-of-a-Base-pool_2)

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on Base. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_7)

#### Latest Liquidity Changes of a Specific Pool

Retrieves the latest liquidity events for a specific DEX pool on Base. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_4)

#### Latest Liquidity Pools on Aerodome

Track newly created liquidity pools on Aerodrome Finance in real-time. Discover fresh trading pairs and potential liquidity provision opportunities as pools are created.

▶️ [Latest Liquidity Pools on Aerodome](https://ide.bitquery.io/Latest-Liquidity-Pools-on-Aerodome)

#### Top liquidity pools of cbBTC

This query separates results by whether cbBTC is listed as the first token (`CurrencyA`) or the second token (`CurrencyB`) in the DEX pool, returning the 10 pools with the highest liquidity for each category.

▶️ [Top liquidity pools of cbBTC](https://ide.bitquery.io/top-liquidity-pools-of-cbBTC)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.

▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_8)

#### Latest gauge vaults claimRewards transactions

Track when stakers claim accumulated AERO emissions from gauges. Use this to measure realized rewards and active participation across gauge vaults. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Gauge Implementation` contract.

▶️ [Latest gauge vaults claimRewards transactions](https://ide.bitquery.io/latest-gauge-vaults-claimRewards-transactions)

#### Latest gauge vaults deposits transactions

Monitor LP staking into gauge vaults. This shows recent `Deposit` events to a gauge contract, helping you track which pools are attracting liquidity ahead of weekly emissions.

▶️ [Latest gauge vaults deposits transactions](https://ide.bitquery.io/latest-gauge-vaults-deposits-transactions)

#### Latest gauge vaults withdraw transactions

Observe LP exits from gauge vaults via `Withdraw` events. This helps you detect liquidity outflows and shifts in staking positions across pools. `0xf5601f95708256a118ef5971820327f362442d2d` is the `Aerodrome : Gauge Implementation` contract.

▶️ [Latest gauge vaults withdraw transactions](https://ide.bitquery.io/latest-gauge-vaults-withdraw-transactions_1)

### Events & Calls

#### Get Latest Calls

Get Latest Calls. Uses the `Calls` cube.

▶️ [Get Latest Calls](https://ide.bitquery.io/Recent-Calls-on-base_1)

#### Get Latest Events

Get Latest Events. Uses the `Events` cube.

▶️ [Get Latest Events](https://ide.bitquery.io/Recents-Events-and-Logs-on-Base)

#### Latest Bankr launches Doppler Airlock Base

Every Bankr launch emits a `Create(address,address,address,address)` event on the Airlock contract. This query returns the most recent launches with the new token address and deployer.

▶️ [Latest Bankr launches Doppler Airlock Base](https://ide.bitquery.io/Latest-Bankr-launches-Doppler-Airlock-Base)

#### All bankers tokens created by a deployer

Filter `Create` events on the Airlock by `Transaction.From` to list every Bankr token launched by a specific wallet. Replace the deployer address with the wallet you want to track.

▶️ [All bankers tokens created by a deployer](https://ide.bitquery.io/All-bankers-tokens-created-by-a-deployer)

#### Ape store buys from a wallet

Ape store buys from a wallet. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape store buys from a wallet](https://ide.bitquery.io/ape-store-buys-from-a-wallet)

#### Ape store token event

Firstly, we can find the smart contract address of the APE Store using.

▶️ [Ape store token event](https://ide.bitquery.io/ape-store-token-event_1)

#### Ape-store-buys

Ape-store-buys. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape-store-buys](https://ide.bitquery.io/ape-store-buys_1)

#### Base jump token event

Firstly, we can find the smart contract address of the Base Jump using.

▶️ [Base jump token event](https://ide.bitquery.io/base-jump-token-event)

#### Base-jump-buys

Base-jump-buys. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Base-jump-buys](https://ide.bitquery.io/base-jump-buys)

#### Latest Coin on Base Coin

In the recent times, base network has seen rise of many Memecoins and token based ecosystems. In this guide, we will see some queries that could provide beneficial information about these coins, for people to take informed investment decisions.

▶️ [Latest Coin on Base Coin](https://ide.bitquery.io/Latest-Coin-on-Base-Coin_3)

### Blocks & Validators

#### Aggregate Self Destruct Statistics base

Calculate total ETH destroyed or received from self-destructs using aggregation functions.

▶️ [Aggregate Self Destruct Statistics base](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-base)

#### Self Destruct Balance Decrease API base

Monitor contract balance decrease when contracts are self-destructing.

▶️ [Self Destruct Balance Decrease API base](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API-base)

#### Self Destruct Balance Increase API base

Monitor contract balance increase when contracts are self-destructing.

▶️ [Self Destruct Balance Increase API base](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API-base)

### Uniswap

#### Uniswap Trades Stream

This subscription returns the real-time trades happening on Uniswap. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Uniswap Trades Stream](https://ide.bitquery.io/Realtime-Uniswap-v1-Uniswap-v2-Uniswap-V3-Trades_1)

#### Get metadata for base uniswap token

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`.

▶️ [Get metadata for base uniswap token](https://ide.bitquery.io/get-metadata-for-base-uniswap-token)

#### Latest slippage of a pool on Uniswap v3

Latest slippage of a pool on Uniswap v3. Change the token address in the `where` clause to use it.

▶️ [Latest slippage of a pool on Uniswap v3](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3)

#### OHLC on BASE Uniswap v3

Retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval.

▶️ [OHLC on BASE Uniswap v3](https://ide.bitquery.io/OHLC-on-BASE-Uniswap-v3)

#### Top bought tokens on uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top bought tokens on uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-uniswap-v3)

#### Top sold tokens on uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top sold tokens on uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-uniswap-v3)

#### Top traders of a token on uniswapv3

Will fetch top traders of a token for the selected network.

▶️ [Top traders of a token on uniswapv3](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3_4)

#### Trade volume base uniswapv3

Fetches the traded volume, buy volume and sell volume of a token `0x22af33fe49fd1fa80c7149773dde5890d3c76f3b`.

▶️ [Trade volume base uniswapv3](https://ide.bitquery.io/trade_volume_base_uniswapv3)

#### Uniswap v3 trades

Below query will subscribe you to the latest DEX Trades on Uniswap v3.

▶️ [Uniswap v3 trades](https://ide.bitquery.io/uniswap-v3-trades_2)

#### Virtual pool addresses for a token on uniswap v4 base

Virtual pool addresses for a token on uniswap v4 base. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Virtual pool addresses for a token on uniswap v4 base](https://ide.bitquery.io/virtual-pool-addresses-for-a-token-on-uniswap-v4-base)

### PancakeSwap

#### Get Latest Price of a token on PancakeSwap Infinity

Below query will get you Latest Price of a token on PancakeSwap Infinity.

▶️ [Get Latest Price of a token on PancakeSwap Infinity](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity)

#### Pancakeswap infinity trades

Below query will subscribe you to the latest DEX Trades on PancakeSwap Infinity.

▶️ [Pancakeswap infinity trades](https://ide.bitquery.io/pancakeswap-infinity-trades)

#### Top bought tokens on pancakeswap_infinity

Will fetch the top bought tokens on PancakeSwap Infinity.

▶️ [Top bought tokens on pancakeswap_infinity](https://ide.bitquery.io/top-bought-tokens-on-pancakeswap_infinity)

#### Top sold tokens on pancake infinty

Will fetch the top bought tokens on PancakeSwap Infinity.

▶️ [Top sold tokens on pancake infinty](https://ide.bitquery.io/top-sold-tokens-on-pancake-infinty)

#### Get metadata for base pancakeswap infnity token

Use the below query to get Token's metadata like `Name`, `symbol`, `SmartContract Address`, `Decimals`.

▶️ [Get metadata for base pancakeswap infnity token](https://ide.bitquery.io/get-metadata-for-base-pancakeswap-infnity-token)

#### OHLC on BASE pancakeswap infinity

Retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on PancakeSwap Infinity over a defined time period and interval.

▶️ [OHLC on BASE pancakeswap infinity](https://ide.bitquery.io/OHLC-on-BASE-pancakeswap-infinity)

#### Top traders of a token on pancakeswap

Will fetch top traders of a token on PancakeSwap Infinity for the selected network.

▶️ [Top traders of a token on pancakeswap](https://ide.bitquery.io/top-traders-of-a-token-on-pancakeswap)

#### Trade volume base pancakeswap infinity

Fetches the traded volume, buy volume and sell volume of a token `0x22af33fe49fd1fa80c7149773dde5890d3c76f3b` on PancakeSwap Infinity.

▶️ [Trade volume base pancakeswap infinity](https://ide.bitquery.io/trade_volume_base_pancakeswap_infinity)

### Aerodrome

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge claimRewards Transactions

See reward claims for a particular gauge pool to quantify realized emissions by its stakers over time. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge claimRewards Transactions](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-claimRewards-Transactions)

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge deposits

View deposit activity for a specific gauge pool to understand where LPs are allocating capital and how staking momentum evolves. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge deposits](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-deposits)

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge withdraw transactions

Filter withdraw activity for a single gauge pool. Useful for monitoring liquidity changes and unstaking patterns of a targeted pool. `0x5d05ef25a5f933271e1f0fdc02dc3eab6a4ea687` is the `Aerodrome Finance CL100 WETHVVV Pool Gauge` contract.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge withdraw transactions](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-withdraw-transactions_1)

## Arbitrum

### Trades

#### Swap Events Arbitrum

Returns the 10 most recent `swap` events on the Arbitrum network. We get this by using the signature hash `c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67` for the swap event.

▶️ [Swap Events Arbitrum](https://ide.bitquery.io/Swap-Events-Arbitrum)

#### Pair last trades

Retrieves all DEX trades on the arbitrum where the Arbitrum currency is `ArbitrumCurrency` and the quote currency is `quoteCurrency` that occurred between the specified dates. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Pair last trades](https://ide.bitquery.io/Pair-last-trades_2)

#### Top Sold Tokens on Arbitrum

Top Sold Tokens on Arbitrum. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top Sold Tokens on Arbitrum](https://ide.bitquery.io/Top-Sold-Tokens-on-Arbitrum)

#### Top bought tokens on Arbitrum

Top bought tokens on Arbitrum. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top bought tokens on Arbitrum](https://ide.bitquery.io/top-bought-tokens-on-Arbitrum)

#### Top traders for a token on Arbitrum

Top traders for a token on Arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top traders for a token on Arbitrum](https://ide.bitquery.io/top-traders-for-a-token-on-Arbitrum_3)

#### Trending token pairs on Arbitrum

Crypto Trades API: one row per swap, with USD and supply. Filter `Pair.Market.Network: Arbitrum`. When to use this vs chain DEX APIs. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Trending token pairs on Arbitrum](https://ide.bitquery.io/trending-token-pairs-on-Arbitrum)

### Balances & Holders

#### Current balance of an address

Every token balance held by one Arbitrum address. Balances are cumulative, so this reads the whole history — replace the address to use it.

▶️ [Current balance of an address](https://ide.bitquery.io/Arbitrum-Current-balance-of-an-address)

#### Arbitrum Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

▶️ [Arbitrum Balance of an Address](https://ide.bitquery.io/Arbitrum-Balance-of-an-Address)

#### Arbitrum balances by date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

▶️ [Arbitrum balances by date](https://ide.bitquery.io/arbitrum-balances-by-date)

#### Arbitrum balances history

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

▶️ [Arbitrum balances history](https://ide.bitquery.io/arbitrum-balances-history)

#### Arbitrum balances specific token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native ETH on Arbitrum, or the ERC-20 contract address for a token.

▶️ [Arbitrum balances specific token](https://ide.bitquery.io/arbitrum-balances-specific-token)

#### Arbitrum native balances address

Returns the native ETH balance for a wallet on Arbitrum (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

▶️ [Arbitrum native balances address](https://ide.bitquery.io/arbitrum-native-balances-address)

#### Token holder snapshot arbitrum

The number of unique holders, token supply, and Gini coefficient for the balance amount before a specific timestamp can be derived using the query below. These stats provide a useful holder snapshot for any given time.

▶️ [Token holder snapshot arbitrum](https://ide.bitquery.io/token-holder-snapshot-arbitrum)

### Price & OHLC

#### Token price from top market (rank 1)

Prices WETH from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Arbitrum-Token-price-from-top-market-rank-1)

#### Ohlc for a pair on Arbitrum — historical (beyond 30 days)

Ohlc for a pair on Arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Ohlc for a pair on Arbitrum — historical (beyond 30 days)](https://ide.bitquery.io/ohlc-for-a-pair-on-Arbitrum_1)

#### Price change 5min, 1hr, 6hr, 24hr precentage of a specific token — historical (beyond 30 days)

Price change 5min, 1hr, 6hr, 24hr precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Price change 5min, 1hr, 6hr, 24hr precentage of a specific token — historical (beyond 30 days)](https://ide.bitquery.io/Price-change-5min-1hr-6hr-24hr-precentage-of-a-specific-token_1)

#### Top 10 arb tokens by price change in last 1 hr — historical (beyond 30 days)

Top 10 arb tokens by price change in last 1 hr. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top 10 arb tokens by price change in last 1 hr — historical (beyond 30 days)](https://ide.bitquery.io/Top-10-arb-tokens-by-price-change-in-last-1-hr)

### Supply & Market Cap

#### Top Tokens by Market Cap on Arbitrum

This query ranks Arbitrum tokens by `Supply.MarketCap`. It uses roughly the last 24 hours (`since_relative: { hours_ago: 24 }`), 1-second intervals, at least $1,000 USD volume, `limitBy` one row per `Token_Id`, and up to 50 tokens.

▶️ [Top Tokens by Market Cap on Arbitrum](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Arbitrum)

### Liquidity & Pools

#### Latest liquidity changes of a specific pool

Retrieves the latest liquidity events for a specific DEX pool on Arbitrum. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest liquidity changes of a specific pool](https://ide.bitquery.io/latest-liquidity-changes-of-a-specific-pool)

### Transactions

#### Latest Transactions

Retrieves the latest 10 transactions on the Arbitrum network.

▶️ [Latest Transactions](https://ide.bitquery.io/Latest-Transactions_3)

#### Transaction Call Trace Arbitrum

This query gets the transaction call trace for an Arbitrum transaction. The `Calls` API in the query returns a list of all calls made by the transaction.

▶️ [Transaction Call Trace Arbitrum](https://ide.bitquery.io/Transaction-Call-Trace-Arbitrum)

### Events & Calls

#### Latest GMX Events

The following query retrieves the latest liquidated positions on the GMX DEX, providing information on the account, collateral token, index token, position, reserve amount, realised PnL, and mark price.

▶️ [Latest GMX Events](https://ide.bitquery.io/latest-GMX-Events)

#### Latest vGLP Withdraw Events

The following query retrieves the latest vGLP withdrawals on the Arbitrum network.

▶️ [Latest vGLP Withdraw Events](https://ide.bitquery.io/latest-vGLP-Withdraw-Events)

#### Latest deposits on Across Bridge

SpokePool events in Across Protocol can be used to monitor the status of bridge transfers effectively. Below are queries that retrieve the latest deposits and transfers related to the Arbitrum SpokePool.

▶️ [Latest deposits on Across Bridge](https://ide.bitquery.io/Latest-deposits-on-Across-Bridge)

#### Latest vGLP Deposit Events

The following query retrieves the latest vGLP deposits on the Arbitrum network.

▶️ [Latest vGLP Deposit Events](https://ide.bitquery.io/latest-vGLP-Deposit-Events)

### Blocks & Validators

#### Latest Arbitrum blocks

Retrieves the latest 10 blocks on the Arbitrum network.

▶️ [Latest Arbitrum blocks](https://ide.bitquery.io/Latest-Arbitrum-blocks)

### Uniswap

#### Get virtual pool address for a token on uniswap v4 arbitrum

Get virtual pool address for a token on uniswap v4 arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get virtual pool address for a token on uniswap v4 arbitrum](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-arbitrum)

#### Latest Trades for a currency pair on arbitrum

Latest Trades for a currency pair on arbitrum. Uses the `DEXTrades` cube.

▶️ [Latest Trades for a currency pair on arbitrum](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-arbitrum)

#### Top buyers of a currency on uniswap v4 arbitrum

Top buyers of a currency on uniswap v4 arbitrum. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a currency on uniswap v4 arbitrum](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-arbitrum)

#### Top sellers of a token on uniswap v4 arbitrum

Top sellers of a token on uniswap v4 arbitrum. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top sellers of a token on uniswap v4 arbitrum](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-arbitrum)

#### Trade stats for a token pair on uniswap v4 arbitrum

Trade stats for a token pair on uniswap v4 arbitrum. Uses the `DEXTradeByTokens` cube.

▶️ [Trade stats for a token pair on uniswap v4 arbitrum](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-arbitrum)

## Optimism

### Trades

#### Top tokens on optimism

Top tokens on optimism. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top tokens on optimism](https://ide.bitquery.io/top-tokens-on-optimism)

#### Top traders for wld usdc pair

You can checkout a completed product using this info on DEXRabbit. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top traders for wld usdc pair](https://ide.bitquery.io/top-traders-for-wld-usdc-pair)

#### Top traders on optimism

Top traders on optimism. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top traders on optimism](https://ide.bitquery.io/top-traders-on-optimism)

### Balances & Holders

#### Current balance of an address

Every token balance held by one Optimism address. Balances are cumulative, so this reads the whole history — replace the address to use it.

▶️ [Current balance of an address](https://ide.bitquery.io/Optimism-Current-balance-of-an-address)

#### Optimism Balance of an Address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

▶️ [Optimism Balance of an Address](https://ide.bitquery.io/Optimism-Balance-of-an-Address)

#### Optimism balances by date

Use `Block.Date.till` for a point-in-time snapshot. Use `dataset: archive` for historical dates and addresses not recently active.

▶️ [Optimism balances by date](https://ide.bitquery.io/optimism-balances-by-date)

#### Optimism balances history address

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

▶️ [Optimism balances history address](https://ide.bitquery.io/optimism-balances-history-address)

#### Optimism balances specific token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native ETH on Optimism, or the ERC-20 contract address for a token.

▶️ [Optimism balances specific token](https://ide.bitquery.io/optimism-balances-specific-token)

#### Optimism native balances address

Returns the native ETH balance for a wallet on Optimism (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

▶️ [Optimism native balances address](https://ide.bitquery.io/optimism-native-balances-address)

#### Token holder snapshot optimism

The number of unique holders, token supply, and Gini coefficient for the balance amount before a specific timestamp can be derived using the query below. These stats provide a useful holder snapshot for any given time.

▶️ [Token holder snapshot optimism](https://ide.bitquery.io/token-holder-snapshot-optimism)

### Uniswap

#### Latest Trades for a currency pair on optimism

Latest Trades for a currency pair on optimism. Uses the `DEXTrades` cube.

▶️ [Latest Trades for a currency pair on optimism](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-optimism)

#### Top buyers of a currency on uniswap v4 optimism

Top buyers of a currency on uniswap v4 optimism. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a currency on uniswap v4 optimism](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-optimism)

#### Top sellers of a token on uniswap v4 pool optimism

Top sellers of a token on uniswap v4 pool optimism. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top sellers of a token on uniswap v4 pool optimism](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-optimism)

#### Trade stats for a token pair on uniswap v4 optimism

Trade stats for a token pair on uniswap v4 optimism. Uses the `DEXTradeByTokens` cube.

▶️ [Trade stats for a token pair on uniswap v4 optimism](https://ide.bitquery.io/trade-stats-for-a-token-pair-on-uniswap-v4-optimism)

### Price & OHLC

#### Token price from top market (rank 1)

Prices WETH from its single top market rather than blending every pool — the recommended way to price one specific token. Replace `token` in the Variables pane, lowercase.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Optimism-Token-price-from-top-market-rank-1)

## Polygon

### Trades

#### Top Traders by PnL of a specific polygon pool

Rank traders by `PnL` on one pool: filter `Pair.Market.Address`, last 30 minutes, `limit: 10`, and `orderBy` `PnL` descending. Useful for leaderboards, smart-money screens, and pool-specific trader analytics. Trading cube — real-time and roughly the last 30 days. For anything older, use the DEXTradeByTokens entries at the bottom of this section.

▶️ [Top Traders by PnL of a specific polygon pool](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-polygon-pool)

#### Top traders of a token on matic — historical (beyond 30 days)

This query ranks traders of one token by volume, splitting bought and sold amounts and totalling volume in native and USD terms. `since_relative` keeps the window rolling. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top traders of a token on matic — historical (beyond 30 days)](https://ide.bitquery.io/top-traders-of-a-token-on-matic_1)

### Transfers

#### Check if an address interacted with polymarket ever

This is cheaper than scanning all `PredictionTrades` when you only need a yes/no signal. Narrow the pattern (e.g. also filter by counterparties) if you need stronger guarantees.

▶️ [Check if an address interacted with polymarket ever](https://ide.bitquery.io/check-if-an-address-interacted-with-polymarket-ever)

### Balances & Holders

#### Current balance of an address

Every token balance held by one Polygon address. Balances are cumulative, so this reads the whole history — replace the address to use it.

▶️ [Current balance of an address](https://ide.bitquery.io/Polygon-Current-balance-of-an-address)

#### Balance of an address

Returns all token balances for a wallet on Polygon using `EVM.Balances` with `network: matic` and `dataset: combined`. See [Polygon Address Balance API](/docs/blockchain/Matic/matic-balance-api/#balance-of-an-address).

▶️ [Balance of an address](https://ide.bitquery.io/matic-balances-address_1)

#### Matic historical balances address

Returns all token balances for a wallet on Polygon using `EVM.Balances` with `network: matic` and `dataset: combined` until a particular period. For this example we will find the Balnce of the address one month ago.

▶️ [Matic historical balances address](https://ide.bitquery.io/matic-historical-balances-address_1)

#### Matic balances address

Returns token balances for a wallet address. Use `Amount(selectWhere: { gt: "0" })` to exclude zero balances.

▶️ [Matic balances address](https://ide.bitquery.io/matic-balances-address)

#### Matic balances history

Returns balance snapshots over time for an address. Use `dataset: archive`. Order by `Block_Date` descending and use `limit` to paginate. Add `Currency.SmartContract` under `Currency` to filter by a specific token.

▶️ [Matic balances history](https://ide.bitquery.io/matic-balances-history)

#### Matic balances specific token

Add a `Currency.SmartContract` filter. Always use the contract address, not the token name. Use `0x` for native MATIC on Polygon, or the ERC-20 contract address for a token.

▶️ [Matic balances specific token](https://ide.bitquery.io/matic-balances-specific-token)

#### Matic native balances address

Returns the native MATIC balance for a wallet (not ERC-20 tokens). Filter with `Currency: { Native: true }` instead of a token contract address.

▶️ [Matic native balances address](https://ide.bitquery.io/matic-native-balances-address)

#### Matic wallet balance token at date

Get a wallet's balance for a specific token with `Balance.Address` and `Currency.SmartContract`. This example uses native MATIC (`SmartContract: "0x"`) with `dataset: combined`.

▶️ [Matic wallet balance token at date](https://ide.bitquery.io/matic-wallet-balance-token-at-date)

#### Token holder snapshot matic

The number of unique holders, token supply, and Gini coefficient for the balance amount before a specific timestamp can be derived using the query below. These stats provide a useful holder snapshot for any given time.

▶️ [Token holder snapshot matic](https://ide.bitquery.io/token-holder-snapshot-matic)

### Supply & Market Cap

#### Top Tokens by Market Cap on Polygon

This query ranks Polygon tokens by `Supply.MarketCap`. Set `Token.Network` to Matic (Polygon’s label in the Trading API). It uses roughly the last 24 hours, 1-second intervals, at least $1,000 USD volume, `limitBy` one row per `Token_Id`, and up to 50 tokens.

▶️ [Top Tokens by Market Cap on Polygon](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Polygon_1)

### Liquidity & Pools

#### Latest Liquidity Changes of a Specific Pool

Retrieves the latest liquidity events for a specific DEX pool on Matic. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_6)

### Uniswap

#### Get virtual pool address for a token on uniswap v4 matic

Get virtual pool address for a token on uniswap v4 matic. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get virtual pool address for a token on uniswap v4 matic](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-matic)

#### OHLCV on MATIC uniswap v3

Retrieves the Open, High, Low, and Close (OHLC) prices in USD for a specific token traded on Uniswap v3 over a defined time period and interval.

▶️ [OHLCV on MATIC uniswap v3](https://ide.bitquery.io/OHLCV-on-MATIC-uniswap-v3)

#### Top bought tokens on matic uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top bought tokens on matic uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-matic-uniswap-v3_4)

#### Top sold tokens on matic uniswap v3

Will fetch the top bought tokens on uniswap v3.

▶️ [Top sold tokens on matic uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-matic-uniswap-v3)

#### Top traders of a token on uniswapv3 matic

Will fetch top traders of a token for the selected network.

▶️ [Top traders of a token on uniswapv3 matic](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-matic)

#### Trade volume matic uniswapv3

Fetches the traded volume, buy volume and sell volume of a token `0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270`.

▶️ [Trade volume matic uniswapv3](https://ide.bitquery.io/trade_volume_matic_uniswapv3)

#### Uniswap v3 trades matic

Below query will subscribe you to the latest DEX Trades on MATIC Uniswap v3.

▶️ [Uniswap v3 trades matic](https://ide.bitquery.io/uniswap-v3-trades-matic)

#### Latest Trades for a currency pair on matic

Latest Trades for a currency pair on matic. Uses the `DEXTrades` cube.

▶️ [Latest Trades for a currency pair on matic](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-matic_1)

#### Top buyers of a currency on uniswap v4 matic

Top buyers of a currency on uniswap v4 matic. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a currency on uniswap v4 matic](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-matic)

#### Top sellers of a token on uniswap v4 pool matic

Top sellers of a token on uniswap v4 pool matic. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top sellers of a token on uniswap v4 pool matic](https://ide.bitquery.io/top-sellers-of-a-token-on-uniswap-v4-pool-matic)

## Avalanche

### Trades

#### Latest DEX trades

The most recent DEX trades on Avalanche, with both sides of the pair, the venue and USD value. Add a `baseCurrency` filter to scope it to one token.

▶️ [Latest DEX trades](https://ide.bitquery.io/Avalanche-Latest-DEX-trades)

#### Top DEXs by trade count

Ranks the DEXs on Avalanche by number of trades, so you can see which venues actually carry volume.

▶️ [Top DEXs by trade count](https://ide.bitquery.io/Avalanche-Top-DEXs-by-trade-count)

### Transfers

#### Latest token transfers

Recent token transfers on Avalanche. Add a `currency` filter to follow one token, or a sender/receiver filter to follow one wallet.

▶️ [Latest token transfers](https://ide.bitquery.io/Avalanche-Latest-token-transfers)

### Balances & Holders

#### Balance of an address at a past date

What one Avalanche address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Avalanche-Balance-of-an-address-at-a-past-date)

#### Balances of an address

Native and token balances held by one Avalanche address. Replace the address to use it.

▶️ [Balances of an address](https://ide.bitquery.io/Avalanche-Balances-of-an-address)

### Transactions

#### Latest transactions

Recent Avalanche transactions with value, gas and sender/receiver. Move `since` in the Variables pane to change the window — a wide window on a busy chain will exceed the query memory limit.

▶️ [Latest transactions](https://ide.bitquery.io/Avalanche-Latest-transactions)

### Events & Calls

#### Latest smart contract events

Decoded event logs on Avalanche. Filter by `smartContractAddress` to watch a single contract.

▶️ [Latest smart contract events](https://ide.bitquery.io/Avalanche-Latest-smart-contract-events)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Avalanche, with height, time, gas used and transaction count.

▶️ [Latest blocks](https://ide.bitquery.io/Avalanche-Latest-blocks_1)

## Celo

### Transfers

#### Latest token transfers

Recent token transfers on Celo. Add a `currency` filter to follow one token, or a sender/receiver filter to follow one wallet.

▶️ [Latest token transfers](https://ide.bitquery.io/Celo-Latest-token-transfers)

### Balances & Holders

#### Balance of an address at a past date

What one Celo address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Celo-Balance-of-an-address-at-a-past-date)

#### Balances of an address

Native and token balances held by one Celo address. Replace the address to use it.

▶️ [Balances of an address](https://ide.bitquery.io/Celo-Balances-of-an-address)

### Transactions

#### Latest transactions

Recent Celo transactions with value, gas and sender/receiver. Move `since` in the Variables pane to change the window — a wide window on a busy chain will exceed the query memory limit.

▶️ [Latest transactions](https://ide.bitquery.io/Celo-Latest-transactions)

### Events & Calls

#### Latest smart contract events

Decoded event logs on Celo. Filter by `smartContractAddress` to watch a single contract.

▶️ [Latest smart contract events](https://ide.bitquery.io/Celo-Latest-smart-contract-events)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Celo, with height, time, gas used and transaction count.

▶️ [Latest blocks](https://ide.bitquery.io/Celo-Latest-blocks)

## Cronos

### Transfers

#### Latest token transfers

Recent token transfers on Cronos. Add a `currency` filter to follow one token, or a sender/receiver filter to follow one wallet.

▶️ [Latest token transfers](https://ide.bitquery.io/Cronos-Latest-token-transfers)

### Balances & Holders

#### Balance of an address at a past date

What one Cronos address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Cronos-Balance-of-an-address-at-a-past-date)

#### Balances of an address

Native and token balances held by one Cronos address. Replace the address to use it.

▶️ [Balances of an address](https://ide.bitquery.io/Cronos-Balances-of-an-address)

### Transactions

#### Latest transactions

Recent Cronos transactions with value, gas and sender/receiver. Move `since` in the Variables pane to change the window — a wide window on a busy chain will exceed the query memory limit.

▶️ [Latest transactions](https://ide.bitquery.io/Cronos-Latest-transactions)

### Events & Calls

#### Latest smart contract events

Decoded event logs on Cronos. Filter by `smartContractAddress` to watch a single contract.

▶️ [Latest smart contract events](https://ide.bitquery.io/Cronos-Latest-smart-contract-events)

### Blocks & Validators

#### Latest blocks

The most recent Cronos blocks, with gas used and transaction count. Move `since` in the Variables pane.

▶️ [Latest blocks](https://ide.bitquery.io/Cronos-Latest-blocks)

## Klaytn

### Trades

#### Latest DEX trades

The most recent DEX trades on Klaytn, with both sides of the pair, the venue and USD value. Add a `baseCurrency` filter to scope it to one token.

▶️ [Latest DEX trades](https://ide.bitquery.io/Klaytn-Latest-DEX-trades)

#### Top DEXs by trade count

Ranks the DEXs on Klaytn by number of trades, so you can see which venues actually carry volume.

▶️ [Top DEXs by trade count](https://ide.bitquery.io/Klaytn-Top-DEXs-by-trade-count)

### Transfers

#### Latest token transfers

Recent token transfers on Klaytn. Add a `currency` filter to follow one token, or a sender/receiver filter to follow one wallet.

▶️ [Latest token transfers](https://ide.bitquery.io/Klaytn-Latest-token-transfers)

### Balances & Holders

#### Balance of an address at a past date

What one Klaytn address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Klaytn-Balance-of-an-address-at-a-past-date)

#### Balances of an address

Native and token balances held by one Klaytn address. Replace the address to use it.

▶️ [Balances of an address](https://ide.bitquery.io/Klaytn-Balances-of-an-address)

### Transactions

#### Latest transactions

Recent Klaytn transactions with value, gas and sender/receiver. Move `since` in the Variables pane to change the window — a wide window on a busy chain will exceed the query memory limit.

▶️ [Latest transactions](https://ide.bitquery.io/Klaytn-Latest-transactions)

### Events & Calls

#### Latest smart contract events

Decoded event logs on Klaytn. Filter by `smartContractAddress` to watch a single contract.

▶️ [Latest smart contract events](https://ide.bitquery.io/Klaytn-Latest-smart-contract-events)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Klaytn, with height, time, gas used and transaction count.

▶️ [Latest blocks](https://ide.bitquery.io/Klaytn-Latest-blocks)

## Litecoin

### Transfers

#### Largest transfers in the last 24 hours

The biggest Litecoin outputs of the past day, ranked by value — a quick way to spot whale movement. Change the `since` date to widen the window.

▶️ [Largest transfers in the last 24 hours](https://ide.bitquery.io/Litecoin-Largest-transfers-in-the-last-24-hours)

### Balances & Holders

#### Balance of an address at a past date

What one Litecoin address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Litecoin-Balance-of-an-address-at-a-past-date)

#### Total received by an address

Sums everything an address has ever received on Litecoin, with a first-and-last-seen window. Replace the address to use it.

▶️ [Total received by an address](https://ide.bitquery.io/Litecoin-Total-received-by-an-address)

#### Total sent from an address

Sums everything an address has ever spent on Litecoin. Subtract this from total received to get the current balance.

▶️ [Total sent from an address](https://ide.bitquery.io/Litecoin-Total-sent-from-an-address)

#### Address activity summary

First seen, last seen, and lifetime in/out totals for one Litecoin address in a single request.

▶️ [Address activity summary](https://ide.bitquery.io/Litecoin-Address-activity-summary)

### Transactions

#### Latest transactions

The most recent transactions on Litecoin, with value, fee and input/output counts. Raise the limit to page further back.

▶️ [Latest transactions](https://ide.bitquery.io/Litecoin-Latest-transactions)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Litecoin, with height, time, transaction count and size.

▶️ [Latest blocks](https://ide.bitquery.io/Litecoin-Latest-blocks)

## Bitcoin Cash

### Transfers

#### Largest transfers in the last 24 hours

The biggest Bitcoin Cash outputs of the past day, ranked by value — a quick way to spot whale movement. Change the `since` date to widen the window.

▶️ [Largest transfers in the last 24 hours](https://ide.bitquery.io/Bitcoin-Cash-Largest-transfers-in-the-last-24-hours)

### Balances & Holders

#### Balance of an address at a past date

What one Bitcoin Cash address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Bitcoin-Cash-Balance-of-an-address-at-a-past-date)

#### Total received by an address

Sums everything an address has ever received on Bitcoin Cash, with a first-and-last-seen window. Replace the address to use it.

▶️ [Total received by an address](https://ide.bitquery.io/Bitcoin-Cash-Total-received-by-an-address)

#### Total sent from an address

Sums everything an address has ever spent on Bitcoin Cash. Subtract this from total received to get the current balance.

▶️ [Total sent from an address](https://ide.bitquery.io/Bitcoin-Cash-Total-sent-from-an-address)

#### Address activity summary

First seen, last seen, and lifetime in/out totals for one Bitcoin Cash address in a single request.

▶️ [Address activity summary](https://ide.bitquery.io/Bitcoin-Cash-Address-activity-summary)

### Transactions

#### Latest transactions

The most recent transactions on Bitcoin Cash, with value, fee and input/output counts. Raise the limit to page further back.

▶️ [Latest transactions](https://ide.bitquery.io/Bitcoin-Cash-Latest-transactions)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Bitcoin Cash, with height, time, transaction count and size.

▶️ [Latest blocks](https://ide.bitquery.io/Bitcoin-Cash-Latest-blocks)

## Dogecoin

### Transfers

#### Largest transfers in the last 24 hours

The biggest Dogecoin outputs of the past day, ranked by value — a quick way to spot whale movement. Change the `since` date to widen the window.

▶️ [Largest transfers in the last 24 hours](https://ide.bitquery.io/Dogecoin-Largest-transfers-in-the-last-24-hours)

### Balances & Holders

#### Balance of an address at a past date

What one Dogecoin address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Dogecoin-Balance-of-an-address-at-a-past-date)

#### Total received by an address

Sums everything an address has ever received on Dogecoin, with a first-and-last-seen window. Replace the address to use it.

▶️ [Total received by an address](https://ide.bitquery.io/Dogecoin-Total-received-by-an-address)

#### Total sent from an address

Sums everything an address has ever spent on Dogecoin. Subtract this from total received to get the current balance.

▶️ [Total sent from an address](https://ide.bitquery.io/Dogecoin-Total-sent-from-an-address)

#### Address activity summary

First seen, last seen, and lifetime in/out totals for one Dogecoin address in a single request.

▶️ [Address activity summary](https://ide.bitquery.io/Dogecoin-Address-activity-summary)

### Transactions

#### Latest transactions

The most recent transactions on Dogecoin, with value, fee and input/output counts. Raise the limit to page further back.

▶️ [Latest transactions](https://ide.bitquery.io/Dogecoin-Latest-transactions)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Dogecoin, with height, time, transaction count and size.

▶️ [Latest blocks](https://ide.bitquery.io/Dogecoin-Latest-blocks)

## Dash

### Transfers

#### Largest transfers in the last 24 hours

The biggest Dash outputs of the past day, ranked by value — a quick way to spot whale movement. Change the `since` date to widen the window.

▶️ [Largest transfers in the last 24 hours](https://ide.bitquery.io/Dash-Largest-transfers-in-the-last-24-hours)

### Balances & Holders

#### Balance of an address at a past date

What one Dash address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Dash-Balance-of-an-address-at-a-past-date)

#### Total received by an address

Sums everything an address has ever received on Dash, with a first-and-last-seen window. Replace the address to use it.

▶️ [Total received by an address](https://ide.bitquery.io/Dash-Total-received-by-an-address)

#### Total sent from an address

Sums everything an address has ever spent on Dash. Subtract this from total received to get the current balance.

▶️ [Total sent from an address](https://ide.bitquery.io/Dash-Total-sent-from-an-address)

#### Address activity summary

First seen, last seen, and lifetime in/out totals for one Dash address in a single request.

▶️ [Address activity summary](https://ide.bitquery.io/Dash-Address-activity-summary)

### Transactions

#### Latest transactions

The most recent transactions on Dash, with value, fee and input/output counts. Raise the limit to page further back.

▶️ [Latest transactions](https://ide.bitquery.io/Dash-Latest-transactions)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Dash, with height, time, transaction count and size.

▶️ [Latest blocks](https://ide.bitquery.io/Dash-Latest-blocks)

## Zcash

### Transfers

#### Largest transfers in the last 24 hours

The biggest Zcash outputs of the past day, ranked by value — a quick way to spot whale movement. Change the `since` date to widen the window.

▶️ [Largest transfers in the last 24 hours](https://ide.bitquery.io/Zcash-Largest-transfers-in-the-last-24-hours)

### Balances & Holders

#### Balance of an address at a past date

What one Zcash address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Zcash-Balance-of-an-address-at-a-past-date)

#### Total received by an address

Sums everything an address has ever received on Zcash, with a first-and-last-seen window. Replace the address to use it.

▶️ [Total received by an address](https://ide.bitquery.io/Zcash-Total-received-by-an-address)

#### Total sent from an address

Sums everything an address has ever spent on Zcash. Subtract this from total received to get the current balance.

▶️ [Total sent from an address](https://ide.bitquery.io/Zcash-Total-sent-from-an-address)

#### Address activity summary

First seen, last seen, and lifetime in/out totals for one Zcash address in a single request.

▶️ [Address activity summary](https://ide.bitquery.io/Zcash-Address-activity-summary)

### Transactions

#### Latest transactions

The most recent transactions on Zcash, with value, fee and input/output counts. Raise the limit to page further back.

▶️ [Latest transactions](https://ide.bitquery.io/Zcash-Latest-transactions)

### Blocks & Validators

#### Latest blocks

The most recent blocks on Zcash, with height, time, transaction count and size.

▶️ [Latest blocks](https://ide.bitquery.io/Zcash-Latest-blocks)

## Cardano

### Trades

#### Cardano Price

This query returns the latest price of Cardano on Cardano Network.

▶️ [Cardano Price](https://ide.bitquery.io/latest-cardano-price)

### Transfers

#### Cardano User Transfers

This query returns the latest transfers for a useron Cardano network.

▶️ [Cardano User Transfers](https://ide.bitquery.io/cardano-transfers-of-a-wallet)

### Balances & Holders

#### Cardano Balance

This query returns the current balance of a user on Cardano network.

▶️ [Cardano Balance](https://ide.bitquery.io/cardano-address-balance_1)

## Ripple

### Trades

#### Ripple Token DEX Trades

This query returns the latest trades of a currency on the Ripple network.

▶️ [Ripple Token DEX Trades](https://ide.bitquery.io/trades-for-CNY-on-ripple)

#### Ripple Payments

This query returns the latest payments on Ripple network.

▶️ [Ripple Payments](https://ide.bitquery.io/Latest-payments-on-ripple-blockchain)

### Transfers

#### Ripple Historical Transfers

This query returns all the historical transfers done by a specific address on the Ripple network.

▶️ [Ripple Historical Transfers](https://ide.bitquery.io/All-historical-transfers-of-an-individual-address)

### Balances & Holders

#### Ripple Historical Balance

This query returns all historical balance of an address on Ripple network.

▶️ [Ripple Historical Balance](https://ide.bitquery.io/historical-balances-of-a-ripple-address)

### Transactions

#### Transaction Details using Hash

This query uses transaction hash and date range as filter to fetch tx details.

▶️ [Transaction Details using Hash](https://ide.bitquery.io/xrpl-search-tx-details)

## Stellar

### Trades

#### Latest DEX trades

Trades on the Stellar decentralised exchange, with both sides of the pair and the amounts.

▶️ [Latest DEX trades](https://ide.bitquery.io/Stellar-Latest-DEX-trades)

### Transfers

#### Latest payments

Stellar payment operations — who paid whom, in which asset, and how much.

▶️ [Latest payments](https://ide.bitquery.io/Stellar-Latest-payments)

### Balances & Holders

#### Balance of an address at a past date

What one Stellar address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Stellar-Balance-of-an-address-at-a-past-date)

#### Balances of an address

Every asset balance held by one Stellar account. Replace the address to use it.

▶️ [Balances of an address](https://ide.bitquery.io/Stellar-Balances-of-an-address)

### Liquidity & Pools

#### Liquidity pool trades

Swaps routed through Stellar liquidity pools, with the pool id and both legs.

▶️ [Liquidity pool trades](https://ide.bitquery.io/Stellar-Liquidity-pool-trades)

### Transactions

#### Latest transactions

Recent Stellar transactions with sender, fee and success flag. Move `since` in the Variables pane to change the window.

▶️ [Latest transactions](https://ide.bitquery.io/Stellar-Latest-transactions)

### Blocks & Validators

#### Latest ledgers

The most recent Stellar ledgers with close time, transaction count and fee pool.

▶️ [Latest ledgers](https://ide.bitquery.io/Stellar-Latest-ledgers)

## Algorand

### Transfers

#### All the transfers of an asset on Algorand Mainnet in a specific timeframe

Returns transfers for asset ID `31566704` between two dates, ordered by block height descending. Swap the `currency` filter for any ASA ID or ALGO.

▶️ [All the transfers of an asset on Algorand Mainnet in a specific timeframe](https://ide.bitquery.io/All-the-transfers-of-an-asset-on-Algorand-Mainnet-in-a-specific-timeframe)

#### Traansfers where a currency is sent from or sent to a particular address

Uses the `any` filter to match transfers where the address appears as either sender or receiver.

▶️ [Traansfers where a currency is sent from or sent to a particular address](https://ide.bitquery.io/traansfers-where-a-currency-is-sent-from-or-sent-to-a-particular-address)

### Price & OHLC

#### Get Count of Smart Contract Calls in Latest Block

Returns the count of unique smart contract calls in the most recent block after a given date.

▶️ [Get Count of Smart Contract Calls in Latest Block](https://ide.bitquery.io/Get-Count-of-Smart-Contract-Calls-in-Latest-Block_1)

### Transactions

#### All Transactions on Algorand

Paginated query for all transactions in a specific window.

▶️ [All Transactions on Algorand](https://ide.bitquery.io/All-Transactions-on-Algorand)

#### Daily Transaction Count for last 10 days

Returns the number of transactions per day over the last 10 days, ordered by date descending.

▶️ [Daily Transaction Count for last 10 days](https://ide.bitquery.io/Daily-Transaction-Count-for-last-10-days)

#### Daily Unique Txn Senders on algorand

Counts distinct transaction senders on a specific date.

▶️ [Daily Unique Txn Senders on algorand](https://ide.bitquery.io/Daily-Unique-Txn-Senders-on-algorand)

## Filecoin

### Transfers

#### Latest transfers

FIL value moving between addresses. Add a sender or receiver filter to follow one account.

▶️ [Latest transfers](https://ide.bitquery.io/Filecoin-Latest-transfers)

### Balances & Holders

#### Balance of an address at a past date

What one Filecoin address held as of a chosen date. Move the date in the Variables pane.

▶️ [Balance of an address at a past date](https://ide.bitquery.io/Filecoin-Balance-of-an-address-at-a-past-date)

#### Balance of an address

The FIL balance held by one Filecoin address. Replace the address to use it.

▶️ [Balance of an address](https://ide.bitquery.io/Filecoin-Balance-of-an-address)

### Transactions

#### Latest messages

Filecoin messages — the chain's transactions — with sender, receiver, value and method.

▶️ [Latest messages](https://ide.bitquery.io/Filecoin-Latest-messages)

### Blocks & Validators

#### Latest tipsets

The most recent Filecoin tipsets with height and time.

▶️ [Latest tipsets](https://ide.bitquery.io/Filecoin-Latest-tipsets)

## Trading API

### Trades

#### Average fee per trade, Total fees, total volume, trades count per DEX program

Average fee per trade, Total fees, total volume, trades count per DEX program. Uses the `Trades` cube.

▶️ [Average fee per trade, Total fees, total volume, trades count per DEX program](https://ide.bitquery.io/Average-fee-per-trade-Total-fees-total-volume-trades-count-per-DEX-program)

#### Last 10 WSOL USDC Token pair trades

Last 10 WSOL USDC Token pair trades. Uses the `Trades` cube.

▶️ [Last 10 WSOL USDC Token pair trades](https://ide.bitquery.io/Last-10-WSOL-USDC-Token-pair-trades)

#### Most active market pools by trades

Most active market pools by trades. Uses the `Trades` cube.

▶️ [Most active market pools by trades](https://ide.bitquery.io/Most-active-market-pools-by-trades)

#### Most active traders by trade count

Most active traders by trade count. Uses the `Trades` cube.

▶️ [Most active traders by trade count](https://ide.bitquery.io/Most-active-traders-by-trade-count)

#### Most traded token in last 1 hour on solana and it's average trade amount and total volume

Most traded token in last 1 hour on solana and it's average trade amount and total volume. Uses the `Trades` cube.

▶️ [Most traded token in last 1 hour on solana and it's average trade amount and total volume](https://ide.bitquery.io/Most-traded-token-in-last-1-hour-on-solana-and-its-average-trade-amount-and-total-volume)

#### Net flow (buys - sells) per token symbol

Net flow (buys - sells) per token symbol. Uses the `Trades` cube.

▶️ [Net flow (buys - sells) per token symbol](https://ide.bitquery.io/Net-flow-buys---sells-per-token-symbol_2)

#### Tokens with highest trade frequency

Tokens with highest trade frequency. Uses the `Trades` cube.

▶️ [Tokens with highest trade frequency](https://ide.bitquery.io/Tokens-with-highest-trade-frequency)

#### Tokens with most unique buyers

Tokens with most unique buyers. Uses the `Trades` cube.

▶️ [Tokens with most unique buyers](https://ide.bitquery.io/Tokens-with-most-unique-buyers)

#### Top Traders on Solana

Top Traders on Solana. Uses the `Trades` cube.

▶️ [Top Traders on Solana](https://ide.bitquery.io/Top-Traders-on-Solana_2)

#### Total SOL fees, Total Volume, Total count trades

Total SOL fees, Total Volume, Total count trades. Uses the `Trades` cube.

▶️ [Total SOL fees, Total Volume, Total count trades](https://ide.bitquery.io/Total-SOL-fees-Total-Volume-Total-count-trades)

### Price & OHLC

#### Token price from top market (rank 1)

The recommended way to price one token: takes the single highest-ranked market for it rather than blending every pool. Prices the token from its single top market rather than blending every pool, which is what you want for one specific token.

▶️ [Token price from top market (rank 1)](https://ide.bitquery.io/Token-price-from-top-market--rank-1_2)

#### Multi-token watchlist, top market each

Prices a list of tokens, each from its own top market. Add or remove addresses in the `Token.Address.in` filter.

▶️ [Multi-token watchlist, top market each](https://ide.bitquery.io/Multi-token-watchlist--rank-1-per-token)

#### Historical Bitcoin OHLC data for the last 7 days

Recent Bitcoin OHLC using the Crypto Price API (time range in the query matches what the Price Index supports).

▶️ [Historical Bitcoin OHLC data for the last 7 days](https://ide.bitquery.io/historical-Bitcoin-OHLC-data-for-the-last-7-days)

#### OHLC of a currency on multiple blockchains

Stream real-time Bitcoin OHLC data aggregated from all supported blockchains (Bitcoin, Ethereum WBTC, Solana, etc.) with 60-second intervals.

▶️ [OHLC of a currency on multiple blockchains](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

### Supply & Market Cap

#### Marketcap of pump token

Set token address and read `Supply.MarketCap` from the query below. See the Supply fields reference for related supply fields. You can also stream this in real-time by adding the keyword "subscription" at the top.

▶️ [Marketcap of pump token](https://ide.bitquery.io/marketcap-of-pump-token)

#### Tokens ranked by market cap

Tokens ranked by market cap. Uses the `Trades` cube.

▶️ [Tokens ranked by market cap](https://ide.bitquery.io/Tokens-ranked-by-market-cap_1)

## Stablecoins

### Trades

#### Solana USDT trades query

Solana trades quoted in USDT. USDT is the quote side on Solana, so it is filtered with `Pair.QuoteToken`, not `Pair.Token`, which would return nothing. The Trading cube reaches back about 30 days; `Solana.DEXTrades` keeps about 12 hours.

▶️ [Solana USDT trades query](https://ide.bitquery.io/solana-USDT-trades-query)

### Transfers

#### Latest Tron USDT Transfers

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest Tron USDT Transfers](https://ide.bitquery.io/Latest-Tron-USDT-Transfers)

#### Latest USDT/USDC Transfer api on base

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer api on base](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-base)

#### Latest USDT/USDC Transfer api on ethereum

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer api on ethereum](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-ethereum)

#### Stablecoin Transfers from/to an address

Stablecoin Transfers from/to an address. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin Transfers from/to an address](https://ide.bitquery.io/stablecoin-Transfers-fromto-an-address)

#### Stablecoin recieved and sent by an address

Stablecoin recieved and sent by an address. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Stablecoin recieved and sent by an address](https://ide.bitquery.io/Stablecoin-recieved-and-sent-by-an-address)

#### USDT Stablecoin reserves on Ethereum

USDT Stablecoin reserves on Ethereum. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [USDT Stablecoin reserves on Ethereum](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Ethereum)

#### USDT and USDC token Transfers api on solana

USDT and USDC token Transfers api on solana. Uses the `Transfers` cube.

▶️ [USDT and USDC token Transfers api on solana](https://ide.bitquery.io/USDT-and-USDC-token-Transfers-api-on-solana)

#### USDT token Transfers api on solana

Track live USDT stablecoin transfers. USDT is ideal for payments, settlements, etc and you can track those in real-time using this API/Stream -.

▶️ [USDT token Transfers api on solana](https://ide.bitquery.io/USDT-token-Transfers-api-on-solana)

### Price & OHLC

#### 5 minute price change stablecoin API

5 minute price change stablecoin API. Uses the `Tokens` cube.

▶️ [5 minute price change stablecoin API](https://ide.bitquery.io/5-minute-price-change-stablecoin-API)

#### Stablecoin price query of USDT

Get real-time and historical USDT prices, OHLCV, and moving averages across supported networks and markets.

▶️ [Stablecoin price query of USDT](https://ide.bitquery.io/stablecoin-price-query-of-USDT_1)

#### Usdt latest price arbitrage

This query compares USDT prices across different blockchain networks in real-time. It fetches the latest price data for USDT from different networks, showing you where the same stablecoin trades at different prices.

▶️ [Usdt latest price arbitrage](https://ide.bitquery.io/usdt-latest-price-arbitrage)

### Supply & Market Cap

#### USDC Stablecoin reserves on Solana

USDC Stablecoin reserves on Solana. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDC Stablecoin reserves on Solana](https://ide.bitquery.io/USDC-Stablecoin-reserves-on-Solana)

#### USDT Stablecoin reserves on Solana query

USDT Stablecoin reserves on Solana query. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDT Stablecoin reserves on Solana query](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana--query)

## NFTs

### Trades

#### New Uniswap v3 liquidity positions

Position NFTs as they are minted — who is adding liquidity to v3 pools, and to which pair.

▶️ [New Uniswap v3 liquidity positions](https://ide.bitquery.io/recent-uniswap-position-NFTs-mint_1)

#### Get NFT trades for a specific NFT contract on specific marketplace

Get trades of NFTs for a given contract and marketplace. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get NFT trades for a specific NFT contract on specific marketplace](https://ide.bitquery.io/Get-NFT-trades-by-contract)

#### Get NFT trades for a specific NFT contract and token ID

Get trades of NFTs for a given contract and token ID. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get NFT trades for a specific NFT contract and token ID](https://ide.bitquery.io/Get-NFT-trades-by-token)

#### Get NFT trades by wallet

Get trades of NFTs for a given wallet. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Get NFT trades by wallet](https://ide.bitquery.io/Get-trades-of-NFTs-for-a-given-wallet)

#### Latest NFT Trades

Latest NFT Trades. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest NFT Trades](https://ide.bitquery.io/Latest-NFT-trades-on-ETH)

#### Top Traded NFTs in a Period

This query gets the top 10 traded NFTs based on the number of trades within a specified date range. You can change the filters such as the date range and limit. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Top Traded NFTs in a Period](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month)

#### Latests OpenSea Trades

Latests OpenSea Trades. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latests OpenSea Trades](https://ide.bitquery.io/Latests-OpenSea-Trades)

#### Latest NFT trades on Ethereum network

Latest NFT trades on Ethereum network. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Latest NFT trades on Ethereum network](https://ide.bitquery.io/latest-NFT-trades-on-Ethereum-network)

#### Pairs of blur token new dataset

Open the above query on GraphQL IDE using this. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [Pairs of blur token new dataset](https://ide.bitquery.io/pairs-of-blur-token-new-dataset_1)

#### NFT currencies on Solana by DEX'es

The subscription query provided fetches the most-traded NFTs in the last few hours. For Solana, only realtime information is available, so the aggregate might not be accurate beyond a few hours. Built from raw DEX trades, so it reaches back further than the Trading cube's ~30 days. For live prices prefer the Trading cube entries at the top of this section.

▶️ [NFT currencies on Solana by DEX'es](https://ide.bitquery.io/NFT-currencies-on-Solana-by-DEXes_1)

### Transfers

#### Get NFT transfers by wallet

Get transfers of NFTs given the wallet.

▶️ [Get NFT transfers by wallet](https://ide.bitquery.io/latest-nft-transfers-by-a-user)

#### All transfers of an NFT

Retrieves the most recent transfers of a specific non-fungible token (NFT) on the Ethereum network. You can find the GraphQL query.

▶️ [All transfers of an NFT](https://ide.bitquery.io/All-transfers-of-an-NFT)

#### NFT Token Transfers By Date

NFT Token Transfers By Date.

▶️ [NFT Token Transfers By Date](https://ide.bitquery.io/NFT-Token-Transfers-By-Date)

#### Top transfered NFT tokens in network

Fetches the most frequently transferred NFTs on the Ethereum Blockchain within the specified date range.

▶️ [Top transfered NFT tokens in network](https://ide.bitquery.io/Top-transfered-NFT-tokens-in-network)

#### Array_intersect example for NFT

Array_intersect example for NFT.

▶️ [Array_intersect example for NFT](https://ide.bitquery.io/array_intersect-example-for-NFT)

#### Get all transfers of a specific nft

Will give all the transfers of a particular NFT `0xb68CA010776B4584cf49893E75b66583eb884948`.

▶️ [Get all transfers of a specific nft](https://ide.bitquery.io/get-all-transfers-of-a-specific-nft)

### Balances & Holders

#### Get Latest NFT Balance for an Address

Get the latest NFT balance for a specific address and NFT collection. This query returns the current NFT count and ownership information.

▶️ [Get Latest NFT Balance for an Address](https://ide.bitquery.io/Get-Latest-NFT-Balance-for-an-Address)

#### Get All NFT Collections for an Address

Retrieve all NFT collections held by a specific address. This query returns balances for all NFT collections the address owns.

▶️ [Get All NFT Collections for an Address](https://ide.bitquery.io/Get-All-NFT-Collections-for-an-Address_1)

#### Get NFT Owner for Specific Token ID

Check the current owner of a specific NFT token ID. This query returns ownership information for a particular token.

▶️ [Get NFT Owner for Specific Token ID](https://ide.bitquery.io/Get-NFT-Owner-for-Specific-Token-ID)

#### Get NFT Balances for Multiple Addresses

Get NFT balances for multiple addresses in a single query. Useful for portfolio tracking or wallet monitoring applications.

▶️ [Get NFT Balances for Multiple Addresses](https://ide.bitquery.io/Get-NFT-Balances-for-Multiple-Addresses_1)

#### Get NFT Ownership History

Retrieve the NFT ownership history of a specific NFT over a specific time period. This helps track NFT transfers and ownership changes.

▶️ [Get NFT Ownership History](https://ide.bitquery.io/Get-NFT-Ownership-History_2)

### Price & OHLC

#### Smart contract calls to an nft contract

Smart contract calls to an nft contract.

▶️ [Smart contract calls to an nft contract](https://ide.bitquery.io/Smart-contract-calls-to-an-nft-contract)

### Events & Calls

#### All refinance loans for specific NFT collection

To retrieve all refinance loans for a specific NFT collection, we filter Refinance event arguments in.

▶️ [All refinance loans for specific NFT collection](https://ide.bitquery.io/All-refinance-loans-for-specificNFT-collection)

#### Auction on blur marketplace

The 'StartAuction' event is triggered when an NFT auction starts on the Blur : Blend Contract. The following.

▶️ [Auction on blur marketplace](https://ide.bitquery.io/Auction-on-blur-marketplace)

#### Creator_of_an_NFT

Creator_of_an_NFT.

▶️ [Creator_of_an_NFT](https://ide.bitquery.io/Creator_of_an_NFT)

#### Latest Cancelled offers on Blur NFT marketplace

On the BLUR market, the 'OfferCancelled' event initiates when an offer is withdrawn or cancelled. The following.

▶️ [Latest Cancelled offers on Blur NFT marketplace](https://ide.bitquery.io/Latest-Cancelled-offers-on-Blur-NFT-marketplace)

#### Latest Loans for a specific borrower on Blur marketplace

Same as previous queries, this query will return details about the block, transaction, log, and arguments. By modifying the 'Arguments.includes' filter, you can track loan activities for different NFT collections on the Blur marketplace.

▶️ [Latest Loans for a specific borrower on Blur marketplace](https://ide.bitquery.io/Latest-Loans-for-a-specificborrower-on-Blur-marketplace)

#### Latest Seized NFTs on Blur marketplace

When a seizure event happens, control of the NFT shifts to the lender or an enforcing third party. The.

▶️ [Latest Seized NFTs on Blur marketplace](https://ide.bitquery.io/Latest-Seized-NFTs-on-Blur-marketplace)

#### Latest loans for specific NFT token

Latest loans for specific NFT token.

▶️ [Latest loans for specific NFT token](https://ide.bitquery.io/Latest-loans-for-specific-NFTtoken)

#### Loan history for specific NFT ID

Loan history for specific NFT ID.

▶️ [Loan history for specific NFT ID](https://ide.bitquery.io/Loan-history-for-specific-NFTID)

#### Loan repayment of blur marketplace

For loan repayment transactions on the BLUR market, use the.

▶️ [Loan repayment of blur marketplace](https://ide.bitquery.io/Loan-repayment-of-blur-marketplace)

#### Loans above a specific amount on the Blur NFT marketplace

If we want to track loans above a specific amount on the Blur marketplace, we can use the following.

▶️ [Loans above a specific amount on the Blur NFT marketplace](https://ide.bitquery.io/Loans-above-a-specific-amount-on-the-Blur-NFT-marketplace)

#### Locked NFT bought on Blur marketplace

Locked NFTs are temporarily non-transferrable and can be traded or transferred after the lock period. These NFTs are often cheaper than non-locked. The following.

▶️ [Locked NFT bought on Blur marketplace](https://ide.bitquery.io/Locked-NFT-bought-on-Blur-marketplace)

## Futures DEXs

### Trades

#### All events of AsterDEX

Monitor all events emitted by the AsterDEX contract to track all platform activities.

▶️ [All events of AsterDEX](https://ide.bitquery.io/All-events-of-AsterDEX)

#### AsterDEX - All latest Liquidations

When there is a liquidation event on AsterDEX, it emits `ExecuteCloseSuccessful` event with `executionType` 2.

▶️ [AsterDEX - All latest Liquidations](https://ide.bitquery.io/AsterDEX---All-latest-Liquidations)

#### AsterDEX - OpenMarketTrade

AsterDEX - OpenMarketTrade. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [AsterDEX - OpenMarketTrade](https://ide.bitquery.io/AsterDEX---OpenMarketTrade)

#### Trader's specific event

You can look for `Transaction -> From` or in some cases the address might be in arguments, for example.

▶️ [Trader's specific event](https://ide.bitquery.io/Traders-specific-event)

#### Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92

You can actually merge these two queries. Here is an example.

▶️ [Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92](https://ide.bitquery.io/Copy-of-Traders-data---0x01554d63537d3c62715826a268d4eab645d64b92)

#### Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c

Using Bitquery's APIs you can follow specific traders on AsterDEX to check all their latest activities.

▶️ [Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c](https://ide.bitquery.io/Traders-data---0x2b7363708984aa25a90450cfca7bedaf6804115c)

## x402

### Trades

#### Payment Analytics for x402 Server on Solana

Payment Analytics for x402 Server on Solana. Replace the address in the `where` clause to use it.

▶️ [Payment Analytics for x402 Server on Solana](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server-on-Solana)

### Transfers

#### Get Latest Payments to x402 Server

Get Latest Payments to x402 Server. Uses the `Transfers` cube.

▶️ [Get Latest Payments to x402 Server](https://ide.bitquery.io/Latest-payment-to-specific-x402-server)

#### Get Latest Payments to x402 Server on Solana

Get Latest Payments to x402 Server on Solana. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Get Latest Payments to x402 Server on Solana](https://ide.bitquery.io/Latest-Payment-to-specific-x402-server-taking-solana-payments)

#### Payment Analytics for x402 Server

Comprehensive payment analytics including total volume, unique users, transaction counts, and time-based breakdowns for a specific x402 server.

▶️ [Payment Analytics for x402 Server](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server)
