---
slug: schema-changes
title: Schema changed for Transaction_Time mempool and default settings to query blocks and trigger_on
authors: [astudnev]
tags: [new capability]
---

# Changes in API Schema

The following changes applied to the schema:

1. ```trigger_on``` attribute for subscription default value set now to ```all```.
2```Transaction_Time``` field for mempool ```Transaction``` now returns the transaction time not in numeric, but in ISO8601 format up to 1 nanaosecond ( 9 digits after the seconds ), 

```"2006-01-02T15:04:05.999999999Z"```