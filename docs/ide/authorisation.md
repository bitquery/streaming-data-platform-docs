---
sidebar_position: 2
---

# Guide for Managing OAuth2 Authorization Headers in Streaming API

There are two primary approaches for managing OAuth2 authorization headers in the Streaming API:

**Simple Approach:**

1.  Create a new application record with an unlimited expiration time.
2.  Generate an access token.
3.  Embed the access token directly into your application.
4.  Utilize the code generation feature in the IDE to obtain the code with the embedded token for your chosen programming language.

This approach is straightforward but less secure since the token remains static and is susceptible to theft or misuse.

**Secure Approach:**

1.  Create a new application record with a limited expiration time, tailored to the application's logic and nature.
2.  Include code within the application to generate or regenerate access tokens, such as during each user session.
3.  Use the generated tokens to access the API from the application.

This approach offers enhanced security as the token is refreshed periodically, limiting the potential impact of token theft or misuse.

**Comparison of Approaches:**

-   The simple approach closely resembles the current API_KEY management used in V1, offering convenience but compromising security due to the static token.
    
-   The secure approach enables the creation of applications with frontends that access the API (e.g., for building dashboards) without exposing the application's secret. This is achieved by generating and using short-lived tokens.
    

**Billing Considerations:**

-   Billing remains consistent across API v1 and v2.
-   Purchase points once and utilize them for either v1 or v2 in any combination.
