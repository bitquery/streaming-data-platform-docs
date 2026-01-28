---
sidebar_position: 1
---

# Your First Query

Create and run your first query on Bitquery IDE by visiting [https://graphql.bitquery.io/ide](https://graphql.bitquery.io/ide).

## Create an account

To continue, you must first [register](https://account.bitquery.io/auth/signup) an account to access the IDE window.

**Registration Process**:

- Navigate to the Bitquery GraphQL IDE by visiting [https://graphql.bitquery.io/ide](https://graphql.bitquery.io/ide).
- If you are not registered, click on the "Not registered" link.
- You will need to provide your Email, Password, Password Confirmation, Name, and Company Name in the designated fields.
- Complete the CAPTCHA challenge and click the Submit button to proceed.
- After submitting your registration form, check your email for a confirmation message. Click the link within this email to verify your account. Once your email is successfully verified, you will receive a notification, confirming your account creation is complete.

If IDE points to the default endpoint https://graphql.bitquery.io, use the dropdown to change it to the new endpoint
https://streaming.bitquery.io/graphql which is labelled as "V2".

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
    Blocks(limit: { count: 10 }) {
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

## Selecting the Dataset

When choosing a dataset from the dropdown menu, you have three options: "realtime," "archive," and "combined." Based on your needs, pick an option.

- `realtime`: provides data in real-time as it is published onchain, usually used for data obtained through subscriptions.
- `archive`: contains non-real-time data.
- `combined`: includes both types of data, but it's advisable not to use it for complex queries.

For example,

```graphql
{
  EVM(network: eth, dataset: archive) {
    Blocks(limit: { count: 10 }) {
      Block {
        Number
        Time
      }
    }
  }
}
```

## Next Steps

Now that you've created your first query, learn which data primitives to use:

- **[Mental Model: Transfers, Events, Calls, and DexTrades](https://docs.bitquery.io/docs/start/mental-model-transfers-events-calls)** - Understand when to use Transfers, Events, Calls, or DexTrades for your queries
- **[Starter Queries](https://docs.bitquery.io/docs/start/starter-queries)** - Try pre-built queries for common use cases
- **[Learning Path](https://docs.bitquery.io/docs/start/learning-path)** - Follow a structured path from beginner to advanced
