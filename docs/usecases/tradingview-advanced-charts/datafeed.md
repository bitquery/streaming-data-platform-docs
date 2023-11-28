---
sidebar_position: 4
---

Create a file called datafeed_custom.js that will have the implementation for the default datafeed object for the data we will be importing to the charts.This defines a custom data feed for charting purposes.

### Step-by-Step

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
