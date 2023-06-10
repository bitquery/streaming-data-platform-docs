---
sidebar_position: 5
---

# NFT Trades API

The NFT Trades API provides access to diverse NFT DEX trades data on supported blockchain.  

## Get Latest NFT Trades of an Address

Let's dive into an example query that fetches the most recent NFT trades associated with a specific address.

```graphql
 query MyQuery {
  EVM(dataset: combined) {
    DEXTrades(
      limit: {offset: 0, count: 10}
      orderBy: {descendingByField: "Block_Time"}
      where: {Trade: {Buy: {Buyer: {is: "0x6afdf83501af209d2455e49ed9179c209852a701"}, Currency: {Fungible: false}}}}
    ) {
      Trade {
        Dex {
          ProtocolName
          OwnerAddress
          Delegated
          DelegatedTo
          ProtocolName
          SmartContract
        }
        Buy {
          Price
          Seller
          Buyer
          Currency {
            Symbol
            HasURI
            Name
            Fungible
            SmartContract
          }
          Ids
          OrderId
          URIs
        }
        Sell {
          Price
          Amount
          Currency {
            Name
          }
          Buyer
          Seller
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

**Parameters**

-   `dataset` : Indicates the [combined](/docs/graphql/dataset/combined) dataset to be used. 
-   `orderBy` : Orders the results in descending order based on the Block_Time.
-   `where` : It filters results based on specified conditions. Here, it selects transfers where the currency is non-fungible and buyer's address is `0x6afdf83501af209d2455e49ed9179c209852a701`.


**Returned Data**

-  `Trade`: It displays the details of the trade, `DEX {}` provides DEX information (protocol name, owner address, delegated status, delegated to address, and smart contract address), `Buy{}` and `sell{}` represents the buy side details ( price, seller, buyer, currency information, NFT IDs, order ID, and URIs ), and the sell side details ( price, amount, currency information, buyer, and seller ) respectively.
-  `Transaction` : Represents the hash of the transaction associated with the trade.
-  `Block` - Represents the block time of the trade.


You can find the graphql query [here](https://ide.bitquery.io/NFT-trades-of-an-address).


## Get Top Traded NFT Tokens

This query retrieves the Top Traded NFT Tokens of the month.

```graphql
{
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      orderBy: {descendingByField: "count"}
      limit: {offset: 0, count: 10}
      where: {Block: {Date: {since: "2023-05-01", till: "2023-05-28"}}, Trade: {Buy: {Currency: {Fungible: false}}, Sell: {Currency: {Fungible: true}}}}
    ) {
      Trade {
        Buy {
          Currency {
            Symbol
            SmartContract
          }
          min_price: Price(minimum: Trade_Buy_Price)
          max_rice: Price(maximum: Trade_Buy_Price)
        }
        Sell {
          Currency {
            Symbol
            SmartContract
          }
        }
      }
      buy_amount: sum(of: Trade_Buy_Amount)
      sell_amount: sum(of: Trade_Sell_Amount)
      count
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Top-traded-NFT-tokens-in-a-month).

## Latest NFT Trades on Opensea

The following query retrieves the most latest Opensea trades by tracking the Seaport protocol ( Here seaport_v1.4 means all versions of seaport ) and all transactions sent to Opensea’s seaport contract `0x00000000000000adc04c56bf30ac9d3c0aaf14dc`. 

```graphql 
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}}, Transaction: {To: {is: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Trade {
        Buy {
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
          Amount
          Buyer
          Ids
          Price
          URIs
        }
        Sell {
          Currency {
            Name
            ProtocolName
            Symbol
            Decimals
            Fungible
            SmartContract
          }
          Amount
          Buyer
          Ids
          URIs
        }
      }
      Block {
        Time
        Number
      }
    }
  }
}
```

**Parameters**

-   `network` : Specifies the Ethereum network.
-   `dataset` : Indicates the [combined](/docs/graphql/dataset/combined) dataset to be used. 
-   `orderBy` : Orders the results in descending order based on the Block_Time.
-   `where` : Filters the results based on the specified conditions. In this case, We need to track `Seaport` protocol and all transactions sent to Opensea’s seaport contract `0x00000000000000adc04c56bf30ac9d3c0aaf14dc`.

**Returned Data**

-   `Buy` :  Represents the buy side of the trade, including the currency being bought, amount, buyer's address, currency's name, and smart contract address.
-   `Sell` : Represents the sell side of the trade, including the currency being sold, amount, buyer's address, currency's name, and smart contract address.
-   `Block` : Provides the block number and timestamp of the trade.

You can find the graphql query [here](https://ide.bitquery.io/Latests-OpenSea-Trades).


## Top Traded NFTs on Opensea

This query retrieves the Top Traded NFTs on Opensea based on trade count and can also aggregate trading vol, trade count, buyer, seller, and nfts.

```graphql
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}}, Transaction: {To: {is: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      tradeVol: sum(of: Trade_Buy_Amount)
      count
      buyers: count(distinct: Trade_Buy_Buyer)
      seller: count(distinct: Trade_Buy_Seller)
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

**Returned Data**

-   `tradeVol` :  Represents  trading volume which is sum of trade buy amount.
-   `count` : Represents the total number of trades.
-   `buyers` : count of distinct buyers involved in trades.
-   `seller` : count of distinct sellers involved in trades.
-   `nfts`  :  Represents the count of distinct Ids of NFTs traded.

You can find the graphql query [here](https://ide.bitquery.io/Top-Traded-NFTs-on-Opensea).


## Total Buy & Sell of an NFT on Opensea 

To Retrieve Total Buy & sell of specific NFT on Opensea, we just need to specify the currency contract address in the Buy filter.

```graphql
 query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}, Buy: {Currency: {Fungible: false}}}, Transaction: {To: {is: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      tradeVol: sum(of: Trade_Buy_Amount)
      count
      buyer: count(distinct: Trade_Buy_Buyer)
      seller: count(distinct: Trade_Buy_Seller)
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Total-buy-sell-of-an-NFT-on-opensea).


## Latest NFT buyer on Opensea 

This query retrieves the Latest NFT buyer on Opensea.

```graphql
 query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}, Buy: {Currency: {Fungible: false}}}, Transaction: {To: {is: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      count
      uniq_tx: count(distinct: Transaction_Hash)
      Block {
        first_date: Time(minimum: Block_Date)
        last_date: Time(maximum: Block_Date)
      }
      nfts: count(distinct: Trade_Buy_Ids)
      difffernt_nfts: count(distinct: Trade_Buy_Currency_SmartContract)
      total_money_paid: sum(of: Trade_Sell_Amount)
      Trade {
        Buy {
          Buyer
        }
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Total-buy-sell-of-an-NFT-on-opensea).


## Specific Buyer stats of an NFT on Opensea

This query retrieves the Specific Buyer stats of an NFT on Opensea.

```graphql
 query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}, Buy: {Currency: {SmartContract: {is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}}, Buyer: {is: "0x2f9ecaa66e12b6168996a6b80cda9bb142f80dd0"}}}, Transaction: {To: {is: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      count
      uniq_tx: count(distinct: Transaction_Hash)
      Block {
        first_date: Time(minimum: Block_Date)
        last_date: Time(maximum: Block_Date)
      }
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/Top-buyer-of-specific-NFT).

## Latest NFT Trades on Ethereum for Seaport protocol

This query retrieves the latest NFT Trades on Ethereum for Seaport v1.4 protocol. Many marketplaces utilize the Seaport protocol, we can add a Smart contract in Trade → Dex → SmartContract to get a specific marketplace for this protocol.

```graphql
 query MyQuery {
  EVM {
    DEXTrades(
      limit: {offset: 0, count: 10}
      orderBy: {descendingByField: "Block_Time"}
      where: {Trade: {Dex: {ProtocolName: {is: "seaport_v1.4"}}}}
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Price
          Seller
          Buyer
          Currency {
            HasURI
            Name
            Fungible
            SmartContract
          }
        }
        Sell {
          Price
          Amount
          Currency {
            Name
          }
          Buyer
          Seller
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

You can find the graphql query [here](https://ide.bitquery.io/latest-NFT-trades-on-Ethereum-network).

