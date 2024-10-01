# Setting Up `App.js`

To complete the setup and run the chart, we need to call the `TVChartContainer` component inside the main `App.js` file. Here's the process:

---

### 1. `App.js`

```javascript
import "./App.css";
import TVChartContainer from "./TVChartContainer";

function App() {
  return (
    <div className="App">
      <TVChartContainer />
    </div>
  );
}

export default App;
```

- **App.js**: This is the entry point of your React app. It imports the `TVChartContainer` component, which encapsulates the TradingView chart logic. The component is rendered inside a `div` with the class `App`.

---

### 2. Run the Application

Now that you have set up `App.js`, you can run the application using the following command:

```bash
npm start
```

This will start the development server, and your TradingView chart with both historical and real-time OHLC data should now be visible.

