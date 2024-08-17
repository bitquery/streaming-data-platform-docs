# eth_getLogs

In this section, we will see how we can use Bitquery APIs as an alternative to the eth_getLogs JSON RPC method and return an array of `Logs` object matching the filter object(*optional). 

<head>
  <meta name="title" content="eth_getLogs API - Ethereum - Transaction Logs and Events"/>
  <meta name="description" content="Retrieve logs and events from transactions on the Ethereum blockchain using the eth_getLogs API."/>
  <meta name="keywords" content="eth_getLogs API,Ethereum logs API,Ethereum transaction logs API,eth_getLogs documentation,blockchain events,smart contract events,blockchain API,Ethereum web3 API,transaction data"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="How to Retrieve Ethereum Transaction Logs and Events with eth_getLogs API"
  />
  <meta
    property="og:description"
    content="Retrieve logs and events from transactions on the Ethereum blockchain using the eth_getLogs API."
  />

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="How to Retrieve Ethereum Transaction Logs and Events with eth_getLogs API"/>
  <meta property="twitter:description" content="Retrieve logs and events from transactions on the Ethereum blockchain using the eth_getLogs API."/>
</head>

The Logs object consist of the following data.

- `removed`: (boolean) true when the log was removed, due to a chain reorganization. false if it's a valid log.
- `logIndex`: Log index position in the block. Null when it is a pending log.
- `transactionIndex`: Hexadecimal of the transactions index position from which the log created. Null when it is a pending log.
- `transactionHash`: 32 bytes. Hash of the transactions from which this log was created. Null when it is a pending log.
- `blockHash`: 32 bytes. Hash of the block where this log was in. Null when it is a pending log.
- `blockNumber`: Block number where this log was in. Null when it is a pending log.
- `address`: 20 bytes. Address from which this log originated.
- `data`: Contains one or more 32-bytes non-indexed arguments of the log.
- `topics`: An array of 0 to 4 indexed log arguments, each 32 bytes.

## Get Latest Logs
[This](https://ide.bitquery.io/eth_getLogs_1) subscription API returns the stream of thelatest logs for the `Ethereum Mainnet`. Now note that there is currently no filter in place.

``` graphql

subscription {
  EVM {
    Events {
      Block {
        Hash
        Number
      }
      Transaction {
        Hash
        Index
      }
      LogHeader {
        Address
        Data
        Index
        Removed
      }
      Topics {
        Hash
      }
    }
  }
}

```

## Get Logs with Filteration

Now, just like the orignal eth_getLogs method, Bitquery APIs provides the option to filter out the `Logs` based on the following parameeters.

- `address`: (optional) Contract address (20 bytes) or a list of addresses from which logs should originate.
- `topics`: (optional) Array of 32 bytes DATA topics. Topics are order-dependent.
- `blockhash`: (optional) Restricts the logs returned to the single block referenced in the 32-byte hash blockHash.

### Get Logs Originated From an Address
[This](https://ide.bitquery.io/eth_getLogs-with-filters) API returns the logs originated from a fixed address, which is `0x7d4a7be025652995364e0e232063abd9e8d65e6e` in this case. Also, unlike the JSON RPC method you can fiter out the `Logs` from multiple addresses using [this](https://ide.bitquery.io/eth_getLogs-with-filters_1) API.

``` graphql

{
  EVM {
    Events(
      where: {LogHeader: {Address: {is: "0x7d4a7be025652995364e0e232063abd9e8d65e6e"}}}
      limit: {count: 10}
    ) {
      Block {
        Hash
        Number
      }
      Transaction {
        Hash
        Index
      }
      LogHeader {
        Address
        Data
        Index
        Removed
      }
      Topics {
        Hash
      }
    }
  }
}

```

### Filter Logs on Topics

[This](https://ide.bitquery.io/eth_getLogs-with-filters_2) query filters outs the `Logs` based on the `topics`. Also, [this](https://ide.bitquery.io/eth_getLogs-with-filters_3) query filters out the Logs based on multiple `Topics`. 

``` graphql

{
  EVM {
    Events(
      where: {
      Topics: {
        includes: {
          Hash: {
            is:"e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
          }
        }
      }
    }
    ) {
      Block {
        Hash
        Number
      }
      Transaction {
        Hash
        Index
      }
      LogHeader {
        Address
        Data
        Index
        Removed
      }
      Topics {
        Hash
      }
    }
  }
}

```

### Get Logs from a Block

Using [this](https://ide.bitquery.io/eth_getLogs-with-filters_4) query, you can get the `logs` that belong to a particular `block` by using `blockHash` as a filter. Here `0xa0e1c15b905f4ed6f4e466b2693791ffc6be6ccd3a2a95d403585799ab5fecd9` is the parameter used for filteration.

``` graphql 

{
  EVM {
    Events(
      where: {
        Block: {
          Hash: {
            is: "0xa0e1c15b905f4ed6f4e466b2693791ffc6be6ccd3a2a95d403585799ab5fecd9"
          }
        }
      }
    ) {
      Block {
        Hash
        Number
      }
      Transaction {
        Hash
        Index
      }
      LogHeader {
        Address
        Data
        Index
        Removed
      }
      Topics {
        Hash
      }
    }
  }
}

```