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

Here are the additional details from your document that you may want to include in your Markdown:

### 1. **Schemas Supported**

- Joins are available for **EVM, Tron, and Solana schemas** in GraphQL v2 and EAP.

### 2. **Join Query Structure**

- The `joinPLACEHOLDER` function embeds a subquery into the main query, where `PLACEHOLDER` is the name of the cube being joined.
- The joined query preserves the full schema of the joined cube, allowing:
  - Querying all fields & metrics
  - Using additional filters
  - Setting limits & aggregations

### 3. **Matching Conditions**

- At least one attribute must be selected for matching between the main query and joined query.
- Example:

  ```graphql
  query {
    EVM {
      Transfers {
        joinCalls(join: left, Call_To: Transfer_Receiver) {
          count
        }
      }
    }
  }
  ```

- The above example joins `Calls.Call_To` with `Transfers.Transfer_Receiver`.
- **Multiple Matching Conditions**

  ```graphql
  query {
    EVM {
      Transfers {
        joinCalls(
          join: left
          Call_To: Transfer_Receiver
          Transaction_Hash: Transaction_Hash
        ) {
          count
        }
      }
    }
  }
  ```

  - Ensures both `Call_To` matches `Transfer_Receiver` and `Transaction_Hash` matches.

### 4. **Other Attributes of Join Query**

- **`where`**: Additional filtering
- **`limit / limitBy`**: Restricting result sets
- **`orderBy`**: Sorting the joined results
- Example:

  ```graphql
  Transfers {
    joinCalls(join: left Call_To: Transfer_Receiver
      where: {
        Call: {Signature: {Name: {in: ["Transfer","TransferFrom"]}}}
      }
    ){
      count
    }
  }

  ```

### 5. **Performance Optimization**

- **Use joins only when necessary**, as they are computationally expensive.
- **Avoid unnecessary joins** when the same data can be retrieved via direct queries.
- **Use pre-aggregated results** to reduce data load.
- **Use join types `any` or `inner_any`** to limit excess data retrieval.

### 6. **Limitations**

- **Joins only work in queries** (subscriptions not supported).
- **Cannot join different datasets (say real-time and archive)**.
- **Joins can only be applied at the first query level**.
- **Cannot filter query results using join query fields**.

### 7. **Example Use Cases**

#### Example 1 : Check if an address is a smartcontract

Take this query for example, it helps you detect if an address is a smart contract.

```
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Sender: {is: "0xcf38be613203b39a14d2fb3c1a345122ec0a4351"}}, Block: {Date: {after: "2025-03-01"}}}
    ) {
      Transfer {
        Receiver
      }
      count
      joinCalls(Call_To: Transfer_Receiver, join: inner) {
        count
      }
    }
  }
}

```

#### How This Works

- The query finds all transfers from a specific sender
- Then, it checks if the receivers of these transfers were later called as smart contracts.
- Since only smart contracts can process function calls, it is likely a smart contract if an address appears in joinCalls.(since EOAs cannot process function calls)
- The count in joinCalls shows how many times the receiver was called.
