
# Token Holders API

The Token Holders API allows you to access information regarding token holders for both fungible (ERC20) and non-fungible (ERC721) tokens. This API provides access to current token holder data for a specific token, as well as historical information about token holders.

Let's explore some examples and discover how to use the Token Holders API.

## NFT Holders

If you need information about the holders of a specific NFTs, you can simply enter the contract address of the NFT in `tokenSmartContract` field. This will provide you with all the necessary details about the token holders.

## Total Token Holder Count

With the Token Holder API, you can retrieve the total number of token holders. By using the `uniq` field and getting unique `Holder_Address` values, you can find the number of token holders on a specific date.

In this example, we will obtain the token holder count for the [USDT token](https://explorer.bitquery.io/ethereum/token/0xdac17f958d2ee523a2206206994597c13d831ec7) on the [Ethereum](https://bitquery.io/blockchains/ethereum-blockchain-api). You can run this query directly within [our IDE](https://ide.bitquery.io/usdt-token-holder-count-using-token-holders-api).

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-21"
      tokenSmartContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      where: {Balance: {Amount: {gt: "0"}}}
    ) {
      uniq(of: Holder_Address)
    }
  }
}
```

## Token Balance of an address on particular date

You can find out how many tokens a specific token holder had on a specific date. To do this, simply update the `date` value with the date you're interested in. Run [this query](https://ide.bitquery.io/balance-of-token-holder-for-a-token-on-particular-date-using-token-holders-api) in the IDE to view the result.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-01"
      tokenSmartContract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
      where: {Holder: {Address: {is: "0x50d9090d6ce6307b7ec8904cd3dca17b4da56353"}}}
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

## Token Holders Over Time

As talked about earlier, the Token Holders API enables us to access token holder data for a specific token on any desired date. However, if you need to obtain token holder data over a range of dates or a specific timeframe, you'll need to make separate API calls, adjusting the date parameter accordingly. This way, you can get token holder information for the entire period you're interested in.

## Token Holder Activity

The Token Holders API offers the functionality to get information about the activity of token holders related to a specific token. Let's explore these activities which will give us insight into token holders behaviour.

### Count of Transactions for a Token from a Token Holder

If you're interested about how frequently an address has participated in transactions with a specific token, you can utilize the Token Holder API. For instance, here's an example that reveals the number of transactions involving Mutant Ape Yacht Club (MAYC NFT) from a specific wallet.

You can see the results by running [this query](https://ide.bitquery.io/Number-of-token-transaction-for-a-wallet) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
      where: {Holder: {Address: {is: "0x18f024244d0c41534c4fb77f958912f3aa403719"}}}
    ) {
      BalanceUpdate {
        transactions: Count
      }
      Holder {
        Address
      }
    }
  }
}
```

### First & Last Date of Transfer for a Token Holder

You can also retrieve the dates of the first and most recent times a token holder transferred a particular token using this API. The last date will be the most recent date when the holder made a transfer with that token.

You can access the results by running [this query](https://ide.bitquery.io/first-and-last-date-of-transfer-for-token-of-a-token-holder) in our IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
      where: {Holder: {Address: {is: "0x18f024244d0c41534c4fb77f958912f3aa403719"}}}
    ) {
      BalanceUpdate {
        FirstDate
        LastDate
      }
      Holder {
        Address
      }
    }
  }
}
```

### Amount In & Out for a Wallet

You can also find out the number of tokens that have been received by a wallet and the number of tokens that have been sent from it. Give [this query](https://ide.bitquery.io/Number-of-received-and-sent-tokens) a try in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
      where: {Holder: {Address: {is: "0x18f024244d0c41534c4fb77f958912f3aa403719"}}}
    ) {
      BalanceUpdate {
        InAmount
        OutAmount
      }
      Holder {
        Address
      }
    }
  }
}
```

## Top Token Holders for a Token

To find the top token holders, you can use the Token Holders API. This allows you to sort the data based on the token balance in descending order. You can achieve this by using the `orderBy` filter and sorting by the value of `Balance_Amount` in descending order.

In this example, we are going to find the top 10 token holders for the Mutant Ape Yacht Club (MAYC) NFT collection. Run [this query](https://ide.bitquery.io/top-token-holder-for-a-token-using-token-holders-api) on the IDE to see the result.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
      limit: {count: 10}
      orderBy: {descending: Balance_Amount}
    ) {
      Holder {
        Address
      }
      Balance {
        Amount
      }
    }
  }
}
```

## Token Holder with Certain Number of Tokens

You can use the Balance filter to find token holders who hold a specific value of tokens. For example, you can find Moonbirds NFT token holders who hold more than 50 NFTs in their wallet. To see the results, try [this query](https://ide.bitquery.io/count-of-token-holders-above-certain-value-using-token-holders-api) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0x23581767a106ae21c074b2276D25e5C3e136a68b"
      where: {Balance: {Amount: {ge: "50"}}}
    ) {
      uniq(of: Holder_Address)
    }
  }
}
```

Here's another example. In this case, we are getting the number of token holders whose token balance exceeds 1 million USDT tokens (~ $1 million). We used aliases to categorize token holders based on the tokens stored in their wallets. For further information on aliases, you can refer to [this page](/docs/graphql/metrics/alias/).

Feel free to execute [this query](https://ide.bitquery.io/USDT-token-holder-distribution) in the IDE to delve into the data.
```
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      where: {Balance: {Amount: {ge: "0"}}}
    ) {
      classic: count(
        distinct: Holder_Address
        if: {Balance: {Amount: {gt: "1000000"}}}
      )
      pro: count(
        distinct: Holder_Address
        if: {Balance: {Amount: {gt: "100000", le: "1000000"}}}
      )
      growing: count(
        distinct: Holder_Address
        if: {Balance: {Amount: {gt: "1000", le: "100000"}}}
      )
    }
  }
}
```

## Top Trending Tokens Based on Token Holders

To get data related to token holders, you can also the Balance Updates API. In this example, we will write a query to get the top 10 trending tokens based on their holders on the Ethereum network. You can see the results by running [this query](https://ide.bitquery.io/Trending_Token_based_on_holders) in the IDE.

```
query MyQuery {
  EVM(network: eth, dataset: combined) {
    BalanceUpdates(
      where: {
        Block: { Date: { since: "2023-06-01" } }
        BalanceUpdate: { Amount: { gt: "0" } }
      }
      orderBy: { descendingByField: "No_Holders" }
      limit: { count: 10 }
    ) {
      No_Holders: count(distinct: BalanceUpdate_Address)
      Currency {
        Name
        SmartContract
      }
    }
  }
}
```

## Common Token Holders of Two Tokens

Let's say if we want to know common tokens holders of two tokens, we can use BalanceUpdate API. In the following example we will get common token holder of [Bored Ape Yacht Club](https://boredapeyachtclub.com/#/) and [Mutant Ape Yacht Club](https://opensea.io/collection/mutant-ape-yacht-club) NFT tokens. You can run [this query](https://ide.bitquery.io/Common-token-holder-Bored-Ape-Yacht-Club-and-Mutant-Ape-Yacht-Club) in the IDE to see the result.

```
{
  EVM(dataset: archive) {
    BalanceUpdates(
      orderBy: {descendingByField: "token1"}
      limit: {count: 1000}
      where: {Currency: {SmartContract: {in: ["0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", "0x60e4d786628fea6478f785a6d7e704777c86a7c6"]}}}
    ) {
      BalanceUpdate {
        Address
      }
      token1: sum(
        of: BalanceUpdate_Amount
        if: {Currency: {SmartContract: {is: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}}}
        selectWhere: {gt: "0"}
      )
      token2: sum(
        of: BalanceUpdate_Amount
        if: {Currency: {SmartContract: {is: "0x60e4d786628fea6478f785a6d7e704777c86a7c6"}}}
        selectWhere: {gt: "0"}
      )
    }
  }
}
```

## Token Holder Statistics

The Token Holders API provides statistics about token holders. To explore the various statistics available, please visit [this page](/docs/graphql/metrics/statistics/). 

### Average Balance of Token Holder

To calculate the average balance of USDT token holders, you can use the Token Holders API. Use the `average` field and select `Balance_Amount`. You can test [this query](https://ide.bitquery.io/avg-usdt-balance-on-ethereum-using-token-holders-api) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      where: {Balance: {Amount: {ge: "0"}}}
    ) {
      average(of: Balance_Amount)
    }
  }
}
```

### Median Balance of Token Holder

To find the median balance, use the median function and select Balance_Amount. Test [this query](https://ide.bitquery.io/median-balance-of-usdt-holders-on-ethereum-with-token-holders-api) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      where: {Balance: {Amount: {ge: "0"}}}
    ) {
      median(of: Balance_Amount)
    }
  }
}
```

## Token Liquidation: Finding Complete Holdings Transfers

Here's an example that demonstrates how to use the query to identify users who have completely transferred all of their DAI token holdings on March 22, 2023. You can access the query [here](https://ide.bitquery.io/addresses-that-transferred-out-all-of-their-holdings-for-this-particular-token-on-a-given-day)
Identifying users who are liquidating their holdings of a particular token.

```
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      limit: {count: 100}
      tokenSmartContract: "0xdac17f958d2ee523a2206206994597c13d831ec7"
      date: "2023-03-22"
      where: {
        BalanceUpdate: {
          LastDate: {
            is: "2023-03-22"
          }
          OutAmount: {
            gt: "0"
          }
        }
        Balance: {
          Amount: {
            eq: "0"
          }
        }
      }
    ) {
    	Holder {
        Address
      }
      BalanceUpdate {
        OutAmount
      }
    }
	}
}
```

## Gini Coefficient

With the Token Holders API, you can calculate the Gini coefficient for a token. For example, you can find the Gini coefficient for the USDC token using [this query](https://ide.bitquery.io/gini-coefficient-for-usdc-token-on-ethereum-with-token-holders-api) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      where: {Balance: {Amount: {gt: "0"}}}
    ) {
      gini(of: Balance_Amount)
    }
  }
}
```

## Nakamoto Coefficient

You can also calculate the Nakamoto Coefficient using the Token Holders API for any token. As an example, you can find the Nakamoto coefficient for the stETH token by trying [this query](https://ide.bitquery.io/nakamoto-coefficient-for-steth-token-on-ethereum-with-token-holders-api) in the IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      where: {Balance: {Amount: {gt: "0"}}}
    ) {
      nakamoto(of: Balance_Amount, ratio: 0.99)
    }
  }
}
```

## Thiel Index

If you need the Thiel index of a token, you can obtain it using the Token Holders API. Experiment with [this query](https://ide.bitquery.io/thiel-index-for-steth-token-on-ethereum-with-token-holders-api) in your IDE.

```graphql
{
  EVM(dataset: archive, network: eth) {
    TokenHolders(
      date: "2023-10-22"
      tokenSmartContract: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      where: {Balance: {Amount: {gt: "0"}}}
    ) {
      theil_index(of: Balance_Amount)
    }
  }
}
```

