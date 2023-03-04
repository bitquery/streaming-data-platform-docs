---
sidebar_position: 9
---

# Balance Updates


BalanceUpdates API provides details related to balance. For example, it can provide current and historical balances. As the name suggests, this api can provide historical balance updates to build a portfolio-like application.

It also has a lot of flexibility and supports ERC20 tokens and NFTs, including (ERC-1155). It can also provide the token holder's details. It allows you different [filters](docs/graphql/filters.md) to query data from different dimensions.

Let's see an example of BalanceUpdates API to get the balance of a given address.

```graphql
{
  EVM (dataset: combined) {
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

You can see more example of BalanceUpdates api in [here](docs/examples/balances/balance-api.md) and [here](docs/examples/nft/nft-api.md)