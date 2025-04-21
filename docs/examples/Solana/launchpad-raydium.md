# Raydium Launchpad API

In this section we see how to get data on Launchpad by Raydium. This includes token creation, latest trades by trader, for a token etc.

These APIs can be provided through different streams including Kafka for zero latency requirements. Please contact us on telegram.

<head>
  <meta name="title" content="Raydium Launchpad API - Solana On-Chain Token & Trade Data" />
  <meta name="description" content="Access real-time on-chain data for Raydium Launchpad tokens using the Bitquery-powered Raydium Launchpad API. Track trades, liquidity, token prices, and more on Solana." />
  <meta name="keywords" content="Raydium Launchpad API,Raydium token data,Solana API,Raydium on-chain data,Raydium DEX API,Solana Launchpad tokens,Raydium AcceleRaytor,Raydium LaunchLab,Bitquery API,crypto trading API,Solana memecoins,Raydium blockchain data,token analytics API" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Raydium Launchpad API - Solana On-Chain Token & Trade Data" />
  <meta property="og:description" content="Explore token analytics and real-time data from Raydium Launchpad projects on Solana with the Bitquery API." />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Raydium Launchpad API - Token & Trade Data on Solana" />
  <meta property="twitter:description" content="Monitor token trades, prices, and liquidity for Raydium Launchpad projects using Bitquery's on-chain API." />
</head>

## Latest Pools Created on Launchpad

We will use the `PoolCreateEvent` method to filter latest pools on Launchpad. The `Argument` filed includes more information about the pool like `base_mint_param`( token details), `curve_param`( bonding curve details) and `vesting_param` ( cliff period, amount locked etc).

You can run the query [here](https://ide.bitquery.io/Launchpad-latest-pool-created)

```

{
  Solana(network: solana, dataset: realtime) {
    Instructions(
      where: {Instruction: {Program: {Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}, Method: {is: "PoolCreateEvent"}}}}
      orderBy: {descending: Block_Time}
    ) {
      Instruction {
        Accounts {
          Address
        }
        Program {
          Name
          Method
          AccountNames
          Arguments {
            Name
            Type
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
              ... on Solana_ABI_BigInt_Value_Arg {
                bigInteger
              }
              ... on Solana_ABI_Bytes_Value_Arg {
                hex
              }
              ... on Solana_ABI_Boolean_Value_Arg {
                bool
              }
              ... on Solana_ABI_Float_Value_Arg {
                float
              }
              ... on Solana_ABI_Json_Value_Arg {
                json
              }
            }
          }
        }
      }
    }
  }
}

```
