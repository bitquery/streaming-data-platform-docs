---
sidebar_position: 5
---

<head>
<meta name="title" content="How to get Arbitrum Balance Updates of an address"/>
<meta name="description" content="Learn how to get real time balance & balance updates of a Arbitrum address using Bitquery's Arbitrum Balance Updates API."/>
<meta name="keywords" content="balance api, balance updates api, balance updates python api, Arbitrum Balance python api, NFT balance api, Balance scan api, Balance api docs, Arbitrum Balance crypto api, balance blockchain api,Arbitrum network api, Arbitrum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to get Arbitrum Balance & Balance Updates of an address"
/>
<meta
  property="og:description"
  content="Learn how to get historical & real time balance & balance updates of a Arbitrum address using Bitquery's Arbitrum Balance Updates API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to get Arbitrum Balance Updates of an address" />
<meta property="twitter:description" content="Learn how to get real time balance & balance updates of a Arbitrum address using Bitquery's Arbitrum Balance Updates API." />
</head>

# Balances and Balance Update Examples

## Latest Balance of an Address on Arbitrum

The query returns the 11 most recent balance updates for the address `0xdef1c0ded9bec7f1a1670819833240f027b25eff` on the Arbitrum network. The balance updates will be sorted in descending order by the amount of token in the address.
The `sum` function is used to aggregate the `Amount` field for all balance updates in the list.
You can find the query [here](https://ide.bitquery.io/Address-balance-on-Arbitrum)

```
query ($network: evm_network, $address: String!, $limit: Int) {
  EVM(network: $network, dataset: archive) {
    BalanceUpdates(
      orderBy: {descendingByField: "sum"}
      where: {BalanceUpdate: {Address: {is: $address}}}
      limit: {count: $limit}
    ) {
      ChainId
      count
      Currency {
        Symbol
        SmartContract
      }
      sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0.0"})
    }
  }
}
{
  "limit": 11,
  "offset": 0,
  "network": "arbitrum",
  "address": "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
}

```

## Balance History of an Address on Arbitrum

The query returns the 10 most recent balance updates for the address `0xd292c50842fe5e52adfa20d9fe5dd18d00008fe5` on the Arbitrum network. The balance updates will be sorted in descending order by the block timestamp.

You can find the query [here](https://ide.bitquery.io/balance-updates-by-address-Arbitrum)

```
{
  EVM(dataset: archive, network: arbitrum) {
    BalanceUpdates(
      orderBy: {descending: Block_Time}
      where: {BalanceUpdate: {Address: {is: "0xd292c50842fe5e52adfa20d9fe5dd18d00008fe5"}}}
      limit: {count: 10}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
      }
      BalanceUpdate {
        Amount
      }
    }
  }
}


```

Each balance update contains the following information:

- `Block`: The block number and timestamp of the block where the balance update occurred.
- `Transaction`: The hash of the transaction that caused the balance update.
- `BalanceUpdate`: The amount of cryptocurrency that was added or subtracted from the balance.

The `orderBy` clause is used to sort the list of balance updates in descending order by the `Block_Time` field.

## Holders of a Token on Arbitrum

This query returns the top 10 holders of a token on Arbitrum, sorted by descending balance. The token is specified by the `Currency` field, which is set to the smart contract address of the token (ARB, 0x912ce59144191c1204e64559fe8253a0e49e6548).

The balance is calculated by summing up all balance updates for each address.
You can find the query [here](https://ide.bitquery.io/ARB-Streaming-Get-Top-Holders-of-Arbitrum-Token)

```
{
  EVM(dataset: archive, network: arbitrum) {
    BalanceUpdates(
      orderBy: {descendingByField: "Balance"}
      limit: {count: 10}
      where: {Currency: {SmartContract: {is: "0x912ce59144191c1204e64559fe8253a0e49e6548"}}}
    ) {
      Balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```
