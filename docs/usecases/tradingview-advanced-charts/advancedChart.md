---
sidebar_position: 6
---

# Building the Chart

Create a file called `advanced_chart.js` that will have a  React component that acts as a container for a TradingView charting widget. 

### Step-by-Step Guide

#### 1. Importing Dependencies and Datafeed

```javascript
import React, { useEffect, useRef } from "react";
import { widget } from "./charting_library";
import Datafeed from "./datafeed_custom";
```

This section imports necessary dependencies such as React's `useEffect` and `useRef`, as well as the `widget` from the charting library and the `Datafeed` module for providing chart data.

#### 2. Defining the `TVChartContainer` Component

```javascript
const TVChartContainer = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const widgetOptions = {
      // Configuration options for the TradingView widget
      // ... (Continues below)
    };

    // Creating a new TradingView widget instance
    const tvWidget = new widget(widgetOptions);

    // Cleaning up when the component unmounts
    return () => {
      tvWidget.remove();
    };
  }, []);

  // Returning a div to hold the chart with a reference to chartContainerRef
  return <div ref={chartContainerRef} style={{ height: '700px', backgroundColor: 'black' }} />;
};

export default TVChartContainer;
```

This `TVChartContainer` component is a functional component that uses React's hooks (`useEffect` and `useRef`). It creates a reference to a `div` element (`chartContainerRef`) that will hold the TradingView chart. The `useEffect` hook is used to initialize the TradingView widget when the component mounts and clean up resources when it unmounts.

#### 3. Widget Configuration and Initialization

```javascript
// Inside the useEffect hook
const widgetOptions = {
  // Configuration options for the TradingView widget
  symbol: "USDT",
  datafeed: Datafeed,
  container: chartContainerRef.current,
  library_path: "/charting_library/",
  interval: "5",
  // ... (Continues below)
};

// Creating a new TradingView widget instance with specified options
const tvWidget = new widget(widgetOptions);
```

This section creates configuration options for the TradingView widget. It specifies parameters such as the symbol, data feed, container element, library path, interval, theme, and various customization options for the chart.

#### 4. Cleanup on Component Unmount

```javascript
// Inside the useEffect hook
return () => {
  // Removing the TradingView widget when the component unmounts
  tvWidget.remove();
};
```

This section ensures that when the `TVChartContainer` component unmounts, it removes the TradingView widget instance, preventing memory leaks or conflicts.



