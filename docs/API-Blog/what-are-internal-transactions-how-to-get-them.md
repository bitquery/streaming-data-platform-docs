# What are Internal Transactions & How to Get Them?

 In blockchain a transaction is the transfer of value between two participants, recorded on a digital ledger. Not all transactions involve the direct sending of funds from one wallet to another, some transactions occur within smart contracts. These transactions are known as internal transactions.

Internal transactions are important in smart contract interactions, and having an understanding of how they work and how to trace them is essential for ensuring the transparency and security of smart contracts.

This article will explain what internal transactions are, how to trace them using [Bitquery](https://bitquery.io/) APIs, and how to use Bitquery's tools for detailed blockchain analysis.

## What are Internal Transactions?

Internal transactions are different from regular transactions as they happen between smart contracts. These transactions are not visible on the blockchain as they occur when a smart contract calls another smart contract or sends funds within itself.

Some use cases of internal transactions are:

- DeFi Operations: Internal transactions can be used in the management of activities such as lending, borrowing, and staking of funds between different contracts in decentralized finance applications.
- Batch Processing for Efficiency: With internal transactions, multiple actions can be taken in a single step, thus making the transaction cost-effective and efficient.
- Automated Withdrawals: With internal transactions, contracts can be configured to send funds to users based on specific conditions, such as rewards or payouts from a staking contract.
- Fee Management: Internal transactions can also assist in fee management, allowing smart contracts to automatically deduct and transfer fees for services or transactions, thereby automating fee collection and distribution.

The outcomes of internal transactions are recorded on the blockchain, but the transactions themselves are not directly traceable. Special tools and methods are required to track these outcomes.

## Tracing Internal Transactions with APIs

### Ethereum

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    in: Calls(
      where: {Call: {Depth: {gt: 0}}, Transaction: {Hash: {is: "0xd70c784ca3000da707d29c662d3a5dbe3d6bbade73686e1c73b4a24979d9e8c4"}}}
    ) {
      Transaction {
        Hash
      }
      Call {
        From
        Depth
        Value
        Success
      }
    }
  }
}

```

[https://ide.bitquery.io/internal-tx-eth](https://ide.bitquery.io/internal-tx-eth)

The link above is an example that shows how an internal transaction on Ethereum is tracked. It shows the patterns of internal transactions within a single Ethereum transaction. It shows the layers of internal calls, the Ethereum addresses involved, the status of each call, and the amount of Ether transferred in each case.

Query Components

- In: This array contains a series of transactions occurring within the bigger transaction.
- Call: This shows specific details of the transaction, such as the depth of the call, the address that initiated the call, the value of tokens transferred, and if the entire process was successful or not.
- Depth: This simply shows how far we are looking into the transactions. Each Call has a "Depth" value that indicates how far it is away from the original transaction. A depth of 1 means it's a direct call, while Calls higher than 1 shows nested calls.
- From: This is the Ethereum address that initiated the call.
- Success: Shows if the call was successful (true) or not (false).
- Value: This is the amount of Ether (ETH) transferred during the call.
- Hash: This identifies the main transaction that contains these internal calls.

Explaining the query data

- The first part of the query shows a Call from the address [0x2d6adce390953535e02d338dd2998c81170c06e3](https://explorer.bitquery.io/ethereum/smart_contract/0x2d6adce390953535e02d338dd2998c81170c06e3) with a value of 0.000380422043696798 ETH.
- This Call has a Depth of 1 meaning it is the primary internal transaction that occurred directly within the main transaction.
- The subsequent calls have depths ranging from 2 to 7, which means they are deeply nested internal transactions.
- All the internal transactions have the same transaction hash: [0xd70c784ca3000da707d29c662d3a5dbe3d6bbade73686e1c73b4a24979d9e8c4](https://explorer.bitquery.io/ethereum/tx/0xd70c784ca3000da707d29c662d3a5dbe3d6bbade73686e1c73b4a24979d9e8c4/tracing). Which means they are part of a single and larger Ethereum transaction.
- The Calls all have different purposes based on the amount of Ether they transfer. For example, some transfer a small amount of Ether like 0.000380422043696798 ETH, while others transfer 0 ETH. This means some calls execute functions without transferring value or performing complex operations that require several steps.

### BNB
```
query MyQuery {
  EVM(dataset: combined, network: bsc) {
    in: Calls(
      where: {Call: {Depth: {gt: 0}}, Transaction: {Hash: {is: "0x9c78b80a02c882db9d3d9add2d98243e4aeadb035fe9aacf82d04d51092db7fc"}}}
    ) {
      Transaction {
        Hash
      }
      Call {
        From
        Depth
        Value
        Success
      }
    }
  }
}

```
[https://ide.bitquery.io/internal-tx-bnb](https://ide.bitquery.io/internal-tx-bnb)

This query is aimed at analyzing the execution flow of a transaction, showing all the internal calls, their success, and the interactions between different addresses in the same transaction.

Components

- in: This array contains a series of transactions occurring within the bigger transaction.
- Call: This shows specific details of the transaction, such as the depth of the call, the address that initiated the call, the value of tokens transferred, and if the entire process was successful or not.
- Depth: This simply shows how far we are looking into the transactions. Each call has a "Depth" value that indicates how far it is from the original transaction. A depth of 1 means it's a direct call, while Calls higher than 1 shows nested calls.
- From: This is the BNB address that initiated the call. For example, two addresses in the query; [0xa188bd0af8b5f8d5c935d062ddb422bd96dcf65c](https://explorer.bitquery.io/bsc/smart_contract/0xa188bd0af8b5f8d5c935d062ddb422bd96dcf65c) and [0xc844ea097634f43ac7333bd7515eefda8afeec34](https://explorer.bitquery.io/bsc/smart_contract/0xc844ea097634f43ac7333bd7515eefda8afeec34/transactions) are repeatedly making calls.
- Success: This shows if the call was successful (true) or not (false). In this query, all calls are labeled true, meaning they were successful.
- Value: This is the amount of tokens transferred during the call.
- Hash: This identifies the main transaction that contains these internal calls.

### BASE

```
query MyQuery {
  EVM(dataset: combined, network: base) {
    in: Calls(
      where: {Call: {Depth: {gt: 0}}, Transaction: {Hash: {is: "0x85dc2c0eac54d090ac7e1b50bd47ec686ba764870b61714937b32524a96ed2b6"}}}
    ) {
      Transaction {
        Hash
      }
      Call {
        From
        Depth
        Value
        Success
      }
    }
  }
}
```

[https://ide.bitquery.io/Base- --transaction](https://ide.bitquery.io/Base-internal--transaction)

This query is an example that shows how an internal transaction on Base is tracked.

Details:

- In: This array contains a series of transactions occurring within the bigger transaction.
- where: This is used to filter the data based on certain conditions
- Call: {Depth: {gt: 0}}: This was used to filter calls having Depth greater than 0.
- From: This is the address that initiated the call.
- Success: Shows if the call was successful (true) or not (false).
- Value: This is the amount of tokens transferred during the call.
- Hash: This is the unique identifier of the transaction.
- Transaction:{Hash: {is: "0x85dc2c0eac54d090ac7e1b50bd47ec686ba764870b61714937b32524a96ed2b6"}}:'This filters for transactions with the specific hash mentioned. This means the query will only return data related to this transaction.

## Tracing Internal Transactions on Bitquery Explorer

The [Bitquery Explorer](https://explorer.bitquery.io/) allows users to visually explore and analyze blockchain data. We can use this to track internal transactions.

To track internal transactions using the Bitquery Explorer, follow these steps:

- Visit the [Bitquery Explorer](https://explorer.bitquery.io/) website.
- Select the blockchain network.
- Enter the transaction hash you want to trace in the search bar.
- Click the "Tracing" tab.

Details:

The internal transactions section provides details such as the sender and receiver addresses, the amount transferred, and the specific contract method called and gas used.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXd2u4PdpEvwZpwemeJ221AT2xGPrvHxjzzCuWdqbTQd64Mz_HJuX-O9ybhLjJmczfvuLkb9JwjBAVLB2lz7BO0b_VAPoeeXfOvIpSeA_uRQJg6Ya5W5oALK0hDPgLPq0uzxd4N_K4vcDUjLLR8rzF03t68g?key=5ttYeo2nskIw9kc9CkTdTA)

There is also a graphical view that shows how funds flow between different addresses

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfpIcX5dHn8aERff9UJKN5qOzM7mFsuFmlP3b_zvMf2O4z27YRSnjDBUh4g0rXXha3xEaX_2U_cVHE2F6UQO_Da7VjyY5HPu6awAQ2TcofiixcuzMHuzDMs5KBJQ32TSwQU9a09RcOCNsZGOAS8ceMGZI5u?key=5ttYeo2nskIw9kc9CkTdTA)

### Tracing an Internal Transaction Example

Now let's explore specific examples to gain a better understanding. We'll examine transactions on the following blockchains:

- Ethereum
- BNB
- ARBITRUM

#### Ethereum

This is an example of an ETH transaction on the Bitquery Explorer using the tracing feature.

[https://explorer.bitquery.io/ethereum/tx/0x26960e8c31dde5d76b69ba68201bfea5186555a7b44383f515d109ded74f3ac8/tracing](https://explorer.bitquery.io/ethereum/tx/0x26960e8c31dde5d76b69ba68201bfea5186555a7b44383f515d109ded74f3ac8/tracing)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeH2KyRwitZjl_MRG_rjArInn527wYHNGfB05mE1tAHezKaTEFG4HW_eEJal_IDHuPP7f2sAkUIp0gjT_Rig4cwzYH4FPfhHGOMFVNFmZEeI2vXsbfK-lbJ4cMzNa1i9f_Oj3PugAUE5c1Jbanim0EBipxm?key=5ttYeo2nskIw9kc9CkTdTA)

Below is a graphical view that shows how funds flow between different addresses

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeOx95Of3_eiQHKrtTMgGGSUULyDm7UKe53DkmIi4sEzBtuL7SatqEoJtn3YL4s2uoxJChgQ0LmtNf0x1q5Bo6PHPoOwuPDabWefy8TKtRpYz4Yx_pH6Q86wM7a92YxzSCJhNcteE6Cav_oWsrdJiyFkHZ7?key=5ttYeo2nskIw9kc9CkTdTA)

#### Binance (BNB) Smart Chain

This is an example of a BSC transaction on the Bitquery Explorer using the tracing feature.

[https://explorer.bitquery.io/bsc/tx/0x9c78b80a02c882db9d3d9add2d98243e4aeadb035fe9aacf82d04d51092db7fc/tracing](https://explorer.bitquery.io/bsc/tx/0x9c78b80a02c882db9d3d9add2d98243e4aeadb035fe9aacf82d04d51092db7fc/tracing)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf5z0FkIcT9dxZH4kPqCZmT6aGaMO82tFcGXNvIfHdRpSEaYVqoaaw00P1imMLIkwTgA1Z-bJewHIvp8SitvOqvbSq11SJfEOkpeesf6112qVDwUq0TWiZsDhSvJ1iaqd1QRZ_IGi2WnWUd7g7N5aY-3gXM?key=5ttYeo2nskIw9kc9CkTdTA)

Below is a graphical view that shows how funds flow between different addresses

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXdOBqdLchJsxwN61h19WQ1ERejVwwAb2VUejhTn-eYIwv7Jf9LWdERhMPIgUvw3ayGDFGtMtioGvOT8seYe5Tfj5LIpezgHpySGyvmYmdQ33_sfLTlwyZuB8PnOJKd8XHWWyHi3Tl9qyCo5LXAJaTeblGdA?key=5ttYeo2nskIw9kc9CkTdTA)

#### ARBITRUM

This is an example of an Arbitrum transaction on the Bitquery Explorer using the tracing feature.

[https://explorer.bitquery.io/arbitrum/tx/0x9346cd8afb33598d6ab57c3c83f5267ea96765e63e16b04e8dee7e599151c938/tracing](https://explorer.bitquery.io/arbitrum/tx/0x9346cd8afb33598d6ab57c3c83f5267ea96765e63e16b04e8dee7e599151c938/tracing)

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeDerEgA-arZyXoaIY7E9jDPj-_-8FvPVJuzBtJIyFyL_18r25oNrwAQhC4WiPoCqtKISIF1XS7HtuOnLbSbRxLCwlOoS62lWaWXh6IJGQ9vhW8kmw2gA2Mzq-qBNPZVvPJkMAeaQJ2EJ4-bOdyEONSZBk?key=5ttYeo2nskIw9kc9CkTdTA)

Below is a graphical view that shows how funds flow between different addresses

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeV0RVj7xWGgxFaNMTph6Vi797mz1LOJL7_nJIKlJy-xF389pELwXjimtPss4M1eM1aTEj4TjpRc1gDptS_A3ghwufxjfg-5vt2vEgd2mJfpOwbgCryisSzSFF4-2NIy6lih30G1ueHxz37__r6ZwZKtpUB?key=5ttYeo2nskIw9kc9CkTdTA)

Here’s a practical example to help people understand the importance of tracing internal transactions:

Tracking internal transactions can help people understand the movement of their funds. An example is a situation where a user moved some ETH from Coinbase to a hardware wallet, only to find out that the wallet did not display the second and third transactions, making them doubt if they had the coins in their wallet as expected.

In the situation above, the user can use [Bitquery](https://bitquery.io/) APIs to trace these internal transactions to confirm the status of their ETH. They can query the internal

transactions associated with the wallet address to ensure that all movements of their funds are accounted for.

## Conclusion

Tracking internal transactions is important to ensure the transparency and integrity of blockchain activities. By using tools such as Bitquery to monitor these transactions, users can verify the movement of their funds and also understand the flow of assets within smart contracts, thus ensuring the wallet balances are accurate. This is important for developers and users who need to maintain trust and security in decentralized applications.

For more information and related content, visit the [Bitquery blog](https://bitquery.io/blog) or explore the [documentation](https://docs.bitquery.io/).
