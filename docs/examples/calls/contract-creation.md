---
sidebar_position: 1
---

# Smart Contract Creation

Smart contract creators can use these queries to track the deployment of their own smart contracts and to monitor the deployment of new smart contracts by others.

## Subscription to track new smart contract creation in real-time

This subscription will return information on each new smart contract created on Ethereum. You can create a [websocket](https://docs.bitquery.io/docs/start/websocket/) to monitor the same in real-time.

```
subscription {
  eth_creates: EVM(network: eth) {
    creates: Calls(
      where: {
        Call: { Create: true }}) {
      Block {
        Time
      }
      Transaction{
        Hash
        From
      }
      Call {
        Input
        To
        Output
      }

    }
  }
}

```

This subscription has information on

- The block time in which the smart contract was created
- The transaction hash that created the smart contract
- The address of the sender of the transaction that created the smart contract
- The address of the newly created smart contract
- The input data for the transaction that created the smart contract
- The output data from the transaction that created the smart contract

## Track new smart contract creation since a specific date

This query below, will return the number of new smart contracts created on the Ethereum and Binance Smart Chain networks since a particular date. It will also return the date of each day on which new smart contracts were created.
You can find the query [here](https://ide.bitquery.io/ETHBSC-SC-creates-count-over-date)

```
query {
  eth_creates: EVM(dataset: archive network: eth) {
    creates: Calls(
      where: {
        Block: {Date: {after: "2023-06-01"}}
        Call: { Create: true }}) {
      count
      Block {
        Date
      }
    }
  }
  bsc_creates: EVM(dataset: archive network: bsc) {
    creates: Calls(
      where: {
        Block: {Date: {after: "2023-06-01"}}
        Call: { Create: true }}) {
      count
      Block {
        Date
      }
    }
  }
}

```

## Get Code of the Token Contract

This query will return the most recent transaction that created the token contract. The `Output` field of the Call object in the transaction contains the encoded bytecode of the contract. Replace `0xc923D39fA2d97fb4B660Fc66DAdB1421605975E0` with the token contract address that you want to get the code for.
You can find the query [here](https://ide.bitquery.io/ByteCode-of-A-Token)

```
{
  eth_creates: EVM(dataset: archive, network: eth) {
    creates: Calls(
      where: {Call: {Create: true, To: {is: "0xc923D39fA2d97fb4B660Fc66DAdB1421605975E0"}}}
      limit: {count: 1}
      orderBy: {descending: Block_Time}
    ) {
      Block {
        Time
      }
      Transaction {
        Hash
        From
        To
      }
      Call {
        Output
      }
    }
  }
}

```

## Creator/Deployer of a smart contract

You can use calls api to get smart contract creator or deployer of a smart contract. In the following example, where we getting deployer of deployer of `0xcd80c916b1194beb48abf007d0b79a7238436d56`.

Try this query [here](https://ide.bitquery.io/creator--deployer-of-an-address_1).

```
{
  EVM(dataset: combined) {
    Calls(
      where: {Call: {Create: true}, Receipt: {ContractAddress: {is: "0xcd80c916b1194beb48abf007d0b79a7238436d56"}}}
    ) {
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

## Get Contract Type of a Contract

To determine the type of a contract and its details, we can use the Transfer API. By fetching the earliest transfer to the contract, we can get relevant details that indicate the contract type.

`Abi`: Provides the contract function ABI, describing its inputs and structure.
For example,
`"Name": "swap",` tells us the given address has a **`swap`** function. This suggests the contract is likely a **DEX (Decentralized Exchange) or token swap contract**.

You can run the query [here](https://ide.bitquery.io/Get-Contract-Type-in-v2)

```
 query MyQuery {
  EVM(network: eth) {
    Transfers(
      limit: {count: 1}
      orderBy: {ascending: Block_Time}
      where: {Transfer: {Receiver: {is: "0x881d40237659c251811cec9c364ef91dc08d300c"}}}
    ) {
      Call {
        Create
        Signature {
          SignatureType
          Signature
          Parsed
          Name
          Abi
        }
      }
    }
  }
}

```
