
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