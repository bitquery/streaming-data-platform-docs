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

**Steps:**

1.  Embed the access token directly into your application. You can find the access token on IDE, as shown below

![token example](/static/img/v2Access/token_example.png)

2.  Utilize the code generation feature in the IDE to obtain the code with the embedded token for your chosen programming language.



**Billing Considerations**

- Billing remains consistent across API v1 and v2.
- Purchase points once and utilize them for either v1 or v2 in any combination.



**Using an Access Token**

To use an access token, include it in the `Authorization` header of your API requests. For example:

```
Authorization: Bearer <access_token>

```



