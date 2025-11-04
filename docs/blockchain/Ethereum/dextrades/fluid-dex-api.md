# Fluid DEX API

Fluid DEX is a decentralized exchange protocol built on Ethereum and other EVM chains. Bitquery's APIs support tracking Fluid DEX vault positions, events, and contract interactions in real-time and across historical data.

You can get data on other EVM chains like Base, Arbitrum, and Polygon by changing the contract address based on the [Fluid contracts deployments](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md) and the `network` parameter

## New Position Mint on Fluid Vault Factory

Track new position mints on the Fluid DEX Vault Factory contract. This query monitors the `NewPositionMinted` event which is emitted when a new position is created on the vault factory.

[Run Query](https://ide.bitquery.io/new-position-mints-on-Fluid-DEX-Vault) | [Run Stream](https://ide.bitquery.io/stream-new-position-mints-on-Fluid-DEX-Vault)

```graphql
{
  EVM(dataset: realtime, network: eth) {
    Events(
      limit: {count: 20}
      where: {
        Log: {
          Signature: {Name: {is: "NewPositionMinted"}}
          SmartContract: {is: "0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d"}
        }
      }
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
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

## Recent Transfers to a Fluid Token Vault

Track all recent token transfers to a specific Fluid DEX vault. This query is useful for monitoring deposits and liquidity flows into a particular vault.

[Run Query](https://ide.bitquery.io/Recent-Transfers-to-cbBTC-Fluid-Vault)

**Example Vault Address:** `0x5dae640956711E11016C1b27CF9968Ba5B4a69CC` (cbBTC Fluid Vault)

```graphql
query RecentTransfers {
  EVM(dataset: realtime, network: eth) {
    Transfers(
      where: {
        Transaction: {To: {is: "0x5dae640956711E11016C1b27CF9968Ba5B4a69CC"}}
      }
      orderBy: {descending: Block_Number}
      limit: {count: 100}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
      }
      Transfer {
        Amount
        Sender
        Receiver
        Currency {
          Symbol
          Name
          SmartContract
        }
      }
    }
  }
}
```

## All Events on Fluid Vault Factory Contract

Get a comprehensive list of all events emitted by the Fluid DEX Vault Factory contract. This query aggregates event counts by signature to identify which events are most frequently emitted, helping you understand the contract's activity patterns.

[Run Query](https://ide.bitquery.io/all-events-on-fluid-DEX-VaultFactory)

**VaultFactory Address:** `0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d`

```graphql
{
  EVM(dataset: archive, network: eth) {
    Events(
      limit: {count: 20}
      where: {
        Log: {
          SmartContract: {is: "0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d"}
        }
      }
      orderBy: {descendingByField: "txc"}
    ) {
      txc: count
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
    }
  }
}
```
