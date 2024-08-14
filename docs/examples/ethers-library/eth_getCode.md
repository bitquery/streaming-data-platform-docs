# eth_getCode

In this section we will build a query that serves as an alternative to the eth_getCode JSON RPC method. However unlike the method that requires two arameters, namely `address` and `block number`, this API only needs an `address`.

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