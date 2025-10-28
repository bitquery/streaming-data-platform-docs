# Live Reload Configuration for gRPC Streams

Live reload enables dynamic configuration changes without you having to restart your application. This feature automatically detects changes to your `config.yaml` file and restarts the stream with the new settings.

## Why Live Reload?

Live reload is essential for:

- **Testing different filters**: Quickly test various filter combinations without stopping and restarting your application
- **Switching stream types**: Change between dex_trades, transactions, balances, and other stream types on the fly
- **Dynamic monitoring**: Adjust which programs, pools, or traders to monitor in real-time
- **Production updates**: Update filters in production without downtime
- **Development efficiency**: Iterate faster during development and debugging

## How It Works

The live reload system monitors your `config.yaml` file for changes using Node.js's `fs.watch()` API. When a change is detected:

1. The configuration file is reloaded
2. The current stream connection is gracefully stopped
3. If server settings changed, the gRPC client is reinitialized
4. A new stream is started with the updated configuration
5. All of this happens automatically without manual intervention

## Setup

### Prerequisites

Install the required dependencies:

```bash
npm install @grpc/grpc-js @grpc/proto-loader js-yaml bs58
```

Or using package.json:

```json
{
  "dependencies": {
    "@grpc/grpc-js": "^1.9.0",
    "@grpc/proto-loader": "^0.7.10",
    "js-yaml": "^4.1.0",
    "bs58": "^5.0.0"
  }
}
```

### Configuration File

Create a `config.yaml` file with your stream settings:

```yaml
server:
  address: "corecast.bitquery.io"
  authorization: "ory_YOUR_API_TOKEN_HERE"
  insecure: false

stream:
  type: "dex_trades"

filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" # Pump.fun
```

**Get your API token**: Generate one at [https://account.bitquery.io/user/api_v2/access_tokens](https://account.bitquery.io/user/api_v2/access_tokens)

## Implementation

### Basic Live Reload Setup

Here's the core implementation for live reload functionality:

```javascript
const fs = require('fs');
const yaml = require('js-yaml');

let config = null;
let currentStream = null;
let isReloading = false;

// Load configuration from file
function loadConfig() {
  try {
    const newConfig = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
    console.log('Configuration loaded successfully');
    return newConfig;
  } catch (error) {
    console.error('✗ Failed to load configuration:', error.message);
    return null;
  }
}

// Watch config file for changes
let watchTimeout = null;
fs.watch('./config.yaml', (eventType, filename) => {
  if (eventType === 'change') {
    // Debounce multiple rapid file changes
    if (watchTimeout) {
      clearTimeout(watchTimeout);
    }
    watchTimeout = setTimeout(() => {
      reloadAndRestart();
      watchTimeout = null;
    }, 300); // Wait 300ms after last change
  }
});

console.log(' Watching config.yaml for changes...');
```

### Complete Live Reload Function

The reload function handles the full lifecycle of stopping the old stream and starting a new one:

```javascript
// Check if server configuration changed
function hasServerConfigChanged(oldConfig, newConfig) {
  return oldConfig.server.address !== newConfig.server.address ||
         oldConfig.server.authorization !== newConfig.server.authorization ||
         oldConfig.server.insecure !== newConfig.server.insecure;
}

// Reload configuration and restart stream
function reloadAndRestart() {
  if (isReloading) {
    return; // Prevent concurrent reloads
  }
  
  isReloading = true;
  console.log('\n Configuration changed, reloading...');
  
  // Load new configuration
  const newConfig = loadConfig();
  if (!newConfig) {
    console.error('Failed to reload configuration, keeping current settings');
    isReloading = false;
    return;
  }
  
  // Check if we need to reinitialize the client
  const needsNewClient = hasServerConfigChanged(config, newConfig);
  
  // Stop current stream
  stopStream();
  
  // Update configuration
  config = newConfig;
  
  // Reinitialize client if server settings changed
  if (needsNewClient) {
    console.log('Server configuration changed, reinitializing client...');
    try {
      initializeClient();
    } catch (error) {
      console.error('Failed to initialize client:', error.message);
      isReloading = false;
      return;
    }
  }
  
  // Start new stream
  try {
    startStream();
    isReloading = false;
  } catch (error) {
    console.error(' Failed to start stream:', error.message);
    isReloading = false;
  }
}

// Stop current stream
function stopStream() {
  if (currentStream) {
    try {
      currentStream.cancel();
      console.log('Stream stopped');
    } catch (error) {
      console.error('Error stopping stream:', error.message);
    }
    currentStream = null;
  }
}
```

### Graceful Shutdown

Handle process termination properly:

```javascript
// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  stopStream();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  stopStream();
  process.exit(0);
});
```

## Usage Examples

### Example 1: Switching Between Stream Types

Start with DEX trades:

```yaml
stream:
  type: "dex_trades"

filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
```

Then modify the config to switch to transactions:

```yaml
stream:
  type: "transactions"

filters:
  signers:
    - "E6SykRdyqq24QJYcZ1kEbYoNtC3jYojE6fSvwBUqxAts"
```

The stream will automatically restart with the new configuration.

### Example 2: Adding Multiple Program Filters

Start monitoring one program:

```yaml
filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" # Pump.fun
```

Add more programs without restarting:

```yaml
filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" # Pump.fun
    - "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK" # Raydium CLMM
    - "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" # Raydium V4
```

### Example 3: Switching Filter Types

Monitor by program:

```yaml
filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
```

Switch to monitoring specific pools:

```yaml
filters:
  pool:
    - "5tUu7bX8d8Zz1v3v4Y9H9F6J7K8L9M0N1O2P3Q4R5S6T"
    - "7GJz9X7b1G9Nf1d5uQq2Z3B4nPq6F8d9LmNoPQrsTUV"
```

Or monitor specific traders:

```yaml
filters:
  traders:
    - "7GJz9X7b1G9Nf1d5uQq2Z3B4nPq6F8d9LmNoPQrsTUV"
```

### Example 4: Testing Multiple Configurations

You can quickly test different configurations by editing the YAML file:

```yaml
# Test 1: Monitor Pump.fun trades
stream:
  type: "dex_trades"
filters:
  programs:
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"

# Test 2: Monitor specific wallet transactions
# stream:
#   type: "transactions"
# filters:
#   signers:
#     - "E6SykRdyqq24QJYcZ1kEbYoNtC3jYojE6fSvwBUqxAts"

# Test 3: Monitor token transfers
# stream:
#   type: "transfers"
# filters:
#   tokens:
#     - "So11111111111111111111111111111111111111112" # WSOL
```

Simply uncomment the configuration you want to test, and the stream will reload automatically.

## Available Stream Types

You can switch between these stream types using live reload:

- **`dex_trades`**: Real-time DEX trade/swap data
- **`dex_orders`**: Order lifecycle updates
- **`dex_pools`**: Pool creation and liquidity changes
- **`transactions`**: Finalized transactions with instructions
- **`transfers`**: Token transfer events
- **`balances`**: Balance updates for accounts

For detailed information on each stream type, see:
- [DEX Trades](https://docs.bitquery.io/docs/grpc/solana/topics/dextrades)
- [Transactions](https://docs.bitquery.io/docs/grpc/solana/topics/transactions)
- [Balances](https://docs.bitquery.io/docs/grpc/solana/topics/balance)

## Available Filters

Different stream types support different filters:

### DEX Trades Filters
```yaml
filters:
  programs:      # DEX program addresses
    - "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
  pool:          # Market/pool addresses
    - "5tUu7bX8d8Zz1v3v4Y9H9F6J7K8L9M0N1O2P3Q4R5S6T"
  traders:       # Trader wallet addresses
    - "7GJz9X7b1G9Nf1d5uQq2Z3B4nPq6F8d9LmNoPQrsTUV"
```

### Transaction Filters
```yaml
filters:
  signers:       # Transaction signers
    - "E6SykRdyqq24QJYcZ1kEbYoNtC3jYojE6fSvwBUqxAts"
```

### Transfer Filters
```yaml
filters:
  tokens:        # Token mint addresses
    - "So11111111111111111111111111111111111111112" # WSOL
  signers:       # Transaction signers
    - "E6SykRdyqq24QJYcZ1kEbYoNtC3jYojE6fSvwBUqxAts"
```

## Debouncing

The live reload implementation includes a 300ms debounce to handle multiple rapid file changes. This prevents unnecessary restarts when your editor makes multiple writes while saving a file.

```javascript
// Debounce multiple rapid file changes
if (watchTimeout) {
  clearTimeout(watchTimeout);
}
watchTimeout = setTimeout(() => {
  reloadAndRestart();
  watchTimeout = null;
}, 300); // Wait 300ms after last change
```

You can adjust this delay based on your needs:
- **Shorter delay (100-200ms)**: Faster reloads, but might trigger multiple times
- **Longer delay (500-1000ms)**: More stable, but slower to reflect changes

## Error Handling

The live reload system includes comprehensive error handling:

### Configuration Errors

If the new configuration is invalid, the system keeps the current working configuration:

```
 Failed to reload configuration, keeping current settings
```

### Stream Errors

Stream errors during reload are logged but don't crash the application:

```javascript
stream.on('error', (error) => {
  if (!isReloading) {
    console.error('Stream error:', error);
  }
});
```

The `isReloading` flag prevents error spam during normal reload operations.

## Best Practices

1. **Test changes locally first**: Validate your configuration changes work before deploying to production
2. **Use version control**: Keep your config.yaml in version control to track changes
3. **Comment your filters**: Add comments to document what each filter monitors
4. **Monitor reload events**: Log when reloads happen to track configuration changes
5. **Handle edge cases**: Ensure your application handles the brief disconnection during reload


### Environment Variables

For sensitive data like API tokens, use environment variables:

```javascript
function loadConfig() {
  const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
  
  // Override with environment variables
  if (process.env.BITQUERY_TOKEN) {
    config.server.authorization = process.env.BITQUERY_TOKEN;
  }
  
  return config;
}
```

## Logging Output

When live reload is active, you'll see these messages:

```
 Watching config.yaml for changes...
 Configuration loaded successfully
 Stream connected and listening for data...

 Configuration changed, reloading...
 Stream stopped
 Configuration loaded successfully
 Stream connected and listening for data...
```


## Related Documentation

- [Introduction to gRPC Streams](https://docs.bitquery.io/docs/grpc/solana/introduction)
- [Best Practices](https://docs.bitquery.io/docs/grpc/solana/best_practices)
- [Authorization](https://docs.bitquery.io/docs/grpc/solana/authorisation)
- [Error Handling](https://docs.bitquery.io/docs/grpc/solana/errors)

## Troubleshooting

### Stream Not Reloading

If changes aren't being detected:

1. Check file permissions on `config.yaml`
2. Ensure the file is being saved properly by your editor
3. Look for configuration syntax errors in the console
4. Verify the debounce timeout hasn't been set too high

### Frequent Disconnections

If the stream disconnects frequently during reloads:

1. Check your network connection stability
2. Verify your API token is valid
3. Ensure you're not hitting rate limits
4. Review your filter configuration for errors

### Memory Issues

If you experience memory issues with live reload:

1. Ensure streams are properly cancelled before creating new ones
2. Clear any message buffers during reload
3. Monitor for event listener leaks
4. Use the provided cleanup functions

## Next Steps

Now that you understand live reload, explore:

- [Stream Topics](https://docs.bitquery.io/docs/grpc/solana/topics/dextrades) - Different types of streams available
- [Best Practices](https://docs.bitquery.io/docs/grpc/solana/best_practices) - Production-ready patterns
- [Examples](https://docs.bitquery.io/docs/grpc/solana/examples/pump-fun-grpc-streams) - Real-world use cases

