---
sidebar_position: 2
---

# Arbitrum DEX Trades Examples

## Latest Trades for a Token Pair on Arbitrum

This query retrieves all DEX trades on the arbitrum where the base currency is `baseCurrency` and the quote currency is `quoteCurrency` that occurred between the specified dates.
You can find the query [here](https://ide.bitquery.io/Pair-last-trades_2)

```
query ($network: evm_network!, $baseCurrency: String!, $limit: Int, $quoteCurrency: String!, $from: String, $till: String) {
  EVM(network: $network, dataset: archive) {
    sell: DEXTrades(
      where: {Trade: {Sell: {Currency: {SmartContract: {is: $baseCurrency}}}, Buy: {Currency: {SmartContract: {is: $quoteCurrency}}}}, Block: {Date: {since: $from, till: $till}}}
      orderBy: {descending: Block_Date}
      limit: {count: $limit}
    ) {
      ChainId
      Block {
        Time
        Number
      }
      Trade {
        Sell {
          Buyer
          Amount
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
        Buy {
          Price
          Amount
          Currency {
            Symbol
            SmartContract
            Name
          }
        }
        Dex {
          ProtocolName
          SmartContract
          ProtocolFamily
          ProtocolVersion
        }
      }
    }
  }
}
{
  "network": "arbitrum",
  "limit": 15,
  "from": "2023-09-07",
  "till": "2023-09-07",
  "baseCurrency": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  "quoteCurrency": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
}

```
## Latest Trades in Realtime with Subscription

This subscription query will return the latest DEX trades on the Arbitrum network in real time. 
You can find the query [here](https://ide.bitquery.io/Arbitrum-Dextrades-subscription)

```
subscription {
  EVM(network: arbitrum) {
    DEXTrades {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Sender
        Buy {
          Amount
          Buyer
          Currency {
            Name
            SmartContract
            Symbol
          }
          Price
          Seller
        }
        Sell {
          Amount
          Buyer
          Currency {
            Name
            Symbol
            SmartContract
          }
          Price
          Seller
        }
      }
    }
  }
}

```

The `DEXTrades` API contains the following information about each trade:

-   `Dex`: The details of the decentralized exchange where the trade was executed, including the protocol family and the protocol name.
-   `Sender`: The address of the sender of the trade.
-   `Buy`: The details of the buy order, including the amount of cryptocurrency bought, the buyer's address, the token's symbol, and the price of the trade.
-   `Sell`: The details of the sell order, including the amount of token sold, the seller's address, the token's symbol, and the price of the trade.