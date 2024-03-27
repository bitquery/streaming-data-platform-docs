---
sidebar_position: 1
---

# Token Transaction API

The Transaction API provides access to transaction data on the blockchain. Transactions are the fundamental unit of account on a blockchain and represent the transfer of value from one address to another.

The Transaction API allows users to query for transaction data by specifying filters such as transaction hash, sender or receiver address, gas price, and more. The API also provides information about the block that the transaction was included in, including block number and block timestamp.

## Latest Transactions

This query is using the Transactions API to retrieve transaction data from the Binance Smart Chain (BSC) blockchain network in real-time.
You can find the query [here](https://graphql.bitquery.io/ide/Last-transactions-with-cost)

```graphql
query {
  EVM(dataset: realtime, network: bsc) {
    Transactions(
      limit: { count: 100 }
      orderBy: [{ descending: Block_Number }, { descending: Transaction_Index }]
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
      }
    }
  }
}
```

**Parameters:**

- `dataset`: The data source to be used by the query (in this case, "realtime")
- `network`: The blockchain network to be queried (in this case, "bsc")
- `limit`: Limits the number of returned results to 100.
- `orderBy`: Sorts the results by two fields, in descending order: `Block_Number` and `Transaction_Index`.

**Results:**

- `Block`: The block information of each transaction, including the block number and timestamp.
- `Transaction`: The transaction hash and cost (gas used multiplied by the gas price)

## Latest Transactions From or To an Address

This query retrieves 100 recent transactions where the specified address is either the sender (`From`) or the receiver (`To`). It is achieved by using the `any` filter which serves as the OR condition. It can help monitor incoming and outgoing transactions of a particular address.

You can run the query [here](https://ide.bitquery.io/Latest-Transactions-fromto-address)

```
{
  EVM(dataset: archive, network: eth) {
    Transactions(
      limit: {count: 100}
      where: {any: [{Transaction: {From: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}, {Transaction: {To: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}]}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
        To
        From
      }
    }
  }
}


```

## Get Transaction Details using Hash

The below query retrieves transaction details using the transaction hash. The `where` clause filters transactions based on the `Hash` field, which is set to `0xc3684c0ea63c0e081fb779bb8feaa5e5109ccc70ef30f17f4eea041ec5ea0bc7`.
You can find the query [here](https://ide.bitquery.io/Get-a-transaction-by-hash)

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    Transactions(
      where: {Transaction: {Hash: {is: "0xc3684c0ea63c0e081fb779bb8feaa5e5109ccc70ef30f17f4eea041ec5ea0bc7"}}}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        From
        To
        Hash
        Value
      }
    }
  }
}

```

## Next available nonce

The following query helps you determine the next available nonce for an Ethereum account by getting the latest transaction in the mempool (broadcasted transactions). The returned nonce is the highest nonce used by the account in the mempool. To get the next available nonce for a new transaction, you should increment this value by 1.
You can find the query [here](https://ide.bitquery.io/get-next-available-nonce)

```
query MyQuery {
  EVM(mempool: true, network: eth) {
    Transactions(limit: {count: 1}, orderBy: {descending: Block_Time}) {
      Transaction {
        Nonce
      }
    }
  }
}


```
