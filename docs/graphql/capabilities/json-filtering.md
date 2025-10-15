# Filtering JSON Arguments

Starting October 2025, we support filtering of JSON arguments in Solana instructions. This feature allows you to query blockchain data based on the parsed argument values within program instructions.

## Overview

JSON filtering enables you to filter Solana instructions by the values contained in their program arguments. This is particularly useful when you need to:

- Find specific method calls with particular parameter values
- Track authority changes on token accounts
- Monitor transactions with specific argument patterns
- Filter instructions based on complex argument conditions

## Example: Filtering setAuthority Instructions

The following query demonstrates how to filter `setAuthority` method calls where the `authorityType` argument is either "0" or "1":

```graphql
{
  Solana(network: solana) {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Method: {is: "setAuthority"}
            Arguments: {
              includes: {
                Name: {is: "authorityType"}
                Value: {Json: {in: ["0", "1"]}}
              }
            }
          }
        }
        Transaction: {Result: {Success: true}}
      }
      limit: {count: 10}
      orderBy: {descending: Block_Slot}
    ) {
      Instruction {
        Program {
          Method
          Arguments {
            Name
            Value {
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
            }
          }
        }
        Accounts {
          Address
        }
      }
      Transaction {
        Signature
      }
    }
  }
}
```

### Query Breakdown

**Filtering Conditions:**
- `Method: {is: "setAuthority"}` - Only returns instructions calling the `setAuthority` method
- `Arguments: {includes: {...}}` - Filters arguments array to include entries matching the specified criteria
- `Name: {is: "authorityType"}` - Looks for an argument named "authorityType"
- `Value: {Json: {in: ["0", "1"]}}` - Checks if the JSON value is either "0" or "1"
- `Transaction: {Result: {Success: true}}` - Only includes successful transactions

**Return Fields:**
- `Method` - The program method name
- `Arguments` - Array of argument name-value pairs
- `Accounts` - Array of account addresses involved in the instruction
- `Transaction.Signature` - The transaction signature


## Filtering Options

### JSON Value Operators

When filtering JSON arguments, you can use various operators:

- `in: [value1, value2, ...]` - Matches if the JSON value is in the provided array
- `is: "value"` - Exact match
- `notIn: [value1, value2, ...]` - Matches if the JSON value is not in the provided array

### Argument Filtering

The `includes` operator checks if the arguments array contains an entry matching all specified conditions:

```graphql
Arguments: {
  includes: {
    Name: {is: "parameterName"}
    Value: {Json: {in: ["value1", "value2"]}}
  }
}
```

## Use Cases

### 1. Track Authority Revocations

Find all instances where token authorities are being revoked (set to null):

```graphql
Arguments: {
  includes: {
    Name: {is: "newAuthority"}
    Value: {Json: {is: "null"}}
  }
}
```

### 2. Monitor Specific Authority Types

Filter by different authority types:
- `authorityType: "0"` - Mint tokens authority
- `authorityType: "1"` - Freeze account authority
- `authorityType: "2"` - Account owner authority
- `authorityType: "3"` - Close account authority

### 3. Combine Multiple Conditions

You can combine multiple argument filters to create complex queries:

```graphql
Arguments: {
  includes: [
    {Name: {is: "authorityType"}, Value: {Json: {is: "0"}}}
    {Name: {is: "newAuthority"}, Value: {Json: {is: "null"}}}
  ]
}
```



