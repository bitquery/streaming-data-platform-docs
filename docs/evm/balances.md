

BalanceUpdates API provides details related to balance. For example, it can provide current and historical balances. As the name suggests, this api can provide historical balance updates to build a portfolio-like application.

It also has a lot of flexibility and supports ERC20 tokens and NFTs, including (ERC-1155). It can also provide the token holder's details. It allows you different [filters](docs/graphql/filters.md) to query data from different dimensions. You can find more examples [here](/docs/examples/balances/balance_api.md)

Here's a query to get started.

```graphql
{
  EVM (dataset: archive) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xdfd5293d8e347dfe59e90efd55b2956a1343963d"}}}
    ) {
      Currency {
        SmartContract
        Name
        Symbol
        Fungible
      }
      sum(of: BalanceUpdate_Amount)
    }
  }
}

```


