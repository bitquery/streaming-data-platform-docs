# Authentication

To access Bitquery’s Solana gRPC streams (CoreCast), you must authenticate every stream using an **[authorization token](https://account.bitquery.io/user/api_v2/access_tokens)**. This token is provided in your configuration file and automatically added to the gRPC metadata before starting a stream. Check the [documentation](https://docs.bitquery.io/docs/authorisation/how-to-generate/) to create a new token.

## Configuration

The token is defined under the server in the `config.yaml` file:

```yaml
server:
  address: "corecast.bitquery.io"
  authorization: "<YOUR_TOKEN>"
  insecure: false
```

* **address** → gRPC server host address, which is `corecast.bitquery.io`.
* **authorization** → your API token (string that usually starts with `ory_at_...`). 
* **insecure** → set `true` 

## How it works

At runtime, the token from `config.server.authorization` is injected into gRPC metadata:

```js
const metadata = new grpc.Metadata();
metadata.add('authorization', config.server.authorization);

// Example stream
const stream = client.DexTrades(request, metadata);
```

This adds an `authorization` header to the gRPC call. No other headers or credentials are required.

## Security

* Always keep your token secret — do not hardcode it in your codebase.
* Store it in `config.yaml`, an environment variable, or a secret manager.
* If `insecure: true`, traffic will not be encrypted. Prefer TLS (`insecure: false`).

## Common Issues

When authentication fails, you’ll see gRPC error **code `16`** with HTTP status **`401 Unauthorized`**:

```json
{
  "code": 16,
  "details": "Received HTTP status code 401"
}
```

### Causes

* **Incorrect token** → Typo in `config.yaml` or copied wrong value.
* **Missing token** → No `authorization` field in `config.yaml`.
* **Expired token** → Token is no longer valid.

### Debugging Methods

1. **Verify token in `config.yaml`**
   Ensure it looks like:

   ```yaml
   server:
     authorization: "ory_at_xxx..."
   ```

   and not empty.

2. **Check for quotes/whitespace**
   Tokens should be a single continuous string. No extra spaces or line breaks.

3. **Confirm token is active**
   If the token expired or was revoked, generate a new one from your Bitquery account.
