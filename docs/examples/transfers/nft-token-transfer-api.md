## NFT Token Transfers API

Let's see how to get the latest NFT token transfers. We are taking Cryptokitties(CK) token example in the following query. The token address for Cryptokitties(CK) token is [0x06012c8cf97bead5deae237070f9587f8e7a266d](https://explorer.bitquery.io/ethereum/token/0x06012c8cf97bead5deae237070f9587f8e7a266d)

[**Bitquery**\
*Edit description*graphql.bitquery.io](https://graphql.bitquery.io/ide/Cryptokitties-Token-Transfers "https://graphql.bitquery.io/ide/Cryptokitties-Token-Transfers")[](https://graphql.bitquery.io/ide/Cryptokitties-Token-Transfers)

```graphql
{
  EVM(dataset: combined, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
        Id
        URI
        Data
      }
    }
  }
}
```

Here is the [link](https://graphql.bitquery.io/ide/Cryptokitties-Token-Transfers) to the query on IDE.

## Subscribe to the latest NFT token transfers

Let's see an example of NFT token transfers using Graphql Subscription (Webhook). In the following API, we will be subscribing to Axie Infinity (AXS) token transfers.

```graphql
subscription {
  EVM(network: eth, trigger_on: head) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d"}}}}
      orderBy: {descending: Block_Time}
    ) {
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
        Id
        URI
      }
    }
  }
}
```

You can open this API on our Graphql IDE using this [link](https://graphql.bitquery.io/ide/Subscribe-to-latest-Axie-infinity-token-transfers_1).