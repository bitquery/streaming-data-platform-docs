---
sidebar_position: 2
---

# Managing OAuth2 Authorization Headers in Streaming API - Secure Approach

Starting January 9, 2024, access to the V2 APIs will be restricted without the OAuth token.

**Introduction**

In this section we will focus on the secure approach.
Remember that this approach requires more effort to implement. It is suitable for applications with a high risk of token theft or misuse.

The secure approach expects you to programmatically generate the access token usiing your client ID and client secret of an application.

![client](/img/v2Access/clientid_secret.png)


**Short-term Access Tokens**

If you want to use short-term access tokens, you will need to generate them programmatically in your app and handle the expiration time yourself. Read more on access tokens and refresh tokens [here](https://oauth.net/2/access-tokens/)

Here is an example of how to generate a short-term access token using the Python SDK:

```Python
import requests

client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"

# Get a refresh token
response = requests.post(
    "https://oauth2.bitquery.io/oauth2/token",
    auth=(client_id, client_secret),
    data={
        "grant_type": "client_credentials",
    },
)
token = response.json()["access_token"]

# Generate a short-term token
response = requests.post(
    "https://streaming.bitquery.io/graphql",
    headers={"Authorization": f"Bearer {token}"},
    json={"expires_in": 3600},
)
short_term_token = response.json()["token"]

```
