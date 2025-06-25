# Starter Queries

Below is a set of queries that are curated for you to get started with Bitquery.

## Table of Contents

- [Solana APIs](#solana-trade-api)
- [PumpFun API](#pumpfun-api)
- [Raydium API](#raydium-api)
- [EVM APIs](#evm)
- [NFT APIs](#nft-apis)
- [Uniswap V3 API](#uniswap-v3-api)
- [TRON APIs](#tron)
- [Bitcoin APIs](#bitcoin)
- [Cardano APIs](#cardano)
- [Ripple APIs](#ripple)
- [More APIs](#more-apis)

## Solana Trade API

### Solana Trades

This query gets the latest 10 trades on Solana. You can increase the limit to get more trades. This query only uses real-time data.  
▶️ [Solana Trades](https://ide.bitquery.io/Solana-dextrades)

### Solana Trades of a Token

With this, you can query the trades of a token against another currency like WSOL or USDC.  
▶️ [Trades of a Token](https://ide.bitquery.io/Latest-Trades-of-Trump-COin)

### Get OHLCV by Pair Address

You can get charting data easily with this query. Adjust the intervals as necessary. This query supports historical data.  
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC-for-a-token_1)

### Get Trades by Wallet Address

Get all trades related transactions (buy, sell) for a specific wallet address.
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/Trades-of-wallets-in-realtime_1)

### Get Swaps by Pair Address

Get all trades related transactions for a specific pair address.
▶️ [Get Swaps by Pair Address](https://ide.bitquery.io/Get-Swaps-by-Pair-Address)

### Get Volume Stats for Solana Chain

Returns volume statistics, active wallets, and total transactions for Solana.
▶️ [Get Volume Stats By Chain](https://ide.bitquery.io/Chain-stats-like-total-volume-traded-total-transactions-active-wallets)

## Solana Balance API

### Get SPL Token Balances by Wallet

Gets the token balances owned by a given network and address.
▶️ [Get SPL Token Balances by Wallet](https://ide.bitquery.io/spl-token-balance-for-an-address)

### Get Native and SPL Token Balance by Wallet

Gets the portfolio for an address.
▶️ [Get Native and SPL Token Balance by Wallet](https://ide.bitquery.io/tokens-owned-by-an-address)

### Solana Balance Update

This query returns Solana balance update info for any balance update event. It includes the address, amount, currency details, and the amount of tokens present in a particular address before and after the update.  
▶️ [Balance Update](https://ide.bitquery.io/solana-balance-update)

## Solana Pools API

### All Token Pairs Across DEXs with Current Liquidity

This query retrieves all instances of a specific token pair across decentralized exchanges (DEXs) on Solana, along with their current liquidity.
▶️ [All Token Pairs Across DEXs with Current Liquidity](https://ide.bitquery.io/All-Liquidity-pairs-of-a-token-and-current-liquidity-on-solana)

### Solana Pool Liquidity Changes

This query retrieves the latest changes to liquidity pools on Solana, including the change amount and the price at which the change happened. This query also uses only the real-time data set.  
▶️ [Solana Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools)

## Solana Token API

### Get Token Prices on Solana

Returns price information for multiple Solana tokens in a single request.
▶️ [Get Multiple Token Prices on Solana](https://ide.bitquery.io/Get-multiple-Token-Prices)

### Get Token Metadata

Get the token metadata for contract (mint, standard, name, symbol).
▶️ [Get Token Metadata](https://ide.bitquery.io/Solana-currency-details)

### Get Top Token Holders

Get a list of top token holders for a specific Solana token address.
▶️ [Get Top Token Holders](https://ide.bitquery.io/top-100-holders-of-USDC-token-on-Solana)

### Get Token Pairs by Address

Get the supported pairs for a specific token address.
▶️ [Get Token Pairs by Address](https://ide.bitquery.io/traded-pairs-of-a-token_2)

### Get Token Pair Stats

Get the pair stats by using pair address.
▶️ [Get Token Pair Stats](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair)

### Get Aggregated Token Pair Stats

Get aggregated statistics across supported pairs of a token.
▶️ [Get Aggregated Token Pair Stats](https://ide.bitquery.io/traded-pairs-stats-of-a-token)

### Get Multiple Token Analytics

Returns analytics data for multiple token addresses.
▶️ [Get Multiple Token Analytics](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-multiple-solana-tokens)

### Search Tokens

Search for tokens based on contract address, token name or token symbol.
▶️ [Search Tokens based on token symbol](https://ide.bitquery.io/Token-Search-API---trump-symbol)
▶️ [Search Tokens based on token name](https://ide.bitquery.io/Token-search-api-in-mint-address)

## Other Solana API

### Solana Transfers

This query gets the latest 10 transfers on Solana. You can increase the limit to get more transfers. This query only uses real-time data.  
▶️ [Solana Transfers](https://ide.bitquery.io/Solana-transfers0_5)

### Solana Instructions

This query gets the latest 10 instructions executed on Solana. You can increase the limit to get more instructions. This query only uses the real-time dataset.  
▶️ [Solana Instructions](https://ide.bitquery.io/solana-instructions_7)

### Solana Token Supply Updates

This query tracks the latest token supply updates to a particular token pair. You can modify the same query to a subscription and track these changes in real time.  
▶️ [Token Supply Updates](https://ide.bitquery.io/Solana-token-supply-updates_1)

### Solana Transactions

This query returns the Solana transaction info such as signature, signer, success, fees, time, etc.  
▶️ [Solana Transactions](https://ide.bitquery.io/Solana-transaction_4)

### Solana Rewards

This query returns Solana network rewards info such as the address that receives the reward, reward amount, type, and the time when the reward was received.  
▶️ [Solana Rewards](https://ide.bitquery.io/Solana-Rewards_1)

### Solana Instruction Balance Updates

This query returns Solana balance update info for any balance update event, including the address, amount, currency details, and the details of the program responsible for this update.  
▶️ [Instruction Balance Updates](https://ide.bitquery.io/Solana-InstructionBalanceUpdates)

### Solana Historical Transfers

▶️ [Solana Historical Transfers](https://ide.bitquery.io/solana-historical-transfers_1)

## Solana historical data

### Solana Historical Token Transfers Over Time

This API provides historical data on all Solana token transfers that occurred within a specified time range.
▶️ [Solana Historical Token Transfers Over Time](https://ide.bitquery.io/Solana-historical-token-transfers-between-a-time_2)


### Solana Token Transfers for a Specific Address
This API retrieves the history of token transfers (both sent and received) for a specific Solana address within a defined time period.
▶️ [Solana Token Transfers for a Specific Address](https://ide.bitquery.io/Solana-historical-token-transfers-of-an-address-between-a-time)
 

### Solana Token Inflows and Outflows for Balance Calculation
This API returns all token inflows and outflows for a Solana address within a specified timeframe, enabling balance calculation based on transaction history.
▶️ [Solana Token Inflows and Outflows for Balance Calculation](https://ide.bitquery.io/currency-sent-and-received-by-an-address-between-a-time_1)


## PumpFun - Pumpswap API

### Get New Tokens for PumpFun

Returns a list of newly created tokens on the Pump Fun.
▶️ [Get New Tokens for PumpFun](https://ide.bitquery.io/newly-created-PF-token-dev-address-metadata)

### Get Bonding Curve Progress of a Token on Pump Fun

Returns Bonding Curve Percentage of a Token on the Pump Fun.
▶️ [Bonding Curve Percentage of a Token on Pump Fun](https://docs.bitquery.io/docs/examples/Solana/Pump-Fun-Marketcap-Bonding-Curve-API/#bonding-curve-progress-api)

### Get Graduated Tokens by Exchange

Returns a list of tokens that have graduated (completed bonding phase) on Pump Fun to PumpSwap.
▶️ [Get Graduated Tokens by Exchange](https://ide.bitquery.io/track-Pump-fun-migration-using-joins_3)

### Top PumpFun Tokens by Marketcap

This query returns the top 10 PumpFun tokens based on market cap. You can increase the limit to get more tokens.  
▶️ [Top Tokens by Marketcap](https://ide.bitquery.io/top-tokens-by-mktcap-on-pump-fun-in-last-15-min)

### Latest Trades in Real Time

This subscription query returns the latest PumpFun trades in real time.  
▶️ [Real-time Trades](https://ide.bitquery.io/Pumpfun-DEX-Trades_1#)

## Raydium API

### Latest Trades on Launchpad

This query returns the 50 most recent trades on the Raydium launchpad. You can increase the limit to get more trades.  
▶️ [Launchpad Trades](https://ide.bitquery.io/Latest-Trades-on-Launchpad)

### Latest Price of a Token on Raydium

This query returns the latest price of a token when traded against another token on the Raydium launchpad.  
▶️ [Live Token Price](https://ide.bitquery.io/live-price-of-token-on-raydium---updated)

## EVM Token Holder API

### Token Holder Count on a Specific Date

This API returns the total number of holders for a specific token on a given date.
▶️ [Token Holder Count on a Specific Date](https://ide.bitquery.io/token-holder-count_3)


### Token Holders and Stats on a Specific Date

This API provides a list of all holders along with relevant statistics for a given token on a specific date.
▶️ [Token Holders and Stats on a Specific Date](https://ide.bitquery.io/tokens-holders-of-a-token_3)


### Real-Time Holders of Multiple Tokens

This API leverages the balanceUpdate endpoint to deliver real-time holder data for multiple tokens.
▶️ [ Real-Time Holders of Multiple Tokens](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-BSC)


### Common Holders Across Multiple Tokens

This API identifies addresses that hold multiple specified tokens
▶️ [Common Holders Across Multiple Tokens](https://ide.bitquery.io/common-token-holders)

## Ethereum API

### Get ERC20 token transfers by wallet

Get ERC20 token transactions ordered by block number in descending order.       
▶️ [Get ERC20 token transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet_2)

### Get Native & ERC20 Token Balances by Wallet

Get token balances for a specific wallet address.       
▶️ [Get Native & ERC20 Token Balances by Wallet](https://ide.bitquery.io/balance-of-a-wallet_1)

### Get ERC20 Token Balance by Wallet

Get token balances for a specific wallet address.       
▶️ [Get ERC20 Token Balance by Wallet](https://ide.bitquery.io/Get-ERC20-Token-Balance-by-Wallet)

### Get Swaps by Wallet Address

Get all swap related transactions (buy, sell).      
▶️ [Get Swaps by Wallet Address](https://ide.bitquery.io/latest_trades_by_maker)

### Get wallet net worth

Get the net worth of a wallet in USD.       
▶️ [Get wallet net worth](https://ide.bitquery.io/balance-of-a-wallet-in-USD_2)

### Get Multiple ERC20 Token Prices

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address.       
▶️ [Get Multiple ERC20 Token Prices](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime)

### Get OHLCV by Pair Address

Get the OHLCV candle stick by using pair address.       
▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC0_8)

### Get transactions by wallet

Get transactions ordered by block number in descending order.       
▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet)

### Ethereum DEX Trades

This query returns the latest trades on the Ethereum network where distinction of the buy and sell sides is present.        
▶️ [Ethereum DEX Trades](https://ide.bitquery.io/Ethereum-dextrades)

### Ethereum Dex Trade By Tokens

This query returns the latest trades on the Ethereum network. This is useful when looking for trades of a token without worrying about the buy or sell side.        
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Ethereum-DexTradeByTokens)

### Ethereum Events

This query returns event info and logs for the Ethereum network. It includes arguments passed, transaction details, log info, block info, and more.         
▶️ [Ethereum Events](https://ide.bitquery.io/ethereum-events-api)

### Ethereum Calls

Every interaction with any EVM network, from contract creation to fund transfer, is denoted by a call. This query returns the call data for the Ethereum network.       
▶️ [Ethereum Calls](https://ide.bitquery.io/Ethereum-calls-query)

### Ethereum Miner Rewards

This query returns mining rewards info for Ethereum, including transaction fees, fees burnt, rewards received, and more.        
▶️ [Miner Rewards](https://ide.bitquery.io/Ethereum-miner-rewards)

## BSC API

### BSC Token Holders

This query returns the top `50` holders of a given BEP-20 token.        
▶️[BSC Token Holders](https://ide.bitquery.io/Top-10-holders-of-a-token-on-BSC)

### Buys of a Token on BNB
This query returns the latest `100` buys of a given BEP-20 token. 
▶️[BSC Token Buys](https://ide.bitquery.io/BNB-Token-Buys)

### OHLC for a BEP-20 Token

Get OHLC statistics for a BEP-20 token on BSC network.              
▶️[OHLC of a Token](https://ide.bitquery.io/OHLC-for-a-token-on-bsc_1)

### Top Gainers on BSC

Get Top Gainers for the BSC network.        
▶️[Top Gainers](https://ide.bitquery.io/bsc-top-gainers)

### Top Gainers on BSC

Get Top Gainers for the BSC network.        
▶️[Top Gainers](https://ide.bitquery.io/bsc-top-gainers)

### BEP-20 Token Price

Get the latest price of a BEP-20 token on BSC network.      
▶️[Token Price](https://ide.bitquery.io/realtime-usd-price-of-a-token)

### Trading Pairs on a BSC DEX

Get all trading pairs present on a BSC network DEX.      
▶️[Trading Pairs](https://ide.bitquery.io/trading-pairs-on-a-specific-dex_1)

## Four Meme API

### Trade Metrics of a Four Meme Token

This query returns the traded volume and number of trades for a particular Four Meme token in different time frames, namely 24 hours, 1 hour and 5 minutes.     
▶️[Token Trade Metrics](https://ide.bitquery.io/volume-and-trades-for-a-token-in-different-time-frames_1)

### Latest and Historical Trades of a User

Get the latest and historical trades by a user on `Four Meme` platform.     
▶️[User Trades](https://ide.bitquery.io/Get-all-trades-of-a-trader-on-four-meme)

### Liquidity Addition for Four Meme Token

Get the liquidity addition events for a specific token on the Four Meme Exchange.       
▶️[Liquidity Addition](https://ide.bitquery.io/Liquidity-Added-to-specific-tokens-on-Four-meme)

## Pancakeswap APIs

### Latest Token Trades

Get the latest trades of a token on Pancakeswap.        
▶️[Token Trades](https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-token)

### Price of a Token

Get the latest price of a token traded on Pancakeswap.      
▶️[Token Price on Pancakeswap](https://ide.bitquery.io/BSC-PancakeSwap-v3-Price-for-a-token)

### OHLC of a Token

Get the OHLC stats of a token traded on Pancakeswap.        
▶️[Token OHLC](https://ide.bitquery.io/BSC-Pancake-V3-OHLC-data_1)

### Trades by User on Pancakeswap

Get the latest trades by a user on Pancakeswap.      
▶️[User Trades](https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-trader)

## NFT APIs

### Get NFTs a specific wallet holds

Get NFTs owned by a given address.
▶️ [Get NFTs by wallet](https://ide.bitquery.io/Get-NFTs-by-wallet_1)

### Get NFTs a contract holds

Get NFTs for a given contract address, including metadata for all NFTs (where available).
▶️ [Get NFTs by contract](https://ide.bitquery.io/Get-NFTs-by-wallet_1)

### Get NFT metadata

Get NFT data, including metadata (where available), for the given NFT contract address.
▶️ [Get NFT metadata](https://ide.bitquery.io/Get-NFT-metadata)

### Get Metadata for Multiple NFT Contracts

Get the metadata for a given list of contract addresses.
▶️ [Get Metadata for Multiple NFT Contracts](https://ide.bitquery.io/Get-Metadata-for-Multiple-NFT-Contracts_1)

### Get NFT transfers by wallet

Get transfers of NFTs given the wallet.
▶️ [Get NFT transfers by wallet](https://ide.bitquery.io/latest-nft-transfers-by-a-user)

### Get NFT owners by contract

Get owners of NFTs for a given contract.
▶️ [Get NFT owners by contract](https://ide.bitquery.io/top-token-holders-of-Moonwalker-NFT)

### Get NFT owners by token ID

Get owners of a specific NFT given the contract address and token ID.
▶️ [Get NFT owners by token ID](https://ide.bitquery.io/Who-owns-specific-NFT)

### Get NFT trades for a specific NFT contract on specific marketplace

Get trades of NFTs for a given contract and marketplace.
▶️ [Get NFT trades by contract](https://ide.bitquery.io/Get-NFT-trades-by-contract)

### Get NFT trades for a specific NFT contract and token ID

Get trades of NFTs for a given contract and token ID.
▶️ [Get NFT trades by token](hhttps://ide.bitquery.io/Get-NFT-trades-by-token)

### Get NFT trades by wallet

Get trades of NFTs for a given wallet.
▶️ [Get NFT trades by wallet](https://ide.bitquery.io/Get-trades-of-NFTs-for-a-given-wallet)

### Get all NFTs in a collection

Get all NFTs in a collection.
▶️ [Get all NFTs in a collection](https://ide.bitquery.io/Get-all-NFTs-for-a-collection)

### Latest NFT Trades

This query gets the latest 10 NFT trades on Ethereum mainnet. You can increase the limit to whatever you like, up to 25,000. Currently, it only retrieves data from the real-time database. To include historical data, use `dataset: combined`.  
▶️ [Latest NFT Trades](https://ide.bitquery.io/Latest-NFT-trades-on-ETH)

### Top Traded NFTs in a Period

This query gets the top 10 traded NFTs based on the number of trades within a specified date range. You can change the filters such as the date range and limit.  
▶️ [Top Traded NFTs](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month)

## TRON

### Tron Balance Updates

This query returns the most recent balance updates that occurred on the TRON network.  
▶️ [TRON Balance Updates](https://ide.bitquery.io/Tron-BalanceUpdates)

### Tron DEX Trades

This query returns the latest trades on the TRON network where the buy and sell sides are distinguished.  
▶️ [TRON DEX Trades](https://ide.bitquery.io/Tron-DEX-Trades_1)

### Tron Dex Trade By Tokens

This query returns the latest token trades on the TRON network.  
▶️ [DexTrade By Tokens](https://ide.bitquery.io/Tron-DexTradeByTokens_1)

### TRON Transfers

This query returns the most recent transfers on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.  
▶️ [TRON Transfers](https://ide.bitquery.io/Tron-transfer)

### TRON Transactions

This query returns the most recent transactions for the TRON network. It includes data such as transaction hash, time, and success status.  
▶️ [TRON Transactions](https://ide.bitquery.io/Tron-transactions_2)

### TRON Events

This query returns the most recent events and logs for the TRON network. It includes arguments entered (if any), transaction details, log signatures, block info, and more.  
▶️ [TRON Events](https://ide.bitquery.io/Tron-Events)

## Bitcoin

### Bitcoin Balance API

Retrieve the total incoming and outgoing transactions for a specific Bitcoin wallet. The balance is calculated as: Balance = Total Output - Total Input. You can also specify a date to get the historical balance.

▶️ [Bitcoin Balance API](https://ide.bitquery.io/Bitcoin-balance-using-input-outputs)

### Bitcoin Balance for multiple addresses

This query calculates the combined balance of multiple Bitcoin wallet addresses by summing their total inflows and outflows: Balance = Total Output - Total Input. You can also set a date to get balances as of a specific point in time.

▶️ [Bitcoin Balance for multiple addresses](https://ide.bitquery.io/BTC-balance-api-for-multiple-addresses)

### Latest Bitcoin Price

You can get price of Bitcoin on a particular day or period using this API.

▶️ [Bitcoin Balance for multiple addresses](https://ide.bitquery.io/btc-price-in-2016)

### Inflows and Outflows of a wallet

This API returns all incoming and outgoing transactions for a specific Bitcoin wallet address.

▶️ [Inflows and Outflows of a wallet](https://ide.bitquery.io/Inflows-and-Outflow-of-a-bitcoin-wallet)

### Details of Bitcoin Transaction

This API provides comprehensive details of a specific Bitcoin transaction in a single query.

▶️ [Details of Bitcoin Transaction](https://ide.bitquery.io/Details-of-Bitcoin-Transaction)

## Cardano

### Cardano Transfers
This query returns the latest transfers on Cardano network.
▶️ [Cardano Transfers](https://ide.bitquery.io/Cardano-Transfers_1)

### Cardano User Transfers
This query returns the latest transfers for a useron Cardano network.      
▶️ [Cardano User Transfers](https://ide.bitquery.io/cardano-transfers-of-a-wallet)

### Cardano Balance
This query returns the current balance of a user on Cardano network.      
▶️ [Cardano Balance](https://ide.bitquery.io/cardano-address-balance_1)

### Cardano Staking
This query returns the amount staked by a user on Cardano network.       
▶️ [Cardano Transfers](https://ide.bitquery.io/cardano-staking-balance)

### Cardano Price
This query returns the latest price of Cardano on Cardano Network.        
▶️ [Cardano Price](https://ide.bitquery.io/latest-cardano-price) 

### Cardano Minting
This query returns the latest currencies minted on Cardano network.     
▶️ [Cardano Miniting](https://ide.bitquery.io/currency-minted-on-cardano)

## Ripple

### Ripple Historical Balance

This query returns all historical balance of an address on Ripple network.  
▶️ [Ripple Balance](https://ide.bitquery.io/historical-balances-of-a-ripple-address)

### Ripple Token DEX Trades

This query returns the latest trades of a currency on the Ripple network.  
▶️ [Ripple Token DEX Trades](https://ide.bitquery.io/trades-for-CNY-on-ripple)

### Ripple Payments

This query returns the latest payments on Ripple network.  
▶️ [Ripple Payments](https://ide.bitquery.io/Latest-payments-on-ripple-blockchain)

### Ripple Historical Transfers

This query returns all the historical transfers done by a specific address on the Ripple network.  
▶️ [Ripple Transfers](https://ide.bitquery.io/All-historical-transfers-of-an-individual-address)

## Cosmos

### Cosmos address balance and staking reward details

This query provides balance and staking reward information for the Cosmos blockchain.
▶️ [Cosmos address balance and staking reward details](https://ide.bitquery.io/Cosmos-balance-staking-rewards-of-an-address)

## More APIs

You will find more APIs and detailed information about them in relevant sections.

- [Querying Capabilities](https://docs.bitquery.io/docs/category/capabilities/)
- [L1 Chains](https://docs.bitquery.io/docs/category/l1-chains/)
- [L2 Chains](https://docs.bitquery.io/docs/category/l2-chains/)
