---
sidebar_position: 1
---

# Go Example to Use Kafka Protobuf Streams for Real-time Data

This guide walks through the implementation of a Kafka consumer in Go to subscribe to a Kafka topic and process [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time. The consumer connects to the Kafka brokers securely using SSL and handles incoming messages in **Protobuf** format.

The schema is available [here](https://github.com/bitquery/streaming_protobuf/tree/main/solana).

The complete code is available [here](https://github.com/bitquery/stream_protobuf_example).

## Protobuf vs JSON

To understand why Protobuf is better than JSON, you can read the comparison [here](/docs/streams/kafka-streaming-concepts/#protobuf-streams)

### Prerequisites

Ensure you have the following components set up before running the Go Kafka consumer:

1. **Bitquery Kafka Server Access**: Access to Bitquery Kafka brokers.
2. **Username and Password**: For authentication with the Kafka brokers.
3. **Topic name(s)** to subscribe to like `solana.dextrades.proto`
4. **Go**: Version >= 1.16.
5. **Confluent Kafka Go Client**: Kafka client library for Go.

### **Key Components**

- **Kafka Consumer**: Listens for incoming messages from a Kafka topic.
- **Processor**: Handles messages and processes them based on the topic.
- **Configuration**: `config.yml` contains settings for Kafka, Consumer, and Processor.
- **Main Entry Point**: `main.go` initializes and runs the consumer and processor.

## Step by Step Code

### **`config.yml` - Kafka Config**

**Purpose**: To setup server, login, reconnect and other configuration details

Below is the sample config setup, modify it according to your requirements.

```yaml
kafka:
  bootstrap.servers: "rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093"
  security.protocol: "SASL_SSL"
  sasl.mechanism: "SCRAM-SHA-512"
  sasl.username: "<your_username_here>"
  sasl.password: "<your_password_here>"
  group.id: "<username_group-number>"
  ssl.key.location: "ssl/client.key.pem"
  ssl.certificate.location: "ssl/client.cer.pem"
  ssl.ca.location: "ssl/server.cer.pem"
  ssl.endpoint.identification.algorithm: "none"
  enable.auto.commit: false
consumer:
  topic: solana.dextrades.proto
  partitioned: true
processor:
  buffer: 100V
  workers: 8
log_level: "debug"

```

### **`consumer.go` - Kafka Consumer**

**Purpose**: Connects to Kafka, subscribes to a topic, and receives messages.

**Types of Consumers**

- **SimpleConsumer**: Single consumer instance
- **PartitionedConsumer**: Multiple consumers for high throughput

**Key Functions**

1.  `newSimpleConsumer()`: Creates a Kafka consumer.
2.  `waitMessages()`: Continuously reads messages.
3.  `newPartitionedConsumer()`: Handles multiple Kafka partitions.

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"golang.org/x/sync/errgroup"
)

type Consumer interface {
	waitMessages(ctx context.Context, listener Listener)
	close()
}

type SimpleConsumer struct {
	kafkaConsumer *kafka.Consumer
}

type ConsumerConfig struct {
	Topic       string
	Partitioned bool
}

type PartitionedConsumer struct {
	kafkaConsumers []*kafka.Consumer
}

func newConsumer(config *Config) (Consumer, error) {
	if config.Consumer.Partitioned {
		return newPartitionedConsumer(config)
	}
	return newSimpleConsumer(config)
}

func newSimpleConsumer(config *Config) (*SimpleConsumer, error) {
	kafkaConsumer, err := kafka.NewConsumer(&config.Kafka)
	if err != nil {
		return nil, err
	}

	err = kafkaConsumer.Subscribe(config.Consumer.Topic, nil)
	if err != nil {
		return nil, err
	}

	return &SimpleConsumer{
		kafkaConsumer,
	}, nil
}

func (consumer *SimpleConsumer) close() {
	consumer.kafkaConsumer.Close()
}

func (consumer *SimpleConsumer) waitMessages(ctx context.Context, listener Listener) {
	err := consumerWaitMessages(ctx, consumer.kafkaConsumer, listener)
	if err != nil {
		fmt.Println("error waiting messages:", err)
	}
}

func consumerWaitMessages(ctx context.Context, consumer *kafka.Consumer, listener Listener) error {

	fmt.Println("Running consumer " + consumer.String())
	for {
		select {
		case <-ctx.Done():
			fmt.Println("Done, exiting consumer loop")
			return nil
		default:
		}

		message, err := consumer.ReadMessage(time.Second * 60)
		if err != nil {
			return err
		}

		listener.enqueue(message)

	}
}

func newPartitionedConsumer(config *Config) (Consumer, error) {

	kafkaAdmin, err := kafka.NewAdminClient(&config.Kafka)
	if err != nil {
		return nil, err
	}
	defer kafkaAdmin.Close()

	metadata, err := kafkaAdmin.GetMetadata(&config.Consumer.Topic, false, 10000)
	if err != nil {
		return nil, err
	}

	kafkaErr := metadata.Topics[config.Consumer.Topic].Error
	if kafkaErr.Code() != kafka.ErrNoError {
		return nil, kafkaErr
	}

	partitions := metadata.Topics[config.Consumer.Topic].Partitions
	fmt.Printf("Subscribing to topic %s %d partitions: %v...\n", config.Consumer.Topic, len(partitions), partitions)

	consumers := make([]*kafka.Consumer, len(partitions))
	for i, partition := range partitions {
		consumer, err := kafka.NewConsumer(&config.Kafka)
		if err != nil {
			return nil, err
		}
		err = consumer.Assign([]kafka.TopicPartition{{
			Topic:     &config.Consumer.Topic,
			Partition: partition.ID,
			Offset:    kafka.OffsetStored,
		}})
		if err != nil {
			return nil, err
		}
		err = consumer.Subscribe(config.Consumer.Topic, nil)
		if err != nil {
			return nil, err
		}
		consumers[i] = consumer
	}

	fmt.Printf("Assigned %d consumers to %s topic\n", len(consumers), config.Consumer.Topic)

	return &PartitionedConsumer{
		kafkaConsumers: consumers,
	}, nil
}

func (consumer *PartitionedConsumer) close() {
	for _, c := range consumer.kafkaConsumers {
		err := c.Close()
		if err != nil {
			fmt.Println("Error closing consumer: " + err.Error())
		}
	}
}

func (consumer *PartitionedConsumer) waitMessages(ctx context.Context, listener Listener) {
	var wg errgroup.Group
	for _, c := range consumer.kafkaConsumers {
		c := c
		wg.Go(func() error {
			return consumerWaitMessages(ctx, c, listener)
		})
	}
	wg.Wait()
}
```

### **`processor.go` - Message Processor**

**Purpose**: Processes Kafka messages using worker threads.

**Key Features**

- Uses **multiple workers** to process messages in parallel.
- Different handlers for different **Protobuf topics**.
- Reports statistics every **100 messages**.
- Deduplication Check (isDuplicated function)

**Key Functions**

1.  `newProcessor()`: Initializes message queue & workers.
2.  `enqueue()`: Adds messages to the processing queue.
3.  `start()`: Spins up worker goroutines to process messages.
4.  `close()`: Waits for all workers to finish.
5.  `isDuplicated()`: Prevents the same message from being processed multiple times

**How DeDeuplication Works**

- Each message is uniquely identified using **`slot` and `index`**.
- A **Least Recently Used (LRU) cache** stores recently processed messages.
- Messages are **discarded if already present in the cache**.
- Entries **expire after 240 seconds**, keeping memory usage optimized.

```go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/hashicorp/golang-lru/v2/expirable"
	"golang.org/x/sync/errgroup"
)

type ProcessorConfig struct {
	Buffer  int
	Workers int
}

type Listener interface {
	enqueue(message *kafka.Message)
}

type dedupCache struct {
	cache *expirable.LRU[string, bool]
	mu    sync.Mutex
}

type processFn func(context.Context, *kafka.Message, int, *dedupCache) error

type Processor struct {
	queue     chan (*kafka.Message)
	wg        errgroup.Group
	config    ProcessorConfig
	processFn processFn
	stat      *Statistics
	dedup     *dedupCache
}

func newProcessor(config *Config) (*Processor, error) {
	processor := &Processor{
		queue:  make(chan *kafka.Message, config.Processor.Buffer),
		config: config.Processor,
		stat:   newStatistics(),
		dedup: &dedupCache{
			cache: expirable.NewLRU[string, bool](100000, nil,
				time.Second*time.Duration(240)),
		},
	}

	var processFn processFn
	switch config.Consumer.Topic {
	case "solana.dextrades.proto":
		processFn = processor.dexTradesMessageHandler
	case "solana.transactions.proto":
		processFn = processor.transactionsMessageHandler
	case "solana.tokens.proto":
		processFn = processor.tokensMessageHandler
	default:
		processFn = processor.jsonMessageHandler
	}

	processor.processFn = processFn
	return processor, nil
}

func (processor *Processor) enqueue(message *kafka.Message) {
	processor.queue <- message
}

func (processor *Processor) start(ctx context.Context) {
	counter := 0
	for i := 0; i < processor.config.Workers; i++ {
		processor.wg.Go(func() error {
			i := i
			fmt.Println("Starting worker ", i)
			for {
				select {
				case <-ctx.Done():
					fmt.Println("Done, exiting processor loop worker ", i)
					return nil
				case message := <-processor.queue:
					err := processor.processFn(ctx, message, i, processor.dedup)
					if err != nil {
						fmt.Println("Error processing message", err)
					}
					counter++
					if counter%100 == 0 {
						processor.stat.report()
					}
				}
			}
			return nil
		})
	}
}

func (processor *Processor) close() {
	fmt.Println("Shutting down processor...")
	processor.wg.Wait()
	fmt.Println("Processor stopped")
	processor.stat.report()
}

func (dedup *dedupCache) isDuplicated(slot uint64, index uint32) bool {
	key := fmt.Sprintf("%d-%d", slot, index)
	dedup.mu.Lock()
	defer dedup.mu.Unlock()

	if dedup.cache.Contains(key) {
		return true
	}

	dedup.cache.Add(key, true)
	return false
}
```

### **`main.go` - Entry Point **

**Purpose**: Loads configuration, initializes the consumer & processor, and starts them.

**Key Steps**

1.  **Read configuration** (`config.yml`)
2.  **Initialize Kafka consumer** (`newConsumer()`)
3.  **Initialize message processor** (`newProcessor()`)
4.  **Start processing messages**
5.  **Handle graceful shutdown (Ctrl+C)**

```go
package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/signal"
	"syscall"

	"gopkg.in/yaml.v3"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type Config struct {
	Kafka     kafka.ConfigMap
	Consumer  ConsumerConfig
	Processor ProcessorConfig
}

func main() {

	file, err := os.Open("config.yml")
	if err != nil {
		panic(fmt.Errorf("error opening config file: %v, copy original file config_example.yml to config.yml and edit it", err))
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		panic(err)
	}

	var config Config
	err = yaml.Unmarshal(bytes, &config)
	if err != nil {
		panic(err)
	}

	consumer, err := newConsumer(&config)
	if err != nil {
		panic(err)
	}
	defer consumer.close()

	processor, err := newProcessor(&config)
	if err != nil {
		panic(err)
	}
	defer processor.close()

	ctx, cancel := context.WithCancel(context.Background())
	fmt.Println("press Ctrl-C to exit")
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		select {
		case <-signalCh:
			cancel()
			fmt.Println("received Ctrl-C, finishing jobs...")
			return
		}
	}()

	processor.start(ctx)
	consumer.waitMessages(ctx, processor)
}
```

## **Running the Application**

After setting up the config file, **start the consumer & processor**:

```
./stream_protobuf_example
```
