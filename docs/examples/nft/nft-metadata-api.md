---
sidebar_position: 6
---

# NFT Metadata API

The NFT Metadata API retrieves the metadata of NFT.

## Get the Metadata of an NFT

Let see an example query that retrieves the metadata of an NFT based on its token ID and the smart contract address. It fetches the latest transfer of the NFT by ordering the results based on the block Number in descending order.

```graphql 
{
  EVM(dataset: archive, network: eth) {
    Transfers(
      where: {Transfer: {Currency: {SmartContract: {is: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"}}, Id: {eq: "4226"}}}
      limit: {count: 1, offset: 0}
      orderBy: {descending: Block_Number}
    ) {
      Transfer {
        Currency {
          SmartContract
          Name
          Decimals
          Fungible
          HasURI
          Symbol
        }
        Id
        URI
        Data
        owner: Receiver
      }
    }
  }
}

```

**Parameters**

-   `network` : Specifies the Ethereum network.
-   `dataset` : Indicates the [combined](/docs/graphql/dataset/combined) dataset to be used. 
-   `orderBy` : Orders the results in descending order based on the Block_Number.
-   `where` : This parameter specifies the conditions to filter the results by. In this case, the token ID is `4226` and the Currency with the Smart Contract being `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`.


**Returned Data**

-   `Currency {....}` :  Represent currency details.
-   `owner` : Specifies the address of the current owner of the NFT.
-   `URI`  : Represents the URL associated with the NFT.

You can find the graphql query [here](https://ide.bitquery.io/NFT-metadata_1_1).


## Get the Creator of an NFT

The Following query retrieves the Creator of the NFT.

```graphql 
{
  EVM(dataset: combined, network: eth) {
    Calls(
      limit: {count: 1}
      orderBy: {descending: Block_Time}
      where: {Call: {To: {is: "0x23581767a106ae21c074b2276d25e5c3e136a68b"}, Create: true}}
    ) {
      Call {
        creator: From
        Create
      }
      Transaction {
        Hash
      }
    }
  }
}

```

**Parameters**

-   `orderBy` : Orders the results in descending order based on the Block_Time.
-   `limit`  : Specifies the maximum results to return. In this query, the limit is 1.
-   `where` : It filters the results to include only calls made to the smart contract with the specified address `0x23581767a106ae21c074b2276d25e5c3e136a68b` and only includes create call.


**Returned Data**

-   `Call`:  The  `creator: From` field represent the address of the creator.
-   `Transaction` :  Represents hash of the transaction at which this NFT was created.

You can find the graphql query [here](https://ide.bitquery.io/Creator_of_an_NFT).

