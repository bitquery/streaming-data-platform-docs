---
sidebar_position: 2
---

# Solana DEX Pools API

In this section we will see how to get Solana DEX Pools information using our API.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes. This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

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

## Latest Price of Token Based on Liqudity

[This](https://ide.bitquery.io/latest-price-based-on-liquidity_1) subscription given below returns the latest and real-time price and other info related to the token, DEX and market for the following token `LMFzmYL6y1FX8HsEmZ6yNKNzercBmtmpg2ZoLwuUboU`.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "LMFzmYL6y1FX8HsEmZ6yNKNzercBmtmpg2ZoLwuUboU"
              }
            }
          }
        },
        Transaction: {
          Result: {
            Success: true
          }
        }
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

## Get Latest Liquidity of any Liquidity Pool

This query gets you the liquidity/balance of the Quote Currency `WSOL` and Base Currency `SOLANADOG` for this particular pool address `BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL`. THe liquidity value of the currencies will be in `Quote{PostAmount}` and `Base{PostAmount}`.
You can find the query [here](https://ide.bitquery.io/Get-LP-Latest-liqudity_3)

``` graphql
query GetLatestLiquidityForPool {
  Solana {
    DexPools(
      where: {
        Pool: {
          Market: {
            MarketAddress: {
              is: "BDQnwNhTWc3wK4hhsnsEaBBMj3sD4idGzvuidVqUw1vL"
            }
          }
        },
        Transaction: {
          Result: {
            Success: true
          }
        }
      }
      orderBy: {descending: Block_Slot}
      limit:{count:1}
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


## Get Top Pools Based on Liquidity

[This](https://ide.bitquery.io/top-10-liquidity-pools) query retrieves the top liquidity pools on the Solana blockchain, sorted by their total liquidity (PostAmount). The query is filtered for pools that have been active since a specific time period. The results are limited to the top 10 pools based on their liquidity.


``` graphql
query GetTopPoolsByDex {
  Solana {
    DexPools(
      orderBy: {descending: Pool_Quote_PostAmount}
      where: {
        Block: {
          Time: {after: "2024-08-27T12:00:00Z"
          }
        }
        Transaction: {
          Result: {
            Success: true
          }
        }
      }
      limit: {count: 10}
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

## Subscribe to Liquidity Removal from a Pool for a Token

[This](https://ide.bitquery.io/liquidity-removal) query allows you to subscribe to updates on liquidity removal from a specific pool on the Solana network. The subscription is filtered by a particular token, identified by the base currency name or smart contract. It returns information on the amount of liquidity removed and the remaining balance.


``` graphql
{
  Solana(network: solana) {
    DexPools(
      where: {Pool: {Base: {ChangeAmount: {lt: "0"}}, 
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


## Pump fun pool liquidity add
[This](https://ide.bitquery.io/add-liquidity-pump-fun_1) query returns the instances where liquidity was added to the pools related to the `Pump` protocol on `Solana`.

``` graphql
{
  Solana {
    DexPools(
      where: {
        Pool: {Dex: {ProtocolName: {is: "pump"}},
        Base: {ChangeAmount: {gt: "0"}}},
        Transaction: {
          Result: {
            Success: true
          }
        }
      }
    ){
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

## Pump fun pool liquidity burn
[This](https://ide.bitquery.io/remove-liquidity-from-pump_1) query returns the liquidity removal/ token burning instances for the `Pump` protocol on `Solana`.

``` graphql
{
  Solana {
    DexPools(
      where: {
        Pool: {Dex: {ProtocolName: {is: "pump"}},
        Base: {ChangeAmount: {lt: "0"}}},
        Transaction: {
          Result: {
            Success: true
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
        }
        Base {
          PostAmount
        }
      }
    }
  }
}
```

## Liquidity added and removed by specific addresses

[This](https://ide.bitquery.io/liquidity-added-and-removed-by-particular-address_2) query returns the events of liquidity addition and liquidity removal by a particular address, which is `bgrXcQpyAhQ5MGcew8EB8tbz4oBJ5whahorrobfRVBQ` for this example. 

Please note that Solana for `EAP` only has the real time data with archive data for recent 10 hours. It could be possible that the query returns an empty array if the address is not recently active.

``` graphql
query MyQuery {
  Solana {
    DexPools(
      where: {
        Transaction: {
          Signer: {is: "bgrXcQpyAhQ5MGcew8EB8tbz4oBJ5whahorrobfRVBQ"}
          Result: {
            Success: true
          }  
        },
        Pool: {BaseCurrency: {ChangeAmount: {ne: "0"}}}
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
        BaseCurrency {
          ChangeAmount
          PostAmount
        }
        QuoteCurrency {
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

## Top 10 liquidity providers
[This](https://ide.bitquery.io/top-ten-liquidity-providers-for-a-pair_1) query given below, returns the top `10` liquidity providers for a given liquidity pool. 

For this example:
- baseCurrency: `5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump`
- quoteCurrency: `11111111111111111111111111111111`

```graphql
query MyQuery {
  Solana {
    DexPools(
      limit: {count: 10}
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump"
              }
            },
            QuoteCurrency: {
              MintAddress: {
                is: "11111111111111111111111111111111"
              }
            }
          },
          BaseCurrency: {ChangeAmount: {gt: "0"}},
          Transaction: {
          Result: {
            Success: true
          }
        }
        }
      }
      orderBy: {descendingByField: "liquidityAdded"}
    ) {
      Transaction {
        Signer
      }
      liquidityAdded: sum(of: Pool_Base_ChangeAmount)
    }
  }
}
```

## All liquidity related changes for a pair

In this section, we will discuss how we can get all the liquidity related changes like liquidity addition and liquidity removal for a specified pair, which is, for this example, given below.

- baseCurrency: `5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump`
- quoteCurrency: `11111111111111111111111111111111`

### Liquidity Addition Event
[This](https://ide.bitquery.io/liquidity-addition-for-a-pair_1) query returns the instances of liquidity addition, that is events where `baseCurrencyChange` is greater than `0`.

```graphql
{
  Solana {
    DexPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump"
              }
            }, 
            QuoteCurrency: {
              MintAddress: {
                is: "11111111111111111111111111111111"
              }
            }
          },
          Base: {ChangeAmount: {gt: "0"}},
        },
        Transaction: {
          Result: {
            Success: true
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

### Liquidity Removal Event

Now, to get the instances of liquidity removal, you can run [this](https://ide.bitquery.io/liquidity-removal-for-a-pair_3) query.

```graphql
{
  Solana {
    DexPools(
      where: {
        Pool: {
          Market: {
            BaseCurrency: {
              MintAddress: {
                is: "5FGULyTir641wnz7gr2p2kiYYpWboVYE83qos1r9pump"
              }
            }, 
            QuoteCurrency: {
              MintAddress: {
                is: "11111111111111111111111111111111"
              }
            }
          },
          Base: {ChangeAmount: {lt: "0"}},
        },
        Transaction: {
          Result: {
            Success: true
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

If the segregation shown above is not required, you can remove the `Base{ChangeAmount}` filter from either of the query and get the desired result.

## Liquidity Events for Raydium Pairs
In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Radium DEX, which has `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` as the Program Address.

### Liquidity addition for Radium Pairs
[This](https://ide.bitquery.io/liquidity-addition-for-radium#) subscription returns the real-time liquidity addition event details for the Radium Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          },
          Base: {ChangeAmount: {gt: "0"}}}}
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

### Liquidity removal for Radium Pairs
[This](https://ide.bitquery.io/liquidity-removal-for-radium#) subscription returns the real-time liquidity addition event details for the Radium Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
            }
          },
          Base: {ChangeAmount: {lt: "0"}}}}
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

## Liquidity Events for Orca Whirlpool Pairs
In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Orca Whirlpool DEX, which has `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` as the Program Address.

### Liquidity addition for Orca Whirlpool Pairs
[This](https://ide.bitquery.io/liquidity-addition-for-orca-whirlpool) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          },
          Base: {ChangeAmount: {gt: "0"}}}}
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

### Liquidity removal for Orca Whirlpool Pairs
[This](https://ide.bitquery.io/liquidity-removal-for-orca-whirlpool) subscription returns the real-time liquidity addition event details for the Orca Whirlpool Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProgramAddress: {
              is: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
            }
          },
          Base: {ChangeAmount: {lt: "0"}}}}
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

## Liquidity Events for Meteora Pairs
In this section, we will discover data streams that provides us with the real time events of liquidity addition and liquidity removal for the Meteora DEX, which has `Meteora` as the Protocol Family.

### Liquidity addition for Meteora Pairs
[This](https://ide.bitquery.io/liquidity-addition-for-meteora) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProtocolFamily: {
              is: "Meteora"
            }
          },
          Base: {ChangeAmount: {gt: "0"}}}}
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

### Liquidity removal for Meteora Pairs
[This](https://ide.bitquery.io/liquidity-removal-for-meteora) subscription returns the real-time liquidity addition event details for the Meteora Pairs.

``` graphql
subscription {
  Solana {
    DexPools(
      where: {
        Pool: {
          Dex: {
            ProtocolFamily: {
              is: "Meteora"
            }
          },
          Base: {ChangeAmount: {lt: "0"}}}}
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
