# Calculations and Scripting

We will be using a simple fromula given below to calculate and trace the real-time balance changes. To execute this formula through code we will build two files (namely balance.js and index.js).

```
Current Balance = sum(all_balance_updates) + steam_balance_updates
``` 

## Initialise and Installing Dependencies

To initiate the project run the following command.

```
npm init -y
```

Before going further make sure that all the dependencies are installed. The dependencies are listed below:

- axios
- dotenv
- express
- ws

Use the following command to install these dependencies.

```
npm install axios dotenv express ws
```

## Create Balance Script

This script will calculate the summation of all the Balance Updates till yet, giving the current balance of a particular currency (Ethereum in this example) for the wallet. Follow the steps given below to build the script

1. Import the dependencies

``` js
const axios = require('axios');

require('dotenv').config()
```

**NOTE:** Make sure to create a `.env` file and create a AUTH_TOKEN variable to store your Bitquery Access Token. To know more about the access token click [here](https://account.bitquery.io/user/api_v2/access_tokens).

2. Create a standard config for the getBalance function. This includes the API url we are trying to hit, access token to authenticate the request, and the request body as data.

``` js

let data = JSON.stringify({
    "query": "{\n  EVM(dataset: combined, network: eth) {\n    BalanceUpdates(\n      where: {BalanceUpdate: {Address: {is: \"\"}}, Currency: {SmartContract: {is: \"0x\"}}}\n    ) {\n      sum(of: BalanceUpdate_Amount)\n    }\n  }\n}\n",
    "variables": "{}"
 });

let config = {
   method: 'post',
   maxBodyLength: Infinity,
   url: 'https://streaming.bitquery.io/graphql',
   headers: { 
      'Content-Type': 'application/json', 
      'X-API-KEY': 'BQYuTITWanwYGz0YLGdcWSADO74o5RTX', 
      'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
   },
   data : data
};

```

Please note that the data part is a standard case, but will be modified upon the user input.

3. Create the asynchronous getBalance function.

``` js
const getBalance = async (config) => {
    try {
        const response = await axios.request(config);
        // console.log(response.data.data.EVM.BalanceUpdates[0].sum)
        return response.data.data.EVM.BalanceUpdates[0].sum;        
    } catch (error) {
        return error;
    }

}
```

4. Export the requirements from the file.

```js
module.exports = {getBalance, config};
```

## Create Index Script

In this file we will write code to:

- Get Balance using the getBalance function from balance.js.
- Create an express server so that we can render a simple UI.
- Run a websoket connection to get real-time balance updates.

1. Import the requirements.

``` js
const express = require('express');
const path = require('path');
const { getBalance, config } = require('./balance.js');
require('dotenv').config();
```

2. Initiate the express server and declare the address variable.

```js
const app = express();
app.use(express.static(path.join(__dirname)));
app.use(express.json());

let currentAddress = '';  // Default address if none provided
```


3. Creating the endpoint to handle address input from frontend.

``` js
app.post('/track-balance', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ success: false, message: 'Address required' });
    }
    currentAddress = address;
    res.json({ success: true });
});
```
4. Creating the endpoint to get the balance from getBalance function.

``` js
app.get('/get-balance', async (req, res) => {
    try {
        // Update the address in the config dynamically
        config.data = JSON.stringify({
            "query": `{\n  EVM(dataset: combined, network: eth) {\n    BalanceUpdates(\n      where: {BalanceUpdate: {Address: {is: \"${currentAddress}\"}}, Currency: {SmartContract: {is: \"0x\"}}}\n    ) {\n      sum(of: BalanceUpdate_Amount)\n    }\n  }\n}\n`,
            "variables": "{}"
        });

        const balance = await getBalance(config);
        res.json({ balance: balance || '0' });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Error fetching balance' });
    }
});
```

5. Start WebSocket connection for real-time updates.

``` js
const { WebSocket } = require("ws");

const bitqueryConnection = new WebSocket(
  "wss://streaming.bitquery.io/graphql?token=" + process.env.AUTH_TOKEN,
  ["graphql-ws"],
);

bitqueryConnection.on("open", () => {
  console.log("Connected to Bitquery.");

  const initMessage = JSON.stringify({ type: "connection_init" });
  bitqueryConnection.send(initMessage);
});

bitqueryConnection.on("message", async (data) => {
  const response = JSON.parse(data);
  
  if (response.type === "connection_ack") {
    const subscriptionMessage = JSON.stringify({
      type: "start",
      id: "1",
      payload: {
        query: `
        subscription {
            EVM{
                BalanceUpdates(
                    where: {
                        BalanceUpdate: {
                            Address: {
                                is: "${currentAddress}"
                            }
                        }, 
                        Currency: {SmartContract: {is: "0x"}}
                    }
                ) {
                    BalanceUpdate {
                        Amount
                    }
                }
            }
        }`,
      },
    });

    bitqueryConnection.send(subscriptionMessage);
    console.log("Subscription message sent.");
  }
});

bitqueryConnection.on("error", (error) => {
  console.error("WebSocket Error:", error);
});
```

6. Start the Express server.

``` js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Now we need to build a simple UI using HTML, CSS and Javascript to make this project inituitive.