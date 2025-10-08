---
sidebar_position: 7
---

# Base Zora API

Bitquery provides comprehensive Zora data through APIs, Streams and Data Dumps.
This section provides you with a set of GraphQL APIs and streams that offer insights into the Zora protocol on Base blockchain.

The below GraphQL APIs and Streams are examples of data points you can get with Bitquery for Zora on Base.
If you have any questions on other data points, reach out to [support](https://t.me/Bloxy_info).

Need zero-latency Base data? [Read about our Kafka Streams and Contact us for a Trial](https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/).

You may also be interested in:

- [Base DEX Trade APIs ➤](https://docs.bitquery.io/docs/blockchain/Base/base-dextrades/)
- [Base Uniswap APIs ➤](https://docs.bitquery.io/docs/blockchain/Base/base-uniswap-api/)

:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

## Get Newly Created Zora Tokens

This query retrieves the list of newly created tokens on Zora Launchpad by monitoring transfers where new tokens are minted (sender is the zero address) with a specific amount. Try out the API [here](https://ide.bitquery.io/Newly-created-zora-tokens#) in the Bitquery IDE.

```graphql
{
  EVM(network: base) {
    Transfers(
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
      where: {
        Call: { Create: true }
        Transfer: {
          Sender: { is: "0x0000000000000000000000000000000000000000" }
          Amount: { eq: "1000000000" }
        }
        Transaction: {
          To: { is: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789" }
        }
      }
    ) {
      Transfer {
        Sender
        Receiver
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
        }
      }
      Transaction {
        From
        To
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

You can also stream the latest tokens created in real-time using [this subscription](https://ide.bitquery.io/Newly-created-zora-tokens-stream).

## Latest Trades on Zora

This query fetches the latest DEX trades on the Zora protocol (`zora_v4`) on Base blockchain. Try out the API [here](https://ide.bitquery.io/Latest-Zora-Trades-on-Base) in the Bitquery IDE.

```graphql
{
  EVM(dataset: realtime, network: base) {
    DEXTrades(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: { Trade: { Dex: { ProtocolName: { is: "zora_v4" } } } }
    ) {
      Block {
        Time
        Number
      }
      Fee {
        Burnt
        BurntInUSD
        EffectiveGasPrice
        EffectiveGasPriceInUSD
        GasRefund
        MinerReward
        MinerRewardInUSD
        PriorityFeePerGas
        PriorityFeePerGasInUSD
        Savings
        SavingsInUSD
        SenderFee
        SenderFeeInUSD
      }
      Receipt {
        ContractAddress
        Status
      }
      TransactionStatus {
        Success
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Call {
        From
        InternalCalls
        Signature {
          Name
          Signature
        }
        To
        Value
      }
      Transaction {
        Gas
        Cost
        CostInUSD
        GasFeeCap
        GasFeeCapInUSD
        GasPrice
        GasPriceInUSD
        GasTipCap
        GasTipCapInUSD
        Index
        Nonce
        Protected
        Time
        Type
        Value
        ValueInUSD
        Hash
        From
        To
      }
      Trade {
        Buy {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Decimals
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Sell {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Dex {
          ProtocolName
          SmartContract
          OwnerAddress
        }
      }
    }
  }
}
```

## Latest Trades of a Token on Zora

[Run Query](https://ide.bitquery.io/Latest-Trades-of-a-Token-on-Zora_2)

```
{
  EVM(dataset: realtime, network: base) {
    DEXTrades(
      limit: {count: 20}
       orderBy: {descending: Block_Time}
      where: {Trade: {Dex: {ProtocolName: {is: "zora_v4"}}, Buy: {Currency: {SmartContract: {is: "0xb3bcf37655c249426c20dd29c67afc0e192bd703"}}}}}
    ) {
      Block {
        Time
        Number
      }
      Fee {
        Burnt
        BurntInUSD
        EffectiveGasPrice
        EffectiveGasPriceInUSD
        GasRefund
        MinerReward
        MinerRewardInUSD
        PriorityFeePerGas
        PriorityFeePerGasInUSD
        Savings
        SavingsInUSD
        SenderFee
        SenderFeeInUSD
      }
      Receipt {
        ContractAddress
        Status
      }
      TransactionStatus {
        Success
      }
      Log {
        Signature {
          Name
        }
        SmartContract
      }
      Call {
        From
        InternalCalls
        Signature {
          Name
          Signature
        }
        To
        Value
      }
      Transaction {
        Gas
        Cost
        CostInUSD
        GasFeeCap
        GasFeeCapInUSD
        GasPrice
        GasPriceInUSD
        GasTipCap
        GasTipCapInUSD
        Index
        Nonce
        Protected
        Time
        Type
        Value
        ValueInUSD
        Hash
        From
        To
      }
      Trade {
        Buy {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Decimals
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Sell {
          Amount
          AmountInUSD
          Buyer
          Seller
          Currency {
            Name
            Symbol
            SmartContract
          }
          Price
          PriceInUSD
        }
        Dex {
          ProtocolName
          SmartContract
          OwnerAddress
        }
      }
    }
  }
}
```
