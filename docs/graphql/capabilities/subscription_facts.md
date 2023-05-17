---
sidebar_position: 4
---

# Subscription on Facts

It is a subscription to the results of [Query Fact Records](/docs/graphql/capabilities/query_fact_records).
Query can be converted to subscription by replacing ```query``` word with
```subscription```.

Every new block on the blockchain will send the data to this
subscription if it contains the data for the query. It can be one or more records.
If the block does not contain data that you query, it will not trigger the results.

This subscription is appropriate when:

1. application is capable to process raw stream of the data;
2. minimum delay required between the data in the blockchain and the application;
3. notification is required on trigger, defined on some specific conditions.