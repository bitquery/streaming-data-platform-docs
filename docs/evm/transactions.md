---
title: Transactions API
---

<head>
<meta name="title" content="Transactions API"/>
<meta name="description" content="Get information on transaction details and wallets on EVM chains. Also, get information on blocks for tokens or NFTs on EVM chains."/>
<meta name="keywords" content=" api,  python api,  nft api,  scan api,  matic api,  api docs,  crypto api,  blockchain api,matic network api"/>
<meta name="robots" content="index, follow"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="language" content="English"/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Transactions API" />
<meta property="og:description" content="Get information on transaction details and wallets on EVM chains. Also, get information on blocks for tokens or NFTs on EVM chains." />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="Transactions API" />
<meta property="twitter:description" content="Get information on transaction details and wallets on  blockchain. Also, get blocks information for tokens or NFTs on EVM chains." />
</head>

The Transactions API provides detailed information on transactions including call count, gas, hash, type, and sender and recipient addresses etc. Here's a sample query to get started. You can see more examples [here](/docs/examples/transactions/transaction-api)



    query MyQuery {
      EVM(dataset: realtime, network: bsc) {
        Transactions(
          limit: {count: 10}
          orderBy: {descending: Block_Time}
          where: {Block: {Date: {after: "2023-02-05"}}}
        ) {
          Transaction {
            CallCount
            Gas
            Hash
            Type
            To
            From
          }
          Block {
            Date
          }
          TransactionStatus {
            Success
            FaultError
            EndError
          }
        }
      }
    }

### Parameters:

-   `limit`: Limits the number of transactions returned in the query. In this case, it is set to 10.
-   `orderBy`: Specifies the field to order the results by. In this case, it is ordered in descending order based on block time.
-   `where`: Filters the results based on specific criteria. In this case, it returns transactions that occurred after February 5, 2023.

### Returns:

-   `Transaction`: Contains information about the transaction, including call count, gas, hash, type, and sender and recipient addresses.
-   `Block`: Contains information about the block that the transaction was included in, including the date of the block.
-   `TransactionStatus`: Contains information about the transaction status, including whether it was successful, and if there were any errors.
