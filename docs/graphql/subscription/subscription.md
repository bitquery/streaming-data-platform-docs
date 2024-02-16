---
sidebar_position: 1
---

# Subscription

Subscription is defined by the subscription type of GraphQL request:

```graphql
subscription {
  eth: EVM(network: eth) {
  ...
  }
}
```

Almost any query can be converted to subscription just by replacing ```query``` type to ```subscription```.

