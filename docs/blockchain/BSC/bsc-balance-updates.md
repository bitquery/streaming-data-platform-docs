---
sidebar_position: 1
---

# BSC Balance Updates API

In thise section we will see how to monitor real-time balance changes across the BSC blockchain.

<head>
<meta name="title" content="BSC Balance Updates API"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a BSC address using Bitquery's Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, BSC Balance python api, NFT balance api, Balance scan api, Balance api docs, BSC Balance crypto api, balance blockchain api,BSC network api, BSC web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Balance Updates API"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a BSC address using Bitquery's Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Balance Updates API" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a BSC address using Bitquery's Balance Updates API." />
</head>

:::warning Important: Rebasing Token Limitations
**Rebasing tokens are not supported for accurate balance calculations.**

Rebasing tokens (like Mountain Protocol's USDM) automatically adjust their total supply and individual balances through mechanisms other than traditional transfer transactions. This means:

- **Balance calculations may be inaccurate** - Our balance tracking doesn't capture rebasing adjustments
- **Balance updates may be missing** - Individual holder balances change without visible transactions
- **Historical balance data will be incorrect** - Past balances don't reflect rebasing adjustments

**Before calculating balances for any token, verify it's not a rebasing token by:**

1. Checking the token's official documentation
2. Looking for rebasing mechanisms in the smart contract
3. Consulting token issuer resources

**Example of rebasing token:** Mountain Protocol USDM (`0x59d9356e565ab3a36dd77763fc0d87feaf85508c` on Arbitrum) - [Documentation](https://docs.mountainprotocol.com/legacy-docs/usdm-token)

**Supported chains:** This limitation applies to all EVM chains (Ethereum, Arbitrum, BSC, Base, etc.)
:::

## Subscribe to Balance Updates of a Particular Wallet

The query will subscribe you to real-time updates for balance changes on the BSC blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`. You can find the query [here](https://ide.bitquery.io/get-real-time-balance-updates-of-an-address_1)

```
subscription {
  EVM(network: bsc) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}}
    ) {
      Currency {
        Name
      }
      BalanceUpdate {
        Address
        Amount
        Type
      }
      Block {
        Time
      }
    }
  }
}

```

## Get Top Holders of a Token

This query gets the top holders of a token filtered using `Currency: { SmartContract: { is: ` filter.

You can run the query [here](https://ide.bitquery.io/Top-10-holders-of-a-token-on-BSC)

```

{
  EVM(network: bsc, aggregates: yes, dataset: combined) {
    BalanceUpdates(
      orderBy: { descendingByField: "balance" }
      limit: { count: 50 }
      where: {
        Currency: { SmartContract: { is: "0xdaf1695c41327b61b9b9965ac6a5843a3198cf07" } }
      }
    ) {
      BalanceUpdate {
        Address
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
    }
  }
}

```

## Get Top Holder of Multiple Tokens on BNB

We will aggregate balance update data for this API.

[Run Query ➤](https://ide.bitquery.io/Top-10-holders-of-multiple-tokens-on-BSC)

```
query {
  EVM(network: bsc, aggregates: yes, dataset: combined) {
    BalanceUpdates(
      orderBy: {descendingByField: "balance"}
      limit: {count: 50}
      where: {
        Currency: {
          SmartContract: {
            in: [
              "0xff7d6a96ae471bbcd7713af9cb1feeb16cf56b41",
              "0x3f160760535eb715d5809a26cf55408a2d9844c1"
            ]
          }
        }
      }
    ) {
      BalanceUpdate {
        Address
      }
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
    }
  }
}

```

## Get Token Holdings and Holding time of an address

Get the token holdings of an address and calculate the holding time using `first_buy_time` and `latest_balance_update_time`; test this query [here](https://ide.bitquery.io/holdings-holding-time-of-an-address-for-a-specific-token-on-EVM).

```
query ($trader: String, $token: String) {
  EVM(network: bsc) {
    TransactionBalances(
      where: {TokenBalance: {Address: {is: $trader}, Currency: {SmartContract: {is: $token}, Fungible: true}}}
    ) {
      Block{
        first_buy_time:Time(minimum:Block_Time)
        latest_balance_update_time:Time(maximum: Block_Time)
      }
      TokenBalance {
        Currency {
          Symbol
          Name
          SmartContract
          Decimals
        }
        First_buy_amount:PostBalance(minimum:Block_Time)
        Latest_balance:PostBalance(maximum:Block_Time)
        TotalSupply(maximum:Block_Time)
      }
    }
  }
}
```

```
{
  "trader": "0xc5C2653d38E241D62F96A4fB8f8497b6126F21dC",
  "token": "0x49d870B1d21D00c775DD03110Ef4c8FeF4Fd4444"
}
```
