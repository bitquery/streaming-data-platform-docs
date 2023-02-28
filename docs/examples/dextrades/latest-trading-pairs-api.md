## Latest Trading Pairs for a DEX

Let's see how we can get latest trading pairs created on DEXs. In this example we use Smart Contract Events to track PoolCreated event for [Uniswap v3 factory contract](https://explorer.bitquery.io/ethereum/smart_contract/0x1f98431c8ad98523631ae4a59f267346ea31f984/events). Because whenever a new pool gets created Uniswap v3 factory contract emits a PoolCreated event with the details of the pool. 

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      orderBy: {descending: Block_Number}
      limit: {count: 10}
      where: {Log: {SmartContract: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}, Signature: {Name: {is: "PoolCreated"}}}}
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
        SmartContract
      }
      Transaction {
        Hash
      }
      Block {
        Date
        Number
      }
      Arguments {
        Type {
          Name
        }
        Value {
          String
        }
      }
    }
  }
}

```

Open this query on our Graphql IDE using this [link](https://graphql.bitquery.io/ide/Latest-pools-created-uniswap-v3_1).

