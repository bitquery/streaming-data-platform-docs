---
sidebar_position: 7
---

# Arguments and Returns


Smart contract calls and events have arguments. In case the call or event signature is parsed against ABI,
the arguments are showing the values, types and names passed to call or event.

In addition, returns shows the return values from the smart contract calls.

Arguments and returns are represented by the same data structure. It is array, 
containing entries for each argument value. In case when the data type of argument
is array or emedded structure, the argument will have separate object for every 
value of array or structure.

It means that all argument values are flattened. To represent all possible cases, the following 
additional information is provided:

* Index - sequential index of argument value inside an array or strucutre
* Name - name of the argument or the name of the element of structure
* Type - the type of the argument
* Path - the array of top-level elements where the argument value is used. Each element of path have Name, Index, Type


As example, the following data means the array of size 2 of addresses:

```
          {
            "Index": 0,
            "Name": "",
            "Path": [
              {
                "Index": 2,
                "Name": "path",
                "Type": "address[]"
              }
            ],
            "Type": "address",
            "Value": {
              "__typename": "EVM_ABI_Address_Value_Arg",
              "address": "0x6c812ab49f4b350b9d115e3f367302cd4fb58bbf"
            }
          },
          {
            "Index": 1,
            "Name": "",
            "Path": [
              {
                "Index": 2,
                "Name": "path",
                "Type": "address[]"
              }
            ],
            "Type": "address",
            "Value": {
              "__typename": "EVM_ABI_Address_Value_Arg",
              "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            }
          },
```

meaning ```['0x6c812ab49f4b350b9d115e3f367302cd4fb58bbf','0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2']```

To query attribute values, use union as shown:

```graphql
Arguments {
        Index
        Name
        Type
        Path {
          Index
          Name
          Type
        }
        Value {
          __typename
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
```

Data types are mapped to this values by the following rules:

1. string, addresses, boolean are mapped directly to corresponding types (EVM_ABI_String_Value_Arg,EVM_ABI_Address_Value_Arg,EVM_ABI_Boolean_Value_Arg)
2. bytes and byte array of any pre-defined size ( such as byte[24]) mapped to hex bytes (EVM_ABI_Bytes_Value_Arg)
3. integers of size int8,16,32 and uint8,16 are mapped to integer (EVM_ABI_Integer_Value_Arg)
4. all other integers mapped to big integer represented as string ( possible negative ) (EVM_ABI_BigInt_Value_Arg)

## Filters on arguments

Arguments and returns are arrays, and this enables to use filtering on them as described on
[filters](/docs/graphql/filters/#array-filter-types).

For example, this query selects specific calls by applying filter to argument length
and to specific values of arguments.
Combining argument filters with signature filters on events and calls gives you the power
to analyse the arguments used in smart contracts in specific context.

```
{
  EVM {
    Calls(
      where: {
        Arguments: {
		  length: {eq: 2}
          includes: [
            {
            Index: {eq: 0}
            Name: {is: "recipient"}
            Value: {Address: {is: "0xa7f6ebbd4cdb249a2b999b7543aeb1f80bda7969"}}
           }
           {
            Name: {is: "amount"}
            Value: {BigInteger: {ge: "1000000000"}}
           }
          ]
        }
      }
      limit: {count: 10}) {
      Arguments {
        Index
        Name
        Type
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
      Call {
        Signature {
          Signature
        }
      }
    }
  }
}

```

The value of argument filter must be defined depending on the expected argument type.
There are the following options:

* BigInteger - for uint256/int256/int64/uint64 arguments
* Address - for addresses, 0x prefixed
* String - for strings
* Boolean - for boolean, just true/false
* UnsignedInteger - for uint8/16/32
* SignedInteger - int8/16/32
* Bytes - for bytes, 0x prefixed optional


:::note
filters affect the whole query to calls / events, so you anyway can query all arguments,
not just which pass the filter.
:::
