# Solana Token Holders API

Get real-time and historical token holder data for any SPL token on Solana. Bitquery provides two approaches to retrieve token holders — choose the one that fits your use case.

<head>
<meta name="title" content="Solana Token Holders API | Get Top Holders for Any SPL Token"/>
<meta name="description" content="Get real-time and historical token holder data for any SPL token on Solana. Calculate top holders, track wallet distribution, and monitor holder changes using Bitquery's V1 and V2 APIs."/>
<meta name="keywords" content="Solana token holders API, SPL token holders, Solana wallet holders, Solana top holders, token holder distribution, Solana balance API, Solana holder tracking, Solana whale tracking, Pump.fun token holders, Solana DeFi holders, token holder analytics, Solana blockchain API, Solana web3 API, Solana holder count, SPL token balance, Solana token distribution"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta property="og:title" content="Solana Token Holders API | Get Top Holders for Any SPL Token" />
<meta property="og:description" content="Get real-time and historical token holder data for any SPL token on Solana. Calculate top holders using Bitquery's V1 (historical transfers) and V2 (real-time balance updates) APIs." />

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Solana Token Holders API | Get Top Holders for Any SPL Token" />
<meta property="twitter:description" content="Get real-time and historical token holder data for any SPL token on Solana. Calculate top holders using Bitquery's V1 (historical transfers) and V2 (real-time balance updates) APIs." />
</head>

## Choosing the Right API

Bitquery provides two versions of Solana APIs — each with different strengths for retrieving token holder data:

| Feature | V1 API (Transfers) | V2 API (Balance Updates) |
|---------|---------------------|--------------------------|
| **Data coverage** | Complete historical data from token launch | Last ~8 hours of balance updates |
| **Best for** | Any token, any age | Newly launched tokens (< 8 hours old) |
| **Data freshness** | Lags a few minutes behind real-time | Real-time |
| **Method** | Calculates holders from cumulative transfers (sum of inflows − outflows) | Reads latest balance snapshot directly |
| **Query complexity** | Requires aggregation (sum, expression) | Simple — just read `PostBalance` |
| **Ideal use cases** | Tokens older than 8 hours, historical holder analysis, whale tracking | Tokens launched within the last 8 hours, Pump.fun launches, fast holder snapshots |

:::tip When to use which?
- **Token launched more than 8 hours ago** → Use **V1 API** (complete history)
- **Token launched within the last 8 hours** → Use **V2 API** (faster, simpler)
- **Need both speed and history** → Combine both: V2 for the latest snapshot, V1 for historical trends
:::

## V1 API — Historical Token Holders via Transfers

The V1 API calculates token holders by summing all incoming and outgoing transfers for each wallet address. This gives you **complete, accurate holder data** for any token regardless of when it was launched.

**Strengths:**
- Full historical coverage from token genesis
- Works for any SPL token, any age
- Accurate holder balances computed from on-chain transfer history

**Limitation:**
- Data may lag a few minutes behind real-time

For more V1 Solana transfer examples, see the [V1 Solana Transfers documentation](https://docs.bitquery.io/v1/docs/Examples/Solana/transfers).

### Top Token Holders

Get the top holders for any SPL token by calculating net balances from transfer history.

**Try it live:** [Solana Token Holders V1](https://ide.bitquery.io/)

```graphql
{
  solana(network: solana) {
    transfers(
      date: { since: "2026-02-19" }
      currency: { is: "943YczGfS95e1ZnUSMd5DPQrGXaKBS2zGR76htycpump" }
      options: { limit: 10000, desc: "balance" }
    ) {
      sum_in: amount(calculate: sum)
      sum_out: amount(calculate: sum)
      balance: expression(get: "sum_in - sum_out")
      count_in: countBigInt
      count_out: countBigInt
      currency {
        address
        symbol
        tokenType
      }
      receiver {
        address
      }
    }
  }
}
```

### How This Query Works

1. **Fetches all transfers** for the specified token since the given date
2. **Groups by receiver address** — each row represents a unique wallet
3. **`sum_in`** — total tokens received by that wallet
4. **`sum_out`** — total tokens sent out by that wallet
5. **`balance`** — net balance calculated as `sum_in - sum_out`
6. **Results sorted** by balance in descending order — top holders first

### Customization Options

**Filter by date range** — Narrow down to a specific period:

```graphql
date: { since: "2026-01-01", till: "2026-02-19" }
```

**Increase result limit** — Get more holders (up to the API limit):

```graphql
options: { limit: 25000, desc: "balance" }
```

**Filter out zero balances** — Only show current holders:

Add a filter to exclude wallets where balance equals zero by checking `sum_in - sum_out > 0` in your application logic after receiving the results.

## V2 API — Real-Time Token Holders via Balance Updates

The V2 API reads the latest balance snapshot directly from Solana's balance update records. This is **faster and simpler** but only covers the last ~8 hours of data.

**Strengths:**
- Real-time data with minimal delay
- Simpler query — reads balance directly instead of calculating from transfers
- Great for newly launched tokens and fast-moving markets

**Limitation:**
- Only covers the last ~8 hours of balance updates
- Best suited for tokens launched within that window

### Top Token Holders

Get the top 50 holders for a recently launched token using balance updates.

**Try it live:** [Solana Token Holders V2](https://ide.bitquery.io/)

```graphql
{
  Solana {
    BalanceUpdates(
      orderBy: { descendingByField: "BalanceUpdate_balance_maximum" }
      limit: { count: 50 }
      where: {
        BalanceUpdate: {
          PostBalance: { gt: "0" }
          Currency: {
            MintAddress: {
              is: "943YczGfS95e1ZnUSMd5DPQrGXaKBS2zGR76htycpump"
            }
          }
        }
      }
    ) {
      BalanceUpdate {
        Account {
          Owner
        }
        balance: PostBalance(maximum: Block_Slot)
      }
    }
  }
}
```

### How This Query Works

1. **Fetches balance update records** for the specified token mint address
2. **Filters out zero balances** — `PostBalance: { gt: "0" }` ensures only current holders are shown
3. **`PostBalance(maximum: Block_Slot)`** — gets the most recent balance by taking the value at the highest block slot
4. **Sorted by balance** in descending order — top holders first
5. **`Account.Owner`** — returns the wallet owner address

### Customization Options

**Get more holders** — Increase the limit:

```graphql
limit: { count: 200 }
```

**Filter by minimum balance** — Only show significant holders:

```graphql
PostBalance: { gt: "1000000" }
```

## Use Cases

### Whale Tracking
Monitor large holders and track their accumulation or distribution patterns. Use V1 for historical whale behavior or V2 for real-time whale alerts on new tokens.

### Token Distribution Analysis
Analyze how evenly a token is distributed across holders. Calculate metrics like the Gini coefficient or top-10 holder concentration to assess decentralization.

### New Token Launch Monitoring
Track holder growth for newly launched tokens (especially Pump.fun launches). Use V2 for instant holder snapshots within the first 8 hours.

### Holder Count Over Time
Use V1 to track how the number of unique holders changes over different date ranges, revealing adoption trends.

### Airdrop Verification
Verify that airdrop recipients actually hold the tokens by querying current balances.

### Smart Money Tracking
Identify wallets that consistently hold tokens early in successful launches. Cross-reference with the [Solana Trader API](https://docs.bitquery.io/docs/blockchain/Solana/solana-trader-API/) for deeper analysis.

## Best Practices

1. **Choose the right API for your use case** — V1 for historical/complete data, V2 for speed on new tokens
2. **Set appropriate date ranges in V1** — Narrower ranges reduce query complexity and points consumed
3. **Filter out zero balances** — Exclude wallets that have sold all tokens for cleaner results
4. **Account for token decimals** — Raw balances need to be divided by `10^decimals` for human-readable amounts
5. **Exclude known program accounts** — Filter out system programs, DEX pools, and bridge contracts for accurate retail holder counts
6. **Cache results** — Token holder data doesn't change every second; cache for 1–5 minutes to reduce API usage
7. **Combine V1 and V2** — Use V2 for the latest snapshot and V1 for historical trend analysis

## Related APIs

- [Solana Balance Updates API](https://docs.bitquery.io/docs/blockchain/Solana/solana-balance-updates/) — Real-time balance change monitoring
- [Solana Transfers API](https://docs.bitquery.io/docs/blockchain/Solana/solana-transfers/) — Track token transfers
- [Solana DEX Trades API](https://docs.bitquery.io/docs/blockchain/Solana/solana-dextrades/) — Trading activity for tokens
- [Solana Trader API](https://docs.bitquery.io/docs/blockchain/Solana/solana-trader-API/) — Trader analytics and smart money tracking
- [Solana Token Supply API](https://docs.bitquery.io/docs/blockchain/Solana/token-supply-cube/) — Token supply data
- [Pump.fun API](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/Pump-Fun-API/) — Pump.fun token data

## Support

For questions or issues:
- [Bitquery Support](https://support.bitquery.io)
- [Bitquery IDE](https://ide.bitquery.io)
- [Bitquery Documentation](https://docs.bitquery.io)
