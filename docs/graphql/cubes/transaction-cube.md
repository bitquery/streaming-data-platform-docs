## Transaction Cube

Transaction Cube provides comprehensive information about transactions, blocks, receipts, fees, transaction status, signatures, and more. You can check all the fields in [this query](https://ide.bitquery.io/transaction-cube-with-all-fields).

![Transaction Cube Fields](/img/cubes/transactionCubeFields.png)

## Filtering in Transaction Cube

Efficient blockchain filtering is one of the main strengths of our infrastructure. All cubes offer the ability to filter by any field available in the result. For example, if you can retrieve the transaction hash in the result, you can filter transactions based on it.

Therefore, Transaction Cube can filter transactions based on transaction hash, value, fee, status, transaction sender, receiver, block details, receipt, signature, etc.

### Transaction Filtering Examples

Using the `From` filter in Transaction Cube, you can get all transactions sent by a specific address. Check [this query](https://ide.bitquery.io/Transactions-of-an-address) for an example.

You can use one or multiple filters based on your requirements. Check [this example](https://ide.bitquery.io/Multiple-filters) to see how multiple filters can be applied.

Additionally, you can use the OR operator among your filters. For example, check [this query](https://ide.bitquery.io/transactions-sent-or-received-by-an-address) where we retrieve all transactions sent or received by an address.

## Metrics

Metrics allow you to perform mathematical functions such as `sum`, `count`, `average`, `median`, `maximum`, `minimum`, etc.

Let's understand this with a few examples.

Check [this query](https://ide.bitquery.io/transactions-on-ethereum-in-may) where we get the count of transactions in a given month.

Now, see [this API example](https://ide.bitquery.io/total-ethereum-transaction-value-in-april) where we get the sum of ETH transferred in a given month.

In the same way, you can use metrics and filters to obtain analytical metrics from blockchains.