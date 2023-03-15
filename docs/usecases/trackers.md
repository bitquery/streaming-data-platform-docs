---
sidebar_position: 3
---

# Wallets and Portfolio Trackers

Wallets and portfolio trackers are especially important for investors who hold multiple cryptocurrencies and need to keep track of their investments. They allow users to easily monitor the performance of their investments and make informed decisions about buying, selling, or holding their assets. Bitquery's Streaming APIs provide a powerful tool for building wallets and portfolio trackers that track token balances and transaction histories in real-time. Let's see how the API can help you with different functions of a tracker.

## Real-Time Updates with Subscription
One of the key needs of trackers is to receive real-time updates on token balances and transaction histories, with [subscriptions](/docs/ide/subscription), it becomes possible. 

You can use queries to get the [balance of an address](/docs/examples/balances/balance-api#balance-of-an-address) or subscribe to updates when they [add or sell a specific currency](/docs/examples/balances/balance-api#balance-for-an-address-for-a-specific-currency)

## Transaction History

In addition to real-time updates, Bitquery's API also provides historical data that can be used to track changes in token balances and transaction histories over time. When a user wants to check their transaction history of the wallet they may need to see the [details of the transaction](https://graphql.bitquery.io/ide/Transactions-Detail-EVM--BSC). The streaming API enables developers to retrieve transaction details, such as the amount, sender and recipient addresses, gas fee, and timestamp.

In cases where a portfolio includes NFTs, you can create specific page or feature to view just the NFT holdings and transactions. You can build alerts when [transfers NFTs from or to the wallet happens.](/docs/examples/transfers/nft-token-transfer-api#subscribe-to-the-latest-nft-token-transfers)

