---
sidebar_position: 8
---

# NFT Blur MarketPlace API

The NFT Blur Marketplace API provides a wide range of data related to the BLUR NFT Marketplace. With this API, We can access data on the latest traded NFTs, buy-sell activity of specific NFT tokens, top buyers of NFTs, specific buyer statistics for NFTs, NFT loan transactions, loan history, refinancing actions and much more.


## Latest Trades on Blur

The Blur Marketplace supports the [Seaport protocol](https://opensea.io/blog/articles/introducing-seaport-protocol), which can be utilize to retrieve the most recent Blur trades - [query](https://ide.bitquery.io/Latest-10-Trades-on-Blur).

```
query MyQuery {
  EVM {
    DEXTrades(
      limit: { offset: 0, count: 10 }
      orderBy: { descendingByField: "Block_Time" }
      where: {
        Trade: { Dex: { ProtocolName: { is: "seaport_v1.4" } } }
        Transaction: {
          To: { is: "0x39da41747a83aeE658334415666f3EF92DD0D541" }
        }
      }
    ) {
      Trade {
        Dex {
          ProtocolName
        }
        Buy {
          Price
          Seller
          Buyer
          Currency {
            HasURI
            Name
            Fungible
            SmartContract
          }
        }
        Sell {
          Price
          Amount
          Currency {
            Name
          }
          Buyer
          Seller
        }
      }
      Transaction {
        Hash
      }
      Block {
        Time
      }
    }
  }
}
```

**Parameters**

- `limit` : Specifies the number of results to return and the offset from where to start.
- `orderBy` : Organizes the results in descending order based on the block time.
- `where` : Filters results based on specific conditions. Here, it selects trades where the DEX protocol name is "seaport_v1.4" and the transaction 'To' address is set to the Blur Marketplace contract.

**Returned Data**

- `Trade` : Provides details about the trade including the DEX protocol name, and the buy and sell details such as price, seller, buyer, and currency information.
- `Transaction` : Contains the hash of the transaction associated with the trade.
- `Block` : Shows the block time when the trade occurred.

## Most Traded NFTs on Blur Marketplace

We can also identify the most traded NFT on the Blur Marketplace using this API. 

In the following [query](https://ide.bitquery.io/Most-traded-NFT-on-Blur-marketplace), we aggregate the data based on buyers, sellers, NFTs, and trade volume, and then sort the results based on the trade count. This highlights the most active NFTs in the marketplace.

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}}, Transaction: {To: {is: "0x39da41747a83aeE658334415666f3EF92DD0D541"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      tradeVol: sum(of: Trade_Buy_Amount)
      count
      buyers: count(distinct: Trade_Buy_Buyer)
      seller: count(distinct: Trade_Buy_Seller)
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

**Parameters**

- `where` : This filters out the trades where the DEX protocol name matches "seaport_v1.4", and the transaction is directed to the Blur Marketplace contract.
- `orderBy` : This arranges the results in a descending order according to the count of trades.
- `limit` : This confines the number of results to the top 10 most traded NFTs.

**Returned Data**

- `tradeVol` : Represents the total sum of trade buy amounts.
- `count` : Represents the number of trades for each NFT.
- `buyers` : Displays the count of distinct buyers involved in these trades.
- `sellers` : Displays the count of distinct sellers involved in these trades.
- `nfts` : Shows the count of distinct NFTs involved in the trades.
- `Trade` : Includes information about the trade, specifically the currency details from the buy side of the trade.


## Total Buy-Sell of an NFT Token on Blur

Here, the [query](https://ide.bitquery.io/Total-buy-sell-of-an-NFT-token-onBLUR) gather total trades, trade volume, unique buyers, and sellers for a specific NFT token on Blur Marketplace - in this case, the [Nakamigos NFT token](https://explorer.bitquery.io/ethereum/token/0xd774557b647330c91bf44cfeab205095f7e6c367).


```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {Trade: {Dex: {ProtocolName: {in: "seaport_v1.4"}}, Buy: {Currency: {Fungible: false, SmartContract: {is: "0xd774557b647330c91bf44cfeab205095f7e6c367"}}}}, Transaction: {To: {is: "0x39da41747a83aeE658334415666f3EF92DD0D541"}}}
      orderBy: {descendingByField: "count"}
      limit: {count: 10}
    ) {
      tradeVol: sum(of: Trade_Buy_Amount)
      count
      buyer: count(distinct: Trade_Buy_Buyer)
      seller: count(distinct: Trade_Buy_Seller)
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

**Parameters**

- `where` : 'Trade.Buy.Currency.Fungible' filters out the trades where the currency is non-fungible. 'Trade.Buy.Currency.SmartContract'  sets the smart contract address to match that of the Nakamigos NFT token.

**Returned Data**

- `nfts` : Shows the count of distinct Nakamigos NFT tokens involved in the trades.
- `Trade.Buy.Currency` : Includes information about the Nakamigos NFT token.

## Identifying Top NFT Buyers on Blur

In [this](https://ide.bitquery.io/Top-buyers-of-NFTs-onBLUR) query, we fetch the top buyers on the BLUR marketplace. We aggregate based on NFTs bought, unique transactions, and then sort them based on the number of trades

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Dex: { ProtocolName: { in: "seaport_v1.4" } }
          Buy: { Currency: { Fungible: false } }
        }
        Transaction: {
          To: { is: "0x39da41747a83aeE658334415666f3EF92DD0D541" }
        }
      }
      orderBy: { descendingByField: "count" }
      limit: { count: 10 }
    ) {
      count
      uniq_tx: count(distinct: Transaction_Hash)
      Block {
        first_date: Time(minimum: Block_Date)
        last_date: Time(maximum: Block_Date)
      }
      nfts: count(distinct: Trade_Buy_Ids)
      difffernt_nfts: count(distinct: Trade_Buy_Currency_SmartContract)
      total_money_paid: sum(of: Trade_Sell_Amount)
      Trade {
        Buy {
          Buyer
        }
      }
    }
  }
}
```
**Parameters**

- `where` : 'Trade.Buy.Currency.Fungible' filter makes sure to only consider non-fungible tokens in the trades.

**Returned Data**

- `uniq_tx` : Represents the number of unique transactions made by each buyer.
- `Block` : Shows the first and last dates of transactions made by each buyer.
- `nfts` : Provides a count of unique NFTs bought by each buyer.
- `difffernt_nfts` : Displays a count of different NFTs bought by each buyer.
- `total_money_paid` : The total amount of money paid by each buyer for their purchases.


## Specific Buyer stats for an NFT on Blur

In [this](https://ide.bitquery.io/Specific-buyer-stats-for-an-NFT-onBLUR) query, we are getting details for a specific address on Blur NFT marketplace. We are also getting the first and last trade dates for the address.

```
query MyQuery {
  EVM(dataset: combined, network: eth) {
    DEXTrades(
      where: {
        Trade: {
          Dex: { ProtocolName: { in: "seaport_v1.4" } }
          Buy: {
            Currency: {
              SmartContract: {
                is: "0xd774557b647330c91bf44cfeab205095f7e6c367"
              }
            }
            Buyer: { is: "0x9ba58eea1ea9abdea25ba83603d54f6d9a01e506" }
          }
        }
        Transaction: {
          To: { is: "0x39da41747a83aeE658334415666f3EF92DD0D541" }
        }
      }
      orderBy: { descendingByField: "count" }
      limit: { count: 10 }
    ) {
      count
      uniq_tx: count(distinct: Transaction_Hash)
      Block {
        first_date: Time(minimum: Block_Date)
        last_date: Time(maximum: Block_Date)
      }
      nfts: count(distinct: Trade_Buy_Ids)
      Trade {
        Buy {
          Buyer
          Currency {
            Name
            ProtocolName
            Symbol
            Fungible
            SmartContract
          }
        }
      }
    }
  }
}
```

**Parameters**

- `where` : 'Trade.Buy.Buyer' filters the trades made by a specific buyer. 'Trade.Buy.Currency.SmartContract' filters to include only the trades involving a specific NFT token.

**Returned Data**

- `uniq_tx` : Represents the number of unique transactions made by the buyer.
- `Block` : Shows the first and last dates of trades made by the buyer.
- `nfts` : Provides a count of unique NFTs bought by the buyer.

## Latest Loans taken on Blur

Blur uses [Blend protocol](https://www.paradigm.xyz/2023/05/blend) for NFT loans. We're can [fetch](https://ide.bitquery.io/Latest-Loans-taken-onBlur) recent loans on the BLUR market through "LoanOfferTaken" events tied to Blur : [Blend Contract](https://explorer.bitquery.io/ethereum/smart_contract/0x29469395eaf6f95920e59f858042f0e28d98a20b/events). 

We're using LogHeader instead of Log → SmartContract for queries due to a [delegated proxy contract](https://medium.com/coinmonks/proxy-pattern-and-upgradeable-smart-contracts-45d68d6f15da).


```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

- `where` : 'LogHeader.Address' points to the Blur Blend Contract where the loan events are recorded. 'Log.Signature.Name' sets the event name to "LoanOfferTaken" to filter for loan-taking events.

**Returned Data**

- `Block.Number` : Block number where the event is recorded.
- `Transaction.Hash` : Transaction hash corresponding to the loan event.
- `Log.SmartContract` : Provides the address of the smart contract that emitted the event.
- `Log.Signature` : Shows the name and signature of the event.
- `Arguments` : Details of the arguments associated with the event, gives valuable information like loan amount, borrower address, and more.

## Latest loans for specific NFT token

[This](https://ide.bitquery.io/Latest-loans-for-specific-NFTtoken) query retrieves all loans linked to the [MutantApeYachtClub](https://explorer.bitquery.io/ethereum/token/0x60e4d786628fea6478f785a6d7e704777c86a7c6) collection on the BLUR market. We filter event arguments in the smart contract and sort by block time

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
        Arguments: {
          includes: [
            {
              Name: { is: "collection" }
              Value: {
                Address: { is: "0x60e4d786628fea6478f785a6d7e704777c86a7c6" }
              }
            }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
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
    }
  }
}
```

**Parameters**

- `where` : 'LogHeader.Address' points to the Blur: Blend Contract. 'Log.Signature.Name' sets the event name to "LoanOfferTaken". 'Arguments.includes' filter specifically checks for a collection argument with an Address value corresponding to the MutantApeYachtClub NFT collection.

**Returned Data**

Same as previous queries, this query will return details about the block, transaction, log, and arguments. By modifying the 'Arguments.includes' filter, you can track loan activities for different NFT collections on the Blur marketplace.


## Latest Loans for a specific lender

Using argument filtering, [this](https://ide.bitquery.io/Latest-Loans-for-a-specificlender) query fetches the latest loans for a specific lender address. The same method can be applied to find loans for a specific borrower address - [query](https://ide.bitquery.io/Latest-Loans-for-a-specificborrower-on-Blur-marketplace).

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
        Arguments: {
          includes: [
            {
              Name: { is: "lender" }
              Value: {
                Address: { is: "0xfa0e027fcb7ce300879f3729432cd505826eaabc" }
              }
            }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
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
    }
  }
}
```

**Parameters**

- `where` : 'LogHeader.Address' directs to the Blur: Blend Contract. 'Log.Signature.Name' sets the event name to "LoanOfferTaken". 'Arguments.includes' filter looks for a lender argument with an Address value matching the specific lender's address.

**Returned Data**

Similar to previous queries, this query will provide details about the block, transaction, log, and arguments.

## Loans above a specific amount on the Blur NFT marketplace

If we want to track loans above a specific amount on the Blur marketplace, we can use the following [query](https://ide.bitquery.io/Loans-above-a-specific-amount-on-the-Blur-NFT-marketplace).

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
        Arguments: {
          includes: [
            {
              Name: { is: "loanAmount" }
              Value: { BigInteger: { gt: "3000000000000000000" } }
            }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
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
    }
  }
}
```

## Loan history for specific NFT ID

[This](https://ide.bitquery.io/Loan-history-for-specific-NFTID) query retrives the loan history for a specific NFT ID on the BLUR market, by matching event arguments to a particular collection address and tokenId.

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
        Arguments: {
          includes: [
            {
              Name: { is: "collection" }
              Value: {
                Address: { is: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b" }
              }
            }
            { Name: { is: "tokenId" }, Value: { BigInteger: { eq: "2662" } } }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
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
    }
  }
}
```

**Parameters** 
- `where` : 'LogHeader.Address' directs to the Blur: Blend Contract. 'Log.Signature.Name' sets the event name to "LoanOfferTaken". 'Arguments.includes' filter looks for collection argument matching a specific NFT collection address and tokenId argument equating to a specific NFT ID.

**Returned Data**

The response includes details about the block, transaction, log, and event arguments. By changing the values in 'Arguments.includes' you can query the loan history for different NFT IDs on the Blur marketplace.

## Get loan details for specific LienId

The Blur's Blend protocol utilizes LienID as a primary key to track individual loan details. [This](https://ide.bitquery.io/Get-loan-details-for-specificlienId) query fetches details for a specific LienID across different events.

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "LoanOfferTaken" } } }
        Arguments: {
          includes: [
            { Name: { is: "lienId" }, Value: { BigInteger: { eq: "40501" } } }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
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
    }
  }
}
```

**Parameters**

- `where` : 'Arguments.includes' filters for the lienId argument equating to a specific LienID.

**Returned Data**

The response will include details about the block, transaction, log, and event arguments. By adjusting the LienID in Arguments.includes, you can fetch loan details for various LienIDs on the Blur marketplace.


## Latest Loan Refinances on Blur

Refinancing in NFTs refers to securing a new loan using an NFT as collateral to repay an existing loan. The following [query](https://ide.bitquery.io/loan-refinance-on-Blur) retrieves the latest refinance events on BLUR.

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "Refinance" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

`where` : 'LogHeader.Address' sets the address to the Blur: Blend Contract. 'Log.Signature.Name' filters for the event name "Refinance".


## All Refinance loans for specific NFT

To retrieve all refinance loans for a specific NFT collection, we filter Refinance event arguments in [this](https://ide.bitquery.io/All-refinance-loans-for-specificNFT-collection) query

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "Refinance" } } }
        Arguments: {
          includes: [
            {
              Name: { is: "collection" }
              Value: {
                Address: { is: "0xed5af388653567af2f388e6224dc7c4b3241c544" }
              }
            }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

## Loan Repayments

For loan repayment transactions on the BLUR market, use the [following](https://ide.bitquery.io/Loan-repayment-of-blur-marketplace)  query. It filters 'Repay' events and sets the smart contract address to the Blur: Blend address

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "Repay" } } }
        Arguments: {
          includes: [
            { Name: { is: "lienId" }, Value: { BigInteger: { eq: "43662" } } }
          ]
        }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}

```

**Parameters**

- `where` : 'LogHeader.Address' sets the address to the Blur: Blend Contract. 'Log.Signature.Name' filters for the event name "Repay". 'Arguments.includes' Filters for the "lienId" argument to match a specific LienID.

**Returned Data**

The response contains details about the block, transaction, log, and arguments, allowing users to track loan repayment transactions associated with the specified LienID on the Blur marketplace.

## Auction Events

The 'StartAuction' event is triggered when an NFT auction starts on the  Blur : [Blend Contract](https://explorer.bitquery.io/ethereum/smart_contract/0x29469395eaf6f95920e59f858042f0e28d98a20b/events). The following [query]((https://ide.bitquery.io/Auction-on-blur-marketplace)) monitors these events. If you want to track auctions for a specific NFT, modify the [query]([query](https://ide.bitquery.io/Auctions-for-specific-lienID)) to filter for a specific LienID in the 'Arguments' field.

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "StartAuction" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

`where` : 'LogHeader.Address' sets the address to the Blur: Blend Contract. 'Log.Signature.Name' filters for the event name "StartAuction".


# Latest Locked NFTs Buy Trades

Locked NFTs are temporarily non-transferrable and can be traded or transferred after the lock period. These NFTs are often cheaper than non-locked. The following [query](https://ide.bitquery.io/Locked-NFT-bought-on-Blur-marketplace) retrieves the latest trades of locked NFTs by filtering for the 'BuyLocked' event under the Blur : [Blend Contract](https://explorer.bitquery.io/ethereum/smart_contract/0x29469395eaf6f95920e59f858042f0e28d98a20b/events). 


```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "BuyLocked" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

`where` : 'LogHeader.Address' sets the address to the Blur: Blend Contract. 'Log.Signature.Name' Filters for the event name "BuyLocked".

## Get Cancelled Offers

On the BLUR market, the 'OfferCancelled' event initiates when an offer is withdrawn or cancelled. The following [query](https://ide.bitquery.io/Latest-Cancelled-offers-on-Blur-NFT-marketplace) fetches recent 'OfferCancelled' events under the Blur : [Blend Contract](https://explorer.bitquery.io/ethereum/smart_contract/0x29469395eaf6f95920e59f858042f0e28d98a20b/events). 
.

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "OfferCancelled" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

- `where` : 'LogHeader.Address' sets the address to the Blur : Blend Contract. `Log.Signature.Name` filters for the event name "OfferCancelled".

## Get Seize Offers

When a seizure event happens, control of the NFT shifts to the lender or an enforcing third party. The  [query](https://ide.bitquery.io/Latest-Seized-NFTs-on-Blur-marketplace) filters transactions for the 'seize' event on the Blur : [Blend Contract](https://explorer.bitquery.io/ethereum/smart_contract/0x29469395eaf6f95920e59f858042f0e28d98a20b/events) to track these

```
{
  EVM(dataset: combined, network: eth) {
    Events(
      where: {
        LogHeader: {
          Address: { is: "0x29469395eaf6f95920e59f858042f0e28d98a20b" }
        }
        Log: { Signature: { Name: { is: "Seize" } } }
      }
      limit: { count: 10 }
      orderBy: { descending: Block_Time }
    ) {
      Block {
        Number
      }
      Transaction {
        Hash
      }
      Log {
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Index
        Type
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
    }
  }
}
```

**Parameters**

- `where`: 'LogHeader' filters the results where the Address matches the Blur: Blend contract address. 'Log' Further filters the results where the Name of Signature matches the "Seize" event.


**Returned Data**

- `Log` : Information about the event log, including the smart contract that emitted the event and the event's name and signature.
- `Arguments` : Details of the arguments passed in the event, including their names, indexes, types, and values.