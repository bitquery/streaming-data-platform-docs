# Quantile

Quantiles are useful in understanding the distribution of numerical data by dividing it into intervals.

For example, the median represents the middle point of the data. Half of the responses had amounts lower than the median, and half had amounts higher.

And the 75th percentile shows that 75% of the responses had values lower than this, while 25% of the values were higher.

Bitquery APIs have the quantile metric, that can be used to provide insights into gas consumption, transaction amounts, or any other measurable field.

### Example 1: Querying Gas Consumption Quantiles

The following query retrieves statistics on gas usage for calls on the BSC network. The result provides the 25th percentile (1st quartile), 50th percentile (median), and 75th percentile (3rd quartile) for gas consumption, helping to understand the spread of gas costs in recent calls.

```graphql
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Calls(
      where: { Block: { Date: { after: "2024-07-12" } } }
      limit: { count: 10 }
    ) {
      Block {
        Date
      }
      quartile_gas: quantile(of: Call_Gas, level: 0.25)
      medium_gas: quantile(of: Call_Gas)
      three_fourth_gas: quantile(of: Call_Gas, level: 0.75)
      count
    }
  }
}
```

### Example 2: Querying Transfer Amount Quantiles

This query provides insights into transfer amounts in USD by retrieving the lower quartile, median, and upper quartile for transfers on the BSC network.

#### Query

```graphql
query MyQuery {
  EVM(dataset: archive, network: bsc) {
    Transfers(
      where: { Block: { Date: { after: "2024-07-12" } } }
      limit: { count: 10 }
      orderBy: { descending: Block_Date }
    ) {
      Block {
        Date
      }
      quartile_amount: quantile(of: Transfer_AmountInUSD, level: 0.25)
      medium_amount: quantile(of: Transfer_AmountInUSD)
      three_fourth_amount: quantile(of: Transfer_AmountInUSD, level: 0.75)
      count
    }
  }
}
```

- **Quartiles**:
  - `quartile_amount`: The 25th percentile (1st quartile) of the transfer amounts in USD.
  - `medium_amount`: The median (50th percentile) of transfer amounts.
  - `three_fourth_amount`: The 75th percentile (3rd quartile) of transfer amounts.
- **Quartile Calculation**: A quartile splits data into four equal parts, with Q1 (1st quartile) representing the 25th percentile, Q2 (median) the 50th percentile, and Q3 (3rd quartile) the 75th percentile.

## Customizing Quantiles with the `level` Parameter

In the queries, you can specify different quantiles by adjusting the `level` parameter in the `quantile` function. This parameter determines the percentile or quantile you want to calculate, allowing you to retrieve data that represents various parts of the distribution.

For example:

- **`level: 0.25`** returns the **25th percentile**, also known as the 1st quartile (Q1).
- **`level: 0.50`** (default if not specified) returns the **50th percentile**, or the median (Q2).
- **`level: 0.75`** returns the **75th percentile**, or the 3rd quartile (Q3).
- You can adjust the `level` to other values (e.g., 0.1 for the 10th percentile or 0.9 for the 90th percentile) depending on the insights you want.
