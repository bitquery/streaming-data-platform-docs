---
sidebar_position: 1
---

# Ethereum Transaction Balance Tracker

The Ethereum Transaction Balance Tracker API provides real-time balance updates for all addresses involved in transactions on the Ethereum blockchain, including detailed information about the reason for each balance change.

<head>
<meta name="title" content="Ethereum Transaction Balance Tracker API & Streams"/>
<meta name="description" content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API."/>
<meta name="keywords" content="ethereum transaction balance api, eth balance streams, ethereum balance api, balance change reason, transaction balance python api, ethereum transaction balance, balance updates api, ethereum network api, ethereum web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Ethereum Transaction Balance Tracker API & Streams"
/>
<meta
  property="og:description"
  content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API."
/>

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Ethereum Transaction Balance Tracker API & Streams" />
<meta property="twitter:description" content="Learn how to get real-time balance updates for all addresses in Ethereum transactions with balance change reasons using Bitquery's Transaction Balance API." />
</head>

## Subscribe to All Transaction Balances

This subscription provides real-time balance updates for all addresses involved in transactions on the Ethereum network.

```graphql
subscription {
  EVM(network: eth) {
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

This subscription filters transaction balances for a specific address.

```graphql
subscription {
  EVM(network: eth) {
    TransactionBalances(
      where: {
        TokenBalance: {
          Address: { is: "0xYourAddressHere" }
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

## Field Availability by Currency Type

The availability of fields in the `TokenBalance` object depends on the type of currency being tracked. The API supports three types:

### Native Currency (ETH)

For native blockchain currencies (ETH on Ethereum):

- **Available**: `BalanceChangeReasonCode`, `PreBalance`, `PostBalance`, `PostBalanceInUSD`
- **Not Provided**: `TotalSupply`, `TokenOwnership`

### Fungible Tokens (ERC-20)

For fungible tokens like USDT, USDC, etc.:

- **Available**: `PostBalance`, `PostBalanceInUSD`, `TotalSupply`, `TotalSupplyInUSD`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TokenOwnership`

### NFTs (ERC-721 / ERC-1155)

For non-fungible tokens:

- **Available**: `PostBalance`, `TokenOwnership`
- **Not Provided**: `PreBalance`, `BalanceChangeReasonCode`, `TotalSupply`, `TotalSupplyInUSD`, `PostBalanceInUSD`

**Important Notes for NFTs:**

- `PostBalance` shows the **count of NFTs** the address holds for the specific smart contract after the transaction
- `TokenOwnership` indicates whether the NFT with the given `Id` is owned by the address **AFTER** the transaction (`Owns: true/false`)

## Balance Change Reason Codes

The `BalanceChangeReasonCode` field returns a numeric code that indicates why a balance changed. **Note:** This field is only available for native currency (ETH) transactions, not for fungible tokens or NFTs.

**Important:** Ethereum balance change codes differ from BSC. Ethereum uses codes 0-15, while BSC uses codes 0-15 plus BSC-specific codes (210-211).

Below is a comprehensive table of all Ethereum balance change reason codes:

| **Code** | **Reason**                          | **Description**                                                                                                                                                                       |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0        | BalanceChangeUnspecified            | Unspecified balance change reason                                                                                                                                                     |
| 1        | BalanceIncreaseRewardMineUncle      | Reward for mining an uncle block                                                                                                                                                      |
| 2        | BalanceIncreaseRewardMineBlock      | Reward for mining a block                                                                                                                                                             |
| 3        | BalanceIncreaseWithdrawal           | ETH withdrawn from the beacon chain                                                                                                                                                 |
| 4        | BalanceIncreaseGenesisBalance       | ETH allocated at the genesis block                                                                                                                                                  |
| 5        | BalanceIncreaseRewardTransactionFee | Transaction tip increasing block builder's balance                                                                                                                                    |
| 6        | BalanceDecreaseGasBuy               | ETH spent to purchase gas for transaction execution. Part of this gas may be burnt as per EIP-1559 rules                                                                            |
| 7        | BalanceIncreaseGasReturn            | ETH returned for unused gas at the end of execution                                                                                                                                 |
| 8        | BalanceIncreaseDaoContract          | ETH sent to the DAO refund contract                                                                                                                                                 |
| 9        | BalanceDecreaseDaoAccount           | ETH taken from a DAO account to be moved to the refund contract                                                                                                                     |
| 10       | BalanceChangeTransfer               | ETH transferred via a call. It is a decrease for the sender and an increase for the recipient                                                                                       |
| 11       | BalanceChangeTouchAccount           | Transfer of zero value. Only there to touch-create an account                                                                                                                         |
| 12       | BalanceIncreaseSelfdestruct         | Balance added to the recipient as indicated by a selfdestructing account                                                                                                              |
| 13       | BalanceDecreaseSelfdestruct         | Balance deducted from a contract due to self-destruct                                                                                                                                 |
| 14       | BalanceDecreaseSelfdestructBurn     | ETH sent to an already self-destructed account within the same transaction (captured at end of tx). Note: it doesn't account for a self-destruct which appoints itself as recipient |
| 15       | BalanceChangeRevert                 | Balance reverted back to a previous value due to call failure. Only emitted when the tracer has opted in to use the journaling wrapper (WrapWithJournal)                              |

