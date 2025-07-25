# Trade Labelling Module

The `label.py` module provides a single function, `label_trades`, that accepts raw DEX trade data and applies a series of rule-based checks to label each trade as wash trade or not.

These rules are imported from `token_rules.py`, allowing us to maintain a clean separation between rule logic and labeling orchestration.

## Purpose

The goal of this module is to return a labeled DataFrame with a new column `is_wash_trade`, where:
- `1` means the trade is flagged as wash trade
- `0` means the trade is considered normal

## Understanding Code Logic

### Imports and Function Initialisation

```py
import pandas as pd
from token_rules import (
    detect_self_trades,
    detect_repeated_pairs,
    detect_loops,
    detect_spoofing,
    get_suspicious_summary
)

def label_trades(trade_data):
    # All the code written below is placed here
```

- Imports all rule functions from `token_rules.py`.
- Uses `pandas` to work with structured tabular data.

### Flattening Trade Data

Converts the nested JSON object into a flat pandas Dataframe.

```py
    df = pd.json_normalize(trade_data)
```

### Applying Rules 

Each function returns a filtered DataFrame of suspicious trades that match one rule and finaly returns suspicious trades.

```py
    self_trades = detect_self_trades(df)
    repeated_pairs = detect_repeated_pairs(df)
    loops = detect_loops(df)
    spoofing = detect_spoofing(df)

    suspicious_tokens, suspicious_tx, suspicious_wallets = get_suspicious_summary(
        self_df=self_trades,
        repeated_df=repeated_pairs,
        loops_df=loops,
        spoofed_df=spoofing,
        original_df=df
    )
```

### Return Labeled Data

The suspicious trades are labelled as wash trades and returned.

```py
    df["is_wash_trade"] = (
        df["Trade.Buy.Account.Address"].isin(suspicious_wallets) |
        df["Trade.Sell.Account.Address"].isin(suspicious_wallets) |
        df["Transaction.Signature"].isin(suspicious_tx)
    )

    return df
```