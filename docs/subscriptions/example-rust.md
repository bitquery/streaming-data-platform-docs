---
sidebar_position: 5
---

# Building with WebSockets: Code Sample in Rust

In this section we will see how to use bitquery subscriptions in Rust. The final output will look something like this

![](/img/ApplicationExamples/rust.png)

## 1. Set Up Your Rust Project
First, ensure you have a Rust project set up. If not, you can create a new one:

```sh
cargo new bitquery_realtime
cd bitquery_realtime
```

## 2. Add Dependencies
Open your `Cargo.toml` file and add the necessary dependencies. For real-time data fetching and processing, you'll likely need dependencies like `tokio`, `reqwest`, `serde`, and `serde_json`.

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
futures = "0.3"
graphql-client = "0.10.0" # Adjust version as necessary
```

## 3. Implement the Logic

This is the basic outline of what we will do

-   Establish a WebSocket connection to Bitquery's streaming endpoint.
-  Set up up a GraphQL subscription to receive real-time DEX trades data.
-   The `subscribe` function handles the connection setup and starts the streaming operation.
-   The `main` function initializes the subscription and processes the incoming data.


This Rust code sets up a WebSocket client to subscribe to real-time data from Bitquery Solana APIs using the GraphQL over WebSocket protocol. Here's a detailed explanation of each part:

### Imports
```rust
use async_tungstenite::tungstenite::{
    client::IntoClientRequest,
    http::{header, HeaderValue},
    Message,
};
use eyre::Result;
use futures::StreamExt;
use graphql_client::GraphQLQuery;
use graphql_ws_client::{
    graphql::{GraphQLClient, StreamingOperation},
    AsyncWebsocketClient, GraphQLClientClientBuilder, SubscriptionStream,
};

pub mod queries;
mod tokio_spawner;

use tokio_spawner::TokioSpawner;
```
- `async_tungstenite`: Used for WebSocket communication.
- `eyre::Result`: A result type for error handling.
- `futures::StreamExt`: Provides extensions for working with streams.
- `graphql_client::GraphQLQuery`: Defines the GraphQL query structure.
- `graphql_ws_client`: Provides WebSocket client functionality for GraphQL.
- `queries`: Contains the GraphQL queries.
- `tokio_spawner`: Contains the task spawner implementation.

### Type Definitions
```rust
pub type DexTradesQuery = queries::DexTrades;
pub type DexTradesVariables = queries::dex_trades::Variables;
```
Defines type aliases for the GraphQL query and variables.

### `subscribe` Function
```rust
pub async fn subscribe<T: GraphQLQuery + Send + Sync + Unpin + 'static>(
    oauth_token: &str,
    variables: T::Variables,
) -> Result<(
    AsyncWebsocketClient<GraphQLClient, Message>,
    SubscriptionStream<GraphQLClient, StreamingOperation<T>>,
)>
where
    <T as GraphQLQuery>::Variables: Send + Sync + Unpin,
    <T as GraphQLQuery>::ResponseData: std::fmt::Debug,
{
    let mut request = "wss://streaming.bitquery.io/eap".into_client_request()?;
    request.headers_mut().insert(
        header::SEC_WEBSOCKET_PROTOCOL,
        HeaderValue::from_str("graphql-transport-ws")?,
    );
    request
        .headers_mut()
        .insert("Authorization", HeaderValue::from_str(format!("Bearer {}", oauth_token).as_str())?);

    let (connection, _) = async_tungstenite::tokio::connect_async(request).await?;

    let (sink, stream) = connection.split::<Message>();

    let mut client = GraphQLClientClientBuilder::new()
        .build(stream, sink, TokioSpawner::current())
        .await?;

    let stream = client
        .streaming_operation(StreamingOperation::<T>::new(variables))
        .await?;

    Ok((client, stream))
}
```
This function sets up a WebSocket connection to the Bitquery streaming endpoint.

1. **Create WebSocket Request**: 
   - Create a WebSocket request to the Bitquery streaming endpoint.
   - Add headers for the WebSocket protocol and authorization.

2. **Connect to WebSocket**:
   - Establish an asynchronous WebSocket connection using `async_tungstenite`.

3. **Split Connection**:
   - Split the connection into a sink (for sending messages) and a stream (for receiving messages).

4. **Build GraphQL Client**:
   - Create a `GraphQLClient` using `GraphQLClientClientBuilder`.

5. **Start Streaming Operation**:
   - Start a streaming GraphQL operation using the provided variables.

6. **Return Client and Stream**:
   - Return the client and the stream of data.

### Main Function

In this function we will pass the OAuth token. The best practise would be to include it as an environment variable, but for the sake of this tutorial it has been hard coded. You can generate a token [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)

```rust
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let token = "YOUR_HARDCODED_TOKEN";
    let (_client, mut stream) = subscribe::<DexTradesQuery>(
        token,
        DexTradesVariables {
            program_id: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P".to_string(),
        },
    )
    .await?;

    while let Some(response) = stream.next().await {
        dbg!(&response);
    }

    Ok(())
}
```
This is the entry point of the application.

1. **Load Environment Variables**:
   - Load environment variables from a `.env` file if it exists.

2. **Subscribe to Data**:
   - Call the `subscribe` function with the hardcoded API key and query variables.

3. **Process Incoming Data**:
   - Iterate over the stream of incoming responses.
   - Print each response using `dbg!`.



### 4. Run the Project
With everything set up, you can now build and run your project:

```sh
cargo run
```

This should start your application and begin fetching real-time data from Bitquery, printing the results to the console. 

