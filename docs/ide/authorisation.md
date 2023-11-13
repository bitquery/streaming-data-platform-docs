---
sidebar_position: 2
---

### Guide for Managing OAuth2 Authorization Headers in Streaming API

**Introduction**

There are two primary approaches for managing OAuth2 authorization headers in the Streaming API: Simple Approach and Secure Approach.

![Page](/img/v2Access/tab.png)

**Simple Approach**

This approach is straightforward but less secure since the token remains static and is susceptible to theft or misuse.

**Steps:**

1.  Create a new application record with an unlimited expiration time.
2.  Generate an access token.
3.  Embed the access token directly into your application.
4.  Utilize the code generation feature in the IDE to obtain the code with the embedded token for your chosen programming language.

**Secure Approach**

This approach offers enhanced security as the token is refreshed periodically, limiting the potential impact of token theft or misuse.

**Steps:**

1.  Create a new application record with a limited expiration time, tailored to the application's logic and nature.
2.  Include code within the application to generate or regenerate access tokens, such as during each user session.
3.  Use the generated tokens to access the API from the application.

**Comparison of Approaches**

**Simple Approach**

Convenient, but less secure

Suitable for applications with a low risk of token theft or misuse

**Secure Approach**

More secure, but requires more effort to implement

Suitable for applications with a high risk of token theft or misuse

**Billing Considerations**

- Billing remains consistent across API v1 and v2.
- Purchase points once and utilize them for either v1 or v2 in any combination.

**Creating an Application**

1.  Go to the **Api-Key** page and click **Create application**.

    ![new](/img/v2Access/newApplication.png)

2.  Enter a name for your application and select an expiration time for the access tokens.
3.  Click **Create**.

**Generating an Access Token**

1.  Go to the **Applications** page and select the application for which you want to generate an access token.

    ![generate](/img/v2Access/generate.png)

2.  Click **Generate Access Token**.
3.  Copy the access token and store it in a secure location.

**Using an Access Token**

To use an access token, include it in the `Authorization` header of your API requests. For example:

```
Authorization: Bearer <access_token>

```

**Revoking an Access Token**

If you believe that your access token has been compromised, you can revoke it by clicking **Revoke** on the **Applications** page.

**Deleting an Application**

If you no longer need an application, you can delete it by clicking **Delete** on the **Applications** page.

**Short-term Access Tokens**

If you want to use short-term access tokens, you will need to generate them programmatically in your app and handle the expiration time yourself. Here is an example of how to generate a short-term access token using the Python SDK:



```Python
import requests

client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"

# Get a token
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
