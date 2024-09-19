---
sidebar_position: 4
---

# Java Example to Use Kafka Streams for Real-time Data

## Overview

This guide explains how to implement a Java Kafka consumer to receive [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time using the Apache Kafka library. The consumer is secured with SSL and SASL, subscribing to a Kafka topic and logging messages to the console. 

You can find the complete code [here](https://github.com/bitquery/kafka-consumer-example).

### Prerequisites

Ensure that you have the following components in place before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers from Bitquery.
2. **Username and Password**: For authentication with the Kafka brokers.
3. **Topic name(s)** to subscribe to.
4. **Java**: JDK 8 or higher.
5. **Apache Kafka Client**: Kafka client library for Java.

### Additional Files

- Download all the certificates and store them in the `src/main/resources/` folder:
  - `keystore.jks`: SSL keystore file
  - `clienttruststore.jks`: SSL truststore file

Ensure that the paths and passwords in the configuration match your actual certificate files and credentials.

### Dependencies

The script relies on the Apache Kafka client library. Make sure to include it in your project's dependencies. If you're using Maven, add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>3.4.0</version> <!-- Use the latest version -->
</dependency>
```

### Kafka Client Initialization

The Kafka client is initialized using the `KafkaConsumer` class from the Apache Kafka library. The client is configured with SSL and SASL to authenticate communication with the Kafka brokers.

```java
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.config.SaslConfigs;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;

Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
        "rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "trontest1-group-1");
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
props.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
props.put("ssl.endpoint.identification.algorithm", "");

props.put(SaslConfigs.SASL_JAAS_CONFIG,
        "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"ssss\" password=\"ssss\";");

props.put("ssl.keystore.location", "src/main/resources/keystore.jks");
props.put("ssl.keystore.password", "123456");
props.put("ssl.key.password", "123456");
props.put("ssl.truststore.location", "src/main/resources/clienttruststore.jks");
props.put("ssl.truststore.password", "truststorepassword");
```

- **group.id**: A unique identifier for the consumer group.
- **bootstrap.servers**: List of Kafka broker addresses.
- **SSL configuration**: Paths to the keystore and truststore files are provided for SSL authentication.
- **SASL configuration**: Username and password are used for secure communication.

### Kafka Consumer Setup

The Kafka consumer is initialized to consume messages from a specified topic. In this case, the consumer listens to the `tron.broadcasted.transactions` topic.

```java
String topic = "tron.broadcasted.transactions";
KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer<>(props, new ByteArrayDeserializer(),
        new ByteArrayDeserializer());
consumer.subscribe(Collections.singletonList(topic));
```

### Message Processing

The consumer polls for new messages and processes them in a loop. Each message is converted from bytes to a string and printed to the console.

```java
while (true) {
    ConsumerRecords<byte[], byte[]> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<byte[], byte[]> record : records) {
        String value = new String(record.value());
        System.out.println(value);
    }
}
```

### Graceful Shutdown

A shutdown hook is added to ensure the consumer closes gracefully when the application is terminated.

```java
Runtime.getRuntime().addShutdownHook(new Thread(consumer::wakeup));

try {
    // Main consumer loop
} catch (WakeupException e) {
    // Ignore for shutdown
} finally {
    consumer.close();
}
```

### Execution Workflow

The following sequence of operations occurs when the script runs:

1. **Kafka Client Initialization**: The Kafka client is initialized with SSL and SASL configurations.
2. **Group ID Assignment**: A unique `group.id` is used to ensure independent message processing.
3. **Kafka Consumer Connection**: The consumer subscribes to a Kafka topic.
4. **Message Processing**:
   - **Polling**: The consumer polls messages from Kafka.
   - **Logging**: The message content is logged to the console.
5. **Graceful Shutdown**: A shutdown hook ensures the consumer closes cleanly upon termination.


