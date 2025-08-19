# Stablecoin Balance API

The Stablecoin API by Bitquery provides you the comprehensive set of APIs which can provide you realtime transfers, realtime trades, realtime price, holder distribution of stablecoins across chains with a single API call.

We are going to particularly deep-dive into how to get Stablecoin Balance data in this section.

## Stablecoin Balance of an Address

### Solana

Below stream will give you balance of `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM` for `FDUSD` on Solana. Test the query [here](https://ide.bitquery.io/FDUSD-balance-of-an-address).

```
query MyQuery {
  Solana {
    BalanceUpdates(
      where: {BalanceUpdate: {Account: {Owner: {is: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"}}, Currency: {MintAddress: {is: "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u"}}}}
      orderBy: {descendingByField: "BalanceUpdate_Balance_maximum"}
    ) {
      BalanceUpdate {
        Balance: PostBalance(maximum: Block_Slot)
        Currency {
          Name
          Symbol
        }
      }
    }
  }
}

```

### Ethereum

[Run Query](https://ide.bitquery.io/balance-of-a-wallet_1)

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    BalanceUpdates(
      where: {BalanceUpdate: {Address: {is: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6"}}}
      orderBy: {descendingByField: "balance"}
    ) {
      Currency {
        Name
      }
      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
      BalanceUpdate {
        Address
      }
    }
  }
}

```

More examples on balance and balance updates on EVM chains can be found [here](https://docs.bitquery.io/docs/examples/balances/balance-api/)

Token holder API examples can be found [here](https://docs.bitquery.io/docs/examples/token-holders/token-holder-api/)

## Get Top 100 Holders of a Particular Stablecoin

[This query](https://ide.bitquery.io/top-100-holders-of-USDC-token-on-Solana) returns the top 100 holders of a particular Stablecoin.

```
query MyQuery {
  Solana {
    BalanceUpdates(
      orderBy: {descendingByField: "BalanceUpdate_Holding_maximum"}
      where: {BalanceUpdate: {Currency: {MintAddress:
        {is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"}},
        }, Transaction: {Result: {Success: true}}}
    ) {
      BalanceUpdate {
        Currency {
          Name
          MintAddress
          Symbol
        }
        Account {
          Address
        }
        Holding: PostBalance(maximum: Block_Slot selectWhere:{gt:"0"})
      }
    }
  }
}
```
