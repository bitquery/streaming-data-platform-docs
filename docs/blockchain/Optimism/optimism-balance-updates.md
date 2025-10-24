---
sidebar_position: 1
---

# Optimism Balance Updates API

In this section we will see how to monitor real-time balance changes across the Optimism blockchain.

<head>
<meta name="title" content="How to get Optimism Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Optimism address using Bitquery's Optimism Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Optimism Balance python api, NFT balance api, Balance scan api, Balance api docs, Optimism Balance crypto api, balance blockchain api,Optimism network api, Optimism web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Optimism Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Optimism address using Bitquery's Optimism Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Optimism Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Optimism address using Bitquery's Optimism Balance Updates API." />
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

The query will subscribe you to real-time updates for balance changes on the Optimism blockchain, providing a continuous stream of data as new transactions are processed and recorded. Here we have used address `0xacD03D601e5bB1B275Bb94076fF46ED9D753435A`. You can find the query [here](https://ide.bitquery.io/Get-real-time-balance-updates-on-optimism_1#)

```
subscription {
  EVM(network: optimism) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xacD03D601e5bB1B275Bb94076fF46ED9D753435A"}}}
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
      Transaction {
        Hash
      }
    }
  }
}



```
