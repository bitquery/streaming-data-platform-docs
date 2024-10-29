---
title: "EVM Token Holders Cube"
---

<head>
<meta name="title" content="EVM Token Holders API"/>

<meta name="description" content="Explore token holder information include holders of a token, metrics like nakamoto coefficient, gini factor and theil index.Discover balance, attributes, and more information effortlessly."/>

<meta name="keywords" content="Token Balance, ERC20, USDT Balance, USDC Balance, ETH Balance, Ethereum, Ethereum Address"/>

<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />

<meta property="og:title" content="EVM Token Holders API" />

<meta property="og:description" content="Explore token holder information include holders of a token, metrics like nakamoto coefficient, gini factor and theil index. Discover balance, attributes, and more information effortlessly." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />

<meta property="twitter:title" content="EVM Token Holders API" />

<meta property="twitter:description" content="Explore token holder information include holders of a token, metrics like nakamoto coefficient, gini factor and theil index. Discover balance, attributes, and more information effortlessly." />
</head>

## Token Holders

Token holder of a token refers to any wallet which holds that particular token. With Bitquery's TokenHolders API, you can get details related to the holders of any token.

```graphql
{
  EVM(dataset: archive) {
    TokenHolders(
      tokenSmartContract: "0x514910771af9ca656af840dff83e8264ecf986ca"
      date: "2023-10-04"
      where: {Balance: {Amount: {gt: "0"}}, BalanceUpdate: {FirstDate: {is: "2023-10-04"}}}
    ) {
      Balance {
        Amount
      }
      Holder {
        Address
      }
      Currency {
        Name
        Symbol
      }
    }
  }
}
```

### Filter Parameters

Token Holder API allows you to narrow down your results using these parameters:

- `date`: Choose the date after which you want the token holders' data. **It's required for all token holder queries**.
- `tokenSmartContract`: Specify the token's address. **It's required for all token holder queries**.
- `limit`: Limit the results to a specified number of token holders.
- `limitBy`: Limit results based on a specific field's value.
- `orderBy`: Order results according to a field's value.
- `where`: Filter results based on specific criteria related to the value of the returned field.

### Return Fields

The Token Holder API offers access to the following fields:

- `Balance`: Provides the token balance.
- `BalanceUpdate`: Offers a range of aggregated data related to balance updates, including count, first date, last date, and more.
- `Currency`: Fetches details related to the currency, such as smart contract and address.
- `Holder`: Retrieves the holder's address.

## Indexes and Factors

Indexes and factors are calculations that can be used to analyze data in the TokenHolders cube. They can be used to calculate a variety of metrics, such as the Gini coefficient, Nakamoto coefficient, and Thiel index.

### Gini Factor

The Gini coefficient is a measure of inequality in a distribution. It is a number between 0 and 1, with 0 representing perfect equality and 1 representing perfect inequality.
This query will calculate the Gini coefficient for the distribution of balances among all holders of the specified token.You can find the query [here](https://ide.bitquery.io/Thiel-index-for-USDT)
```
query($currency: String! $date: String!) {
  EVM(dataset: archive) {
    TokenHolders(
      tokenSmartContract: $currency
      date: $date
      where: {
        Balance: {
          Amount: {
            gt: "0"
          }
        }
      }
    ) {
    	gini(of: Balance_Amount)
    }
	}
}
{
  "currency": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "date": "2022-10-01"
}
```

### Nakamoto Index

The Nakamoto coefficient is a measure of the centralization of a blockchain network. It is calculated by counting the number of holders that together control more than 51% of the total supply of a token an so the default value is 0.51.

It can be used to compare the decentralization of different blockchain networks. It can also be used to track the changes in decentralization of a blockchain network over time.
The below query gives number of holders having 99% of the supply of USDT.You can find the query [here](https://ide.bitquery.io/USDT-holders-having-99-of-all-supply-of-USDT-together)

```
query($currency: String! $date: String!) {
  EVM(dataset: archive) {
    TokenHolders(   
      tokenSmartContract: $currency
      date: $date
      where: {
        Balance: {
          Amount: {
            gt: "0"
          }
        }
      }
    ) {
    	nakamoto(of: Balance_Amount ratio: 0.99)
    }
	}
}
{
  "currency": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "date": "2022-10-01"
}
```

### Theil Index

The Thiel index is another measure of inequality in a distribution. It is calculated by taking the square of the sum of the market shares of all participants in a market. You can find the query [here](https://ide.bitquery.io/Thiel-index-for-USDT)

```
query($currency: String! $date: String!) {
  EVM(dataset: archive) {
    TokenHolders(
      tokenSmartContract: $currency
      date: $date
      where: {
        Balance: {
          Amount: {
            gt: "0"
          }
        }
      }
    ) {
    	theil_index(of: Balance_Amount)
    }
	}
}
{
  "currency": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "date": "2022-10-01"
}
```
