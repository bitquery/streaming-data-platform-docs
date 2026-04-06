---
sidebar_position: 3
---

# Bar continuity (OHLC stitching)

TradingView draws each candle from the **open, high, low, close** you supply. If the next bar’s **open** does not equal the previous bar’s **close**, the bodies can look disconnected or “floating,” even when the underlying stream is correct.

That mismatch is common with **aggregated** OHLC from APIs: interval boundaries, late trades, or how the backend rounds bars are not always the same as a strict “open = prior close” rule.

This tutorial addresses continuity in two places:

| Path | What we do |
|------|------------|
| **Historical** | After sorting bars from the REST/GraphQL response, run `connectBarContinuity` on the array so each bar’s open (and high/low envelope) lines up with the previous close. See [Getting Historical Data](/docs/usecases/tradingview-subscription-realtime/historical_OHLC/#bar-continuity-historical). |
| **Real-time** | Track the last emitted bar’s time and close; when the stream advances to a new candle timestamp, set the new bar’s open to that close and expand high/low. See [Fetching Real-time OHLC](/docs/usecases/tradingview-subscription-realtime/realtime_OHLC/#subscribing-to-the-stream). |

## What changes, what does not

- **Adjusted:** `open`, and possibly `high` / `low`, so the candle **touches** the prior close visually.
- **Unchanged:** `close`, `volume`, and time—so the **last price** and **volumes** stay as returned by Bitquery.

This is a **presentation** normalization for the chart, not a change to exchange-reported economics.

## Placeholder / missing bars

Padding the series with synthetic bars (for example zero OHLC) only fills **time slots** so TradingView has enough points. It does **not** fix continuity between **real** API bars. Always run continuity on the real bars first, then prepend placeholders if your app still needs them.

## Reference implementation

The sample repo includes:

- [`barContinuity.js`](https://github.com/bitquery/tradingview-subscription-realtime/blob/main/src/barContinuity.js) — `connectBarContinuity(bars)`
- [`histOHLC.js`](https://github.com/bitquery/tradingview-subscription-realtime/blob/main/src/histOHLC.js) — calls it after sorting
- [`webSocketOHLC.js`](https://github.com/bitquery/tradingview-subscription-realtime/blob/main/src/webSocketOHLC.js) — live stitching across candle boundaries
