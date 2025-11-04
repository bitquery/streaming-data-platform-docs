---
sidebar_position: 2
---

# BSC Transaction Balance API & Streams

The TransactionBalances API provides real-time balance updates for all addresses involved in transactions on the BSC blockchain, including detailed information about the reason for each balance change.

<head>
<meta name="title" content="BSC Transaction Balance API & Streams"/>
<meta name="description" content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API."/>
<meta name="keywords" content="transaction balance api, balance streams, BSC balance api, balance change reason, transaction balance python api, BSC transaction balance, balance updates api, BSC network api, BSC web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="BSC Transaction Balance API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="BSC Transaction Balance API & Streams" />
<meta property="twitter:description" content="Learn how to get real-time balance updates for all addresses in BSC transactions with balance change reasons using Bitquery's Transaction Balance API." />
</head>

## Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the BSC network. You can find the query [here](https://ide.bitquery.io/token-balance-stream-on-BSC).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        TotalSupplyInUSD
        TotalSupply
        TokenOwnership {
          Owns
          Id
        }
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

## Subscribe to Transaction Balances for a Specific Address

This subscription filters transaction balances for a specific address. You can find the query [here](https://ide.bitquery.io/token-balance-stream-on-BSC-for-an-address).

```graphql
subscription {
  EVM(network: bsc) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xb300000b72DEAEb607a12d5f54773D1C19c7028d" }
        }
      }
    ) {
      Block {
        Time
      }
      TokenBalance {
        Currency {
          Symbol
          HasURI
          SmartContract
        }
        PreBalance
        PostBalance
        Address
        BalanceChangeReasonCode
        TotalSupplyInUSD
        TotalSupply
        TokenOwnership {
          Owns
          Id
        }
        PostBalanceInUSD
      }
      Transaction {
        Hash
      }
    }
  }
}
```

**Parameters**

- `where: {TokenBalance: {Address: {is: "0xb300000b72DEAEb607a12d5f54773D1C19c7028d"}}}`: Filters results to show only balance changes for the specified address. Replace the address with the BSC address you want to monitor.

## Field Availability by Currency Type

The availability of fields in the `TokenBalance` object depends on the type of currency being tracked. The API supports three types:

### Native Currency (ETH / BNB )

For native blockchain currencies (BNB on BSC):

- **Available**: `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`
- **Not Provided**: `TotalSupply`, `TokenOwnership`

### Fungible Tokens (ERC-20 / BEP-20)

For fungible tokens like USDT, USDC, etc.:

- **Available**: `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TokenOwnership`

### NFTs (ERC-721 / ERC-1155 / BEP-721 / BEP-1155)

For non-fungible tokens:

- **Available**: `PostBalance`, `TokenOwnership`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TotalSupply`, `TotalSupplyInUSD`, `PostBalanceInUSD`

**Important Notes for NFTs:**

- `PostBalance` shows the **count of NFTs** the address holds for the specific smart contract after the transaction
- `TokenOwnership` indicates whether the NFT with the given `Id` is owned by the address **AFTER** the transaction (`Owns: true/false`)

## Balance Change Reason Codes

The `BalanceChangeReasonCode` field returns a numeric code that indicates why a balance changed. **Note:** This field is only available for native currency (BNB) transactions, not for fungible tokens or NFTs.

Below is a comprehensive table of all balance change reason codes:

| **Code** | **Reason**                          | **Description**                                                                                                                                                                       |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0        | BalanceChangeUnspecified            | Unspecified balance change reason                                                                                                                                                     |
| 1        | BalanceIncreaseRewardMineUncle      | Reward for mining an uncle block                                                                                                                                                      |
| 2        | BalanceIncreaseRewardMineBlock      | Reward for mining a block                                                                                                                                                             |
| 3        | BalanceIncreaseWithdrawal           | Ether withdrawn from the beacon chain                                                                                                                                                 |
| 4        | BalanceIncreaseGenesisBalance       | Ether allocated at the genesis block                                                                                                                                                  |
| 5        | BalanceIncreaseRewardTransactionFee | Transaction tip increasing block builder's balance                                                                                                                                    |
| 6        | BalanceDecreaseGasBuy               | Ether spent to purchase gas for transaction execution. Part of this gas may be burnt as per EIP-1559 rules                                                                            |
| 7        | BalanceIncreaseGasReturn            | Ether returned for unused gas at the end of execution                                                                                                                                 |
| 8        | BalanceIncreaseDaoContract          | Ether sent to the DAO refund contract                                                                                                                                                 |
| 9        | BalanceDecreaseDaoAccount           | Ether taken from a DAO account to be moved to the refund contract                                                                                                                     |
| 10       | BalanceChangeTransfer               | Ether transferred via a call. It is a decrease for the sender and an increase for the recipient                                                                                       |
| 11       | BalanceChangeTouchAccount           | Transfer of zero value. Only there to touch-create an account                                                                                                                         |
| 12       | BalanceIncreaseSelfdestruct         | Balance added to the recipient as indicated by a selfdestructing account                                                                                                              |
| 13       | BalanceDecreaseSelfdestruct         | Balance deducted from a contract due to self-destruct                                                                                                                                 |
| 14       | BalanceDecreaseSelfdestructBurn     | Ether sent to an already self-destructed account within the same transaction (captured at end of tx). Note: it doesn't account for a self-destruct which appoints itself as recipient |
| 15       | BalanceChangeRevert                 | Balance reverted back to a previous value due to call failure. Only emitted when the tracer has opted in to use the journaling wrapper (WrapWithJournal)                              |
| 210      | BalanceDecreaseBSCDistributeReward  | Balance change that decreases system address' balance when BSC is distributing rewards to validator (BSC specific)                                                                    |
| 211      | BalanceIncreaseBSCDistributeReward  | Balance change that increases the block validator's balance when BSC is distributing rewards to validator (BSC specific)                                                              |
