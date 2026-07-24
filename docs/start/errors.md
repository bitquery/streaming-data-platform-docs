---
title: "Bitquery API Common Errors"
description: "Bitquery API Common Errors: practical Bitquery setup guidance with examples for authentication, endpoints, and first queries."
---
# Common Errors and What to Do

This section will guide you through the interpretation of common error messages encountered within Bitquery APIs. It will help you decide when to escalate issues by filing a ticket at [Bitquery Support](https://support.bitquery.io/).

## Why am I getting a 403 Forbidden error when making a GraphQL request in Python? {#why-am-i-getting-a-403-forbidden-error-when-making-a-graphql-request-in-python}

For **API v2**, Bitquery expects a valid **OAuth token** on the right host: send `Authorization: Bearer <token>` to **`https://streaming.bitquery.io/graphql`** (see [how to use a token](/docs/authorization/how-to-use/)). A **403** often means the gateway rejected the request—wrong URL, missing/expired token, or headers not passed exactly as in the Python example. For **legacy v1** (`graphql.bitquery.io`), check **IP allowlists and referrers** in your [account dashboard](/docs/ide/account/). If it still fails, open a ticket with the response body and request URL (redact secrets).

### ClickHouse Error: 400 Bad Request

#### Error Message:

```plaintext
clickhouse return status 400 [400 Bad request] response <html><body><h1>400 Bad request</h1>\nYour browser sent an invalid request.\n</body></html>\n"
```

#### Probable Cause:

This error typically arises due to incorrect query construction involving limits, sorting, or filtering parameters.

#### Resolution Steps:

- **Review Query Parameters:** Ensure that the query adheres to the specified limits, sorting criteria, and filters as required in a standard [query](/docs/start/first-query/).
- **Validate Syntax:** Double-check the syntax of the query to identify any mistakes or discrepancies.
- **Consult Documentation:** Refer to Bitquery documentation for similar examples.
- **Escalation:** If the issue persists or requires further assistance, consider filing a detailed ticket on [Bitquery Support](https://support.bitquery.io/) for help and resolution.

---

### Too Many Sessions: 429 Error

#### Error Message:

    "Too Many Sessions: 429"

#### Probable Cause:

This error occurs when you exceed certain limits set by ClickHouse or the Bitquery API. These limits may include:

- **Rate Limit**: The maximum number of queries allowed per minute (the exact value depends on your plan — see [Rate Limits & Concurrency](/docs/plans/rate-limits/)).
- **Session Limit**: The maximum number of active sessions allowed at any given time.
- **Streams Limit**: The maximum number of streams you can open simultaneously.

#### Resolution Steps:

If the error persists or you believe it is occurring in error, contact the support team for further assistance.

---

### Empty Response Returned {#empty-response-returned}

If no trades/transfers are found for the queried period, compare with public explorers. Verify **network**, **dataset** (`realtime` vs `combined` / `archive`), **time filters**, and **contract or mint addresses**. If issues persist, contact support through the public Telegram group.

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
- **Check Server Status:** Verify the [server status](https://app-status.bitquery.io/) to ensure it is operational and not experiencing downtime.
- **Escalation:** Contact support on the [telegram channel](https://t.me/Bloxy_info).

### ActiveRecord::ActiveRecordError: Response code: 500 DB::Exception: Too many simultaneous queries

If you see this text `DB::Exception: Too many simultaneous queries`, this happens when you hit the number of requests for your plan. Please contact the support team.

### DB::Exception : Memory limit (total) exceeded

`"message":"ActiveRecord::ActiveRecordError: Response code: 500:\nCode: 241, e.displayText() = DB::Exception: Memory limit (total) exceeded: would use 78.01 GiB (attempt to allocate chunk of 134658600 bytes), maximum: 78.01 GiB: ...`

This error occurs when a query lacks a limit or requests an excessive number of records. To resolve it, consider adding filters to refine the query parameters. If issue still persists, please contact the support team on telegram with your query.

### Timeout TCP socket {#timeout-tcp-socket}

\[\{"message":"Net::ReadTimeout ..."\}\]

This error occurs when the query is complex and takes too long to respond to a request. Check if you can optimize the query, if not please contact the support team on telegram with your query.

**Points:** If your client times out, Bitquery may still have **started work** on the server; see [Why does a Net::ReadTimeout error consume my API credits?](/docs/ide/points/#why-does-net-readtimeout-consume-api-credits) on the Points page.

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

## Billing, quota & access errors

These are the most common runtime errors and their fixes. Each heading is the literal error string so you can search for it.

### `No active billing period` (HTTP 402) {#no-active-billing-period}

A `402` with **`No active billing period`** (or `access restricted by points limit`) means the account has no active plan/points for this request. Common causes:

- Your trial expired, or a free tier hasn't been activated.
- A payment is still provisioning (there can be a short delay after paying).
- You're calling a **paid-only interface** (for example gRPC/Kafka) your plan doesn't include.

**Fix:** confirm an active plan at [Account → Billing](https://account.bitquery.io/user/upgrade); see [How Billing Works](/docs/plans/how-billing-works/). If you just paid, wait a few minutes and retry.

### `points limit exceeded: usage quota reached` {#points-limit-exceeded}

You've consumed your point allowance for the period, **or** you're using a token minted under a previous (smaller) plan.

**Fix:** top up / upgrade at [Account → Billing](https://account.bitquery.io/user/upgrade). **If you just upgraded and still see this, generate a new access token** — a token created under the old plan can keep enforcing the old limit. See [How Billing Works](/docs/plans/how-billing-works/).

### `too many concurrent subscriptions` / `exceeded the maximum number of subscriptions per user id` {#too-many-concurrent-subscriptions}

You've hit your plan's concurrent-subscription cap. Two gotchas:

- Over the cap, a subscription may **connect but deliver no data** instead of erroring clearly.
- **Revoking a token does not stop already-open sockets.**

**Fix:** view and terminate running subscriptions at [Account → Subscriptions](https://account.bitquery.io/user/api_v2/subscriptions). See [WebSocket subscriptions](/docs/subscriptions/websockets/) and [Rate Limits & Concurrency](/docs/plans/rate-limits/).

### `no table can query <Cube> ... consider use realtime dataset` / `Missing columns` {#dataset-not-available}

The cube isn't deployed on the **dataset** you selected for that **chain** (for example, `combined` Holders on a chain that only has `realtime` Holders), or a column doesn't exist on that chain.

**Fix:** switch dataset (often to `realtime`), or choose a chain/cube combination that exists. See the [Data Coverage & Retention matrix](/docs/graphql/data-coverage-retention/).

### `Table <name> doesn't exist` (v1) {#v1-table-does-not-exist}

A v1 query is hitting a table retired during the v1 → v2 migration. Move the query to the v2 endpoint and schema — see [Getting started](/docs/start/first-query/).

### gRPC `16 UNAUTHENTICATED` vs `7 PERMISSION_DENIED` {#grpc-auth-errors}

- **`16 UNAUTHENTICATED`** — the credential is missing, malformed, or expired. Regenerate and re-send it.
- **`7 PERMISSION_DENIED`** — the credential is valid but not entitled (wrong plan, rate-limited, or no active billing period).

See [Solana gRPC](/docs/grpc/solana/introduction/).

### Kafka authentication / connection failures {#kafka-auth-errors}

If your Kafka client can't authenticate or reach the brokers, check the connection recipe: port 9092, `SASL_PLAINTEXT` with your Kafka username/password (SASL/PLAIN), and no client TLS certs. See the [Kafka Operations Cookbook](/docs/streams/kafka-operations/).

### Empty results despite data existing — full checklist {#empty-results-checklist}

1. **Dataset/retention** — is the date range within the window for that cube? See the [coverage matrix](/docs/graphql/data-coverage-retention/).
2. **EVM address case** — filters with `is:` are case-sensitive; lowercase the address or use `caseInsensitive`.
3. **Ordering pitfall** — ordering by a non-indexed timestamp field can silently drop rows; order by `Block_Time` instead.
4. **Filters** — verify network, DEX/program, and token/mint address against an explorer.

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

## Why am I getting a 500 error — query is taking too long? {#why-am-i-getting-a-500-error-query-is-taking-too-long}

A **500** from Bitquery is often tied to **query cost**: the engine may hit **memory limits**, **timeouts**, or **too many simultaneous queries** for your plan. Narrow **time range**, add **`limit`**, filter on **indexed fields**, and avoid huge scans—see [limits](/docs/graphql/limits/), [filters](/docs/graphql/filters/), and [indexed fields](/docs/graphql/indexed-fields-reference/). Check [Bitquery status](https://app-status.bitquery.io/). If the query is minimal and 500s persist, contact [support](https://support.bitquery.io/) or [Telegram](https://t.me/Bloxy_info) with the operation text.

## Why does my DEX trade query return zero results even though trades happened today? {#why-does-my-dex-trade-query-return-zero-results-even-though-trades-happened-today}

**Dataset and time window** are the usual cause: **`dataset: realtime`** only covers a **rolling recent window** (hours—not full history), while **`combined`** / **`archive`** backfill older blocks. Wrong **DEX/program filter**, **pair or token address**, or **network** also returns empty rows. Confirm the same trade in an explorer, then align **`Block.Time`** / **`since`** with the dataset you chose. Solana-specific field gaps on **`combined`** are covered [here](/docs/graphql/dataset/combined#why-does-dataset-combined-return-fewer-fields-than-dataset-realtime-on-solana). See also [Empty Response Returned](#empty-response-returned) below.

## Why does the ISO8601DateTime vs ISO8601Date type mismatch error occur? {#why-does-the-iso8601datetime-vs-iso8601date-type-mismatch-error-occur}

GraphQL is strict about **variable types**. If a filter expects a **date only**, declare the variable as **`ISO8601Date`** and pass values like **`2024-01-15`**. If it expects a **full timestamp**, use **`ISO8601DateTime`** and pass **`2024-01-15T12:00:00Z`**. Mismatch triggers a schema validation error before the query runs. Match each argument to the type shown in the IDE schema for that field, and keep **time zones** explicit (`Z` or offset).
