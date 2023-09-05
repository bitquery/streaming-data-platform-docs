---
sidebar_position: 5
---

# Frequently Asked Questions and Some Explanations

## Understanding Buyside and Sellside in DEXTrades

Take this example trade: https://ide.bitquery.io/Buyside-SellSide-Explanation

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Transaction: {Hash: {is: "0x317679edc38c33e5e8810e72978503b0db37c3279be7581f664d7114d6ef8115"}}}
    ) {
      Trade {
        Buy {
          Buyer
          Seller
          Currency {
            Name
          }
        }
        Sell {
          Buyer
          Seller
          Currency {
            Name
          }
        }
      }
      Block {
        Time
      }
    }
  }
}


```

The buy side of the trade is buying `WETH` and the sell side of the trade is buying `Nova` Token. This means that the buyer is exchanging their `Nova` Token for `WETH`.

The Buy side in the Trade object contains information about the buyer, the seller, and the currency being traded. The `Buyer` field is the address of the account that is buying `WETH`. The `Seller` field is the address of the account that is selling the `WETH`.

In the sell side, the buyer and seller are switched. The sell side shows the trade from the perspective of the seller. The address that is selling `NOVA` is the `buyer`, and the address that is buying `NOVA` is the `seller`.
