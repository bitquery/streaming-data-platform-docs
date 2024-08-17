# debug_traceTransaction

debug_traceTransaction is a JSON RPC method that returns tracing results for the specified transaction. In this section, we are looking for a way to build an alternative for the same using Bitquery API.

<head>
  <meta name="title" content="debug_traceTransaction API - Ethereum - Transaction Execution Trace"/>
  <meta name="description" content="Trace the execution of a specific transaction on the Ethereum blockchain using the debug_traceTransaction API."/>
  <meta name="keywords" content="debug_traceTransaction API,Ethereum transaction trace API,Ethereum smart contract trace API,debug_traceTransaction documentation,transaction execution trace,blockchain API,Ethereum web3 API,trace data"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Trace Ethereum Transaction Execution with debug_traceTransaction API"
  />
  <meta
    property="og:description"
    content="Trace the execution of a specific transaction on the Ethereum blockchain using the debug_traceTransaction API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Trace Ethereum Transaction Execution with debug_traceTransaction API"/>
  <meta property="twitter:description" content="Trace the execution of a specific transaction on the Ethereum blockchain using the debug_traceTransaction API."/>
</head>

# Debug Trace Transaction

To trace a transaction using the debug_traceTransaction we need the `transaction hash`. We are using [this](https://ide.bitquery.io/debug_traceTransaction) API given below for tracing the transaction, with transaction hash as `0x4fe59dcf4f834f17acdcd0f244538c119523009ce47817ccd56423404ba34ffa`.

``` graphql

query MyQuery {
  EVM {
    Calls(
      where: {
        Transaction: {
          Hash: {
            is: "0x4fe59dcf4f834f17acdcd0f244538c119523009ce47817ccd56423404ba34ffa"
          }
        }
      }
    ) {
      Call {
        From
        Gas
        GasUsed
        Input
        Output
        To
        Value
        InternalCalls
        Error
        Create
      }
    }
  }
}

```

## Response Recieved

The response from running the above API is given below, and returns.

- `Create` - (boolean) If the transaction is a smart contract creation or not.
- `From` - The address from which the transaction originated.
- `To` - The address to which the transaction is sent.
- `Gas` - Gas provided for the transaction in `WEI`.
- `GasUsed` - Gas used in the transaction in `WEI`.
- `Input` - Call Data.
- `Output` - Data Returned.
- `Value` - Amount of value transfer.
- `Error` - Error string (if any), otherwise an empty string.
- `InternalCalls` - Number of sub-calls.

``` json
{
  "EVM": {
    "Calls": [
      {
        "Call": {
          "Create": false,
          "Error": "",
          "From": "0xd2241065700f763d0390725d00bfd3fbef0b525e",
          "Gas": "120748",
          "GasUsed": "87170",
          "Input": "0x42842e0e000000000000000000000000d2241065700f763d0390725d00bfd3fbef0b525e000000000000000000000000ad6df549cc5c3427fe2c54207620e3555c4350aa000000000000000000000000000000000000000000000000000000000000057e",
          "InternalCalls": 0,
          "Output": "0x",
          "To": "0xbb3f21dd9b16741e9822392f753d07da4c6b6cd6",
          "Value": "0.000000000000000000"
        }
      }
    ]
  }
}

```