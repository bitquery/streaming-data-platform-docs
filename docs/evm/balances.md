---
title: "EVM Balance Updates API"
---

<head>
<meta name="title" content="EVM Balance Updates API"/>

<meta name="description" content="Explore specific address details, such as the USDT token balance, using Bitquery's address query. Discover balance, attributes, and more information effortlessly."/>

<meta name="keywords" content="Token Balance, ERC20, USDT Balance, USDC Balance, ETH Balance, Ethereum, Ethereum Address"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Balance Updates API" />

<meta property="og:description" content="Explore specific address details, such as the USDT token balance, using Bitquery's address query. Discover balance, attributes, and more information effortlessly." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Balance Updates API" />

<meta property="twitter:description" content="Explore specific address details, such as the USDT token balance, using Bitquery's address query. Discover balance, attributes, and more information effortlessly." />
</head>


BalanceUpdates API provides details related to balance. For example, it can provide current and historical balances. As the name suggests, this api can provide historical balance updates to build a portfolio-like application.

It also has a lot of flexibility and supports ERC20 tokens and NFTs, including (ERC-1155). It can also provide the token holder's details. It allows you different [filters](docs/graphql/filters.md) to query data from different dimensions. You can find more examples [here](/docs/examples/balances/balance-api)

Here's a query to get started.

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


