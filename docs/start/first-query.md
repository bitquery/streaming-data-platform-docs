---
sidebar_position: 1
---

# Your First Query

Create and run your first query on Bitquery IDE by visiting  [https://graphql.bitquery.io/ide](https://graphql.bitquery.io/ide). 

### Create an account

To continue, you must first [register](/docs/ide/login) an account to access the IDE window.

If IDE points to the default endpoint https://graphql.bitquery.io, change it to the new endpoint
https://streaming.bitquery.io/graphql. 
Bookmark the link to open IDE with the correct URL: [https://graphql.bitquery.io/ide?endpoint=https://streaming.bitquery.io/graphql](https://graphql.bitquery.io/ide?endpoint=https://streaming.bitquery.io/graphql)

![Uploading streaming-bitquery endpoint.png…]()

If you do everything correctly, you will see the grey triangle in the middle of the screen to run the query.

The query editor is in the center of the screen, and you can use handy Ctrl-Space key
combination to see all possible options that you can enter at the edit point. On the empty 
editor, it will show the drop-down list:

![IDE context menu](/img/ide/context_menu.png)

So you can type the query using hints from IDE. For example, you can
query the latest 10 blocks on the ETH network:

```graphql
{
  EVM(network: eth) {
    Blocks(limit: {count: 10}) {
      Block {
        Number
        Time
      }
    }
  }
}
```

After you create a query, the run triangle button will appear to be green, 
and you can press it now to see the results:

![IDE query execution](/img/ide/query_execution.png)


