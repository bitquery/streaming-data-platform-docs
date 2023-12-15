
# Errors

## Interpreting Errors

This section will guide you through the interpretation of common error messages encountered within Bitquery APIs.  It will help you decide when to escalate issues by filing a ticket at [Bitquery Support](https://support.bitquery.io/).

### ClickHouse Error: 400 Bad Request

#### Error Message:

```plaintext
clickhouse return status 400 [400 Bad request] response <html><body><h1>400 Bad request</h1>\nYour browser sent an invalid request.\n</body></html>\n"
```

#### Probable Cause:

This error typically arises due to incorrect query construction involving limits, sorting, or filtering parameters.

#### Resolution Steps:

- **Review Query Parameters:** Ensure that the query adheres to the specified limits, sorting criteria, and filters as required in a standard [query](/docs/start/first-query.md).
- **Validate Syntax:** Double-check the syntax of the query to identify any mistakes or discrepancies.
- **Consult Documentation:** Refer to Bitquery documentation for similar examples.
- **Escalation:** If the issue persists or requires further assistance, consider filing a detailed ticket on [Bitquery Support](https://support.bitquery.io/) for specialized help and resolution.

---


### Empty Response Returned

If no trades/transfers are found for the queried period, compare with public explorers. If issues persist, contact support through the public Telegram group.

### Error in Name, Error in Symbol on Explorer

![symbol](/img/ide/symbol_error.png)

This is an issue with indexing the token, please create a ticket at [support.bitquery.io](https://support.bitquery.io/hc/en-us)


### ActiveRecordError : Memory Exceeded

#### Error Message:

    "message": "ActiveRecord::ActiveRecordError: Response code: 500:\nCode: 241, e.displayText() = DB::Exception: Received from ..... DB::Exception: Memory limit (for query) exceeded: would use 29.87 GiB (attempt to allocate chunk of 134740784 bytes), maximum: 29.80 GiB: ....

#### Resolution Steps:

This error occurs due to excessive data retrieved in a single query. Limit results using 'limit' option or narrow the query range using 'since' and 'till' on `time` field. Read more on limits [here](/docs/graphql/limits) and on filters [here](/docs/graphql/filters).

### Too many simultaneous queries

This is likely an infrastructure issue. Contact support via Telegram for assistance.


---
