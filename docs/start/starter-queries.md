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
- [Cardano](#cardano)
- [Ripple](#ripple)
- [Algorand](#algorand)
- [Trading API](#trading-api)
- [Stablecoins](#stablecoins)
- [Perpetuals](#perpetuals)
- [NFTs](#nfts)
- [Polymarket](#polymarket)
- [Futures DEXs](#futures-dexs)
- [x402](#x402)
- [Cross-Chain](#cross-chain)

## Ethereum

### Trades

#### Latest DEX trades for a token

Most recent swaps for one token across every Ethereum DEX. Change the token address in the `Currency: {SmartContract:}` filter.

▶️ [Latest DEX trades for a token](https://ide.bitquery.io/Ethereum-Trades-of-a-Token_1)

#### Realised PnL, buy and sell volume

Profit and loss for a wallet on one token, from its own trade history. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Realised PnL, buy and sell volume](https://ide.bitquery.io/Realised-Pnl-Buy-volume-Sell-Volume-Ethereum_1)

#### Trades by a wallet

Every buy and sell made by one address. Replace the wallet in `Transaction: {From:}`.

▶️ [Trades by a wallet](https://ide.bitquery.io/Ethereum-Trades-of-a-Trader_1)

#### Address is Buyer or Seller V2

Address is Buyer or Seller V2. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Address is Buyer or Seller V2](https://ide.bitquery.io/Address-is-Buyer-or-Seller-V2)

#### All events on fluid DEX VaultFactory

All events on fluid DEX VaultFactory. Uses the `Events` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [All events on fluid DEX VaultFactory](https://ide.bitquery.io/all-events-on-fluid-DEX-VaultFactory)

#### Buys, Sells, BuyVolume, SellVolume, Makers, TotalTradedVolume, PriceinUSD for a eth pair

Buys, Sells, BuyVolume, SellVolume, Makers, TotalTradedVolume, PriceinUSD for a eth pair. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Buys, Sells, BuyVolume, SellVolume, Makers, TotalTradedVolume, PriceinUSD for a eth pair](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-a-eth-pair)

#### Coin ticker api

Coin ticker api. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Coin ticker api](https://ide.bitquery.io/Coin-ticker-api_4)

#### Dex info

Dex info. Uses the `DEXTradeByTokens` cube.

▶️ [Dex info](https://ide.bitquery.io/dex-info)

#### Dex markets

Dex markets.

▶️ [Dex markets](https://ide.bitquery.io/dex-markets)

#### First 500 buyers of a token

Earliest buyers of a token in order, useful for launch and insider analysis. Needs the historical data add-on — see the comment at the top of the query.

▶️ [First 500 buyers of a token](https://ide.bitquery.io/first-500-buyers-of-a-ERC20-token_1)

### Transfers

#### ERC-20 transfers by wallet

Recent token transfers in and out of one address. Replace the address in the `where` clause.

▶️ [ERC-20 transfers by wallet](https://ide.bitquery.io/Get-ERC20-token-transfers-by-wallet_7)

#### ERC-20 transfers over a past period

Token transfers for a wallet between two dates. Change `since` and `till`. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ERC-20 transfers over a past period](https://ide.bitquery.io/Get-historical-ERC20-token-transfers-by-wallet_1)

#### Array_intersect example for 2 addresses

Array_intersect example for 2 addresses. Uses the `Transfers` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Array_intersect example for 2 addresses](https://ide.bitquery.io/array_intersect-example-for-2-addresses_2)

#### Binance:hot wallet transfers with transaction fees

Binance:hot wallet transfers with transaction fees. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Binance:hot wallet transfers with transaction fees](https://ide.bitquery.io/binancehot-wallet-transfers-with-transaction-fees)

#### Find earliest transfer to an account

Find earliest transfer to an account. Uses the `Transfers` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Find earliest transfer to an account](https://ide.bitquery.io/Copy-of-find-earliest-transfer-to-an-account)

#### Get Contract Type in v2

Get Contract Type in v2. Uses the `Transfers` cube.

▶️ [Get Contract Type in v2](https://ide.bitquery.io/Get-Contract-Type-in-v2)

#### Get Minted Address of the ICO Token

Get Minted Address of the ICO Token. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Get Minted Address of the ICO Token](https://ide.bitquery.io/Get-Minted-Address-of-the-ICO-Token)

#### Number of Purchasers in ICO

Number of Purchasers in ICO. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Number of Purchasers in ICO](https://ide.bitquery.io/Number-of-Purchasers-in-ICO)

#### Transfers sent OR received by an address

Both sides of an address's transfer history in one result, using an OR filter. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Transfers sent OR received by an address](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-on-Ethereum)

#### Total txn fees paid by binance hot wallet in a day

Total txn fees paid by binance hot wallet in a day. Uses the `Transfers` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

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

Average Tip in terms of avg gas Fee. Uses the `TransactionBalances` cube.

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

#### All-time high price of a token

Highest price a token has ever traded at, with the date it happened. Needs the historical data add-on — see the comment at the top of the query.

▶️ [All-time high price of a token](https://ide.bitquery.io/ATH-of-eth-token)

#### Prices for multiple tokens at once

Latest USD price for a list of tokens in a single request. Add addresses to the `in` filter.

▶️ [Prices for multiple tokens at once](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime)

#### OHLCV by pair address

Open, high, low, close and volume candles for one pair. Change the interval to re-bucket the candles.

▶️ [OHLCV by pair address](https://ide.bitquery.io/OHLC0_8)

#### Price change over 5m, 1h, 6h and 24h

Percentage moves across four windows for one token in one query.

▶️ [Price change over 5m, 1h, 6h and 24h](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_4)

#### Top 10 tokens by price change, last hour

Biggest movers on Ethereum over the past hour, ranked.

▶️ [Top 10 tokens by price change, last hour](https://ide.bitquery.io/Top-10-eth-tokens-by-price-change-in-last-1-hr_2)

#### Historical Price and Volume Data for a Token Pair beyond 30 days

Use this API to get historical price and volume for a specific token pair address on a specific network for the time window beyond the 30 days.

▶️ [Historical Price and Volume Data for a Token Pair beyond 30 days](https://ide.bitquery.io/historical-price-and-historical-volume)

#### Ohlc of a token pair 1 hour interval

Ohlc of a token pair 1 hour interval. Uses the `Pairs` cube.

▶️ [Ohlc of a token pair 1 hour interval](https://ide.bitquery.io/ohlc-of-a-token-pair-1-hour-interval)

#### Pepe historical ohlcv 30days

Pepe historical ohlcv 30days. Uses the `Tokens` cube.

▶️ [Pepe historical ohlcv 30days](https://ide.bitquery.io/pepe-historical-ohlcv-30days)

#### Price change 5min, 1hr, 6hr precentage of a specific token

Price change 5min, 1hr, 6hr precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Price change 5min, 1hr, 6hr precentage of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_1)

#### Price of a token in realtime

Price of a token in realtime. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Price of a token in realtime](https://ide.bitquery.io/Price-of-a-token-in-realtime)

### Supply & Market Cap

#### Total supply and market cap of a token

Current circulating supply and market cap for one token.

▶️ [Total supply and market cap of a token](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_4)

#### Latest supply of USDT and USDC

Live supply for the two largest stablecoins; swap the addresses for any other tokens.

▶️ [Latest supply of USDT and USDC](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain_1)

#### Get Token Total Supply and Market Cap

Get Token Total Supply and Market Cap. Uses the `TransactionBalances` cube.

▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap)

#### Latest token supply on USDT and USDC on ethereum chain

Latest token supply on USDT and USDC on ethereum chain. Uses the `TransactionBalances` cube.

▶️ [Latest token supply on USDT and USDC on ethereum chain](https://ide.bitquery.io/latest-token-supply-on-USDT-and-USDC-on-ethereum-chain)

#### Pepe volume marketcap

Pepe volume marketcap. Uses the `Tokens` cube.

▶️ [Pepe volume marketcap](https://ide.bitquery.io/pepe-volume-marketcap)

#### Top tokens by market cap

Ethereum tokens ranked by market capitalisation.

▶️ [Top tokens by market cap](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Ethereum)

#### Total Supply and onchain Marketcap of a specific token

Total Supply and onchain Marketcap of a specific token. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

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

BlackRock USD Institutional Digital Liquidity Fund Latest Issuance. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [BlackRock USD Institutional Digital Liquidity Fund Latest Issuance](https://ide.bitquery.io/BlackRock-USD-Institutional-Digital-Liquidity-Fund-Latest-Issuance)

#### Liquidiy of all token pools

Liquidiy of all token pools. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Liquidiy of all token pools](https://ide.bitquery.io/liquidiy-of-all-token-pools_1)

#### Top liquidity pools of atoken on ethereum

Top liquidity pools of atoken on ethereum. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Top liquidity pools of atoken on ethereum](https://ide.bitquery.io/top-liquidity-pools-of-atoken-on-ethereum)

#### Top liquidity pools on Ethereum

Top liquidity pools on Ethereum. Uses the `DEXPoolEvents` cube.

▶️ [Top liquidity pools on Ethereum](https://ide.bitquery.io/top-liquidity-pools-on-Ethereum)

#### Latest Liquidity Changes of a Specific Pool

Latest Liquidity Changes of a Specific Pool. Uses the `DEXPoolEvents` cube.

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

Debug traceTransaction. Uses the `Calls` cube.

▶️ [Debug traceTransaction](https://ide.bitquery.io/debug_traceTransaction)

#### Eth getBlockReceipt

Eth getBlockReceipt. Uses the `Transactions` cube.

▶️ [Eth getBlockReceipt](https://ide.bitquery.io/eth_getBlockReceipt)

#### Eth getTransactionByHash

Eth getTransactionByHash. Uses the `Transactions` cube.

▶️ [Eth getTransactionByHash](https://ide.bitquery.io/eth_getTransactionByHash_1)

#### Eth getTransactionReceipt

Eth getTransactionReceipt. Uses the `Transactions` cube.

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

All aave v3 events latest. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [All aave v3 events latest](https://ide.bitquery.io/All-aave-v3-events-latest)

#### ByteCode of A Token

ByteCode of A Token. Uses the `Calls` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ByteCode of A Token](https://ide.bitquery.io/ByteCode-of-A-Token)

#### Find the deployer of a contract

Returns which address created a given contract, and when. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Find the deployer of a contract](https://ide.bitquery.io/creator--deployer-of-an-address_1)

#### Debug_traceCall

Debug_traceCall. Uses the `Calls` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Debug_traceCall](https://ide.bitquery.io/debug_traceCall)

#### ETH/BSC SC creates count over date

ETH/BSC SC creates count over date. Uses the `Calls` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ETH/BSC SC creates count over date](https://ide.bitquery.io/ETHBSC-SC-creates-count-over-date)

#### Eth getLogs with filters

Eth getLogs with filters. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Eth getLogs with filters](https://ide.bitquery.io/eth_getLogs-with-filters)

### Mempool

#### Get next available nonce

Get next available nonce. Uses the `Transactions` cube.

▶️ [Get next available nonce](https://ide.bitquery.io/get-next-available-nonce)

#### Simulating Pending Transactions

Simulating Pending Transactions.

▶️ [Simulating Pending Transactions](https://ide.bitquery.io/Simulating-Pending-Transactions_1)

### Blocks & Validators

#### Aggregate Self-Destruct Statistics

Aggregate Self-Destruct Statistics. Uses the `TransactionBalances` cube.

▶️ [Aggregate Self-Destruct Statistics](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics)

#### QuasarBuilder MEV Payout Transaction Balance

QuasarBuilder MEV Payout Transaction Balance. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [QuasarBuilder MEV Payout Transaction Balance](https://ide.bitquery.io/QuasarBuilder-MEV-Payout-Transaction-Balance)

#### Self-Destruct Balance Decrease API

Self-Destruct Balance Decrease API. Uses the `TransactionBalances` cube.

▶️ [Self-Destruct Balance Decrease API](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API)

#### Self-Destruct Balance Increase API

Self-Destruct Balance Increase API. Uses the `TransactionBalances` cube.

▶️ [Self-Destruct Balance Increase API](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API)

#### Top validators by total tips in last 24 hrs

Top validators by total tips in last 24 hrs. Uses the `TransactionBalances` cube.

▶️ [Top validators by total tips in last 24 hrs](https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs)

#### Total tips received by a validator in last 24 hrs

Total tips received by a validator in last 24 hrs. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Total tips received by a validator in last 24 hrs](https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs)

### Uniswap

#### Latest slippage on a Uniswap v3 pool

Per-trade slippage for one v3 pool, to size orders before sending them.

▶️ [Latest slippage on a Uniswap v3 pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3-Ethereum_1)

#### All Pool_Ids for currency

All Pool_Ids for currency. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [All Pool_Ids for currency](https://ide.bitquery.io/All-Pool_Ids-for-currency)

#### Fee collection on Uniswap v3 Positions

Fee collection on Uniswap v3 Positions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Fee collection on Uniswap v3 Positions](https://ide.bitquery.io/Fee-collection-on-Uniswap-v3-Positions)

#### Latest ModifyLiquidity Events on Uniswap v4

Latest ModifyLiquidity Events on Uniswap v4. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Latest ModifyLiquidity Events on Uniswap v4](https://ide.bitquery.io/Latest-ModifyLiquidity-Events-on-Uniswap-v4)

#### Latest trades of a Uniswap pair

Trades for one Uniswap pair. Replace the pair address.

▶️ [Latest trades of a Uniswap pair](https://ide.bitquery.io/Latest-Trades-of-a-Pair-on-Uniswap)

#### Latest liquidity for a currency pair across all v4 pools

Latest liquidity for a currency pair across all v4 pools. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Latest liquidity for a currency pair across all v4 pools](https://ide.bitquery.io/latest-liquidity-for-a-currency-pair-across-all-v4-pools_1)

### PancakeSwap

#### Latest Trades on PancakeSwap V3 ETH

Latest Trades on PancakeSwap V3 ETH. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause.

▶️ [Latest Trades on PancakeSwap V3 ETH](https://ide.bitquery.io/Latest-Trades-on-PancakeSwap-V3-ETH)

#### Top Traders of a token on PancakeSwap on ETH

Top Traders of a token on PancakeSwap on ETH. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top Traders of a token on PancakeSwap on ETH](https://ide.bitquery.io/Top-Traders-of-a-token-on-PancakeSwap-on-ETH)

#### Top token pairs on PancakeSwap v3

Top token pairs on PancakeSwap v3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top token pairs on PancakeSwap v3](https://ide.bitquery.io/Top-token-pairs-on-PancakeSwap-v3)

## Solana

### Trades

#### Get Multiple Token Analytics

Returns analytics data for multiple token addresses.

▶️ [Get Multiple Token Analytics](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-multiple-solana-tokens)

#### Get Token Metadata

Get the token metadata for contract (mint, standard, name, symbol).

▶️ [Get Token Metadata](https://ide.bitquery.io/Solana-currency-details)

#### Get Token Pair Stats

Get the pair stats by using pair address.

▶️ [Get Token Pair Stats](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair)

#### Get Token Pairs by Address

Get the supported pairs for a specific token address.

▶️ [Get Token Pairs by Address](https://ide.bitquery.io/traded-pairs-of-a-token_2)

#### Get Volume Stats for Solana Chain

Returns volume statistics, active wallets, and total transactions for Solana.

▶️ [Get Volume Stats for Solana Chain](https://ide.bitquery.io/Chain-stats-like-total-volume-traded-total-transactions-active-wallets_1)

#### Realised PnL, avg buy price, buy volume, sell volume of a Trader for specific token

Get realised PnL, average buy price, buy volume, and sell volume for a token on Solana of a trader for over a time window.

▶️ [Realised PnL, avg buy price, buy volume, sell volume of a Trader for specific token](https://ide.bitquery.io/Realised-Pnl-avg-buy-price-Buy-volume-Sell-Volume-Solana_2)

#### Search tokens by name, symbol, mint address

Search for tokens based on contract address, token name or token symbol.

▶️ [Search tokens by name, symbol, mint address](https://ide.bitquery.io/Token-Search-API---trump-symbol)

#### Get Swaps by Pair Address

Get all trades related transactions for a specific pair address.

▶️ [Get Swaps by Pair Address](https://ide.bitquery.io/swaps-for-a-market-address-on-Solana)

#### Get Trades by Wallet Address

Get all trades related transactions (buy, sell) for a specific wallet address.

▶️ [Get Trades by Wallet Address](https://ide.bitquery.io/Solana-dextrades-by-a-trader_2)

#### Buys Sells BuyVolume SellVolume Makers TotalTradedVolume PriceinUSD for solana token pair

Buys Sells BuyVolume SellVolume Makers TotalTradedVolume PriceinUSD for solana token pair. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Buys Sells BuyVolume SellVolume Makers TotalTradedVolume PriceinUSD for solana token pair](https://ide.bitquery.io/Buys-Sells-BuyVolume-SellVolume-Makers-TotalTradedVolume-PriceinUSD-for-solana-token-pair00_2)

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

Currency with elon inclusion. Uses the `Transfers` cube.

▶️ [Currency with elon inclusion](https://ide.bitquery.io/Currency-with-elon-inclusion)

#### Solana token transfers of Bags fm tokens

Solana token transfers of Bags fm tokens. Uses the `Transfers` cube.

▶️ [Solana token transfers of Bags fm tokens](https://ide.bitquery.io/Solana-token-transfers-of-Bags-fm-tokens)

#### Total txn fees paid by the Account

Total txn fees paid by the Account. Uses the `Transfers` cube.

▶️ [Total txn fees paid by the Account](https://ide.bitquery.io/total-txn-fees-paid-by-the-Account)

#### Transaction fees paid by Account aggregated by currency

Transaction fees paid by Account aggregated by currency. Uses the `Transfers` cube.

▶️ [Transaction fees paid by Account aggregated by currency](https://ide.bitquery.io/Transaction-fees-paid-by-Account-aggregated-by-currency)

#### Transfers of a wallet

Transfers of a wallet. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Transfers of a wallet](https://ide.bitquery.io/Transfers-of-a-wallet_1)

#### Wallet transfers with transaction fees paid

Wallet transfers with transaction fees paid. Uses the `Transfers` cube.

▶️ [Wallet transfers with transaction fees paid](https://ide.bitquery.io/wallet-transfers-with-transaction-fees-paid)

### Balances & Holders

#### Solana Instruction Balance Updates

This query returns Solana balance update info for any balance update event, including the address, amount, currency details, and the details of the program responsible for this update.

▶️ [Solana Instruction Balance Updates](https://ide.bitquery.io/Solana-InstructionBalanceUpdates)

#### Balance updates

Balance updates. Uses the `InstructionBalanceUpdates` cube.

▶️ [Balance updates](https://ide.bitquery.io/balance-updates)

#### Solana balance updates executing burn instruction

Solana balance updates executing burn instruction. Uses the `InstructionBalanceUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Solana balance updates executing burn instruction](https://ide.bitquery.io/solana-balance-updates-executing-burn-instruction)

#### Trades of wallets with balance Updates in that trades

Trades of wallets with balance Updates in that trades. Uses the `DEXTrades` cube.

▶️ [Trades of wallets with balance Updates in that trades](https://ide.bitquery.io/Trades-of-wallets-with-balance-Updates-in-that-trades)

### Price & OHLC

#### Get OHLCV by Pair Address

You can get charting data easily with this query. Adjust the intervals as necessary. This query supports historical data.

▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC-for-a-token_8)

#### Get Token Prices on Solana

Returns price information for multiple Solana tokens in a single request.

▶️ [Get Token Prices on Solana](https://ide.bitquery.io/Get-multiple-Token-Prices)

#### Historical Price and Volume Data (Volume & Price, Last 24h using Trading API)

Use this API to get historical price and volume for a specific token over the past 24 hours.

▶️ [Historical Price and Volume Data (Volume & Price, Last 24h using Trading API)](https://ide.bitquery.io/24h-historical-price-and-historical-volume-on-Solana)

#### Price change 5min, 1hr, 6hr precentage of a specific token

With this, you can get the price change 5min, 1hr, 6hr precentage of a specific token.

▶️ [Price change 5min, 1hr, 6hr precentage of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_5)

#### Top 10 solana tokens by price change in last 1 hr

With this, you can get top 10 solana tokens by price change in last 1 hr.

▶️ [Top 10 solana tokens by price change in last 1 hr](https://ide.bitquery.io/Top-10-solana-tokens-by-price-change-in-last-1-hr_4)

#### Get Latest Price of a Token in USD

Get Latest Price of a Token in USD. Uses the `Pairs` cube. Replace the address in the `where` clause to use it.

▶️ [Get Latest Price of a Token in USD](https://ide.bitquery.io/Pumpfun-token-latest-price-USD)

#### ATH of multiple tokens quantile Solana

ATH of multiple tokens quantile Solana. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ATH of multiple tokens quantile Solana](https://ide.bitquery.io/ATH-of-multiple-tokens-quantile-Solana)

#### ATH with price delta Solana

ATH with price delta Solana. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ATH with price delta Solana](https://ide.bitquery.io/ATH-with-price-delta-Solana)

#### AldrinAmm OHLC for specific pair

AldrinAmm OHLC for specific pair. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [AldrinAmm OHLC for specific pair](https://ide.bitquery.io/AldrinAmm-OHLC-for-specific-pair)

#### Get Latest Price of Apple xStock in USD Real-time

Get Latest Price of Apple xStock in USD Real-time. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Latest Price of Apple xStock in USD Real-time](https://ide.bitquery.io/Get-Latest-Price-of-Apple-xStock-in--USD-Real-time)

### Supply & Market Cap

#### Bags.fm token creation using Solana token supply updates

Bags.fm token creation using Solana token supply updates. Uses the `TokenSupplyUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Bags.fm token creation using Solana token supply updates](https://ide.bitquery.io/Bagsfm-token-creation-using-Solana-token-supply-updates)

#### Market cap of token

Market cap of token. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [Market cap of token](https://ide.bitquery.io/market-cap-of-token_1)

#### Marketcap of tokens

Marketcap of tokens. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Marketcap of tokens](https://ide.bitquery.io/Marketcap-of-tokens)

#### Sandisk - Backpack Securities MCAP

Sandisk - Backpack Securities MCAP. Uses the `Pairs` cube. Replace the address in the `where` clause to use it.

▶️ [Sandisk - Backpack Securities MCAP](https://ide.bitquery.io/Sandisk---Backpack-Securities-MCAP)

#### Token burn example solana

Token burn example solana. Uses the `TokenSupplyUpdates` cube.

▶️ [Token burn example solana](https://ide.bitquery.io/token-burn-example-solana)

#### Token supply

Token supply. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [Token supply](https://ide.bitquery.io/token-supply_2)

#### Tokens with market cap range

Tokens with market cap range. Uses the `TokenSupplyUpdates` cube.

▶️ [Tokens with market cap range](https://ide.bitquery.io/tokens-with-market-cap-range)

#### Top 10 marketcap jump tokens in last 1hr

Top 10 marketcap jump tokens in last 1hr. Uses the `TokenSupplyUpdates` cube.

▶️ [Top 10 marketcap jump tokens in last 1hr](https://ide.bitquery.io/top-10-marketcap-jump-tokens-in-last-1hr)

#### Top Solana tokens based on market cap

Top Solana tokens based on market cap. Uses the `TokenSupplyUpdates` cube.

▶️ [Top Solana tokens based on market cap](https://ide.bitquery.io/top-Solana-tokens-based-on-market-cap)

#### Top Tokens by Market Cap on solana

Top Tokens by Market Cap on solana. Uses the `Tokens` cube.

▶️ [Top Tokens by Market Cap on solana](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-solana)

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

All liquidity add instructions track on Solana. Uses the `DEXPools` cube.

▶️ [All liquidity add instructions track on Solana](https://ide.bitquery.io/All-liquidity-add-instructions-track-on-Solana)

#### CPMM pools created

CPMM pools created. Uses the `Instructions` cube. Replace the address in the `where` clause to use it.

▶️ [CPMM pools created](https://ide.bitquery.io/CPMM-pools-created_1)

#### Get LP Latest liqudity on Solana

Get LP Latest liqudity on Solana. Uses the `DEXPools` cube. Replace the address in the `where` clause to use it.

▶️ [Get LP Latest liqudity on Solana](https://ide.bitquery.io/Get-LP-Latest-liqudity-on-Solana)

#### Get all the liquidity pools info for a particular token

Get all the liquidity pools info for a particular token. Uses the `DEXPools` cube. Change the token address in the `where` clause to use it.

▶️ [Get all the liquidity pools info for a particular token](https://ide.bitquery.io/get-all-the-liquidity-pools-info-for-a-particular-token_1)

#### Liquidity change in recent month

Liquidity change in recent month. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Liquidity change in recent month](https://ide.bitquery.io/liquidity-change-in-recent-month)

#### Liquidity lock using instructions balance update

Liquidity lock using instructions balance update. Uses the `InstructionBalanceUpdates` cube. Replace the address in the `where` clause to use it.

▶️ [Liquidity lock using instructions balance update](https://ide.bitquery.io/Liquidity-lock-using-instructions-balance-update)

### Events & Calls

#### Not Anchor Error Solana Logs

Not Anchor Error Solana Logs. Uses the `Instructions` cube.

▶️ [Not Anchor Error Solana Logs](https://ide.bitquery.io/Not-Anchor-Error-Solana-Logs)

#### Solana Zeta Market logs

Solana Zeta Market logs. Uses the `Instructions` cube.

▶️ [Solana Zeta Market logs](https://ide.bitquery.io/Solana-Zeta-Market-logs)

### Pump.fun

#### Top 10 pump fun tokens by Marketcap change in last 5mins

This query returns the top 10 pump fun tokens by Marketcap change in last 5mins. You can increase the limit to get more tokens.

▶️ [Top 10 pump fun tokens by Marketcap change in last 5mins](https://ide.bitquery.io/Top-10-pump-fun-tokens-by-Marketcap-change-in-last-5mins_1)

#### Top PumpFun Tokens by Marketcap

This query returns the top 10 PumpFun tokens based on market cap. You can increase the limit to get more tokens.

▶️ [Top PumpFun Tokens by Marketcap](https://ide.bitquery.io/top-tokens-by-mktcap-on-pump-fun-in-last-15-min)

#### Get Bonding Curve Progress of a Token on Pump Fun

Returns Bonding Curve Percentage of a Token on the Pump Fun.

▶️ [Get Bonding Curve Progress of a Token on Pump Fun](https://ide.bitquery.io/get-the-bonding-curve-progress-percentage_1)

#### ATH Market Cap of Pump Fun Tokens in a Specific Timeframe

ATH Market Cap of Pump Fun Tokens in a Specific Timeframe. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [ATH Market Cap of Pump Fun Tokens in a Specific Timeframe](https://ide.bitquery.io/ATH-Market-Cap-of-Pump-Fun-Tokens-in-a-Specific-Timeframe)

#### All tokens traded on Pump.fun in the last 1 hour

All tokens traded on Pump.fun in the last 1 hour. Uses the `Pairs` cube.

▶️ [All tokens traded on Pump.fun in the last 1 hour](https://ide.bitquery.io/all-tokens-traded-on-Pumpfun-in-the-last-1-hour_1)

#### How do I get tokens that reached a specific market cap on Pump.fun?

How do I get tokens that reached a specific market cap on Pump.fun?. Uses the `Pairs` cube.

▶️ [How do I get tokens that reached a specific market cap on Pump.fun?](https://ide.bitquery.io/How-do-I-get-tokens-that-reached-a-specific-market-cap-on-Pumpfun)

### Meteora

#### Get the Top Traders of a specific Token on Meteora DAMM v2 DEX

Get the Top Traders of a specific Token on Meteora DAMM v2 DEX. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get the Top Traders of a specific Token on Meteora DAMM v2 DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DAMM-v2-DEX_1)

#### Get the Top Traders of a specific Token on Meteora DLMM DEX

Get the Top Traders of a specific Token on Meteora DLMM DEX. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get the Top Traders of a specific Token on Meteora DLMM DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DLMM-DEX)

#### Get the Top Traders of a specific Token on Meteora DYN DEX

Get the Top Traders of a specific Token on Meteora DYN DEX. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get the Top Traders of a specific Token on Meteora DYN DEX](https://ide.bitquery.io/Get-the-Top-Traders-of-a-specific-Token-on-Meteora-DYN-DEX)

#### Meteora DAMM v2 OHLC API

Meteora DAMM v2 OHLC API. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Meteora DAMM v2 OHLC API](https://ide.bitquery.io/Meteora-DAMM-v2-OHLC-API)

#### Meteora DLMM OHLC API

Meteora DLMM OHLC API. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Meteora DLMM OHLC API](https://ide.bitquery.io/Meteora-DLMM-OHLC-API)

#### Meteora DYN OHLC API

Meteora DYN OHLC API. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Meteora DYN OHLC API](https://ide.bitquery.io/Meteora-DYN-OHLC-API)

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

### LetsBonk.fun

#### Latest Price of a LetsBonk.fun Token on Launchpad

Latest Price of a LetsBonk.fun Token on Launchpad. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Price of a LetsBonk.fun Token on Launchpad](https://ide.bitquery.io/Latest-Price-of-a-LetsBonkfun-Token-on-Launchpad)

#### Latest Trades of a letsbonk.fun token on Launchpad

Latest Trades of a letsbonk.fun token on Launchpad. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

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

## BSC

### Trades

#### BSC DEX Trades

This query returns the latest trades on the BSC network from a trader perspective and returns useful metrics such as marketcap and pool ranking.

▶️ [BSC DEX Trades](https://ide.bitquery.io/BSC-dextrades_9)

#### BSC Dex Trade By Tokens

This query returns the latest trades on the BSC network. This is useful when looking for trades of a token.

▶️ [BSC Dex Trade By Tokens](https://ide.bitquery.io/BSC-dextrades-for-a-token)

#### Top Gainers on BSC

Get Top Gainers for the BSC network.

▶️ [Top Gainers on BSC](https://ide.bitquery.io/bsc-top-gainers)

#### Get Trades by a Trader

Get all trades by a particular trader.

▶️ [Get Trades by a Trader](https://ide.bitquery.io/BSC-dextrades-by-a-trader)

#### All dexs info on bsc

All dexs info on bsc.

▶️ [All dexs info on bsc](https://ide.bitquery.io/all-dexs-info-on-bsc)

#### First 500 buyers of a specific BSC chain token

First 500 buyers of a specific BSC chain token. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [First 500 buyers of a specific BSC chain token](https://ide.bitquery.io/first-500-buyers-of-a-specific-BSC-chain-token_2)

#### Get all dex markets for a token

Get all dex markets for a token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get all dex markets for a token](https://ide.bitquery.io/get-all-dex-markets-for-a-token)

#### Get all the DEXs on BSC network

Get all the DEXs on BSC network.

▶️ [Get all the DEXs on BSC network](https://ide.bitquery.io/Get-all-the-DEXs-on-BSC-network)

#### Latest Flap.sh trades for a specific token

Latest Flap.sh trades for a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Flap.sh trades for a specific token](https://ide.bitquery.io/Latest-Flapsh-trades-for-a-specific-token)

#### Latest Flap.sh trades using DEXTrades API

Latest Flap.sh trades using DEXTrades API. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Flap.sh trades using DEXTrades API](https://ide.bitquery.io/Latest-Flapsh-trades-using-DEXTrades-API)

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

Check if an address interacted with predict.fun ever. Uses the `Transfers` cube.

▶️ [Check if an address interacted with predict.fun ever](https://ide.bitquery.io/check-if-an-address-interacted-with-predictfun-ever)

#### Check who created this meme rush token

Check who created this meme rush token. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Check who created this meme rush token](https://ide.bitquery.io/check-who-created-this-meme-rush-token)

#### Check who created this token

Check who created this token. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Check who created this token](https://ide.bitquery.io/check-who-created-this-token)

#### First transfers of a token

First transfers of a token. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [First transfers of a token](https://ide.bitquery.io/first-transfers-of-a-token_5)

#### Meme rush tokens created by specific dev

Meme rush tokens created by specific dev. Uses the `Transfers` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Meme rush tokens created by specific dev](https://ide.bitquery.io/meme-rush-tokens-created-by-specific-dev)

#### New Flap.sh Tokens Created Using Transfers API

New Flap.sh Tokens Created Using Transfers API. Uses the `Transfers` cube.

▶️ [New Flap.sh Tokens Created Using Transfers API](https://ide.bitquery.io/New-Flapsh-Tokens-Created-Using-Transfers-API)

#### Sender OR Receiver Transfer Example BSC

Sender OR Receiver Transfer Example BSC. Uses the `Transfers` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Sender OR Receiver Transfer Example BSC](https://ide.bitquery.io/Sender-OR-Receiver-Transfer-Example-BSC)

#### Token created by specific dev

Token created by specific dev. Uses the `Transfers` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token created by specific dev](https://ide.bitquery.io/token-created-by-specific-dev)

### Balances & Holders

#### Get latest BNB balance of an wallet

Get latest BNB balance of an wallet.

▶️ [Get latest BNB balance of an wallet](https://ide.bitquery.io/Latest-native-balance-of-an-address-bsc)

#### Average Tip in terms of avg gas Fee bsc

Average Tip in terms of avg gas Fee bsc. Uses the `TransactionBalances` cube.

▶️ [Average Tip in terms of avg gas Fee bsc](https://ide.bitquery.io/Average-Tip-in-terms-of-avg-gas-Fee-bsc)

#### Latest balance of an address for a specific token bsc

Latest balance of an address for a specific token bsc. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Latest balance of an address for a specific token bsc](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token-bsc)

#### Top 10 holders percentage

Top 10 holders percentage. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Top 10 holders percentage](https://ide.bitquery.io/top-10-holders-percentage)

#### Track recent ephemeral contract patterns bsc

Track recent ephemeral contract patterns bsc. Uses the `TransactionBalances` cube.

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

#### BEP-20 Token Price

Get the latest price of a BEP-20 token on BSC network.

▶️ [BEP-20 Token Price](https://ide.bitquery.io/realtime-usd-price-of-a-token)

#### Get Price Change 5min, 1h, 6h and 24h of a specific BSC token

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the BSC network.

▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific BSC token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_3)

#### OHLC for a BEP-20 Token

Get OHLC statistics for a BEP-20 token on BSC network.

▶️ [OHLC for a BEP-20 Token](https://ide.bitquery.io/OHLC-for-a-token-on-bsc_1)

#### Top 10 BSC Tokens by Price Change in last 1h

This query gets you top 10 BSC Tokens by Price Change in last 1h.

▶️ [Top 10 BSC Tokens by Price Change in last 1h](https://ide.bitquery.io/Top-10-bsc-tokens-by-price-change-in-last-1-hr)

#### BSC OHLC API For Token Pair

BSC OHLC API For Token Pair. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [BSC OHLC API For Token Pair](https://ide.bitquery.io/BSC-OHLC-API-For-Token-Pair)

#### Meme rush token ATH price

Meme rush token ATH price. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Meme rush token ATH price](https://ide.bitquery.io/meme-rush-token-ATH-price)

#### Latest price of a token on bsc

Latest price of a token on bsc. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Latest price of a token on bsc](https://ide.bitquery.io/Latest-price-of-a-token-on-bsc)

#### OHLCV data for specific Flap.sh token against BNB

OHLCV data for specific Flap.sh token against BNB. Uses the `Pairs` cube.

▶️ [OHLCV data for specific Flap.sh token against BNB](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-against-BNB)

#### OHLCV data for specific Flap.sh token in USD

OHLCV data for specific Flap.sh token in USD. Uses the `Tokens` cube.

▶️ [OHLCV data for specific Flap.sh token in USD](https://ide.bitquery.io/OHLCV-data-for-specific-Flapsh-token-in-USD)

#### Percentage price change for a meme rush token

Percentage price change for a meme rush token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Percentage price change for a meme rush token](https://ide.bitquery.io/Percentage-price-change-for-a-meme-rush-token)

### Supply & Market Cap

#### Get Total Supply and Marketcap of an ERC20 token

Get Total Supply and Marketcap of an ERC20 token.

▶️ [Get Total Supply and Marketcap of an ERC20 token](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc_1)

#### Top Tokens by Market Cap on bsc

Top Tokens by Market Cap on bsc. Uses the `Tokens` cube.

▶️ [Top Tokens by Market Cap on bsc](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-bsc)

#### Total Supply and onchain Marketcap of a specific token bsc

Total Supply and onchain Marketcap of a specific token bsc. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Total Supply and onchain Marketcap of a specific token bsc](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc)

### Liquidity & Pools

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on BSC. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Pancakeswap)

#### Latest Liquidity Changes of a Specific Pool

Latest Liquidity Changes of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_2)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.

▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_6)

#### Gra fun buy transactions

Gra fun buy transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Gra fun buy transactions](https://ide.bitquery.io/Gra-fun-buy-transactions)

#### Gra fun sell transactions

Gra fun sell transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Gra fun sell transactions](https://ide.bitquery.io/Gra-fun-sell-transactions)

### Events & Calls

#### Latest Calls on BSC network

Latest Calls on BSC network. Uses the `Calls` cube.

▶️ [Latest Calls on BSC network](https://ide.bitquery.io/Latest-Calls-on-BSC-network)

#### Latest flap.sh token created using events data

Latest flap.sh token created using events data. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest flap.sh token created using events data](https://ide.bitquery.io/Latest-flapsh-token-created-using-events-data_1)

### Blocks & Validators

#### Aggregate Self-Destruct Statistics bsc

Aggregate Self-Destruct Statistics bsc. Uses the `TransactionBalances` cube.

▶️ [Aggregate Self-Destruct Statistics bsc](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-bsc)

#### Self-Destruct Balance Decrease API bsc

Self-Destruct Balance Decrease API bsc. Uses the `TransactionBalances` cube.

▶️ [Self-Destruct Balance Decrease API bsc](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API-bsc)

#### Self-Destruct Balance Increase API bsc

Self-Destruct Balance Increase API bsc. Uses the `TransactionBalances` cube.

▶️ [Self-Destruct Balance Increase API bsc](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API-bsc)

#### Top validators by total tips in last 24 hrs bsc

Top validators by total tips in last 24 hrs bsc. Uses the `TransactionBalances` cube.

▶️ [Top validators by total tips in last 24 hrs bsc](https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs-bsc)

#### Historical Miner Balance Data bsc

Historical Miner Balance Data bsc. Uses the `TransactionBalances` cube.

▶️ [Historical Miner Balance Data bsc](https://ide.bitquery.io/Historical-Miner-Balance-Data-bsc)

#### Total tips received by a validator in last 24 hrs bsc

Total tips received by a validator in last 24 hrs bsc. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

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

Get Latest Price of a token on PancakeSwap Infinity. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Latest Price of a token on PancakeSwap Infinity](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity_1)

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

Four meme - token ATH price. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Four meme - token ATH price](https://ide.bitquery.io/four-meme---token-ATH-price)

#### Get first buys of an address list of a specific token

Get first buys of an address list of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Get first buys of an address list of a specific token](https://ide.bitquery.io/get-first-buys-of-an-address-list-of-a-specific-token_2)

#### If meme rush token migrated from four meme or not

If meme rush token migrated from four meme or not. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [If meme rush token migrated from four meme or not](https://ide.bitquery.io/if-meme-rush-token-migrated-from-four-meme-or-not)

### Uniswap

#### Trading Pairs on a BSC DEX

Get all trading pairs present on a BSC network DEX.

▶️ [Trading Pairs on a BSC DEX](https://ide.bitquery.io/trading-pairs-on-BNB-by-USD-volume)

#### Get metadata

Get metadata. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get metadata](https://ide.bitquery.io/get-metadata_1)

#### Latest Trades for a currency pair on bsc

Latest Trades for a currency pair on bsc. Uses the `DEXTrades` cube.

▶️ [Latest Trades for a currency pair on bsc](https://ide.bitquery.io/Latest-Trades-for-a-currency-pair-on-bsc)

#### OHLC on BSC Uniswap v3

OHLC on BSC Uniswap v3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [OHLC on BSC Uniswap v3](https://ide.bitquery.io/OHLC-on-BSC-Uniswap-v3)

#### Top bought tokens on bsc uniswap v3

Top bought tokens on bsc uniswap v3. Uses the `DEXTradeByTokens` cube.

▶️ [Top bought tokens on bsc uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-bsc-uniswap-v3)

#### Top buyers of a currency on uniswap v4 bsc

Top buyers of a currency on uniswap v4 bsc. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Top buyers of a currency on uniswap v4 bsc](https://ide.bitquery.io/top-buyers-of-a-currency-on-uniswap-v4-bsc)

## Base

### Trades

#### Base DEX Trades

This query returns the latest trades on the Base network from a trader perspective and returns useful metrics such as marketcap and pool ranking.

▶️ [Base DEX Trades](https://ide.bitquery.io/base-dextrades_3)

#### Base Dex Trade By Tokens

This query returns the latest trades on the Base network. This is useful when looking for trades of a token.

▶️ [Base Dex Trade By Tokens](https://ide.bitquery.io/base-dextrades-for-a-token)

#### Get Trades by a Trader

Get all trades by a particular trader.

▶️ [Get Trades by a Trader](https://ide.bitquery.io/base-dextrades-by-a-trader)

#### First 500 buyers of a specific base token

First 500 buyers of a specific base token. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [First 500 buyers of a specific base token](https://ide.bitquery.io/first-500-buyers-of-a-specific-base-token)

#### Latest Trades of a Token on Zora Base

Latest Trades of a Token on Zora Base. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Latest Trades of a Token on Zora Base](https://ide.bitquery.io/Latest-Trades-of-a-Token-on-Zora-Base)

#### Latest Zora Trades on Base

Latest Zora Trades on Base. Uses the `DEXTrades` cube.

▶️ [Latest Zora Trades on Base](https://ide.bitquery.io/Latest-Zora-Trades-on-Base)

#### Most Traded Tokens on Aerodome Last Month

Most Traded Tokens on Aerodome Last Month. Uses the `DEXTradeByTokens` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Most Traded Tokens on Aerodome Last Month](https://ide.bitquery.io/Most-Traded-Tokens-on-Aerodome-Last-Month)

#### Top Traders by PnL of a specific base pool

Top Traders by PnL of a specific base pool. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [Top Traders by PnL of a specific base pool](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-base-pool_1)

#### Ape store token trades

Ape store token trades. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape store token trades](https://ide.bitquery.io/ape-store-token-trades)

### Transfers

#### Get Historical ERC20 token transfers by wallet

Get ERC20 token transfers for an address in a given historical time window

▶️ [Get Historical ERC20 token transfers by wallet](https://ide.bitquery.io/Get-historical-ERC20-token-transfers-by-wallet-base_2)

#### Get token transfers by wallet

Get token transactions ordered by block number in descending order.

▶️ [Get token transfers by wallet](https://ide.bitquery.io/Get-token-transfers-by-wallet-base_1)

#### Newly created zora tokens

Newly created zora tokens. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Newly created zora tokens](https://ide.bitquery.io/Newly-created-zora-tokens)

#### Tx from to base address

Tx from to base address. Uses the `Transfers` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Tx from to base address](https://ide.bitquery.io/tx-from-to-base-address)

### Balances & Holders

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

Base balances address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Base balances address](https://ide.bitquery.io/base-balances-address)

#### Base native balances address

Base native balances address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Base native balances address](https://ide.bitquery.io/base-native-balances-address)

#### Latest balance of an address for a specific token base

Latest balance of an address for a specific token base. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Latest balance of an address for a specific token base](https://ide.bitquery.io/Latest-balance-of-an-address-for-a-specific-token-base)

#### Token holder snapshot base

Token holder snapshot base. Uses the `Holders` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token holder snapshot base](https://ide.bitquery.io/token-holder-snapshot-base)

### Price & OHLC

#### Get ATH Price of a token

Retrieves the all-time high (ATH) price in USD for a specified token contract.

▶️ [Get ATH Price of a token](https://ide.bitquery.io/ATH-of-base-token)

#### Get Multiple Token Prices

Returns an array of token prices denominated in the blockchain's native token and USD for a given token contract address.

▶️ [Get Multiple Token Prices](https://ide.bitquery.io/Price-of-multiple-tokens-in-realtime_1)

#### Get OHLCV by Pair Address

Get the OHLCV candle stick by using pair address.

▶️ [Get OHLCV by Pair Address](https://ide.bitquery.io/OHLC--base)

#### Get Price Change 5min, 1h, 6h and 24h of a specific token

This query gets you Price Change 5min, 1h, 6h and 24h of a specific token on the Base network.

▶️ [Get Price Change 5min, 1h, 6h and 24h of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-precentage-of-a-specific-token_6)

#### Top 10 Base Tokens by Price Change in last 1h

This query gets you top 10 Base Tokens by Price Change in last 1h.

▶️ [Top 10 Base Tokens by Price Change in last 1h](https://ide.bitquery.io/Top-10-base-tokens-by-price-change-in-last-1-hr_1)

#### OHLC-of-AERO-Coin

OHLC-of-AERO-Coin. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [OHLC-of-AERO-Coin](https://ide.bitquery.io/OHLC-of-AERO-Coin_1)

#### Price change 5min, 1hr, 6hr, 24h precentage of a specific token

Price change 5min, 1hr, 6hr, 24h precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Price change 5min, 1hr, 6hr, 24h precentage of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-24h-precentage-of-a-specific-token)

#### Top 10 base tokens by price change in last 1 hr

Top 10 base tokens by price change in last 1 hr. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top 10 base tokens by price change in last 1 hr](https://ide.bitquery.io/Top-10-base-tokens-by-price-change-in-last-1-hr)

### Supply & Market Cap

#### Get Token Total Supply and Market Cap

Retrieve the total supply and market capitalization of a specific token. This query provides on-chain market cap data.

▶️ [Get Token Total Supply and Market Cap](https://ide.bitquery.io/Get-Token-Total-Supply-and-Market-Cap_5)

#### Top Tokens by Market Cap on Base

Top Tokens by Market Cap on Base. Uses the `Tokens` cube.

▶️ [Top Tokens by Market Cap on Base](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Base)

#### Total supply of a AERO on Base

Total supply of a AERO on Base. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Total supply of a AERO on Base](https://ide.bitquery.io/Total-supply-of-a-AERO-on-Base)

#### Bankr token latest marketcap OHLC

Bankr token latest marketcap OHLC. Uses the `Tokens` cube.

▶️ [Bankr token latest marketcap OHLC](https://ide.bitquery.io/Bankr-token-latest-marketcap-OHLC)

#### Total Supply and onchain Marketcap of a specific token base

Total Supply and onchain Marketcap of a specific token base. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Total Supply and onchain Marketcap of a specific token base](https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-base)

### Liquidity & Pools

#### Latest Liquidity of Base Pool

Get the latest liquidity of an Base DEX pool (e.g., Uniswap v3 pool).

▶️ [Latest Liquidity of Base Pool](https://ide.bitquery.io/latest-liquidity-of-a-Base-pool_2)

#### Latest Slippage for a Specific Pool

This query retrieves the latest slippage data for a specific DEX pool on Base. Use this to check current liquidity depth and price impact for a particular token pair.

▶️ [Latest Slippage for a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_7)

#### Latest Liquidity Changes of a Specific Pool

Latest Liquidity Changes of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_4)

#### Latest Liquidity Pools on Aerodome

Latest Liquidity Pools on Aerodome. Uses the `Events` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Latest Liquidity Pools on Aerodome](https://ide.bitquery.io/Latest-Liquidity-Pools-on-Aerodome)

#### Top liquidity pools of cbBTC

Top liquidity pools of cbBTC. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Top liquidity pools of cbBTC](https://ide.bitquery.io/top-liquidity-pools-of-cbBTC)

#### Latest liquidity of a base pool

Latest liquidity of a base pool. Uses the `TransactionBalances` cube. Replace the address in the `where` clause to use it.

▶️ [Latest liquidity of a base pool](https://ide.bitquery.io/latest-liquidity-of-a-base-pool)

### Transactions

#### Get transactions by wallet

Get transactions ordered by block number in descending order.

▶️ [Get transactions by wallet](https://ide.bitquery.io/Get-transactions-by-wallet_8)

#### Latest gauge vaults claimRewards transactions

Latest gauge vaults claimRewards transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest gauge vaults claimRewards transactions](https://ide.bitquery.io/latest-gauge-vaults-claimRewards-transactions)

#### Latest gauge vaults deposits transactions

Latest gauge vaults deposits transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest gauge vaults deposits transactions](https://ide.bitquery.io/latest-gauge-vaults-deposits-transactions)

#### Latest gauge vaults withdraw transactions

Latest gauge vaults withdraw transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest gauge vaults withdraw transactions](https://ide.bitquery.io/latest-gauge-vaults-withdraw-transactions_1)

### Events & Calls

#### Get Latest Calls

Get Latest Calls. Uses the `Calls` cube.

▶️ [Get Latest Calls](https://ide.bitquery.io/Recent-Calls-on-base_1)

#### Get Latest Events

Get Latest Events. Uses the `Events` cube.

▶️ [Get Latest Events](https://ide.bitquery.io/Recents-Events-and-Logs-on-Base)

#### Latest Bankr launches Doppler Airlock Base

Latest Bankr launches Doppler Airlock Base. Uses the `Events` cube.

▶️ [Latest Bankr launches Doppler Airlock Base](https://ide.bitquery.io/Latest-Bankr-launches-Doppler-Airlock-Base)

#### All bankers tokens created by a deployer

All bankers tokens created by a deployer. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [All bankers tokens created by a deployer](https://ide.bitquery.io/All-bankers-tokens-created-by-a-deployer)

#### Ape store buys from a wallet

Ape store buys from a wallet. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape store buys from a wallet](https://ide.bitquery.io/ape-store-buys-from-a-wallet)

#### Ape store token event

Ape store token event. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Ape store token event](https://ide.bitquery.io/ape-store-token-event_1)

#### Ape-store-buys

Ape-store-buys. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Ape-store-buys](https://ide.bitquery.io/ape-store-buys_1)

#### Base jump token event

Base jump token event. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Base jump token event](https://ide.bitquery.io/base-jump-token-event)

#### Base-jump-buys

Base-jump-buys. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Base-jump-buys](https://ide.bitquery.io/base-jump-buys)

#### Latest Coin on Base Coin

Latest Coin on Base Coin. Uses the `Calls` cube.

▶️ [Latest Coin on Base Coin](https://ide.bitquery.io/Latest-Coin-on-Base-Coin_3)

### Blocks & Validators

#### Aggregate Self Destruct Statistics base

Aggregate Self Destruct Statistics base. Uses the `TransactionBalances` cube.

▶️ [Aggregate Self Destruct Statistics base](https://ide.bitquery.io/Aggregate-Self-Destruct-Statistics-base)

#### Self Destruct Balance Decrease API base

Self Destruct Balance Decrease API base. Uses the `TransactionBalances` cube.

▶️ [Self Destruct Balance Decrease API base](https://ide.bitquery.io/Self-Destruct-Balance-Decrease-API-base)

#### Self Destruct Balance Increase API base

Self Destruct Balance Increase API base. Uses the `TransactionBalances` cube.

▶️ [Self Destruct Balance Increase API base](https://ide.bitquery.io/Self-Destruct-Balance-Increase-API-base)

### Uniswap

#### Uniswap Trades Stream

This subscription returns the real-time trades happening on Uniswap. You can modify the stream to get real-time trades for a particular token, a particular token pair and even a particular trader.

▶️ [Uniswap Trades Stream](https://ide.bitquery.io/Realtime-Uniswap-v1-Uniswap-v2-Uniswap-V3-Trades_1)

#### Get metadata for base uniswap token

Get metadata for base uniswap token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get metadata for base uniswap token](https://ide.bitquery.io/get-metadata-for-base-uniswap-token)

#### Latest slippage of a pool on Uniswap v3

Latest slippage of a pool on Uniswap v3. Change the token address in the `where` clause to use it.

▶️ [Latest slippage of a pool on Uniswap v3](https://ide.bitquery.io/Latest-slippage-of-a-pool-on-Uniswap-v3)

#### OHLC on BASE Uniswap v3

OHLC on BASE Uniswap v3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [OHLC on BASE Uniswap v3](https://ide.bitquery.io/OHLC-on-BASE-Uniswap-v3)

#### Top bought tokens on uniswap v3

Top bought tokens on uniswap v3. Uses the `DEXTradeByTokens` cube.

▶️ [Top bought tokens on uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-uniswap-v3)

#### Top sold tokens on uniswap v3

Top sold tokens on uniswap v3. Uses the `DEXTradeByTokens` cube.

▶️ [Top sold tokens on uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-uniswap-v3)

### PancakeSwap

#### Get Latest Price of a token on PancakeSwap Infinity

Get Latest Price of a token on PancakeSwap Infinity. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get Latest Price of a token on PancakeSwap Infinity](https://ide.bitquery.io/Get-Latest-Price-of-a-token-on-PancakeSwap-Infinity)

#### Pancakeswap infinity trades

Pancakeswap infinity trades. Uses the `DEXTrades` cube.

▶️ [Pancakeswap infinity trades](https://ide.bitquery.io/pancakeswap-infinity-trades)

#### Top bought tokens on pancakeswap_infinity

Top bought tokens on pancakeswap_infinity. Uses the `DEXTradeByTokens` cube.

▶️ [Top bought tokens on pancakeswap_infinity](https://ide.bitquery.io/top-bought-tokens-on-pancakeswap_infinity)

#### Top sold tokens on pancake infinty

Top sold tokens on pancake infinty. Uses the `DEXTradeByTokens` cube.

▶️ [Top sold tokens on pancake infinty](https://ide.bitquery.io/top-sold-tokens-on-pancake-infinty)

#### Get metadata for base pancakeswap infnity token

Get metadata for base pancakeswap infnity token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get metadata for base pancakeswap infnity token](https://ide.bitquery.io/get-metadata-for-base-pancakeswap-infnity-token)

#### OHLC on BASE pancakeswap infinity

OHLC on BASE pancakeswap infinity. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [OHLC on BASE pancakeswap infinity](https://ide.bitquery.io/OHLC-on-BASE-pancakeswap-infinity)

### Aerodrome

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge claimRewards Transactions

Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge claimRewards Transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge claimRewards Transactions](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-claimRewards-Transactions)

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge deposits

Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge deposits. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge deposits](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-deposits)

#### Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge withdraw transactions

Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge withdraw transactions. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Latest Aerodrome Finance: CL100-WETH/VVV Pool Gauge withdraw transactions](https://ide.bitquery.io/latest-Aerodrome-Finance-CL100-WETHVVV-Pool-Gauge-withdraw-transactions_1)

## Arbitrum

### Trades

#### Pair last trades

Pair last trades. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Pair last trades](https://ide.bitquery.io/Pair-last-trades_2)

#### Swap Events Arbitrum

Swap Events Arbitrum. Uses the `Events` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Swap Events Arbitrum](https://ide.bitquery.io/Swap-Events-Arbitrum)

#### Top Sold Tokens on Arbitrum

Top Sold Tokens on Arbitrum. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause.

▶️ [Top Sold Tokens on Arbitrum](https://ide.bitquery.io/Top-Sold-Tokens-on-Arbitrum)

#### Top bought tokens on Arbitrum

Top bought tokens on Arbitrum. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause.

▶️ [Top bought tokens on Arbitrum](https://ide.bitquery.io/top-bought-tokens-on-Arbitrum)

#### Top traders for a token on Arbitrum

Top traders for a token on Arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top traders for a token on Arbitrum](https://ide.bitquery.io/top-traders-for-a-token-on-Arbitrum_3)

#### Trending token pairs on Arbitrum

Trending token pairs on Arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Trending token pairs on Arbitrum](https://ide.bitquery.io/trending-token-pairs-on-Arbitrum)

### Balances & Holders

#### Arbitrum Balance of an Address

Arbitrum Balance of an Address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Arbitrum Balance of an Address](https://ide.bitquery.io/Arbitrum-Balance-of-an-Address)

#### Arbitrum balances by date

Arbitrum balances by date. Uses the `Balances` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Arbitrum balances by date](https://ide.bitquery.io/arbitrum-balances-by-date)

#### Arbitrum balances history

Arbitrum balances history. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Arbitrum balances history](https://ide.bitquery.io/arbitrum-balances-history)

#### Arbitrum balances specific token

Arbitrum balances specific token. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Arbitrum balances specific token](https://ide.bitquery.io/arbitrum-balances-specific-token)

#### Arbitrum native balances address

Arbitrum native balances address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Arbitrum native balances address](https://ide.bitquery.io/arbitrum-native-balances-address)

#### Token holder snapshot arbitrum

Token holder snapshot arbitrum. Uses the `Holders` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token holder snapshot arbitrum](https://ide.bitquery.io/token-holder-snapshot-arbitrum)

### Price & OHLC

#### Ohlc for a pair on Arbitrum

Ohlc for a pair on Arbitrum. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Ohlc for a pair on Arbitrum](https://ide.bitquery.io/ohlc-for-a-pair-on-Arbitrum_1)

#### Price change 5min, 1hr, 6hr, 24hr precentage of a specific token

Price change 5min, 1hr, 6hr, 24hr precentage of a specific token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Price change 5min, 1hr, 6hr, 24hr precentage of a specific token](https://ide.bitquery.io/Price-change-5min-1hr-6hr-24hr-precentage-of-a-specific-token_1)

#### Top 10 arb tokens by price change in last 1 hr

Top 10 arb tokens by price change in last 1 hr. Uses the `DEXTradeByTokens` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top 10 arb tokens by price change in last 1 hr](https://ide.bitquery.io/Top-10-arb-tokens-by-price-change-in-last-1-hr)

### Supply & Market Cap

#### Top Tokens by Market Cap on Arbitrum

Top Tokens by Market Cap on Arbitrum. Uses the `Tokens` cube.

▶️ [Top Tokens by Market Cap on Arbitrum](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Arbitrum)

### Liquidity & Pools

#### Latest liquidity changes of a specific pool

Latest liquidity changes of a specific pool. Uses the `DEXPoolEvents` cube. Change the token address in the `where` clause to use it.

▶️ [Latest liquidity changes of a specific pool](https://ide.bitquery.io/latest-liquidity-changes-of-a-specific-pool)

### Transactions

#### Latest Transactions

Latest Transactions. Uses the `Transactions` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Latest Transactions](https://ide.bitquery.io/Latest-Transactions_3)

#### Transaction Call Trace Arbitrum

Transaction Call Trace Arbitrum. Uses the `Calls` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Transaction Call Trace Arbitrum](https://ide.bitquery.io/Transaction-Call-Trace-Arbitrum)

### Events & Calls

#### Latest GMX Events

Latest GMX Events. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Latest GMX Events](https://ide.bitquery.io/latest-GMX-Events)

#### Latest vGLP Withdraw Events

Latest vGLP Withdraw Events. Uses the `Events` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Latest vGLP Withdraw Events](https://ide.bitquery.io/latest-vGLP-Withdraw-Events)

#### Latest deposits on Across Bridge

Latest deposits on Across Bridge. Uses the `Events` cube. Change the token address in the `where` clause to use it.

▶️ [Latest deposits on Across Bridge](https://ide.bitquery.io/Latest-deposits-on-Across-Bridge)

#### Latest vGLP Deposit Events

Latest vGLP Deposit Events. Uses the `Events` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Latest vGLP Deposit Events](https://ide.bitquery.io/latest-vGLP-Deposit-Events)

### Blocks & Validators

#### Latest Arbitrum blocks

Latest Arbitrum blocks. Uses the `Blocks` cube.

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

Top tokens on optimism. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause.

▶️ [Top tokens on optimism](https://ide.bitquery.io/top-tokens-on-optimism)

#### Top traders for wld usdc pair

Top traders for wld usdc pair. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top traders for wld usdc pair](https://ide.bitquery.io/top-traders-for-wld-usdc-pair)

#### Top traders on optimism

Top traders on optimism. Uses the `DEXTradeByTokens` cube. Adjust the date range in the `where` clause.

▶️ [Top traders on optimism](https://ide.bitquery.io/top-traders-on-optimism)

### Balances & Holders

#### Optimism Balance of an Address

Optimism Balance of an Address. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Optimism Balance of an Address](https://ide.bitquery.io/Optimism-Balance-of-an-Address)

#### Optimism balances by date

Optimism balances by date. Uses the `Balances` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Optimism balances by date](https://ide.bitquery.io/optimism-balances-by-date)

#### Optimism balances history address

Optimism balances history address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Optimism balances history address](https://ide.bitquery.io/optimism-balances-history-address)

#### Optimism balances specific token

Optimism balances specific token. Uses the `Balances` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Optimism balances specific token](https://ide.bitquery.io/optimism-balances-specific-token)

#### Optimism native balances address

Optimism native balances address. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Optimism native balances address](https://ide.bitquery.io/optimism-native-balances-address)

#### Token holder snapshot optimism

Token holder snapshot optimism. Uses the `Holders` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

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

## Polygon

### Trades

#### Top Traders by PnL of a specific polygon pool

Top Traders by PnL of a specific polygon pool. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [Top Traders by PnL of a specific polygon pool](https://ide.bitquery.io/Top-Traders-by-PnL-of-a-specific-polygon-pool)

#### Top traders of a token on matic

Top traders of a token on matic. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top traders of a token on matic](https://ide.bitquery.io/top-traders-of-a-token-on-matic_1)

### Transfers

#### Check if an address interacted with polymarket ever

Check if an address interacted with polymarket ever. Uses the `Transfers` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Check if an address interacted with polymarket ever](https://ide.bitquery.io/check-if-an-address-interacted-with-polymarket-ever)

### Balances & Holders

#### Balance of an address

Returns all token balances for a wallet on Polygon using `EVM.Balances` with `network: matic` and `dataset: combined`. See [Polygon Address Balance API](/docs/blockchain/Matic/matic-balance-api/#balance-of-an-address).

▶️ [Balance of an address](https://ide.bitquery.io/matic-balances-address_1)

#### Matic historical balances address

Returns all token balances for a wallet on Polygon using `EVM.Balances` with `network: matic` and `dataset: combined` until a particular period. For this example we will find the Balnce of the address one month ago.

▶️ [Matic historical balances address](https://ide.bitquery.io/matic-historical-balances-address_1)

#### Matic balances address

Matic balances address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Matic balances address](https://ide.bitquery.io/matic-balances-address)

#### Matic balances history

Matic balances history. Uses the `Balances` cube.

▶️ [Matic balances history](https://ide.bitquery.io/matic-balances-history)

#### Matic balances specific token

Matic balances specific token. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Matic balances specific token](https://ide.bitquery.io/matic-balances-specific-token)

#### Matic native balances address

Matic native balances address. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Matic native balances address](https://ide.bitquery.io/matic-native-balances-address)

#### Matic wallet balance token at date

Matic wallet balance token at date. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Matic wallet balance token at date](https://ide.bitquery.io/matic-wallet-balance-token-at-date)

#### Token holder snapshot matic

Token holder snapshot matic. Uses the `Holders` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token holder snapshot matic](https://ide.bitquery.io/token-holder-snapshot-matic)

### Supply & Market Cap

#### Top Tokens by Market Cap on Polygon

Top Tokens by Market Cap on Polygon. Uses the `Tokens` cube.

▶️ [Top Tokens by Market Cap on Polygon](https://ide.bitquery.io/Top-Tokens-by-Market-Cap-on-Polygon_1)

### Liquidity & Pools

#### Latest Liquidity Changes of a Specific Pool

Latest Liquidity Changes of a Specific Pool. Uses the `DEXPoolEvents` cube.

▶️ [Latest Liquidity Changes of a Specific Pool](https://ide.bitquery.io/Latest-Liquidity-Changes-of-a-Specific-Pool_6)

### Uniswap

#### Get virtual pool address for a token on uniswap v4 matic

Get virtual pool address for a token on uniswap v4 matic. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Get virtual pool address for a token on uniswap v4 matic](https://ide.bitquery.io/get-virtual-pool-address-for-a-token-on-uniswap-v4-matic)

#### OHLCV on MATIC uniswap v3

OHLCV on MATIC uniswap v3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [OHLCV on MATIC uniswap v3](https://ide.bitquery.io/OHLCV-on-MATIC-uniswap-v3)

#### Top bought tokens on matic uniswap v3

Top bought tokens on matic uniswap v3. Uses the `DEXTradeByTokens` cube.

▶️ [Top bought tokens on matic uniswap v3](https://ide.bitquery.io/top-bought-tokens-on-matic-uniswap-v3_4)

#### Top sold tokens on matic uniswap v3

Top sold tokens on matic uniswap v3. Uses the `DEXTradeByTokens` cube.

▶️ [Top sold tokens on matic uniswap v3](https://ide.bitquery.io/top-sold-tokens-on-matic-uniswap-v3)

#### Top traders of a token on uniswapv3 matic

Top traders of a token on uniswapv3 matic. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Top traders of a token on uniswapv3 matic](https://ide.bitquery.io/top-traders-of-a-token-on-uniswapv3-matic)

#### Trade volume matic uniswapv3

Trade volume matic uniswapv3. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Trade volume matic uniswapv3](https://ide.bitquery.io/trade_volume_matic_uniswapv3)

## TRON

### Trades

#### Historical Tron Token Trades beyond 30 Days

This query returns the historical token trades on the TRON network for time window beyond 30 days.

▶️ [Historical Tron Token Trades beyond 30 Days](https://ide.bitquery.io/Historical-tron-token-trades-beyond-30-days)

#### Historical Tron Token Trades within 30 Days

This query returns the historical trades on the TRON network for a token with the time window of past 30 days.

▶️ [Historical Tron Token Trades within 30 Days](https://ide.bitquery.io/Historical-Tron-trades-for-a-token-within-30-days)

#### Tron DEX Trades

This query returns the latest trades on the TRON network from a trader perspective.

▶️ [Tron DEX Trades](https://ide.bitquery.io/Tron-Trades)

#### Tron Dex Trade By Tokens

This query returns the latest token trades on the TRON network.

▶️ [Tron Dex Trade By Tokens](https://ide.bitquery.io/Tron-trades-for-a-token)

#### All dexs info

All dexs info.

▶️ [All dexs info](https://ide.bitquery.io/all-dexs-info)

#### DEX Markets for a token

DEX Markets for a token. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [DEX Markets for a token](https://ide.bitquery.io/DEX-Markets-for-a-token_1)

#### First 100 buyers tron token

First 100 buyers tron token. Uses the `DEXTradeByTokens` cube.

▶️ [First 100 buyers tron token](https://ide.bitquery.io/first-100-buyers-tron-token)

#### Peg health tron

Peg health tron. Uses the `DEXTradeByTokens` cube. Change the token address in the `where` clause to use it.

▶️ [Peg health tron](https://ide.bitquery.io/peg-health-tron)

#### Sunmpump launchtoDEX

Sunmpump launchtoDEX. Uses the `Calls` cube. Replace the address in the `where` clause to use it.

▶️ [Sunmpump launchtoDEX](https://ide.bitquery.io/sunmpump-launchtoDEX_1)

#### Sunswap v2 latest Trades

Sunswap v2 latest Trades. Uses the `DEXTrades` cube. Replace the address in the `where` clause to use it.

▶️ [Sunswap v2 latest Trades](https://ide.bitquery.io/sunswap-v2-latest-Trades)

### Transfers

#### Historical TRON Transfers for a Wallet

This query returns the historical transfers for a wallet in a given time window on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.

▶️ [Historical TRON Transfers for a Wallet](https://ide.bitquery.io/Historical-Tron-transfers-for-a-wallet)

#### Latest TRON Transfers

This query returns the most recent transfers on the TRON network and includes details such as token amount transferred, sender, receiver, and token info.

▶️ [Latest TRON Transfers](https://ide.bitquery.io/Tron-transfer_10_1)

#### Daily transfer volume tron

Daily transfer volume tron. Uses the `Transfers` cube. Adjust the date range in the `where` clause.

▶️ [Daily transfer volume tron](https://ide.bitquery.io/daily-transfer-volume-tron)

#### Top transfers of a token

Top transfers of a token. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [Top transfers of a token](https://ide.bitquery.io/top-transfers-of-a-token_2)

#### Tron total txn fees paid by the Account

Tron total txn fees paid by the Account. Uses the `Transfers` cube.

▶️ [Tron total txn fees paid by the Account](https://ide.bitquery.io/Tron-total-txn-fees-paid-by-the-Account)

#### Transfers of a wallet API

Transfers of a wallet API. Uses the `Transfers` cube.

▶️ [Transfers of a wallet API](https://ide.bitquery.io/Transfers-of-a-wallet-API)

#### Tron Transaction fees paid by Account aggregated by currency

Tron Transaction fees paid by Account aggregated by currency. Uses the `Transfers` cube.

▶️ [Tron Transaction fees paid by Account aggregated by currency](https://ide.bitquery.io/Tron-Transaction-fees-paid-by-Account-aggregated-by-currency)

#### Tron wallet transfers with transaction fees paid

Tron wallet transfers with transaction fees paid. Uses the `Transfers` cube.

▶️ [Tron wallet transfers with transaction fees paid](https://ide.bitquery.io/tron-wallet-transfers-with-transaction-fees-paid)

### Balances & Holders

#### Historical Balance of a Wallet for a Currency

This query returns the current balance of a wallet for all currencies on the TRON network.

▶️ [Historical Balance of a Wallet for a Currency](https://ide.bitquery.io/Historical-Tron-Wallet-Balance-for-a-currency)

#### Top token holders of a token

Top token holders of a token. Uses the `Holders` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Top token holders of a token](https://ide.bitquery.io/top-token-holders-of-a-token)

#### Tron Balances for Native currency

Tron Balances for Native currency. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Tron Balances for Native currency](https://ide.bitquery.io/Tron-Balances-for-Native-currency)

#### Tron USDT Balance At Date (Balances Cube)

Tron USDT Balance At Date (Balances Cube). Uses the `Balances` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Tron USDT Balance At Date (Balances Cube)](https://ide.bitquery.io/tron-usdt-balance-at-date)

#### Tron balances by date

Tron balances by date. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Tron balances by date](https://ide.bitquery.io/tron-balances-by-date)

#### Tron token balance

Tron token balance. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Tron token balance](https://ide.bitquery.io/tron-token-balance)

#### TronWalletPortfolio Tron

TronWalletPortfolio Tron. Uses the `Balances` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [TronWalletPortfolio Tron](https://ide.bitquery.io/TronWalletPortfolio-Tron)

#### SunPump Bonding Curve TRX Balance

SunPump Bonding Curve TRX Balance. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [SunPump Bonding Curve TRX Balance](https://ide.bitquery.io/SunPump-Bonding-Curve-TRX-Balance)

#### SunPump Historical Bonding Curve TRX Balance

SunPump Historical Bonding Curve TRX Balance. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [SunPump Historical Bonding Curve TRX Balance](https://ide.bitquery.io/SunPump-Historical-Bonding-Curve-TRX-Balance)

### Liquidity & Pools

#### Sun Pump Virtual Liquidity Pools

Sun Pump Virtual Liquidity Pools. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Sun Pump Virtual Liquidity Pools](https://ide.bitquery.io/Sun-Pump-Virtual-Liquidity-Pools_1)

### Events & Calls

#### Latest created Sunpump tokens

Latest created Sunpump tokens. Uses the `Events` cube.

▶️ [Latest created Sunpump tokens](https://ide.bitquery.io/latest-created-Sunpump-tokens)

#### Latest tokens created on Sunpump

Latest tokens created on Sunpump. Uses the `Events` cube.

▶️ [Latest tokens created on Sunpump](https://ide.bitquery.io/Latest-tokens-created-on-Sunpump_2)

#### TokenPurchased on Sunpump

TokenPurchased on Sunpump. Uses the `Events` cube.

▶️ [TokenPurchased on Sunpump](https://ide.bitquery.io/TokenPurchased-on-Sunpump)

## Robinhood Chain

### Trades

#### Largest Trades on Robinhood Chain (24h, USD)

Largest Trades on Robinhood Chain (24h, USD). Uses the `Trades` cube.

▶️ [Largest Trades on Robinhood Chain (24h, USD)](https://ide.bitquery.io/largest-swaps-robinhood-chain)

#### Pools trade Crowd Launch bids

Pools trade Crowd Launch bids. Uses the `Events` cube.

▶️ [Pools trade Crowd Launch bids](https://ide.bitquery.io/Pools-trade-Crowd-Launch-bids)

#### Pools trade Latest launches

Pools trade Latest launches. Uses the `Events` cube.

▶️ [Pools trade Latest launches](https://ide.bitquery.io/Pools-trade-Latest-launches)

#### Pools trade Latest trades for a token

Pools trade Latest trades for a token. Uses the `Trades` cube. Replace the address in the `where` clause to use it.

▶️ [Pools trade Latest trades for a token](https://ide.bitquery.io/Pools-trade-Latest-trades-for-a-token)

#### Pools trade Launches per day

Pools trade Launches per day. Uses the `Events` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Pools trade Launches per day](https://ide.bitquery.io/Pools-trade-Launches-per-day)

#### Pools trade Most active token creators

Pools trade Most active token creators. Uses the `Events` cube. Adjust the date range in the `where` clause. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Pools trade Most active token creators](https://ide.bitquery.io/Pools-trade-Most-active-token-creators)

#### Pools trade PoolKey from TokenLaunched

Pools trade PoolKey from TokenLaunched. Uses the `Events` cube.

▶️ [Pools trade PoolKey from TokenLaunched](https://ide.bitquery.io/Pools-trade-PoolKey-from-TokenLaunched)

#### Pools trade Token description and image

Pools trade Token description and image. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Pools trade Token description and image](https://ide.bitquery.io/Pools-trade-Token-description-and-image)

#### Pools trade TokenDistributed decoded event

Pools trade TokenDistributed decoded event. Uses the `Events` cube.

▶️ [Pools trade TokenDistributed decoded event](https://ide.bitquery.io/Pools-trade-raw-event-by-topic0)

#### Pools trade Top tokens by volume

Pools trade Top tokens by volume. Uses the `Tokens` cube. Adjust the date range in the `where` clause.

▶️ [Pools trade Top tokens by volume](https://ide.bitquery.io/Pools-trade-Top-tokens-by-volume)

### Transfers

#### Ape.store Newly created tokens

Ape.store Newly created tokens. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Ape.store Newly created tokens](https://ide.bitquery.io/Apestore-Newly-created-tokens)

#### Bags.fm Newly created tokens

Bags.fm Newly created tokens. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Bags.fm Newly created tokens](https://ide.bitquery.io/Bagsfm-Newly-created-tokens)

#### Bankr Bot Newly created tokens

Bankr Bot Newly created tokens. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Bankr Bot Newly created tokens](https://ide.bitquery.io/Bankr-Bot-Newly-created-tokens)

#### Flap.sh Newly created tokens using transfer data

Flap.sh Newly created tokens using transfer data. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Flap.sh Newly created tokens using transfer data](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-transfer-data)

#### Klik Finance Newly created tokens using transfers

Klik Finance Newly created tokens using transfers. Uses the `Transfers` cube. Replace the address in the `where` clause to use it.

▶️ [Klik Finance Newly created tokens using transfers](https://ide.bitquery.io/Klik-Finance-Newly-created-tokens-using-transfers)

#### Robinhood Chain API - Latest Token Transfers

Robinhood Chain API - Latest Token Transfers. Uses the `Transfers` cube.

▶️ [Robinhood Chain API - Latest Token Transfers](https://ide.bitquery.io/latest-transfers-on-robinhood)

#### Robinhood Chain Token Lookup by Contract Address

Robinhood Chain Token Lookup by Contract Address. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Robinhood Chain Token Lookup by Contract Address](https://ide.bitquery.io/Pools-trade-Token-name-symbol-decimals)

#### Token Lookup by Contract Address - Robinhood Chain

Token Lookup by Contract Address - Robinhood Chain. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Token Lookup by Contract Address - Robinhood Chain](https://ide.bitquery.io/token-lookup-by-address-robinhood-chain)

#### Transfers for a token on robinhood

Transfers for a token on robinhood. Uses the `Transfers` cube.

▶️ [Transfers for a token on robinhood](https://ide.bitquery.io/Transfers-for-a-token-on-robinhood)

#### Transfers for a wallet on Robinhood

Transfers for a wallet on Robinhood. Uses the `Transfers` cube.

▶️ [Transfers for a wallet on Robinhood](https://ide.bitquery.io/transfers-for-a-wallet-on-Robinhood)

### Balances & Holders

#### Pools trade Per-transaction balance changes

Pools trade Per-transaction balance changes. Uses the `TransactionBalances` cube. Change the token address in the `where` clause to use it.

▶️ [Pools trade Per-transaction balance changes](https://ide.bitquery.io/Pools-trade-Per-transaction-balance-changes)

#### Wallet Token Balances on Robinhood Chain

Wallet Token Balances on Robinhood Chain. Uses the `Balances` cube. Replace the address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Wallet Token Balances on Robinhood Chain](https://ide.bitquery.io/wallet-token-balances-robinhood-chain)

### Price & OHLC

#### Latest price of a token

Latest price of a token. Uses the `Tokens` cube. Replace the address in the `where` clause to use it.

▶️ [Latest price of a token](https://ide.bitquery.io/latest-price-of-a-token_10)

#### Latest price of a token on a pool

Latest price of a token on a pool. Uses the `Pairs` cube.

▶️ [Latest price of a token on a pool](https://ide.bitquery.io/latest-price-of-a-token-on-a-pool)

#### Pools trade OHLCV price candles

Pools trade OHLCV price candles. Uses the `Tokens` cube. Replace the address in the `where` clause to use it.

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

Pools trade Pool creation Initialize. Uses the `Events` cube. Replace the address in the `where` clause to use it.

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

All events from Flap.sh. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [All events from Flap.sh](https://ide.bitquery.io/All-events-from-Flapsh)

#### Flap.sh Newly created tokens using logs TokenCreated

Flap.sh Newly created tokens using logs TokenCreated. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Flap.sh Newly created tokens using logs TokenCreated](https://ide.bitquery.io/Flapsh-Newly-created-tokens-using-logs-TokenCreated)

#### New Contracts Deployed on Robinhood Chain

New Contracts Deployed on Robinhood Chain. Uses the `Calls` cube. Needs the historical data add-on — see the comment at the top of the query.

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

Uniswap v4 Pool Liquidity on Robinhood Chain (pools.trade). Uses the `DEXPoolEvents` cube.

▶️ [Uniswap v4 Pool Liquidity on Robinhood Chain (pools.trade)](https://ide.bitquery.io/Pools-trade-Live-pool-liquidity)

## Bitcoin

### Transfers

#### Inflows and Outflows of a wallet

This API returns all incoming and outgoing transactions for a specific Bitcoin wallet address.

▶️ [Inflows and Outflows of a wallet](https://ide.bitquery.io/Inflows-and-Outflow-of-a-bitcoin-wallet)

### Balances & Holders

#### Bitcoin Balance for multiple addresses

This query calculates the combined balance of multiple Bitcoin wallet addresses by summing their total inflows and outflows: Balance = Total Output - Total Input. You can also set a date to get balances as of a specific point in time.

▶️ [Bitcoin Balance for multiple addresses](https://ide.bitquery.io/BTC-balance-api-for-multiple-addresses)

#### BTC balance api for multiple addresses

BTC balance api for multiple addresses.

▶️ [BTC balance api for multiple addresses](https://ide.bitquery.io/BTC-balance-API-for-multiple-addresses)

#### Bitcoin balance

Bitcoin balance.

▶️ [Bitcoin balance](https://ide.bitquery.io/Bitcoin-balance_5)

#### Bitcoin balance at a given height

Bitcoin balance at a given height. Replace the address in the `where` clause to use it.

▶️ [Bitcoin balance at a given height](https://ide.bitquery.io/bitcoin-balance-at-a-given-height)

#### Bitcoin balance on a given block height

Bitcoin balance on a given block height. Replace the address in the `where` clause to use it.

▶️ [Bitcoin balance on a given block height](https://ide.bitquery.io/bitcoin-balance-on-a-given-block-height)

### Price & OHLC

#### Btc price in 2016

Btc price in 2016.

▶️ [Btc price in 2016](https://ide.bitquery.io/btc-price-in-2016)

### Transactions

#### Details of Bitcoin Transaction

This API provides comprehensive details of a specific Bitcoin transaction in a single query.

▶️ [Details of Bitcoin Transaction](https://ide.bitquery.io/Details-of-Bitcoin-Transaction)

### Blocks & Validators

#### Bitcoin miners rewards

Bitcoin miners rewards. Adjust the date range in the `where` clause.

▶️ [Bitcoin miners rewards](https://ide.bitquery.io/bitcoin-miners-rewards)

#### Get miners activity in a specific timeframe

Get miners activity in a specific timeframe. Adjust the date range in the `where` clause.

▶️ [Get miners activity in a specific timeframe](https://ide.bitquery.io/get-miners-activity-in-a-specific-timeframe)

#### Get miners first activity

Get miners first activity.

▶️ [Get miners first activity](https://ide.bitquery.io/get-miners-first-activity)

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

## Algorand

### Transfers

#### All the transfers of an asset on Algorand Mainnet in a specific timeframe

All the transfers of an asset on Algorand Mainnet in a specific timeframe. Adjust the date range in the `where` clause.

▶️ [All the transfers of an asset on Algorand Mainnet in a specific timeframe](https://ide.bitquery.io/All-the-transfers-of-an-asset-on-Algorand-Mainnet-in-a-specific-timeframe)

#### Traansfers where a currency is sent from or sent to a particular address

Traansfers where a currency is sent from or sent to a particular address. Adjust the date range in the `where` clause.

▶️ [Traansfers where a currency is sent from or sent to a particular address](https://ide.bitquery.io/traansfers-where-a-currency-is-sent-from-or-sent-to-a-particular-address)

### Price & OHLC

#### Get Count of Smart Contract Calls in Latest Block

Get Count of Smart Contract Calls in Latest Block.

▶️ [Get Count of Smart Contract Calls in Latest Block](https://ide.bitquery.io/Get-Count-of-Smart-Contract-Calls-in-Latest-Block_1)

### Transactions

#### All Transactions on Algorand

All Transactions on Algorand. Adjust the date range in the `where` clause.

▶️ [All Transactions on Algorand](https://ide.bitquery.io/All-Transactions-on-Algorand)

#### Daily Transaction Count for last 10 days

Daily Transaction Count for last 10 days.

▶️ [Daily Transaction Count for last 10 days](https://ide.bitquery.io/Daily-Transaction-Count-for-last-10-days)

#### Daily Unique Txn Senders on algorand

Daily Unique Txn Senders on algorand.

▶️ [Daily Unique Txn Senders on algorand](https://ide.bitquery.io/Daily-Unique-Txn-Senders-on-algorand)

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

#### Historical Bitcoin OHLC data for the last 7 days

Historical Bitcoin OHLC data for the last 7 days. Uses the `Currencies` cube.

▶️ [Historical Bitcoin OHLC data for the last 7 days](https://ide.bitquery.io/historical-Bitcoin-OHLC-data-for-the-last-7-days)

#### OHLC of a currency on multiple blockchains

OHLC of a currency on multiple blockchains. Uses the `Currencies` cube.

▶️ [OHLC of a currency on multiple blockchains](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains)

### Supply & Market Cap

#### Marketcap of pump token

Marketcap of pump token. Uses the `Tokens` cube. Replace the address in the `where` clause to use it.

▶️ [Marketcap of pump token](https://ide.bitquery.io/marketcap-of-pump-token)

#### Tokens ranked by market cap

Tokens ranked by market cap. Uses the `Trades` cube.

▶️ [Tokens ranked by market cap](https://ide.bitquery.io/Tokens-ranked-by-market-cap_1)

## Stablecoins

### Trades

#### Solana USDT trades query

Solana USDT trades query. Uses the `DEXTrades` cube. Change the token address in the `where` clause to use it.

▶️ [Solana USDT trades query](https://ide.bitquery.io/solana-USDT-trades-query)

### Transfers

#### Latest Tron USDT Transfers

Latest Tron USDT Transfers. Uses the `Transfers` cube.

▶️ [Latest Tron USDT Transfers](https://ide.bitquery.io/Latest-Tron-USDT-Transfers)

#### Latest USDT/USDC Transfer api on base

Latest USDT/USDC Transfer api on base. Uses the `Transfers` cube.

▶️ [Latest USDT/USDC Transfer api on base](https://ide.bitquery.io/Latest-USDTUSDC-Transfer-api-on-base)

#### Latest USDT/USDC Transfer api on ethereum

Latest USDT/USDC Transfer api on ethereum. Uses the `Transfers` cube.

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

USDT token Transfers api on solana. Uses the `Transfers` cube. Change the token address in the `where` clause to use it.

▶️ [USDT token Transfers api on solana](https://ide.bitquery.io/USDT-token-Transfers-api-on-solana)

### Price & OHLC

#### 5 minute price change stablecoin API

5 minute price change stablecoin API. Uses the `Tokens` cube.

▶️ [5 minute price change stablecoin API](https://ide.bitquery.io/5-minute-price-change-stablecoin-API)

#### Stablecoin price query of USDT

Stablecoin price query of USDT. Uses the `Tokens` cube.

▶️ [Stablecoin price query of USDT](https://ide.bitquery.io/stablecoin-price-query-of-USDT_1)

#### Usdt latest price arbitrage

Usdt latest price arbitrage. Uses the `Tokens` cube.

▶️ [Usdt latest price arbitrage](https://ide.bitquery.io/usdt-latest-price-arbitrage)

### Supply & Market Cap

#### USDC Stablecoin reserves on Solana

USDC Stablecoin reserves on Solana. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDC Stablecoin reserves on Solana](https://ide.bitquery.io/USDC-Stablecoin-reserves-on-Solana)

#### USDT Stablecoin reserves on Solana query

USDT Stablecoin reserves on Solana query. Uses the `TokenSupplyUpdates` cube. Change the token address in the `where` clause to use it.

▶️ [USDT Stablecoin reserves on Solana query](https://ide.bitquery.io/USDT-Stablecoin-reserves-on-Solana--query)

## Perpetuals

### Trades

#### Hyperliquid BTC Perp Trades

Hyperliquid BTC Perp Trades. Uses the `Trades` cube.

▶️ [Hyperliquid BTC Perp Trades](https://ide.bitquery.io/hyperliquid-btc-perp-trades)

#### Hyperliquid Latest Trades (Perps + Spot + HIP-3)

Hyperliquid Latest Trades (Perps + Spot + HIP-3). Uses the `Trades` cube.

▶️ [Hyperliquid Latest Trades (Perps + Spot + HIP-3)](https://ide.bitquery.io/hyperliquid-latest-trades)

#### Hyperliquid Trader Leverage Updates

Hyperliquid Trader Leverage Updates.

▶️ [Hyperliquid Trader Leverage Updates](https://ide.bitquery.io/hyperliquid-leverage-updates)

#### Phoenix Perps Fills by Trader Wallet - Solana

Phoenix Perps Fills by Trader Wallet - Solana.

▶️ [Phoenix Perps Fills by Trader Wallet - Solana](https://ide.bitquery.io/sol_perps_filled_orders_by_signer)

#### Trader Realized PnL on Solana Perps

Trader Realized PnL on Solana Perps.

▶️ [Trader Realized PnL on Solana Perps](https://ide.bitquery.io/solana-perps-trader-pnl)

#### Whale Trades on Solana Perps (Phoenix)

Whale Trades on Solana Perps (Phoenix).

▶️ [Whale Trades on Solana Perps (Phoenix)](https://ide.bitquery.io/solana-perps-whale-trades)

### Price & OHLC

#### Hyperliquid BTC OHLCV Candles (1 minute)

Hyperliquid BTC OHLCV Candles (1 minute).

▶️ [Hyperliquid BTC OHLCV Candles (1 minute)](https://ide.bitquery.io/hyperliquid-btc-ohlcv-candles)

#### Hyperliquid Mark Prices (All Markets)

Hyperliquid Mark Prices (All Markets).

▶️ [Hyperliquid Mark Prices (All Markets)](https://ide.bitquery.io/hyperliquid-mark-prices)

#### Solana Perps OHLC Candles from Mark Price

Solana Perps OHLC Candles from Mark Price.

▶️ [Solana Perps OHLC Candles from Mark Price](https://ide.bitquery.io/solana-perps-ohlc-candles)

## NFTs

### Trades

#### Get NFT trades for a specific NFT contract on specific marketplace

Get trades of NFTs for a given contract and marketplace.

▶️ [Get NFT trades for a specific NFT contract on specific marketplace](https://ide.bitquery.io/Get-NFT-trades-by-contract)

#### Get NFT trades for a specific NFT contract and token ID

Get trades of NFTs for a given contract and token ID.

▶️ [Get NFT trades for a specific NFT contract and token ID](https://ide.bitquery.io/Get-NFT-trades-by-token)

#### Get NFT trades by wallet

Get trades of NFTs for a given wallet.

▶️ [Get NFT trades by wallet](https://ide.bitquery.io/Get-trades-of-NFTs-for-a-given-wallet)

#### Latest NFT Trades

This query gets the latest 10 NFT trades on Ethereum mainnet. You can increase the limit to whatever you like, up to 25,000. Currently, it only retrieves data from the real-time database. To include historical data, use `dataset: combined`.

▶️ [Latest NFT Trades](https://ide.bitquery.io/Latest-NFT-trades-on-ETH)

#### Top Traded NFTs in a Period

This query gets the top 10 traded NFTs based on the number of trades within a specified date range. You can change the filters such as the date range and limit.

▶️ [Top Traded NFTs in a Period](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month)

#### Latests OpenSea Trades

Latests OpenSea Trades.

▶️ [Latests OpenSea Trades](https://ide.bitquery.io/Latests-OpenSea-Trades)

#### Latest NFT trades on Ethereum network

Latest NFT trades on Ethereum network.

▶️ [Latest NFT trades on Ethereum network](https://ide.bitquery.io/latest-NFT-trades-on-Ethereum-network)

#### Pairs of blur token new dataset

Pairs of blur token new dataset.

▶️ [Pairs of blur token new dataset](https://ide.bitquery.io/pairs-of-blur-token-new-dataset_1)

#### New Uniswap v3 liquidity positions

Position NFTs as they are minted — who is adding liquidity to v3 pools, and to which pair.

▶️ [New Uniswap v3 liquidity positions](https://ide.bitquery.io/recent-uniswap-position-NFTs-mint_1)

#### NFT currencies on Solana by DEX'es

NFT currencies on Solana by DEX'es.

▶️ [NFT currencies on Solana by DEX'es](https://ide.bitquery.io/NFT-currencies-on-Solana-by-DEXes_1)

### Transfers

#### Get NFT transfers by wallet

Get transfers of NFTs given the wallet.

▶️ [Get NFT transfers by wallet](https://ide.bitquery.io/latest-nft-transfers-by-a-user)

#### All transfers of an NFT

All transfers of an NFT.

▶️ [All transfers of an NFT](https://ide.bitquery.io/All-transfers-of-an-NFT)

#### NFT Token Transfers By Date

NFT Token Transfers By Date.

▶️ [NFT Token Transfers By Date](https://ide.bitquery.io/NFT-Token-Transfers-By-Date)

#### Top transfered NFT tokens in network

Top transfered NFT tokens in network.

▶️ [Top transfered NFT tokens in network](https://ide.bitquery.io/Top-transfered-NFT-tokens-in-network)

#### Array_intersect example for NFT

Array_intersect example for NFT.

▶️ [Array_intersect example for NFT](https://ide.bitquery.io/array_intersect-example-for-NFT)

#### Get all transfers of a specific nft

Get all transfers of a specific nft.

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

Get NFT Balances for Multiple Addresses.

▶️ [Get NFT Balances for Multiple Addresses](https://ide.bitquery.io/Get-NFT-Balances-for-Multiple-Addresses_1)

#### Get NFT Ownership History

Get NFT Ownership History.

▶️ [Get NFT Ownership History](https://ide.bitquery.io/Get-NFT-Ownership-History_2)

### Price & OHLC

#### Smart contract calls to an nft contract

Smart contract calls to an nft contract.

▶️ [Smart contract calls to an nft contract](https://ide.bitquery.io/Smart-contract-calls-to-an-nft-contract)

### Events & Calls

#### All refinance loans for specific NFT collection

All refinance loans for specific NFT collection.

▶️ [All refinance loans for specific NFT collection](https://ide.bitquery.io/All-refinance-loans-for-specificNFT-collection)

#### Auction on blur marketplace

Auction on blur marketplace.

▶️ [Auction on blur marketplace](https://ide.bitquery.io/Auction-on-blur-marketplace)

#### Creator_of_an_NFT

Creator_of_an_NFT.

▶️ [Creator_of_an_NFT](https://ide.bitquery.io/Creator_of_an_NFT)

#### Latest Cancelled offers on Blur NFT marketplace

Latest Cancelled offers on Blur NFT marketplace.

▶️ [Latest Cancelled offers on Blur NFT marketplace](https://ide.bitquery.io/Latest-Cancelled-offers-on-Blur-NFT-marketplace)

#### Latest Loans for a specific borrower on Blur marketplace

Latest Loans for a specific borrower on Blur marketplace.

▶️ [Latest Loans for a specific borrower on Blur marketplace](https://ide.bitquery.io/Latest-Loans-for-a-specificborrower-on-Blur-marketplace)

#### Latest Seized NFTs on Blur marketplace

Latest Seized NFTs on Blur marketplace.

▶️ [Latest Seized NFTs on Blur marketplace](https://ide.bitquery.io/Latest-Seized-NFTs-on-Blur-marketplace)

#### Latest loans for specific NFT token

Latest loans for specific NFT token.

▶️ [Latest loans for specific NFT token](https://ide.bitquery.io/Latest-loans-for-specific-NFTtoken)

#### Loan history for specific NFT ID

Loan history for specific NFT ID.

▶️ [Loan history for specific NFT ID](https://ide.bitquery.io/Loan-history-for-specific-NFTID)

#### Loan repayment of blur marketplace

Loan repayment of blur marketplace.

▶️ [Loan repayment of blur marketplace](https://ide.bitquery.io/Loan-repayment-of-blur-marketplace)

#### Loans above a specific amount on the Blur NFT marketplace

Loans above a specific amount on the Blur NFT marketplace.

▶️ [Loans above a specific amount on the Blur NFT marketplace](https://ide.bitquery.io/Loans-above-a-specific-amount-on-the-Blur-NFT-marketplace)

#### Locked NFT bought on Blur marketplace

Locked NFT bought on Blur marketplace.

▶️ [Locked NFT bought on Blur marketplace](https://ide.bitquery.io/Locked-NFT-bought-on-Blur-marketplace)

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

How do I count trades for a specific Polymarket trader?. Replace the address in the `where` clause to use it.

▶️ [How do I count trades for a specific Polymarket trader?](https://ide.bitquery.io/How-do-I-count-trades-for-a-specific-Polymarket-trader)

#### How do I get top buyers and sellers on Polymarket by volume?

How do I get top buyers and sellers on Polymarket by volume?.

▶️ [How do I get top buyers and sellers on Polymarket by volume?](https://ide.bitquery.io/How-do-I-get-top-buyers-and-sellers-on-Polymarket-by-volume)

#### Latest prediction market trades

Latest prediction market trades.

▶️ [Latest prediction market trades](https://ide.bitquery.io/latest-prediction-market-trades)

#### Prediction_trades

Prediction_trades.

▶️ [Prediction_trades](https://ide.bitquery.io/prediction_trades)

#### Top 100 markets by volumein last24 hrs

Top 100 markets by volumein last24 hrs.

▶️ [Top 100 markets by volumein last24 hrs](https://ide.bitquery.io/top-100-markets-by-volumein-last24-hrs_1)

#### Top AI markets by volume Polymarket

Top AI markets by volume Polymarket.

▶️ [Top AI markets by volume Polymarket](https://ide.bitquery.io/Top-AI-markets-by-volume-Polymarket)

#### Top Buyers/Sellers of Bitcoin up down market

Top Buyers/Sellers of Bitcoin up down market.

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

Latest Prediction managements (resolutions, creations).

▶️ [Latest Prediction managements (resolutions, creations)](https://ide.bitquery.io/latest-Prediction-managements-resolutions-creations)

#### Latest polymarket creations

Latest polymarket creations.

▶️ [Latest polymarket creations](https://ide.bitquery.io/latest-polymarket-creations)

#### Latest polymarket resolutions

Latest polymarket resolutions.

▶️ [Latest polymarket resolutions](https://ide.bitquery.io/latest-polymarket-resolutions_1)

#### Latest resolved crudeoil markets

Latest resolved crudeoil markets.

▶️ [Latest resolved crudeoil markets](https://ide.bitquery.io/latest-resolved-crudeoil-markets)

#### Latest resolved sports markets

Latest resolved sports markets.

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

Latest prediction market settlements.

▶️ [Latest prediction market settlements](https://ide.bitquery.io/latest-prediction-market-settlements_2)

#### Latest whale settlements on prediction market

Latest whale settlements on prediction market.

▶️ [Latest whale settlements on prediction market](https://ide.bitquery.io/latest-whale-settlements-on-prediction-market_2)

#### Redemptions, merge, split count in last 1 hour

Redemptions, merge, split count in last 1 hour.

▶️ [Redemptions, merge, split count in last 1 hour](https://ide.bitquery.io/redemptions-merge-split-count-in-last-1-hour)

#### Top 10 redeemers

Top 10 redeemers.

▶️ [Top 10 redeemers](https://ide.bitquery.io/top-10-redeemers)

### Transfers

#### Freshwallet check for polymarket

Freshwallet check for polymarket. Uses the `Transfers` cube. Needs the historical data add-on — see the comment at the top of the query.

▶️ [Freshwallet check for polymarket](https://ide.bitquery.io/freshwallet-check-for-polymarket)

#### FundingSource for poylmarket

FundingSource for poylmarket. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [FundingSource for poylmarket](https://ide.bitquery.io/FundingSource-for-poylmarket)

#### SiblingWallets for polymarket

SiblingWallets for polymarket. Uses the `Transfers` cube. Change the token address in the `where` clause to use it. Needs the historical data add-on — see the comment at the top of the query.

▶️ [SiblingWallets for polymarket](https://ide.bitquery.io/SiblingWallets-for-polymarket)

### Balances & Holders

#### Polymarket TVL

Polymarket TVL. Uses the `TransactionBalances` cube.

▶️ [Polymarket TVL](https://ide.bitquery.io/Polymarket-TVL)

### Price & OHLC

#### Current Price per Outcome (Latest Trade)

Get the latest trade price for each outcome in a market. Uses `limitBy` for one row per outcome, with Price and PriceInUSD at the most recent block time.

▶️ [Current Price per Outcome (Latest Trade)](https://ide.bitquery.io/Current-price-inside-the-market-for-all-options-based-on-latest-trade_1)

#### Current price inside the market for all options based on latest trade

Current price inside the market for all options based on latest trade.

▶️ [Current price inside the market for all options based on latest trade](https://ide.bitquery.io/Current-price-inside-the-market-for-all-options-based-on-latest-trade)

#### Latest price of outcomes of a crude oil market

Latest price of outcomes of a crude oil market.

▶️ [Latest price of outcomes of a crude oil market](https://ide.bitquery.io/latest-price-of-outcomes-of-a-crude-oil-market)

#### OHLC of a outcome of a gold market

OHLC of a outcome of a gold market.

▶️ [OHLC of a outcome of a gold market](https://ide.bitquery.io/OHLC-of-a-outcome-of-a-gold-market)

#### Polymarket AI odds movement OHLC

Polymarket AI odds movement OHLC.

▶️ [Polymarket AI odds movement OHLC](https://ide.bitquery.io/Polymarket-AI-odds-movement-OHLC)

#### Polymarket sports odds movement OHLC

Polymarket sports odds movement OHLC.

▶️ [Polymarket sports odds movement OHLC](https://ide.bitquery.io/Polymarket-sports-odds-movement-OHLC)

### Liquidity & Pools

#### Top cricket Markets by Liquidity

Top cricket Markets by Liquidity.

▶️ [Top cricket Markets by Liquidity](https://ide.bitquery.io/Top-cricket-Markets-by-Liquidity)

#### Top FIFA World Cup Markets by Liquidity

Top FIFA World Cup Markets by Liquidity.

▶️ [Top FIFA World Cup Markets by Liquidity](https://ide.bitquery.io/Top-FIFA-World-Cup-Markets-by-Liquidity)

## Futures DEXs

### Trades

#### All events of AsterDEX

All events of AsterDEX. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [All events of AsterDEX](https://ide.bitquery.io/All-events-of-AsterDEX)

#### AsterDEX - All latest Liquidations

AsterDEX - All latest Liquidations. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [AsterDEX - All latest Liquidations](https://ide.bitquery.io/AsterDEX---All-latest-Liquidations)

#### AsterDEX - OpenMarketTrade

AsterDEX - OpenMarketTrade. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [AsterDEX - OpenMarketTrade](https://ide.bitquery.io/AsterDEX---OpenMarketTrade)

#### Trader's specific event

Trader's specific event. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Trader's specific event](https://ide.bitquery.io/Traders-specific-event)

#### Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92

Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Traders data - 0x01554d63537d3c62715826a268d4eab645d64b92](https://ide.bitquery.io/Copy-of-Traders-data---0x01554d63537d3c62715826a268d4eab645d64b92)

#### Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c

Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c. Uses the `Events` cube. Replace the address in the `where` clause to use it.

▶️ [Traders data - 0x2b7363708984aa25a90450cfca7bedaf6804115c](https://ide.bitquery.io/Traders-data---0x2b7363708984aa25a90450cfca7bedaf6804115c)

## x402

### Trades

#### Payment Analytics for x402 Server on Solana

Comprehensive payment analytics for a specific x402 server on Solana including total volume, unique users, and transaction counts.

▶️ [Payment Analytics for x402 Server on Solana](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server-on-Solana)

### Transfers

#### Get Latest Payments to x402 Server

Retrieves the most recent payments made to a specific x402 server on Base network.

▶️ [Get Latest Payments to x402 Server](https://ide.bitquery.io/Latest-payment-to-specific-x402-server)

#### Get Latest Payments to x402 Server on Solana

Retrieves the most recent payments made to a specific x402 server on Solana network.

▶️ [Get Latest Payments to x402 Server on Solana](https://ide.bitquery.io/Latest-Payment-to-specific-x402-server-taking-solana-payments)

#### Payment Analytics for x402 Server

Comprehensive payment analytics including total volume, unique users, transaction counts, and time-based breakdowns for a specific x402 server.

▶️ [Payment Analytics for x402 Server](https://ide.bitquery.io/Payment-analytics-related-specific-x402-server)

## Cross-Chain

### Trades

#### Volume of Multiple Tokens Across Different Chains

Get volume and price change data for multiple tokens trading on different chains (Solana, Ethereum, BSC, Tron) in a single query. Returns volume for 1h, 4h, and 24h periods, plus price change percentages. > **Note:** For EVM chains (Ethereum, BSC, etc.) in the Trading API, use **all lowercase…

▶️ [Volume of Multiple Tokens Across Different Chains](https://ide.bitquery.io/volume-of-a-token_2)

### Price & OHLC

#### Latest Price of Any Token

This query gives you bitcoin currency 1-sec OHLC across different blockchains. You can adjust duration in `Duration: {eq: 1}` filter.

▶️ [Latest Price of Any Token](https://ide.bitquery.io/Latest-bitcoin-price-on-across-chains_5)

#### OHLC of a currency on multiple blockchains

This query retrieves the OHLC (Open, High, Low, Close) prices of a currency(in this eg Bitcoin; it will include all sorts of currencies whose underlying asset is Bitcoin like cbBTC, WBTC, etc) across all supported blockchains, aggregated into a given time interval (e.g., 60 seconds in this example).

▶️ [OHLC of a currency on multiple blockchains](https://ide.bitquery.io/OHLC-of-a-currency-on-multiple-blockchains_2)

#### SMA and Volume Data (for past 28, 14 and 7 Days Time)

Use this API to get SMA and volume over the past 28 days, with 14 days, and 7 days breakdowns. Note that the oldest possible data it could return is 30 days ago.

▶️ [SMA and Volume Data (for past 28, 14 and 7 Days Time)](https://ide.bitquery.io/multiple-tokens-volume-and-SMA)

#### Historical OHLC of a Token Pair Across Chains

This query fetches historical OHLC (Open, High, Low, Close) price data for a token pair across different blockchains for as long back as 30 days. For **native tokens**, you only need to specify their ID (e.g., `bid:eth` for ETH).

▶️ [Historical OHLC of a Token Pair Across Chains](https://ide.bitquery.io/Historical-Token-OHLC-Multi-Chains_1)

#### Historical Price and Volume Data for a Token Pair beyond 30 days

Use this API to get historical price and volume for a specific token pair address on a specific network for the time window beyond the 30 days.

▶️ [Historical Price and Volume Data for a Token Pair beyond 30 days](https://ide.bitquery.io/historical-price-and-historical-volume)

#### All time High Trade Price for a Token

Retrieves the all-time high (ATH) price in USD for a specified token contract. All time high price could lie beyond the 30 days window provided by Trading API, hence we use these network specific APIs to get the ATH for a token. While this provides the option to go beyond the 30 days time…

▶️ [All time High Trade Price for a Token](https://ide.bitquery.io/ATH-of-eth-token_1)
