# Starter Subscriptions

Below is a set of subscriptions that are curated for you to get started with Bitquery.

## Table of Contents

- [Cross-Chain / Multi-Chain APIs](#cross-chain--multi-chain-apis)
- [Ethereum](#ethereum)
- [Solana](#solana)
- [BSC (Binance Smart Chain)](#bsc-binance-smart-chain)
- [TRON](#tron)
- [NFT Streams](#nft-streams)
- [Polymarket](#polymarket)
- [x402 Streams](#x402-streams)

## Cross-Chain / Multi-Chain APIs

#### Crypto Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all tokens across Solana, Ethereum, BNB, Tron.

▶️ [Crypto Price Stream](https://ide.bitquery.io/1-second-crypto-price-stream)

#### Stablecoin 1 sec Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all stablecoins including USDC, USDT, DAI, USDS etc.

▶️ [Stablecoin Price Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)

## Ethereum

### Balance APIs

#### Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the Ethereum network.

▶️ [Subscribe to All Transaction Balances](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances)

#### Subscribe to Transaction Balances for a Specific Address

This subscription filters transaction balances for a specific address in real-time.

▶️ [Subscribe to Transaction Balances for a Specific Address](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address)

#### Stream Token Balance of a Address in Real Time

Subscribe to real-time token balance updates for a specific address and token. This subscription will notify you whenever the token balance changes.

▶️ [Stream Token Balance Updates in Real Time](https://ide.bitquery.io/Stream-Token-Balance-Updates-in-Real-Time)

#### Track Token Balance Changes

Monitor token balance changes for a specific token across all transactions. This helps track token movements and transfers.

▶️ [Track Token Balance Changes by Transaction](https://ide.bitquery.io/Track-Any-Token-Balance-Changes-by-Transaction-on-ETH)

#### Track Validator Balance Updates

Monitor balance changes for Ethereum validators, including staking rewards and withdrawals from the beacon chain.

▶️ [Track Validator Balance Updates](https://ide.bitquery.io/Track-Validator-Balance-Updates)

#### Track Validator Rewards

Track validator rewards and balance increases from staking activities in real-time.

▶️ [Track Validator Rewards](https://ide.bitquery.io/Track-Validator-Rewards)

#### Track Miner Balance Updates

Monitor balance changes for Ethereum miners, including block rewards, uncle block rewards, and transaction fee rewards.

▶️ [Track Miner Balance Updates](https://ide.bitquery.io/Track-Miner-Balance-Updates)

#### Track Block Mining Rewards

Track rewards received by miners for successfully mining blocks in real-time.

▶️ [Track Block Mining Rewards](https://ide.bitquery.io/Track-Block-Mining-Rewards)

#### Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards.

▶️ [Track MEV-Related Balance Updates](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates)

#### Track All Self-Destruct Event Balances

Monitor all contract self-destruct event balances in real-time.

▶️ [Track All Self-Destruct Event Balances](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream)

#### Monitoring Balance after Latest Gas Fee Burn

Monitor the balance and gas fee burnt for a particular address in real-time.

▶️ [Monitoring Balance after Latest Gas Fee Burn](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream_1)

### Token supply

#### Monitor Token Supply

Monitor Real time token supply in real time on Ethereum chain.

▶️ [Monitor Latest token supply](https://ide.bitquery.io/latest-token-supply-on-eth-chain)

### Transfers

#### Token Transfers Stream

This stream lets you monitor all the token transfers for a particular token. You can modify this subscription to track and monitor token transfers for a particular token from or to a particular address.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Subscribe-to-Latest-WETH-token-transfers_3)

### Trades

#### Ethereum DEX Trades Stream

This stream returns all the real time DEX trades happening on Ethereum mainnet. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [DEX Trades Stream](https://ide.bitquery.io/subscribe-to-dex-trades-on-ethereum-mainnet_2)

#### Uniswap Trades Stream

This subscription returns the real-time trades happening on Uniswap. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Uniswap Trades Stream](https://ide.bitquery.io/Realtime-Uniswap-v1-Uniswap-v2-Uniswap-V3-Trades)

### Slippage Streams

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on Ethereum. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-ethereum)

#### Realtime Slippage for Uniswap V4 Pools

This subscription query retrieves real-time slippage data for Uniswap V4 pools on Ethereum. Unlike Uniswap V3, which uses the pool's smart contract address, Uniswap V4 requires using the `PoolId` to identify pools.

▶️ [Realtime Slippage for Uniswap V4 Pools](https://ide.bitquery.io/realtime-pair-slippage-on-ethereum-uniswap-v4)

### Liquidity Streams

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Ethereum. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_4#)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Ethereum. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_4#)

### OHLC & Price Data

#### Real-time 1 second OHLC

This stream provides real time price and OHLC stream for all tokens on Ethereum based on trades.

▶️ [Real-time 1 second OHLC](https://ide.bitquery.io/1-second-OHLC-k-line-Ethereum)

#### Token Price Stream

This stream returns the real time trade price of a token against the token it is traded with and the price in USD. You could modify the stream to get the price of the token for a particular token pair or against a particular token.

▶️ [Token Price Stream](https://ide.bitquery.io/token-price-stream)

### Events Streams

#### Pair Creation on Uniswap

This stream returns the real time liquidity pools/token pairs created on Uniswap V3. You could modify the stream to monitor newly created pools on a different protocol.

▶️ [Pair Creation Stream](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_10_1)

## Solana

### Balance APIs

#### Balance Stream

This stream provides all balance updates on the Solana blockchain.

▶️ [Balance Update Stream](https://ide.bitquery.io/solana-balance-update-stream_3)

#### Token Balance Stream

This stream provides all balance updates of a specific token on the Solana blockchain.

▶️ [Token Balance Update Stream](https://ide.bitquery.io/USDC-balance-stream)

### Transfers

#### Token Transfers Stream

This stream provides all token transfers on the Solana blockchain, including SOL transfers.

▶️ [Token Transfer Stream](https://ide.bitquery.io/Solana-transfers-stream_3)

### Trades

#### Solana Trades Stream

This subscription streams real-time Solana trades.

▶️ [Solana Trades Stream](https://ide.bitquery.io/solana-trades-subscription_3)

#### Specific Token Trades Stream

This subscription stream uses DexTradeByTokens API to stream real-time specific token trades.

▶️ [Specific Token Trades Stream](https://ide.bitquery.io/token-trades-subscription)

#### Large Token Buys and Sells on Solana DEX

This stream provides real-time large buy and sell on Solana DEXs.

▶️ [Large Token Buys and Sells on Solana DEX](https://ide.bitquery.io/big-trades-on-solana)

### OHLC & Price Data

#### Real-time Token Prices on Solana

This stream delivers real-time token prices on Solana based on the latest trades.

▶️ [Real-time Token Prices on Solana](https://ide.bitquery.io/Real-time-price-stream-for-specific-token-on-solana)

#### 1-Second OHLC Stream

This subscription generates a real-time OHLC (Open, High, Low, Close) K-line chart for Solana in real-time, useful for Tradingview charting in real-time.

▶️ [Seconds OHLC Stream](https://ide.bitquery.io/1-second-OHLC-k-line-Solana)

### Pool/Liquidity APIs

#### DEXPool Liquidity Changes

This stream provides real time liquidity details for all pools on Solana.

▶️ [DEXPool Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools-stream_2)

### PumpFun APIs

#### PumpFun Token Creation

This subscription tracks in real-time newly created Pumpfun tokens, including their metadata and associated developer addresses.

▶️ [PumpFun Token Creation Stream](https://ide.bitquery.io/newly-created-PF-token-developer-address-metadata)

#### PumpFun Trades Stream

This stream returns the real time trades on Pumpfun platform. This stream could be modified to get real time trades for a particular token or trades by a particular trader.

▶️ [PumpFun Trades Stream](https://ide.bitquery.io/Pumpfun-DEX-Trades_1)

### Pumpswap Streams

#### Pumpswap Trades Stream

This stream returns the real time trades on Pumpswap exchange. This stream could be modified to get real time trades for a particular token or trades by a particular trader.

▶️ [Pumpswap Trades Stream](https://ide.bitquery.io/pumpswap-trades)

### Raydium APIs

#### New Pool Creation on Raydium v4

This stream gives info about the real time liquidity pool creation on Raydium exchange.

▶️ [Raydium v4 Pool Creation Stream](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_5)

#### New Pool Creation on Raydium Launchpad

This stream gives info about the real time liquidity pool creation on Raydium Launchpad.

▶️ [Raydium Launchpad Pool Creation Stream](https://ide.bitquery.io/Raydium-Launchpad-pool-creations_1)

#### New Pool Creation on Raydium CLMM

This stream gives info about the real time liquidity pool creation on Raydium CLMM.

▶️ [Raydium CLMM Pool Creation Stream](https://ide.bitquery.io/Raydium-CLMM-Pool-Creation-stream)

#### New Pool Creation on Raydium CPMM

This stream gives info about the real time liquidity pool creation on Raydium CPMM.

▶️ [Raydium CPMM Pool Creation Stream](https://ide.bitquery.io/CPMM-pools-creation-stream)

#### Latest Trades on Raydium

This stream gives info about the real time trades on Raydium exchange. You can modify this query to monitor trades on Raydium for a particular token or by a particular trader.

▶️ [Raydium Trades](https://ide.bitquery.io/Updated-Real-time-trades-on-Raydium-DEX-on-Solana_1)

## Base

### Balance APIs

#### Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the Base network.

▶️ [Subscribe to All Transaction Balances](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances_1)

#### Subscribe to Transaction Balances for a Specific Address

This subscription filters transaction balances for a specific address in real-time.

▶️ [Subscribe to Transaction Balances for a Specific Address](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address_1)

#### Stream Token Balance of a Address in Real Time

Subscribe to real-time token balance updates for a specific address and token. This subscription will notify you whenever the token balance changes.

▶️ [Stream Token Balance Updates in Real Time](https://ide.bitquery.io/Stream-Token-Balance-Updates-in-Real-Time-on-base)

#### Track Token Balance Changes

Monitor token balance changes for a specific token across all transactions. This helps track token movements and transfers.

▶️ [Track Token Balance Changes by Transaction](https://ide.bitquery.io/Track-Token-Balance-Changes-by-Transaction-on-base)

#### Track Validator Balance Updates

Monitor balance changes for Base validators, including staking rewards and withdrawals from the beacon chain.

▶️ [Track Validator Balance Updates](https://ide.bitquery.io/Track-Validator-Balance-Updates)

#### Track Validator Rewards

Track validator rewards and balance increases from staking activities in real-time.

▶️ [Track Validator Rewards](https://ide.bitquery.io/Track-Validator-Balance-Updates-on-base)

#### Track Miner Balance Updates

Monitor balance changes for Base miners, including block rewards, uncle block rewards, and transaction fee rewards.

▶️ [Track Miner Balance Updates](https://ide.bitquery.io/Track-Miner-Balance-Updates-BASE_1)

#### Track Block Mining Rewards

Track rewards received by miners for successfully mining blocks in real-time.

▶️ [Track Block Mining Rewards](https://ide.bitquery.io/Track-Block-Mining-Rewards-base_1)

#### Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards.

▶️ [Track MEV-Related Balance Updates](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-base_1)

#### Track All Self-Destruct Event Balances

Monitor all contract self-destruct event balances in real-time.

▶️ [Track All Self-Destruct Event Balances](hhttps://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-base_1)

#### Monitoring Balance after Latest Gas Fee Burn

Monitor the balance and gas fee burnt for a particular address in real-time.

▶️ [Monitoring Balance after Latest Gas Fee Burn](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream_2)

### Transfers

#### Token Transfers Stream

This stream lets you monitor all the token transfers for a particular token. You can modify this subscription to track and monitor token transfers for a particular token from or to a particular address.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Subscribe-to-Latest-USDC-token-transfers)

### Trades

#### Base DEX Trades Stream

This stream returns all the real time DEX trades happening on Base. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [DEX Trades Stream](https://ide.bitquery.io/subscribe-to-dex-trades-on-base_1)

#### Uniswap Trades Stream

This subscription returns the real-time trades happening on Uniswap. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Uniswap Trades Stream](https://ide.bitquery.io/Realtime-Uniswap-v1-Uniswap-v2-Uniswap-V3-Trades_1)

### Slippage Streams

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on Base. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-base)

### Liquidity Streams

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Base. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_3#)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Base. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_3#)

### OHLC & Price Data

#### Real-time 1 second OHLC

This stream provides real time price and OHLC stream for all tokens on Base based on trades.

▶️ [Real-time 1 second OHLC](https://ide.bitquery.io/1-second-OHLC-k-line-Base)

#### Token Price Stream

This stream returns the real time trade price of a token against the token it is traded with and the price in USD. You could modify the stream to get the price of the token for a particular token pair or against a particular token.

▶️ [Token Price Stream](https://ide.bitquery.io/token-price-stream_2)

### Events Streams

#### Pair Creation on Uniswap

This stream returns the real time liquidity pools/token pairs created on Uniswap V3. You could modify the stream to monitor newly created pools on a different protocol.

▶️ [Pair Creation Stream](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3-Base)

## BSC (Binance Smart Chain)

### Balance APIs

#### Real-time Transaction Balance Update for a Wallet on BSC

This stream provides real time transaction balance updates for a wallet on BSC.

▶️ [Real Time Transaction Balance Update](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-bsc)

#### Real-time Validator Rewards for BSC

This stream provides the info on rewards received by validators on BSC in real time.

▶️ [Real Time Validator Rewards on BSC](https://ide.bitquery.io/Track-Validator-Balance-Updates-bsc_1)

#### Track MEV Balance in Real Time for BSC

This stream monitors MEV activities and Balance Updates on BSC in real time.

▶️ [Real Time MEV Activities on BSC](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-bsc)

### Trades

#### Real-time Trades on BSC

This subscription returns the real-time trades happening on BSC Network. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [BSC Dex Trades](https://ide.bitquery.io/subscribe-to-dex-trades-on-BNB-mainnet)

#### Real-time Trades on Pancakeswap

This subscription returns the real-time trades happening on Pancakeswap. You can modify the stream to get real time trades for a particular token, a particular token pair, and even a particular trader.

▶️ [Pancakeswap Trades Stream](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades---Stream)

#### Real-time Mempool Trades on Pancakeswap

Get real time unconfirmed trades on Pancakeswap, using the given stream.

▶️ [Pancakeswap Mempool Trades](https://ide.bitquery.io/Mempool---Latest-BSC-PancakeSwap-v3-dextrades---Stream)

### Slippage Streams

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on BSC. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-bsc)

### Liquidity Streams

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on BSC. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_2#)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on BSC. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_1)

### Four Meme APIs

#### Four Meme Token Creations Stream

This stream returns the latest token creations on `Four Meme` on BSC Network in real time.

▶️ [Four.meme Token Creations Stream](https://ide.bitquery.io/track-Four-meme-token-creation-using-events_2)

#### Four Meme Trades Stream

This stream returns the latest trades happening on `Four Meme` on BSC Network in real time.

▶️ [Trades on Four Meme](https://ide.bitquery.io/Latest-trades-on-fourmeme)

#### Four Meme User Trades

This stream helps in monitoring the trades of a Four Meme user in real time.

▶️ [Four Meme User Trades](https://ide.bitquery.io/monitor-trades-of-a-trader-on-four-meme)

## TRON

### Transfers

#### Real-time Tether USDT Transfers

This subscription streams the latest USDT (TRC20) transfers on the TRON network. You can modify the stream to monitor Transfers of USDT from or to a particular address.

▶️ [Token Transfers Stream](https://ide.bitquery.io/usdt-trc20-transfers_1)

### Trades

#### Real-time Trades on Tron

This stream returns all the real time DEX trades happening on the Tron network. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [DEX Trades Stream](https://ide.bitquery.io/Latest-trades-on-Tron)

#### Real-time Trades on Sunpump

This stream returns all the real time DEX trades happening on Sunpump exchange on the Tron network. You can modify this stream to get the trades of a particular token or trades by a particular trader.

▶️ [Sunpump Trades Stream](https://ide.bitquery.io/real-time-sunswapTrades)

## NFT Streams

### NFT Trades

#### NFT Trades on Opensea

This stream allows you to monitor real time NFT trades on OpenSea. It could also be modified to get trades of a particular NFT collection or NFTs traded by a particular trader.

▶️ [NFT Trades Stream](https://ide.bitquery.io/Latests-OpenSea-Trades--stream)

### Balance APIs

#### Stream NFT Balance Updates in Real Time

Subscribe to real-time NFT balance updates for a specific address and collection. This subscription will notify you whenever NFT ownership changes.

▶️ [Stream NFT Balance Updates in Real Time](https://ide.bitquery.io/Stream-NFT-Balance-Updates-in-Real-Time)

#### Track Specific NFT Balance Changes

Monitor NFT transfers for a specific collection across all transactions. This helps track NFT movements and ownership changes.

▶️ [Track Specific NFT Balance Changes](https://ide.bitquery.io/Track-specific-NFTs-Balance-Changes)

## Polymarket

### Prediction Market Trades

#### Real-Time Trades Stream

Subscribe to live prediction market trades as they occur on Polygon (successful transactions only).
▶️ [Prediction Market Trades Stream](https://ide.bitquery.io/prediction-market-trades-subscription)

#### Trades for a Specific Market (Stream)

Subscribe to trades for one market only by filtering on Question.MarketId. Replace the market ID in the query with your target market.
▶️ [Subscribe to Specific Market Trades](https://ide.bitquery.io/subscribe-to-specific-market-trades)

### Prediction Market Managements

#### Real-Time Management Stream (Creations + Resolutions)

Subscribe to all prediction market lifecycle events (Created and Resolved) as they occur on Polygon.
▶️ [Prediction Managements Stream](https://ide.bitquery.io/Prediction-Managements-subscription-resolutions-creations)

#### Real-Time Market Creations

Subscribe only to new market (Created) events.
▶️ [Realtime Market Creations](https://ide.bitquery.io/track-realtime-new-polymarket-creations)

#### Real-Time Market Resolutions

Subscribe only to Resolved events. Winning outcome is in Prediction.Outcome; token details (e.g. AssetId) in Prediction.OutcomeToken.
▶️ [Realtime Market Resolutions](https://ide.bitquery.io/track-realtime-polymarket-resolutions)

### Prediction Market Settlements

#### Real-Time Settlement Stream

Subscribe to live Split, Merge, and Redemption events as they occur on Polygon.
▶️ [Real-Time Prediction Market Settlements Stream](https://ide.bitquery.io/realtime-predicion-market-settlements-stream)



## x402 Streams

### Base

#### Real-Time Payment Monitoring for x402 Server

Real-time subscription to monitor payments to a specific x402 server on Base network using WebSockets.

▶️ [Real-Time Payment Monitoring for x402 Server](https://ide.bitquery.io/Monitoring-the-latest-payment-to-the-specific-X402-server)

### Solana

#### Real-Time Payment Monitoring for x402 Server on Solana

Real-time subscription to monitor payments to a specific x402 server on Solana network using WebSockets.

▶️ [Real-Time Payment Monitoring for x402 Server on Solana](https://ide.bitquery.io/Real-Time---Solana-transfers-stream)

## More on Streams

You will find more detailed information on streams and subscriptions in the relevant sections.

- [Understanding Subscription](https://docs.bitquery.io/docs/subscriptions/subscription/)
- [Streaming via Websocket](https://docs.bitquery.io/docs/subscriptions/examples/)
