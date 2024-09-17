---
sidebar_position: 3
---

# Go Example to Use Kafka Streams for Real-time Data

## Overview

This guide walks through the implementation of a Kafka consumer in Go to subscribe to a Kafka topic and process [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time. The consumer connects to the Kafka brokers securely using SSL and handles incoming messages in JSON format.

The complete code is available [here](https://github.com/bitquery/kafka-consumer-example).

### Prerequisites

Ensure you have the following components set up before running the Go Kafka consumer:

1. **Kafka Cluster**: Access to Bitquery Kafka brokers.
2. **Username and Password**: For authentication with the Kafka brokers.
3. **Topic name(s)** to subscribe to.
4. **Go**: Version >= 1.16.
5. **Confluent Kafka Go Client**: Kafka client library for Go.

### Dependencies

Before running the script, ensure you have the necessary Go dependencies installed. Initialize your Go project and install the Kafka client library.

1. Initialize your Go module:

```bash
go mod init kafka-consumer
```

This creates a `go.mod` file for your project, enabling dependency management.

2. Install the **confluent-kafka-go** library:

```bash
go get github.com/confluentinc/confluent-kafka-go/kafka
```

This library provides the necessary Kafka client functions to connect and consume messages.

### Kafka Client Initialization

The Kafka client is initialized with SSL and SASL configurations to securely communicate with the Kafka brokers.

```go
config := &kafka.ConfigMap{
    "bootstrap.servers":                     "rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093",
    "group.id":                              "trontest2-group-99",
    "session.timeout.ms":                    30000,
    "security.protocol":                     "SASL_SSL",
    "ssl.ca.location":                       "server.cer.pem",
    "ssl.key.location":                      "client.key.pem",
    "ssl.certificate.location":              "client.cer.pem",
    "ssl.endpoint.identification.algorithm": "none",
    "sasl.mechanisms":                       "SCRAM-SHA-512",
    "sasl.username":                         "usernamee",
    "sasl.password":                         "pwww",
    "auto.offset.reset":                     "latest",
}
```

- **group.id**: A unique identifier for the consumer group.
- **bootstrap.servers**: The list of Kafka broker addresses.
- **SSL configuration**: Paths to the CA, key, and certificate files are used for secure communication.
- **SASL configuration**: The username and password authenticate the connection.

### Kafka Consumer Setup

The Kafka consumer is created using the initialized configuration and subscribes to the desired topic:

```go
consumer, err := kafka.NewConsumer(config)
if err != nil {
    fmt.Printf("Failed to create consumer: %s\n", err)
    os.Exit(1)
}

topic := "tron.broadcasted.transactions"

// Subscribe to the topic
err = consumer.SubscribeTopics([]string{topic}, nil)
if err != nil {
    fmt.Printf("Failed to subscribe to topic: %s\n", err)
    os.Exit(1)
}
```

### Message Processing

The consumer polls messages from the Kafka topic and processes them in real-time. Messages are expected to be in JSON format, and the function `processMessage` handles parsing and logging the messages.

```go
func processMessage(msg *kafka.Message) {
    fmt.Printf("Received message on topic %s [%d] at offset %v:\n",
        *msg.TopicPartition.Topic, msg.TopicPartition.Partition, msg.TopicPartition.Offset)

    // Try to parse the message value as JSON
    var jsonData interface{}
    err := json.Unmarshal(msg.Value, &jsonData)
    if err != nil {
        fmt.Printf("Error parsing JSON: %v\n", err)
        fmt.Printf("Raw message: %s\n", string(msg.Value))
        return
    }

    // Pretty print the JSON
    prettyJSON, err := json.MarshalIndent(jsonData, "", "  ")
    if err != nil {
        fmt.Printf("Error prettifying JSON: %v\n", err)
        return
    }

    fmt.Printf("Parsed JSON:\n%s\n", string(prettyJSON))

    // Log message data
    logEntry := map[string]interface{}{
        "topic":     *msg.TopicPartition.Topic,
        "partition": msg.TopicPartition.Partition,
        "offset":    msg.TopicPartition.Offset,
        "key":       string(msg.Key),
        "value":     string(prettyJSON),
    }
    fmt.Printf("Log entry: %+v\n", logEntry)
    fmt.Println("----------------------------------------")
}
```

- **Message Parsing**: The message is expected in JSON format, and Go’s `encoding/json` library is used to decode it.
- **Pretty Print**: The JSON is formatted using `MarshalIndent` for easier readability.
- **Logging**: The topic, partition, offset, key, and message value are logged.

### Subscribing and Polling

The consumer subscribes to the topic and polls for new messages. Messages are processed in a loop, and the program listens for system signals to gracefully shut down the consumer.

```go
// Set up a channel to handle shutdown
sigchan := make(chan os.Signal, 1)
signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)

// Poll messages and process them
run := true
for run {
    select {
    case sig := <-sigchan:
        fmt.Printf("Caught signal %v: terminating\n", sig)
        run = false
    default:
        ev := consumer.Poll(100)
        if ev == nil {
            continue
        }

        switch e := ev.(type) {
        case *kafka.Message:
            processMessage(e)

        case kafka.Error:
            fmt.Printf("Error: %v\n", e)
            if e.Code() == kafka.ErrAllBrokersDown {
                run = false
            }
        default:
            fmt.Printf("Ignored %v\n", e)
        }
    }
}

// Close down consumer
consumer.Close()
```

- **Signal Handling**: The program listens for OS signals (like `SIGINT` or `SIGTERM`) and gracefully shuts down the consumer when interrupted.
- **Polling**: The Kafka consumer polls for new messages every 100ms and processes them using the `processMessage` function.
- **Error Handling**: Kafka errors are caught and logged, and the consumer closes down if all brokers are down.

### Running the Go Kafka Consumer

After setting up the code, follow these steps to run the Go Kafka consumer:

1. **Initialize the Go module** (if not already done):

```bash
go mod init kafka-consumer
```

2. **Run the Go file**:

```bash
go run consumer.go
```

This command compiles and runs the `main.go` file, starting the Kafka consumer to listen for messages on the subscribed topic.

### Execution Workflow

Here’s the sequence of operations when the Go script runs:

1. **Kafka Client Initialization**: The Kafka client is initialized with SSL and SASL configurations.
2. **Group ID Assignment**: A unique `group.id` is set to ensure messages are consumed independently.
3. **Kafka Consumer Subscription**: The consumer subscribes to a Kafka topic.
4. **Message Processing**:
   - **Polling**: The consumer polls Kafka for messages.
   - **Message Parsing**: Messages are expected to be in JSON format, and they are parsed and logged.
5. **Graceful Shutdown**: The consumer shuts down cleanly when a termination signal is received.