---
sidebar_position: 9
---

# Uniq Function Overview

The `uniq` function is used to estimate the count of unique values in a dataset. It's particularly useful for analyzing large datasets where an exact count may not be necessary or where performance is a concern. Below is an example query using the `uniq` function within the context of EVM to get the number of unique token holders for a specific token on a given date.

### Example Query

```
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2024-03-04"
      tokenSmartContract: "0x95AD61B0A150D79219DCF64E1E6CC01F0B64C4CE"
      where: {Balance: {Amount: {gt: "0"}}}
    ) {
      exact: uniq(of: Holder_Address, method: exact)
      count(distinct: Holder_Address)
      approximate: uniq(of: Holder_Address, method: approximate)
    }
  }
}


```

### Result

```
{
  "EVM": {
    "TokenHolders": [
      {
        "approximate": "1373089",
        "count": "1378364",
        "exact": "1378364"
      }
    ]
  }
}

```

### Understanding Uniq Function Variants

- **Estimate (`uniq`)**: The `uniq` function estimates the count of unique values. It uses an adaptive sampling algorithm. This approach is highly accurate and CPU-efficient for processing large datasets.
- **Exact Count (`uniqExact`)**: For scenarios requiring precision, the `uniqExact` function calculates the exact number of unique values. Although more memory-intensive it guarantees accuracy.

### When to Use Each Variant

- **Use `uniq` for Estimates**: Opt for the `uniq` function when an approximate count suffices. This function is ideal for large datasets where performance and efficiency are priorities.
- **Use `uniqExact` for Precision**: Choose the `uniqExact` function when accuracy is non-negotiable. Keep in mind the potential for increased memory usage.
