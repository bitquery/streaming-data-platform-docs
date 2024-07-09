# esGMX (Escrowed) and vGLP (Vested) API 

When a wallet stakes GMX tokens in the GMX protocol, they are escrowed and earn Escrowed GMX (esGMX) tokens as rewards.

"GMX Rewards provide benefits for long-term users of the protocol; these rewards come in the form of Escrowed GMX and Multiplier Points."

The GLP pool is where all trades on the platform are settled. Regardless of trading outcomes, GLP holders are rewarded with 70% of platform fees, offering a substantial yield opportunity based on revenue rather than token emissions.

This section covers how to retrieve staking information on esGMX and vGLP.

## Latest esGMX Transfers

The following query retrieves the latest esGMX transfers on the Arbitrum network:

```graphql
{
  EVM(network: arbitrum) {
    Events(
      where: {
        Log: {
          SmartContract: { is: "0xf42ae1d54fd613c9bb14810b0588faaa09a426ca" }, 
          Signature: { Name: { is: "Transfer" } }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 10 }
    ) {
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
        }
      }
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

## Latest esGMX Claims

The following query retrieves the latest esGMX claims on the Arbitrum network:

[Run the query here](https://ide.bitquery.io/latest-esGMX-Claims)

```graphql
{
  EVM(network: arbitrum, dataset: archive) {
    Calls(
      limit: { count: 100 }
      where: {
        Call: {
          To: { is: "0xf42ae1d54fd613c9bb14810b0588faaa09a426ca" },
          Signature: { Name: { is: "claim" } }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
      Call {
        Signature {
          Name
        }
        To
      }
      Transaction {
        Hash
        From
        Cost
        Gas
        To
      }
      Block {
        Time
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
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
    }
  }
}
```

## Latest vGLP Withdrawals

The following query retrieves the latest vGLP withdrawals on the Arbitrum network:

[Run the query here](https://ide.bitquery.io/latest-vGLP-Withdraw-Events)

```graphql
{
  EVM(network: arbitrum, dataset: archive) {
    Events(
      where: {
        Log: {
          Signature: { Name: { is: "Withdraw" } },
          SmartContract: { is: "0xa75287d2f8b217273e7fcd7e86ef07d33972042e" }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
    ) {
      Arguments {
        Name
        Type
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
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
```

## Latest vGLP Deposits

The following query retrieves the latest vGLP deposits on the Arbitrum network:

[Run the query here](https://ide.bitquery.io/latest-vGLP-Deposit-Events)

```graphql
{
  EVM(network: arbitrum, dataset: archive) {
    Events(
      where: {
        Log: {
          Signature: { Name: { is: "Deposit" } },
          SmartContract: { is: "0xa75287d2f8b217273e7fcd7e86ef07d33972042e" }
        }
      }
      orderBy: { descending: Block_Time }
      limit: { count: 100 }
    ) {
      Arguments {
        Name
        Type
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
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Block {
        Time
      }
      Transaction {
        Hash
      }
      Log {
        Signature {
          Name
        }
      }
    }
  }
}
```