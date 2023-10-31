# Tutorial to build TradingView chart with real-time blockchain data (Streaming API version)

This is how it will look finally.

![Chart](/img/ApplicationExamples/tradingview.png)

**Step 1: Set up your React Environment**
Ensure you have a React application set up and ready for use. You should have a working React project with the necessary dependencies already installed.

**Step 2: Import Dependencies**
In your React component file, import the required dependencies at the beginning of your file. These include React, useState, useEffect, useRef, and the necessary charting library (in this case, `lightweight-charts`).

```javascript
import React, { useState, useEffect, useRef } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import { getTimestampInMilliseconds } from "./utils";
```

**Step 3: Create the React Component**
Create a React functional component for your TradingView chart. You can name it something like `TradingViewChart`.

```javascript
export default function TradingViewChart() {
  // State and Ref Declarations
  const [resdata, setData] = useState([]);
  const chartContainerRef = useRef();
  const chart = useRef();

  // useEffect Hook
  useEffect(() => {
    // Initialize the TradingView chart
    chart.current = createChart(chartContainerRef.current, {
      // Chart configuration options
      // ...
    });

    // Fetch and process data using the Streaming API
    const fetchData = async () => {
      // Fetch data from the API
      // ...

      if (response.status === 200) {
        // Process and format the data
        // ...

        // Create and populate candlestick and volume series
        // ...
      } else {
        console.log("error");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Trade Data</h1>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={{ height: 800, width: 800 }}
      />
    </div>
  );
}
```

**Step 4: Configure the Chart**
In the `useEffect` hook, initialize the TradingView chart with the desired configuration options. Customize the chart layout, appearance, and any other settings based on your requirements.

```javascript
chart.current = createChart(chartContainerRef.current, {
  width: chartContainerRef.current.clientWidth,
  height: chartContainerRef.current.clientHeight,
  layout: {
    backgroundColor: "#253248",
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    visible: false,
  },
  leftPriceScale: {
    visible: true,
  },
  timeScale: {
    borderColor: "#485c7b",
  },
});
```

**Step 5: Fetch Data from the Streaming API**
Create an `async` function named `fetchData` to fetch data from the Streaming API. You should use the `fetch` method to send a POST request to the API and retrieve the data. Adjust the query and variables to suit your data requirements.

```javascript
const fetchData = async () => {
  const response = await fetch("https://streaming.bitquery.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          EVM(network: eth, dataset: combined) {
            DEXTradeByTokens(
              orderBy: {ascending: Block_Date}
              where: {
                Trade: {
                  Currency: { SmartContract: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" } },
                  Side: { Currency: { SmartContract: { is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" } } }
                }
              }
              limit: { count: 200 }
            ) {
              Block {
                Date(interval: { in: days })
              }
              // ...
            }
          }
        }
      `,
      variables: "{}",
    }),
  });

  // Process and populate the chart with the retrieved data
  // ...
};
```

**Step 6: Process and Populate Data**
Within the `fetchData` function, process and format the retrieved data according to your needs. This includes extracting relevant information and populating the candlestick and volume series of the chart.

```javascript
if (response.status === 200) {
  const recddata = await response.json();
  const responseData = recddata.data.EVM.DEXTradeByTokens;

  // Process and format the data
  const extractedData = [];
  const extractedvol = [];

  responseData.forEach((record) => {
    // Extract and format data
    // ...

    // Push data to appropriate arrays (extractedData and extractedvol)
    // ...
  });

  // Create candlestick and volume series on the chart
  // ...
} else {
  console.log("error");
}
```

**Step 7: Render the Chart**
Render the TradingView chart within your React component by returning the chart container `div` inside the component's JSX.

```javascript
return (
  <div>
    <h1>Trade Data</h1>
    <div
      ref={chartContainerRef}
      className="chart-container"
      style={{ height: 800, width: 800 }}
    />
  </div>
);
```

**Step 8: Customize Further**
Customize the chart appearance, colors, and layout to meet your specific needs by adjusting the configuration options and series settings in the `createChart` and data population sections of your code.

That's it! You now have a React component that plots a TradingView chart using the Streaming API. Make sure to adjust the API endpoint and data processing logic to match your specific use case.