# How to Easily Track Token Lock and Unlock Events Using Bitquery APIs

In this article, we are going to understand why tracking token lock and unlock events is necessary for investors and project teams in the quickly changing crypto space.

Token lockups provide the project with stability and confidence by restricting token sales or transfers for a certain amount of time. The sudden release of a large number of tokens, however, may result in market instability. Tracking these occurrences allows stakeholders to anticipate market movements and make informed decisions.

Anyone can follow this guide to understand how to use Bitquery APIs to track vested tokens and receive alerts when unlocking events are about to occur.

## Understanding Token Locks and Unlocks

### What Are Token Locks?

Token locks are methods applied by blockchain projects to limit the ability to transfer of tokens for a certain duration. They're frequently used for:

Vesting Periods: Tokens are gradually released to team members or early investors to ensure long-term commitment. This can help prevent immediate sell-offs that could negatively impact the token's price.
Liquidity Locks: A certain amount of tokens is kept in liquidity pools for a defined duration to aid in market stability. This ensures there is always sufficient liquidity available, which is crucial for the smooth functioning of decentralized exchanges (DEXs) and other financial mechanisms within the ecosystem.

### Why Track Token Unlocks?

Tracking token unlocks is necessary for:

Investors: To predict possible adjustments in token supply that may affect market values. Knowing when big sums of tokens will be released might assist investors make informed purchases or sales.
Project Teams: To oversee token distributions and maintain transparency with stakeholders. Transparency about token unlock schedules can build trust within the community and among investors.

## Key Data Points to Track

When tracking token lock and unlock events, the following data points are essential:

- Token Name and Symbol: Identify the token in question.
- Unlock Date: When the tokens will be unlocked.
- Amount to be Unlocked: The quantity of tokens that will be released.
- Vesting Schedule: Details of the vesting period and intervals.
- Contract Address: The smart contract address governing the lockup.
- Transaction History: Past lock and unlock transactions for context.

### Adding Liquidity Event
In decentralized finance (DeFi), adding liquidity means putting tokens into a pool on a decentralized exchange (DEX). This process ensures that there are enough tokens available for trading, which is essential for maintaining market stability and enabling smooth transactions.

#### Why It's Important

Adding liquidity can earn rewards for those who contribute tokens. It also helps keep the market running smoothly. By adding liquidity, token holders can participate in the ecosystem, earn transaction fees, and support the overall health of the market.

#### How to Track

Use Bitquery APIs to see when large amounts of tokens are added to pools. This can indicate important moves by project teams or big investors. By monitoring these events, you can gain insights into market behavior and anticipate potential price changes based on liquidity movements.

#### Example Query

To track liquidity events, you can use a query similar to the one for tracking token unlocks, but focusing on transactions related to liquidity pools. Here’s a sample query to track liquidity additions on the Ethereum network:

```graphql
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214" }
        }
        Log: { Signature: { Name: { is: "onDeposit" } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
        Time
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Transaction {
        From
      }
    }
  }
}
```

This query helps identify significant liquidity additions, providing insights into market dynamics.

### Removing Liquidity Event

Removing liquidity means taking tokens out of a pool. This action can have a significant impact on the market, as it reduces the available liquidity, which can lead to price volatility and affect the overall market stability.

#### Why It's Important

Removing a lot of liquidity can make the market less stable and cause price swings. It can signal that investors or project teams are withdrawing support from the market, which might indicate upcoming price drops or market corrections.

#### How to Track

In order to see when large amounts of tokens are taken out of pools, we can use Bitquery APIs. This can help predict potential market changes. By monitoring these events, you can stay ahead of market movements and adjust your strategies accordingly.

#### Example Query

To track liquidity removal events, use a query similar to the one for tracking liquidity additions, but focus on transactions related to liquidity removals. Here’s a sample query to track liquidity removals on the Ethereum network:

```graphql
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214" }
        }
        Log: { Signature: { Name: { is: "onWithdraw" } } }
      }
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
        Time
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
      Transaction {
        From
      }
    }
  }
}
```

This query helps identify significant liquidity removals, providing insights into market behavior.

- Detailed Steps to Track Token Unlocks

- Identify the Token and Smart Contract

- First, find out which token and smart contract you're dealing with.

- Query the Lockup Transactions

In order to search for transactions that lock tokens, we can use Bitquery APIs. Here’s a sample query for locked tokens on the Ethereum network:

```graphql
{
  EVM(dataset: archive, network: eth) {
    Calls(
      limit: { count: 10 }
      orderBy: { descending: Block_Date }
      where: {
        Call: { Signature: { Signature: { is: "lock()" } } }
        Block: { Date: { after: "2023-01-01" } }
      }
    ) {
      Call {
        LogCount
        InternalCalls
      }
      Transaction {
        Gas
        Hash
        From
        To
      }
      Block {
        Date
        Number
      }
    }
  }
}
```

This query fetches transactions related to the lockup, providing details such as the date, transaction hash, gas price, and gas used. It helps in understanding the initial lockup conditions and timelines.

### Monitor Unlock Events

Set up a query to keep an eye on upcoming token unlock events. For example:

```graphql
{
  EVM(dataset: archive, network: eth) {
    Calls(
      limit: { count: 10 }
      orderBy: { descending: Block_Date }
      where: {
        Call: { Signature: { Signature: { is: "unlock()" } } }
        Block: { Date: { after: "2023-01-01" } }
      }
    ) {
      Call {
        LogCount
        InternalCalls
      }
      Transaction {
        Gas
        Hash
        From
        To
      }
      Block {
        Date
        Number
      }
    }
  }
}
```

This query tracks transactions that signal token unlocks, providing details about the dates, transaction hash, gas price, and gas used. It helps in predicting when tokens will become available for trading. 4. Set Up Notifications

Create notifications to alert you when tokens are about to be unlocked. You can use email alerts, webhooks, or messaging platforms like Slack. Setting up notifications ensures you stay informed about important events and can react promptly to market changes.

##  Analyze and Visualize Data

Use tools to visualize and analyze the data. This helps you see trends and make informed decisions about when tokens will be unlocked. Visualization tools can help you identify patterns and potential impacts on the market, aiding in strategic decision-making. In this section we will see how to track token unlock events for specific chains.

### Arbitrum Token Unlock

Arbitrum, a solution to help Ethereum scale better, has a schedule for when its tokens will be unlocked. Tracking these events helps investors predict market behavior and price impacts. By monitoring Arbitrum's token unlock schedule, investors can anticipate changes in token supply and adjust their strategies accordingly.
Link: https://ide.bitquery.io/Arbitrum-Token-Unlock_1

```graphql

query ($network: evm_network, $limit: Int, $method: String) {
 EVM(dataset: archive, network: $network) {
   Events(
     where: {Log: {Signature: {SignatureHash: {is: $method}}}}
     limit: {count: $limit}
     orderBy: {descending: Block_Time}
   ) {
     ChainId
     Transaction {
       Hash
     }
     Log {
       Signature {
         Name
       }
     }
     Fee {
       SenderFee
     }
     Block {
       Time
       Number
     }
   }
 }
}
{
 "limit": 10,
 "network": "arbitrum",
 "method": "c42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
}
```

### Optimism Token Unlock

Optimism, another solution to make Ethereum faster and cheaper, also has a token release schedule. Watching these events can provide insights into market liquidity and investor sentiment. Keeping an eye on Optimism's token unlocks helps investors stay informed about potential changes in market conditions and plan their trades effectively.


### Solana Token Unlock Schedule

Solana, known for its fast and cheap transactions, has important token unlock events. Tracking these can help understand its market dynamics and potential price movements.

Link: https://ide.bitquery.io/Solana-Token

```graphql
{
  Solana {
    Instructions(
      where: {Instruction: {Program: {Name: {is: "timelock"}}}}
      limit: {count: 10}
      orderBy: {descending: Block_Time}
    ) {
      Instruction {
        Accounts {
          Address
          IsWritable
          Token {
            Mint
            Owner
            ProgramId
          }
        }
        Program {
          AccountNames
          Address
          Name
          Method
        }
        Logs
      }
      Transaction {
        Signature
        Signer
      }
    }
  }
}
```

## Conclusion

Token lockups are becoming common in the cryptocurrency world. They help prevent price volatility and ensure long-term success for projects. This builds trust between investors and development teams.

However, choosing the right lockup structure is crucial. It should fit the project's goals and objectives. Tracking token locks and unlocks is essential for managing cryptocurrencies effectively. Bitquery APIs offer powerful tools to monitor these events, providing detailed data and customizable queries. By using Bitquery, investors and project teams can stay informed about token movements, make well-informed decisions, and maintain market confidence.
