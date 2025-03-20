# GraphQL Joins

Starting March 2025, Bitquery APIs support joins on the v2 and EAP endpoint.

The `joinPLACEHOLDER` function enables you to **embed a subquery** within your main query, allowing data retrieval from the same or a different cube. This is functionally **equivalent to an SQL `JOIN` statement**, providing more efficient and structured data fetching.

For example,

```
query MyQuery {
  EVM {
    DEXTradeByTokens{
        # fields from main cube
      joinCalls{
            # Additional fields from the joined cube
      }
    }

  }
}
```

## JOIN Type

4 types of joins are supported:

- `left` ( default ) that returns all results from the query matched with all results from joined query. In case join query has no matching result, empty values are returned
- `any` is the same as left, except that maximum one ( any ) result is returned from the joined query;
- `inner` returns only matching results. If there are no matching results in joined query, the result is not returned;
- `inner_any` returns only one ( any ) matching result. If there are no matching results in joined query, the result is not returned;

![](/img/joins.png)


