# Boop Fun API

import VideoPlayer from "../../../src/components/videoplayer.js";

In this document, we will explore several examples related to Boop fun data. We also have [Raydium Launchpad APIs](https://docs.bitquery.io/docs/blockchain/Solana/launchpad-raydium/).
Additionally, you can also check out our [Moonshot APIs](https://docs.bitquery.io/docs/blockchain/Solana/Moonshot-API/), [FourMeme APIs](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/).
These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on [telegram](https://t.me/Bloxy_info).

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

<head>
  <meta name="title" content="Boop Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta name="description" content="Get on-chain data of any Boop.fun based token through our Boop.fun API."/>
  <meta name="keywords" content="Boop.fun API,Boop.fun on-chain data API,Boop.fun token data API,Boop.fun blockchain API,Boop.fun DEX data API,Boop.fun API documentation,Boop.fun crypto API,Boop.fun web3 API,DEX Trades,Solana,Blast,Boop.fun memecoins,Solana DEX,Blast DEX,token trading,blockchain data,crypto trading"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Boop Fun API - Solana - Tokens, Trades, Live Prices"
/>
<meta
  property="og:description"
  content="Get on-chain data of any Boop.fun based token through our Boop.fun API."
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Boop Fun API - Solana - Tokens, Trades, Live Prices"/>
  <meta property="twitter:description" content="Get on-chain data of any Boop.fun based token through our Boop.fun API."/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Get the latest Boop.Fun token migrations

Below query can be used to track Boop.fun token migrations. In this query we are getting 10 latest Boop.fun migrations. Change the `query` keyword to `subscription` keyword then it will act as a websocket and will keep on running and give you the realtime migrations.

Try the query [here](https://ide.bitquery.io/Boopfun-token-migrations)

```
query MyQuery {
  Solana {
    Instructions(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Address: {is: "boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4"}, Method: {is: "graduate"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
      Instruction {
        Accounts {
          IsWritable
          Address
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
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
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          Method
          Name
        }
      }
    }
  }
}
```

## Latest Boop.fun token buys

You can track latest buy trades on Boop.Fun using the below API. Try the API [here](https://ide.bitquery.io/latest-boopfun-token-buys#).

```
query MyQuery {
  Solana {
    Instructions(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Address: {is: "boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4"}, Method: {is: "buy_token"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
      Instruction {
        Accounts {
          IsWritable
          Address
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
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
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          Method
          Name
        }
      }
    }
  }
}
```

## Latest Boop.fun token sells

You can track latest sell trades on Boop.Fun using the below API. Try the API [here](https://ide.bitquery.io/latest-boopfun-token-sells#).

```
query MyQuery {
  Solana {
    Instructions(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Address: {is: "boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4"}, Method: {is: "sell_token"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
      Instruction {
        Accounts {
          IsWritable
          Address
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
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
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          Method
          Name
        }
      }
    }
  }
}
```

## Latest Boop.fun token creation

You can track latest token launches on Boop.Fun using the below API. Try the API [here](https://ide.bitquery.io/latest-boopfun-token-creations#).

```
query MyQuery {
  Solana {
    Instructions(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {Transaction: {Result: {Success: true}}, Instruction: {Program: {Address: {is: "boop8hVGQGqehUK2iVEMEnMrL5RbjywRzHKBmBE7ry4"}, Method: {is: "create_token"}}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
        Signer
      }
      Instruction {
        Accounts {
          IsWritable
          Address
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Arguments {
            Name
            Type
            Value {
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
              ... on Solana_ABI_Address_Value_Arg {
                address
              }
              ... on Solana_ABI_String_Value_Arg {
                string
              }
              ... on Solana_ABI_Integer_Value_Arg {
                integer
              }
            }
          }
          Method
          Name
        }
      }
    }
  }
}

```
