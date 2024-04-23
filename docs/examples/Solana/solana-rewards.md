---
sidebar_position: 5
---
# Solana Rewards API

<head>
<meta name="title" content="How to track Solana Staking Rewards using Solana Rewards API"/>
<meta name="description" content="Easy-to-use API to track Solana Rewards of an Address using Bitquery's Solana Rewards API."/>
<meta name="keywords" content="Solana Rewards api, solana rewards python api, rewards api, solana rewards scan api, rewards api docs, solana rewards crypto api, rewards blockchain api,solana network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->

<meta property="og:type" content="website" />
<meta
  property="og:title"
  content="How to track Solana Staking Rewards using Solana Rewards API"
/>
<meta
  property="og:description"
  content="Easy-to-use API to track Solana Rewards of an Address using Bitquery's Solana Rewards API."
/>

<!-- Twitter -->

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="How to track Solana Staking Rewards using Solana Rewards API" />
<meta property="twitter:description" content="Easy-to-use API to track Solana Rewards of an Address using Bitquery's Solana Rewards API." />
</head>



Solana rewards are incentives given to investors and validators for staking their SOL tokens to secure the network.This section covers how to access information about the latest Solana rewards among other examples.

This Solana API is part of our Early Access Program (EAP), which is intended for evaluation purposes.
This program allows you to test the data and its integration into your applications before full-scale implementation. Read more [here](https://docs.bitquery.io/docs/graphql/dataset/EAP/)

## Latest Rewards

The query below helps track the most recent reward distributions on the Solana blockchain in real-time.
You can find the query [here](https://ide.bitquery.io/Latest-Solana-Rewards)

```
subscription {
  Solana {
    Rewards(limit: {count: 10}) {
      Block {
        Hash
        Height
        Slot
        RewardsCount
        Time
      }
      Reward {
        RewardType
        PostBalance
        Index
        Commission
        Amount
        Address
      }
    }
  }
}

```

## Rewards for a Wallet Address

If you're interested in tracking the rewards for a specific wallet address, you can modify the query to filter results based on the address. This allows stakeholders to monitor their own rewards or analyze rewards distribution to specific addresses over time.

```
subscription {
  Solana {
    Rewards(
      limit: {count: 10}
      where: {Reward: {Address: {is: "HnfPZDrbJFooiP9vvgWrjx3baXVNAZCgisT58gyMCgML"}}}
    ) {
      Block {
        Hash
        Height
        Slot
        RewardsCount
        Time
      }
      Reward {
        RewardType
        PostBalance
        Index
        Commission
        Amount
        Address
      }
    }
  }
}

```
