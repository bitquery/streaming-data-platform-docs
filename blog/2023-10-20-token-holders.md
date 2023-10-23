---
slug: added-token-holders-api-other-changes
title: Added Token Holders API and Other Changes
authors: [Divyasshree]
tags: [new api]
---

# Changes in APIs and Metrics

In this update we have
- Added a new [Token Holder API](https://docs.bitquery.io/docs/evm/token_holders/) for `archive` dataset
- Added new indexes Gini Coefficient, Nakamoto Index, Theil Index
- Removed `distinctBy` filter to avoid any confusions over its usage.
- Compulsorily require field in `sum` aggregation , for example: `sum(of: Balance_Amount)`
- Added Support for `aggregates` in ` descendingByField`