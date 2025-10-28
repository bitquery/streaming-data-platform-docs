# DEXTradesByTokens Cube

The DEXTradesByTokens cube provides comprehensive information about DEX trading data from a token-centric perspective, showing both sides of each trade for every participant. This includes buyer, seller, token prices, pairs, transactions, OHLC data, and more.

Unlike DEXTrades cube which uses `Buy` and `Sell` from the pool's perspective, DEXTradesByTokens uses the concept of `Trade` and `Side` to represent both sides of each trade from a token-centric view.

## Understanding Trade and Side Structure

In DEXTradesByTokens, each trade is represented with two main components:

- **`Trade`**: The primary side of the trade, focusing on one specific token/currency
- **`Side`**: The counter-side of the trade, representing what the token is being traded against

### Example Structure Comparison

**DEXTrades Approach (Pool Perspective):**

```graphql
Trade {
  Buy {
    Currency { Symbol }    # What the pool buys
    Amount
    Buyer                 # Pool address
  }
  Sell {
    Currency { Symbol }    # What the pool sells
    Amount
    Seller                # User address
  }
}
```

**DEXTradesByTokens Approach (Token Perspective):**

```graphql
Trade {
  Currency { Symbol }      # Primary token (e.g., "PEPE")
  Amount                   # Amount of primary token
  Buyer                    # Who bought the primary token
  Seller                   # Who sold the primary token
  Side {
    Currency { Symbol }    # Counter token (e.g., "WETH")
    Amount                 # Amount of counter token
  }
}
```

## Concept Explanation

Let's understand the concept of buyer and seller when a trade occurs between User A and User B, and Token X and Token Y are swapped between them.

![](/img/tokenAB.png)

We see the trade from user A's side, then we get the following:

- User A becomes the seller of token X.
- User A becomes the buyer of token Y.

Now, if we see the trade from a user B side, we get the following.

- User B becomes the seller of token Y.
- User B becomes the buyer of token X.

Therefore, buyers and sellers change relatively when the trade sides change.

> Important note: If a trade occurs between User A and User B, the DexTradesByTokens API shows User A as both buyer and a seller, and similarly for User B. The result includes both perspectives, displaying each user as a buyer and then as a seller.

[Run this API for better understanding](https://ide.bitquery.io/DEXTradeByTokens-API_1). When you run this API you get the following result.

```
{
  "EVM": {
    "DEXTradeByTokens": [
      {
        "Trade": {
          "AmountInUSD": "4294.551848660284",
          "Buyer": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Currency": {
            "Name": "Wrapped Ether"
          },
          "Seller": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Side": {
            "Amount": "160.404506514911311463",
            "AmountInUSD": "4276.354136374763",
            "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
            "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a"
          }
        }
      },
      {
        "Trade": {
          "AmountInUSD": "4276.354136374763",
          "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Currency": {
            "Name": "Ethereum Name Service"
          },
          "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Side": {
            "Amount": "1.132838451259439863",
            "AmountInUSD": "4294.551848660284",
            "Buyer": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
            "Seller": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c"
          }
        }
      }
    ]
  }
}

```

In the above result, User A (0x925...) is included as both a buyer and a seller. The same applies to User B (0xa69...), who is also shown as both a buyer and a seller. If one become a buyer then other automatically become a seller.

> Important note: Let's say currency X and currency Y are swapped in trade. Then, the trade side currency of X is Y, and the trade side currency of Y is X. Therefore, the trade side currency is relatively changed based on the currency that is traded against it.

## Filtering in DEXTradeByTokens Cube

Filtering helps to fetch the exact data you are looking for. DexTradeByTokens Cube can filter based on currency, buyer, seller, dex, pool, sender, transaction, time, etc.

Everything inside the “where” clause filters; it follows the `AND’ condition by default.


## Aggregation in DEXTradeByTokens Cube

DexTradesByTokens cube aggregates the data based on trade currency, amount, seller, buyer, address, dex (dex owner address), pool address (dex smart contract), block time, etc.

We aggregate the following API using the Trade Currency Smartcontract and Trade Side Currency filter. Then, we retrieve the total trade volume by summing all the trade amounts over specific time intervals. We can also retrieve the OHLC (Open-High-Low-Close) data, which contains the first trade time with a block number, the last trade time with a block number, the highest and lowest price, and the open and close price in each time interval.

[Run this query](https://ide.bitquery.io/Copy-of-OHLC) to retrieve the total trade volume of WETH along with OHLC data sequentially every 10-minute time interval in the ethereum network.

```
{
  EVM(dataset: realtime, network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Time_Field"}
      where: {Trade: {Side: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}, Currency: {SmartContract: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}}}
    ) {
      Block {
        Time_Field: Time(interval: {in: minutes, count: 10})
        lastTradeTime: Time(maximum: Block_Time)
        FirstTradeTime: Time(minimum: Block_Time)
        LastTradeBlock: Number(maximum: Block_Number)
        FirstTradeBlock: Number(minimum: Block_Number)
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: Price(maximum: Trade_Price)
        low: Price(minimum: Trade_Price)
        open: Price(minimum: Block_Number)
        close: Price(maximum: Block_Number)
      }
    }
  }
}

```

Next, we aggregated the following API to retrieve the top traders of specific currencies based on the highest number of trades in the specific pool and their trade volume of traded currencies. We used the Trade Currency Smartcontract filter to specify the traded currency and the Dex SmartContract filter to specify the pool.

In the following example, we extract the top traders of the MONKE token (“0xb62..”) in the MONKE / ETH pool (“0x622…”) in the ethereum network. Run the API using this link.

```
{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Total_number_of_trades"}
      limitBy: {count: 1, by: Trade_Buyer}
      limit: {count: 10}
      where: {Trade:  {Currency: {SmartContract: {is: "0xb624960aaad05d433075a5c9e760adec26036934"}},
        Dex: {SmartContract:
          {is: "0x62220cca3fa08e9b35bb2c775d20cf63a8de7ac5"}}}}
    ) {
      buy: sum(of: Trade_AmountInUSD)
      sell: sum(of: Trade_Side_AmountInUSD)
      Total_number_of_trades:  count
      Trade {
        Buyer
        Currency {
          SmartContract
          Symbol
          Name
        }
      }
    }
  }
}
```

## DEXTradeByTokens Metrics

In this example, we use the count metric to retrieve a specific token's total number of trades that occur in specific Dex of the ethereum network. [Run this API](https://ide.bitquery.io/Count-of-trade-on-Uniswap-of-pepe) to find the total trades of [PEPE](https://explorer.bitquery.io/ethereum/token/0x6982508145454ce325ddbe47a25d4ec3d2311933) tokens in the [Uniswap v3 factory](https://explorer.bitquery.io/ethereum/token/0x6982508145454ce325ddbe47a25d4ec3d2311933). We have specified the PEPE token address using the Trade Currency SmartContract filter. And we specified the Uniswap v3 factory dex address using the Dex OwnerAddress filter.

```
query MyQuery {
  EVM(dataset: archive, network: eth) {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true},
        Trade: {Currency:
          {SmartContract:
            {is: "0x6982508145454ce325ddbe47a25d4ec3d2311933"}},
          Dex:
          {OwnerAddress:
            {is: "0x1f98431c8ad98523631ae4a59f267346ea31f984"}}},
        Block: {Date:
          {since: "2024-01-01", till: "2024-06-02"}}}
    ) {
      total_trades: count
    }
  }
}
```

Using the sum metric, we retrieve the total trade volume of MMM tokens: 1799228141.67, transferred by address 0xf9ca… until February 1st, 2024. Run this API using this link.

```

{
  EVM(dataset: combined) {
    DEXTradeByTokens(
      where: {Block: {Time: {till: "2024-02-01T00:00:00Z"}},
        Trade: {Currency: {SmartContract: {is: "0x4d55B39eC653fB96E70f986988A128e39EC70d35"}}}, Transaction:
        {From: {in: ["0xf9cafeb32467994e3affd61e30865e5ab32abe68"]}}}
    ) {
      sum(of: Trade_Amount)
    }
  }
}
```

Result: 1799228141.673992845889896448 MMM tokens.

## Advanced Use Cases and Processing Patterns

### Portfolio Tracking and User Analytics

DEXTradesByTokens excels at tracking individual user activity across all their trades:

#### User Portfolio Balance Tracker

```python
def track_user_portfolio(user_address, trades_data):
    """Track user's token portfolio changes over time"""
    portfolio = defaultdict(lambda: {'balance': 0, 'total_bought': 0, 'total_sold': 0})

    for trade in trades_data:
        token = trade['currency']['smart_contract'].lower()
        amount = float(trade['amount'])

        if trade['seller'].lower() == user_address.lower():
            # User sold this token
            portfolio[token]['balance'] -= amount
            portfolio[token]['total_sold'] += amount
        elif trade['buyer'].lower() == user_address.lower():
            # User bought this token
            portfolio[token]['balance'] += amount
            portfolio[token]['total_bought'] += amount

    return portfolio
```

#### Query for User Activity Tracking

```graphql
query UserActivityTracking(
  $userAddress: String!
  $sinceDate: ISO8601DateTime!
) {
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      where: {
        Block: { Time: { since: $sinceDate } }
        Trade: {
          # Get all trades where user is either buyer or seller
          any: [
            { Buyer: { is: $userAddress } }
            { Seller: { is: $userAddress } }
          ]
        }
      }
      orderBy: { ascending: Block_Time }
    ) {
      Block {
        Time
        Number
      }
      Trade {
        Buyer
        Seller
        Amount
        AmountInUSD
        Currency {
          SmartContract
          Symbol
          Name
        }
        Side {
          Amount
          AmountInUSD
          Currency {
            SmartContract
            Symbol
          }
        }
      }
      Transaction {
        Hash
        Signer
      }
    }
  }
}
```

### Token Flow Analysis

Track how tokens move between different addresses and pools:

#### Token Holder Distribution Changes

```python
def analyze_token_distribution(token_address, trades_data):
    """Analyze how token distribution changes over time"""
    holder_balances = defaultdict(float)
    distribution_history = []

    for trade in sorted(trades_data, key=lambda x: x['block']['time']):
        if trade['currency']['smart_contract'].lower() == token_address.lower():
            amount = float(trade['amount'])

            # Update balances
            holder_balances[trade['seller'].lower()] -= amount
            holder_balances[trade['buyer'].lower()] += amount

            # Record snapshot
            distribution_history.append({
                'time': trade['block']['time'],
                'tx_hash': trade['transaction']['hash'],
                'total_holders': len([addr for addr, bal in holder_balances.items() if bal > 0]),
                'top_holder_percentage': max(holder_balances.values()) / sum(holder_balances.values()) * 100
            })

    return distribution_history
```

### Advanced Filtering Strategies

#### Multi-Token Portfolio Analysis

```graphql
query MultiTokenPortfolioAnalysis($tokens: [String!]!, $userAddress: String!) {
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { in: $tokens } }
          any: [
            { Buyer: { is: $userAddress } }
            { Seller: { is: $userAddress } }
          ]
        }
      }
    ) {
      Trade {
        Currency {
          SmartContract
          Symbol
        }
        Amount
        AmountInUSD
        Buyer
        Seller
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
      }
    }
  }
}
```

#### High-Value Trade Detection

```graphql
query HighValueTrades($minValueUSD: Float!, $tokenAddress: String!) {
  EVM(dataset: realtime, network: eth) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: { SmartContract: { is: $tokenAddress } }
          AmountInUSD: { gt: $minValueUSD }
        }
      }
      orderBy: { descending: Trade_AmountInUSD }
    ) {
      Trade {
        AmountInUSD
        Amount
        Buyer
        Seller
        Currency {
          Symbol
        }
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
      }
      Transaction {
        Hash
        Signer
      }
      Block {
        Time
      }
    }
  }
}
```

### Performance Optimization Tips

#### Efficient Pagination for Large Datasets

```python
def paginate_user_trades(user_address, page_size=1000):
    """Efficiently paginate through large user trade datasets"""
    offset = 0
    all_trades = []

    while True:
        query = f"""
        query PaginatedUserTrades {{
          EVM(dataset: combined, network: eth) {{
            DEXTradeByTokens(
              limit: {{ offset: {offset}, count: {page_size} }}
              where: {{
                Trade: {{
                  any: [
                    {{ Buyer: {{ is: "{user_address}" }} }}
                    {{ Seller: {{ is: "{user_address}" }} }}
                  ]
                }}
              }}
              orderBy: {{ descending: Block_Time }}
            ) {{
              # Your fields here
            }}
          }}
        }}
        """

        result = execute_query(query)
        trades = result['EVM']['DEXTradeByTokens']

        if not trades:
            break

        all_trades.extend(trades)
        offset += page_size

        if len(trades) < page_size:
            break

    return all_trades
```

### Real-time Processing Considerations

When processing DEXTradesByTokens data in real-time applications:

#### Deduplication Strategy

```python
def deduplicate_trades(trades_list):
    """Remove duplicate trades that might appear in real-time streams"""
    seen_trades = set()
    unique_trades = []

    for trade in trades_list:
        # Create unique identifier for each trade
        trade_id = (
            trade['transaction']['hash'],
            trade['trade']['currency']['smart_contract'].lower(),
            trade['trade']['buyer'].lower(),
            trade['trade']['seller'].lower(),
            str(trade['trade']['amount'])
        )

        if trade_id not in seen_trades:
            seen_trades.add(trade_id)
            unique_trades.append(trade)

    return unique_trades
```

#### Memory-Efficient Processing

```python
def process_trades_stream(trade_generator):
    """Process trades without loading everything into memory"""
    user_summaries = defaultdict(lambda: {
        'total_volume_usd': 0,
        'trade_count': 0,
        'unique_tokens': set()
    })

    for trade in trade_generator:
        user_addr = trade['trade']['buyer'].lower()
        volume_usd = float(trade['trade']['amount_in_usd'])
        token = trade['trade']['currency']['smart_contract'].lower()

        user_summaries[user_addr]['total_volume_usd'] += volume_usd
        user_summaries[user_addr]['trade_count'] += 1
        user_summaries[user_addr]['unique_tokens'].add(token)

        # Periodic cleanup for memory management
        if len(user_summaries) > 10000:
            cleanup_old_users(user_summaries)

    return user_summaries
```

Next, we use the count metric to retrieve the most traded token in any dex.

We use the Trade Dex OwnerAddress filter to specify the Dex address and count metric to count the top trade currencies on Uniswap v3 factory Dex in the ethereum network. Run the following API using this link.

```

{
  EVM(dataset: combined, network: eth) {
    DEXTradeByTokens(
      limit: {count: 10}
      orderBy: {descendingByField: "count"}
      where: {Trade: {Dex: {OwnerAddress: {is: "0x1F98431c8aD98523631AE4a59f267346ea31F984"}}}}
    ) {
      Trade {
        Currency {
          Name
          SmartContract
        }
        Dex {
          ProtocolName
        }
      }
      count
    }
  }
}
```
