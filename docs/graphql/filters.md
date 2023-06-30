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

Filters are defined on the cube element level (Blocks, Transactions, so on) as a ```where``` attribute.

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

:::danger
```not``` and ```ne``` filters do not prevent to query large amount of data, consider use them only with
some other filters
:::


### Date and Time Filter Types

For date and timestamp data, the following operators applicable:

* ```is``` date equals to
* ```not``` date not equals to
* ```after``` after certain date (not including it)
* ```since``` after including date
* ```till``` before including date
* ```before``` before not including date

### Array Filter Types

Array fields can be filtered using the following conditions:

* ```length``` condition on array length;
* ```includes``` if array include  item defined by the condition; 
* ```excludes``` if array exclude  item defined by the condition;
* ```startsWith``` if array starts with the item defined by the condition;
* ```endsWith``` if array ends with the item defined by the condition;
* ```notStartsWith``` if array does not start with the item defined by the condition;
* ```notEndsWith``` if array does not end with the item defined by the condition;

:::note
Note that all conditions on items can be a list, they all applied to selecting the item in AND manner.
:::

Example of the condition is the following:

```
{
  EVM {
    Calls(
      where: {
        Arguments: {
					length: {eq: 2}
          includes: {
            Index: {eq: 0}
            Name: {is: "recipient"}
          }
        }
      }
      limit: {count: 10}) {
      Arguments {
        Index
        Name
        Type
      }
      Call {
        Signature {
          Signature
        }
      }
    }
  }
}

```

Filter selects calls which have 2 arguments, and the first argument name is "recipient"

Condition can combine conditions on the items:

```
Arguments: {
          includes: [
            {
            Index: {eq: 0}
            Name: {is: "recipient"}
            Value: {Address: {is: "0xa7f6ebbd4cdb249a2b999b7543aeb1f80bda7969"}}
           }
           {
            Name: {is: "amount"}
            Value: {BigInteger: {ge: "1000000000"}}
           }
          ]
        }
      }
```

It extends the previous example, selecting only calls that have all 4 conditions:
* the first argument named 'recipient' 
* the first argument  value of type address equal to '0xa7f6ebbd4cdb249a2b999b7543aeb1f80bda7969'
* any argument called "amount"
* argument named "amount" having value bigger than 1000000000



