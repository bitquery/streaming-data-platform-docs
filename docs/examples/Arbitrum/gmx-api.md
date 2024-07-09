# GMX API

You can read more about the [GMX ecosystem in this blog](https://bitquery.io/blog/gmx)

## New Positions by Trader

```
{
  EVM(dataset: archive, network: arbitrum) {
    Events(
      where: {Log: {SmartContract: {is: "0x489ee077994B6658eAfA855C308275EAd8097C4A"}, Signature: {Name: {is: "IncreasePosition"}}}, Arguments: {includes: {Name: {is: "account"}, Value: {Address: {is: "0x92812499fF2c040f93121Aab684680a6e603C4A7"}}}}}
      orderBy: {descending: Block_Time}
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
      }
      Arguments {
        Name
        Type
        Value {
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
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Block {
        Time
      }
    }
  }
}

```
## Latest GMX Events

You can run the query [here](https://ide.bitquery.io/latest-GMX-Events)

```
{
  EVM(network: arbitrum) {
    Events(
      where: {Log: {SmartContract: {is: "0x489ee077994B6658eAfA855C308275EAd8097C4A"}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Log {
        Signature {
          Name
          Parsed
          Signature
        }
      }
      Arguments {
        Name
        Type
        Value {
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
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
        }
      }
      Block {
        Time
      }
    }
  }
}

```