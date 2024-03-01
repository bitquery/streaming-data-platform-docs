---
sidebar_position: 5
---


# Subscribing to Mempool Updates

The Mempool API allows you to access real-time data from the mempool for EVM chains including Ethereum, and BNB chains. You can use this API to monitor transactions, token trades, transfers, and any data stored in the mempool. Check examples [in this page](/docs/examples/mempool/mempool-api.md).

## Understanding Mempool Queries

When querying the mempool using the parameter `mempool: true`, it's important to know that the results do not directly reflect the live state of the mempool. Instead, this query returns transactions that have been broadcasted but may already be included in confirmed blocks.

## What distinguishes mempool from standard on-chain data subscription
Mempool subscriptions differ from regular subscriptions. This subscription involves a stream of broadcasted transactions, differing from standard on-chain data subscriptions in various aspects:

- Transactions arrive in a random sequence.
- Each transaction appears only once, even if the transaction has been broadcasted multiple times. 
- The `mempool:true` query showcases broadcasted transactions upto past hour and not earlier than that.
- When using TX time (transaction time), remember it's exclusive to mempool queries, not standard ones. 

### Advanced Query Strategies

To distinguish between pending and confirmed transactions, use a two-step approach combining `mempool: true` for unconfirmed transactions and `mempool: false` for confirmed ones.

```
subscription{
  mempool: EVM(mempool: true) {
    Un_Confirmed:Transactions(
      limit: {count: 100}
      where: {any: [{Transaction: {From: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}
      {Transaction: {To: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}]}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
        To
        From
      }
    }
  }
  Confirmed: EVM(mempool: false) {
    Transactions(
      limit: {count: 100}
      where: {any: [{Transaction: {From: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}
      {Transaction: {To: {is: "0x21a31ee1afc51d94c2efccaa2092ad1028285549"}}}]}
    ) {
      Block {
        Time
        Number
      }
      Transaction {
        Hash
        Cost
        To
        From
      }
    }
  }
}
```
