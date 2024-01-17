---
sidebar_position: 4
---

# Custom Datafeed Object

Create a file called `datafeed_custom.js` that will have the implementation for the default datafeed object for the data we will be importing to the charts.This defines a custom data feed for charting purposes.

To build the datafeed object, we need to first setup a custom implementation of `onReady` and `resolveSymbol`. Continue reading below to see how to do it.

## Setup OnReady

Before configuring the custom data feed object, override the default `onReady` implementation by creating a file named `onReady.js` and defining the `onReady` function.

```javascript
const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
  // ... other configuration data
};

export const onReady = (callback) => {
  // console.log('[onReady]: Method call');
  setTimeout(() => callback(configurationData));
};
```

## Setup resolveSymbol

### Resolving Symbol Information

The `resolveSymbol.js` file contains a function responsible for resolving symbol information required by the charting library. It determines and provides details about the symbol to be displayed on the chart.
You can read more about this [here](https://www.tradingview.com/charting-library-docs/latest/connecting_data/Datafeed-API?_highlight=resolvesymbol#resolvesymbol)


#### Step by Step Code

Add the below code to the file. The `resolveSymbol` function is used to fetch and resolve symbol information based on the provided `symbolName`. It takes callback functions to handle successful symbol resolution (`onSymbolResolvedCallback`) and errors (`onResolveErrorCallback`).

```javascript
export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  // Can be retrieved from query or hardcoded
   const tokenSymbol = "USDT";

  // Check if token symbol is available
  if (!tokenSymbol) {
    onResolveErrorCallback();
  } else {
    // Symbol information for the resolved token
     const symbolInfo = {
      ticker: tokenSymbol,
      name: `${tokenSymbol}/WETH`,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 1000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      has_empty_bars: false,
      has_weekly_and_monthly: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supported_intervals: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      countBack: 30,
      volume_precision: 2,
      visible_plots_set: 'ohlcv',
    };

    // Callback with the resolved symbol information
    onSymbolResolvedCallback(symbolInfo);
};
```

#### Resolving Symbol Details

The function extracts the `tokenSymbol` information, in this case, `"USDT"`. If `tokenSymbol` exists, it constructs and provides symbol information, otherwise, it triggers an error callback.


#### Usage

This function is used within the charting system to obtain detailed information about the specified symbol, allowing the charting library to render the symbol correctly with the appropriate settings.

Next we will use `onReady` and `resolveSymbol` in datafeed object creation.

## Step-by-Step Guide for Datafeed Object

Now in the `datafeed_custom.js` file, add the following code:

#### 1. Importing Functions

```javascript
// File: datafeed_custom.js

// Importing functions from other files
import { onReady } from "./onReady";
import { resolveSymbol } from "./resolveSymbol";
import { getBars, subscribeBars, unsubscribeBars } from "./getBars";
```

This part of the code imports functions (`onReady`, `resolveSymbol`, `getBars`, `subscribeBars`, `unsubscribeBars`) from separate files (`onReady.js`, `resolveSymbol.js`, `getBars.js`).

#### 2. Datafeed Object Creation

```javascript
// File: datafeed_custom.js

// Creating an object named Datafeed that contains imported functions
const Datafeed = {
  onReady,
  resolveSymbol,
  getBars,
  subscribeBars,
  unsubscribeBars,
};
```

Here, an object named `Datafeed` is created. It's an object literal containing references to the imported functions. This object acts as a unified interface or data feed handler for the charting library, to provide necessary data for rendering charts.

#### 3. Exporting the Datafeed Object

```javascript
// File: datafeed_custom.js

// Exporting the Datafeed object as the default export
export default Datafeed;
```

This line exports the `Datafeed` object as the default export of this module. By doing so, this module can be imported and used elsewhere in the application, providing the specified functions for data retrieval and handling to the charting components or libraries.

- Next, go to [getBars Setup Page](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/getBars/) to start building
