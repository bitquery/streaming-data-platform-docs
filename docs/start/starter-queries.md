# Starter Queries

Below is a set of queries that are curated for you to get started with Bitquery. You will find more APIs and detailed information about them in relevant sections.

- [Querying Capabilities](https://docs.bitquery.io/docs/category/capabilities/)
- [L1 Chains](https://docs.bitquery.io/docs/category/l1-chains/)
- [L2 Chains](https://docs.bitquery.io/docs/category/l2-chains/)

## Solana

### Solana Transfers

This query gets the latest 10 transfers on Solana. You can increase the limit to get more transfers. This query only uses real-time data.  
[Solana Transfers](https://ide.bitquery.io/Solana-transfers0_5)

### Solana Trades

This query gets the latest 10 trades on Solana. You can increase the limit to get more trades. This query only uses real-time data.  
[Solana Trades](https://ide.bitquery.io/Solana-dextrades)

The same query, when modified, streams real-time trades:  
[Real-time Trade Stream](https://ide.bitquery.io/solana-stream-test_5)

### Solana Trades of a Token

With this, you can query the trades of a token against another currency like WSOL or USDC.  
[Trades of a Token](https://ide.bitquery.io/Latest-Trades-of-Trump-COin)

### Solana OHLC / K-line

You can get charting data easily with this query. Adjust the intervals as necessary. This query supports historical data.  
[Solana OHLC](https://ide.bitquery.io/historical-ohlc-for-solana_3)

### Solana Instructions

This query gets the latest 10 instructions executed on Solana. You can increase the limit to get more instructions. This query only uses the real-time dataset.  
[Solana Instructions](https://ide.bitquery.io/solana-instructions_7)

### Solana Pool Liquidity Changes

This query retrieves the latest changes to liquidity pools on Solana, including the change amount and the price at which the change happened. This query also uses only the real-time data set.  
[Solana Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools)

### Solana Token Supply Updates

This query tracks the latest token supply updates to a particular token pair. You can modify the same query to a subscription and track these changes in real time.  
[Token Supply Updates](https://ide.bitquery.io/Solana-token-supply-updates)

### Solana Transactions

This query returns the Solana transaction info such as signature, signer, success, fees, time, etc.  
[Solana Transactions](https://ide.bitquery.io/Solana-transaction_4)

### Solana Rewards

This query returns Solana network rewards info such as the address that receives the reward, reward amount, type, and the time when the reward was received.  
[Solana Rewards](https://ide.bitquery.io/Solana-Rewards_1)

### Solana Balance Update

This query returns Solana balance update info for any balance update event. It includes the address, amount, currency details, and the amount of tokens present in a particular address before and after the update.  
[Balance Update](https://ide.bitquery.io/solana-balance-update-stream)

### Solana InstructionBalanceUpdates

This query returns Solana balance update info for any balance update event, including the address, amount, currency details, and the details of the program responsible for this update.  
[Instruction Balance Updates](https://ide.bitquery.io/Solana-InstructionBalanceUpdates)

### Solana Blocks

This query returns Solana block info such as block number, time, slot, rewards, and so on.  
[Solana Blocks](https://ide.bitquery.io/Solana-blocks)

## PumpFun API

### Top Tokens by Marketcap

This query returns the top 10 PumpFun tokens based on market cap. You can increase the limit to get more tokens.  
[Top Tokens by Marketcap](https://ide.bitquery.io/top-tokens-by-mktcap-on-pump-fun-in-last-15-min)

### Latest Trades in Real Time

This subscription query returns the latest PumpFun trades in real time.  
[Real-time Trades](https://ide.bitquery.io/Pumpfun-DEX-Trades_1#)

## Raydium API

### Latest Trades on Launchpad

This query returns the 50 most recent trades on the Raydium launchpad. You can increase the limit to get more trades.  
[Launchpad Trades](https://ide.bitquery.io/Latest-Trades-on-Launchpad)

### Latest Price of a Token

This query returns the latest price of a token when traded against another token on the Raydium launchpad.  
[Live Token Price](https://ide.bitquery.io/live-price-of-token-on-raydium---updated)

## EVM

### Ethereum Balance Update

This query returns the most recent balance updates that occurred on the Ethereum network.  
[Ethereum Balance Update](https://ide.bitquery.io/Ethereum-balance-update)

### Ethereum DEX Trades

This query returns the latest trades on the Ethereum network where distinction of the buy and sell sides is present.  
[Ethereum DEX Trades](https://ide.bitquery.io/Ethereum-dextrades)

### Ethereum DexTradeByTokens

This query returns the latest trades on the Ethereum network. This is useful when looking for trades of a token without worrying about the buy or sell side.  
[DexTrade By Tokens](https://ide.bitquery.io/Ethereum-DexTradeByTokens)

### Ethereum Transfers

This query returns transfers that occurred on the Ethereum network, including info such as amount of tokens transferred, sender, receiver, and currency details.  
[Ethereum Transfers](https://ide.bitquery.io/ethereum-transfers_5)

### Ethereum Events

This query returns event info and logs for the Ethereum network. It includes arguments passed, transaction details, log info, block info, and more.  
[Ethereum Events](https://ide.bitquery.io/ethereum-events-api)

### Ethereum Tokenholders

This query returns the top 100 token holders of a specific token on a particular date, sorted by the amount of tokens held. Note that this query uses the archive dataset and cannot retrieve current holders.  
[Token Holders](https://ide.bitquery.io/ethereum-token-holders_1)

### Ethereum Transactions

This query returns transaction info for the Ethereum network.  
[Ethereum Transactions](https://ide.bitquery.io/Ethereum-transactions_1)

### Ethereum Calls

Every interaction with any EVM network, from contract creation to fund transfer, is denoted by a call. This query returns the call data for the Ethereum network.  
[Ethereum Calls](https://ide.bitquery.io/Ethereum-calls-query)

### Ethereum Miner Rewards

This query returns mining rewards info for Ethereum, including transaction fees, fees burnt, rewards received, and more.  
[Miner Rewards](https://ide.bitquery.io/Ethereum-miner-rewards)

## NFT APIs

### Latest Trades

This query gets the latest 10 NFT trades on Ethereum mainnet. You can increase the limit to whatever you like, up to 25,000. Currently, it only retrieves data from the real-time database. To include historical data, use `dataset: combined`.  
[Latest NFT Trades](https://ide.bitquery.io/Latest-NFT-trades-on-ETH)

### Top Traded NFTs in a Period

This query gets the top 10 traded NFTs based on the number of trades within a specified date range. You can change the filters such as the date range and limit.  
[Top Traded NFTs](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month)

## Uniswap V3 API

### Real-time Uniswap V3 Trades

This subscription query retrieves real-time trade data from Uniswap V3.  
[Uniswap V3 Trades](https://ide.bitquery.io/Realtime-Uniswap-V3-Trades_1)

## TRON

### Tron Balance Updates

This query returns the most recent balance updates that occurred on the TRON network.  
[TRON Balance Updates](https://ide.bitquery.io/Tron-BalanceUpdates)

### Tron DEX Trades

This query returns the latest trades on the TRON network where the buy and sell sides are distinguished.  
[TRON DEX Trades](https://ide.bitquery.io/Tron-DEX-Trades_1)

### Tron DexTradeByTokens

This query returns the latest token trades on the TRON network.  
[DexTrade By Tokens](https://ide.bitquery.io/Tron-DexTradeByTokens_1)

### TRON Transfers

This query returns the most recent transfers on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.  
[TRON Transfers](https://ide.bitquery.io/Tron-transfer)

### TRON Transactions

This query returns the most recent transactions for the TRON network. It includes data such as transaction hash, time, and success status.  
[TRON Transactions](https://ide.bitquery.io/Tron-transactions_2)

### TRON Events

This query returns the most recent events and logs for the TRON network. It includes arguments entered (if any), transaction details, log signatures, block info, and more.  
[TRON Events](https://ide.bitquery.io/Tron-Events)
