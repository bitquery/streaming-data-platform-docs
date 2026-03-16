---
title: "How to Use Bitquery API Token - Authorization Examples"
description: "Use your Bitquery OAuth token in API requests: header Bearer token or URL token parameter. Python, JavaScript, and cURL examples for streaming.bitquery.io."
sidebar_position: 2
keywords: ["Bitquery API token", "Bitquery authorization", "OAuth token usage", "Bearer token", "API authentication"]
---

<head>
<meta name="title" content="How to Use Bitquery API Token - Authorization Examples"/>
<meta name="description" content="Use your Bitquery OAuth token in API requests: Bearer header or URL parameter. Python, JavaScript, and cURL examples."/>
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="How to Use Bitquery API Token"/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="How to Use Bitquery API Token"/>
</head>

# How to Use a Token

Regardless of how you obtain your token, whether generated directly in the IDE or using a client ID-secret combination, the process for using the token remains consistent.

- You mention the token in the headers like this `'Authorization': f'Bearer {access_token}'`
  OR

- You attach the token in the URL `https://streaming.bitquery.io/graphql?token=ory_at_...`

For the `wss` endpoint, the 2nd method is the only way, read more [here](https://docs.bitquery.io/docs/authorisation/websocket/)

Below is an example in Python that mentions the token in the header.

```
import requests
import json


def oAuth_example():

  //access_token generated using either of the two approaches


  # Step 2: Make Streaming API query
  url_graphql = "https://streaming.bitquery.io/graphql"
  headers_graphql = {
      'Content-Type': 'application/json',
      'Authorization': f'Bearer {access_token}'
  }

  graphql_query = '''
  {
    EVM(mempool: true, network: eth) {
      DEXTrades(limit: {count: 10}) {
        Transaction {
          Hash
        }
        Trade {
          Buy {
            Amount
            Currency {
              Name
            }
            Buyer
          }
          Sell {
            Amount
            Currency {
              Name
            }
            Buyer
          }
        }
      }
    }
  }
  '''

  payload_graphql = json.dumps({'query': graphql_query})

  # Step 3: Make request to Streaming API
  response_graphql = requests.post(url_graphql, headers=headers_graphql, data=payload_graphql)

  # Print the response
  print(response_graphql.text)


oAuth_example()
```

Remember to replace `{access_token}` with your actual access token.
