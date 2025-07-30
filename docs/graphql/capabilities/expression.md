# Calculate Expression

## What is a Calculate Expression?

An expression is a mathematical function that can be applied to metrics in a GraphQL query. Bitquery's EAP dataset supports expressions to allow you to calculate custom metrics, such as `Price Change` or `Price Change Percentage`.

You can create an expression in a query using `calculate()` function.

## Expressions API Examples

### Price Change Percentage of a Token

This examples allows us to calculate the price change for a token in percentage over the last hour.

```graphql
query MyQuery {
  Solana {
    DEXTrades(
      where: {Block: {Time: {after_relative: {hours_ago: 1}}}, Trade: {Buy: {Currency: {MintAddress: {is: "token_mint_address"}}}}}
    ) {
      Trade {
        Buy {
          start: PriceInUSD(minimum: Block_Time)
          end: PriceInUSD(maximum: Block_Time)
        }
      }
      percentage_change: calculate(expression: "100 * ($Trade_Buy_end-$Trade_Buy_start) / $Trade_Buy_start")
    }
  }
}
```
### Multiple Operators Inside Expression

This example shows how multiple operators could be utilised inside expression at the same time.

```graphql
query MyQuery {
  Trading {
    Currencies {
      a1:sum(of: Price_Average_WeightedSimpleMoving)
      a2:count
      a3:uniq(of: Currency_Id)
      a4:calculate(expression:"( 10 * ($a2 - $a1) + $a3 * $a1 ) / $a2")
    }
  }
}
```

Click **here** to checkout the list of all available operators.

### Expression Nesting

You can also use an expression inside an expression as shown in the example below.

```graphql
query MyQuery {
  Trading {
    Currencies {
      a1:sum(of: Price_Average_WeightedSimpleMoving)
      a2:count
      a3:uniq(of: Currency_Id)
      a4:calculate(expression:"$a1 - $a2")
      a5: calculate(expression:"$a4 * $a3 / 100")
    }
  }
}
```
Note that the `expression` using `calculate()` could be nested even further.

:::note
The time interval is derived using `after_relative` keyword with the option of `hours_ago` set as `1` to get all trades of the token in the last one hour. Click **here** to read more about the `after_relative` keyword
:::

## Expressions in Streams

The `calculate()` option could also be utilised for streams as shown in the example below.

```graphql
subscription {
  Solana {
    Transactions {
      transactions:count
      signers: uniq(of: Transaction_Signer)
      averageTransactions: calculate(expression: "$transactions / $signers")
    }
  }
}
```