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

**Revoking an Access Token**

If you believe that your access token has been compromised, you can revoke it by clicking **Revoke** on the **Applications** page.

![revoke](/img/v2Access/revoke.png)

**Deleting an Application**

If you no longer need an application, you can delete it by clicking **Delete** on the **Applications** page.


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


oAuth_example()
```


