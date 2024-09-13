# Transfer Cube

The Transfer cube provides details on asset transfers, blocks, contract calls, fees, event logs, receipts, transaction details, and transaction status.

![Transfers Fields](/img/cubes/transfers-cube.png)

### Filters in Transfer Cube

The Transfer cube allows filtering by any field available in the result fields. By default, all filters use the `AND` operator. We will see an example of the `OR` operator later.

For example, check the [transfers for the Tether token](https://ide.bitquery.io/Transfers-of-USDT-token-in-real-time-db).

### More Transfer Cube Filter Examples

Let's explore more examples of filtering in the Transfer cube.

Check [this query](https://ide.bitquery.io/transfers-over-100-eth-in-a-given-month), where we retrieve transfers over 100 ETH in a given month.

Another example is [this query](https://ide.bitquery.io/Only-wallet-to-wallet-eth-transfers-on-ethereum), where we filter to get only wallet-to-wallet ETH transfers based on type.

For an example of the `OR` operator, see [this query](https://ide.bitquery.io/all-transfers-of-a-address), which retrieves all transfers of a given address.

## Metrics in Transfer

Metrics allow you to perform mathematical functions such as `sum`, `count`, `average`, `median`, `maximum`, `minimum`, etc.

Let's understand this with a few examples.

Check [this example](https://ide.bitquery.io/biggest-transfer-on-a-given-date), where we get the biggest ETH transfer on a given date. Another way to write this query is by sorting based on amount, as shown [here](https://ide.bitquery.io/biggest-transfer-on-a-given-date-using-sorting).

See [this query](https://ide.bitquery.io/total-shiba-transferred-on-a-given-date_2) to learn how to get the token transfer volume and count of SHIB tokens on a given date.
