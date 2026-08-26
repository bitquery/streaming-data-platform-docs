---
title: "Starter Subscriptions - Bitquery Real-Time Streams by Chain"
description: "Curated, tested Bitquery GraphQL subscriptions organised by chain and data type — real-time trades, transfers, balances, prices and liquidity streams."
keywords:
  [
    "Bitquery subscriptions",
    "real-time blockchain data",
    "GraphQL subscriptions",
    "WebSocket streams",
    "Bitquery IDE"
  ]
---
# Starter Subscriptions

Every subscription below is saved in the [Bitquery IDE](https://ide.bitquery.io) and was opened against the live WebSocket endpoint before publishing. Streams are always real time; for historical data see the [Starter Queries](/docs/start/starter-queries/).

## Table of Contents

- [Ethereum](#ethereum)
- [Solana](#solana)
- [BSC](#bsc)
- [Base](#base)
- [Arbitrum](#arbitrum)
- [Optimism](#optimism)
- [Polygon](#polygon)
- [TRON](#tron)
- [Robinhood Chain](#robinhood-chain)
- [Bitcoin](#bitcoin)
- [Trading API](#trading-api)
- [Stablecoins](#stablecoins)
- [Perpetuals](#perpetuals)
- [NFTs](#nfts)
- [Polymarket](#polymarket)
- [x402](#x402)
- [Cross-Chain](#cross-chain)

## Ethereum

### Trades

#### All DEX trades

Every Ethereum DEX trade as it happens. Add a `where` filter to narrow to a token or protocol.

▶️ [All DEX trades](https://ide.bitquery.io/All-Ethereum-Trade-Stream_1)

#### All swap events

All swap events. Uses the `Events` cube.

▶️ [All swap events](https://ide.bitquery.io/all-swap-events)

#### Get pair trades data just like dexcsreener

Get pair trades data just like dexcsreener. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get pair trades data just like dexcsreener](https://ide.bitquery.io/Get-pair-trades-data-just-like-dexcsreener)

#### Get pair trades data just like geckoterminal

Get pair trades data just like geckoterminal. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get pair trades data just like geckoterminal](https://ide.bitquery.io/Get-pair-trades-data-just-like-geckoterminal)

#### Latest token trades subscription

Latest token trades subscription. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Latest token trades subscription](https://ide.bitquery.io/latest-token-trades-subscription)

#### Pepe live trades stream

Pepe live trades stream. Uses the `DEXTradeByTokens` cube.

▶️ [Pepe live trades stream](https://ide.bitquery.io/pepe-live-trades-stream)

#### Real time trades of an ethereum address

Real time trades of an ethereum address. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Real time trades of an ethereum address](https://ide.bitquery.io/Real-time-trades-of-an-ethereum-address)

#### Stream new position mints on Fluid DEX Vault

Stream new position mints on Fluid DEX Vault. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Stream new position mints on Fluid DEX Vault](https://ide.bitquery.io/stream-new-position-mints-on-Fluid-DEX-Vault)

#### Subscribe to dex trades on ethereum mainnet

Subscribe to dex trades on ethereum mainnet.

▶️ [Subscribe to dex trades on ethereum mainnet](https://ide.bitquery.io/subscribe-to-dex-trades-on-ethereum-mainnet_2)

#### Trades of a specific trader of a specific token

Trades of a specific trader of a specific token. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [Trades of a specific trader of a specific token](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token)

### Transfers

#### Token transfers

Live ERC-20 transfers. Change the token address to follow a different one.

▶️ [Token transfers](https://ide.bitquery.io/Subscribe-to-Latest-WETH-token-transfers_3)

#### Pepe whale transfer stream

Pepe whale transfer stream. Uses the `Transfers` cube.

▶️ [Pepe whale transfer stream](https://ide.bitquery.io/pepe-whale-transfer-stream)

#### Subscribe to Latest WETH token transfers

Subscribe to Latest WETH token transfers. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Subscribe to Latest WETH token transfers](https://ide.bitquery.io/Subscribe-to-Latest-WETH-token-transfers)

#### Subscribe to latest Axie infinity token transfers

Subscribe to latest Axie infinity token transfers. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Subscribe to latest Axie infinity token transfers](https://ide.bitquery.io/Subscribe-to-latest-Axie-infinity-token-transfers_1)

### Balances & Holders

#### Balance of a specific address

Live balance updates for one wallet. Replace the address.

▶️ [Balance of a specific address](https://ide.bitquery.io/Stream-Token-Balance-Updates-in-Real-Time)

#### All transaction balances

Every balance change on the chain — high volume, filter before using in production.

▶️ [All transaction balances](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances)

#### Transaction balances for one address

Balance changes scoped to a single wallet.

▶️ [Transaction balances for one address](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address)

#### Token balance changes by transaction

Balance deltas for every token, transaction by transaction.

▶️ [Token balance changes by transaction](https://ide.bitquery.io/Track-Any-Token-Balance-Changes-by-Transaction-on-ETH)

#### Balance update after transfer received from multiple addresses--stream

Balance update after transfer received from multiple addresses--stream. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer received from multiple addresses--stream](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses--stream)

#### Balance update after transfer received--stream

Balance update after transfer received--stream. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer received--stream](https://ide.bitquery.io/Balance-update-after-transfer-received--stream)

#### Balance update after transfer sent from multiple addresses--stream

Balance update after transfer sent from multiple addresses--stream. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer sent from multiple addresses--stream](https://ide.bitquery.io/Balance-update-after-transfer-sent-from-multiple-addresses--stream)

#### Balance update after transfer sent--stream

Balance update after transfer sent--stream. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer sent--stream](https://ide.bitquery.io/Balance-update-after-transfer-sent--stream_3)

#### Balance update from transfer for an address--stream

Balance update from transfer for an address--stream. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update from transfer for an address--stream](https://ide.bitquery.io/balance-update-from-transfer-for-an-address--stream)

#### Balance update from transfer for multiple addresses--stream

Balance update from transfer for multiple addresses--stream. Uses the `TransactionBalances` cube.

▶️ [Balance update from transfer for multiple addresses--stream](https://ide.bitquery.io/balance-update-from-transfer-for-multiple-addresses--stream)

### Price & OHLC

#### 1-second OHLC candles

Rolling one-second candles for charting.

▶️ [1-second OHLC candles](https://ide.bitquery.io/1-second-OHLC-k-line-Ethereum)

#### Token price stream

Live USD price updates as trades land.

▶️ [Token price stream](https://ide.bitquery.io/token-price-stream)

#### 1 second crypto price stream

1 second crypto price stream. Uses the `Tokens` cube.

▶️ [1 second crypto price stream](https://ide.bitquery.io/1-second-crypto-price-stream)

#### Pepe-ohlcv-stream

Pepe-ohlcv-stream. Uses the `Tokens` cube.

▶️ [Pepe-ohlcv-stream](https://ide.bitquery.io/pepe-ohlcv-stream)

### Supply & Market Cap

#### Token market cap stream

Live market cap updates for Ethereum tokens.

▶️ [Token market cap stream](https://ide.bitquery.io/ethereum-token-marketcap-stream_1)

#### Tokens crossing $1M market cap

Only tokens above a market cap floor. Change the threshold in the `where` clause.

▶️ [Tokens crossing $1M market cap](https://ide.bitquery.io/realtime-stream-ethereum-tokens-with-marketcap-above-1-million)

#### Token supply changes

Mints and burns as they change a token's supply.

▶️ [Token supply changes](https://ide.bitquery.io/latest-token-supply-on-eth-chain)

#### All trades on Ethereum with Price, Marketcap, supply

All trades on Ethereum with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades on Ethereum with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Ethereum-with-Price-Marketcap-supply)

### Liquidity & Pools

#### Realtime slippage monitoring

Slippage on every trade as it happens, across all pools.

▶️ [Realtime slippage monitoring](https://ide.bitquery.io/realtime-slippage-on-ethereum)

#### Realtime Liquidity Stream

Realtime Liquidity Stream.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_4)

#### Realtime Liquidity Stream of a Specific Pool

Realtime Liquidity Stream of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_4)

### Transactions

#### Get Transaction Hash

Get Transaction Hash.

▶️ [Get Transaction Hash](https://ide.bitquery.io/Get-Transaction-Hash)

### Events & Calls

#### Stream pool and pair creation on ethereum

Stream pool and pair creation on ethereum. Uses the `Events` cube.

▶️ [Stream pool and pair creation on ethereum](https://ide.bitquery.io/stream-pool-and-pair-creation-on-ethereum_1)

#### Subscribe to the Same Event Across Multiple Contracts

Subscribe to the Same Event Across Multiple Contracts. Uses the `Events` cube.

▶️ [Subscribe to the Same Event Across Multiple Contracts](https://ide.bitquery.io/Subscribe-to-the-Same-Event-Across-Multiple-Contracts)

### Mempool

#### Binance Mempool Transactions

Binance Mempool Transactions. Uses the `Transactions` cube. Replace the address in the `where` clause to use it.

▶️ [Binance Mempool Transactions](https://ide.bitquery.io/Binance-Mempool-Transactions_1)

#### Eth subscribe("logs")

Eth subscribe("logs"). Uses the `Events` cube.

▶️ [Eth subscribe("logs")](https://ide.bitquery.io/eth_subscribelogs)

#### Eth subscribe(“pendingTransactions”)

Eth subscribe(“pendingTransactions”).

▶️ [Eth subscribe(“pendingTransactions”)](https://ide.bitquery.io/eth_subscribependingTransactions)

#### Current mempool fees

Gas prices being offered by pending transactions right now.

▶️ [Current mempool fees](https://ide.bitquery.io/Get-Mempool-Fees)

#### Mempool event stream

Mempool event stream.

▶️ [Mempool event stream](https://ide.bitquery.io/Mempool-event-stream)

#### Pending DEX trades in the mempool

Swaps sitting in the mempool — see trades before they confirm.

▶️ [Pending DEX trades in the mempool](https://ide.bitquery.io/mempool-token-trades_1)

#### Pending transfers in the mempool

Token transfers that are broadcast but not yet mined.

▶️ [Pending transfers in the mempool](https://ide.bitquery.io/mempool-transfers_1)

#### New pairs being created, from the mempool

Catches pool creation at broadcast time rather than after the block.

▶️ [New pairs being created, from the mempool](https://ide.bitquery.io/PairCreated-in-Mempool)

#### Vrs signature

Vrs signature.

▶️ [Vrs signature](https://ide.bitquery.io/vrs-signature)

### Blocks & Validators

#### Balance after gas fee burn

Tracks an address's balance alongside the gas it burns.

▶️ [Balance after gas fee burn](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream_1)

#### Self-destruct balance events

Balances released when a contract self-destructs.

▶️ [Self-destruct balance events](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream)

#### Block mining rewards

Reward paid out per block.

▶️ [Block mining rewards](https://ide.bitquery.io/Track-Block-Mining-Rewards)

#### MEV-related balance changes

Balance movements tied to MEV payouts and builder rewards.

▶️ [MEV-related balance changes](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates)

#### Miner balance changes

Balance movements on block producers.

▶️ [Miner balance changes](https://ide.bitquery.io/Track-Miner-Balance-Updates)

#### Validator balance changes

Balance movements on validator addresses.

▶️ [Validator balance changes](https://ide.bitquery.io/Track-Validator-Balance-Updates)

#### Validator rewards

Rewards paid to validators, block by block.

▶️ [Validator rewards](https://ide.bitquery.io/Track-Validator-Rewards)

#### Filter by MEV Bot or Builder Address

Filter by MEV Bot or Builder Address. Uses the `TransactionBalances` cube.

▶️ [Filter by MEV Bot or Builder Address](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address)

#### Filter by Miner Address

Filter by Miner Address. Uses the `TransactionBalances` cube.

▶️ [Filter by Miner Address](https://ide.bitquery.io/Filter-by-Miner-Address)

#### Filter by Validator Address

Filter by Validator Address. Uses the `TransactionBalances` cube.

▶️ [Filter by Validator Address](https://ide.bitquery.io/Filter-by-Validator-Address)

### Uniswap

#### New Uniswap v3 pools

Pool creation events as they are mined — new pair detection.

▶️ [New Uniswap v3 pools](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_10_1)

#### Slippage on Uniswap v4 pools

Per-trade slippage for v4 pools.

▶️ [Slippage on Uniswap v4 pools](https://ide.bitquery.io/realtime-pair-slippage-on-ethereum-uniswap-v4)

#### Uniswap trades

Live trades on Uniswap only.

▶️ [Uniswap trades](https://ide.bitquery.io/All-Ethereum-Uniswap-Trade-Stream)

#### Currency pair liquidity events stream

Currency pair liquidity events stream. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Currency pair liquidity events stream](https://ide.bitquery.io/currency-pair-liquidity-events-stream)

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_6)

#### Latest pools created Uniswap v3

Latest pools created Uniswap v3. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Latest pools created Uniswap v3](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3_9)

## Solana

### Trades

#### Graduated Tokens

This query gives you tokens which are graduated from Raydium Launchpad to Raydium.

▶️ [Graduated Tokens](https://ide.bitquery.io/Track-Token-Migrations-to-Raydium-DEX-and-Raydium-CPMM-in-realtime)

#### Large Token Buys and Sells on Solana DEX

This stream provides real-time large buy and sell on Solana DEXs.

▶️ [Large Token Buys and Sells on Solana DEX](https://ide.bitquery.io/big-trades-on-solana)

#### Solana Trades Stream

This subscription streams real-time Solana trades.

▶️ [Solana Trades Stream](https://ide.bitquery.io/solana-trades-subscription_3)

#### Specific Token Trades Stream

This subscription stream uses DexTradeByTokens API to stream real-time specific token trades.

▶️ [Specific Token Trades Stream](https://ide.bitquery.io/token-trades-subscription)

#### All Trade for Bags.fm tokens

All Trade for Bags.fm tokens. Uses the `DEXTrades` cube.

▶️ [All Trade for Bags.fm tokens](https://ide.bitquery.io/All-Trade-for-Bagsfm-tokens)

#### CPMM trades

CPMM trades. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [CPMM trades](https://ide.bitquery.io/CPMM-trades)

#### Get Solana pair trades data

Get Solana pair trades data. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Solana pair trades data](https://ide.bitquery.io/Get-Solana-pair-trades-data)

#### Get Solana pair trades data just like dexcsreener

Get Solana pair trades data just like dexcsreener. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Solana pair trades data just like dexcsreener](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-dexcsreener)

#### Get Solana pair trades data just like geckoTerminal

Get Solana pair trades data just like geckoTerminal. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Solana pair trades data just like geckoTerminal](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-geckoTerminal_1)

#### Latest Trades of TESLA onchain xStock

Latest Trades of TESLA onchain xStock. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Trades of TESLA onchain xStock](https://ide.bitquery.io/Latest-Trades-of-TESLA-onchain-xStock_1)

### Transfers

#### Token Transfers Stream

This stream provides all token transfers on the Solana blockchain, including SOL transfers.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Solana-transfers-stream_3)

#### SPL transfers websocket

SPL transfers websocket. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [SPL transfers websocket](https://ide.bitquery.io/SPL-transfers-websocket_1)

#### Solana Websocket - Subscribe to all transfers of specific addresses in realtime

Solana Websocket - Subscribe to all transfers of specific addresses in realtime. Uses the `Transfers` cube.

▶️ [Solana Websocket - Subscribe to all transfers of specific addresses in realtime](https://ide.bitquery.io/Solana-Websocket---Subscribe-to-all-transfers-of-specific-addresses-in-realtime)

#### Subscribe to the all transfers on Solana

Subscribe to the all transfers on Solana.

▶️ [Subscribe to the all transfers on Solana](https://ide.bitquery.io/Subscribe-to-the-all-transfers-on-Solana)

#### Transfers of All Tip Payment Accounts on Solana

Transfers of All Tip Payment Accounts on Solana. Uses the `Transfers` cube.

▶️ [Transfers of All Tip Payment Accounts on Solana](https://ide.bitquery.io/Transfers-of-All-Tip-Payment-Accounts-on-Solana)

#### Transfers of Tip Payment Accounts on Solana

Transfers of Tip Payment Accounts on Solana. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Transfers of Tip Payment Accounts on Solana](https://ide.bitquery.io/Transfers-of-Tip-Payment-Accounts-on-Solana_1)

#### Transfers where sender is the specified address

Transfers where sender is the specified address. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Transfers where sender is the specified address](https://ide.bitquery.io/transfers-where-sender-is-the-specified-address_1)

### Balances & Holders

#### Balance Stream

This stream provides all balance updates on the Solana blockchain.

▶️ [Balance Stream](https://ide.bitquery.io/solana-balance-update-stream_3)

### Price & OHLC

#### 1-Second OHLC Stream

This subscription generates a real-time OHLC (Open, High, Low, Close) K-line chart for Solana in real-time, useful for Tradingview charting in real-time.

▶️ [1-Second OHLC Stream](https://ide.bitquery.io/1-second-OHLC-k-line-Solana)

#### Real-Time Token Prices in USD on Solana

Stream live OHLC (Open, High, Low, Close) price and volume data for all tokens on Solana, quoted directly in USD. Useful for dashboards, analytics, or bots that need stable fiat-based prices.

▶️ [Real-Time Token Prices in USD on Solana](https://ide.bitquery.io/Real-Time-usd-price-on-solana-chain)

#### Real-time Token Prices on Solana

This stream delivers real-time token prices on Solana based on the latest trades.

▶️ [Real-time Token Prices on Solana](https://ide.bitquery.io/Real-time-price-stream-for-specific-token-on-solana)

#### Byreal token live prices using trades api

Byreal token live prices using trades api. Uses the `Trades` cube.

▶️ [Byreal token live prices using trades api](https://ide.bitquery.io/Byreal-token-live-prices-using-trades-api)

#### Get Latest Price of SOL in USD Real-time

Get Latest Price of SOL in USD Real-time. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Latest Price of SOL in USD Real-time](https://ide.bitquery.io/Get-Latest-Price-of-SOL-in--USD-Real-time)

#### Get realtime Price of Apple xStock in USD Real-time

Get realtime Price of Apple xStock in USD Real-time. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get realtime Price of Apple xStock in USD Real-time](https://ide.bitquery.io/Get-realtime-Price-of-Apple-xStock-in--USD-Real-time)

#### GoonFi Realtime OHLC, Price, Volume API - Crypto Price API

GoonFi Realtime OHLC, Price, Volume API - Crypto Price API. Uses the `Pairs` cube.

▶️ [GoonFi Realtime OHLC, Price, Volume API - Crypto Price API](https://ide.bitquery.io/GoonFi-Realtime-OHLC-Price-Volume-API---Crypto-Price-API_1)

#### Latest price for more than 1 markets on solana

Latest price for more than 1 markets on solana. Uses the `DEXTrades` cube.

▶️ [Latest price for more than 1 markets on solana](https://ide.bitquery.io/latest-price-for-more-than-1-markets-on-solana_1)

#### Latest price for more than 1 markets on solana for specific currencies

Latest price for more than 1 markets on solana for specific currencies. Uses the `DEXTrades` cube.

▶️ [Latest price for more than 1 markets on solana for specific currencies](https://ide.bitquery.io/latest-price-for-more-than-1-markets-on-solana-for-specific-currencies)

#### Price of a moonshot token

Price of a moonshot token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Price of a moonshot token](https://ide.bitquery.io/Price-of-a-Moonshot-token)

### Supply & Market Cap

#### Solana tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches Solana and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [Solana tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-solana-tokens-with-marketcap-above-1-million)

#### All trades on Solana with Price, Marketcap, supply

All trades on Solana with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades on Solana with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Solana-with-Price-Marketcap-supply)

#### Bags.fm token creation stream using Solana token supply updates

Bags.fm token creation stream using Solana token supply updates. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Bags.fm token creation stream using Solana token supply updates](https://ide.bitquery.io/Bagsfm-token-creation-stream-using-Solana-token-supply-updates)

#### Get All DEX Trades on DBC With Price, Market Cap, and Supply

Get All DEX Trades on DBC With Price, Market Cap, and Supply. Uses the `Trades` cube.

▶️ [Get All DEX Trades on DBC With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-DBC-With-Price-Market-Cap-and-Supply)

#### Get newly created Moonshot tokens with metadata

Get newly created Moonshot tokens with metadata. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Get newly created Moonshot tokens with metadata](https://ide.bitquery.io/Get-newly-created-Moonshot-tokens-with-metadata)

#### Newly created PF token, dev address, metadata

Newly created PF token, dev address, metadata. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Newly created PF token, dev address, metadata](https://ide.bitquery.io/newly-created-PF-token-dev-address-metadata)

#### Realtime heaven tokens with marketcap 10k

Realtime heaven tokens with marketcap 10k. Uses the `Pairs` cube.

▶️ [Realtime heaven tokens with marketcap 10k](https://ide.bitquery.io/realtime-heaven-tokens-with-marketcap-10k)

### Liquidity & Pools

#### DEXPool Liquidity Changes

This stream provides real time liquidity details for all pools on Solana.

▶️ [DEXPool Liquidity Changes](https://ide.bitquery.io/Solana-DEXPools-stream_2)

#### Latest pools created on trends.fun stream

Latest pools created on trends.fun stream. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Latest pools created on trends.fun stream](https://ide.bitquery.io/latest-pools-created-on-trendsfun-stream)

#### Latest price based on liquidity

Latest price based on liquidity. Uses the `DEXPools` cube.

▶️ [Latest price based on liquidity](https://ide.bitquery.io/latest-price-based-on-liquidity_2)

#### Liquidity for a launchpad token pair stream

Liquidity for a launchpad token pair stream. Uses the `DEXPools` cube. Replace the address in the `where` clause to use it.

▶️ [Liquidity for a launchpad token pair stream](https://ide.bitquery.io/liquidity-for-a-launchpad-token-pair-stream)

#### Search tokens with liquidity over 1 million

Search tokens with liquidity over 1 million. Uses the `DEXPools` cube.

▶️ [Search tokens with liquidity over 1 million](https://ide.bitquery.io/Search-tokens-with-liquidity-over-1-million)

#### Trends fun tokens between 95 and 100 bonding curve progress

Trends fun tokens between 95 and 100 bonding curve progress. Uses the `DEXPools` cube. Replace the address in the `where` clause to use it.

▶️ [Trends fun tokens between 95 and 100 bonding curve progress](https://ide.bitquery.io/trends-fun-tokens-between-95-and-100-bonding-curve-progress)

### Transactions

#### Realtime Solana Transactions

Realtime Solana Transactions. Uses the `Transactions` cube.

▶️ [Realtime Solana Transactions](https://ide.bitquery.io/Realtime-Solana-Transactions)

### Events & Calls

#### ConsumeEvents instruction on OpenBook V2

ConsumeEvents instruction on OpenBook V2. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [ConsumeEvents instruction on OpenBook V2](https://ide.bitquery.io/consumeEvents-instruction-on-OpenBook-V2_3)

### Pump.fun

#### PumpFun Token Creation

This subscription tracks in real-time newly created Pumpfun tokens, including their metadata and associated developer addresses.

▶️ [PumpFun Token Creation](https://ide.bitquery.io/newly-created-PF-token-developer-address-metadata)

#### PumpFun Trades Stream

This stream returns the real time trades on Pumpfun platform. This stream could be modified to get real time trades for a particular token or trades by a particular trader.

▶️ [PumpFun Trades Stream](https://ide.bitquery.io/Pumpfun-DEX-Trades_1)

#### Pumpswap Trades Stream

This stream returns the real time trades on Pumpswap exchange. This stream could be modified to get real time trades for a particular token or trades by a particular trader.

▶️ [Pumpswap Trades Stream](https://ide.bitquery.io/pumpswap-trades)

#### Get All DEX Trades on Pumpfun With Price, Market Cap, and Supply

Get All DEX Trades on Pumpfun With Price, Market Cap, and Supply. Uses the `Trades` cube.

▶️ [Get All DEX Trades on Pumpfun With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-Pumpfun-With-Price-Market-Cap-and-Supply)

#### Latest Trades for a token on Pumpswap

Latest Trades for a token on Pumpswap. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Trades for a token on Pumpswap](https://ide.bitquery.io/Latest-Trades-for-a-token-on-Pumpswap)

#### Price of a pump fun token using price index in usd

Price of a pump fun token using price index in usd. Uses the `Pairs` cube. Replace the address in the `where` clause to use it.

▶️ [Price of a pump fun token using price index in usd](https://ide.bitquery.io/Price-of-a-pump-fun-token-using-price-index-in-usd)

### Raydium

#### Latest Pools Created on Raydium

This query returns the latest created pools on Raydium. You can set the limit here also.

▶️ [Latest Pools Created on Raydium](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_1)

#### Latest Trades on Raydium

This stream gives info about the real time trades on Raydium exchange. You can modify this query to monitor trades on Raydium for a particular token or by a particular trader.

▶️ [Latest Trades on Raydium](https://ide.bitquery.io/Updated-Real-time-trades-on-Raydium-DEX-on-Solana_1)

#### New Pool Creation on Raydium CLMM

This stream gives info about the real time liquidity pool creation on Raydium CLMM.

▶️ [New Pool Creation on Raydium CLMM](https://ide.bitquery.io/Raydium-CLMM-Pool-Creation-stream)

#### New Pool Creation on Raydium CPMM

This stream gives info about the real time liquidity pool creation on Raydium CPMM.

▶️ [New Pool Creation on Raydium CPMM](https://ide.bitquery.io/CPMM-pools-creation-stream)

#### New Pool Creation on Raydium Launchpad

This stream gives info about the real time liquidity pool creation on Raydium Launchpad.

▶️ [New Pool Creation on Raydium Launchpad](https://ide.bitquery.io/Raydium-Launchpad-pool-creations_1)

#### New Pool Creation on Raydium v4

This stream gives info about the real time liquidity pool creation on Raydium exchange.

▶️ [New Pool Creation on Raydium v4](https://ide.bitquery.io/Latest-Radiyum-V4-pools-created_5)

#### Track Raydium Launchpad tokens above 95% Bonding Curve Progress in realtime

Returns Raydium Launchpad tokens which have more than 95% bonding curve progress.

▶️ [Track Raydium Launchpad tokens above 95% Bonding Curve Progress in realtime](https://ide.bitquery.io/LetsBonkfun-Tokens-between-95-and-100-bonding-curve-progress_2)

### Meteora

#### Jup studio token migrations from Meteora DBC to Meteors DEX

Jup studio token migrations from Meteora DBC to Meteors DEX. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Jup studio token migrations from Meteora DBC to Meteors DEX](https://ide.bitquery.io/jup-studio-token-migrations-from-Meteora-DBC-to-Meteors-DEX_1)

#### Liquidity addition for meteora

Liquidity addition for meteora. Uses the `DEXPools` cube.

▶️ [Liquidity addition for meteora](https://ide.bitquery.io/liquidity-addition-for-meteora_1)

#### Liquidity removal for meteora

Liquidity removal for meteora. Uses the `DEXPools` cube.

▶️ [Liquidity removal for meteora](https://ide.bitquery.io/liquidity-removal-for-meteora_1)

#### Meteora DBC token migrations to Meteors DEX

Meteora DBC token migrations to Meteors DEX. Uses the `Instructions` cube.

▶️ [Meteora DBC token migrations to Meteors DEX](https://ide.bitquery.io/meteora-DBC-token-migrations-to-Meteors-DEX)

#### Real time trades on Meteora Dynamic Bonding Curve on Solana

Real time trades on Meteora Dynamic Bonding Curve on Solana. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Real time trades on Meteora Dynamic Bonding Curve on Solana](https://ide.bitquery.io/Real-time-trades-on-Meteora-Dynamic-Bonding-Curve-on-Solana)

#### Real time trades on MeteoraDAMMv2 DEX on Solana

Real time trades on MeteoraDAMMv2 DEX on Solana. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Real time trades on MeteoraDAMMv2 DEX on Solana](https://ide.bitquery.io/Real-time-trades-on-MeteoraDAMMv2-DEX-on-Solana)

### Orca

#### Latest pool created on Orca - Websocket

Latest pool created on Orca - Websocket. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Latest pool created on Orca - Websocket](https://ide.bitquery.io/Latest-pool-created-on-Orca---Websocket_1)

#### Liquidity addition for orca whirlpool

Liquidity addition for orca whirlpool. Uses the `DEXPools` cube.

▶️ [Liquidity addition for orca whirlpool](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool_1)

#### Liquidity removal for orca whirlpool

Liquidity removal for orca whirlpool. Uses the `DEXPools` cube.

▶️ [Liquidity removal for orca whirlpool](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool_1)

#### Orca DEX Trades Websocket

Orca DEX Trades Websocket. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Orca DEX Trades Websocket](https://ide.bitquery.io/Orca-DEX-Trades-Websocket)

#### Orca DEX Trades for a specific currency Websocket

Orca DEX Trades for a specific currency Websocket. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Orca DEX Trades for a specific currency Websocket](https://ide.bitquery.io/Orca-DEX-Trades-for-a-specific-currency-Websocket)

#### Price of a token on Orca

Price of a token on Orca. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Price of a token on Orca](https://ide.bitquery.io/Price-of-a-token-on-Orca)

### Jupiter

#### Latest Cancel Expired Order Transactions on Jupiter in realtime

Latest Cancel Expired Order Transactions on Jupiter in realtime. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Cancel Expired Order Transactions on Jupiter in realtime](https://ide.bitquery.io/Latest-Cancel-Expired-Order-Transactions-on-Jupiter-in-realtime_1)

#### Latest Cancel Limit Order Transactions on Jupiter in realtime

Latest Cancel Limit Order Transactions on Jupiter in realtime. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Cancel Limit Order Transactions on Jupiter in realtime](https://ide.bitquery.io/Latest-Cancel-Limit-Order-Transactions-on-Jupiter-in-realtime)

#### Tokens involved in Jupiter swap, source address, destination address, DEX involved

Tokens involved in Jupiter swap, source address, destination address, DEX involved. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [Tokens involved in Jupiter swap, source address, destination address, DEX involved](https://ide.bitquery.io/Tokens-involved-in-Jupiter-swap-source-address-destination-address-DEX-involved_2)

## BSC

### Trades

#### Real-time Trades on BSC

This subscription returns the real-time trades happening on BSC Network. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Real-time Trades on BSC](https://ide.bitquery.io/subscribe-to-dex-trades-on-BNB-mainnet)

#### All BNB Trade Stream

All BNB Trade Stream. Uses the `Trades` cube.

▶️ [All BNB Trade Stream](https://ide.bitquery.io/All-BNB-Trade-Stream)

#### Subscribe to bsc dex trades

Subscribe to bsc dex trades.

▶️ [Subscribe to bsc dex trades](https://ide.bitquery.io/subscribe-to-bsc-dex-trades)

### Transfers

#### Transfers where sender is a particular address

Transfers where sender is a particular address. Uses the `Transfers` cube.

▶️ [Transfers where sender is a particular address](https://ide.bitquery.io/Transfers-where-sender-is-a-particular-address)

### Balances & Holders

#### Real-time Transaction Balance Update for a Wallet on BSC

This stream provides real time transaction balance updates for a wallet on BSC.

▶️ [Real-time Transaction Balance Update for a Wallet on BSC](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-bsc)

#### Balance update after transfer received from multiple addresses--stream bsc

Balance update after transfer received from multiple addresses--stream bsc. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer received from multiple addresses--stream bsc](https://ide.bitquery.io/Balance-update-after-transfer-received-from-multiple-addresses--stream-bsc)

#### Balance update after transfer received--stream bsc

Balance update after transfer received--stream bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer received--stream bsc](https://ide.bitquery.io/Balance-update-after-transfer-received--stream-bsc)

#### Balance update after transfer sent from multiple addresses--stream bsc

Balance update after transfer sent from multiple addresses--stream bsc. Uses the `TransactionBalances` cube.

▶️ [Balance update after transfer sent from multiple addresses--stream bsc](https://ide.bitquery.io/Balance-update-after-transfer-sent-from-multiple-addresses--stream-bsc)

#### Balance update after transfer sent--stream bsc

Balance update after transfer sent--stream bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update after transfer sent--stream bsc](https://ide.bitquery.io/Balance-update-after-transfer-sent--stream-bsc)

#### Balance update from transfer for an address--stream bsc

Balance update from transfer for an address--stream bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update from transfer for an address--stream bsc](https://ide.bitquery.io/balance-update-from-transfer-for-an-address--stream-bsc)

#### Balance update from transfer for multiple addresses--stream bsc

Balance update from transfer for multiple addresses--stream bsc. Uses the `TransactionBalances` cube.

▶️ [Balance update from transfer for multiple addresses--stream bsc](https://ide.bitquery.io/balance-update-from-transfer-for-multiple-addresses--stream-bsc)

#### Monitor balance after unused gas fee returned for an address--stream bsc

Monitor balance after unused gas fee returned for an address--stream bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Monitor balance after unused gas fee returned for an address--stream bsc](https://ide.bitquery.io/Monitor-balance-after-unused-gas-fee-returned--for-an-address--stream-bsc)

#### Monitor balance after unused gas fee returned for multiple addresses--stream bsc

Monitor balance after unused gas fee returned for multiple addresses--stream bsc. Uses the `TransactionBalances` cube.

▶️ [Monitor balance after unused gas fee returned for multiple addresses--stream bsc](https://ide.bitquery.io/Monitor-balance-after-unused-gas-fee-returned--for-multiple-addresses--stream-bsc)

#### Monitor balance and gas fee paid for an address using stream bsc

Monitor balance and gas fee paid for an address using stream bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Monitor balance and gas fee paid for an address using stream bsc](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream-bsc)

### Price & OHLC

#### Realtime price of a ETH in terms of WBNB

Realtime price of a ETH in terms of WBNB. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Realtime price of a ETH in terms of WBNB](https://ide.bitquery.io/realtime-price-of-a-ETH-in-terms-of-WBNB)

#### Stream for latest prices for Flap.sh tokens

Stream for latest prices for Flap.sh tokens. Uses the `Pairs` cube.

▶️ [Stream for latest prices for Flap.sh tokens](https://ide.bitquery.io/Stream-for-latest-prices-for-Flapsh-tokens)

### Supply & Market Cap

#### BSC tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches BSC and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [BSC tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-bsc-tokens-with-marketcap-above-1-million_1)

#### All trades on BSC with Price, Marketcap, supply

All trades on BSC with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades on BSC with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-BSC-with-Price-Marketcap-supply)

#### Bsc token marketcap stream

Bsc token marketcap stream. Uses the `Tokens` cube.

▶️ [Bsc token marketcap stream](https://ide.bitquery.io/bsc-token-marketcap-stream)

### Liquidity & Pools

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on BSC. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_1)

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on BSC. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-bsc)

#### Realtime Liquidity Stream

Realtime Liquidity Stream.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_2)

### Events & Calls

#### Newly Created Tokens on BSC network

Newly Created Tokens on BSC network. Uses the `Calls` cube.

▶️ [Newly Created Tokens on BSC network](https://ide.bitquery.io/Newly-Created-Tokens-on-BSC-network_2)

### Mempool

#### Bsc mempool txs

Bsc mempool txs.

▶️ [Bsc mempool txs](https://ide.bitquery.io/bsc-mempool-txs)

#### Monitor mempool trades bsc

Monitor mempool trades bsc.

▶️ [Monitor mempool trades bsc](https://ide.bitquery.io/monitor-mempool-trades-bsc)

### Blocks & Validators

#### Real-time Validator Rewards for BSC

This stream provides the info on rewards received by validators on BSC in real time.

▶️ [Real-time Validator Rewards for BSC](https://ide.bitquery.io/Track-Validator-Balance-Updates-bsc_1)

#### Track MEV Balance in Real Time for BSC

This stream monitors MEV activities and Balance Updates on BSC in real time.

▶️ [Track MEV Balance in Real Time for BSC](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-bsc)

#### All Self-Destruct Event Balances Stream bsc

All Self-Destruct Event Balances Stream bsc. Uses the `TransactionBalances` cube.

▶️ [All Self-Destruct Event Balances Stream bsc](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-bsc)

#### Filter by MEV Bot or Builder Address bsc

Filter by MEV Bot or Builder Address bsc. Uses the `TransactionBalances` cube.

▶️ [Filter by MEV Bot or Builder Address bsc](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-bsc)

#### Filter by Miner Address bsc

Filter by Miner Address bsc. Uses the `TransactionBalances` cube.

▶️ [Filter by Miner Address bsc](https://ide.bitquery.io/Filter-by-Miner-Address-bsc)

#### Filter by Validator Address bsc

Filter by Validator Address bsc. Uses the `TransactionBalances` cube.

▶️ [Filter by Validator Address bsc](https://ide.bitquery.io/Filter-by-Validator-Address-bsc_1)

#### Track Block Mining Rewards bsc

Track Block Mining Rewards bsc. Uses the `TransactionBalances` cube.

▶️ [Track Block Mining Rewards bsc](https://ide.bitquery.io/Track-Block-Mining-Rewards-bsc)

#### Track Ephemeral MEV Contract Balance Changes bsc

Track Ephemeral MEV Contract Balance Changes bsc. Uses the `TransactionBalances` cube.

▶️ [Track Ephemeral MEV Contract Balance Changes bsc](https://ide.bitquery.io/Track-Ephemeral-MEV-Contract-Balance-Changes-bsc)

#### Track Large MEV Transactions bsc

Track Large MEV Transactions bsc. Uses the `TransactionBalances` cube.

▶️ [Track Large MEV Transactions bsc](https://ide.bitquery.io/Track-Large-MEV-Transactions-bsc)

#### Track Large Self-Destruct Transaction Balances bsc

Track Large Self-Destruct Transaction Balances bsc. Uses the `TransactionBalances` cube.

▶️ [Track Large Self-Destruct Transaction Balances bsc](https://ide.bitquery.io/Track-Large-Self-Destruct-Transaction-Balances-bsc)

### Four Meme

#### Four Meme Token Creations Stream

This stream returns the latest token creations on `Four Meme` on BSC Network in real time.

▶️ [Four Meme Token Creations Stream](https://ide.bitquery.io/track-Four-meme-token-creation-using-events_2)

#### Four Meme Trades Stream

This stream returns the latest trades happening on `Four Meme` on BSC Network in real time.

▶️ [Four Meme Trades Stream](https://ide.bitquery.io/Latest-trades-on-fourmeme)

#### Four Meme User Trades

This stream helps in monitoring the trades of a Four Meme user in real time.

▶️ [Four Meme User Trades](https://ide.bitquery.io/monitor-trades-of-a-trader-on-four-meme)

#### Stream Real-time MarketCap of FourMeme Tokens

Real-time market cap stream with OHLC for FourMeme tokens at 1-second intervals. Market cap is calculated from price using fixed 1 billion supply.

▶️ [Stream Real-time MarketCap of FourMeme Tokens](https://ide.bitquery.io/Real-Time-Marektcap-and-price-for-Four-meme-tokens)

#### Four Meme bonding curve completion mempool

Four Meme bonding curve completion mempool. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Four Meme bonding curve completion mempool](https://ide.bitquery.io/Four-Meme-bonding-curve-completion-mempool)

#### Four Meme large buys mempool

Four Meme large buys mempool. Uses the `DEXTrades` cube.

▶️ [Four Meme large buys mempool](https://ide.bitquery.io/Four-Meme-large-buys-mempool)

### PancakeSwap

#### Real-time Mempool Trades on Pancakeswap

Get real time unconfirmed trades on Pancakeswap, using the given stream.

▶️ [Real-time Mempool Trades on Pancakeswap](https://ide.bitquery.io/Mempool---Latest-BSC-PancakeSwap-v3-dextrades---Stream)

#### Track Four Meme Token migrations to PancakeSwap

This query tracks four meme token migrations to Pancakeswap in realtime by monitoring transactions sent to the Four Meme factory address and filtering for `PairCreated` and `PoolCreated` events. These events are emitted when a token graduates from Four Meme and migrates to Pancakeswap.

▶️ [Track Four Meme Token migrations to PancakeSwap](https://ide.bitquery.io/four-meme-migration-to-pancakeswap)

#### Binance meme rush migration to pancakeswap

Binance meme rush migration to pancakeswap. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Binance meme rush migration to pancakeswap](https://ide.bitquery.io/binance-meme-rush-migration-to-pancakeswap)

#### Latest BSC PancakeSwap v3 dextrades - Stream

Latest BSC PancakeSwap v3 dextrades - Stream. Uses the `DEXTrades` cube.

▶️ [Latest BSC PancakeSwap v3 dextrades - Stream](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades---Stream_2)

#### Mempool - Latest BSC PancakeSwap v3 dextrades - Stream

Mempool - Latest BSC PancakeSwap v3 dextrades - Stream. Uses the `DEXTrades` cube.

▶️ [Mempool - Latest BSC PancakeSwap v3 dextrades - Stream](https://ide.bitquery.io/Mempool---Latest-BSC-PancakeSwap-v3-dextrades---Stream_1)

#### Stream - BSC PancakeSwap v3 Trades for a token

Stream - BSC PancakeSwap v3 Trades for a token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Stream - BSC PancakeSwap v3 Trades for a token](https://ide.bitquery.io/Stream---BSC-PancakeSwap-v3-Trades-for-a-token)

### Uniswap

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4)

#### Newly Created Pools on Uniswap v3 on BSC network

Newly Created Pools on Uniswap v3 on BSC network. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Newly Created Pools on Uniswap v3 on BSC network](https://ide.bitquery.io/Newly-Created-Pools-on-Uniswap-v3-on-BSC-network_3)

#### Real time trades for uniswap v4 bsc

Real time trades for uniswap v4 bsc. Uses the `DEXTrades` cube.

▶️ [Real time trades for uniswap v4 bsc](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-bsc)

#### Uniswap v4 pool liquidity bsc

Uniswap v4 pool liquidity bsc. Uses the `DEXPoolEvents` cube.

▶️ [Uniswap v4 pool liquidity bsc](https://ide.bitquery.io/uniswap-v4-pool-liquidity-bsc)

#### Uniswap v4 pool liquidity by poolid bsc

Uniswap v4 pool liquidity by poolid bsc. Uses the `DEXPoolEvents` cube.

▶️ [Uniswap v4 pool liquidity by poolid bsc](https://ide.bitquery.io/uniswap-v4-pool-liquidity-by-poolid-bsc)

## Base

### Trades

#### Base DEX Trades Stream

This stream returns all the real time DEX trades happening on Base. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [Base DEX Trades Stream](https://ide.bitquery.io/subscribe-to-dex-trades-on-base_1)

#### All Base Trade Stream

All Base Trade Stream. Uses the `Trades` cube.

▶️ [All Base Trade Stream](https://ide.bitquery.io/All-Base-Trade-Stream)

#### Subscribe to dex trades on base

Subscribe to dex trades on base.

▶️ [Subscribe to dex trades on base](https://ide.bitquery.io/subscribe-to-dex-trades-on-base)

#### Subscription for Latest Trades for AERO

Subscription for Latest Trades for AERO. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Subscription for Latest Trades for AERO](https://ide.bitquery.io/Subscription-for-Latest-Trades-for-AERO_1)

### Transfers

#### Token Transfers Stream

This stream lets you monitor all the token transfers for a particular token. You can modify this subscription to track and monitor token transfers for a particular token from or to a particular address.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Subscribe-to-Latest-USDC-token-transfers)

#### Newly created zora tokens stream

Newly created zora tokens stream. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Newly created zora tokens stream](https://ide.bitquery.io/Newly-created-zora-tokens-stream)

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address_3)

#### Whale transfers of USDC on base

Whale transfers of USDC on base. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Whale transfers of USDC on base](https://ide.bitquery.io/Whale-transfers-of-USDC-on-base)

### Balances & Holders

#### Stream Token Balance of a Address in Real Time

Subscribe to real-time token balance updates for a specific address and token. This subscription will notify you whenever the token balance changes.

▶️ [Stream Token Balance of a Address in Real Time](https://ide.bitquery.io/Stream-Token-Balance-Updates-in-Real-Time-on-base)

#### Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the Base network.

▶️ [Subscribe to All Transaction Balances](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances_1)

#### Subscribe to Transaction Balances for a Specific Address

This subscription filters transaction balances for a specific address in real-time.

▶️ [Subscribe to Transaction Balances for a Specific Address](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address_1)

#### Track Token Balance Changes

Monitor token balance changes for a specific token across all transactions. This helps track token movements and transfers.

▶️ [Track Token Balance Changes](https://ide.bitquery.io/Track-Token-Balance-Changes-by-Transaction-on-base)

#### Balance update from transfer for an address stream base

Balance update from transfer for an address stream base. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Balance update from transfer for an address stream base](https://ide.bitquery.io/balance-update-from-transfer-for-an-address--stream-base)

#### Subscribe to All Transaction Balances base

Subscribe to All Transaction Balances base.

▶️ [Subscribe to All Transaction Balances base](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances-base)

#### Subscribe to Transaction Balances for a Specific Address base

Subscribe to Transaction Balances for a Specific Address base. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Subscribe to Transaction Balances for a Specific Address base](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-base)

#### Track Block Builder Rewards base

Track Block Builder Rewards base. Uses the `TransactionBalances` cube.

▶️ [Track Block Builder Rewards base](https://ide.bitquery.io/Track-Block-Builder-Rewards-base)

#### Track Transaction Fee Rewards base

Track Transaction Fee Rewards base. Uses the `TransactionBalances` cube.

▶️ [Track Transaction Fee Rewards base](https://ide.bitquery.io/Track-Transaction-Fee-Rewards-base)

### Price & OHLC

#### Real-time 1 second OHLC

This stream provides real time price and OHLC stream for all tokens on Base based on trades.

▶️ [Real-time 1 second OHLC](https://ide.bitquery.io/1-second-OHLC-k-line-Base)

#### Token Price Stream

This stream returns the real time trade price of a token against the token it is traded with and the price in USD. You could modify the stream to get the price of the token for a particular token pair or against a particular token.

▶️ [Token Price Stream](https://ide.bitquery.io/token-price-stream_2)

#### Aerodrome dex - realtime prices, 1-sec ohlc, trading volumes

Aerodrome dex - realtime prices, 1-sec ohlc, trading volumes. Uses the `Pairs` cube.

▶️ [Aerodrome dex - realtime prices, 1-sec ohlc, trading volumes](https://ide.bitquery.io/aerodrome-dex---realtime-prices-1-sec-ohlc-trading-volumes)

#### Get latest price of DAI in USD on Base

Get latest price of DAI in USD on Base. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get latest price of DAI in USD on Base](https://ide.bitquery.io/Get-latest-price-of-DAI-in-USD-on-Base)

#### Price of USDC in terms of DAI on Base network

Price of USDC in terms of DAI on Base network. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Price of USDC in terms of DAI on Base network](https://ide.bitquery.io/Price-of-USDC-in-terms-of-DAI-on-Base-network)

### Supply & Market Cap

#### Base token market cap stream (Trading API)

Subscribe to **`Tokens`** rows for assets whose currency id includes **`base`** (interval duration &gt; 1s).

▶️ [Base token market cap stream (Trading API)](https://ide.bitquery.io/base-token-marketcap-stream)

#### Base tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches Base and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [Base tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-base-tokens-with-marketcap-above-1-million)

#### All trades on Base with Price, Marketcap, supply

All trades on Base with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades on Base with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Base-with-Price-Marketcap-supply)

#### Bankr token realtime marketcap OHLC stream

Bankr token realtime marketcap OHLC stream. Uses the `Tokens` cube.

▶️ [Bankr token realtime marketcap OHLC stream](https://ide.bitquery.io/Bankr-token-realtime-marketcap-OHLC-stream)

#### Base tokens above 100k marketcap stream

Base tokens above 100k marketcap stream. Uses the `Tokens` cube.

▶️ [Base tokens above 100k marketcap stream](https://ide.bitquery.io/Base-tokens-above-100k-marketcap-stream)

### Liquidity & Pools

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on Base. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-base)

#### Realtime Liquidity Stream

Realtime Liquidity Stream.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_3)

#### Realtime Liquidity Stream of a Specific Pool

Realtime Liquidity Stream of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_3)

### Events & Calls

#### Realtime stream Bankr launches Base

Realtime stream Bankr launches Base. Uses the `Events` cube.

▶️ [Realtime stream Bankr launches Base](https://ide.bitquery.io/Realtime-stream-Bankr-launches-Base)

### Blocks & Validators

#### Monitoring Balance after Latest Gas Fee Burn

Monitor the balance and gas fee burnt for a particular address in real-time.

▶️ [Monitoring Balance after Latest Gas Fee Burn](https://ide.bitquery.io/Monitor-balance-and-gas-fee-paid-for-an-address-using-stream_2)

#### Track All Self-Destruct Event Balances

Monitor all contract self-destruct event balances in real-time.

▶️ [Track All Self-Destruct Event Balances](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-base_1)

#### Track Block Mining Rewards

Track rewards received by miners for successfully mining blocks in real-time.

▶️ [Track Block Mining Rewards](https://ide.bitquery.io/Track-Block-Mining-Rewards-base_1)

#### Track MEV-Related Balance Updates

Monitor balance changes related to MEV activities, including transaction fee rewards and block builder rewards.

▶️ [Track MEV-Related Balance Updates](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-base_1)

#### Track Miner Balance Updates

Monitor balance changes for Base miners, including block rewards, uncle block rewards, and transaction fee rewards.

▶️ [Track Miner Balance Updates](https://ide.bitquery.io/Track-Miner-Balance-Updates-BASE_1)

#### Track Validator Rewards

Track validator rewards and balance increases from staking activities in real-time.

▶️ [Track Validator Rewards](https://ide.bitquery.io/Track-Validator-Balance-Updates-on-base)

#### All Self Destruct Event Balances Stream base

All Self Destruct Event Balances Stream base. Uses the `TransactionBalances` cube.

▶️ [All Self Destruct Event Balances Stream base](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-base)

#### Filter by MEV Bot or Builder Address base

Filter by MEV Bot or Builder Address base. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Filter by MEV Bot or Builder Address base](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-base)

#### Filter by Miner Address base

Filter by Miner Address base. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Filter by Miner Address base](https://ide.bitquery.io/Filter-by-Miner-Address-base)

#### Track Block Mining Rewards base

Track Block Mining Rewards base. Uses the `TransactionBalances` cube.

▶️ [Track Block Mining Rewards base](https://ide.bitquery.io/Track-Block-Mining-Rewards-base)

### Uniswap

#### Pair Creation on Uniswap

This stream returns the real time liquidity pools/token pairs created on Uniswap V3. You could modify the stream to monitor newly created pools on a different protocol.

▶️ [Pair Creation on Uniswap](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3-Base)

#### Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Base). Great for bot trading strategies.

▶️ [Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC_1)

#### Bankr token V4 swaps realtime

Bankr token V4 swaps realtime. Uses the `Trades` cube.

▶️ [Bankr token V4 swaps realtime](https://ide.bitquery.io/Bankr-token-V4-swaps-realtime)

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_5)

#### Real time trades on uniswap v4 base

Real time trades on uniswap v4 base. Uses the `DEXTrades` cube.

▶️ [Real time trades on uniswap v4 base](https://ide.bitquery.io/Real-time-trades-on-uniswap-v4-base)

#### Uniswap v4 pool liquidity base

Uniswap v4 pool liquidity base. Uses the `DEXPoolEvents` cube.

▶️ [Uniswap v4 pool liquidity base](https://ide.bitquery.io/uniswap-v4-pool-liquidity-base)

## Arbitrum

### Trades

#### Arbitrum Dextrades subscription

Arbitrum Dextrades subscription.

▶️ [Arbitrum Dextrades subscription](https://ide.bitquery.io/Arbitrum-Dextrades-subscription)

### Supply & Market Cap

#### Arbitrum token marketcap stream

Arbitrum token marketcap stream. Uses the `Tokens` cube.

▶️ [Arbitrum token marketcap stream](https://ide.bitquery.io/arbitrum-token-marketcap-stream)

#### Realtime stream arbitrum tokens with marketcap above 1 million

Realtime stream arbitrum tokens with marketcap above 1 million. Uses the `Tokens` cube.

▶️ [Realtime stream arbitrum tokens with marketcap above 1 million](https://ide.bitquery.io/realtime-stream-arbitrum-tokens-with-marketcap-above-1-million)

### Liquidity & Pools

#### Realtime liquidity stream

Realtime liquidity stream.

▶️ [Realtime liquidity stream](https://ide.bitquery.io/realtime-liquidity-stream_1)

#### Realtime liquidity stream of a specific pool

Realtime liquidity stream of a specific pool. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Realtime liquidity stream of a specific pool](https://ide.bitquery.io/realtime-liquidity-stream-of-a-specific-pool)

#### Realtime slippage on arbitrum

Realtime slippage on arbitrum.

▶️ [Realtime slippage on arbitrum](https://ide.bitquery.io/realtime-slippage-on-arbitrum)

### Transactions

#### Arbitrum: Timeboost Auction Transactions in Realtime

Arbitrum: Timeboost Auction Transactions in Realtime. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Arbitrum: Timeboost Auction Transactions in Realtime](https://ide.bitquery.io/Arbitrum-Timeboost-Auction-Transactions-in-Realtime)

### Uniswap

#### Latest liquidity changes in uniswap v4 pools

Latest liquidity changes in uniswap v4 pools. Uses the `DEXPoolEvents` cube.

▶️ [Latest liquidity changes in uniswap v4 pools](https://ide.bitquery.io/latest-liquidity-changes-in-uniswap-v4-pools)

#### Real time trades for uniswap v4 arbitrum

Real time trades for uniswap v4 arbitrum. Uses the `DEXTrades` cube.

▶️ [Real time trades for uniswap v4 arbitrum](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-arbitrum)

## Optimism

### Trades

#### Real time trades for uniswap v4 optimism

Real time trades for uniswap v4 optimism. Uses the `DEXTrades` cube.

▶️ [Real time trades for uniswap v4 optimism](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-optimism)

#### Realtime optimism dex trades websocket

Realtime optimism dex trades websocket.

▶️ [Realtime optimism dex trades websocket](https://ide.bitquery.io/Realtime-optimism-dex-trades-websocket)

### Transfers

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address)

#### Whale transfers of USDT on optimism

Whale transfers of USDT on optimism. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Whale transfers of USDT on optimism](https://ide.bitquery.io/Whale-transfers-of-USDT-on-optimism)

### Price & OHLC

#### Get latest price of WBTC in USD on optimism

Get latest price of WBTC in USD on optimism. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get latest price of WBTC in USD on optimism](https://ide.bitquery.io/Get-latest-price-of-WBTC-in-USD-on-optimism)

#### Price of WETH in terms of USDC on Optimism

Price of WETH in terms of USDC on Optimism. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Price of WETH in terms of USDC on Optimism](https://ide.bitquery.io/Price-of-WETH-in-terms-of-USDC-on-Optimism)

## Polygon

### Trades

#### Real time trades for uniswap v4 matic

Real time trades for uniswap v4 matic. Uses the `DEXTrades` cube.

▶️ [Real time trades for uniswap v4 matic](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-matic)

#### Realtime matic dex trades websocket

Realtime matic dex trades websocket.

▶️ [Realtime matic dex trades websocket](https://ide.bitquery.io/Realtime-matic-dex-trades-websocket)

### Transfers

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address_2)

#### Whale transfers of USDC on matic

Whale transfers of USDC on matic. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Whale transfers of USDC on matic](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic)

### Supply & Market Cap

#### All trades on Polygon with Price, Marketcap, supply

All trades on Polygon with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades on Polygon with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Polygon-with-Price-Marketcap-supply)

#### Matic token marketcap stream

Matic token marketcap stream. Uses the `Tokens` cube.

▶️ [Matic token marketcap stream](https://ide.bitquery.io/matic-token-marketcap-stream)

### Liquidity & Pools

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_7)

#### Realtime Liquidity Stream

Realtime Liquidity Stream.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_5)

#### Realtime Liquidity Stream of a Specific Pool

Realtime Liquidity Stream of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_5)

#### Realtime slippage on matic

Realtime slippage on matic.

▶️ [Realtime slippage on matic](https://ide.bitquery.io/realtime-slippage-on-matic)

## TRON

### Trades

#### Real-time Trades on Sunpump

This stream returns all the real time DEX trades happening on Sunpump exchange on the Tron network. You can modify this stream to get the trades of a particular token or trades by a particular trader.

▶️ [Real-time Trades on Sunpump](https://ide.bitquery.io/real-time-sunswapTrades)

#### Real-time Trades on Tron

This stream returns all the real time DEX trades happening on the Tron network. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [Real-time Trades on Tron](https://ide.bitquery.io/Latest-trades-on-Tron)

#### Sunpump trades

Sunpump trades. Uses the `DEXTrades` cube.

▶️ [Sunpump trades](https://ide.bitquery.io/Sunpump-trades)

#### USDT TRC20 DEX Trades

USDT TRC20 DEX Trades. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [USDT TRC20 DEX Trades](https://ide.bitquery.io/USDT-TRC20-DEX-Trades)

### Transfers

#### Real-time Tether USDT Transfers

This subscription streams the latest USDT (TRC20) transfers on the TRON network. You can modify the stream to monitor Transfers of USDT from or to a particular address.

▶️ [Real-time Tether USDT Transfers](https://ide.bitquery.io/usdt-trc20-transfers_1)

#### Sender is particular address

Sender is particular address. Uses the `Transfers` cube.

▶️ [Sender is particular address](https://ide.bitquery.io/Sender-is-particular-address)

#### Whale transfers of USDT on Tron

Whale transfers of USDT on Tron. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Whale transfers of USDT on Tron](https://ide.bitquery.io/Whale-transfers-of-USDT-on-Tron)

### Price & OHLC

#### Track price of a tron token in realtime

Track price of a tron token in realtime. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Track price of a tron token in realtime](https://ide.bitquery.io/Track-price-of-a-tron-token-in-realtime)

### Supply & Market Cap

#### Get All DEX Trades on Tron With Price, Market Cap, and Supply

Get All DEX Trades on Tron With Price, Market Cap, and Supply. Uses the `Trades` cube.

▶️ [Get All DEX Trades on Tron With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-Tron-With-Price-Market-Cap-and-Supply)

### Transactions

#### Monitor TRX address transactions

Monitor TRX address transactions. Uses the `Transactions` cube.

▶️ [Monitor TRX address transactions](https://ide.bitquery.io/monitor-TRX-address-transactions)

### Events & Calls

#### Latest Buy on SunPump

Latest Buy on SunPump. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Buy on SunPump](https://ide.bitquery.io/latest-Buy-on-SunPump)

#### New tokens on sunpump

New tokens on sunpump. Uses the `Events` cube.

▶️ [New tokens on sunpump](https://ide.bitquery.io/New-tokens-on-sunpump_1)

#### Sunpump sell event

Sunpump sell event. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Sunpump sell event](https://ide.bitquery.io/sunpump-sell-event)

#### Tron sunpump first time buy event

Tron sunpump first time buy event. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Tron sunpump first time buy event](https://ide.bitquery.io/Tron-sunpump-first-time-buy-event_1)

### Mempool

#### Events with argumens

Events with argumens. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Events with argumens](https://ide.bitquery.io/Events-with-argumens)

#### Sunpump trades mempool

Sunpump trades mempool. Uses the `DEXTrades` cube.

▶️ [Sunpump trades mempool](https://ide.bitquery.io/Sunpump-trades-mempool)

#### Tron mempool transfers

Tron mempool transfers.

▶️ [Tron mempool transfers](https://ide.bitquery.io/Tron-mempool-transfers)

## Robinhood Chain

### Trades

#### Latest DEX Trades on Robinhood Chain

Latest DEX trades on Robinhood Chain (chain id 4663) via the Trading API, with price and USD amounts.

▶️ [Latest DEX Trades on Robinhood Chain](https://ide.bitquery.io/Robinhood-Trades)

#### Bags amm trade websocket

Bags amm trade websocket. Uses the `Trades` cube.

▶️ [Bags amm trade websocket](https://ide.bitquery.io/bags-amm-trade-websocket)

#### Pools trade Stream new Crowd Launch auctions

Pools trade Stream new Crowd Launch auctions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Pools trade Stream new Crowd Launch auctions](https://ide.bitquery.io/Pools-trade-Stream-new-Crowd-Launch-auctions)

#### Robinhood Chain API - Trades for a Token

Robinhood Chain API - Trades for a Token. Uses the `Trades` cube.

▶️ [Robinhood Chain API - Trades for a Token](https://ide.bitquery.io/Robinhood-Trades-for-a-token)

#### Stream Robinhood Chain Trades in Real Time

Stream Robinhood Chain Trades in Real Time. Uses the `Trades` cube.

▶️ [Stream Robinhood Chain Trades in Real Time](https://ide.bitquery.io/stream-robinhood-chain-trades)

### Transfers

#### Ape.store Newly created tokens - Websocket

Ape.store Newly created tokens - Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Ape.store Newly created tokens - Websocket](https://ide.bitquery.io/Apestore-Newly-created-tokens---Websocket)

#### Bags.fm Newly created tokens - Websocket

Bags.fm Newly created tokens - Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Bags.fm Newly created tokens - Websocket](https://ide.bitquery.io/Bagsfm-Newly-created-tokens---Websocket)

#### Bankr Bot Newly created tokens - Websocket

Bankr Bot Newly created tokens - Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Bankr Bot Newly created tokens - Websocket](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens---Websocket)

#### Flap Sh Newly created tokens using transfer data - Websocket

Flap Sh Newly created tokens using transfer data - Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Flap Sh Newly created tokens using transfer data - Websocket](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data---Websocket)

#### Hoodfun newly creaed tokens Websocket

Hoodfun newly creaed tokens Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Hoodfun newly creaed tokens Websocket](https://ide.bitquery.io/hoodfun-newly-creaed-tokens---Websocket)

#### Klik Finance Newly created tokens using transfers websocket

Klik Finance Newly created tokens using transfers websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Klik Finance Newly created tokens using transfers websocket](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers-websocket)

#### Launchpad newly creaed tokens Websocket

Launchpad newly creaed tokens Websocket. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Launchpad newly creaed tokens Websocket](https://ide.bitquery.io/launchpad-newly-creaed-tokens---Websocket)

#### Pools trade Stream launches with token detail

Pools trade Stream launches with token detail. Uses the `Transfers` cube.

▶️ [Pools trade Stream launches with token detail](https://ide.bitquery.io/Pools-trade-Stream-launches-with-token-detail)

#### Real time transfers on robinhood

Real time transfers on robinhood.

▶️ [Real time transfers on robinhood](https://ide.bitquery.io/real-time-transfers-on-robinhood)

### Price & OHLC

#### Robinhood Chain OHLCV / Candlestick API for a Token Pair

Robinhood Chain OHLCV / Candlestick API for a Token Pair. Uses the `Pairs` cube.

▶️ [Robinhood Chain OHLCV / Candlestick API for a Token Pair](https://ide.bitquery.io/OHLCV-stream-for-a-token-pair-on-robinhood)

### Liquidity & Pools

#### Stream New pools.trade Token Launches

Websocket subscription streaming every new pools.trade token launch on Robinhood Chain the moment it happens.

▶️ [Stream New pools.trade Token Launches](https://ide.bitquery.io/Pools-trade-Stream-new-launches)

### Events & Calls

#### Flap sh Newly created tokens using logs (TokenCreated) - Websocket

Flap sh Newly created tokens using logs (TokenCreated) - Websocket. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Flap sh Newly created tokens using logs (TokenCreated) - Websocket](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated---Websocket)

#### Stream New Tokens on Robinhood Chain (All Launchpads)

Stream New Tokens on Robinhood Chain (All Launchpads). Uses the `Events` cube.

▶️ [Stream New Tokens on Robinhood Chain (All Launchpads)](https://ide.bitquery.io/stream-new-tokens-robinhood-chain)

## Bitcoin

### Price & OHLC

#### Latest Bitcoin Price

You can stream Bitcoin price at 1-second interval using the [Crypto Price APIs](/docs/trading/crypto-price-api/introduction/).

▶️ [Latest Bitcoin Price](https://ide.bitquery.io/Stream-Bitcoin-Price-Across-Chains)

## Trading API

### Trades

#### All chains New Trades Stream - Solana, eth, bsc ,base , arbitrum, matic

All chains New Trades Stream - Solana, eth, bsc ,base , arbitrum, matic.

▶️ [All chains New Trades Stream - Solana, eth, bsc ,base , arbitrum, matic](https://ide.bitquery.io/all-chains-New-Trades-Stream---Solana-eth-bsc-base--arbitrum-matic_2)

#### All trades of a trader

All trades of a trader. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [All trades of a trader](https://ide.bitquery.io/All-trades-of-a-trader)

#### All wsol Trade Stream

All wsol Trade Stream. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [All wsol Trade Stream](https://ide.bitquery.io/All-wsol-Trade-Stream)

#### How do I get a wallet's trades on a specific pair?

How do I get a wallet's trades on a specific pair?. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [How do I get a wallet's trades on a specific pair?](https://ide.bitquery.io/How-do-I-get-a-wallets-trades-on-a-specific-pair)

#### How do I monitor multiple wallets in one subscription?

How do I monitor multiple wallets in one subscription?. Uses the `Trades` cube.

▶️ [How do I monitor multiple wallets in one subscription?](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-in-one-subscription)

#### How do I monitor multiple wallets trading a specific token?

How do I monitor multiple wallets trading a specific token?. Uses the `Trades` cube.

▶️ [How do I monitor multiple wallets trading a specific token?](https://ide.bitquery.io/How-do-I-monitor-multiple-wallets-trading-a-specific-token)

#### How do I stream a wallet's trades on a specific DEX?

How do I stream a wallet's trades on a specific DEX?. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [How do I stream a wallet's trades on a specific DEX?](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-DEX)

#### How do I stream a wallet's trades on a specific chain?

How do I stream a wallet's trades on a specific chain?. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [How do I stream a wallet's trades on a specific chain?](https://ide.bitquery.io/How-do-I-stream-a-wallets-trades-on-a-specific-chain)

#### How do I stream whale trades for a specific wallet?

How do I stream whale trades for a specific wallet?. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [How do I stream whale trades for a specific wallet?](https://ide.bitquery.io/How-do-I-stream-whale-trades-for-a-specific-wallet)

#### How do I track trades for multiple tokens in one subscription?

How do I track trades for multiple tokens in one subscription?. Uses the `Trades` cube.

▶️ [How do I track trades for multiple tokens in one subscription?](https://ide.bitquery.io/How-do-I-track-trades-for-multiple-tokens-in-one-subscription)

### Price & OHLC

#### FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Track token activity (OHLC, price, volume) every 1 second on FourMeme DEX (BSC).

▶️ [FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/FourMeme-DEX-tokens-1-second-price-stream-with-OHLC)

#### PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Real-time (1-second interval) price, OHLC, volume, and moving averages for Pump.fun AMM tokens on Solana. Useful for high-frequency trading bots.

▶️ [PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/PumpAMM-tokens-1-second-price-stream-with-OHLC_1)

#### Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Monitor Raydium Launchlab token listings on Solana with 1-second OHLC and volume streams. Perfect for tracking new token launches.

▶️ [Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

#### 5 minute price change api on solana

5 minute price change api on solana. Uses the `Tokens` cube.

▶️ [5 minute price change api on solana](https://ide.bitquery.io/5-minute-price-change-api-on-solana_6)

#### Bitcoin currency price stream

Bitcoin currency price stream. Uses the `Currencies` cube.

▶️ [Bitcoin currency price stream](https://ide.bitquery.io/bitcoin-currency-price-stream)

#### Heaven DEX tokens 1 second price stream with OHLC

Heaven DEX tokens 1 second price stream with OHLC. Uses the `Pairs` cube.

▶️ [Heaven DEX tokens 1 second price stream with OHLC](https://ide.bitquery.io/Heaven-DEX-tokens-1-second-price-stream-with-OHLC)

#### Meteora DBC DEX tokens 1 second price stream with OHLC

Meteora DBC DEX tokens 1 second price stream with OHLC. Uses the `Pairs` cube.

▶️ [Meteora DBC DEX tokens 1 second price stream with OHLC](https://ide.bitquery.io/Meteora-DBC-DEX-tokens-1-second-price-stream-with-OHLC)

#### Real Time USD price on solana chain

Real Time USD price on solana chain. Uses the `Pairs` cube.

▶️ [Real Time USD price on solana chain](https://ide.bitquery.io/Real-Time-USD-price-on-solana-chain_2)

### Supply & Market Cap

#### All trades of a specific Ethereum token with Price, Marketcap, supply

All trades of a specific Ethereum token with Price, Marketcap, supply. Uses the `Trades` cube.

▶️ [All trades of a specific Ethereum token with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-of-a-specific-Ethereum-token-with-Price-Marketcap-supply_1)

### Liquidity & Pools

#### Liquidity addition for radium

Liquidity addition for radium. Uses the `DEXPools` cube.

▶️ [Liquidity addition for radium](https://ide.bitquery.io/liquidity-addition-for-radium_1)

#### Liquidity removal for radium

Liquidity removal for radium. Uses the `DEXPools` cube.

▶️ [Liquidity removal for radium](https://ide.bitquery.io/liquidity-removal-for-radium_1)

### Pump.fun

#### All Pumpswap Trade Stream

All Pumpswap Trade Stream. Uses the `Trades` cube.

▶️ [All Pumpswap Trade Stream](https://ide.bitquery.io/All-Pumpswap-Trade-Stream)

#### All pumpfun Trade Stream

All pumpfun Trade Stream. Uses the `Trades` cube.

▶️ [All pumpfun Trade Stream](https://ide.bitquery.io/All-pumpfun-Trade-Stream_2)

#### Pump fun token live prices using trades api

Pump fun token live prices using trades api. Uses the `Trades` cube.

▶️ [Pump fun token live prices using trades api](https://ide.bitquery.io/pump-fun-token-live-prices-using-trades-api_1)

### PancakeSwap

#### Real-time Trades on Pancakeswap

This subscription returns the real-time trades happening on Pancakeswap. You can modify the stream to get real time trades for a particular token, a particular token pair, and even a particular trader.

▶️ [Real-time Trades on Pancakeswap](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades---Stream)

#### PancakeSwap v3 DEX tokens 1 second price stream with OHLC

PancakeSwap v3 DEX tokens 1 second price stream with OHLC. Uses the `Pairs` cube. Replace the address in the `where` clause to use it.

▶️ [PancakeSwap v3 DEX tokens 1 second price stream with OHLC](https://ide.bitquery.io/PancakeSwap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

### Uniswap

#### 1-second price, OHLC, volume, SMA and EMA — Uniswap v3

One-second candles with moving averages for Uniswap v3 tokens, built for trading front-ends.

▶️ [1-second price, OHLC, volume, SMA and EMA — Uniswap v3](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC)

#### Stream all Uniswap Seconds OHLC Kline

Stream all Uniswap Seconds OHLC Kline. Uses the `Pairs` cube.

▶️ [Stream all Uniswap Seconds OHLC Kline](https://ide.bitquery.io/Stream-all-Uniswap-Seconds-OHLC-Kline)

#### Uniswap all versions trades stream

Uniswap all versions trades stream. Uses the `DEXTrades` cube.

▶️ [Uniswap all versions trades stream](https://ide.bitquery.io/uniswap-all-versions-trades-stream)

## Stablecoins

### Trades

#### Solana trades subscription

Solana trades subscription. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Solana trades subscription](https://ide.bitquery.io/solana-trades-subscription_10_1)

#### Stablecoin Depeg tracking Stream for evm

Stablecoin Depeg tracking Stream for evm. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin Depeg tracking Stream for evm](https://ide.bitquery.io/Stablecoin-Depeg-tracking-Stream-for-evm)

#### Stablecoin Depeg tracking Stream for tron

Stablecoin Depeg tracking Stream for tron. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin Depeg tracking Stream for tron](https://ide.bitquery.io/Stablecoin-Depeg-tracking-Stream-for-tron)

#### Stablecoin depeg tracking stream for USDC

Stablecoin depeg tracking stream for USDC. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin depeg tracking stream for USDC](https://ide.bitquery.io/stablecoin-depeg-tracking-stream-for-USDC)

#### Stablecoin trades for etheruem

Stablecoin trades for etheruem. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin trades for etheruem](https://ide.bitquery.io/Stablecoin-trades-for-etheruem)

#### Stablecoin trades for tron

Stablecoin trades for tron. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin trades for tron](https://ide.bitquery.io/Stablecoin-trades-for-tron)

### Transfers

#### Latest Tron USDT Transfers stream

Latest Tron USDT Transfers stream. Uses the `Transfers` cube.

▶️ [Latest Tron USDT Transfers stream](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream)

#### Latest USDT/USDC Transfer Stream on BSC

Latest USDT/USDC Transfer Stream on BSC. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer Stream on BSC](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC)

#### Latest USDT/USDC Transfer stream on base

Latest USDT/USDC Transfer stream on base. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer stream on base](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-base)

#### Latest USDT/USDC Transfer stream on ethereum

Latest USDT/USDC Transfer stream on ethereum. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer stream on ethereum](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum)

#### Listening to All USDT and USDC Payments on Solana - stream

Listening to All USDT and USDC Payments on Solana - stream. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Listening to All USDT and USDC Payments on Solana - stream](https://ide.bitquery.io/Listening-to-All-USDT-and-USDC-Payments-on-Solana---stream)

#### Listening to stablecoin Transfers for Specific Addresse on tron

Listening to stablecoin Transfers for Specific Addresse on tron. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Listening to stablecoin Transfers for Specific Addresse on tron](https://ide.bitquery.io/Listening-to-stablecoin-Transfers-for-Specific-Addresse-on-tron)

#### Stablecoin Realtime Payments Stream on Eth Mainnet

Stablecoin Realtime Payments Stream on Eth Mainnet. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin Realtime Payments Stream on Eth Mainnet](https://ide.bitquery.io/Stablecoin-Realtime-Payments-Stream-on-Eth-Mainnet)

#### Stablecoin Realtime Transfers Stream on tron

Stablecoin Realtime Transfers Stream on tron. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin Realtime Transfers Stream on tron](https://ide.bitquery.io/Stablecoin-Realtime-Transfers-Stream-on-tron)

#### Stablecoin transfers websocket

Stablecoin transfers websocket. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin transfers websocket](https://ide.bitquery.io/stablecoin-transfers-websocket)

#### USDT and USDC token Transfers stream on solana

USDT and USDC token Transfers stream on solana. Uses the `Transfers` cube.

▶️ [USDT and USDC token Transfers stream on solana](https://ide.bitquery.io/USDT-and-USDC-token-Transfers-stream-on-solana)

### Balances & Holders

#### Real time stablecoin portfolio

Real time stablecoin portfolio. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Real time stablecoin portfolio](https://ide.bitquery.io/real-time-stablecoin-portfolio_2)

### Price & OHLC

#### Stablecoin 1 sec Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all stablecoins including USDC, USDT, DAI, USDS etc.

▶️ [Stablecoin 1 sec Price Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)

#### Stablecoin price stream of USDT

Stablecoin price stream of USDT. Uses the `Tokens` cube.

▶️ [Stablecoin price stream of USDT](https://ide.bitquery.io/stablecoin-price-stream-of-USDT_2)

### Supply & Market Cap

#### USDT Stablecoin reserves on Solana

USDT Stablecoin reserves on Solana. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDT Stablecoin reserves on Solana](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana)

### Mempool

#### Latest Tron USDT Transfers stream in Mempool

Latest Tron USDT Transfers stream in Mempool. Uses the `Transfers` cube.

▶️ [Latest Tron USDT Transfers stream in Mempool](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream-in-Mempool)

#### Latest USDT/USDC Transfer Stream on BSC on Mempool

Latest USDT/USDC Transfer Stream on BSC on Mempool. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer Stream on BSC on Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC-on-Mempool)

#### Latest USDT/USDC Transfer stream on ethereum in Mempool

Latest USDT/USDC Transfer stream on ethereum in Mempool. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer stream on ethereum in Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum-in-Mempool)

## Perpetuals

### Trades

#### Hyperliquid Real-time Trades Stream (WebSocket)

Hyperliquid Real-time Trades Stream (WebSocket).

▶️ [Hyperliquid Real-time Trades Stream (WebSocket)](https://ide.bitquery.io/hyperliquid-trades-stream)

#### Solana Perps Live Trades Stream (Phoenix Fills)

Solana Perps Live Trades Stream (Phoenix Fills).

▶️ [Solana Perps Live Trades Stream (Phoenix Fills)](https://ide.bitquery.io/solana-perps-live-trades-stream)

### Price & OHLC

#### Hyperliquid Price Updates Stream (WebSocket)

Hyperliquid Price Updates Stream (WebSocket).

▶️ [Hyperliquid Price Updates Stream (WebSocket)](https://ide.bitquery.io/hyperliquid-price-updates-stream)

#### Hyperliquid Real-time Candles Stream (WebSocket)

Hyperliquid Real-time Candles Stream (WebSocket).

▶️ [Hyperliquid Real-time Candles Stream (WebSocket)](https://ide.bitquery.io/hyperliquid-candles-stream)

#### Solana Perpetuals Mark Price Stream (Phoenix)

Solana Perpetuals Mark Price Stream (Phoenix).

▶️ [Solana Perpetuals Mark Price Stream (Phoenix)](https://ide.bitquery.io/solana-perpetuals-mark-price-stream)

## NFTs

### Trades

#### NFT Trades on Opensea

This stream allows you to monitor real time NFT trades on OpenSea. It could also be modified to get trades of a particular NFT collection or NFTs traded by a particular trader.

▶️ [NFT Trades on Opensea](https://ide.bitquery.io/Latests-OpenSea-Trades--stream)

#### Latest Solana NFT Trades

Latest Solana NFT Trades.

▶️ [Latest Solana NFT Trades](https://ide.bitquery.io/Latest-Solana-NFT-Trades)

### Transfers

#### ERC-721 (NFT) transfers

NFT transfers as they are mined, with token IDs.

▶️ [ERC-721 (NFT) transfers](https://ide.bitquery.io/ERC721-token-transfers)

#### Subscription WebSocket - Latest NFT Transfers

Subscription WebSocket - Latest NFT Transfers.

▶️ [Subscription WebSocket - Latest NFT Transfers](https://ide.bitquery.io/Subscription-WebSocket---Latest-NFT-Transfers)

#### Subscribe to the latest NFT transfers on Solana

Subscribe to the latest NFT transfers on Solana.

▶️ [Subscribe to the latest NFT transfers on Solana](https://ide.bitquery.io/Subscribe-to-the-latest-NFT-transfers-on-Solana)

#### NFT Token Transfers API

NFT Token Transfers API.

▶️ [NFT Token Transfers API](https://ide.bitquery.io/NFT-Token-Transfers-API_4)

#### Transfers of a particular NFT

Transfers of a particular NFT.

▶️ [Transfers of a particular NFT](https://ide.bitquery.io/Transfers-of-a-particular-NFT_1)

#### Track realtime NFT Transfers of a specific NFT on BSC chain

Track realtime NFT Transfers of a specific NFT on BSC chain.

▶️ [Track realtime NFT Transfers of a specific NFT on BSC chain](https://ide.bitquery.io/Track-realtime-NFT-Transfers-of-a-specific-NFT-on-BSC-chain)

#### Track realtime NFT Transfers on BSC chain

Track realtime NFT Transfers on BSC chain.

▶️ [Track realtime NFT Transfers on BSC chain](https://ide.bitquery.io/Track-realtime-NFT-Transfers-on-BSC-chain)

#### Websocket for tracking Transfers of a particular NFT websocket

Websocket for tracking Transfers of a particular NFT websocket.

▶️ [Websocket for tracking Transfers of a particular NFT websocket](https://ide.bitquery.io/Websocket-for-tracking-Transfers-of-a-particular-NFT-websocket)

#### Real-time-transfer-websocket-for-NFT-token on matic

Real-time-transfer-websocket-for-NFT-token on matic.

▶️ [Real-time-transfer-websocket-for-NFT-token on matic](https://ide.bitquery.io/Real-time-transfer-websocket-for-NFT-token-on-matic)

### Balances & Holders

#### Stream NFT Balance Updates in Real Time

Subscribe to real-time NFT balance updates for a specific address and collection. This subscription will notify you whenever NFT ownership changes.

▶️ [Stream NFT Balance Updates in Real Time](https://ide.bitquery.io/Stream-NFT-Balance-Updates-in-Real-Time)

#### Track Specific NFT Balance Changes

Monitor NFT transfers for a specific collection across all transactions. This helps track NFT movements and ownership changes.

▶️ [Track Specific NFT Balance Changes](https://ide.bitquery.io/Track-specific-NFTs-Balance-Changes)

## Polymarket

### Trades

#### Real-Time Trades Stream

Subscribe to live prediction market trades as they occur on Polygon (successful transactions only).

▶️ [Real-Time Trades Stream](https://ide.bitquery.io/prediction-market-trades-subscription)

#### Trades for a Specific Market (Stream)

Subscribe to trades for one market only by filtering on Question.MarketId. Replace the market ID in the query with your target market.

▶️ [Trades for a Specific Market (Stream)](https://ide.bitquery.io/subscribe-to-specific-market-trades)

#### Bitcoin Up or Down Trades Stream

Bitcoin Up or Down Trades Stream.

▶️ [Bitcoin Up or Down Trades Stream](https://ide.bitquery.io/Bitcoin-Up-or-Down-Trades-Stream)

#### How do I track high-value or whale trades on Polymarket?

How do I track high-value or whale trades on Polymarket?.

▶️ [How do I track high-value or whale trades on Polymarket?](https://ide.bitquery.io/How-do-I-track-high-value-or-whale-trades-on-Polymarket)

#### Large trades on polymarket

Large trades on polymarket.

▶️ [Large trades on polymarket](https://ide.bitquery.io/large-trades--on-polymarket)

#### Monitoring specific wallets trades in realtime for Ethereum up or down market

Monitoring specific wallets trades in realtime for Ethereum up or down market.

▶️ [Monitoring specific wallets trades in realtime for Ethereum up or down market](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-Ethereum-up-or-down-market)

#### Monitoring specific wallets trades in realtime for XRP up or down market

Monitoring specific wallets trades in realtime for XRP up or down market.

▶️ [Monitoring specific wallets trades in realtime for XRP up or down market](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-XRP-up-or-down-market)

#### Polymarket AI whale trades stream

Polymarket AI whale trades stream.

▶️ [Polymarket AI whale trades stream](https://ide.bitquery.io/Polymarket-AI-whale-trades-stream)

#### Polymarket whale trades alert

Polymarket whale trades alert.

▶️ [Polymarket whale trades alert](https://ide.bitquery.io/polymarket-whale-trades-alert_1)

### Markets

#### Real-Time Management Stream (Creations + Resolutions)

Subscribe to all prediction market lifecycle events (Created and Resolved) as they occur on Polygon.

▶️ [Real-Time Management Stream (Creations + Resolutions)](https://ide.bitquery.io/Prediction-Managements-subscription-resolutions-creations)

#### Real-Time Market Creations

Subscribe only to new market (Created) events.

▶️ [Real-Time Market Creations](https://ide.bitquery.io/track-realtime-new-polymarket-creations)

#### Real-Time Market Resolutions

Subscribe only to Resolved events. Winning outcome is in Prediction.Outcome; token details (e.g. AssetId) in Prediction.OutcomeToken.

▶️ [Real-Time Market Resolutions](https://ide.bitquery.io/track-realtime-polymarket-resolutions)

### Settlements

#### Real-Time Settlement Stream

Subscribe to live Split, Merge, and Redemption events as they occur on Polygon.

▶️ [Real-Time Settlement Stream](https://ide.bitquery.io/realtime-predicion-market-settlements-stream)

## x402

### Transfers

#### Real-Time Payment Monitoring for x402 Server

Real-time subscription to monitor payments to a specific x402 server on Base network using WebSockets.

▶️ [Real-Time Payment Monitoring for x402 Server](https://ide.bitquery.io/Monitoring-the-latest-payment-to-the-specific-X402-server)

#### Real-Time Payment Monitoring for x402 Server on Solana

Real-time subscription to monitor payments to a specific x402 server on Solana network using WebSockets.

▶️ [Real-Time Payment Monitoring for x402 Server on Solana](https://ide.bitquery.io/Real-Time---Solana-transfers-stream)

## Cross-Chain

### Price & OHLC

#### Crypto Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all tokens across Solana, Ethereum, BNB, Tron.

▶️ [Crypto Price Stream](https://ide.bitquery.io/1-second-crypto-price-stream-with-mcap)

#### Stablecoin 1 sec Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all stablecoins including USDC, USDT, DAI, USDS etc.

▶️ [Stablecoin 1 sec Price Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)
