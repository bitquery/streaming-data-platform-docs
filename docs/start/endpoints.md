# Endpoints and Regions

Bitquery provides multiple regional endpoints to optimize latency and performance. Choose the endpoint closest to your geographic location for the best experience.

## Overview

Bitquery offers two API versions:

- **V1**: GraphQL API for historical blockchain data
- **V2**: Streaming GraphQL API with real-time and historical data (varies from blockchain to blockchain)

:::tip
For optimal performance, use the endpoint closest to your application's deployment region.
:::

## Europe and Nearby

### V1 - Historical Data API

```
https://graphql.bitquery.io
```

### V2 - Streaming API

The following chains are available via the Europe regional endpoint:

| Blockchain | Endpoint |
|------------|----------|
| Ethereum | `https://streaming.bitquery.io/graphql` |
| BSC (Binance Smart Chain) | `https://streaming.bitquery.io/graphql` |
| Base | `https://streaming.bitquery.io/graphql` |
| Solana | `https://streaming.bitquery.io/graphql` |
| Arbitrum | `https://streaming.bitquery.io/graphql` |
| Optimism | `https://streaming.bitquery.io/graphql` |
| Tron | `https://streaming.bitquery.io/graphql` |
| Matic (Polygon) | `https://streaming.bitquery.io/graphql` |

## Asia

### V1 - Historical Data API

```
https://asia.graphql.bitquery.io
```

### V2 - Streaming API

The following chains are available via the Asia regional endpoint:

| Blockchain | Endpoint |
|------------|----------|
| Ethereum | `https://asia.streaming.bitquery.io/graphql` |
| BSC (Binance Smart Chain) | `https://asia.streaming.bitquery.io/graphql` |
| Base | `https://asia.streaming.bitquery.io/graphql` |
| Solana | `https://asia.streaming.bitquery.io/graphql` |
| Arbitrum | `https://asia.streaming.bitquery.io/graphql` |
| Optimism | `https://asia.streaming.bitquery.io/graphql` |
| Tron | `https://asia.streaming.bitquery.io/graphql` |
| Matic (Polygon) | `https://asia.streaming.bitquery.io/graphql` |

## United States

:::info
US regional endpoints are coming soon. In the meantime, US-based users can use the Europe endpoints.
:::

## Next Steps

- Learn about [API authentication](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
- Explore the [GraphQL IDE](https://ide.bitquery.io/)
- Check [API examples](https://docs.bitquery.io/docs/blockchain/introduction/)
