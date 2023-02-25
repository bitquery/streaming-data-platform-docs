---
sidebar_position: 3
---

# Filtering

In most cases you do not need the full dataset, but just a portion, related to the 
entity or range you are interested in.

Filtering can be applied to queries and subscriptions:

* in query, filter defines what part of the dataset you need in results
* with subscription, filter also determine when the updated data will be sent to you. If the new data does not match filter, update will not be triggered

:::tip
Use filters in subscription for notification services on specific type of events matching filter criteria
:::

Filters are defined on the cube element level ( Blocks, Transactions, so on) as a ```where``` attribute.

## Examples


```graphql
{
  EVM {
    Blocks(where: {
      	Block: {
          GasUsed: {
            ge: "14628560"
          }
        }
    }) {
      Block {
        Number
      }
    }
  }
}
```

returns block numbers with gas used exceeding certain level. ```where``` attribute is structured,
with the same levels as the query schema. This allows to build complex filters by combining criteria,
as in the following example:

```graphql
{
  EVM {
    Transactions(where: {
      	Block: {
          GasUsed: {
            ge: "26000000"
          }
        }
      Transaction: {
        Gas: {
          ge: "16000000"
        }
      }
    }) {
      Block {
        GasUsed
      }
      Transaction {
        Gas

      }
    }
  }
}

```

:::note
filters are combined by **AND** principles, result set is an intersection of all criteria defined in the
```where``` attribute
:::

## Filter Types

Depending on the data type of the element used in ```where``` filter, different operators can be applied.

### Numeric Filter Types

For numeric data, the following operators applicable:

* ```eq``` equals to
* ```ne``` not equals to
* ```ge``` greater or equal
* ```gt``` greater than
* ```le``` less or equal
* ```lt``` less than

:::tip
If you need to define the range of value, use ```ge``` and ```le``` together:

```
          GasUsed: {
            ge: "26000000"
            le: "60000000"
          }
```
:::tip

:::note
Almost all numeric values in blockchain lies above the 32-bit boundary defined for numbers in GraphQL
and JSON. So the string values used instead to define any number with not limited precision.
:::

### String Filter Types

For string data, the following operators applicable:

* ```is``` equals to
* ```not``` not equals to
