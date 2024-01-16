---
sidebar_position: 2
---

# Managing Authorization Headers in Streaming API - Secure Approach

Starting January 9, 2024, access to the V2 APIs will be restricted without the OAuth token.

**Introduction**

In this section we will focus on the secure approach.
Remember that this approach requires more effort to implement. It is suitable for applications with a high risk of token theft or misuse.

The secure approach expects you to programmatically generate an access token using your client ID and client secret of an application.

![client](/img/v2Access/clientid_secret.png)

Below is a code snippet in Python that shows you how to programmatically generate a token and use the API, replace the placeholders with actual information.

Ensure that `scope=api` is mentioned in the payload,

```
import requests
import json


def oAuth_example():

  url = "https://oauth2.bitquery.io/oauth2/token"

  payload = 'grant_type=client_credentials&client_id=YOUR_ID_HERE&client_secret=YOUR_SECRET_HERE&scope=api'

  headers = {'Content-Type': 'application/x-www-form-urlencoded'}

  response = requests.request("POST", url, headers=headers, data=payload)
  resp = json.loads(response.text)
  print(resp)
  access_token=resp['access_token']


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
