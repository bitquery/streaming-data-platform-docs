---
sidebar_position: 3
---

# Writing App.js Code

This code sets up a React component (`App`) that serves as the entry point for the application. It imports styles, the `TVChartContainer` component, and then renders the `TVChartContainer` component within a div with the class name "App."

### Step-by-Step Guide

#### 1. Importing Styles

```javascript
// File: App.js

// Import the styles from the "App.css" file
import "./App.css";
```

This line imports the styles defined in the "App.css" file, presumably containing CSS rules for styling the components in this application.

#### 2. Importing the `TVChartContainer` Component

```javascript
// File: App.js

// Import the TVChartContainer component from the "advanced_chart" file
import TVChartContainer from "./advanced_chart";
```

This line imports the `TVChartContainer` component from the "advanced_chart.js" file. This component is likely to be responsible for rendering an advanced chart using TradingView or a similar library.

#### 3. Defining the `App` Component

```javascript
// File: App.js

// Define the functional component App
function App() {
  // Return JSX that renders the TVChartContainer component
  return (
    <div className="App">
      <TVChartContainer />
    </div>
  );
}
```

This section defines the `App` component, which is a functional component. It returns JSX that renders a `div` with the class name "App" and includes the `TVChartContainer` component.

#### 4. Exporting the `App` Component

```javascript
// File: App.js

// Export the App component as the default export
export default App;
```


- Next, go to [Custom Datafeed Setup Page](https://docs.bitquery.io/docs/usecases/tradingview-advanced-charts/datafeed/) to start building