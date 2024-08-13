---
sidebar_position: 2
---

# Examples of Mempool API

In this section we will look at some examples of how to write mempool queries to extract the necessary data from broadcasted transactions. To read more about how we offer mempool data, read the introduction [here](/docs/subscriptions/mempool-subscriptions.md)

## Simulating Pending Transactions

The below query retrieves information about in-flight transactions, helping you simulate the most recent state. It is a way to see if they will succeed without sending them on-chain. The `Success` field tells you if your mempool tranaction is successful and `FaultError` and `FaultError` indicate otherwise.
You can find query [here](https://ide.bitquery.io/Simulating-Pending-Transactions_1)

```
subscription{
  EVM(mempool: true) {
    Transfers{
      Log {
        Index
      }
      Transaction {
        Time
        Type
        To
        Gas
        From
        Cost
        Hash
      }
      Transfer {
        Amount
        Currency {
          Name
        }
        Type
      }
      TransactionStatus {
        Success
        FaultError
        FaultError
      }
      Block {
        Time
      }
    }
  }
}


```

## Get Recommended Fees

The Recommended Fees API provides real-time data from the mempool. It returns fields such as block time, block number, transaction hash, transaction cost, sender address, recipient address, base fee, burnt fees, sender fees, priority fees per gas, miner rewards, gas refunds, effective gas prices, and potential savings. You can use it to build applications that require up-to-date information about recommended transaction fees.

You can run the query [here](https://ide.bitquery.io/Get-Mempool-Fees)

```
{
  EVM(mempool: true) {
    Transactions(limit: {count: 100}) {
      Block {
        Time
        Number
        BaseFee
      }
      Transaction {
        Hash
        Cost
        To
        From
      }
      Fee {
        Burnt
        SenderFee
        PriorityFeePerGas
        MinerReward
        GasRefund
        EffectiveGasPrice
        Savings
      }
    }
  }
}


```

## PairCreated Events

This query returns information about transactions that have triggered the `PairCreated` event in the mempool, including the transaction hash, log signature, and argument values. You can run the query [here](https://ide.bitquery.io/PairCreated-in-Mempool)

```
subscription {
  EVM(mempool: true) {
    Events(where: {Log: {Signature: {Name: {is: "PairCreated"}}}}) {
      Transaction {
        Hash
      }
      Log{
        Signature{
          Name
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}

```

## Token Trades

This subscription provides information about the most recent token trades in the mempool, including the block number and time, transaction details, and trade information such as buyer, seller, price, and currencies involved. You can run the query [here](https://ide.bitquery.io/mempool-token-trades_1)

```
subscription {
  EVM(mempool: true) {
    buyside: DEXTrades {
      Block {
        Number
        Time
      }
      Transaction {
        From
        To
        Hash
      }
      Trade {
        Buy {
          Amount
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Seller
          Price
        }
        Sell {
          Amount
          Buyer
          Currency {
            Name
            SmartContract
            Symbol
          }
          Seller
          Price
        }
      }
    }
  }
}

```

## Transfers

This subscription returns details about the latest token transfers in the mempool, including the transfer amount, currency name and symbol, sender, receiver, and transfer type. You can run the query [here](https://ide.bitquery.io/mempool-transfers_1)

```
subscription {
  EVM(mempool: true) {
    Transfers {
      Transfer {
        Amount
        Currency {
          Name
          Symbol
        }
        Receiver
        Sender
        Type
      }
    }
  }
}

```

## Transactions from an Address

Mempool Transactions API provides real-time data from the Binance mempool. You can use it to build applications that require up-to-date information about transactions associated with a specific address.

This query retrieves transactions from the Binance mempool that were initiated from the specified address. It returns relevant information such as the block time, block number, transaction hash, transaction cost, sender address, and recipient address.

You can run the query [here](https://ide.bitquery.io/Binance-Mempool-Transactions_1)

```
subscription {
 EVM(mempool: true) {
   Transactions(
     where: {Transaction: {From: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}
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

## V, R, S Signature of Mempool Transactions

The following subscription query retrieves real-time mempool transactions and includes key details such as the block time, block number, transaction hash, transaction cost, and the V, R, S components of the transaction signature. You can run it [here](https://ide.bitquery.io/vrs-signature)
```
subscription {
  EVM(network: eth, mempool: true) {
    Transactions {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
      }
      Signature {
        V
        S
        R
      }
    }
  }
}
```

