# Error Handling

When working with gRPC streams for Solana CoreCast, you may encounter errors. This page documents common error types, their causes, and how to debug them.

## Unauthorized

**Code:** `16 (UNAUTHENTICATED)`
**HTTP Status:** `401 Unauthorized`

### Causes

* Access token is **missing** from `config.yaml`.
* Access token is **incorrect** (typo, bad copy-paste).
* Access token is **expired** or revoked.

### Example Output

```json
{
  "code": 16,
  "details": "Received HTTP status code 401"
}
```

### How to Fix

* Ensure `config.yaml` includes a valid token:

  ```yaml
  server:
    address: "corecast.bitquery.io"
    authorization: "ory_at_<YOUR_TOKEN>"
    insecure: false
  ```
* Check for trailing spaces or missing quotes.
* [Generate](https://docs.bitquery.io/docs/authorisation/how-to-generate/) a new token if expired.

---

## Unsupported Stream Type

**Details:** Error message will mention unsupported stream type.

### Cause

The `config.stream.type` in `config.yaml` refers to a stream that isn’t available with Bitquery gRPC streams.

### Example Config

```yaml
stream:
  type: "dex_trades"   # ✅ supported
```

### Supported Stream Types

* [`dex_trades`](https://docs.bitquery.io/docs/grpc/solana/topics/dextrades/)
* [`transactions`](https://docs.bitquery.io/docs/grpc/solana/topics/transactions/)
* [`balances`](https://docs.bitquery.io/docs/grpc/solana/topics/balance/)

### How to Fix

* Double-check spelling of the stream type.
* Only use supported values listed above.
* Update your config if the API evolves.

## Runtime Errors

Runtime errors can occur for many reasons, including:

* Network connectivity issues.
* Server-side failures (temporary outage, overload).
* Incorrect filters in your request object.
* Message parsing or serialization errors.

### Debugging Method

To properly investigate runtime errors, add an error handler to your stream:

```js
stream.on('error', (error) => {
  flushLogs();
  console.error('Stream error:', error);
  console.error('Error details:', error.details);
  console.error('Error code:', error.code);
  console.error('Request sent:', JSON.stringify(request, null, 2));
});
```

This will log the full error object, its details, the numeric error code, and the request you sent. With this context, you can narrow down whether the issue is related to authentication, filters, or transient server/network conditions.

## Best Practices

* Always log `error.code` and `error.details`.
* Use retries with exponential backoff for network issues.
* Validate stream type and filters before starting.
* Rotate tokens regularly and handle token expiry gracefully.