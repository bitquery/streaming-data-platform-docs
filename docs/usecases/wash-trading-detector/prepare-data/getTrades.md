---
title: "Fetching Solana DEX Trades for the Wash Trading Detector"
description: "Data collection for the Solana wash trading detector: a Bitquery GraphQL query for the latest DEX trades with both sides and USD prices, wrapped in Python."
keywords:
  - Solana DEX trades Python
  - Bitquery GraphQL Python
  - wash trading detector data
  - fetch Solana trades API
  - DEXTrades query
---

import FAQ from "@site/src/components/FAQ";

# Fetching Solana DEX Trades for the Wash Trading Detector

The [wash trading detector](/docs/usecases/wash-trading-detector/overview) starts from a batch of recent Solana DEX trades. This module fetches them from Bitquery with one GraphQL query and returns them as a list of dictionaries that the [labelling rules](/docs/usecases/wash-trading-detector/prepare-data/rules) and the model read. Everything the rules need is in the row: the buy and sell side with the trading account, amount and USD price, the DEX, the block and the signature. The full project is on [GitHub](https://github.com/Kshitij0O7/wash-trading-detector).

## The query

The newest successful trades across all Solana DEXs. `limit` bounds the batch; raise it for training runs and lower it for the live dashboard. Solana queries go to the `eap` endpoint. Run it in the [IDE](https://ide.bitquery.io/Solana-dextrades) first.

```graphql
{
  Solana {
    DEXTrades(
      limit: { count: 200 }
      orderBy: { descending: Block_Time }
      where: { Transaction: { Result: { Success: true } } }
    ) {
      Trade {
        Dex {
          ProtocolName
          ProtocolFamily
        }
        Buy {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
          PriceInUSD
        }
        Sell {
          Account {
            Address
          }
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
          PriceInUSD
        }
      }
      Block {
        Time
        Height
      }
      Transaction {
        Signature
        FeePayer
      }
    }
  }
}
```

Both sides carry an `Account`, so the rules can compare buyer and seller, and `FeePayer` identifies who paid for the transaction, which is what a self-trade check needs.

## The `get_trades` function

The function reads the access token from Streamlit secrets so the key never sits in the code, posts the query, and returns the list of trades or an empty list on any failure. Generate a token on the [access tokens page](https://account.bitquery.io/user/api_v2/access_tokens).

```python
import json

import requests
import streamlit as st

URL = "https://streaming.bitquery.io/eap"

QUERY = """
{
  Solana {
    DEXTrades(
      limit: { count: 200 }
      orderBy: { descending: Block_Time }
      where: { Transaction: { Result: { Success: true } } }
    ) {
      Trade {
        Dex { ProtocolName ProtocolFamily }
        Buy {
          Account { Address }
          Amount
          AmountInUSD
          Currency { Symbol Name MintAddress }
          PriceInUSD
        }
        Sell {
          Account { Address }
          Amount
          AmountInUSD
          Currency { Symbol Name MintAddress }
          PriceInUSD
        }
      }
      Block { Time Height }
      Transaction { Signature FeePayer }
    }
  }
}
"""


def get_trades():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {st.secrets['token']}",
    }
    try:
        response = requests.post(URL, headers=headers, data=json.dumps({"query": QUERY}), timeout=60)
        response.raise_for_status()
        return response.json()["data"]["Solana"]["DEXTrades"]
    except (requests.exceptions.RequestException, KeyError, json.JSONDecodeError) as err:
        print(f"Error fetching DEX trades: {err}")
        return []
```

## What the rest of the project does with the rows

- The [labelling rules](/docs/usecases/wash-trading-detector/prepare-data/rules) flag trades where the same account is on both sides, repeated round trips between two accounts, and prices far from the token's recent range.
- The [labelling module](/docs/usecases/wash-trading-detector/prepare-data/label) applies those rules and writes an `is_wash_trades` column.
- [Training](/docs/usecases/wash-trading-detector/training) fits an XGBoost model on the labelled rows, and the [app](/docs/usecases/wash-trading-detector/app) scores fresh batches from this same function.

<FAQ
  items={[
    { q: "Which endpoint serves Solana DEX trades?", a: "https://streaming.bitquery.io/eap. Send the query as JSON with a Bearer access token in the Authorization header; the response holds the rows under data.Solana.DEXTrades." },
    { q: "How many trades should one batch fetch?", a: "The example uses 200 for the live dashboard; raise the limit for a training run. Keep orderBy on Block_Time descending so each batch is the newest trades." },
    { q: "Why does the query filter on Transaction.Result.Success?", a: "Failed transactions still appear in the cube. Excluding them keeps trades that never settled out of the training data." },
    { q: "Can I stream trades instead of polling?", a: "Yes. Change query to subscription and remove limit and orderBy to receive each trade over WebSocket, or consume the Solana DEX trades Kafka topic for lower latency." },
  ]}
/>

## Related pages

- [Wash trading detector overview](/docs/usecases/wash-trading-detector/overview)
- [Solana DEX trades API](/docs/blockchain/Solana/solana-dextrades)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
