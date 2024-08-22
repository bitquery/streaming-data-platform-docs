# Common Errors and What to Do

This section will guide you through the interpretation of common error messages encountered within Bitquery APIs. It will help you decide when to escalate issues by filing a ticket at [Bitquery Support](https://support.bitquery.io/).

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
- **Escalation:** If the issue persists or requires further assistance, consider filing a detailed ticket on [Bitquery Support](https://support.bitquery.io/) for help and resolution.

---

### Too Many Sessions: 429 Error

#### Error Message:

    "Too Many Sessions: 429"

#### Probable Cause:

This error occurs when you exceed certain limits set by ClickHouse or the Bitquery API. These limits may include:

- **Rate Limit**: The maximum number of queries allowed per minute (e.g., 180 queries per minute).
- **Session Limit**: The maximum number of active sessions allowed at any given time.
- **Streams Limit**: The maximum number of streams you can open simultaneously.

#### Resolution Steps:

If the error persists or you believe it is occurring in error, contact the support team for further assistance.

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

This happens when you hit the number of requests for your plan. Please contact the support team. Contact support via Telegram for assistance.

### Error Status 500

#### Probable Cause:

The error with status 500 is a generic internal server error that could result from various issues within the system.

#### Resolution Steps:

- **Review Query and Syntax:** Double-check the query and its syntax for any errors or discrepancies.
- **Check Server Status:** Verify the [server status](https://account.bitquery.io/user/system_status) to ensure it is operational and not experiencing downtime.
- **Escalation:** Contact support on the [telegram channel](https://t.me/Bloxy_info).

### ActiveRecord::ActiveRecordError: Response code: 500 DB::Exception: Too many simultaneous queries

If you see this text `DB::Exception: Too many simultaneous queries`, this happens when you hit the number of requests for your plan. Please contact the support team.

### DB::Exception : Memory limit (total) exceeded

`"message":"ActiveRecord::ActiveRecordError: Response code: 500:\nCode: 241, e.displayText() = DB::Exception: Memory limit (total) exceeded: would use 78.01 GiB (attempt to allocate chunk of 134658600 bytes), maximum: 78.01 GiB: ...`

This error occurs when a query lacks a limit or requests an excessive number of records. To resolve it, consider adding filters to refine the query parameters. If issue still persists, please contact the support team on telegram with your query.

### Timeout TCP socket

[{"message":"Net::ReadTimeout ...}]

This error occurs when the query is complex and takes too long to respond to a request. Check if you can optimize the query, if not please contact the support team on telegram with your query.

### Error: Failed to fetch ERROR http 424

Please retry the query in a few minutes, this is a temporary issue. If repeats please create a ticket at [support.bitquery.io](https://support.bitquery.io/hc/en-us)

---

### WebSocket Errors: 1009, Message Too Big, PayloadTooBig, etc.

#### Probable Cause:

These errors typically occur due to how the WebSocket client is configured in `websockets.client.connect()`. In Python, the default maximum size for incoming messages is set to `2**20` (1048576 bytes). When this limit is exceeded, errors like `1009`, `message too big`, or `PayloadTooBig` may occur.

#### Resolution Steps:

- **Adjust WebSocket Client Settings:** You can either pass `None` to disable the limit or increase the default value to accommodate larger payloads.

  `websockets.client.WebSocketClientProtocol(_*_, _origin=None_, _extensions=None_, _subprotocols=None_, _extra_headers=None_, _**kwargs_)`

- **Memory Usage Consideration:** Since Python can use up to 4 bytes of memory to represent a single character, each connection may use up to `4 * max_size * max_queue` bytes of memory to store incoming messages. By default, this can amount to 128 MiB. Depending on your application’s requirements, you may want to lower these limits to optimize performance.
  Read more [here](https://websockets.readthedocs.io/en/9.1/api/client.html#using-a-connection_

---

## Limits

### Default Limit

By default, if you do not specify a limit in your query, there is an implicit limit applied. This default limit restricts the number of records returned to 10,000. This is a safeguard to prevent excessive resource usage and to ensure that queries are processed efficiently.

### Setting Custom Limits

To specify a custom limit in your query, you can use the `limit` parameter. This parameter allows you to define the maximum number of records you want to retrieve. When you set a custom limit, the query will return the specified number of records based on your criteria.

### Example Query

Here's an example query demonstrating the use of the `limit` parameter:

```graphql
{
  EVM(network: eth) {
    Blocks(
      limit: { count: 30000 }
      orderBy: { descending: Block_Time }
      where: { Block: { Date: { after: "2023-01-03" } } }
    ) {
      Block {
        Number
        Date
      }
    }
  }
}
```

### Important Notes

- **Resource Consideration**: Be cautious when setting high limits, as large queries might consume significant resources and impact performance.
- **Pagination**: For large datasets, consider implementing pagination with `offset` to retrieve data in smaller chunks for better efficiency. Read more on limits and offsets [here](/docs/graphql/limits)
- **Optimization**: Always aim to optimize your queries to retrieve the necessary data efficiently without exceeding resource limits.
