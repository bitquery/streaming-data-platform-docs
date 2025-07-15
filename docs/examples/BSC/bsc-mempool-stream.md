# BSC Mempool Stream

Any Bitquery GraphQL stream can be converted to a mempool monitoring stream by setting 
`mempool: true`
We also provide low-latency Kafka streams to monitor broadcasted data, which are much faster than GraphQL mempool streams.
Read more [here](https://docs.bitquery.io/docs/streams/protobuf/chains/EVM-protobuf/)

## How do we simulate txs for Bitquery Mempool APIs & Streams?

When a transaction is received by the node but not yet included in a block, Bitquery uses the following context to send mempool data:

- The transaction is executed in the EVM (using the current pending block context).

- The system captures the simulated receipt and trace.

For each batch of simulated transactions, Bitquery records the block header used as the execution context.

```
message BroadcastedTransactionsMessage {
  Chain Chain = 1;
  BlockHeader Header = 2;
  repeated Transaction Transactions = 3;
}
```

## Streaming Transactions in Mempool on BSC

[Run Stream >](https://ide.bitquery.io/bsc-mempool-txs)

<details>
  <summary>Click to expand GraphQL query</summary>

      subscription{
        EVM(mempool: true, network: bsc) {
          Transfers {
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
              EndError
            }
            Block {
              Time
            }
            Call {
              Signature {
                Name
              }
            }
          }
        }
      }


</details>

## Streaming Trades in Mempool on BSC

[Run Stream >](https://ide.bitquery.io/monitor-mempool-trades-bsc)

<details>
  <summary>Click to expand GraphQL query</summary>
  

    subscription {
      EVM(mempool: true, network: bsc) {
        DEXTradeByTokens {
          Block {
            Number
          }
          Transaction {
            Hash
          }
          Trade {
            Price
            PriceInUSD
            Currency {
              Name
            }
            Amount
            Buyer
            Dex {
              ProtocolName
            }
            Side {
              Seller
              Buyer
              AmountInUSD
              Amount
              Currency {
                Name
                Symbol
              }
            }
          }
        }
      }
    }
    
</details>