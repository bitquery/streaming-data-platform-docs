---
sidebar_position: 1
---

# Options

GraphQL interface hides the internal complexity of the datasets, 
integrating different blockchains, real time and archive data and different ways
to query them. 

Top level element of the query (```EVM``` for Ethereum like blockchains) controls
the dataset settings, applied to all the query below.

Top level element of the query has 3 attributes, defining what is the source for the result data:

1. ```network``` - blockchain chain to query
2. ```dataset``` - what type of the database to query
3. ```select_blocks``` - which blocks (branches or trunk only) to include in results


![Dataset options](/img/ide/dataset_options.png)

:::note
[subscription](../subscription/subsciption) has a different set of top level elements. 
For example, the dataset for subscription is always real time and not controlled.
:::