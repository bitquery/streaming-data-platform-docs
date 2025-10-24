---
sidebar_position: 1
---

# Polygon (MATIC) Balance Updates API

In thise section we will see how to monitor real-time balance changes across the Polygon (MATIC) blockchain.

<head>
<meta name="title" content="How to get Polygon (MATIC) Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Polygon (MATIC) Balance python api, NFT balance api, Balance scan api, Balance api docs, Polygon (MATIC) Balance crypto api, balance blockchain api,Polygon (MATIC) network api, Polygon (MATIC) web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Polygon (MATIC) Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Polygon (MATIC) Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Polygon (MATIC) address using Bitquery's Balance Updates API." />
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

The query will subscribe you to real-time updates for balance changes on the Polygon (MATIC) blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0x4c828be6a67130Cd0835cEDa850Baec062Dfd685`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates#)

```
subscription {
  EVM(network: matic) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0x4c828be6a67130Cd0835cEDa850Baec062Dfd685"}}}
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
