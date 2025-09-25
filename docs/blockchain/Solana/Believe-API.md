# Believe Launchpad API

import VideoPlayer from "../../../src/components/videoplayer.js";

## 🎯 What is Believe Launchpad?

The Believe Launchpad is a decentralized token launchpad built on the Solana blockchain that simplifies token creation and trading. It allows users to mint tokens directly through social media interactions (especially X/Twitter), making token creation accessible to everyone, even without technical expertise.

## Related APIs

- **[Meteora Dynamic Bonding Curve API](https://docs.bitquery.io/docs/blockchain/Solana/meteora-dynamic-bonding-curve-api/)** - Core DBC functionality
- **[Moonshot APIs](https://docs.bitquery.io/docs/blockchain/Solana/Moonshot-API/)** - Alternative launchpad
- **[FourMeme APIs](https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/)** - BSC-based token creation

## Pro Tips

- **Use the IDE**: The Bitquery IDE provides autocomplete and validation
- **Start Simple**: Begin with basic queries and gradually add complexity
- **Test Incrementally**: Build queries step by step, testing each addition
- **Contact Support**: Get help on [Telegram](https://t.me/Bloxy_info) for specific issues

:::note
`Trade Side Account` field will not be available for aggregate queries in Archive and Combined Datasets
:::

<head>
<title>Believe Launchpad API - Solana | Get Believe Tokens data</title>
  <meta name="title" content="Believe Launchpad API - Solana | Track Token Creations By Believe"/>
  <meta name="description" content="Get Believe Launchpad on-chain data of Meteora DBC Token Creations"/>
  <meta name="keywords" content="Believe Launchpad data API, Beleive protocol token creations api, Beleive protocol token launch api, Solana token launch data, Bitquery Solana API, Meteora DBC API, token creation analytics, trading fee claim data, creator earnings API, Solana bonding curve data, Believe Launchpad integration, token lifecycle Solana, crypto data API Solana, Bitquery Believe Launchpad endpoints, token launch tracking, token metadata Solana, decentralized token data, real-time Solana token stats, Solana API for token creation, claim fee API Believe, Bitquery IDE API examples
"/>
  <meta name="robots" content="index, follow"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="language" content="English"/>

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Believe Launchpad API - Solana | Track Token Creations By Believe"
/>
<meta
  property="og:description"
  content="Get Believe Launchpad on-chain data of Meteora DBC Token Creations"
/>

  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:title" content="Believe Launchpad API - Solana | Track Token Creations By Believe"/>
  <meta property="twitter:description" content="Get Believe Launchpad on-chain data of Meteora DBC Token Creations"/>
</head>

If you want fastest data without any latency, we can provide Kafka streams, please [fill this form](https://bitquery.io/forms/api) for it. Our Team will reach out.

## Track Token creation using Believe Launchpad on Meteora DBC in realtime

Use the stream: [Track Believe token creations on Meteora DBC (realtime) ➤](https://ide.bitquery.io/track-Token-creation-using-Believe-Protocol-on-Meteora-DBC-in-realtime_2). `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` is the address of Meteora DBC and `5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE` is the Believe Token Authority address, the address which is responsible for calling the instructions on Meteora DBC Program.

```graphql
subscription MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
          Accounts: {
            includes: {
              Address: { is: "5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE" }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

## Check when a Believe Launchpad token was created on Meteora DBC

Using below query, you can check when was a Believe Launchpad token created. Here we have taken the example of checking creation time and transaction signature of this token `GsVr8GdT57gBa6GxujrtAeRGmYbFfABGFk2eaG2DzBLV`. Note: we only have last 8 hours of Solana Instructions data so this query will not return anything for the Believe Launchpad token which was created more than 8 hours ago.
Run the query: [Get a Believe token's creation time and dev address? ➤](https://ide.bitquery.io/check-when-a-Believe-protocol-token-was-created-on-Meteora-DBC_1).

```
query MyQuery($tokenAddress: String!) {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {is: "initialize_virtual_pool_with_spl_token"}}, Accounts: {includes: {Address: {is: $tokenAddress }}}}, Transaction: {Result: {Success: true}, Signer: {is: "5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE"}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
{
  "tokenAddress": "GsVr8GdT57gBa6GxujrtAeRGmYbFfABGFk2eaG2DzBLV"
}
```

## Get the Believe Launchpad tokens which are graduated to Meteora

For checking which Believe tokens graduated, we need to get all the tokens created by Believe on Meteora DBC using this [Get All Token Creations by Believe - API](https://docs.bitquery.io/docs/blockchain/Solana/Believe-API/#get-latest-meteora-dbc-token-creations-using-believe-protocol) and then after getting all the token addresses put them in [Check if the Believe Tokens has Graduated - API](https://ide.bitquery.io/Check-if-the-tokens-have-migrated-from-Meteora-DBC_1) to check which of them graduated to Meteora.

```
query MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          Result: { Success: true }
          Signer: { is: "5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

Then put all the token addresses in the `$tokenAddresses` variable in the following query. Run it here: [Check if the tokens have migrated from Meteora DBC ➤](https://ide.bitquery.io/Check-if-the-tokens-have-migrated-from-Meteora-DBC_1).

```
query MyQuery($tokenAddresses: [String!]) {
  Solana {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"}, Method: {in: ["migrate_meteora_damm", "migration_damm_v2"]}}, Accounts: {includes: {Address: {in: $tokenAddresses}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
{
  "tokenAddresses":["3EX4yHYs25RXaNMBgaNtpGxPKvX73P9QWVw8fpNEhnow","2bzXpTCu3faGocjBKZvxv63yV3gnWDZYfH6mRVfGzbh8","Dpz6knqUSTfV2ESXqQvbiWVznzRPYSYivUtXT3TVpWkA"]
}
```

## Get latest Meteora DBC Token Creations using Believe Launchpad

Check this API: [Latest Believe token creations ➤](https://ide.bitquery.io/Token-creation-using-Believe-Protocol-on-Meteora-DBC#) to get the 10 latest Believe Launchpad created Tokens.

```graphql
query MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "initialize_virtual_pool_with_spl_token" }
          }
        }
        Transaction: {
          Result: { Success: true }
          Signer: { is: "5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```

## Get latest Claims of Creator Fees using Believe Launchpad

Check this query: [Latest creator trading fee claims (Believe) ➤](https://ide.bitquery.io/Claim-creator-trading-fee-using-Believe-Protocol-on-Meteora-DBC#) to get the most recent claims of creator trading fees via Believe Launchpad.

```graphql
query MyQuery {
  Solana {
    Instructions(
      where: {
        Instruction: {
          Program: {
            Address: { is: "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN" }
            Method: { is: "claim_creator_trading_fee" }
          }
        }
        Transaction: {
          Result: { Success: true }
          Signer: { is: "5qWya6UjwWnGVhdSBL3hyZ7B45jbk6Byt1hwd7ohEGXE" }
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Time
      }
      Instruction {
        Accounts {
          Token {
            ProgramId
            Owner
            Mint
          }
          IsWritable
          Address
        }
        Program {
          Parsed
          Name
          Method
          Arguments {
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
            Type
            Name
          }
          Address
          AccountNames
        }
      }
      Transaction {
        Fee
        FeeInUSD
        FeePayer
        Signature
      }
    }
  }
}
```
