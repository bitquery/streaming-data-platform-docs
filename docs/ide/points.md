---
sidebar_position: 11
---

# Points

At Bitquery we use points system to calculate the cost for a query. Each query will use different number of points, based on the complexity and size of the query requested. For a comprehensive understanding of the points system, please refer to [our detailed post](https://community.bitquery.io/t/introducing-points/874).

Get started for free with the developer plan and use up to 100K points renewed every month.
For every query you run, you can check the points in real time.

![points](/img/ide/points.png)

Different plans have different limits for points available. You can always request a custom top-up of points by directly contacting us.

Check pricing [here](https://bitquery.io/pricing)

## How are points calculated?

The number of points can vary for various reasons. Even the same query can produce different results. These points are dynamically calculated based on the following factors:

- The quantity of records being queried, either through the count of records in limit or the date range.
- The level of complexity of the query.

For instance, if you include additional addresses, the points will be calculated considering the resources occupied by those addresses. To optimize this query, there are a few approaches you can consider. Firstly, narrowing down the date range can help to refine the results. Secondly, reducing the list of addresses may also be beneficial. However, the effectiveness of these strategies will depend on your specific goal.

## How are points calculated for subscriptions?

Points are calculated based on a simple formula that takes into account the number of subscriptions you have and the time for which they are active. Here's how it works:

- **Rate**: Each subscription is charged at the rate of 40 points per minute.
- **Subscriptions Count**: Each data cube (e.g., Transfers, DEXTrades, or Blocks) activated counts as a separate subscription. If multiple cubes are used within a single WebSocket connection, each is billed as an individual subscription.

### Example

```
subscription {
  EVM(network: eth) {
    Transactions {
      Block {
        Hash
      }
    }
  }
}

```

In the example above, querying the `Transactions` data cube within the Ethereum (`eth`) network counts as a single subscription. The complexity of the query or the volume of data requested does not affect the points charged. You are billed solely based on the number of subscriptions and their duration.

For instance:

- **One Subscription**: If you maintain this subscription active for 10 minutes, you will be charged 400 points (10 minutes \* 40 points per minute).
- **Multiple Subscriptions**: If you use both `Transfers` and `DEXTrades` in the same WebSocket, it counts as two subscriptions. Keeping these active for 10 minutes would result in 800 points being charged (2 subscriptions _ 10 minutes _ 40 points per minute).

For more detailed information about subscriptions and best practices, please refer to the [documentation on subscriptions](/docs/subscriptions/subscription.md).

## How do you check points for your account?

You can check points consumed under your [account](https://account.bitquery.io/user/statistics).

![points_in_account](/img/ide/points_in_account.png)
