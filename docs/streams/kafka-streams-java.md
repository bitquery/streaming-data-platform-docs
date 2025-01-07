# Java Example to Use Kafka Streams for Real-time Data

## Overview

This guide explains how to implement a Java Kafka consumer to receive [onchain data streams from Bitquery](https://bitquery.io/products/streaming) in real-time using the Apache Kafka library. The consumer is secured with SSL and SASL, subscribing to a Kafka topic and logging messages to the console.

You can find the complete code [here](https://github.com/bitquery/kafka-consumer-example).

---

## Quick Start

1. **Create Your Java Project**: Set up a new Java project with the Apache Kafka client library.
2. **Prepare SSL Certificates**: Convert your PEM certificates to JKS format for Java compatibility.
3. **Configure Kafka Properties**: Update your Kafka properties file with SSL, SASL, and broker details.
4. **Write the Consumer Code**: Use the provided Kafka consumer code to consume and process messages.

---

## Prerequisites

Ensure that you have the following components in place before running the code:

1. **Kafka Cluster**: Accessible Kafka brokers from Bitquery.
2. **Username and Password**: For authentication with the Kafka brokers.
3. **Topic name(s)**: The topic you wish to subscribe to.
4. **Java**: JDK 8 or higher installed.
5. **Apache Kafka Client**: The Kafka client library for Java must be included in your project dependencies.
6. **Certificates**: Client and server certificates to secure communication between your consumer and the Kafka cluster.

---

## Step 1: Create Your Java Project

To begin, create a new Java project in your preferred Integrated Development Environment (IDE) such as IntelliJ IDEA or Eclipse.

### Add Kafka Client Library Dependency

Include the Kafka client library in your project. If you are using Maven for dependency management, add the following to your `pom.xml` file:

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>3.4.0</version> <!-- Use the latest version -->
</dependency>
```

Save the file, and Maven will download the required dependencies.

---

## Step 2: Prepare SSL Certificates for Kafka

To enable secure communication between your Kafka consumer and the Kafka cluster, you need to convert your PEM certificates to Java-compatible JKS format.

### Convert PEM to PKCS12 Format

Use the `openssl` tool to convert your PEM certificates (`client.cer.pem` and `client.key.pem`) into a PKCS12 file.

Run the following command in your terminal:

```bash
openssl pkcs12 -export -in client.cer.pem -inkey client.key.pem -out client.p12 -name mykey -CAfile ca.cer.pem -caname root -password pass:123456
```

This command creates a file named `client.p12` that contains the client certificates in PKCS12 format. The `-password` flag sets the password for the PKCS12 file.

### Convert PKCS12 to JKS Format

Now, use the `keytool` utility to convert the PKCS12 file into a JKS keystore:

```bash
keytool -importkeystore -deststorepass 123456 -destkeypass 123456 -destkeystore keystore.jks -srckeystore client.p12 -srcstoretype PKCS12 -srcstorepass 123456 -alias mykey
```

This creates a `keystore.jks` file, which is compatible with Java.

### Create a Truststore Containing the Broker's CA Certificate

1. **Retrieve the Broker's Certificate**:
   Use `openssl` to retrieve the broker's certificate:

   ```bash
   echo | openssl s_client -connect rpk0.bitquery.io:9093 -servername rpk0.bitquery.io -showcerts > broker_certs.pem
   ```

   This saves the broker's certificates into a file named `broker_certs.pem`.

2. **Import Certificates into Truststore**:
   Use `keytool` to import the broker's certificates into a truststore:

   ```bash
   keytool -import -alias brokerCert -file broker_certs.pem -keystore clienttruststore.jks -storepass truststorepassword
   ```

This step creates a `clienttruststore.jks` file, which contains the broker's certificate.

---

## Step 3: Configure Kafka Properties

In your Java application, configure the Kafka client properties to use the generated `keystore.jks` and `clienttruststore.jks` files for SSL authentication.

Here’s an example configuration:

```java
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.config.SaslConfigs;

Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
        "rpk0.bitquery.io:9093,rpk1.bitquery.io:9093,rpk2.bitquery.io:9093");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "consumer-group-1");
props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
props.put(SaslConfigs.SASL_MECHANISM, "SCRAM-SHA-512");
props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
props.put("ssl.endpoint.identification.algorithm", "");

props.put(SaslConfigs.SASL_JAAS_CONFIG,
        "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"your-username\" password=\"your-password\";");

props.put("ssl.keystore.location", "src/main/resources/keystore.jks");
props.put("ssl.keystore.password", "123456");
props.put("ssl.key.password", "123456");
props.put("ssl.truststore.location", "src/main/resources/clienttruststore.jks");
props.put("ssl.truststore.password", "truststorepassword");
```

Ensure the file paths and passwords match your setup.

---

## Step 4: Write the Kafka Consumer Code

Write the Kafka consumer code to connect to the Kafka topic and process messages.

### Initialize the Kafka Consumer

Create and configure a `KafkaConsumer` object:

```java
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Collections.singletonList("tron.broadcasted.transactions"));
```

### Poll and Process Messages

Use the `poll` method to retrieve messages from the Kafka topic and process them:

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

Add a shutdown hook to close the consumer cleanly when the application is terminated:

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

---

## Execution Workflow

1. **Kafka Client Initialization**: The Kafka client is configured with SSL and SASL properties.
2. **Subscribe to Kafka Topic**: The consumer connects to the specified topic.
3. **Message Processing**: Messages are retrieved, processed, and logged to the console.
4. **Graceful Shutdown**: The consumer shuts down cleanly when terminated.
