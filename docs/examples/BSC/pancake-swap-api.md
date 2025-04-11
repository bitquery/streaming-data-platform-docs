# PancakeSwap API

In this section we will use our APIs to track and monitor on-chain data related to the trade activities on Pancake Swap DEX. To get the trade activities of the PamcakeSwap exclusively we have added a filter on `DEX_OwnerAddress`, and the owner address is `0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865` in this case for Pancake V3. To get the trades and trade related data for PancakeSwap V1 or V2 you would need their respective `Factory Contract` address.

## All the Latest Trades on PancakeSwap

Using [this](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades) API endpoint we could query the most recent trades on PancakeSwap.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTrades(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {TransactionStatus: {Success: true}, Trade: {Dex: {OwnerAddress: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}}}
      limit: {count: 20}
    ) {
      Block {
        Time
        Number
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

## Streaming Latest Trades on Pancake Swap

[This](https://ide.bitquery.io/Latest-BSC-PancakeSwap-v3-dextrades---Stream) subscription allows to subscribe to the latest trades on PancakeSwap.

```graphql
subscription {
  EVM(network: bsc) {
    DEXTrades {
      Block {
        Time
        Number
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

## Subscribe to Mempool Trades on PancakeSwap

Using [this](https://ide.bitquery.io/Mempool---Latest-BSC-PancakeSwap-v3-dextrades---Stream) subscription you could stream the latest trades in Mempool, that is streaming the unconfirmed trades.

```graphql
subscription {
  EVM(network: bsc mempool:true) {
    DEXTrades {
      Block {
        Time
        Number
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

## Latest Trades of a Token on PancakeSwap

[This](https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-token) API endpoint returns the latest trades of a particular token on PancakeSwap. The token address is `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82` for this example.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {Trade: {Dex: {OwnerAddress: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}, Currency: {SmartContract: {is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"}}}}
    ) {
      Block {
        Time
        Number
      }
      TransactionStatus {
        Success
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
      Receipt {
        ContractAddress
      }
      Call {
        From
        Gas
        GasUsed
        InternalCalls
        Signature {
          Name
          Signature
        }
        To
        Value
      }
      Trade {
        Amount
        AmountInUSD
        Buyer
        Price
        PriceInUSD
        Buyer
        Seller
        Sender
        Success
        URIs
        Fees {
          Amount
          AmountInUSD
          Payer
          Recipient
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Currency {
          Name
          Symbol
          SmartContract
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Ids
          OrderId
          Seller
          Type
          URIs
        }
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

You could also stream the latest trades of the mentioned token using this [subscription](https://ide.bitquery.io/Stream---BSC-PancakeSwap-v3-Trades-for-a-token).

## Latest Trades on PancakeSwap for a given trader

[This]( https://ide.bitquery.io/BSC-PancakeSwap-v3-Trades-for-a-trader) query returns the latest trades by a particular trader, with buyer wallet address as `0xafb2da14056725e3ba3a30dd846b6bbbd7886c56` in this case, on PancakeSwap. Also, you could subscribe to the same info using [this](https://ide.bitquery.io/Stream---BSC-PancakeSwap-v3-Trades-for-a-trader) stream.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {Trade: {Dex: {OwnerAddress: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}, 
        Buyer:{
          is:"0xafb2da14056725e3ba3a30dd846b6bbbd7886c56"
        }
        }}
    ) {
      Block {
        Time
        Number
      }
      TransactionStatus {
        Success
      }
      Log {
        Signature {
          Name
          Signature
        }
        SmartContract
      }
      Receipt {
        ContractAddress
      }
      Call {
        From
        Gas
        GasUsed
        InternalCalls
        Signature {
          Name
          Signature
        }
        To
        Value
      }
      Trade {
        Amount
        AmountInUSD
        Buyer
        Price
        PriceInUSD
        Buyer
        Seller
        Sender
        Success
        URIs
        Fees {
          Amount
          AmountInUSD
          Payer
          Recipient
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Currency {
          Name
          Symbol
          SmartContract
        }
        Side {
          Amount
          AmountInUSD
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Ids
          OrderId
          Seller
          Type
          URIs
        }
      }
      Transaction {
        Hash
        From
        To
      }
    }
  }
}
```

## Latest Price of a Token on PancakeSwap

Using [this](https://ide.bitquery.io/BSC-PancakeSwap-v3-Price-for-a-token) API endpoint we could retrieve the latest price of a token traded on PancakeSwap. The price is calculated for the currency with `SmartContract Address` as `0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82` when it is traded against the currency with `SmartContract Address` as `0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c`. This query returns both price against the currency and price in USD.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    DEXTradeByTokens(
      limit: {count: 20}
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Trade_Index}]
      where: {Trade: {Dex: {OwnerAddress: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}, Currency: {SmartContract: {is: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"}}, Side: {Currency: {SmartContract: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}}}}
    ) {
      Trade {
        Price
        PriceInUSD
        Side {
          Currency {
            Name
            Symbol
            SmartContract
          }
        }
      }
    }
  }
}
```

The same info could be streamed via this [subscription](https://ide.bitquery.io/Stream--BSC-PancakeSwap-v3-Price-for-a-token_1).

## OHLC of Token on PancakeSwap

[This](https://ide.bitquery.io/BSC-Pancake-V3-OHLC-data_1) API endpoint provides the OHLC/ K-Line data for a given token against other specified token. In the example below, we are calculating the OHLC for currency with address as `$base` against the token with the address as `$token`.

```graphql
query tradingViewPairs($network: evm_network, $dataset: dataset_arg_enum, $interval: Int, $token: String, $base: String, $time_ago: DateTime) {
  EVM(network: $network, dataset: $dataset) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {TransactionStatus: {Success: true}, Trade: {Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $token}}}, Currency: {SmartContract: {is: $base}}, Success: true}, Block: {Time: {since: $time_ago}}}
    ) {
      Block {
        Time(interval: {count: $interval, in: hours})
      }
      low: quantile(of: Trade_PriceInUSD, level: 0.1)
      high: quantile(of: Trade_PriceInUSD, level: 0.9)
      open: Trade {
        PriceInUSD(minimum: Block_Time)
      }
      close: Trade {
        PriceInUSD(maximum: Block_Time)
      }
      volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}
```

```json
{
  "network": "bsc",
  "base": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
  "token": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  "time_ago": "2025-03-11T08:12:13Z",
  "dataset": "combined",
  "interval": 1
}
```

## New Liquidity Pools Created on PancakeSwap

[This](https://ide.bitquery.io/New-pools-created-on-PancakeSwap-v3) query returns the latest liquidity pool creation events on PancakeSwap.The same event could be streamed using [this](https://ide.bitquery.io/Stream---New-pools-created-on-PancakeSwap-v3) subscription. To make sure that we are only getting newly created liquidity pools on PancakeSwap, we are applying the conditon that the `LogHeader` is the `DEX_OwnerAddress`.

```graphql
{
  EVM(dataset: realtime, network: bsc) {
    Events(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Log_Index}]
      where: {LogHeader: {Address: {is: "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865"}}, Log: {Signature: {Name: {is: "PoolCreated"}}}}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
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

## Subscribe the Liquidity Addition Event on PancakeSwap

Liquidity addition is an important event related to any liquidity pool. Using [this](https://ide.bitquery.io/Stream---Liqiidity-add-for-all-tokens-on-PancakeSwap-v3) subscription we can subscribe to the liquidity addition event for liquidity pools on PancakeSwap and get the addition events in real time. To make sure that we are only getting liquidity addition events for PancakeSwap we are placing condition that the transaction is sent to `0x46A15B0b27311cedF172AB29E4f4766fbE7F4364` address.

```graphql
subscription {
  EVM(network: bsc) {
    Events(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Log_Index}]
      where: {Log: {Signature: {Name: {is: "Mint"}}}, Transaction: {To: {is: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364"}}}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
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

## Subscribe the Liquidity Removal Event on PancakeSwap

Using [this](https://ide.bitquery.io/Stream---Liquidity-remove-for-all-tokens-on-PancakeSwap-v3) subscription, liquidity removal events could be streamed for PancakeSwap Exchange.

```graphql
subscription {
  EVM(network: bsc) {
    Events(
      orderBy: [{descending: Block_Time}, {descending: Transaction_Index}, {descending: Log_Index}]
      where: {Log: {Signature: {Name: {is: "Burn"}}}, Transaction: {To: {is: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364"}}}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
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

## Get the Latest Pool Reserves for a Pair on PancakeSwap

[This](https://ide.bitquery.io/Pool-reserves-on-Pancakeswap-v3-pool) endpoint returns the latest pool reserves for a PancakeSwap liquidity pool by filtering on the basis of `BalanceUpdate_Address`, which is `0xafb2da14056725e3ba3a30dd846b6bbbd7886c56`, that is the pair address for the mentioned currencies.

```graphql
{
  EVM(dataset: combined, network: bsc) {
    BalanceUpdates(
      where: {Currency: {SmartContract: {in: ["0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"]}}, BalanceUpdate: {Address: {is: "0xafb2da14056725e3ba3a30dd846b6bbbd7886c56"}}}
    ) {
      sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      Currency {
        Name
        Symbol
        SmartContract
        Decimals
      }
    }
  }
}
```

## All Pairs of a Token on PancakeSwap

[This](https://ide.bitquery.io/All-pools-of-a-token-on-pancake-swap_2) query returns all the the token pairs for the specified currency on PancakeSwap. The contents returned included info of the liquidity pool such as currency details, trade amount, number of trades and price of token in USD in various time frames.

```graphql
query pairDexList($network: evm_network, $base: String, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime, $time_ago: DateTime, $owner: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "amount"}
      where: {TransactionStatus: {Success: true}, Trade: {Currency: {SmartContract: {is: $base}}, Side: {Amount: {gt: "0"}}, Dex: {OwnerAddress: {is: $owner}}}, Block: {Time: {after: $time_ago}}}
    ) {
      Trade {
        Currency {
          Name
          SmartContract
        }
        Side {
          Currency {
            Name
            SmartContract
          }
        }
        Dex {
          SmartContract
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_10min_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_3h_ago}}}
        )
      }
      amount: sum(of: Trade_Side_AmountInUSD)
      trades: count
    }
  }
}
```

```json
{
  "network": "bsc",
  "owner": "0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865",
  "base": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
  "time_10min_ago": "2025-04-10T09:03:33Z",
  "time_1h_ago": "2025-04-10T08:13:33Z",
  "time_3h_ago": "2025-04-10T06:13:33Z",
  "time_ago": "2025-04-07T09:13:33Z"
}
```