---
sidebar_position: 4
---

# Crypto Dashboard Project 

The following tutorial helps build a Cryptocurrency Portfolio Dashboard with React that fetches and displays the balance of different currencies for a given Ethereum address using the Bitquery Streaming API.

This is how it will look ![finally](/img/ApplicationExamples/crypto_dashboard.gif)

The app has the following features:

1.  It renders an input field and a button to trigger the data fetching process.
2.  It displays a spinner while the data is being fetched.
3.  It displays a table with the currency name and the corresponding balance once the data is fetched.
4.  It handles errors during the data fetching process.

The app uses the following libraries and APIs:

1.  React: A JavaScript library for building user interfaces.
2.  Axios: A promise-based HTTP client for the browser and Node.js.
3.  Bitquery GraphQL API: A service that provides access to blockchain data through a GraphQL interface.

To use this code, you need to have the following dependencies installed in your project:

1. react
2. react-dom
3. axios
4. react-icons


### Create App
Create an empty react app with the
```
npx create-react-app my-app

```
command and clear the defaults in app.js file. 


### Import Statements
```
import React, { useState } from 'react';
import axios from 'axios';
import './portfolio.css';
import { FaSpinner } from 'react-icons/fa';

```
### Functional Component
```js
function App() {
  const [data, setData] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = () => {
    setIsLoading(true);
    var query = `query MyQuery {
      EVM(dataset: combined, network: eth) {
        BalanceUpdates(
          where: { BalanceUpdate: { Address: { is: "${address}" } } }
        ) {
          Currency {
            Name
          }
          balance: sum(of: BalanceUpdate_Amount)
        }
      }
    }`;

    var data = JSON.stringify({ query });

    var config = {
      method: 'post',
      url: 'https://streaming.bitquery.io/graphql',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'YOUR KEY'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setData(response.data.data.EVM.BalanceUpdates);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  };

```  
### State Management with `useState` Hook

-   `const [data, setData] = useState(null);`: Declares a state variable `data` that is initially `null`. Also defines a setter function `setData` to update the state value of `data`.
-   `const [address, setAddress] = useState('');`: Declares a state variable `address` that is initially an empty string. Also defines a setter function `setAddress` to update the state value of `address`.
-   `const [isLoading, setIsLoading] = useState(false);`: Declares a state variable `isLoading` that is initially `false`. Also defines a setter function `setIsLoading` to update the state value of `isLoading`.

### `fetchData` Method

-   `const fetchData = () => { ... }`: Defines a method `fetchData` that makes an HTTP POST request to the Bitquery API to retrieve data for the entered Ethereum address.

### Component Render
```js
  return (
    <div>
      <h1>Your Portfolio</h1>
      <input className="address-input"
        type="text"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Enter address"
      />
      <button onClick={fetchData} className="fetch-data-button"> {isLoading ? <FaSpinner className="spinner" /> : 'Fetch data'}</button>
      {isLoading ? (
        <div className="loading-spinner-container">
          <FaSpinner className="loading-spinner" />
        </div>
      ) : (
        data && (
          <table className="balance-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Currency.Name}</td>
                  <td>{item.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

export default App;
```
### CSS Styling
The app uses CSS classes defined in a separate portfolio.css file to style various elements:
```css
.balance-list {
    display: table-cell;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding: 0;
  list-style: none;
  }
  
  .balance-list li {
    display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 5px;
  }

  
  
  .currency-name {
    font-weight: bold;
    font-size: 1.2rem;
  margin-right: 1rem;
  }
  
  .balance-amount {
    font-size: 1.2em;
    font-family: monospace;
  }
  .fetch-data-button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2em;
  }
  
  .fetch-data-button:hover {
    background-color: #3e8e41;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .fade-in {
    animation: fadeIn 1s ease-in-out;
  }

  .address-input {
    font-size: 1.2rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
    outline: none;
    margin-right: 0.5rem;
  }
  
```