---
sidebar_position: 1
---

# Overview

Building a real time balance tracker can be really helpful for the investigation teams to closely monitor the activities of a wallet. In this tutorial we will learn how to build a simple real time balance tracker using Javascript and NodeJS for the logical reasoning, using Bitquery's [Balance Updates API](https://docs.bitquery.io/docs/examples/balances/balance-api/), while using HTML, CSS and JavaScript to make the monitoring application more intuitive.

## Real Time Balance Calculation Logic

To calculate or monitor the real time balance of a wallet, we will need a GraphQL API along with a stream that constantly provides the Balance Update using Bitquery's [Websocket Connection Implementation](https://docs.bitquery.io/docs/subscriptions/examples/#implementation-exampleusing-websocket-using-javascript).

This is the simplified formula we will use in this example:

```
Current Balance = sum(all_balance_updates) + steam_balance_updates
``` 

If during the building of project you are stuck, you can refer to the following [Github Repository](https://github.com/Kshitij0O7/real-time-balance).