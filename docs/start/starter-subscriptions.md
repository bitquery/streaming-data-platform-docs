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

Provides information on the latest real-time swap events on Ethereum. You can run it.

▶️ [All swap events](https://ide.bitquery.io/all-swap-events)

#### Get pair trades data just like dexcsreener

Will subscribe to real-time trade transactions for a pair, providing a continuous stream of data as new trades are processed and recorded.

▶️ [Get pair trades data just like dexcsreener](https://ide.bitquery.io/Get-pair-trades-data-just-like-dexcsreener)

#### Get pair trades data just like geckoterminal

Will subscribe to real-time trade transactions for a pair, providing a continuous stream of data as new trades are processed and recorded.

▶️ [Get pair trades data just like geckoterminal](https://ide.bitquery.io/Get-pair-trades-data-just-like-geckoterminal)

#### Latest token trades subscription

Latest token trades subscription. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Latest token trades subscription](https://ide.bitquery.io/latest-token-trades-subscription)

#### Pepe live trades stream

Every PEPE DEX trade as it is confirmed on-chain in real time using Bitquery subscription.

▶️ [Pepe live trades stream](https://ide.bitquery.io/pepe-live-trades-stream)

#### Real time trades of an ethereum address

Real time trades of an ethereum address. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Real time trades of an ethereum address](https://ide.bitquery.io/Real-time-trades-of-an-ethereum-address)

#### Stream new position mints on Fluid DEX Vault

Track new position mints on the Fluid DEX Vault Factory contract. This query monitors the `NewPositionMinted` event which is emitted when a new position is created on the vault factory.

▶️ [Stream new position mints on Fluid DEX Vault](https://ide.bitquery.io/stream-new-position-mints-on-Fluid-DEX-Vault)

#### Subscribe to dex trades on ethereum mainnet

Will get the realtime DEX trades happening on Ethereum Mainnet. Open it in the GraphQL IDE using this.

▶️ [Subscribe to dex trades on ethereum mainnet](https://ide.bitquery.io/subscribe-to-dex-trades-on-ethereum-mainnet_2)

#### Trades of a specific trader of a specific token

Crypto Trades API: filter `Pair.Market.Network: Ethereum` and `Trader.Address`. More examples: Trades API.

▶️ [Trades of a specific trader of a specific token](https://ide.bitquery.io/trades-of-a-specific-trader-of-a-specific-token)

### Transfers

#### Token transfers

Live ERC-20 transfers. Change the token address to follow a different one.

▶️ [Token transfers](https://ide.bitquery.io/Subscribe-to-Latest-WETH-token-transfers_3)

#### Pepe whale transfer stream

Subscribe to PEPE transfers above 1 billion tokens the moment they hit the chain.

▶️ [Pepe whale transfer stream](https://ide.bitquery.io/pepe-whale-transfer-stream)

#### Subscribe to Latest WETH token transfers

This example subscribes to WETH (Wrapped Ethereum) token transfers. The contract address is 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.

▶️ [Subscribe to Latest WETH token transfers](https://ide.bitquery.io/Subscribe-to-Latest-WETH-token-transfers)

#### Subscribe to latest Axie infinity token transfers

You can open this API on our GraphQL IDE using this.

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

For a live ticker, use the Crypto Price API stream.

▶️ [1 second crypto price stream](https://ide.bitquery.io/1-second-crypto-price-stream)

#### Pepe-ohlcv-stream

Stream live PEPE price data with 1-minute candles, moving averages, and USD volume.

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

Stream all Ethereum DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data. Filter by `Pair.Market.Network: Ethereum` to capture every swap across all Ethereum DEXs in a single subscription.

▶️ [All trades on Ethereum with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Ethereum-with-Price-Marketcap-supply)

### Liquidity & Pools

#### Realtime slippage monitoring

Slippage on every trade as it happens, across all pools.

▶️ [Realtime slippage monitoring](https://ide.bitquery.io/realtime-slippage-on-ethereum)

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Ethereum. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_4)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Ethereum. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_4)

### Transactions

#### Get Transaction Hash

In this section we will discuss how we can build eth_getTransactionByHash alternatives using Bitquery APIs.

▶️ [Get Transaction Hash](https://ide.bitquery.io/Get-Transaction-Hash)

### Events & Calls

#### Stream pool and pair creation on ethereum

Stream pool and pair creation on ethereum. Uses the `Events` cube.

▶️ [Stream pool and pair creation on ethereum](https://ide.bitquery.io/stream-pool-and-pair-creation-on-ethereum_1)

#### Subscribe to the Same Event Across Multiple Contracts

In the below query we listen for a specific event (Approval) across multiple smart contracts on the Ethereum (ETH) network.

▶️ [Subscribe to the Same Event Across Multiple Contracts](https://ide.bitquery.io/Subscribe-to-the-Same-Event-Across-Multiple-Contracts)

### Mempool

#### Binance Mempool Transactions

Mempool Transactions API provides real-time data from the Binance mempool. You can use it to build applications that require up-to-date information about transactions associated with a specific address.

▶️ [Binance Mempool Transactions](https://ide.bitquery.io/Binance-Mempool-Transactions_1)

#### Eth subscribe("logs")

You can subscribe to all incoming logs filtered by any of the fields including method signature, tx value,sender , receiver and so on. In the below example we are tracking only logs where the method name is `transfer`. You can run it.

▶️ [Eth subscribe("logs")](https://ide.bitquery.io/eth_subscribelogs)

#### Eth subscribe(“pendingTransactions”)

To subscribe to incoming pending transactions, use the below subscription. You can run it.

▶️ [Eth subscribe(“pendingTransactions”)](https://ide.bitquery.io/eth_subscribependingTransactions)

#### Current mempool fees

Gas prices being offered by pending transactions right now.

▶️ [Current mempool fees](https://ide.bitquery.io/Get-Mempool-Fees)

#### Mempool event stream

This query listens to real-time mempool events on the Ethereum (ETH) blockchain. The query is designed to capture details of transactions, logs, events, and arguments from the Ethereum Virtual Machine (EVM) before they are confirmed in a block.

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

The following subscription query retrieves real-time mempool transactions and includes key details such as the block time, block number, transaction hash, transaction cost, and the V, R, S components of the transaction signature. You can run it.

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

Track balance changes for specific MEV bots or block builders.

▶️ [Filter by MEV Bot or Builder Address](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address)

#### Filter by Miner Address

Track balance changes for a specific miner address.

▶️ [Filter by Miner Address](https://ide.bitquery.io/Filter-by-Miner-Address)

#### Filter by Validator Address

Track balance changes for a specific validator address.

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

If looking to monitor a currency pair across all virtual pools within Uniswap V4, then this subscription works the best.

▶️ [Currency pair liquidity events stream](https://ide.bitquery.io/currency-pair-liquidity-events-stream)

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Ethereum. Here we have taken example of Uniswap V4.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_6)

#### Latest pools created Uniswap v3

Open this query on our GraphQL IDE using this.

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

Get all trades of Bags FM tokens from Meteora and other DEXs. This Bags FM token trades WebSocket provides comprehensive trading data.

▶️ [All Trade for Bags.fm tokens](https://ide.bitquery.io/All-Trade-for-Bagsfm-tokens)

#### CPMM trades

In this section we will see how to get data on Raydium CPMM trades in real-time. You can check out our Pump Fun docs, Raydium v4 docs and Raydium LaunchPad docs too.

▶️ [CPMM trades](https://ide.bitquery.io/CPMM-trades)

#### Get Solana pair trades data

Will subscribe to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.

▶️ [Get Solana pair trades data](https://ide.bitquery.io/Get-Solana-pair-trades-data)

#### Get Solana pair trades data just like dexcsreener

Will subscribe to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.

▶️ [Get Solana pair trades data just like dexcsreener](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-dexcsreener)

#### Get Solana pair trades data just like geckoTerminal

Will subscribe to real-time trade transactions for a Solana pair, providing a continuous stream of data as new trades are processed and recorded.

▶️ [Get Solana pair trades data just like geckoTerminal](https://ide.bitquery.io/Get-Solana-pair-trades-data-just-like-geckoTerminal_1)

#### Latest Trades of TESLA onchain xStock

Below query will give you realtime trades of Tesla xStock (TESLAx).

▶️ [Latest Trades of TESLA onchain xStock](https://ide.bitquery.io/Latest-Trades-of-TESLA-onchain-xStock_1)

### Transfers

#### Token Transfers Stream

This stream provides all token transfers on the Solana blockchain, including SOL transfers.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Solana-transfers-stream_3)

#### SPL transfers websocket

One of the most common types of transfers on Solana are SPL token transfers. Let's see an example to get the latest SPL token transfers using our API. Today we are taking an example of JUPITER token transfers.

▶️ [SPL transfers websocket](https://ide.bitquery.io/SPL-transfers-websocket_1)

#### Solana Websocket - Subscribe to all transfers of specific addresses in realtime

Websockets are priced based on their running time, not the amount of data delivered.

▶️ [Solana Websocket - Subscribe to all transfers of specific addresses in realtime](https://ide.bitquery.io/Solana-Websocket---Subscribe-to-all-transfers-of-specific-addresses-in-realtime)

#### Subscribe to the all transfers on Solana

For monitoring the balance changes that result from these transfers, see our Solana Balance Updates API.

▶️ [Subscribe to the all transfers on Solana](https://ide.bitquery.io/Subscribe-to-the-all-transfers-on-Solana)

#### Transfers of All Tip Payment Accounts on Solana

Jito foundation has Tip Payment Program that allows users to transfer tips to a set of static public keys (compared to signing the transaction with the next N leaders) and ensure that the incentives are distributed to the correct block leader, while enabling…

▶️ [Transfers of All Tip Payment Accounts on Solana](https://ide.bitquery.io/Transfers-of-All-Tip-Payment-Accounts-on-Solana)

#### Transfers of Tip Payment Accounts on Solana

The subscription that provides you the transfer data of one of these addresses is.

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

Lock onto one token with `Pair.Token.Id` (e.g. `bid:solana:<mint>`) and the Byreal program address.

▶️ [Byreal token live prices using trades api](https://ide.bitquery.io/Byreal-token-live-prices-using-trades-api)

#### Get Latest Price of SOL in USD Real-time

Get Latest Price of SOL in USD Real-time. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Latest Price of SOL in USD Real-time](https://ide.bitquery.io/Get-Latest-Price-of-SOL-in--USD-Real-time)

#### Get realtime Price of Apple xStock in USD Real-time

You can use the following query to get the latest price of a Apple xStock on Solana.

▶️ [Get realtime Price of Apple xStock in USD Real-time](https://ide.bitquery.io/Get-realtime-Price-of-Apple-xStock-in--USD-Real-time)

#### GoonFi Realtime OHLC, Price, Volume API - Crypto Price API

Below API will give you realtime prices, OHLC, and volume data for all GoonFi trading pairs. We have selected `1` sec as the interval for the OHLC, volume or moving average calculation.

▶️ [GoonFi Realtime OHLC, Price, Volume API - Crypto Price API](https://ide.bitquery.io/GoonFi-Realtime-OHLC-Price-Volume-API---Crypto-Price-API_1)

#### Latest price for more than 1 markets on solana

You can retrieve data from multiple Solana DEX markets using our APIs or streams. The.

▶️ [Latest price for more than 1 markets on solana](https://ide.bitquery.io/latest-price-for-more-than-1-markets-on-solana_1)

#### Latest price for more than 1 markets on solana for specific currencies

Latest price for more than 1 markets on solana for specific currencies. Uses the `DEXTrades` cube.

▶️ [Latest price for more than 1 markets on solana for specific currencies](https://ide.bitquery.io/latest-price-for-more-than-1-markets-on-solana-for-specific-currencies)

#### Price of a moonshot token

The below query gets real-time price of the specified Token `A1XqfcD1vMEhUNwEKvBVRWFV48ZLDL4oheFVCPEcM3Vk` on the Moonit DEX.

▶️ [Price of a moonshot token](https://ide.bitquery.io/Price-of-a-Moonshot-token)

### Supply & Market Cap

#### Solana tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches Solana and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [Solana tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-solana-tokens-with-marketcap-above-1-million)

#### All trades on Solana with Price, Marketcap, supply

Stream all Solana DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data.

▶️ [All trades on Solana with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Solana-with-Price-Marketcap-supply)

#### Bags.fm token creation stream using Solana token supply updates

Track Bags FM token creation using the Solana TokenSupply API. This endpoint provides Bags FM token data including supply information and creation timestamps. For the same API as a WebSocket stream.

▶️ [Bags.fm token creation stream using Solana token supply updates](https://ide.bitquery.io/Bagsfm-token-creation-stream-using-Solana-token-supply-updates)

#### Get All DEX Trades on DBC With Price, Market Cap, and Supply

Stream all Meteora DBC DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data. Filter by `Pair.Market.Protocol: dynamic_bonding_curve` to capture every swap across Meteora DBC in a single subscription.

▶️ [Get All DEX Trades on DBC With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-DBC-With-Price-Market-Cap-and-Supply)

#### Get newly created Moonshot tokens with metadata

Now you can track the newly created Moonit Tokens along with their metadata and supply. `PostBalance` will give you the current supply for the token.

▶️ [Get newly created Moonshot tokens with metadata](https://ide.bitquery.io/Get-newly-created-Moonshot-tokens-with-metadata)

#### Newly created PF token, dev address, metadata

Now you can track the newly created Pump Fun Tokens along with their dev address, metadata and supply. `PostBalance` will give you the current supply for the token.

▶️ [Newly created PF token, dev address, metadata](https://ide.bitquery.io/newly-created-PF-token-dev-address-metadata)

#### Realtime heaven tokens with marketcap 10k

Subscribe when the token is on Solana, `Market.Protocol` is `Heaven`, `Supply.MarketCap` &gt; 10,000 (USD), and interval duration &gt; 1 second. Adjust `gt` to change the threshold.

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

You can use the below query to get the tokens which are getting traded and have liquidity over 1 million USD.

▶️ [Search tokens with liquidity over 1 million](https://ide.bitquery.io/Search-tokens-with-liquidity-over-1-million)

#### Trends fun tokens between 95 and 100 bonding curve progress

Track Trends.fun tokens that are approaching graduation with high bonding curve progress percentages. Run the query.

▶️ [Trends fun tokens between 95 and 100 bonding curve progress](https://ide.bitquery.io/trends-fun-tokens-between-95-and-100-bonding-curve-progress)

### Transactions

#### Realtime Solana Transactions

The subscription query below fetches the most recent transactions on the Solana blockchain.

▶️ [Realtime Solana Transactions](https://ide.bitquery.io/Realtime-Solana-Transactions)

### Events & Calls

#### ConsumeEvents instruction on OpenBook V2

We will use this subscription to listen to `consumeEvents` transactions on OpenBook v2. This instruction processes trade events and other activities such as order cancellations.

▶️ [ConsumeEvents instruction on OpenBook V2](https://ide.bitquery.io/consumeEvents-instruction-on-OpenBook-V2_3)

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

Stream all PumpFun DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data. Filter by `Pair.Market.ProtocolFamily: Pumpfun` to capture every swap across Pumpfun in a single subscription.

▶️ [Get All DEX Trades on Pumpfun With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-Pumpfun-With-Price-Market-Cap-and-Supply)

#### Latest Trades for a token on Pumpswap

Subscribe to `DEXTradeByTokens` with PumpSwap `ProgramAddress` and the token mint. Each update is a new trade involving that token on PumpSwap—use this to stream per-token activity without polling.

▶️ [Latest Trades for a token on Pumpswap](https://ide.bitquery.io/Latest-Trades-for-a-token-on-Pumpswap)

#### Price of a pump fun token using price index in usd

Live stream of token price updates on Pump.fun.

▶️ [Price of a pump fun token using price index in usd](https://ide.bitquery.io/Price-of-a-pump-fun-token-using-price-index-in-usd)

### Meteora

#### Jup studio token migrations from Meteora DBC to Meteors DEX

We monitor Meteora DBC program address `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` for migration instructions including `migrate_meteora_damm` and `migration_damm_v2`.

▶️ [Jup studio token migrations from Meteora DBC to Meteors DEX](https://ide.bitquery.io/jup-studio-token-migrations-from-Meteora-DBC-to-Meteors-DEX_1)

#### Liquidity addition for meteora

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Meteora DEX, which has `Meteora` as the Protocol Family.

▶️ [Liquidity addition for meteora](https://ide.bitquery.io/liquidity-addition-for-meteora_1)

#### Liquidity removal for meteora

Liquidity removal for meteora. Uses the `DEXPools` cube.

▶️ [Liquidity removal for meteora](https://ide.bitquery.io/liquidity-removal-for-meteora_1)

#### Meteora DBC token migrations to Meteors DEX

Below query will give you the latest migrated tokens Meteora DBC in realtime.

▶️ [Meteora DBC token migrations to Meteors DEX](https://ide.bitquery.io/meteora-DBC-token-migrations-to-Meteors-DEX)

#### Real time trades on Meteora Dynamic Bonding Curve on Solana

The below query gets real-time information whenever there's a new trade on the Meteora DBC including detailed information about the trade, including the buy and sell details, the block information, and the transaction specifics.

▶️ [Real time trades on Meteora Dynamic Bonding Curve on Solana](https://ide.bitquery.io/Real-time-trades-on-Meteora-Dynamic-Bonding-Curve-on-Solana)

#### Real time trades on MeteoraDAMMv2 DEX on Solana

This query subscribes to real-time trades on the Meteora DAMM v2 (Dynamic Automated Market Maker) on the Solana blockchain by filtering using the program address `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG`.

▶️ [Real time trades on MeteoraDAMMv2 DEX on Solana](https://ide.bitquery.io/Real-time-trades-on-MeteoraDAMMv2-DEX-on-Solana)

### Orca

#### Latest pool created on Orca - Websocket

For instance, Index 1 and 2 represent the tokens involved in the pool, while Index 4 is for the pool's address. Note that the indexing starts from 0.

▶️ [Latest pool created on Orca - Websocket](https://ide.bitquery.io/Latest-pool-created-on-Orca---Websocket_1)

#### Liquidity addition for orca whirlpool

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Orca Whirlpool DEX, which has `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` as the Program Address.

▶️ [Liquidity addition for orca whirlpool](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool_1)

#### Liquidity removal for orca whirlpool

With Orca’s program and negative base change, stream liquidity removals from Whirlpool markets.

▶️ [Liquidity removal for orca whirlpool](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool_1)

#### Orca DEX Trades Websocket

To access a real-time stream of trades for Solana Orca DEX.

▶️ [Orca DEX Trades Websocket](https://ide.bitquery.io/Orca-DEX-Trades-Websocket)

#### Orca DEX Trades for a specific currency Websocket

By setting the limit to 1, you will receive the most recent trade, which reflects the latest price of the token.

▶️ [Orca DEX Trades for a specific currency Websocket](https://ide.bitquery.io/Orca-DEX-Trades-for-a-specific-currency-Websocket)

#### Price of a token on Orca

You can use the following query to get the latest price of a token, we have used WSOL address here in the below example. We are getting realtime price of WSOL on Orca DEX on Solana in different pools.

▶️ [Price of a token on Orca](https://ide.bitquery.io/Price-of-a-token-on-Orca)

### Jupiter

#### Latest Cancel Expired Order Transactions on Jupiter in realtime

We track Jupiter's Limit Order program address `jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu` for `cancelExpiredOrder` instructions. The query returns transaction signatures, account details, and program arguments for expired order cancellations.

▶️ [Latest Cancel Expired Order Transactions on Jupiter in realtime](https://ide.bitquery.io/Latest-Cancel-Expired-Order-Transactions-on-Jupiter-in-realtime_1)

#### Latest Cancel Limit Order Transactions on Jupiter in realtime

We track Jupiter's Limit Order program address `jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu` for `cancelOrder` instructions. The query returns input mint addresses, maker addresses, reserve addresses, and cancellation details.

▶️ [Latest Cancel Limit Order Transactions on Jupiter in realtime](https://ide.bitquery.io/Latest-Cancel-Limit-Order-Transactions-on-Jupiter-in-realtime)

#### Tokens involved in Jupiter swap, source address, destination address, DEX involved

We monitor Jupiter's program address `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4` for `sharedAccountsRoute` instructions to track swap activity. The query returns tokens involved in swaps, source and destination addresses, and routing information.

▶️ [Tokens involved in Jupiter swap, source address, destination address, DEX involved](https://ide.bitquery.io/Tokens-involved-in-Jupiter-swap-source-address-destination-address-DEX-involved_2)

## BSC

### Trades

#### Real-time Trades on BSC

This subscription returns the real-time trades happening on BSC Network. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Real-time Trades on BSC](https://ide.bitquery.io/subscribe-to-dex-trades-on-BNB-mainnet)

#### All BNB Trade Stream

Crypto Trades API: one row per swap, with USD and supply. Filter `Pair.Market.Network: Binance Smart Chain`. When to use this vs chain DEX APIs.

▶️ [All BNB Trade Stream](https://ide.bitquery.io/All-BNB-Trade-Stream)

#### Subscribe to bsc dex trades

This example uses the chain-specific DEXTrades cube via `EVM(network: bsc) { DEXTrades }` (pool-side Buy/Sell; see DEXTrades cube). USD fields can be empty on thin pools. For swap rows with trader + USD, use the stream at the top of this page.

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

Provides real-time updates on price of ETH `0x2170Ed0880ac9A755fd29B2688956BD959F933F8` in terms of WBNB `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`, including details about the DEX, market, and order specifics.

▶️ [Realtime price of a ETH in terms of WBNB](https://ide.bitquery.io/realtime-price-of-a-ETH-in-terms-of-WBNB)

#### Stream for latest prices for Flap.sh tokens

Subscribe to real-time price updates for all Flap.sh tokens.

▶️ [Stream for latest prices for Flap.sh tokens](https://ide.bitquery.io/Stream-for-latest-prices-for-Flapsh-tokens)

### Supply & Market Cap

#### BSC tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches BSC and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [BSC tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-bsc-tokens-with-marketcap-above-1-million_1)

#### All trades on BSC with Price, Marketcap, supply

Stream all BSC DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data. Filter by `Pair.Market.Network: Binance Smart Chain` to capture every swap across all BSC DEXs in a single subscription.

▶️ [All trades on BSC with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-BSC-with-Price-Marketcap-supply)

#### Bsc token marketcap stream

Subscribe to `Tokens` where currency id includes `bsc`, with interval duration greater than 1 (second).

▶️ [Bsc token marketcap stream](https://ide.bitquery.io/bsc-token-marketcap-stream)

### Liquidity & Pools

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on BSC. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_1)

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on BSC. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-bsc)

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on BSC. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_2)

### Events & Calls

#### Newly Created Tokens on BSC network

This subscription websocket lets you track the newly created tokens on BSC network. You will find the newly created token contract address in the response under `Receipt: ContractAddress` field.

▶️ [Newly Created Tokens on BSC network](https://ide.bitquery.io/Newly-Created-Tokens-on-BSC-network_2)

### Mempool

#### Bsc mempool txs

Use a GraphQL `subscription` on the Bitquery streaming WebSocket `wss://streaming.bitquery.io/graphql` with root `EVM(network: bsc, mempool: true)`.

▶️ [Bsc mempool txs](https://ide.bitquery.io/bsc-mempool-txs)

#### Monitor mempool trades bsc

Stream all DEX trades happening in the BSC mempool in real-time. Monitor buy/sell activity, prices, volumes, and trading pairs across all DEXs before transactions are confirmed.

▶️ [Monitor mempool trades bsc](https://ide.bitquery.io/monitor-mempool-trades-bsc)

### Blocks & Validators

#### Real-time Validator Rewards for BSC

This stream provides the info on rewards received by validators on BSC in real time.

▶️ [Real-time Validator Rewards for BSC](https://ide.bitquery.io/Track-Validator-Balance-Updates-bsc_1)

#### Track MEV Balance in Real Time for BSC

This stream monitors MEV activities and Balance Updates on BSC in real time.

▶️ [Track MEV Balance in Real Time for BSC](https://ide.bitquery.io/Track-MEV-Related-Balance-Updates-bsc)

#### All Self-Destruct Event Balances Stream bsc

Monitor all contract self-destruct event balances in real-time using this GraphQL subscription.

▶️ [All Self-Destruct Event Balances Stream bsc](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-bsc)

#### Filter by MEV Bot or Builder Address bsc

Track balance changes for specific MEV bots or block builders.

▶️ [Filter by MEV Bot or Builder Address bsc](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-bsc)

#### Filter by Miner Address bsc

Track balance changes for a specific miner address.

▶️ [Filter by Miner Address bsc](https://ide.bitquery.io/Filter-by-Miner-Address-bsc)

#### Filter by Validator Address bsc

Track balance changes for a specific validator address.

▶️ [Filter by Validator Address bsc](https://ide.bitquery.io/Filter-by-Validator-Address-bsc_1)

#### Track Block Mining Rewards bsc

Track rewards received by miners for successfully mining blocks.

▶️ [Track Block Mining Rewards bsc](https://ide.bitquery.io/Track-Block-Mining-Rewards-bsc)

#### Track Ephemeral MEV Contract Balance Changes bsc

Monitor balance changes for short-lived contracts that are created and destroyed in the same transaction (typical pattern for MEV bots) using this subscription.

▶️ [Track Ephemeral MEV Contract Balance Changes bsc](https://ide.bitquery.io/Track-Ephemeral-MEV-Contract-Balance-Changes-bsc)

#### Track Large MEV Transactions bsc

Monitor large transaction fee rewards that may indicate significant MEV extraction.

▶️ [Track Large MEV Transactions bsc](https://ide.bitquery.io/Track-Large-MEV-Transactions-bsc)

#### Track Large Self-Destruct Transaction Balances bsc

Monitor significant self-destruct balance changes (e.g., > $1000 USD) using this subscription.

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

Monitor tokens that are about to complete their bonding curve (near graduation) in the mempool.

▶️ [Four Meme bonding curve completion mempool](https://ide.bitquery.io/Four-Meme-bonding-curve-completion-mempool)

#### Four Meme large buys mempool

Monitor large buy orders in the mempool to detect whale activity and potential price pumps.

▶️ [Four Meme large buys mempool](https://ide.bitquery.io/Four-Meme-large-buys-mempool)

### PancakeSwap

#### Real-time Mempool Trades on Pancakeswap

Get real time unconfirmed trades on Pancakeswap, using the given stream.

▶️ [Real-time Mempool Trades on Pancakeswap](https://ide.bitquery.io/Mempool---Latest-BSC-PancakeSwap-v3-dextrades---Stream)

#### Track Four Meme Token migrations to PancakeSwap

This query tracks four meme token migrations to Pancakeswap in realtime by monitoring transactions sent to the Four Meme factory address and filtering for `PairCreated` and `PoolCreated` events. These events are emitted when a token graduates from Four Meme and migrates to Pancakeswap.

▶️ [Track Four Meme Token migrations to PancakeSwap](https://ide.bitquery.io/four-meme-migration-to-pancakeswap)

#### Binance meme rush migration to pancakeswap

Tracks Binance Meme Rush token migrations to Pancakeswap in realtime by monitoring transactions sent to the Four Meme factory address (`0x5c952063c7fc8610ffdb798152d69f0b9550762b`) and filtering for `PairCreated` and `PoolCreated` events.

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

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on BSC. Here we have taken example of Uniswap V4.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4)

#### Newly Created Pools on Uniswap v3 on BSC network

This subscription websocket lets you track the newly created pools on Uniswap V3 `0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7`.

▶️ [Newly Created Pools on Uniswap v3 on BSC network](https://ide.bitquery.io/Newly-Created-Pools-on-Uniswap-v3-on-BSC-network_3)

#### Real time trades for uniswap v4 bsc

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on BSC.

▶️ [Real time trades for uniswap v4 bsc](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-bsc)

#### Uniswap v4 pool liquidity bsc

Stream live liquidity for all Uniswap v4 pools on BSC.

▶️ [Uniswap v4 pool liquidity bsc](https://ide.bitquery.io/uniswap-v4-pool-liquidity-bsc)

#### Uniswap v4 pool liquidity by poolid bsc

Liquidity for v4 pools is reconstructed by stepping through each price range where liquidity is concentrated , so `AmountCurrencyA` / `AmountCurrencyB` reflect the actual PoolManager balances for that `PoolId`.

▶️ [Uniswap v4 pool liquidity by poolid bsc](https://ide.bitquery.io/uniswap-v4-pool-liquidity-by-poolid-bsc)

## Base

### Trades

#### Base DEX Trades Stream

This stream returns all the real time DEX trades happening on Base. You can modify this stream to get DEX trades on a particular DEX or trades of a particular token or trades by a particular trader.

▶️ [Base DEX Trades Stream](https://ide.bitquery.io/subscribe-to-dex-trades-on-base_1)

#### All Base Trade Stream

Crypto Trades API: one row per swap, with USD and supply. Filter `Pair.Market.Network: Base`. When to use this vs chain DEX APIs.

▶️ [All Base Trade Stream](https://ide.bitquery.io/All-Base-Trade-Stream)

#### Subscribe to dex trades on base

Read DEXTrades vs DEXTradeByTokens vs Trades cube to get a better understanding on when to use which cube.

▶️ [Subscribe to dex trades on base](https://ide.bitquery.io/subscribe-to-dex-trades-on-base)

#### Subscription for Latest Trades for AERO

For this part, we have chosen AERO token as the token is currently trending and have high trade volume.

▶️ [Subscription for Latest Trades for AERO](https://ide.bitquery.io/Subscription-for-Latest-Trades-for-AERO_1)

### Transfers

#### Token Transfers Stream

This stream lets you monitor all the token transfers for a particular token. You can modify this subscription to track and monitor token transfers for a particular token from or to a particular address.

▶️ [Token Transfers Stream](https://ide.bitquery.io/Subscribe-to-Latest-USDC-token-transfers)

#### Newly created zora tokens stream

You can also stream the latest tokens created in real-time using.

▶️ [Newly created zora tokens stream](https://ide.bitquery.io/Newly-created-zora-tokens-stream)

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address_3)

#### Whale transfers of USDC on base

The subscription query below fetches the whale transactions on the Base network. We have used USDC address `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`.

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

Provides real-time balance updates for all addresses involved in transactions on the Base network.

▶️ [Subscribe to All Transaction Balances base](https://ide.bitquery.io/Subscribe-to-All-Transaction-Balances-base)

#### Subscribe to Transaction Balances for a Specific Address base

This subscription filters transaction balances for a specific address.

▶️ [Subscribe to Transaction Balances for a Specific Address base](https://ide.bitquery.io/Subscribe-to-Transaction-Balances-for-a-Specific-Address-base)

#### Track Block Builder Rewards base

Monitor transaction fee rewards received by block builders (MEV extractors)

▶️ [Track Block Builder Rewards base](https://ide.bitquery.io/Track-Block-Builder-Rewards-base)

#### Track Transaction Fee Rewards base

Monitor transaction fee rewards received by miners.

▶️ [Track Transaction Fee Rewards base](https://ide.bitquery.io/Track-Transaction-Fee-Rewards-base)

### Price & OHLC

#### Real-time 1 second OHLC

This stream provides real time price and OHLC stream for all tokens on Base based on trades.

▶️ [Real-time 1 second OHLC](https://ide.bitquery.io/1-second-OHLC-k-line-Base)

#### Token Price Stream

This stream returns the real time trade price of a token against the token it is traded with and the price in USD. You could modify the stream to get the price of the token for a particular token pair or against a particular token.

▶️ [Token Price Stream](https://ide.bitquery.io/token-price-stream_2)

#### Aerodrome dex - realtime prices, 1-sec ohlc, trading volumes

Below API gives you instant access to live Aerodrome market data with pre-calculated OHLC, moving averages, and trading volumes updating every second—no complex calculations needed, just plug and play for your trading bots or analytics platform.

▶️ [Aerodrome dex - realtime prices, 1-sec ohlc, trading volumes](https://ide.bitquery.io/aerodrome-dex---realtime-prices-1-sec-ohlc-trading-volumes)

#### Get latest price of DAI in USD on Base

Retrieves the USD price of a token on Base chain by setting `SmartContract: {is: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"}` . Check the field `PriceInUSD` for the USD value. You can access the query.

▶️ [Get latest price of DAI in USD on Base](https://ide.bitquery.io/Get-latest-price-of-DAI-in-USD-on-Base)

#### Price of USDC in terms of DAI on Base network

Provides real-time updates on price of USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` in terms of DAI `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`, including details about the DEX, market, and order specifics.

▶️ [Price of USDC in terms of DAI on Base network](https://ide.bitquery.io/Price-of-USDC-in-terms-of-DAI-on-Base-network)

### Supply & Market Cap

#### Base token market cap stream (Trading API)

Subscribe to **`Tokens`** rows for assets whose currency id includes **`base`** (interval duration &gt; 1s).

▶️ [Base token market cap stream (Trading API)](https://ide.bitquery.io/base-token-marketcap-stream)

#### Base tokens with market cap above $1 million (Trading API)

Subscribe when **`Token.Id`** matches Base and **`Supply.MarketCap`** &gt; 1,000,000 USD.

▶️ [Base tokens with market cap above $1 million (Trading API)](https://ide.bitquery.io/realtime-stream-base-tokens-with-marketcap-above-1-million)

#### All trades on Base with Price, Marketcap, supply

Stream all Base DEX trades in real time with USD price, market cap, FDV, circulating supply, and transaction fee data. Filter by `Pair.Market.Network: Base` to capture every swap across all Base DEXs in a single subscription.

▶️ [All trades on Base with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Base-with-Price-Marketcap-supply)

#### Bankr token realtime marketcap OHLC stream

Subscribe to live 1-second OHLC + market cap updates for a specific Bankr token.

▶️ [Bankr token realtime marketcap OHLC stream](https://ide.bitquery.io/Bankr-token-realtime-marketcap-OHLC-stream)

#### Base tokens above 100k marketcap stream

Stream every Base token currently above $100k FDV. Useful as a high-mcap or "graduated by mcap" alert.

▶️ [Base tokens above 100k marketcap stream](https://ide.bitquery.io/Base-tokens-above-100k-marketcap-stream)

### Liquidity & Pools

#### Realtime Slippage Monitoring

This subscription query returns real-time slippage data for all DEX pools on Base. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime Slippage Monitoring](https://ide.bitquery.io/realtime-slippage-on-base)

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Base. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_3)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Base. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_3)

### Events & Calls

#### Realtime stream Bankr launches Base

Convert the above query into a subscription to be notified of every new token the moment it lands on Base.

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

Monitor all contract self-destruct event balances in real-time using this GraphQL subscription.

▶️ [All Self Destruct Event Balances Stream base](https://ide.bitquery.io/All-Self-Destruct-Event-Balances-Stream-base)

#### Filter by MEV Bot or Builder Address base

Track balance changes for specific MEV bots or block builders.

▶️ [Filter by MEV Bot or Builder Address base](https://ide.bitquery.io/Filter-by-MEV-Bot-or-Builder-Address-base)

#### Filter by Miner Address base

Track balance changes for a specific miner address.

▶️ [Filter by Miner Address base](https://ide.bitquery.io/Filter-by-Miner-Address-base)

#### Track Block Mining Rewards base

Track rewards received by miners for successfully mining blocks.

▶️ [Track Block Mining Rewards base](https://ide.bitquery.io/Track-Block-Mining-Rewards-base)

### Uniswap

#### Pair Creation on Uniswap

This stream returns the real time liquidity pools/token pairs created on Uniswap V3. You could modify the stream to monitor newly created pools on a different protocol.

▶️ [Pair Creation on Uniswap](https://ide.bitquery.io/Latest-pools-created-Uniswap-v3-Base)

#### Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

1-second OHLC and volume stream for tokens traded on Uniswap v3 (Base). Great for bot trading strategies.

▶️ [Uniswap v3 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Uniswap-v3-DEX-tokens-1-second-price-stream-with-OHLC_1)

#### Bankr token V4 swaps realtime

Bankr trades clear on the Uniswap V4 singleton. Use the Crypto Trades API (`Trading.Trades`) to stream swap-level rows with USD price, market cap, supply, trader, and V4 pool id.

▶️ [Bankr token V4 swaps realtime](https://ide.bitquery.io/Bankr-token-V4-swaps-realtime)

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Base. Here we have taken example of Uniswap V4.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_5)

#### Real time trades on uniswap v4 base

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on Base.

▶️ [Real time trades on uniswap v4 base](https://ide.bitquery.io/Real-time-trades-on-uniswap-v4-base)

#### Uniswap v4 pool liquidity base

Stream live liquidity for all Uniswap v4 pools on Base.

▶️ [Uniswap v4 pool liquidity base](https://ide.bitquery.io/uniswap-v4-pool-liquidity-base)

## Arbitrum

### Trades

#### Arbitrum Dextrades subscription

This example uses the chain-specific DEXTrades cube via `EVM(network: arbitrum) { DEXTrades }` (pool-side Buy/Sell; see DEXTrades cube). USD can be weak on thin pools. For trader + USD swap rows, use the stream at the top.

▶️ [Arbitrum Dextrades subscription](https://ide.bitquery.io/Arbitrum-Dextrades-subscription)

### Supply & Market Cap

#### Arbitrum token marketcap stream

Subscribe to `Tokens` where currency id includes `arbitrum`, with interval duration greater than 1 (second). You get token fields, block time, supply (MarketCap, FullyDilutedValuationUsd), price (OHLC and mean), and volume.

▶️ [Arbitrum token marketcap stream](https://ide.bitquery.io/arbitrum-token-marketcap-stream)

#### Realtime stream arbitrum tokens with marketcap above 1 million

Subscribe when `Token.Id` matches Arbitrum (`arbitrum`) and `Supply.MarketCap` > 1,000,000 (USD).

▶️ [Realtime stream arbitrum tokens with marketcap above 1 million](https://ide.bitquery.io/realtime-stream-arbitrum-tokens-with-marketcap-above-1-million)

### Liquidity & Pools

#### Realtime liquidity stream

This subscription query returns real-time liquidity data for all DEX pools on Arbitrum. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime liquidity stream](https://ide.bitquery.io/realtime-liquidity-stream_1)

#### Realtime liquidity stream of a specific pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Arbitrum. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime liquidity stream of a specific pool](https://ide.bitquery.io/realtime-liquidity-stream-of-a-specific-pool)

#### Realtime slippage on arbitrum

This subscription query returns real-time slippage data for all DEX pools on Arbitrum. You can monitor price impact and liquidity depth as trades occur.

▶️ [Realtime slippage on arbitrum](https://ide.bitquery.io/realtime-slippage-on-arbitrum)

### Transactions

#### Arbitrum: Timeboost Auction Transactions in Realtime

Use the following subscription in the Bitquery IDE to watch every TimeBoost auction interaction. The query filters on the auction contract address and surfaces both transaction context and decoded ABI arguments.

▶️ [Arbitrum: Timeboost Auction Transactions in Realtime](https://ide.bitquery.io/Arbitrum-Timeboost-Auction-Transactions-in-Realtime)

### Uniswap

#### Latest liquidity changes in uniswap v4 pools

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Arbitrum. Here we have taken example of Uniswap V4.

▶️ [Latest liquidity changes in uniswap v4 pools](https://ide.bitquery.io/latest-liquidity-changes-in-uniswap-v4-pools)

#### Real time trades for uniswap v4 arbitrum

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on Arbitrum.

▶️ [Real time trades for uniswap v4 arbitrum](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-arbitrum)

## Optimism

### Trades

#### Real time trades for uniswap v4 optimism

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on Optimism.

▶️ [Real time trades for uniswap v4 optimism](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-optimism)

#### Realtime optimism dex trades websocket

This example uses the chain-specific DEXTrades cube via `EVM(network: optimism) { DEXTrades }` (pool-side Buy/Sell; see DEXTrades cube). USD can be weak on thin pools. For trader + USD swap rows, use the stream at the top.

▶️ [Realtime optimism dex trades websocket](https://ide.bitquery.io/Realtime-optimism-dex-trades-websocket)

### Transfers

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address)

#### Whale transfers of USDT on optimism

The subscription query below fetches the whale transactions on the Optimism network. We have used USDT address `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`

▶️ [Whale transfers of USDT on optimism](https://ide.bitquery.io/Whale-transfers-of-USDT-on-optimism)

### Price & OHLC

#### Get latest price of WBTC in USD on optimism

Retrieves the USD price of a token on Optimism by setting `SmartContract: {is: "0x68f180fcCe6836688e9084f035309E29Bf0A2095"}` . Check the field `PriceInUSD` for the USD value. You can access the query.

▶️ [Get latest price of WBTC in USD on optimism](https://ide.bitquery.io/Get-latest-price-of-WBTC-in-USD-on-optimism)

#### Price of WETH in terms of USDC on Optimism

Provides real-time updates on price of WETH `0x4200000000000000000000000000000000000006` in terms of USD Coin `0x7f5c764cbc14f9669b88837ca1490cca17c31607`, including details about the DEX, market, and order specifics.

▶️ [Price of WETH in terms of USDC on Optimism](https://ide.bitquery.io/Price-of-WETH-in-terms-of-USDC-on-Optimism)

## Polygon

### Trades

#### Real time trades for uniswap v4 matic

The Uniswap v4 PoolManager contract emits all pool-related events, including pool initialization, swaps, and liquidity modifications, and serves as the single on-chain source of truth for Uniswap v4 activity on Matic.

▶️ [Real time trades for uniswap v4 matic](https://ide.bitquery.io/Real-time-trades-for-uniswap-v4-matic)

#### Realtime matic dex trades websocket

Read DEXTrades vs DEXTradeByTokens vs Trades cube to understand when to use which cube.

▶️ [Realtime matic dex trades websocket](https://ide.bitquery.io/Realtime-matic-dex-trades-websocket)

### Transfers

#### Sender is a particular address

Sender is a particular address. Uses the `Transfers` cube.

▶️ [Sender is a particular address](https://ide.bitquery.io/Sender-is-a-particular-address_2)

#### Whale transfers of USDC on matic

The subscription query below fetches the whale transactions on the MATIC network. We have used USDC address `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`.

▶️ [Whale transfers of USDC on matic](https://ide.bitquery.io/Whale-transfers-of-USDC-on-matic)

### Supply & Market Cap

#### All trades on Polygon with Price, Marketcap, supply

Crypto Trades API: one row per swap, with USD and supply. For Polygon use `Pair.Market.Network: Matic`. When to use this vs chain DEX APIs.

▶️ [All trades on Polygon with Price, Marketcap, supply](https://ide.bitquery.io/All-trades-on-Polygon-with-Price-Marketcap-supply)

#### Matic token marketcap stream

Subscribe to `Tokens` where currency id includes `matic`, with interval duration greater than 1 (second).

▶️ [Matic token marketcap stream](https://ide.bitquery.io/matic-token-marketcap-stream)

### Liquidity & Pools

#### Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4

This subscription query monitors real-time liquidity changes for all pools in a specific DEX protocol on Matic. Here we have taken example of Uniswap V4.

▶️ [Latest Liquidity Changes of Pools in a Specific DEX Protocol - Uniswap V4](https://ide.bitquery.io/Latest-Liquidity-Changes-of-Pools-in-a-Specific-DEX-Protocol---Uniswap-V4_7)

#### Realtime Liquidity Stream

This subscription query returns real-time liquidity data for all DEX pools on Matic. You can monitor liquidity changes, pool reserves, and spot prices as trades and liquidity modifications occur across all pools.

▶️ [Realtime Liquidity Stream](https://ide.bitquery.io/Realtime-Liquidity-Stream_5)

#### Realtime Liquidity Stream of a Specific Pool

This subscription query monitors real-time liquidity changes for a specific DEX pool on Matic. Use this to track liquidity events, pool reserves, and spot prices for a particular pool as they occur.

▶️ [Realtime Liquidity Stream of a Specific Pool](https://ide.bitquery.io/Realtime-Liquidity-Stream-of-a-Specific-Pool_5)

#### Realtime slippage on matic

This subscription query returns real-time slippage data for all DEX pools on Matic. You can monitor price impact and liquidity depth as trades occur.

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

To subscribe to latest Sunpump trades you can use.

▶️ [Sunpump trades](https://ide.bitquery.io/Sunpump-trades)

#### USDT TRC20 DEX Trades

Real-time DEX trades where USDT is the bought currency on Tron — protocol, buyer and seller, amounts and order IDs.

▶️ [USDT TRC20 DEX Trades](https://ide.bitquery.io/USDT-TRC20-DEX-Trades)

### Transfers

#### Real-time Tether USDT Transfers

This subscription streams the latest USDT (TRC20) transfers on the TRON network. You can modify the stream to monitor Transfers of USDT from or to a particular address.

▶️ [Real-time Tether USDT Transfers](https://ide.bitquery.io/usdt-trc20-transfers_1)

#### Sender is particular address

Sender is particular address. Uses the `Transfers` cube.

▶️ [Sender is particular address](https://ide.bitquery.io/Sender-is-particular-address)

#### Whale transfers of USDT on Tron

The subscription query below fetches the whale transactions on the Tron network. We have used USDT address `TThzxNRLrW2Brp9DcTQU8i4Wd9udCWEdZ3`.

▶️ [Whale transfers of USDT on Tron](https://ide.bitquery.io/Whale-transfers-of-USDT-on-Tron)

### Price & OHLC

#### Track price of a tron token in realtime

Provides real-time updates on price of token `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` in terms of USDT `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, including details about the DEX.

▶️ [Track price of a tron token in realtime](https://ide.bitquery.io/Track-price-of-a-tron-token-in-realtime)

### Supply & Market Cap

#### Get All DEX Trades on Tron With Price, Market Cap, and Supply

Crypto Trades API: one row per swap, with USD and supply. Filter `Pair.Market.Network: Tron`. When to use this vs chain DEX APIs.

▶️ [Get All DEX Trades on Tron With Price, Market Cap, and Supply](https://ide.bitquery.io/Get-All-DEX-Trades-on-Tron-With-Price-Market-Cap-and-Supply)

### Transactions

#### Monitor TRX address transactions

The subscription query below fetches the transactions on the Tron network for the wallet address `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`.

▶️ [Monitor TRX address transactions](https://ide.bitquery.io/monitor-TRX-address-transactions)

### Events & Calls

#### Latest Buy on SunPump

You can use following stream to get latest buys on Sunpump. You can try.

▶️ [Latest Buy on SunPump](https://ide.bitquery.io/latest-Buy-on-SunPump)

#### New tokens on sunpump

Will subscribe to the latest created sun pump tokens. You will find the newly created token address in `Log { SmartContract }`.

▶️ [New tokens on sunpump](https://ide.bitquery.io/New-tokens-on-sunpump_1)

#### Sunpump sell event

You can use following stream to get latest sells on Sunpump. You can try.

▶️ [Sunpump sell event](https://ide.bitquery.io/sunpump-sell-event)

#### Tron sunpump first time buy event

You can use follow stream to get stream of first time buy event for any new token.

▶️ [Tron sunpump first time buy event](https://ide.bitquery.io/Tron-sunpump-first-time-buy-event_1)

### Mempool

#### Events with argumens

Events with argumens. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Events with argumens](https://ide.bitquery.io/Events-with-argumens)

#### Sunpump trades mempool

We simulate transactions in mempool, therefore you can also get trades directly from mempool using.

▶️ [Sunpump trades mempool](https://ide.bitquery.io/Sunpump-trades-mempool)

#### Tron mempool transfers

Provides real-time data on token transfers happening in the TRON mempool including the value of the transferred amount in USD.

▶️ [Tron mempool transfers](https://ide.bitquery.io/Tron-mempool-transfers)

## Robinhood Chain

### Trades

#### Latest DEX Trades on Robinhood Chain

Latest DEX trades on Robinhood Chain (chain id 4663) via the Trading API, with price and USD amounts.

▶️ [Latest DEX Trades on Robinhood Chain](https://ide.bitquery.io/Robinhood-Trades)

#### Bags amm trade websocket

Stream every Bags trade as it is indexed via a GraphQL `subscription` on `Trading.Trades`, scoped to the Bags protocol family on Robinhood. Includes side (buy/sell), trader, base/quote amounts (native and USD), market cap, and full transaction header.

▶️ [Bags amm trade websocket](https://ide.bitquery.io/bags-amm-trade-websocket)

#### Pools trade Stream new Crowd Launch auctions

Every Crowd Launch deploys its auction through the auction factory `0x000000001f26a0044baa66024e7b6599c61963f8`, which emits `AuctionCreated(address,address,uint256,bytes)`.

▶️ [Pools trade Stream new Crowd Launch auctions](https://ide.bitquery.io/Pools-trade-Stream-new-Crowd-Launch-auctions)

#### Robinhood Chain API - Trades for a Token

Using this GraphQL stream you can get real-time trades for a specific token (example: AssetHood, `ASSETH`) with details such as trader address, token details, marketcap, FDV and transaction hash.

▶️ [Robinhood Chain API - Trades for a Token](https://ide.bitquery.io/Robinhood-Trades-for-a-token)

#### Stream Robinhood Chain Trades in Real Time

These are live examples — meme tokens go quiet over time, so swap in any token, pool, or trader you care about.

▶️ [Stream Robinhood Chain Trades in Real Time](https://ide.bitquery.io/stream-robinhood-chain-trades)

### Transfers

#### Ape.store Newly created tokens - Websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Ape.store Newly created tokens - Websocket](https://ide.bitquery.io/Apestore-Newly-created-tokens---Websocket)

#### Bags.fm Newly created tokens - Websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Bags.fm Newly created tokens - Websocket](https://ide.bitquery.io/Bagsfm-Newly-created-tokens---Websocket)

#### Bankr Bot Newly created tokens - Websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Bankr Bot Newly created tokens - Websocket](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens---Websocket)

#### Flap Sh Newly created tokens using transfer data - Websocket

Track Flap.sh mints as transfers from the zero address with amount `1000000000` in transactions sent to the Flap.sh contract.

▶️ [Flap Sh Newly created tokens using transfer data - Websocket](https://ide.bitquery.io/Flap-Sh-Newly-created-tokens-using-transfer-data---Websocket)

#### Hoodfun newly creaed tokens Websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Hoodfun newly creaed tokens Websocket](https://ide.bitquery.io/hoodfun-newly-creaed-tokens---Websocket)

#### Klik Finance Newly created tokens using transfers websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Klik Finance Newly created tokens using transfers websocket](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers-websocket)

#### Launchpad newly creaed tokens Websocket

Every transfer query on this page is identical except two values: the launchpad address in `Transaction.To` and the launch-mint `Amount`.

▶️ [Launchpad newly creaed tokens Websocket](https://ide.bitquery.io/launchpad-newly-creaed-tokens---Websocket)

#### Pools trade Stream launches with token detail

The transfer-based stream returns the token's name, symbol, decimals, and contract in the same payload — everything a sniping bot or listings feed needs, with no follow-up metadata call. It also carries the transaction's gas economics and success flag.

▶️ [Pools trade Stream launches with token detail](https://ide.bitquery.io/Pools-trade-Stream-launches-with-token-detail)

#### Real time transfers on robinhood

Stream live transfers for dashboards, bots, and alerting.

▶️ [Real time transfers on robinhood](https://ide.bitquery.io/real-time-transfers-on-robinhood)

### Price & OHLC

#### Robinhood Chain OHLCV / Candlestick API for a Token Pair

This GraphQL stream for 1 second OHLCV streams the USD normalised OHLC/K-line data for a token pair, and also contains info such as interval start and end time, marketcap, volume and token details for both base and quote tokens.

▶️ [Robinhood Chain OHLCV / Candlestick API for a Token Pair](https://ide.bitquery.io/OHLCV-stream-for-a-token-pair-on-robinhood)

### Liquidity & Pools

#### Stream New pools.trade Token Launches

Websocket subscription streaming every new pools.trade token launch on Robinhood Chain the moment it happens.

▶️ [Stream New pools.trade Token Launches](https://ide.bitquery.io/Pools-trade-Stream-new-launches)

### Events & Calls

#### Flap sh Newly created tokens using logs (TokenCreated) - Websocket

Filter Flap.sh `TokenCreated` events and decode argument values (token address, metadata fields, and related parameters).

▶️ [Flap sh Newly created tokens using logs (TokenCreated) - Websocket](https://ide.bitquery.io/Flap-sh-Newly-created-tokens-using-logs-TokenCreated---Websocket)

#### Stream New Tokens on Robinhood Chain (All Launchpads)

Follow the steps here: How to generate Bitquery API token ➤.

▶️ [Stream New Tokens on Robinhood Chain (All Launchpads)](https://ide.bitquery.io/stream-new-tokens-robinhood-chain)

## Bitcoin

### Price & OHLC

#### Latest Bitcoin Price

You can stream Bitcoin price at 1-second interval using the [Crypto Price APIs](/docs/trading/crypto-price-api/introduction/).

▶️ [Latest Bitcoin Price](https://ide.bitquery.io/Stream-Bitcoin-Price-Across-Chains)

## Trading API

### Trades

#### All chains New Trades Stream - Solana, eth, bsc ,base , arbitrum, matic

The same `NetworkBid` pattern applies on the Crypto Price API for `Token.NetworkBid` and `Market.NetworkBid` on Tokens and Pairs.

▶️ [All chains New Trades Stream - Solana, eth, bsc ,base , arbitrum, matic](https://ide.bitquery.io/all-chains-New-Trades-Stream---Solana-eth-bsc-base--arbitrum-matic_2)

#### All trades of a trader

All trades of a trader. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [All trades of a trader](https://ide.bitquery.io/All-trades-of-a-trader)

#### All wsol Trade Stream

All wsol Trade Stream. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [All wsol Trade Stream](https://ide.bitquery.io/All-wsol-Trade-Stream)

#### How do I get a wallet's trades on a specific pair?

Change the `Program` address to target different DEXs — e.g. `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` for Pump.fun.

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

Adjust the `gt` threshold — e.g. `10000` for $10K+, `1000000` for $1M+ trades.

▶️ [How do I stream whale trades for a specific wallet?](https://ide.bitquery.io/How-do-I-stream-whale-trades-for-a-specific-wallet)

#### How do I track trades for multiple tokens in one subscription?

There are two ways to track multiple tokens. You can specify token IDs using the `any` combinator to match trades where your tokens appear on either side of the pair.

▶️ [How do I track trades for multiple tokens in one subscription?](https://ide.bitquery.io/How-do-I-track-trades-for-multiple-tokens-in-one-subscription)

### Price & OHLC

#### FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Track token activity (OHLC, price, volume) every 1 second on FourMeme DEX (BSC).

▶️ [FourMeme 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/FourMeme-DEX-tokens-1-second-price-stream-with-OHLC)

#### PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders. Uses the `Pairs` cube.

▶️ [PumpAMM 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/PumpAMM-tokens-1-second-price-stream-with-OHLC_1)

#### Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders

Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders. Uses the `Pairs` cube.

▶️ [Raydium Launchlab 1-second Price, OHLC, Volume, SMA, EMA Stream for Traders](https://ide.bitquery.io/Raydium-Launchpad-DEX-tokens-1-second-price-stream-with-OHLC)

#### 5 minute price change api on solana

5 minute price change api on solana. Uses the `Tokens` cube.

▶️ [5 minute price change api on solana](https://ide.bitquery.io/5-minute-price-change-api-on-solana_6)

#### Bitcoin currency price stream

Get real-time Bitcoin OHLC data across all chains.

▶️ [Bitcoin currency price stream](https://ide.bitquery.io/bitcoin-currency-price-stream)

#### Heaven DEX tokens 1 second price stream with OHLC

Real-time (1s) stream of prices, OHLC, and volumes for tokens traded on Heaven DEX (Solana).

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

Subscribe to `Solana.DEXPools` with Raydium’s program and positive base change to detect new liquidity deposited into Raydium pools.

▶️ [Liquidity addition for radium](https://ide.bitquery.io/liquidity-addition-for-radium_1)

#### Liquidity removal for radium

Use the same Raydium program filter with negative `ChangeAmount` on the base side to stream liquidity withdrawals.

▶️ [Liquidity removal for radium](https://ide.bitquery.io/liquidity-removal-for-radium_1)

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

Subscribe to `Trading.Pairs` filtered by Uniswap protocols and 1s interval to power sub-minute charts and HFT analytics.

▶️ [Stream all Uniswap Seconds OHLC Kline](https://ide.bitquery.io/Stream-all-Uniswap-Seconds-OHLC-Kline)

#### Uniswap all versions trades stream

Filter `DEXTrades` with `ProtocolName` in `uniswap_v3`, `uniswap_v2`, `uniswap_v1` to stream only Uniswap family pools on mainnet.

▶️ [Uniswap all versions trades stream](https://ide.bitquery.io/uniswap-all-versions-trades-stream)

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

Below stream will be able to track specific Stablecoin depeg. In this query example, we are tracking depeg for the stablecoin `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` which has a symbol `USDC`.

▶️ [Stablecoin depeg tracking stream for USDC](https://ide.bitquery.io/stablecoin-depeg-tracking-stream-for-USDC)

#### Stablecoin trades for etheruem

Stablecoin trades for etheruem. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin trades for etheruem](https://ide.bitquery.io/Stablecoin-trades-for-etheruem)

#### Stablecoin trades for tron

Stablecoin trades for tron. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Stablecoin trades for tron](https://ide.bitquery.io/Stablecoin-trades-for-tron)

### Transfers

#### Latest Tron USDT Transfers stream

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest Tron USDT Transfers stream](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream)

#### Latest USDT/USDC Transfer Stream on BSC

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer Stream on BSC](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC)

#### Latest USDT/USDC Transfer stream on base

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer stream on base](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-base)

#### Latest USDT/USDC Transfer stream on ethereum

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer stream on ethereum](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum)

#### Listening to All USDT and USDC Payments on Solana - stream

Listening to All USDT and USDC Payments on Solana - stream. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Listening to All USDT and USDC Payments on Solana - stream](https://ide.bitquery.io/Listening-to-All-USDT-and-USDC-Payments-on-Solana---stream)

#### Listening to stablecoin Transfers for Specific Addresse on tron

Listen to USDT sent or received by address `TUTQj7VJ1QjR3t2GJByvrP25yZNFcj38VJ`. This is the canonical "merchant/treasury wallet monitor" pattern — fan-out one subscription per wallet and route hits to your payments backend.

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

Below stream will provide you the realtime portfolio updates for a particular address for a specific Stablecoin. In this query example, we are tracking portfolio updates for the address `3i51cKbLbaKAqvRJdCUaq9hsnvf9kqCfMujNgFj7nRKt` and for stablecoin `USDC`.

▶️ [Real time stablecoin portfolio](https://ide.bitquery.io/real-time-stablecoin-portfolio_2)

### Price & OHLC

#### Stablecoin 1 sec Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all stablecoins including USDC, USDT, DAI, USDS etc.

▶️ [Stablecoin 1 sec Price Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)

#### Stablecoin price stream of USDT

Get real-time and historical USDT prices, OHLCV, and moving averages across supported networks and markets.

▶️ [Stablecoin price stream of USDT](https://ide.bitquery.io/stablecoin-price-stream-of-USDT_2)

### Supply & Market Cap

#### USDT Stablecoin reserves on Solana

USDT Stablecoin reserves on Solana. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDT Stablecoin reserves on Solana](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana)

### Mempool

#### Latest Tron USDT Transfers stream in Mempool

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest Tron USDT Transfers stream in Mempool](https://ide.bitquery.io/Latest-Tron-USDT-Transfers-stream-in-Mempool)

#### Latest USDT/USDC Transfer Stream on BSC on Mempool

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer Stream on BSC on Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-Stream-on-BSC-on-Mempool)

#### Latest USDT/USDC Transfer stream on ethereum in Mempool

Listen to stablecoin payments across all major blockchains. The Mempool option lets you detect a payment *before* it is confirmed — useful for instant merchant UX.

▶️ [Latest USDT/USDC Transfer stream on ethereum in Mempool](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-stream-on-ethereum-in-Mempool)

## Perpetuals

### Trades

#### Hyperliquid Real-time Trades Stream (WebSocket)

Hyperliquid Real-time Trades Stream (WebSocket).

▶️ [Hyperliquid Real-time Trades Stream (WebSocket)](https://ide.bitquery.io/hyperliquid-trades-stream)

#### Solana Perps Live Trades Stream (Phoenix Fills)

Stream every stop-loss and take-profit placement as it happens.

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

The subscription query provided below fetches the most recent NFT trades on the Solana blockchain.

▶️ [Latest Solana NFT Trades](https://ide.bitquery.io/Latest-Solana-NFT-Trades)

### Transfers

#### ERC-721 (NFT) transfers

NFT transfers as they are mined, with token IDs.

▶️ [ERC-721 (NFT) transfers](https://ide.bitquery.io/ERC721-token-transfers)

#### Subscription WebSocket - Latest NFT Transfers

Using Streaming APIs, you can subscribe to real-time changes on blockchains. We use a GraphQL subscription,which function similarly to WebSockets.

▶️ [Subscription WebSocket - Latest NFT Transfers](https://ide.bitquery.io/Subscription-WebSocket---Latest-NFT-Transfers)

#### Subscribe to the latest NFT transfers on Solana

Let's see an example of NFT token transfers using GraphQL Subscription (Webhook). In the following API, we will be subscribing to all NFT token transfers.

▶️ [Subscribe to the latest NFT transfers on Solana](https://ide.bitquery.io/Subscribe-to-the-latest-NFT-transfers-on-Solana)

#### NFT Token Transfers API

NFT Token Transfers API.

▶️ [NFT Token Transfers API](https://ide.bitquery.io/NFT-Token-Transfers-API_4)

#### Transfers of a particular NFT

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Base network.

▶️ [Transfers of a particular NFT](https://ide.bitquery.io/Transfers-of-a-particular-NFT_1)

#### Track realtime NFT Transfers of a specific NFT on BSC chain

This query subscribes you to the real time non-fungible token (NFT) transfers of a specific nft contract on the BSC network.

▶️ [Track realtime NFT Transfers of a specific NFT on BSC chain](https://ide.bitquery.io/Track-realtime-NFT-Transfers-of-a-specific-NFT-on-BSC-chain)

#### Track realtime NFT Transfers on BSC chain

Track realtime NFT Transfers on BSC chain.

▶️ [Track realtime NFT Transfers on BSC chain](https://ide.bitquery.io/Track-realtime-NFT-Transfers-on-BSC-chain)

#### Websocket for tracking Transfers of a particular NFT websocket

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Tron network.

▶️ [Websocket for tracking Transfers of a particular NFT websocket](https://ide.bitquery.io/Websocket-for-tracking-Transfers-of-a-particular-NFT-websocket)

#### Real-time-transfer-websocket-for-NFT-token on matic

This query subscribes you to the real time transfers of a specific non-fungible token (NFT) on the Matic network.

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

Real-Time Trades Stream.

▶️ [Real-Time Trades Stream](https://ide.bitquery.io/prediction-market-trades-subscription)

#### Trades for a Specific Market (Stream)

Subscribe to trades for one market only by filtering on Question.MarketId. Replace the market ID in the query with your target market.

▶️ [Trades for a Specific Market (Stream)](https://ide.bitquery.io/subscribe-to-specific-market-trades)

#### Bitcoin Up or Down Trades Stream

Subscribe to live Polymarket trades for markets whose question title includes "Bitcoin Up or Down".

▶️ [Bitcoin Up or Down Trades Stream](https://ide.bitquery.io/Bitcoin-Up-or-Down-Trades-Stream)

#### How do I track high-value or whale trades on Polymarket?

Use a GraphQL subscription on `PredictionTrades` filtered by `CollateralAmountInUSD: { gt: "10000" }` and `ProtocolName: "polymarket"` to monitor trades exceeding $10,000 USD in real time. Ideal for detecting whale activity and large market movements.

▶️ [How do I track high-value or whale trades on Polymarket?](https://ide.bitquery.io/How-do-I-track-high-value-or-whale-trades-on-Polymarket)

#### Large trades on polymarket

Start by streaming large Polymarket trades. Each event gives you a buyer address to investigate. Change `subscription` to `query` for historical results.

▶️ [Large trades on polymarket](https://ide.bitquery.io/large-trades--on-polymarket)

#### Monitoring specific wallets trades in realtime for Ethereum up or down market

The same wallet-monitoring pattern works for every Polymarket Up or Down market — only the `Question.Title` filter changes. Open any of the pre-built IDE queries below to stream trades for the chain you care about.

▶️ [Monitoring specific wallets trades in realtime for Ethereum up or down market](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-Ethereum-up-or-down-market)

#### Monitoring specific wallets trades in realtime for XRP up or down market

The same wallet-monitoring pattern works for every Polymarket Up or Down market — only the `Question.Title` filter changes. Open any of the pre-built IDE queries below to stream trades for the chain you care about.

▶️ [Monitoring specific wallets trades in realtime for XRP up or down market](https://ide.bitquery.io/monitoring-specific-wallets-trades-in-realtime-for-XRP-up-or-down-market)

#### Polymarket AI whale trades stream

Streams live AI-market trades above a USD threshold (here `$5,000`). This is ideal for whale-alert bots and detecting large, conviction bets. Filter with a `Question.Title` keyword, or swap it for a single-market `MarketId`.

▶️ [Polymarket AI whale trades stream](https://ide.bitquery.io/Polymarket-AI-whale-trades-stream)

#### Polymarket whale trades alert

Stream successful Polymarket trades whose collateral exceeds $10,000 USD. Adjust the threshold string as needed.

▶️ [Polymarket whale trades alert](https://ide.bitquery.io/polymarket-whale-trades-alert_1)

### Markets

#### Real-Time Management Stream (Creations + Resolutions)

Real-Time Management Stream (Creations + Resolutions).

▶️ [Real-Time Management Stream (Creations + Resolutions)](https://ide.bitquery.io/Prediction-Managements-subscription-resolutions-creations)

#### Real-Time Market Creations

Subscribe only to new market (Created) events.

▶️ [Real-Time Market Creations](https://ide.bitquery.io/track-realtime-new-polymarket-creations)

#### Real-Time Market Resolutions

Subscribe only to Resolved events. Winning outcome is in Prediction.Outcome; token details (e.g. AssetId) in Prediction.OutcomeToken.

▶️ [Real-Time Market Resolutions](https://ide.bitquery.io/track-realtime-polymarket-resolutions)

### Settlements

#### Real-Time Settlement Stream

Real-Time Settlement Stream.

▶️ [Real-Time Settlement Stream](https://ide.bitquery.io/realtime-predicion-market-settlements-stream)

## x402

### Transfers

#### Real-Time Payment Monitoring for x402 Server

Real-Time Payment Monitoring for x402 Server. Uses the `Transfers` cube.

▶️ [Real-Time Payment Monitoring for x402 Server](https://ide.bitquery.io/Monitoring-the-latest-payment-to-the-specific-X402-server)

#### Real-Time Payment Monitoring for x402 Server on Solana

Real-Time Payment Monitoring for x402 Server on Solana. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Real-Time Payment Monitoring for x402 Server on Solana](https://ide.bitquery.io/Real-Time---Solana-transfers-stream)

## Cross-Chain

### Price & OHLC

#### Crypto Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all tokens across Solana, Ethereum, BNB, Tron.

▶️ [Crypto Price Stream](https://ide.bitquery.io/1-second-crypto-price-stream-with-mcap)

#### Stablecoin 1 sec Price Stream

This subscription gives you 1-second OHLC, mean price, averages for all stablecoins including USDC, USDT, DAI, USDS etc.

▶️ [Stablecoin 1 sec Price Stream](https://ide.bitquery.io/stablecoin-1-second-price-stream)
