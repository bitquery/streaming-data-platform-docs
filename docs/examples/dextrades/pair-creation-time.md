---
sidebar_position: 4
---

# Pair Creation Time for a Specific Pair

Let's see how we can get pair creation time for a specific pair. We will use Events API for this. Filter for `PairCreated` event and also put one more filter, for which pair address you want the creation time. We have used `0x5c6919B79FAC1C3555675ae59A9ac2484f3972F5` pair address in our example.

Open this query on our GraphQL IDE using this [link](https://ide.bitquery.io/when-a-pair-was-created-for-EVM).

```graphql
query MyQuery {
  EVM(network: eth, dataset: combined) {
    Events(
      where: {
        Log: { Signature: { Name: { is: "PairCreated" } } }
        TransactionStatus: { Success: true }
        Arguments: {
          includes: {
            Value: {
              Address: { is: "0x5c6919B79FAC1C3555675ae59A9ac2484f3972F5" }
            }
          }
        }
      }
    ) {
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
