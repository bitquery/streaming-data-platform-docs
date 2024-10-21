---
sidebar_position: 2
---

# Calculating Profit or Loss Over Time

This is the first step, where we calculate the Weighted Average of Buy Price(WABP) by getting all the `buy` trades of the token.
For this tutorial, we are getting the PnL of the `0x2107662b0eb1f95a42f47f667c6d4622fe1c9231` address for the following token `0x6982508145454ce325ddbe47a25d4ec3d2311933`.

```
WABP = sum(buyAmount*buyPriceInUSD)/sum(buyAmount)
```

We get the `sell` trades for the entire period and multiply the amount of tokens sold with the `priceInUSD` minus the WABP calculated. 

```
pnl = sum(sellPriceInUSD-WABP)
```

1.  Import the necessary libraries:



```javascript
const axios = require('axios');
require('dotenv').config()

```

2.  Create the config object with URL and headers, including your API key:

```javascript
let data;

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://streaming.bitquery.io/graphql',
    headers: { 
       'Content-Type': 'application/json', 
       'X-API-KEY': 'BQYuTITWanwYGz0YLGdcWSADO74o5RTX', 
       'Authorization': process.env.AUT_TOKEN
    },
    data : data
 };

```

3.  Make the `getWeightedAverage()` function to get the Weighted Average for the Buy Price.

```javascript
const getWeightedAverage = async (token, wallet) => {

}
```

4. Inside the declared function define the data property of object and get the response:

```javascript
let data = JSON.stringify({
   "query": "query MyQuery($token: String = \"\", $wallet: String = \"\") {\n  EVM(dataset: combined) {\n    DEXTrades(\n      where: {Trade: {Buy: {Currency: {SmartContract: {is: $token}}, PriceInUSD: {ne: 0}}}, Transaction: {From: {is: $wallet}}}\n    ) {\n      Trade {\n        Buy {\n          Amount\n          PriceInUSD\n        }\n      }\n    }\n  }\n}\n",
   "variables": `{\n  \"token\": \"${token}\",\n  \"wallet\": \"${wallet}\"\n}`
});
     
config.data = data;

const response = await axios.request(config);
const buyTrades = response.data.data.EVM.DEXTrades;

```

6.  Declare variables and Traverse the `buyTrades` array:

```javascript
let count = 0;
let sum = 0;
for( let i in buyTrades){

}
```

7.  Extract the `amount` and `PriceInUSD` from the buyTrades:

```javascript
let amount = parseFloat(buyTrades[i].Trade.Buy.Amount);
let price = buyTrades[i].Trade.Buy.PriceInUSD;

```

8.  Update the `sum` and `count` variables and return the WABP:

```javascript
sum += amount*price;
count += amount;
return sum/count;
```

9.  Make the `getPnL()` function to calculate the PnL for the address and the token.

```javascript
const getPnL = async (token, wallet) => {

}

```

10. Inside the declared function define the data property of object and get the response:

```javascript
let data = JSON.stringify({
   "query": "query MyQuery($token: String = \"\", $wallet: String = \"\") {\n  EVM(dataset: combined) {\n    DEXTrades(\n      where: {Trade: {Sell: {Currency: {SmartContract: {is: $token}}, PriceInUSD: {ne: 0}}}, Transaction: {From: {is: $wallet}}}\n      orderBy: {ascending: Block_Time}\n    ) {\n      Trade {\n        Sell {\n          Amount\n          PriceInUSD\n        }\n      }\n    }\n  }\n}\n",
   "variables": `{\n  \"token\": \"${token}\",\n  \"wallet\": \"${wallet}\"\n}`
});
config.data = data;     

const response = await axios.request(config);
const sellTrades = response.data.data.EVM.DEXTrades;

```

11.  Get the weighted average for the adress and token:

```javascript
const average = await getWeightedAverage(token, wallet);

```

12.  Declare variables and Traverse the `sellTrades` array:



```javascript
let pnl = 0;

for(let i in sellTrades){

}

```

13.  Update the `pnl` variable:

```javascript
let amount = parseFloat(sellTrades[i].Trade.Sell.Amount);
let sellPrice = sellTrades[i].Trade.Sell.PriceInUSD;

let margin = amount*(sellPrice-average);
pnl += margin;

```

14.  Print the `pnl`:

```javascript
console.log(pnl);

```
15. Run the function inside the `JS` script:

```javascript
getPnL("0x6982508145454ce325ddbe47a25d4ec3d2311933", "0x2107662b0eb1f95a42f47f667c6d4622fe1c9231"); // (token address, wallet address)
```

You can change the token address and wallet address as per your requirements, or even use these functions for creating a pipeline in a bigger application. The realised Profit for this account by trading this token as of `2024-10-21` is around `4 USD`.
