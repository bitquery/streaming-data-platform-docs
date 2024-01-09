---
sidebar_position: 1
---

# Managing Authorization Headers in Streaming API - Simple Approach

Starting January 9, 2024, access to the V2 APIs will be restricted without the OAuth token.

**Introduction**

There are two primary approaches for managing OAuth2 authorization headers in the Streaming API: Simple Approach and Secure Approach.

![Page](/img/v2Access/tab.png)

**Simple Approach**

This approach is straightforward but less secure since the token remains static and is susceptible to theft or misuse.

**Creating an Application**

1.  Go to the [Applications](https://account.bitquery.io/user/applications) page and click **Create application**.

    ![new](/img/v2Access/newApplication.png)

2.  Enter a name for your application and select an expiration time for the access tokens.
3.  Click **Create**.

**Generating an Access Token**

1.  Go to the [API- Key](https://account.bitquery.io/user/api_key) page and select the application for which you want to generate an access token.

    ![generate](/img/v2Access/generate.png)

2.  Click **Generate Access Token**.
3.  Copy the access token and store it in a secure location.

![copy](/img/v2Access/copytoken.png)

**Using the token:**

To utilize the token you've copied from the API-KEY tab, use the code generation feature on your IDE to obtain the code in your preferred programming language. However, **remember to paste the token you've copied from the API-Key page**. This is necessary because the IDE code generator only displays temporary tokens.

![temporary](/img/v2Access/temporarytoken.png)

For example, you can include the token in the header as shown below:

```
Authorization: Bearer <access_token>

```

> **If you have no applications created, the `Bearer` token changes every 12 hours.**

**Revoking an Access Token**

If you believe that your access token has been compromised, you can revoke it by clicking **Revoke** on the **Applications** page.

![revoke](/img/v2Access/revoke.png)

**Deleting an Application**

If you no longer need an application, you can delete it by clicking **Delete** on the **Applications** page. All the tokens associated with the application will no longer work.

**Billing Considerations**

- Billing remains consistent across API v1 and v2.
- Purchase points once and utilize them for either v1 or v2 in any combination.
- Currently you are not charged for usage of V2 APIs. The exact billing date will be informed soon.
