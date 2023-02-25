---
sidebar_position: 2
---

# Network

Network attribute is a selection of the blockchain:

* ```eth```  for Ethereum Mainnet
* ```bsc```  for Binance Smart Chain
* other blockchains are in progress to add to dataset

If the attribute is missing, the default blockchain ```eth``` is used.

In the resulting data, blockchain is identified by ChainId dimension of the query.
There is a mapping of ChainId to the network as shown below:
```
eth: 1
bsc: 56
bsc_testnet: 97
goerli: 5
rinkeby: 4
ropsten: 3
sepolia: 11155111
classic: 61
mordor: 63
kotti: 6
astor: 212
polygon: 137
arbitrum: 42161
avalanche: 43114
optimism: 10
fantom: 250
cronos: 25
klaytn: 8217
fusion: 32659
huobi: 128
moonbeam: 1284
celo: 42220
canto: 7700
aurora: 1313161554
```


