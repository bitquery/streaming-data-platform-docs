# debug_traceCall

In this section, we will discuss how we can use Bitquery APIs as an alternative to the debug_traceCall JSON RPC method, which runs an eth_call within the context of the given block execution using the final state of parent block as the base.

<head>
  <meta name="title" content="debug_traceCall API - Ethereum - Transaction Execution Tracing"/>
  <meta name="description" content="Trace the execution of a smart contract function call on the Ethereum blockchain using the debug_traceCall API."/>
  <meta name="keywords" content="debug_traceCall API,Ethereum transaction tracing API,Ethereum smart contract tracing API,debug_traceCall documentation,smart contract execution,blockchain API,Ethereum web3 API,execution trace"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Trace Ethereum Smart Contract Execution with debug_traceCall API"
  />
  <meta
    property="og:description"
    content="Trace the execution of a smart contract function call on the Ethereum blockchain using the debug_traceCall API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Trace Ethereum Smart Contract Execution with debug_traceCall API"/>
  <meta property="twitter:description" content="Trace the execution of a smart contract function call on the Ethereum blockchain using the debug_traceCall API."/>
</head>

## Trace Calls with Reciever Address
Using [this](https://ide.bitquery.io/debug_traceCall) query, you can trace all the calls sent to the address, and get details like the following.
- Chain ID
- From
- To
- Input
- Output
- Gas - Available Gas in `WEI`.
- Gas Used - Gas utilised in `WEI`.
- Value - `Value` sent in the call in `WEI`.
- Create - Whether the Call is `create` or not. 

``` graphql

query MyQuery {
  EVM(dataset: combined) {
    Calls(
        where: {
            Call: {
                To: {
                    is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                }
            }
        }
    ){
      ChainId
      Call {
        From
        Gas
        GasUsed
        Input
        Output
        To
        Value
        Create
      }
    }
  }
}

```

## Additional Filters

Just like the debug_traceCall method, we can provide additional filters like the following.

### Trace Call with Known Sender
[This](https://ide.bitquery.io/debug_traceCall_1) API provides an option to trace out the calls from a known address, which is, `0xebfb684dd2b01e698ca6c14f10e4f289934a54d6` in this example.

``` graphql

query MyQuery {
  EVM(dataset: combined) {
    Calls(
      where: {
        Call: {
          From:{
            is: "0xebfb684dd2b01e698ca6c14f10e4f289934a54d6"
          },
          To: {
            is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          }
        }
      }
    ) {
      ChainId
      Call {
        From
        Gas
        GasUsed
        Input
        Output
        To
        Value
        Create
      }
    }
  }
}

```

### Filtering Calls by Value

Unlike the JSON RPC method where the value the value has to be fixed, we provide flexible options like the listed below.
- `eq` - Equal To.
- `ne` - Not Equal To.
- `ge` - Greater Than or Equal To.
- `le` - Less Than or Equal To.
- `gt` - Greater Than.
- `lt` - Less Than.

[This](https://ide.bitquery.io/debug_traceCall_2) query returns the calls where the value is non-zero.

``` graphql

query MyQuery {
  EVM(dataset: combined) {
    Calls(
      where: {
        Call: {
          Value:{
            ne: "0"
          },
          To: {
            is: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          }
        }
      }
    ) {
      ChainId
      Call {
        From
        Gas
        GasUsed
        Input
        Output
        To
        Value
        Create
      }
    }
  }
}

```