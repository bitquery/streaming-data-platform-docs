---
sidebar_position: 6
---

# Array Intersection

In this section we will see how to use the `array_intersect` to get relationship between two addresses or two contracts.

### Syntax

```
array_intersect(side1: side1, side2: side2, intersectWith: array)
```

where

- `side1`: The first array that you want to compare.
- `side2`: The second array that you want to compare.
- `intersectWith`: The array containing elements to be used for intersection with the first two arrays.

Constraints:

- Applicable only to fields with a string data type.
- The function can retrieve only addresses when returning the response; other response fields are not supported in the output.

### Example

Suppose you have an array of two addresses ( A and B ) and want to identify which addresses have engaged in transactions with both Contract A and Contract B. By passing these arrays to array_intersect, the function will return an array of addresses that interacted with both contracts.

```
query($addresses: [String!]) {
  EVM(dataset: archive){
    Transfers(
      where: {
        any: [
          {
        	  Transfer: {Sender: {in: $addresses} Receiver: {notIn: $addresses}}

          },
          {
            Transfer: {Receiver: {in: $addresses} Sender: {notIn: $addresses}}
          },
        ]
      }

    ) {

      array_intersect(
        side1: Transfer_Sender
        side2: Transfer_Receiver
        intersectWith: $addresses
      )

    }
  }
}
<!-- Parameters -->
{
  "addresses": ["0x21743a2efb926033f8c6e0c3554b13a0c669f63f","0x107f308d85d5481f5b729cfb1710532500e40217"]
}

```
