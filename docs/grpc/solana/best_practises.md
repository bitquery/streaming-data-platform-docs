# Best Practices for Solana gRPC Streams

This guide covers essential best practices for building applications with Bitquery's Solana gRPC streams.

## Filter Configuration

Use specific filters that cover your usecase to reduce amount of data consumed. There is no limit on the number of filters you can use.

```yaml
# config.yaml
server:
  address: "corecast.bitquery.io"
  authorization: "<your_api_token>"
  insecure: false

stream:
  type: "dex_trades"

filters:
  # Filter by specific programs
  programs:
    - "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" # Raydium

  # Filter by specific tokens
  tokens:
    - "So11111111111111111111111111111111111111112" # WSOL

  # Filter by minimum trade amount
  min_amount: 1000000 # 1 USDC (6 decimals)
```

## Connection Management

### Automatic Reconnection

Always implement automatic reconnection with exponential backoff to handle network interruptions:

```javascript
let currentStream = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 60000; // 60 seconds

function calculateReconnectDelay(attempt) {
  const delay = Math.min(
    INITIAL_RECONNECT_DELAY * Math.pow(2, attempt),
    MAX_RECONNECT_DELAY
  );
  return delay + Math.random() * 1000; // Add jitter
}

function attemptReconnection() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("Max reconnection attempts reached");
    return;
  }

  reconnectAttempts++;
  const delay = calculateReconnectDelay(reconnectAttempts - 1);

  setTimeout(() => {
    console.log(`Reconnecting... (attempt ${reconnectAttempts})`);
    listenToStream();
  }, delay);
}
```

### Error Handling

Handle different types of gRPC errors appropriately:

```javascript
currentStream.on("error", (error) => {
  console.error("Stream error:", error);

  // Handle connection drops (code 14)
  if (error.code === 14 || error.details === "Connection dropped") {
    console.log("Connection dropped, attempting to reconnect...");
    attemptReconnection();
  } else {
    console.error("Non-recoverable error:", error);
    process.exit(1);
  }
});

currentStream.on("end", () => {
  console.log("Stream ended");
  if (!isReconnecting) {
    attemptReconnection();
  }
});
```

## Performance Optimization

### Efficient Message Processing

Process messages efficiently to avoid blocking the event loop:

```javascript
let messageCount = 0;
const BATCH_SIZE = 100;
let messageBatch = [];

currentStream.on("data", (message) => {
  messageBatch.push(message);
  messageCount++;

  // Process in batches to avoid blocking
  if (messageBatch.length >= BATCH_SIZE) {
    processBatch(messageBatch);
    messageBatch = [];
  }
});

function processBatch(batch) {
  // Process messages asynchronously
  setImmediate(() => {
    batch.forEach((message) => {
      if (message.Trade) {
        handleTrade(message.Trade);
      } else if (message.Transaction) {
        handleTransaction(message.Transaction);
      }
      // Handle other message types...
    });
  });
}
```

### Memory Management

Implement proper cleanup to prevent memory leaks:

```javascript
function cleanupStream() {
  if (currentStream) {
    try {
      currentStream.cancel();
    } catch (error) {
      // Stream might already be closed
    }
    currentStream = null;
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  cleanupStream();
  process.exit(0);
});
```

## Client Configuration

Use appropriate gRPC client options for production:

```javascript
const client = new solanaCorecast.CoreCast(
  config.server.address,
  grpc.credentials.createSsl(),
  {
    // Keep-alive settings
    "grpc.keepalive_time_ms": 30000,
    "grpc.keepalive_timeout_ms": 5000,
    "grpc.keepalive_permit_without_calls": true,

    // Message size limits
    "grpc.max_receive_message_length": 4 * 1024 * 1024, // 4MB
    "grpc.max_send_message_length": 4 * 1024 * 1024, // 4MB

    // Connection management
    "grpc.enable_retries": 1,
    "grpc.max_connection_idle_ms": 30000,
  }
);
```

## Monitoring and Logging

### Performance Monitoring

Track key metrics for monitoring:

```javascript
let stats = {
  messagesProcessed: 0,
  errors: 0,
  lastMessageTime: null,
  startTime: Date.now(),
};

function logStats() {
  const uptime = Date.now() - stats.startTime;
  const rate = stats.messagesProcessed / (uptime / 1000);

  console.log(
    `Stats: ${stats.messagesProcessed} messages, ${rate.toFixed(2)} msg/sec`
  );
}

// Log stats every 30 seconds
setInterval(logStats, 30000);
```

### Error Tracking

Implement comprehensive error tracking:

```javascript
function trackError(error, context) {
  console.error(`Error in ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
  });

  stats.errors++;
}
```

### Health Checks

Implement health checks for monitoring:

```javascript
function healthCheck() {
  return {
    status: currentStream ? "connected" : "disconnected",
    reconnectAttempts: reconnectAttempts,
    messagesProcessed: stats.messagesProcessed,
    uptime: Date.now() - stats.startTime,
  };
}
```

## Common Pitfalls

1. **Not handling connection drops**: Always implement reconnection logic
2. **Blocking the event loop**: Process messages asynchronously
3. **Memory leaks**: Clean up streams and timers properly
4. **Missing error handling**: Handle all gRPC error codes
5. **Inefficient filtering**: Use server-side filters to reduce bandwidth
6. **No monitoring**: Track key metrics for production deployments
