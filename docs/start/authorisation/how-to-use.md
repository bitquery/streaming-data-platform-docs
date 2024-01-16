---
sidebar_position: 2
---

# How to Use a Token


Regardless of how you obtain your token—whether generated directly in the IDE or using a client ID-secret combination—the process for using the token remains consistent. 

- You mention the token in the headers like this `'Authorization': f'Bearer {access_token}'`
- You attach the token in the URL `https://streaming.bitquery.io/graphql?token=ory_at_...`

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