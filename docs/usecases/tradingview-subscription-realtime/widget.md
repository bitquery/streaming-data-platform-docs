---
sidebar_position: 5
---
# Widget Creation

Now that we have setup a custom DataFeed, we need to create the TradingView Widget.
The following code explains the `TVChartContainer.js` code file, which is responsible for rendering the TradingView chart and managing its configuration using the TradingView Advanced Charting Library.

```javascript
import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library"; // Ensure this is the correct path
import Datafeed from "./custom_datafeed";
```

#### Component Overview

- **Imports:**
  - `React`, `useEffect`, and `useRef` from React for managing component state and lifecycle.
  - `widget` from the TradingView charting library to initialize the chart.
  - `Datafeed` is a custom data source to fetch data (this is linked to the DEX data fetched via Bitquery API).

#### Component Definition

```javascript
const TVChartContainer = () => {
  const chartContainerRef = useRef(null);
```

- **chartContainerRef:** A reference to the chart container's `div`, which will be used as the mounting point for the TradingView widget.

```javascript
console.log("TVChartContainer called.");
```

- **Debugging Info:** A simple log to ensure the component is rendered.

#### useEffect Hook

```javascript
  useEffect(() => {
    console.log("TVChartContainer useEffect called.");
```

- The `useEffect` hook is used to initialize the TradingView widget when the component is mounted. It also includes a cleanup function to remove the widget when the component is unmounted.

#### Widget Initialization

```javascript
const widgetOptions = {
  symbol: "WIF",
  datafeed: Datafeed,
  interval: ["1"],
  container: chartContainerRef.current,
  library_path: "/charting_library/", // Ensure this path is correct
  locale: "en",
  disabled_features: ["use_localstorage_for_settings"],
  enabled_features: ["study_templates"],
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
  studies_overrides: {},
  debug: true,
  chartType: 1,
  supports_marks: true,
  supports_timescale_marks: true,
  supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
  supported_intervals: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
  theme: "dark",
  pricescale: 1000,
  data_status: "streaming",
  overrides: {
    "mainSeriesProperties.statusViewStyle.showInterval": true,
    "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
    "mainSeriesProperties.priceAxisProperties.indexedTo100": true,
  },
};
```

- **Widget Options:**
  - `symbol`: The initial symbol that the chart will display.
  - `datafeed`: This is the custom datafeed to pull data from Bitquery API.
  - `interval`: Initial interval for the chart (for example, "1" for 1-minute intervals).
  - `container`: The DOM element where the chart will be rendered.
  - `library_path`: Path to the charting library files.
  - `locale`: Language for the widget (in this case, English).
  - `disabled_features`: Features disabled in the chart (e.g., storing settings in local storage).
  - `enabled_features`: Features that are enabled (like study templates).
  - `fullscreen` and `autosize`: Layout configuration for the chart.
  - `supports_marks` and `supports_timescale_marks`: Enable support for marks and time marks.
  - `supported_resolutions` and `supported_intervals`: Supported timeframes for the chart (in minutes, days, weeks, etc.).
  - `theme`: Dark mode is enabled for the chart.
  - `pricescale`: Sets the price scale, helpful for very small prices (indexed to one hundred for demo purposes). There are more options, read [here](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartPropertiesOverrides#properties)
  - `overrides`: Custom settings for displaying interval and symbol information.

```javascript
console.log("widgetOptions:", widgetOptions);
```

- **Debugging Info:** Log the widget options before initializing the widget.

#### Initializing the Widget

```javascript
const tvWidget = new widget(widgetOptions);
console.log("TradingView widget initialized.", tvWidget);
```

- A new instance of the TradingView widget is created using the defined options, and a log statement confirms its initialization.

#### Handling Chart Ready Event

```javascript
tvWidget.onChartReady(() => {
  console.log("Chart has loaded!");
  const priceScale = tvWidget
    .activeChart()
    .getPanes()[0]
    .getMainSourcePriceScale();
  priceScale.setAutoScale(true);
});
```

- **onChartReady:** This method ensures that after the chart is fully loaded, certain actions can be performed (e.g., setting the price scale to auto-scale for better display).

#### Cleanup on Unmount

```javascript
return () => {
  if (tvWidget) {
    console.log("Removing TradingView widget.");
    tvWidget.remove();
  }
};
```

- The cleanup function ensures that the widget is removed when the component is unmounted, freeing up memory.

#### Render Method

```javascript
  }, []);

  return (
    <div ref={chartContainerRef} style={{ height: "600px", width: "100%" }} />
  );
};

export default TVChartContainer;
```

- The component renders a `div` where the TradingView chart will be displayed, with the specified height and width.

---

This documentation should provide a clear understanding of the `TVChartContainer` component's functionality. Let me know if you'd like to add or change anything!
