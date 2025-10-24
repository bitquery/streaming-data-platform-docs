---
title: "Real-Time Crypto Charting API - Live OHLCV Stream & TradingView Integration"
description: "Build real-time crypto charts with live OHLCV data streams. Get 1-second candlestick updates, real-time price data, and seamless TradingView integration for DEX trading analytics."
sidebar_position: 1
keywords:
  [
    real-time crypto charting,
    OHLCV stream,
    live candlestick data,
    crypto price streaming,
    TradingView API,
    real-time OHLC,
    crypto trading charts,
    live DEX data,
    streaming candlesticks,
    real-time price feed,
  ]
---

# Getting Started - TradingView Data API

In this tutorial, we will see how to use [TradingView's Advanced Charts API](https://in.tradingview.com/advanced-charts/) and plot DEX trading data with Bitquery APIs. Additionally, this tutorial will show how to use TradingView subscriptions to calculate OHLC in real-time. You can find the complete code of the tutorial [here](https://github.com/bitquery/tradingview-subscription-realtime/tree/main).

The final chart will look like this and will add new candlestick as data is updated.
![](/img/ApplicationExamples/charting.gif)

- To do that, you need to get access to TradingView's private Advanced Charts API library by filling out the form.
- Next, create a new React project.
- Once done, follow the first two steps of their [tutorial](https://www.tradingview.com/charting-library-docs/latest/tutorials/First-Run-Tutorial) to add the **charting_library** and **datafeeds** libraries to your new React project folder. For this tutorial, **I have added the folders in the `src` and `public` folder**.

## Queries and Streams Used

- [Crypto Price OHLC API for historical data](https://ide.bitquery.io/Historical-price-data)
- [Crypto Price OHLC Stream for Realtime OHLC](https://ide.bitquery.io/1-second-crypto-price-stream)

- Now we will write different parts of the logic:

  - The main App
  - The logic to get historical OHLC using [Crypto Price API](https://docs.bitquery.io/docs/trading/price-index/introduction/)
  - The logic to subscribe to real-time OHLC using same APIs
  - The custom datafeed object setup
  - The widget code

- We will start by building the historical OHLC data.
