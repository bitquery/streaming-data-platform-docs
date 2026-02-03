# Starter Queries

Below is a set of queries that are curated for you to get started with Bitquery.

## Table of Contents

- [Cross-Chain / Multi-Chain APIs](#cross-chain--multi-chain-apis)
- [Ethereum](#ethereum)
- [Solana](#solana)
- [BSC (Binance Smart Chain)](#bsc-binance-smart-chain)
- [TRON](#tron)
- [Bitcoin](#bitcoin)
- [Cardano](#cardano)
- [Ripple](#ripple)
- [Cosmos](#cosmos)
- [NFT APIs](#nft-apis)
- [Polymarket](#polymarket)
- [x402 APIs](#x402-apis)

## Cross-Chain / Multi-Chain APIs

#### Latest Price of Any Token

This query gives you bitcoin currency 1-sec OHLC across different blockchains. You can adjust duration in `Duration: {eq: 1}` filter.

▶️ [Latest Price of Token Across Chains](https://ide.bitquery.io/Latest-bitcoin-price-on-across-chains)

#### Crypto Price Change API

This query gives you change in price (Close-Open) of all tokens on Ethereum, BNB, Solana and Tron.
You can adjust duration in `Duration: {eq: 60}` filter.

▶️ [Crypto Price Change API](https://ide.bitquery.io/1-minute-price-change-api)

#### OHLC of a currency on multiple blockchains

This query retrieves the OHLC (Open, High, Low, Close) prices of a currency(in this eg Bitcoin; it will include all sorts of currencies whose underlying asset is Bitcoin like cbBTC, WBTC, etc) across all supported blockchains, aggregated into a given time interval (e.g., 60 seconds in this example).

▶️ [OHLC of a currency on multiple blockchains](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

#### OHLC of a Token Pair Across Chains

This subscription fetches real-time OHLC (Open, High, Low, Close) price data for a token pair across different blockchains.  
For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH).

▶️ [OHLC of a Token Pair Across Chains](https://ide.bitquery.io/Token-OHLC-Stream-1-second-Multi-Chains_1)

#### Aggregated Token Data (Volume & Price, Last 24h)

This query returns up to 100 tokens with aggregated USD volume and average price over the last 24 hours. It also returns volume and price for the last 1h, 4h, and 24h using conditional metrics (`if` with `since_relative`), so you can build dashboards or compare short-term vs daily stats.

▶️ [Aggregated Token Data](https://ide.bitquery.io/aggregated-data)

## Ethereum

### Balance APIs

#### Get latest ERC20 token balance of a wallet

Get latest ERC20 token balance of a wallet.
▶️ [Get latest ERC20 token balance of a wallet](https://ide.bitquery.io/Get-Latest-Token-Balance-for-an-Address)

#### Get All Token Balances for an Address

Retrieve all ERC-20 token balances held by a specific address. This query returns balances for all tokens the address holds.
▶️ [Get All Token Balances for an Address](https://ide.bitquery.io/Get-All-Token-Balances-for-an-Address)

#### Latest Liquidity of EVM Pool

Get the latest liquidity of an EVM DEX pool (e.g., Uniswap v3 pool).  
▶️ [Latest Liquidity of EVM Pool](https://ide.bitquery.io/latest-liquidity-of-a-EVM-pool)

### Token Supply

#### Latest Token Supply on ETH chain

Latest Token Supply for all active token

▶️ [Latest Token Supply for all active token](https://ide.bitquery.io/latest-token-supply-of-all-active-tokens-on-ETH-chain)

#### Latest Token Supply of USDT-USDC on ETH chain

Latest Token Supply for stablecoin like USDC-USDT

▶️ [Latest Token Supply for stablecoin like USDC-USDT](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain)

### Transfers

#### Get ERC20 token transfers by wallet

Get ERC20 token transactions ordered by block number in descending order.  
▶️ [Get ERC20 token transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet_4)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.  
▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet)

### Trades

#### Ethereum DEXTrades latest trades for a token

This query returns the latest trades on the Ethereum network where distinction of the buy and sell sides is present.  
▶️ [Ethereum DEX Trades](https://ide.bitquery.io/Ethereum-dextrades-of-a-token)

#### Ethereum DexTradeByTokens latest trades for a token

This query returns the latest trades on the Ethereum network. This is useful when looking for trades of a token without worrying about the buy or sell side.  
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Ethereum-DexTradeByTokens-of-a-token)

#### Get Swaps by Wallet Address

Get all swap related transactions (buy, sell).  
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/latest_trades_by_maker)

#### Ethereum DEX Trades

This query returns the latest trades on the Ethereum network where distinction of the buy and sell sides is present.  
▶️ [Ethereum DEX Trades](https://ide.bitquery.io/Copy-of-Ethereum-dextrades_1)

#### Ethereum Dex Trade By Tokens

This query returns the latest trades on the Ethereum network. This is useful when looking for trades of a token without worrying about the buy or sell side.  
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Ethereum-DexTradeByTokens)

### Events & Calls

#### Get Latest Events

▶️ [Get Latest Events](https://ide.bitquery.io/Recents-Events-and-Logs-on-Ethereum_1)

#### Get Latest Calls

▶️ [Get Latest Calls](https://ide.bitquery.io/Recent-Calls-on-Ethereum_1)

### OHLC & Price Data

#### Get OHLCV by Pair Address

Get the OHLCV candle stick by using pair address.  
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC0_8)

#### Get Multiple ERC20 Token Prices

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address.  
▶️ [Get Multiple ERC20 Token Prices](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime)

#### Get ATH Price of a token

Retrieves the all-time high (ATH) price in USD for a specified token contract.
▶️ [Get ATH Price of a token](https://ide.bitquery.io/ATH-of-eth-token)

#### Get Price Change 5min, 1h, 6h and 24h of a specific Eth token

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the Ethereum network.
▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_4)

#### Top 10 Eth Tokens by Price Change in last 1h

This query gets you top 10 Eth Tokens by Price Change in last 1h.
▶️ [Top 10 Eth Tokens by Price Change in last 1h](https://ide.bitquery.io/Top-10-eth-tokens-by-price-change-in-last-1-hr_2)

#### Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Ethereum). Great for bot trading strategies.
▶️ [Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

### Token Analytics

#### Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific ERC-20 token. This query provides on-chain market cap data.
▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_1)

#### Token Holder Count on a Specific Date

This API returns the total number of holders for a specific token on a given date.
▶️ [Token Holder Count on a Specific Date](https://ide.bitquery.io/token-holder-count_6)

#### Real-Time Holders of Multiple Tokens

This API leverages the balanceUpdate endpoint to deliver real-time holder data for multiple tokens.
▶️ [ Real-Time Holders of Multiple Tokens](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-ETH_2)

#### Token Holders of Multiple Tokens on a speicifc date - BalanceUpdates API

This API provides a list of top holders along with relevant statistics for a given token liston a specific date using BalanceUpdates API.
▶️ [ Real-Time Holders of Multiple Tokens](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-ETH-at-a-specific-time)

#### Token Holders and Stats on a Specific Date - TokenHolders API

This API provides a list of all holders along with relevant statistics for a given token on a specific date.
▶️ [Token Holders and Stats on a Specific Date](https://ide.bitquery.io/tokens-holders-of-a-token_7)

### Slippage APIs

#### Latest Slippage for a Specific Pool on Uniswap V3

This query retrieves the latest slippage data for a specific DEX pool on Ethereum. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool on Uniswap V3](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3-Ethereum)

### Liquidity APIs

#### Latest Liquidity Changes of a Specific Pool

This query retrieves the latest liquidity events for a specific DEX pool on Ethereum. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_5#)

#### Top Liquidity Pools of a token on Ethereum

▶️ [Top Liquidity Pools of a token on Ethereum](https://ide.bitquery.io/top-liquidity-pools-of-atoken-on-ethereum)

## Solana

### Balance APIs

#### Get Native and SPL Token Balance by Wallet

Gets the portfolio for an address.
▶️ [Get Native and SPL Token Balance by Wallet](https://ide.bitquery.io/tokens-owned-by-an-address_3)

#### Historical Solana Balance

This API returns all token inflows and outflows for a Solana address within a specified timeframe, enabling balance calculation based on transaction history.
▶️ [Solana Token Inflows and Outflows for Balance Calculation](https://ide.bitquery.io/currency-sent-and-received-by-an-address-between-a-time_6)

#### Solana Balance Update

This query returns Solana balance update info for any balance update event. It includes the address, amount, currency details, and the amount of tokens present in a particular address before and after the update.  
▶️ [Balance Update](https://ide.bitquery.io/solana-balance-update)

#### Solana Instruction Balance Updates

This query returns Solana balance update info for any balance update event, including the address, amount, currency details, and the details of the program responsible for this update.  
▶️ [Instruction Balance Updates](https://ide.bitquery.io/Solana-InstructionBalanceUpdates)

### Transfers

#### Solana Transfers

This query gets the latest 10 transfers on Solana. You can increase the limit to get more transfers. This query only uses real-time data.  
▶️ [Solana Transfers](https://ide.bitquery.io/Solana-transfers0_5)

#### Solana Historical Transfers

▶️ [Solana Historical Transfers](https://ide.bitquery.io/solana-historical-transfers_1)

#### Find who funded the specific Solana wallet

To determine who funded a specific Solana wallet with SOL, you can utilise the following API.
▶️[Find who funded the specific Solana wallet](https://ide.bitquery.io/Who-funded-a-given-wallet)

#### Solana Token creator and Time

▶️[Solana Token creator and Time](https://ide.bitquery.io/Solana-token-creation-date-and-creator)

#### Solana Historical Token Transfers Over Time

This API provides historical data on all Solana token transfers that occurred within a specified time range.
▶️ [Solana Historical Token Transfers Over Time](https://ide.bitquery.io/Solana-historical-token-transfers-between-a-time_2)

#### Solana Token Transfers for a Specific Address

This API retrieves the history of token transfers (both sent and received) for a specific Solana address within a defined time period.
▶️ [Solana Token Transfers for a Specific Address](https://ide.bitquery.io/Solana-historical-token-transfers-of-an-address-between-a-time)

#### Solana Token Inflows and Outflows for Balance Calculation

This API returns all token inflows and outflows for a Solana address within a specified timeframe, enabling balance calculation based on transaction history.
▶️ [Solana Token Inflows and Outflows for Balance Calculation](https://ide.bitquery.io/currency-sent-and-received-by-an-address-between-a-time_6)

#### Simple SOL transfers (Transactions not trades)

This API returns simple SOL transfers; in other words, it contains transactions that are simple token transfers, not trades.
▶️ [Simple SOL transfers (Transactions not trades)](https://ide.bitquery.io/Simple-SOL-transfers-Transactions-not-trades)

### Trades

#### Solana Chain Trades

This query gets the latest 10 trades on Solana. You can increase the limit to get more trades. This query only uses real-time data.  
▶️ [Solana Trades](https://ide.bitquery.io/Solana-dextrades)

#### Solana Trades of a Token

With this, you can query the trades of a token against another currency like WSOL or USDC.  
▶️ [Trades of a Token](https://ide.bitquery.io/Latest-Trades-of-Trump-COin)

#### Get Trades by Wallet Address

Get all trades related transactions (buy, sell) for a specific wallet address.
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/Trades-of-wallets-in-realtime_1)

#### Get Swaps by Pair Address

Get all trades related transactions for a specific pair address.
▶️ [Get Swaps by Pair Address](https://ide.bitquery.io/Get-Swaps-by-Pair-Address_1)

#### Latest Trades for a specific currency on Raydium

This query returns the latest created pools on Raydium. You can set the limit here also.
▶️ [Latest trades of a token on Raydium](https://ide.bitquery.io/Latest-buy-and-sell-of-specific-currency-on-Raydium-DEX-on-Solana)

#### Latest Trades in Real Time of a specific DEX

This subscription query returns the latest PumpFun trades in real time.  
▶️ [Real-time Trades](https://ide.bitquery.io/Pumpfun-DEX-Trades_1#)

### OHLC & Price Data

#### Get OHLCV by Pair Address

You can get charting data easily with this query. Adjust the intervals as necessary. This query supports historical data.  
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC-for-a-token_1)

#### Real-Time Token Prices in USD on Solana

Stream live OHLC (Open, High, Low, Close) price and volume data for all tokens on Solana, quoted directly in USD. Useful for dashboards, analytics, or bots that need stable fiat-based prices.
▶️ [Real-Time Token Prices in USD on Solana](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain)

#### Get ATH Price of a token

Retrieves the all-time high (ATH) price in USD for a specified token contract.
▶️ [Get ATH Price of a token](https://ide.bitquery.io/solana-ATH_9)

#### Real-Time Token Prices in Quote Pair (USDC, USDT, etc.)

Stream live OHLC prices for Solana tokens denominated in their trading pair token (e.g., USDC, USDT, or another crypto), instead of direct USD. Great for analyzing token behavior relative to stablecoins or other assets.
▶️ [Real-Time Token Prices in Quote pair](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain-in-paired-token)

#### Price change 5min, 1hr, 6hr precentage of a specific token

With this, you can get the price change 5min, 1hr, 6hr precentage of a specific token.
▶️ [Price change 5min, 1hr, 6hr precentage](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_5)

#### Top 10 solana tokens by price change in last 1 hr

With this, you can get top 10 solana tokens by price change in last 1 hr.
▶️ [Top 10 solana tokens by price change in last 1 hr](https://ide.bitquery.io/Top-10-solana-tokens-by-price-change-in-last-1-hr_4)

#### PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Real-time (1-second interval) price, OHLC, volume, and moving averages for Pump.fun AMM tokens on Solana. Useful for high-frequency trading bots.
▶️ [PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/PumpAMM-tokens-1-second-price-stream-with-OHLC_1)

#### Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Monitor Raydium Launchlab token listings on Solana with 1-second OHLC and volume streams. Perfect for tracking new token launches.
▶️ [Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

#### Latest Price of a Token on Raydium Launchpad

This query returns the latest price of a token on the Raydium launchpad.  
▶️ [Latest Token Price on Launchpad](https://ide.bitquery.io/Latest-Price-of-a-Token-on-Launchpad)

#### Latest Price of a LetsBonk.fun

This query returns the latest price of a LetsBonk.fun token.  
▶️ [Latest LetsBonk.fun Token Price](https://ide.bitquery.io/Latest-Price-of-a-LetsBonkfun-Token-on-Launchpad?)

### Token Analytics

#### Get Token Prices on Solana

Returns price information for multiple Solana tokens in a single request.
▶️ [Get Multiple Token Prices on Solana](https://ide.bitquery.io/Get-multiple-Token-Prices)

#### Get Token Metadata

Get the token metadata for contract (mint, standard, name, symbol).
▶️ [Get Token Metadata](https://ide.bitquery.io/Solana-currency-details)

#### Get Top Token Holders

Get a list of top token holders for a specific Solana token address.
▶️ [Get Top Token Holders](https://ide.bitquery.io/top-100-holders-of-USDC-token-on-Solana)

#### Get Token Pairs by Address

Get the supported pairs for a specific token address.
▶️ [Get Token Pairs by Address](https://ide.bitquery.io/traded-pairs-of-a-token_2)

#### Get Token Pair Stats

Get the pair stats by using pair address.
▶️ [Get Token Pair Stats](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair)

#### Get Aggregated Token Pair Stats

Get aggregated statistics across supported pairs of a token.
▶️ [Get Aggregated Token Pair Stats](https://ide.bitquery.io/traded-pairs-stats-of-a-token)

#### Get Multiple Token Analytics

Returns analytics data for multiple token addresses.
▶️ [Get Multiple Token Analytics](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-multiple-solana-tokens)

#### Get Volume Stats for Solana Chain

Returns volume statistics, active wallets, and total transactions for Solana.
▶️ [Get Volume Stats By Chain](https://ide.bitquery.io/Chain-stats-like-total-volume-traded-total-transactions-active-wallets_1)

#### Top 10 marketcap jump tokens in last 1hr

This query retrieves top 10 marketcap jump tokens in last 1hr.
▶️ [Top 10 marketcap jump tokens in last 1hr](https://ide.bitquery.io/top-10-marketcap-jump-tokens-in-last-1hr#)

### Search Tokens

#### Search tokens by name, symbol, mint address

Search for tokens based on contract address, token name or token symbol.
▶️ [Search Tokens based on token symbol](https://ide.bitquery.io/Token-Search-API---trump-symbol)

### Pool/Liquidity APIs

#### All Token Pairs Across DEXs with Current Liquidity

This query retrieves all instances of a specific token pair across decentralized exchanges (DEXs) on Solana, along with their current liquidity.
▶️ [All Token Pairs Across DEXs with Current Liquidity](https://ide.bitquery.io/All-Liquidity-pairs-of-a-token-and-current-liquidity-on-solana)

#### Solana Pool Liquidity Changes

This query retrieves the latest changes to liquidity pools on Solana, including the change amount and the price at which the change happened. This query also uses only the real-time data set.  
▶️ [Solana Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools)

#### Latest Pools Created on Raydium

This query returns the latest created pools on Raydium. You can set the limit here also.  
▶️ [Raydium Latest Created Pools](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_1)

#### Latest Pools Created on Launchpad

This query returns the latest created pools on Raydium launchpad. You can set the limit here also.  
▶️ [Launchpad Latest Created Pools](https://ide.bitquery.io/Launchpad-latest-pool-created)

#### Liquidity Addition for Four Meme Token

Get the liquidity addition events for a specific token on the Four Meme Exchange.  
▶️[Liquidity Addition](https://ide.bitquery.io/Liquidity-Added-to-specific-tokens-on-Four-meme)

### PumpFun APIs

#### Get New Tokens for PumpFun

Returns a list of newly created tokens on the Pump Fun.
▶️ [Get New Tokens for PumpFun](https://ide.bitquery.io/newly-created-PF-token-dev-address-metadata--query#)

#### Get Bonding Curve Progress of a Token on Pump Fun

Returns Bonding Curve Percentage of a Token on the Pump Fun.
▶️ [Bonding Curve Percentage of a Token on Pump Fun](https://ide.bitquery.io/get-the-bonding-curve-progress-percentage_1)

#### Track Pump Fun Tokens above 95% Bonding Curve Progress in realtime

Returns Pump fun tokens which have more than 95% bonding curve progress.
▶️ [Pump Fun Tokens above 95% Bonding Curve Progress](https://ide.bitquery.io/Pump-Fun-Tokens-between-95-and-100-bonding-curve-progress_3)

#### Top 100 About to Graduate Pump Fun Tokens

Returns top 100 About to Graduate Pump Fun Tokens.
▶️ [Top 100 About to Graduate Pump Fun Tokens](https://ide.bitquery.io/Top-100-graduating-pump-fun-tokens-in-last-5-minutes_2)

#### Get Graduated Tokens by Exchange

Returns a list of tokens that have graduated (completed bonding phase) on Pump Fun to PumpSwap.
▶️ [Get Graduated Tokens by Exchange](https://ide.bitquery.io/get-latest-Pump-fun-migration-using-joins)

#### Top PumpFun Tokens by Marketcap

This query returns the top 10 PumpFun tokens based on market cap. You can increase the limit to get more tokens.  
▶️ [Top Tokens by Marketcap](https://ide.bitquery.io/top-tokens-by-mktcap-on-pump-fun-in-last-15-min)

#### Top 10 pump fun tokens by Price change in last 5mins

This query returns the top 10 pump fun tokens by Price change in last 5mins. You can increase the limit to get more tokens.  
▶️ [Top 10 pump fun tokens by Price change in last 5mins](https://ide.bitquery.io/Top-10-pump-fun-tokens-by-Price-change-in-last-5mins_2)

#### Top 10 pump fun tokens by Marketcap change in last 5mins

This query returns the top 10 pump fun tokens by Marketcap change in last 5mins. You can increase the limit to get more tokens.  
▶️ [Top 10 pump fun tokens by Marketcap change in last 5mins](https://ide.bitquery.io/Top-10-pump-fun-tokens-by-Marketcap-change-in-last-5mins_1)

#### Historical PumpFun Migrated Token on Raydium and Pumpswap.

▶️ [Historical PumpFun Migrated Tokens](https://ide.bitquery.io/all-pumpfun-migrated-token-query_4)

### Raydium Launchpad APIs

#### Get Bonding Curve Progress of a Raydium Launchpad Token

Returns Bonding Curve Percentage of a Raydium Launchpad Token.
▶️ [Bonding Curve Percentage of a Raydium Launchpad Token](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-letsbonkfun-token)

#### Track Raydium Launchpad tokens above 95% Bonding Curve Progress in realtime

Returns Raydium Launchpad tokens which have more than 95% bonding curve progress.
▶️ [Raydium Launchpad Tokens above 95% Bonding Curve Progress](https://ide.bitquery.io/LetsBonkfun-Tokens-between-95-and-100-bonding-curve-progress_2)

#### Top 100 About to Graduate Raydium Launchpad Tokens

Returns top 100 About to Graduate Raydium Launchpadn Tokens.
▶️ [Top 100 About to Graduate Raydium Launchpad Tokens](https://ide.bitquery.io/Top-100-graduating-raydium-launchlab-tokens-in-last-5-minutes)

#### Graduated Tokens

This query gives you tokens which are graduated from Raydium Launchpad to Raydium.
▶️ [Graduated Tokens from Launchpad](https://ide.bitquery.io/Track-Token-Migrations-to-Raydium-DEX-and-Raydium-CPMM-in-realtime)

### LetsBonk.fun APIs

#### Get Bonding Curve Progress of a LetsBonk.fun Token

Returns Bonding Curve Percentage of a LetsBonk.fun Token.
▶️ [Bonding Curve Percentage of a LetsBonk.fun Token](https://ide.bitquery.io/bonding-curve-progress-percentage-of-a-letsbonkfun-token)

#### Track LetsBonk.fun tokens above 95% Bonding Curve Progress in realtime

Returns LetsBonk.fun tokens which have more than 95% bonding curve progress.
▶️ [LetsBonk.fun Tokens above 95% Bonding Curve Progress](https://ide.bitquery.io/LetsBonkfun-Tokens-between-95-and-100-bonding-curve-progress_2)

#### Top 100 About to Graduate LetsBonk.fun Tokens

Returns top 100 About to Graduate LetsBonk.fun Tokens.
▶️ [Top 100 About to Graduate LetsBonk.fun Tokens](https://ide.bitquery.io/Top-100-graduating-raydium-launchlab-tokens-in-last-5-minutes)

## Base

### Balance APIs

#### Get latest token balance of a wallet

Get latest token balance of a wallet.
▶️ [Get latest token balance of a wallet](https://ide.bitquery.io/Get-Latest-Token-Balance-for-an-Address_1)

#### Get All Token Balances for an Address

Retrieve all token balances held by a specific address. This query returns balances for all tokens the address holds.
▶️ [Get All Token Balances for an Address](https://ide.bitquery.io/Get-All-Token-Balances-for-an-Address_1)

#### Latest Liquidity of Base Pool

Get the latest liquidity of an Base DEX pool (e.g., Uniswap v3 pool).  
▶️ [Latest Liquidity of Base Pool](https://ide.bitquery.io/latest-liquidity-of-a-Base-pool_1)

### Transfers

#### Get token transfers by wallet

Get token transactions ordered by block number in descending order.  
▶️ [Get token transfers by wallet](https://ide.bitquery.io/Get-token-transfers-by-wallet)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.  
▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_2)

### Trades

#### Base DEX Trades

This query returns the latest trades on the Base network where distinction of the buy and sell sides is present.  
▶️ [Base DEX Trades](https://ide.bitquery.io/base-dextrades)

#### Base Dex Trade By Tokens

This query returns the latest trades on the Base network. This is useful when looking for trades of a token without worrying about the buy or sell side.  
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Base-DexTradeByTokens_1)

#### Get Swaps by Wallet Address

Get all swap related transactions (buy, sell).  
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/latest_trades_by_maker-base_1)

### Events & Calls

#### Get Latest Events

▶️ [Get Latest Events](https://ide.bitquery.io/Recents-Events-and-Logs-on-Base_1)

#### Get Latest Calls

▶️ [Get Latest Calls](https://ide.bitquery.io/Recent-Calls-on-base)

### OHLC & Price Data

#### Get OHLCV by Pair Address

Get the OHLCV candle stick by using pair address.  
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC--base)

#### Get Multiple Token Prices

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address.  
▶️ [Get Multiple Token Prices](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime_1)

#### Get ATH Price of a token

Retrieves the all-time high (ATH) price in USD for a specified token contract.
▶️ [Get ATH Price of a token](https://ide.bitquery.io/ATH-of-base-token)

#### Get Price Change 5min, 1h, 6h and 24h of a specific token

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the Base network.
▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_6)

#### Top 10 Base Tokens by Price Change in last 1h

This query gets you top 10 Base Tokens by Price Change in last 1h.
▶️ [Top 10 Base Tokens by Price Change in last 1h](https://ide.bitquery.io/Top-10-base-tokens-by-price-change-in-last-1-hr_1)

#### Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Base). Great for bot trading strategies.
▶️ [Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC_1)

### Token Analytics

#### Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific token. This query provides on-chain market cap data.
▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_2)

#### Token Holder Count on a Specific Date

This API returns the total number of holders for a specific token on a given date.
▶️ [Token Holder Count on a Specific Date](https://ide.bitquery.io/token-holder-count_7)

#### Real-Time Holders of Multiple Tokens

This API leverages the balanceUpdate endpoint to deliver real-time holder data for multiple tokens.
▶️ [ Real-Time Holders of Multiple Tokens](http://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-Base_1)

#### Token Holders of Multiple Tokens on a speicifc date - BalanceUpdates API

This API provides a list of top holders along with relevant statistics for a given token liston a specific date using BalanceUpdates API.
▶️ [ Real-Time Holders of Multiple Tokens](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-Base-at-a-specific-time)

#### Token Holders and Stats on a Specific Date - TokenHolders API

This API provides a list of all holders along with relevant statistics for a given token on a specific date.
▶️ [Token Holders and Stats on a Specific Date](https://ide.bitquery.io/tokens-holders-of-a-token-base)

### Slippage APIs

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on Base. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3)

### Liquidity APIs

#### Latest Liquidity Changes of a Specific Pool

This query retrieves the latest liquidity events for a specific DEX pool on Base. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_4#)

## BSC (Binance Smart Chain)

### Balance APIs

#### Get latest BNB balance of an wallet

Get latest BNB balance of an wallet.
▶️ [Get latest BNB balance of a wallet](https://ide.bitquery.io/Latest-native-balance-of-an-address-bsc)

#### Get latest liquidity of an EVM Pool

Get latest liquidity of an EVM Pool.
▶️ [Get latest liquidity of an EVM Pool](https://ide.bitquery.io/latest-liquidity-of-a-EVM-pool)

#### Get Native & Token Balances by Wallet

Get token balances for a specific wallet address.  
▶️ [Get Native & Token Balances by Wallet](https://ide.bitquery.io/balance-of-a-wallet_1)

#### Get Token Balance by Wallet

Get token balances for a specific wallet address.  
▶️ [Get Token Balance by Wallet](https://ide.bitquery.io/Get-ERC20-Token-Balance-by-Wallet)

#### Get wallet net worth

Get the net worth of a wallet in USD.  
▶️ [Get wallet net worth](https://ide.bitquery.io/balance-of-a-wallet-in-USD_2)

### Token Supply

#### Get Total Supply and Marketcap of an BSC token

Get Total Supply and Marketcap of an BSC token.
▶️ [Get Total Supply and Marketcap of an BSC token](https://ide.bitquery.io/latest-liquidity-of-a-EVM-pool)

### Transfers

#### Get token transfers by wallet

Get token transactions ordered by block number in descending order.  
▶️ [Get token transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet_2)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.  
▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet)

### Trades

#### Get Swaps by Wallet Address

Get all swap related transactions (buy, sell).  
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/latest-trades-by-market-maker)

#### Buys of a Token on BNB

This query returns the latest `100` buys of a given BEP-20 token.
▶️[BSC Token Buys](https://ide.bitquery.io/BNB-Token-Buys)

#### Latest Token Trades

Get the latest trades of a token on Pancakeswap.  
▶️[Token Trades](https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-token)

#### Trades by User on Pancakeswap

Get the latest trades by a user on Pancakeswap.  
▶️[User Trades](https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-trader)

#### Latest and Historical Trades of a User

Get the latest and historical trades by a user on `Four Meme` platform.  
▶️[User Trades](https://ide.bitquery.io/Get-all-trades-of-a-trader-on-four-meme)

### OHLC & Price Data

#### Get Multiple Token Prices

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address.  
▶️ [Get Multiple Token Prices](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime)

#### Get OHLCV by Pair Address

Get the OHLCV candle stick by using pair address.  
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC0_8)

#### OHLC for a BEP-20 Token

Get OHLC statistics for a BEP-20 token on BSC network.  
▶️[OHLC of a Token](https://ide.bitquery.io/OHLC-for-a-token-on-bsc_1)

#### Get ATH Price of a token

Retrieves the all-time high (ATH) price in USD for a specified token contract.
▶️ [Get ATH Price of a token](https://ide.bitquery.io/ATH-of-bsc-token_2)

#### BEP-20 Token Price

Get the latest price of a BEP-20 token on BSC network.  
▶️[Token Price](https://ide.bitquery.io/realtime-usd-price-of-a-token)

#### Price of a Token on PancakeSwap

Get the latest price of a token traded on Pancakeswap.  
▶️[Token Price on Pancakeswap](https://ide.bitquery.io/BSC-PancakeSwap-v3-Price-for-a-token)

#### OHLC of a Token on PancakeSwap

Get the OHLC stats of a token traded on Pancakeswap.  
▶️[Token OHLC](https://ide.bitquery.io/OHLC-of-a-Token-on-pancake_swap_v3)

#### Get Price Change 5min, 1h, 6h and 24h of a specific BSC token

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the BSC network.
▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific token](ttps://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_3)

#### Top 10 BSC Tokens by Price Change in last 1h

This query gets you top 10 BSC Tokens by Price Change in last 1h.
▶️ [Top 10 BSC Tokens by Price Change in last 1h](https://ide.bitquery.io/Top-10-bsc-tokens-by-price-change-in-last-1-hr)

#### Top Gainers on BSC

Get Top Gainers for the BSC network.  
▶️[Top Gainers](https://ide.bitquery.io/bsc-top-gainers)

#### FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Track token activity (OHLC, price, volume) every 1 second on FourMeme DEX (BSC).
▶️ [FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/FourMeme-DEX-tokens-1-second-price-stream-with-OHLC)

### Token Analytics

#### Get Total Supply and Marketcap of an ERC20 token

Get Total Supply and Marketcap of an ERC20 token.
▶️ [Get Total Supply and Marketcap of an ERC20 token](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc_1)

#### BSC Token Holders

This query returns the top `50` holders of a given BEP-20 token.  
▶️[BSC Token Holders](https://ide.bitquery.io/Top-10-holders-of-a-token-on-BSC)

#### Trading Pairs on a BSC DEX

Get all trading pairs present on a BSC network DEX.  
▶️[Trading Pairs](https://ide.bitquery.io/trading-pairs-on-BNB-by-USD-volume)

### Slippage APIs

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on BSC. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Pancakeswap)

### Liquidity APIs

#### Latest Liquidity Changes of a Specific Pool

This query retrieves the latest liquidity events for a specific DEX pool on BSC. Use this to check current pool reserves, spot prices, and recent liquidity changes for a particular token pair.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_2#)

### Four Meme APIs

#### Stream Real-time MarketCap of FourMeme Tokens

Real-time market cap stream with OHLC for FourMeme tokens at 1-second intervals. Market cap is calculated from price using fixed 1 billion supply.
▶️[Real-time Mcap](https://ide.bitquery.io/Real-Time-Marektcap-and-price-for-Four-meme-tokens)

#### Trade Metrics of a Four Meme Token

This query returns the traded volume and number of trades for a particular Four Meme token in different time frames, namely 24 hours, 1 hour and 5 minutes.  
▶️[Token Trade Metrics](https://ide.bitquery.io/volume-and-trades-for-a-token-in-different-time-frames_1)

#### Get Newly Created Tokens on Four Meme

This query retrieves newly created tokens on Four Meme by listening to the `TokenCreate` event. The response provides token information including creator address, token contract address, name, symbol, total supply, and launch details.
▶️[Get Newly Created Tokens](https://ide.bitquery.io/track-Four-meme-token-creation-using-events)

#### Track Four Meme Token migrations to PancakeSwap

This query tracks four meme token migrations to Pancakeswap in realtime by monitoring transactions sent to the Four Meme factory address and filtering for `PairCreated` and `PoolCreated` events. These events are emitted when a token graduates from Four Meme and migrates to Pancakeswap.
▶️[Track Four meme migrations](https://ide.bitquery.io/four-meme-migration-to-pancakeswap)

#### Get Dev and Age of Four Meme Token

Below query retrieves the Dev address and time when a Four Meme Token was created.
▶️[Get Dev and Age of Four Meme Token](https://ide.bitquery.io/get-dev-and-age-of-a-four-meme-token)

## TRON

### Balance APIs

#### Tron Balance Updates

This query returns the most recent balance updates that occurred on the TRON network.  
▶️ [TRON Balance Updates](https://ide.bitquery.io/Tron-BalanceUpdates)

### Transfers

#### TRON Transfers

This query returns the most recent transfers on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.  
▶️ [TRON Transfers](https://ide.bitquery.io/Tron-transfer)

### Trades

#### Tron DEX Trades

This query returns the latest trades on the TRON network where the buy and sell sides are distinguished.  
▶️ [TRON DEX Trades](https://ide.bitquery.io/Tron-DEX-Trades_1)

#### Tron Dex Trade By Tokens

This query returns the latest token trades on the TRON network.  
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Tron-DexTradeByTokens_1)

## Bitcoin

### Balance APIs

#### Bitcoin Balance API

Retrieve the total incoming and outgoing transactions for a specific Bitcoin wallet. The balance is calculated as: Balance = Total Output - Total Input. You can also specify a date to get the historical balance.

▶️ [Bitcoin Balance API](https://ide.bitquery.io/Bitcoin-balance-using-input-outputs)

#### Bitcoin Balance for multiple addresses

This query calculates the combined balance of multiple Bitcoin wallet addresses by summing their total inflows and outflows: Balance = Total Output - Total Input. You can also set a date to get balances as of a specific point in time.

▶️ [Bitcoin Balance for multiple addresses](https://ide.bitquery.io/BTC-balance-api-for-multiple-addresses)

### Transfers

#### Inflows and Outflows of a wallet

This API returns all incoming and outgoing transactions for a specific Bitcoin wallet address.

▶️ [Inflows and Outflows of a wallet](https://ide.bitquery.io/Inflows-and-Outflow-of-a-bitcoin-wallet)

### Price Data

#### Latest Bitcoin Price

You can stream Bitcoin price at 1-second interval using the [Crypto Price APIs](https://docs.bitquery.io/docs/trading/crypto-price-api/introduction/).

▶️ [Bitcoin Price Stream](https://ide.bitquery.io/Stream-Bitcoin-Price-Across-Chains)

### Transactions

#### Details of Bitcoin Transaction

This API provides comprehensive details of a specific Bitcoin transaction in a single query.

▶️ [Details of Bitcoin Transaction](https://ide.bitquery.io/Details-of-Bitcoin-Transaction)

## Cardano

### Balance APIs

#### Cardano Balance

This query returns the current balance of a user on Cardano network.  
▶️ [Cardano Balance](https://ide.bitquery.io/cardano-address-balance_1)

### Transfers

#### Cardano Transfers

This query returns the latest transfers on Cardano network.
▶️ [Cardano Transfers](https://ide.bitquery.io/Cardano-Transfers_1)

#### Cardano User Transfers

This query returns the latest transfers for a useron Cardano network.  
▶️ [Cardano User Transfers](https://ide.bitquery.io/cardano-transfers-of-a-wallet)

### OHLC & Price Data

#### Cardano Price

This query returns the latest price of Cardano on Cardano Network.  
▶️ [Cardano Price](https://ide.bitquery.io/latest-cardano-price)

## Ripple

### Balance APIs

#### Ripple Historical Balance

This query returns all historical balance of an address on Ripple network.  
▶️ [Ripple Balance](https://ide.bitquery.io/historical-balances-of-a-ripple-address)

### Transfers

#### Ripple Historical Transfers

This query returns all the historical transfers done by a specific address on the Ripple network.  
▶️ [Ripple Transfers](https://ide.bitquery.io/All-historical-transfers-of-an-individual-address)

### Trades

#### Ripple Token DEX Trades

This query returns the latest trades of a currency on the Ripple network.  
▶️ [Ripple Token DEX Trades](https://ide.bitquery.io/trades-for-CNY-on-ripple)

### Transactions

#### Transaction Details using Hash

This query uses transaction hash and date range as filter to fetch tx details.

▶️ [XRPL Transaction Details](https://ide.bitquery.io/xrpl-search-tx-details)

#### Ripple Payments

This query returns the latest payments on Ripple network.  
▶️ [Ripple Payments](https://ide.bitquery.io/Latest-payments-on-ripple-blockchain)

## Cosmos

### Balance APIs

#### Cosmos address balance and staking reward details

This query provides balance and staking reward information for the Cosmos blockchain.
▶️ [Cosmos address balance and staking reward details](https://ide.bitquery.io/Cosmos-balance-staking-rewards-of-an-address)

## NFT APIs

#### Get NFTs a specific wallet holds

Get NFTs owned by a given address.
▶️ [Get NFTs by wallet](https://ide.bitquery.io/Get-NFTs-by-wallet_1)

#### Get NFTs a contract holds

Get NFTs for a given contract address, including metadata for all NFTs (where available).
▶️ [Get NFTs by contract](https://ide.bitquery.io/Get-NFTs-by-wallet_1)

#### Get NFT metadata

Get NFT data, including metadata (where available), for the given NFT contract address.
▶️ [Get NFT metadata](https://ide.bitquery.io/Get-NFT-metadata)

#### Get Metadata for Multiple NFT Contracts

Get the metadata for a given list of contract addresses.
▶️ [Get Metadata for Multiple NFT Contracts](https://ide.bitquery.io/Get-Metadata-for-Multiple-NFT-Contracts_1)

#### Get NFT transfers by wallet

Get transfers of NFTs given the wallet.
▶️ [Get NFT transfers by wallet](https://ide.bitquery.io/latest-nft-transfers-by-a-user)

#### Get NFT owners by contract

Get owners of NFTs for a given contract.
▶️ [Get NFT owners by contract](https://ide.bitquery.io/top-token-holders-of-Moonwalker-NFT)

#### Get NFT owners by token ID

Get owners of a specific NFT given the contract address and token ID.
▶️ [Get NFT owners by token ID](https://ide.bitquery.io/Who-owns-specific-NFT)

#### Get Latest NFT Balance for an Address

Get the latest NFT balance for a specific address and NFT collection. This query returns the current NFT count and ownership information.
▶️ [Get Latest NFT Balance for an Address](https://ide.bitquery.io/Get-Latest-NFT-Balance-for-an-Address)

#### Get All NFT Collections for an Address

Retrieve all NFT collections held by a specific address. This query returns balances for all NFT collections the address owns.
▶️ [Get All NFT Collections for an Address](https://ide.bitquery.io/Get-All-NFT-Collections-for-an-Address_1)

#### Get NFT Owner for Specific Token ID

Check the current owner of a specific NFT token ID. This query returns ownership information for a particular token.
▶️ [Get NFT Owner for Specific Token ID](https://ide.bitquery.io/Get-NFT-Owner-for-Specific-Token-ID)

#### Get NFT trades for a specific NFT contract on specific marketplace

Get trades of NFTs for a given contract and marketplace.
▶️ [Get NFT trades by contract](https://ide.bitquery.io/Get-NFT-trades-by-contract)

#### Get NFT trades for a specific NFT contract and token ID

Get trades of NFTs for a given contract and token ID.
▶️ [Get NFT trades by token](hhttps://ide.bitquery.io/Get-NFT-trades-by-token)

#### Get NFT trades by wallet

Get trades of NFTs for a given wallet.
▶️ [Get NFT trades by wallet](https://ide.bitquery.io/Get-trades-of-NFTs-for-a-given-wallet)

#### Get all NFTs in a collection

Get all NFTs in a collection.
▶️ [Get all NFTs in a collection](https://ide.bitquery.io/Get-all-NFTs-for-a-collection)

#### Latest NFT Trades

This query gets the latest 10 NFT trades on Ethereum mainnet. You can increase the limit to whatever you like, up to 25,000. Currently, it only retrieves data from the real-time database. To include historical data, use `dataset: combined`.  
▶️ [Latest NFT Trades](https://ide.bitquery.io/Latest-NFT-trades-on-ETH)

#### Top Traded NFTs in a Period

This query gets the top 10 traded NFTs based on the number of trades within a specified date range. You can change the filters such as the date range and limit.  
▶️ [Top Traded NFTs](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month)

## Polymarket

### Main Polymarket Contract

#### All Available Events

Get all events emitted by the main Polymarket contract to track all platform activities.
▶️ [All Available Events](https://ide.bitquery.io/PolyMarket---All-Available-Events)

#### Discover Newly Created Markets

Track fresh Polymarket prediction markets as they are initialized on Polygon by following `ConditionPreparation` events from the main Polymarket contract.
▶️ [Polymarket Newly Created Questions / Market ID](https://ide.bitquery.io/Polymarket-Newly-Created-MarketQuestions)

#### Latest Position Splits

Track when users split their collateral into outcome-specific position tokens.
▶️ [Latest Position Split](https://ide.bitquery.io/PolyMarket---Latest-Position-Split)

#### Latest Resolved Questions

Monitor recently resolved prediction markets and their outcomes.
▶️ [Latest Resolved Questions](https://ide.bitquery.io/PolyMarket---Latest-Resolved-Questions)

#### Payout Received by Polymarket Trader

Track all payouts received by a specific trader when they redeem winning positions.
▶️ [Payout Received by Polymarket Trader](https://ide.bitquery.io/Payout-received-by-polymarket-trader)

### UMA Adapter Contract

#### All UMA Adapter Events

Get all events emitted by the UMA Adapter contract to track all oracle-related activities.
▶️ [All UMA Adapter Events](https://ide.bitquery.io/PolyMarket---UMA-Adapter-All-events)

#### New Questions Initialized

Track new questions and get market metadata including ancillaryData from the UMA Adapter contract.
▶️ [Question Initialized Events](https://ide.bitquery.io/PolyMarket---UMA-Adapter-Question-Initialized)

#### Question Resolved Events

Monitor when questions are resolved by the oracle.
▶️ [Question Resolved Events](https://ide.bitquery.io/PolyMarket---UMA-Adapter-Question-Resolved)

### CTF Exchange Contract

#### Token Registered Events

Track when new outcome tokens are registered for trading.
▶️ [Token Registered Events](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----TokenRegistered-Event)

#### Orders Matched Events

Monitor successful order matching and trade executions.
▶️ [Orders Matched Events](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderMatched-Event_2)

#### Order Filled Events

Track individual order fills and partial executions to calculate market prices.
▶️ [Order Filled Events](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderFilled-Event)

## x402 APIs

### Base

#### Get Latest Payments to x402 Server

Retrieves the most recent payments made to a specific x402 server on Base network.
▶️ [Latest Payment to x402 Server](https://ide.bitquery.io/Latest-payment-to-specific-x402-server)

#### Payment Analytics for x402 Server

Comprehensive payment analytics including total volume, unique users, transaction counts, and time-based breakdowns for a specific x402 server.
▶️ [Payment Analytics for x402 Server](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server)

### Solana

#### Get Latest Payments to x402 Server on Solana

Retrieves the most recent payments made to a specific x402 server on Solana network.
▶️ [Latest Payment to x402 Server on Solana](https://ide.bitquery.io/Latest-Payment-to-specific-x402-server-taking-solana-payments)

#### Payment Analytics for x402 Server on Solana

Comprehensive payment analytics for a specific x402 server on Solana including total volume, unique users, and transaction counts.
▶️ [Payment Analytics for x402 Server on Solana](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server-on-Solana)
