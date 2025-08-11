---
sidebar_position: 1
---

# Getting Started - TradingView Data API

In this tutorial, we will see how to use [TradingView's Advanced Charts API](https://in.tradingview.com/advanced-charts/) and plot DEX trading data with Bitquery APIs. Additionally, this tutorial will show how to use TradingView subscriptions to calculate OHLC in real-time. You can find the complete code of the tutorial [here](https://github.com/bitquery/tradingview-subscription-realtime/tree/main).

The final chart will look like this and will add new candlestick as data is updated.
 ![](/img/ApplicationExamples/charting.gif) 

- To do that, you need to get access to TradingView's private Advanced Charts API library by filling out the form.
- Next, create a new React project.
- Once done, follow the first two steps of their [tutorial](https://www.tradingview.com/charting-library-docs/latest/tutorials/First-Run-Tutorial) to add the **charting_library** and **datafeeds** libraries to your new React project folder. For this tutorial, **I have added the folders in the `src` and `public` folder**.

- Now we will write different parts of the logic:

  - The main App
  - The logic to get historical OHLC using [Price Index API](https://docs.bitquery.io/docs/trading/price-index/introduction/)
  - The logic to subscribe to real-time OHLC using same APIs
  - The custom datafeed object setup
  - The widget code

- We will start by building the historical OHLC data.
