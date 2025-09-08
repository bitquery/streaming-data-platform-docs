---
sidebar_position: 2
---

# Solana DEX Pools API

In this section we will see how to get Solana DEX Pools information using our API.

<head>
<meta name="title" content="Solana DEX Pools API | Get Liquidity Data of the Pools"/>
<meta name="description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."/>
<meta name="keywords" content="Solana DEX Pools api,Solana DEX Pools python api,Solana DEX Pools token api,Solana Dex NFT api, DEX Trades scan api, DEX Pools api, DEX Pools api docs, DEX Pools crypto api, DEX Pools blockchain api,solana network api, solana web3 api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="Solana DEX Pools API | Get Liquidity Data of the Pools"
/>
<meta
  property="og:description"
  content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana DEX Pools API | Get Liquidity Data of the Pools" />
<meta property="twitter:description" content="Get on-chain data of liquidity pools and trading pairs from any Solana based DEX like Raydium, Jupiter, Phoenix etc through our DEX Pools API." />
</head>

## Get all Liquidity Pools updates on Solana

To get all Liquidity pools updates on solana use [this stream](https://ide.bitquery.io/solana-dex-pools-update-stream).

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools {
      Block {
        Time
      }
      Pool {
        Base {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Quote {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Dex {
          ProgramAddress
          ProtocolFamily
        }
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            MintAddress
            Name
            Symbol
          }
          MarketAddress
        }
      }
    }
  }
}
```

</details>

## Get Tokens which have liquidity over 1 Million USD

You can use the below query to get the tokens which are getting traded and have liquidity over 1 million USD. Try out the query [here](https://ide.bitquery.io/Search-tokens-with-liquidity-over-1-million#).

<details>
  <summary>Click to expand GraphQL query</summary>

```
subscription MyQuery {
  Solana {
    DEXPools(
      where: {Pool: {Base: {PostAmountInUSD: {ge: "1000000"}}, Market: {QuoteCurrency: {MintAddress: {in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112"]}}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time
      }
      Transaction {
        Signature
      }
      Pool {
        Base {
          PostAmount
          PostAmountInUSD
          Price
          PriceInUSD
        }
        Quote{
          PostAmount
          PostAmountInUSD
        }
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            Name
            MintAddress
            Symbol
          }
        }
        Dex {
          ProtocolFamily
          ProgramAddress
          ProtocolName
        }
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          QuoteCurrency {
            Name
            MintAddress
            Symbol
          }
        }
      }
    }
  }
}

```

</details>

## Get All Liquidity Pools info for a particular token

This query will give you the information on all the liquidity pools of a particular token `EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm`.
You can find the query [here](https://ide.bitquery.io/get-all-the-liquidity-pools-info-for-a-particular-token_1)

<details>
  <summary>Click to expand GraphQL query</summary>

```
query ($token: String) {
  Solana {
    DEXPools(
      orderBy: {descendingByField: "Pool_Quote_PostAmountInUSD_maximum"}
      where: {Pool: {Market: {BaseCurrency: {MintAddress: {is: $token}}}}}
    ) {
      Pool {
        Market {
          QuoteCurrency {
            Symbol
            Name
            MintAddress
          }
          MarketAddress
        }
        Dex {
          ProtocolFamily
        }
        Base {
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
        Quote {
          PostAmount(maximum: Block_Slot)
          PostAmountInUSD(maximum: Block_Slot)
        }
      }
    }
  }
}
{
  "token": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
}
```

</details>

![image](https://github.com/user-attachments/assets/21882e2a-e769-4703-be56-15b7924b6318)

Check data here on [DEXrabbit](https://dexrabbit.com/solana/token/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm#pools).

## Latest Price of Token Based on Liqudity

[This](https://ide.bitquery.io/latest-price-based-on-liquidity_2) subscription given below returns the latest and real-time price and other info related to the token, DEX and market for the following token `LMFzmYL6y1FX8HsEmZ6yNKNzercBmtmpg2ZoLwuUboU`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block {
        Time
      }
      Pool {
        Base {
          ChangeAmount
          PostAmount
          Price
          PriceInUSD
        }
        Dex {
          ProgramAddress
          ProtocolFamily
        }
        Market {
          BaseCurrency {
            MintAddress
            Name
            Symbol
          }
          MarketAddress
        }
      }
    }
  }
}
```

</details>

## Get Latest Liquidity of any Liquidity Pool

This query gets you the liquidity/balance of the Quote Currency `WSOL` and Base Currency `SOLANADOG` for this particular pool address `BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL`. THe liquidity value of the currencies will be in `Quote{PostAmount}` and `Base{PostAmount}`.
You can find the query [here](https://ide.bitquery.io/Get-LP-Latest-liqudity-on-Solana)

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetLatestLiquidityForPool {
  Solana(dataset: realtime) {
    DEXPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: {
              is: "HktfL7iwGKT5QHjywQkcDnZXScoh811k7akrMZJkCcEF"
            }
          }
        }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descending: Block_Slot }
      limit: { count: 1 }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Get Top Pools Based on Liquidity

[This](https://ide.bitquery.io/top-10-liquidity-pools_1) query retrieves the top liquidity pools on the Solana blockchain, sorted by their total liquidity (PostAmount). The query is filtered for pools that have been active since a specific time period. The results are limited to the top 10 pools based on their liquidity.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query GetTopPoolsByDex {
  Solana {
    DEXPools(
      orderBy: { descending: Pool_Quote_PostAmount }
      where: {
        Block: { Time: { after: "2024-08-27T12:00:00Z" } }
        Transaction: { Result: { Success: true } }
      }
      limit: { count: 10 }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Quote {
          PostAmount
          PostAmountInUSD
          PriceInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Removal from a Pool for a Token

[This](https://ide.bitquery.io/liquidity-removal_1) query allows you to subscribe to updates on liquidity removal from a specific pool on the Solana network. The subscription is filtered by a particular token, identified by the base currency name or smart contract. It returns information on the amount of liquidity removed and the remaining balance.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana(network: solana) {
    DEXPools(
      where: {
        Pool: {
          Base: { ChangeAmount: { lt: "0" } }
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "7M9KJcPNC65ShLDmJmTNhVFcuY95Y1VMeYngKgt67D1t"
              }
            }
          }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
          ChangeAmount
        }
        Base {
          PostAmount
          ChangeAmount
        }
      }
    }
  }
}
```

</details>

## Pump Fun Pool Liquidity Addition

[This](https://ide.bitquery.io/add-liquidity-pump-fun_2) query returns the instances where liquidity was added to the pools related to the `Pump` protocol on `Solana`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolName: { is: "pump" } }
          Base: { ChangeAmount: { gt: "0" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Pump Fun Pool Liquidity Removal

[This](https://ide.bitquery.io/remove-liquidity-from-pump_2) query returns the liquidity removal/ token burning instances for the `Pump` protocol on `Solana`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolName: { is: "pump" } }
          Base: { ChangeAmount: { lt: "0" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Added and Removed by Specific Address

[This](https://ide.bitquery.io/liquidity-added-and-removed-by-particular-address_3) query returns the events of liquidity addition and liquidity removal by a particular address, which is `bgrXcQpyAhQ5MGcew8EB8tbz4oBJ5whahorrobfRVBQ` for this example.

Please note that Solana for `EAP` only has the real time data with archive data for recent 10 hours. It could be possible that the query returns an empty array if the address is not recently active.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXPools(
      where: {
        Transaction: {
          Signer: { is: "bgrXcQpyAhQ5MGcew8EB8tbz4oBJ5whahorrobfRVBQ" }
          Result: { Success: true }
        }
        Pool: { Base: { ChangeAmount: { ne: "0" } } }
      }
    ) {
      Pool {
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
        Market {
          BaseCurrency {
            Name
            MintAddress
            Symbol
          }
          QuoteCurrency {
            Name
            MintAddress
            Symbol
          }
        }
        Base {
          ChangeAmount
          PostAmount
        }
        Quote {
          ChangeAmount
          PostAmount
        }
      }
      Block {
        Time
      }
    }
  }
}
```

</details>

## Top 10 Liquidity Providers

[This](https://ide.bitquery.io/top-ten-liquidity-providers-for-a-pair_3) query given below, returns the top `10` liquidity providers for a given liquidity pool.

For this example:

- baseCurrency: `5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump`
- quoteCurrency: `11111111111111111111111111111111`

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
query MyQuery {
  Solana {
    DEXPools(
      limit: { count: 10 }
      where: {
        Pool: {
          Market: {
            QuoteCurrency: {
              MintAddress: {
                is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              }
            }
            BaseCurrency: {
              MintAddress: { is: "So11111111111111111111111111111111111111112" }
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
        Transaction: { Result: { Success: true } }
      }
      orderBy: { descendingByField: "liquidityAdded" }
    ) {
      Transaction {
        Signer
      }
      liquidityAdded: sum(of: Pool_Base_ChangeAmountInUSD)
    }
  }
}
```

</details>

## All Liquidity Events for a Pair

In this section, we will discuss how we can get all the liquidity related changes like liquidity addition and liquidity removal for a specified pair, which is, for this example, given below.

- baseCurrency: `5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump`
- quoteCurrency: `11111111111111111111111111111111`

### Liquidity Addition Event

[This](https://ide.bitquery.io/liquidity-addition-for-a-pair_2) query returns the instances of liquidity addition, that is events where `baseCurrencyChange` is greater than `0`.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump"
              }
            }
            QuoteCurrency: {
              MintAddress: { is: "11111111111111111111111111111111" }
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity Removal Event

Now, to get the instances of liquidity removal, you can run [this](https://ide.bitquery.io/liquidity-removal-for-a-pair_4) query.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
{
  Solana {
    DEXPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump"
              }
            }
            QuoteCurrency: {
              MintAddress: { is: "11111111111111111111111111111111" }
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

If the segregation shown above is not required, you can remove the `Base{ChangeAmount}` filter from either of the query and get the desired result.

## Liquidity Events for Raydium Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Radium DEX, which has `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` as the Program Address.

### Liquidity addition for Radium Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-radium_1) subscription returns the real-time liquidity addition event details for the Radium Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Radium Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-radium_1) subscription returns the real-time liquidity addition event details for the Radium Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Events for Orca Whirlpool Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Orca Whirlpool DEX, which has `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` as the Program Address.

### Liquidity addition for Orca Whirlpool Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool_1) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Orca Whirlpool Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool_1) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

## Liquidity Events for Meteora Pairs

In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Meteora DEX, which has `Meteora` as the Protocol Family.

### Liquidity addition for Meteora Pairs

[This](https://ide.bitquery.io/liquidity-addition-for-meteora_1) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolFamily: { is: "Meteora" } }
          Base: { ChangeAmount: { gt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>

### Liquidity removal for Meteora Pairs

[This](https://ide.bitquery.io/liquidity-removal-for-meteora_1) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

<details>
  <summary>Click to expand GraphQL query</summary>

```graphql
subscription {
  Solana {
    DEXPools(
      where: {
        Pool: {
          Dex: { ProtocolFamily: { is: "Meteora" } }
          Base: { ChangeAmount: { lt: "0" } }
        }
      }
    ) {
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Quote {
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
        Base {
          ChangeAmount
          PostAmount
        }
      }
    }
  }
}
```

</details>
