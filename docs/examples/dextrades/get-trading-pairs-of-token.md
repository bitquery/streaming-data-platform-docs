If you want to get all trades of a token, you might want to know all its trading pairs.
Protocols like uniswap have pairs or pools. Today we will see how we can get all pairs of currency for DEXs.

** Get all pairs of a token across different DEXs

Let's get all pairs of the [BLUR token](https://explorer.bitquery.io/ethereum/token/0x5283d291dbcf85356a21ba090e6db59121208b44). In the following query, we are not defining any DEX details; therefore, we will get pairs across DEXs supported by Bitquery.
We are just providing the BLUR token as buy currency.

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}}}
      limit: {count: 10}
      limitBy: {by: Trade_Sell_Currency_SmartContract, count: 1}
    ) {
      Trade {
        Dex {
          ProtocolName
          OwnerAddress
          ProtocolVersion
          Pair {
            SmartContract
            Name
            Symbol
          }
        }
        Buy {
          Currency {
            Name
            SmartContract
          }
        }
        Sell {
          Currency {
            Name
            SmartContract
          }
        }
      }
    }
  }
}

```
Open the above query on GraphQL IDE using this [link](https://graphql.bitquery.io/ide/Pair-tokens-for-BLUR-token-for-all-DEXs_1)

** Get all pairs of a token from a specific DEX

Now, let's see an example of getting all pairs of a token for a specific DEX. In this example, we will get all pairs of the [BLUR token](https://explorer.bitquery.io/ethereum/token/0x5283d291dbcf85356a21ba090e6db59121208b44) for the Uniswap v3 protocol; therefore, we will mention [Uniswap v3 factory smart contract address](https://explorer.bitquery.io/ethereum/smart_contract/0x1f98431c8ad98523631ae4a59f267346ea31f984/transactions).

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Buy: {Currency: {SmartContract: {is: "0x5283d291dbcf85356a21ba090e6db59121208b44"}}}, Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
      limit: {count: 10}
      limitBy: {by: Trade_Sell_Currency_SmartContract, count: 1}
    ) {
      Trade {
        Dex {
          ProtocolName
          OwnerAddress
        }
        Buy {
          Currency {
            Name
            SmartContract
          }
        }
        Sell {
          Currency {
            Name
            SmartContract
          }
        }
      }
    }
  }
}
```

Open the above query on GraphQL IDE using this [link](
https://graphql.bitquery.io/ide/pairs-of-blur-token-new-dataset_1)