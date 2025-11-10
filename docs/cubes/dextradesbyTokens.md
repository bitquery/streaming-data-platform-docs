# DEXTradesByTokens Cube

The DEXTradesByTokens cube provides comprehensive information about DEX trading data from a token-centric perspective, showing both sides of each trade for every participant. This includes buyer, seller, token prices, pairs, transactions, OHLC data, and more.

Unlike DEXTrades cube which uses `Buy` and `Sell` from the pool's perspective, DEXTradesByTokens uses the concept of `Trade` and `Side` to represent both sides of each trade from a token-centric view.

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

          "Buyer": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Currency": {
            "Name": "Wrapped Ether"
          },
          "Seller": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Side": {

            "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
            "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a"
          }
        }
      },
      {
        "Trade": {

          "Buyer": "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
          "Currency": {
            "Name": "Ethereum Name Service"
          },
          "Seller": "0x92560c178ce069cc014138ed3c2f5221ba71f58a",
          "Side": {

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
    Type                   # "buy" or "sell" (from pool's perspective)
    Buyer                  # Buyer of the side currency
    Seller                 # Seller of the side currency
  }
}
```

**Note on Pool Role**: The `Side.Type` field indicates the pool's role relative to the side currency:
 - If `Side.Type` is `"buy"`, the pool is the buyer of the side currency (pool = `Side.Buyer`)
 - If `Side.Type` is `"sell"`, the pool is the seller of the side currency (pool = `Side.Seller`)

## Filtering in DEXTradeByTokens Cube

Filtering helps to fetch the exact data you are looking for. DexTradeByTokens Cube can filter based on currency, buyer, seller, dex, pool, sender, transaction, time, etc.

Everything inside the "where" clause filters; it follows the `AND' condition by default.

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
