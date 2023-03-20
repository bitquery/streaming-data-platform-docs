---
sidebar_position: 3
---

# Wallets and Portfolio Trackers

Wallets and portfolio trackers are especially important for investors who hold multiple cryptocurrencies and need to keep track of their investments. They allow users to easily monitor the performance of their investments and make informed decisions about buying, selling, or holding their assets. Bitquery's Streaming APIs provide a powerful tool for building wallets and portfolio trackers that track token balances and transaction histories in real-time. Let's see how the API can help you with different functions of a tracker.

## Real-Time Updates with Subscription
One of the key needs of trackers is to receive real-time updates on token balances and transaction histories, with [subscriptions](/docs/ide/subscription), it becomes possible. 
You can use queries to get the [balance of an address](https://graphql.bitquery.io/ide/Balances-of-an-address) or subscribe to updates when they [add or sell a specific currency](https://graphql.bitquery.io/ide/Balance-for-an-address-for-an-specific-currency_1)


## Transaction History

In addition to real-time updates, Bitquery's API also provides historical data that can be used to track changes in token balances and transaction histories over time. When a user wants to check their transaction history of the wallet they may need to see the [details of the transaction](https://graphql.bitquery.io/ide/Transactions-Detail-EVM--BSC). The streaming API enables developers to retrieve transaction details, such as the amount, sender and recipient addresses, gas fee, and timestamp.

In cases where a portfolio includes NFTs, you can create specific page or feature to view just the NFT holdings and transactions. You can build alerts when [transfers of a particular NFT happens.](https://graphql.bitquery.io/ide/Subscribe-to-latest-Axie-infinity-token-transfers_1)


## Token Holdings

To keep track of the user's token holdings, Bitquery's API can be used to retrieve information on the token balances in their wallets. Developers can create custom queries to get the token holdings of specific addresses or wallets, including ERC-20 and BEP-20 tokens.

## Balance Updates

Bitquery's API allows developers to receive real-time updates on [balance changes](https://graphql.bitquery.io/ide/Balance-Update-in-a-wallet) in the user's wallets. With subscription queries, developers can monitor changes in token balances in real-time, allowing for instant notifications of deposits or withdrawals.

## Customizable Dashboards
With Bitquery's Streaming APIs, developers can also create customizable dashboards that allow users to monitor their portfolios in real-time. These dashboards can be tailored to display the information that is most relevant to the user, such as token balances, transaction history, and performance charts. With the [Tradingview Chart APIs](https://community.bitquery.io/t/integrating-tradingview-s-technical-analysis-charts-with-bitquery-graphql-api-using-vuejs/343), developers can also create custom dashboards that display data on specific tokens or cryptocurrencies, allowing users to focus on the information that matters most to them.

For example, you can use queries to get historical token prices and build charts that show the value of a user's portfolio over time.

