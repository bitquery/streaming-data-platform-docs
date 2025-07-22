# Labelling Rules for Solana Wash Trades

This module implements a set of domain-specific rules to identify potentially suspicious DEX trades and label the column `is_wash_trades` as true against them. These rules will be applied to prepare labelled data on which the model training will occur. These rules will recieve a list of JSON objects and return a dataframe object.

## Detect Self Trades

This rule flags the trades where the buyer and seller are the same wallet address(a classic wash trading indicator) as wash trades.

```py
def detect_self_trades(df):
    return df[df["Trade.Buy.Account.Address"] == df["Trade.Sell.Account.Address"]]
```

## Detect Repeated Pairs

This rule flags wallet pairs that trade with each other more than threshold times, indicating collusion or repetitive trading behavior.

```py
def detect_repeated_pairs(df, threshold=5):
    pairs = df.groupby([
        "Trade.Buy.Account.Address",
        "Trade.Sell.Account.Address"
    ]).size().reset_index(name="count")
    return pairs[pairs["count"] > threshold]
```

## Detect Loops

This rule detects looped trades across different wallets, e.g., A → B → A, which may indicate sophisticated wash trading.

```py
def detect_loops(df):
    merged = df.merge(df, left_on="Trade.Buy.Account.Address", right_on="Trade.Sell.Account.Address")
    loops = merged[merged["Trade.Sell.Account.Address_x"] == merged["Trade.Buy.Account.Address_y"]]
    return loops
```

## Detect Spoofing

This rule identifies trades with unusually large price spreads between buy/sell sides, possibly faking market depth or price manipulation.

```py
def detect_spoofing(df, price_threshold=2.0):
    df["spread"] = abs(df["Trade.Buy.PriceInUSD"] - df["Trade.Sell.PriceInUSD"])
    return df[df["spread"] > price_threshold]
```

## Labeling Function

This function combines all the above rule-based outputs, identifies wallets involved in any suspicious activity and returns the list of suspicious tokens, suspicious wallet addresses and suspicious transaction signatures.

```py
def get_suspicious_summary(self_df, repeated_df, loops_df, spoofed_df, original_df):
    wallets = set(self_df["Trade.Buy.Account.Address"])
    wallets |= set(repeated_df["Trade.Buy.Account.Address"])
    wallets |= set(loops_df["Trade.Buy.Account.Address_x"])
    wallets |= set(spoofed_df["Trade.Buy.Account.Address"])

    suspicious_trades = original_df[
        original_df["Trade.Buy.Account.Address"].isin(wallets) |
        original_df["Trade.Sell.Account.Address"].isin(wallets)
    ]

    suspicious_tokens = suspicious_trades["Trade.Buy.Currency.MintAddress"].unique().tolist()
    suspicious_tx = suspicious_trades["Transaction.Signature"].unique().tolist()

    return suspicious_tokens, suspicious_tx, wallets
```