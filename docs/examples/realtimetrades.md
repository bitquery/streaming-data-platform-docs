---
sidebar_position: 8
---

# Uniswap Trades on Ethereum

Uniswap is a decentralized exchange built on the Ethereum blockchain that allows users to trade Ethereum-based tokens. Uniswap uses an automated market maker (AMM) model where trades are executed by a smart contract that pools liquidity from multiple parties and sets prices based on a mathematical algorithm.

Bitquery's APIs allows you to retrieve information about trades that have occurred between two tokens on the Uniswap exchange. This endpoint returns a list of trades, along with various details about each trade, such as the amount of tokens exchanged, the price of the trade, and the timestamp of the trade.

## Uniswap v3 Trades

```
query MyQuery {
  EVM(dataset: realtime, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}}}
      limit: {count: 10}
      orderBy: {descending: Fee_Burnt}
    ) {
      Transaction {
        From
        To
      }
      Trade {
        Dex {
          ProtocolName
          SmartContract
          Pair {
            Name
          }
          OwnerAddress
        }
        Buy {
          Currency {
            Name
          }
          Price
          Amount
        }
        Sell {
          Amount
          Currency {
            Name
          }
          Price
        }
      }
      Block {
        Time
      }
    }
  }
}
```

- `EVM`: The data set for Ethereum data.
- `DEXTrades`: The endpoint that returns information about the trades on the DEX.
- `where`: The condition to filter the trades by the DEX owner address. In this case, it's set to `0x1f98431c8ad98523631ae4a59f267346ea31f984`, which is the factory address of Uniswap V3.
- `limit`: The maximum number of trades to return. In this case, it's set to 10.
- `orderBy`: The field to order the results by. In this case, it's set to `Fee_Burnt` in descending order.
- `Transaction`: The transaction object, which contains the `From` and `To` addresses of the trade.
- `Trade`: The trade object, which contains information about the DEX, the tokens involved in the trade, and the prices.
- `Dex`: The DEX object, which contains the name of the protocol, the smart contract address, the name of the pair, and the owner address.
- `Buy`: The object that represents the token being bought in the trade.
- `Sell`: The object that represents the token being sold in the trade.
- `Currency`: The object that contains the name of the token.
- `Amount`: The amount of the token being traded.
- `Price`: The price of the token being traded.
- `Block`: The block object, which contains the timestamp of the block in which the trade was executed.

## Uniswap v2 Pair Trade Stats

In this query, we will get the trade statistics of the ChefDog (CHEF) and WETH pair using `0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75` on Uniswap V2. The results provide insights into how much was bought, sold, and the total trading volume in both CHEF and USD.
You can run the query [here](https://ide.bitquery.io/chefdog-weth-trade-stats)

```
query pairTopTraders {
  EVM(network:eth, dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 100}
      where: {Trade: {Dex: {Pair: {SmartContract: {is: "0x4ba1970f8d2dda96ebfbc466943fb0dfaab18c75"}}}}}
    ) {
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}

```
