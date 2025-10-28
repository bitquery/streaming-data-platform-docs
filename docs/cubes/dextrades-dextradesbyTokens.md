# DEXTrades vs DEXTradesByTokens

This guide helps you choose the right cube for your use case and provides advanced processing patterns based on production implementations.

### DEXTrades Cube

The **DEXTrades Cube** provides detailed information about decentralized exchange (DEX) trading data, focusing on the perspective of the pool involved in the trade. Here's a breakdown of its features:

- **Trade Perspective**: The data is presented from the pool's perspective. In every trade, one of the participants must be a pool, and the cube shows the pool's buy and sell details.
- **Buyer and Seller Identification**: The cube clearly differentiates the buyer and seller based on the pool's perspective. The pool’s buy details include the currency bought by the pool, while the sell details include the currency sold by the pool.
- **Filtering**: Allows filtering of trades based on various criteria such as buy currency, sell currency, buyer, seller, DEX, pool, sender, receiver, transaction, time, etc.
- **Aggregation**: Supports aggregation of data based on time, amount, address, currency, type, buyer, seller, DEX, pool address, block time, etc.
- **Metrics**: Offers metrics for sum, count, average, median, maximum, minimum, etc., enabling comprehensive trade analysis.

Example API call from DEXTrades Cube:

```graphql
{
  EVM(dataset: archive, network: eth) {
    DEXTrades(
      limit: { count: 2 }
      where: {
        Transaction: {
          Hash: {
            is: "0x672b64a68f612667111fb2e1329dc1b47279042e1b84d894aa64119ae34a989f"
          }
        }
      }
    ) {
      Transaction {
        Hash
      }
      Trade {
        Buy {
          AmountInUSD
          Buyer
          Currency {
            Name
          }
          Seller
          Currency {
            Name
          }
          AmountInUSD
        }
        Sell {
          AmountInUSD
          Buyer
          Currency {
            Name
          }
          Seller
          Currency {
            Name
          }
          AmountInUSD
        }
      }
    }
  }
}
```

### DEXTradesByTokens Cube

The **DEXTradesByTokens Cube** provides a more granular view of the DEX trading data, including details from both sides of the trade for each participant. Here's a breakdown of its features:

- **Trade Perspective**: The data includes both participants' perspectives in a trade. Each user is shown as both a buyer and a seller.
- **Buyer and Seller Identification**: The cube displays each user involved in the trade as both a buyer and a seller, reflecting the trade from both perspectives.
- **Filtering**: Allows filtering of trades based on currency, buyer, seller, DEX, pool, sender, transaction, time, etc.
- **Aggregation**: Supports aggregation of data based on trade currency, amount, seller, buyer, address, DEX, pool address, block time, etc.
- **Metrics**: Offers metrics similar to the DEXTrades cube for sum, count, average, median, maximum, minimum, etc., with a focus on token-specific trade analysis.

Example API call from DEXTradesByTokens Cube:

```graphql
{
  EVM(network: bsc, dataset: combined) {
    DEXTradeByTokens(
      where: {
        Transaction: {
          Hash: {
            is: "0xf23cd0e4d85e0a66d58cf68af929b1fab34d72c3f0df0199d221fa8809e702b1"
          }
        }
      }
    ) {
      ChainId
      Block {
        Number
        Time
      }
      Trade {
        Seller
        Buyer
        Amount
        Currency {
          SmartContract
          Symbol
        }
        Price
        Side {
          Amount
          Currency {
            SmartContract
            Symbol
          }
        }
      }
      Transaction {
        Hash
      }
    }
  }
}
```


## When to Use Each Cube

### Use DEXTrades When:

1. **Volume Tracking Applications**: You need accurate volume calculations from the pool's perspective
2. **Multi-hop Trade Detection**: Processing complex routing scenarios where trades span multiple hops
3. **Proxy Contract Handling**: Dealing with router contracts and need inverted buy/sell logic
4. **Pool-centric Analysis**: Analyzing liquidity pool behavior and MEV detection

**Example Use Case: Volume Alert System**
```python
# DEXTrades is ideal for tracking actual trading volumes
def process_volume_alerts(trade_data):
    # Use pool perspective for accurate volume calculation
    if trade_data['buy_contract'] == '0x':  # Native token buy
        volume = trade_data['sell_amount']  # Payment amount
        token = trade_data['buy_contract']
    elif trade_data['sell_contract'] == '0x':  # Native token sell
        volume = trade_data['buy_amount']   # Payment amount
        token = trade_data['sell_contract']
    
    return process_token_volume(token, volume)
```

### Use DEXTradesByTokens When:

1. **User-centric Analysis**: Tracking individual trader behavior and portfolio changes
2. **Token Flow Analysis**: Understanding how tokens move between addresses
3. **Simpler Processing Logic**: When you don't need complex multi-hop detection
4. **Portfolio Tracking**: Building user portfolio dashboards

**Example Use Case: User Portfolio Tracker**
```python
# DEXTradesByTokens shows both sides of each user's activity
def update_user_portfolio(user_address, trades):
    for trade in trades:
        if trade['seller'] == user_address:
            # User sold this token
            portfolio[trade['currency']]['balance'] -= trade['amount']
        if trade['buyer'] == user_address:
            # User bought this token
            portfolio[trade['currency']]['balance'] += trade['amount']
```


Both cubes support advanced filtering, aggregation, and metric calculations, allowing for detailed and customizable data retrieval and analysis for DEX trades.

You can read in detail about dextrades cube [here](https://docs.bitquery.io/docs/cubes/dextrades/)
