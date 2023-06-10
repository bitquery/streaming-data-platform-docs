---
sidebar_position: 4
---

# NFT Calls API
This API helps retrieve information about smart contract transactions, including details about the contract function that was called, the input and output parameters, and more. 

## Latest Calls for an NFT

Here's an example query that retrieve the most recent smart contract calls made on an NFT token contract. 

```graphql 
{
  EVM {
    Calls(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Call: {To: {is: "0x60e4d786628fea6478f785a6d7e704777c86a7c6"}}}
    ) {
      Call {
        From
        Gas
        GasUsed
        To
        Value
      }
      Transaction {
        Hash
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
**Parameters**

-   `orderBy` : Orders the results in descending order based on the Block_Time.
-   `limit` : Specifies the maximum results to return. In this query, the limit is 10.
-   `where` :  It filters the results to include only calls made to the smart contract with the specified address ("0x60e4d786628fea6478f785a6d7e704777c86a7c6").

**Returned Data**

-   `Transaction` : The `Hash` field represents the hash of the transaction.
-   `Call` : Retrieves information about the call -
      * `From`: The address from which the call was made.
      * `Gas`: The gas limit specified for the call.
      * `GasUsed`: The amount of gas used during the call.
      * `To` : The address of the NFT token contract that received the call.
      * `Value` : The amount of Ether transferred in the call.
-   `Arguments { Name Value {....} }` : Retrieves Array of arguments passed in the smart contract call, including their names and values, refer to [arguments](/docs/evm/arguments) for data structure.

You can find the graphql query [here](https://ide.bitquery.io/Smart-contract-calls-to-an-nft-contract).