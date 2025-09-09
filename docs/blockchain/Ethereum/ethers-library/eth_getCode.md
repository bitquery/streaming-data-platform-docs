# eth_getCode

In this section we will build a query that serves as an alternative to the eth_getCode JSON RPC method. However unlike the method that requires two arameters, namely `address` and `block number`, this API only needs an `address`.

<head>
  <meta name="title" content="eth_getCode API - Ethereum - Smart Contract Bytecode"/>
  <meta name="description" content="Retrieve the bytecode of a smart contract deployed on the Ethereum blockchain using the eth_getCode API."/>
  <meta name="keywords" content="eth_getCode API,Ethereum smart contract API,Ethereum bytecode API,eth_getCode documentation,smart contract code,blockchain API,Ethereum web3 API,contract data"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Retrieve Ethereum Smart Contract Bytecode with eth_getCode API"
  />
  <meta
    property="og:description"
    content="Retrieve the bytecode of a smart contract deployed on the Ethereum blockchain using the eth_getCode API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Retrieve Ethereum Smart Contract Bytecode with eth_getCode API"/>
  <meta property="twitter:description" content="Retrieve the bytecode of a smart contract deployed on the Ethereum blockchain using the eth_getCode API."/>
</head>

The [below](https://ide.bitquery.io/eth_getCode) query serves as the alternative API to the method, with address as `0xc923D39fA2d97fb4B660Fc66DAdB1421605975E0`.

``` graphql

{
  EVM(dataset: archive, network: eth) {
    creates: Calls(
      where: {
        Call: {
          To: {
            is: "0xc923D39fA2d97fb4B660Fc66DAdB1421605975E0"
          },
          Create: true
        }
      }
    ) {
      Call {
        Output
      }
    }
  }
}

```