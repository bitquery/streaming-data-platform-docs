---
sidebar_position: 7
---

# Base Zora API

This section provides you with a set of APIs and streams that provides an insight about the Zora LaunchPad.
If you have any question on other data points reach out to [support](https://t.me/Bloxy_info)


:::note
To query or stream data via graphQL **outside the Bitquery IDE**, you need to generate an API access token.

Follow the steps here to create one: [How to generate Bitquery API token ➤](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
:::

## Get Newly Created Zora Tokens

[This](https://ide.bitquery.io/Newly-created-zora-tokens#) API returns the list of newly created tokens on Zora Launchpad. You can also stream the latest tokens created in real time using [this](https://ide.bitquery.io/Newly-created-zora-tokens-stream) subscription.

```graphql
{
  EVM(network: base) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Call: {Create: true}, Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}, Amount: {eq: "1000000000"}}, Transaction: {To: {is: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"}}}
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

## Latest Trades on Zora

[This](https://ide.bitquery.io/Latest-Trades-on-Zora) API returns the latest trades on Zora launchpad by tracking the `calls` with the Signature_Name as `swap` to the Zora smart contract address, which is `0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789`. You can also track trades in real time using [this](https://ide.bitquery.io/Latest-Trades-on-Zora-stream) subscription.

The results returned from the query contains:

- **Pool Address** : The first address type returned from the list of arguments.
- **Token 0 Address** : The second address type returned from the list of arguments.
- **Token 1 Address** : The third address type returned from the list of arguments.
- **Trader Address** : The address returned from `Transaction_From`.

```graphql
query MyQuery {
  EVM(network: base) {
    Calls(
      where: {Transaction: {To: {is: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789"}}, Call: {Signature: {Name: {is: "swap"}}}, TransactionStatus: {Success: true}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Block {
        Time
      }
      Arguments {
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
      Transaction {
        From
      }
    }
  }
}
```