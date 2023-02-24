---
sidebar_position: 5
---

# Subscription on Aggregated Metrics

It is a subscription to the results of [Query Aggregated Metrics](aggregated_metrics).
Query can be convereted to subscription by replacing ```query``` word with
```subscription```.

With every new block the aggregate will be calculated over the new data 
and **update** to the aggregates will be sent as a result.
Note that in this case you will not get the re-calculation of the whole query,
but the update to the previously calculated aggregate.

This subscription is appropriate when:

1. application is not capable to process raw stream of the data;
2. the new data is used to be displayed or used inside the application in an aggregated form.