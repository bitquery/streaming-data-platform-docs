---
title: "Usage API - Track Billing and Quota Programmatically"
description: "OAuth2-authenticated Usage API on account.bitquery.io. Check billing period, plan limits, and current usage with GET /api/usage."
sidebar_position: 4
keywords: ["Bitquery Usage API", "Bitquery billing API", "API quota", "OAuth2", "account.bitquery.io", "usage tracking"]
---

<head>
<meta name="title" content="Usage API - Track Billing and Quota Programmatically"/>
<meta name="description" content="OAuth2-authenticated Usage API on account.bitquery.io. Check billing period, plan limits, and current usage with GET /api/usage."/>
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Bitquery Usage API"/>
<meta property="twitter:card" content="summary_large_image"/>
<meta property="twitter:title" content="Bitquery Usage API"/>
</head>

# Usage API

The **Usage API** exposes OAuth2-authenticated endpoints on [account.bitquery.io](https://account.bitquery.io/) so you can **programmatically track billing period status, plan limits, and consumption** for your Bitquery account.

Open the interactive reference and copy a bearer token from **[Authorization → Usage API](https://account.bitquery.io/user/api)**. To create or manage tokens, see [How to Generate a Token](/docs/authorization/how-to-generate/).

:::caution Keep your token secret
Authenticate every request with your account bearer token in the `Authorization` header. The token identifies your account — do not expose it in client-side code, public repos, or logs.
:::

## Authentication

Send your account bearer token on every request:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://account.bitquery.io/api/usage
```

Replace `YOUR_ACCESS_TOKEN` with a token from [Access tokens](https://account.bitquery.io/user/api_v2/access_tokens) or the token shown on the [Usage API](https://account.bitquery.io/user/api) page. Token format is typically `ory_at_...` with an expiration date.

## Billing plan usage

**`GET /api/usage`**

Returns your **current billing period** — its plan, limits, usage recorded against them, and an overall status.

- **Team members** receive their **team manager's** billing period (`payer_id` is the manager's account id).
- When no period is active, the **most recent** period is returned instead.

### Period status

| Status | Description |
| --- | --- |
| **`active`** | The period currently covers the present time. |
| **`grace`** | The period ended but is still within the grace window. |
| **`blocked`** | The period or account is blocked. |
| **`expired`** | The period ended and the grace window has passed. |

### Response fields

| Field | Type | Description |
| --- | --- | --- |
| `account_id` | integer | Your account id. |
| `payer_id` | integer | Account that owns the billing period — the team manager for team members, otherwise the same as `account_id`. |
| `status` | string | `active`, `grace`, `blocked`, or `expired` (see above). |
| `billing_period.started_at` | datetime | Period start (ISO 8601, UTC). |
| `billing_period.ended_at` | datetime | Period end (ISO 8601, UTC). |
| `billing_period.plan_name` | string | Display name of the plan. |
| `billing_period.product` | object \| null | Linked product as `{ "name": "..." }`, or `null` when the period has no product (e.g. free plans). Use `plan_name` for a label that is always present. |
| `billing_period.limits` | object | Plan limits: `points_limit`, `rate_limit`, `session_limit`, `subscription_limit`, `time_sec_limit`, `traffic_bytes_limit`, `team_slots_limit`. |
| `billing_period.usage` | object | Usage so far this period: `points_usage`, `requests_usage`, `time_sec_usage`, `traffic_bytes_usage`. |
| `billing_period.description` | object | Full raw period description (all plan attributes). |

### Example response

```json
{
  "account_id": 12345,
  "payer_id": 12345,
  "status": "active",
  "billing_period": {
    "started_at": "2026-06-24T00:00:00Z",
    "ended_at": "2026-07-23T23:59:59Z",
    "plan_name": "Paid plan",
    "product": null,
    "limits": {
      "points_limit": 100000000000,
      "rate_limit": 10000,
      "session_limit": 1000,
      "subscription_limit": 1000,
      "time_sec_limit": 0,
      "traffic_bytes_limit": 0,
      "team_slots_limit": 5
    },
    "usage": {
      "points_usage": 4458,
      "requests_usage": 184,
      "time_sec_usage": 301,
      "traffic_bytes_usage": 3763747
    },
    "description": {
      "points_limit": 100000000000,
      "rate_limit": 10000,
      "session_limit": 1000,
      "subscription_limit": 1000
    }
  }
}
```

## Example: Python

```python
import requests

ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"

response = requests.get(
    "https://account.bitquery.io/api/usage",
    headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
)
response.raise_for_status()

data = response.json()
period = data["billing_period"]

print(f"Status: {data['status']}")
print(f"Plan: {period['plan_name']}")
print(f"Points used: {period['usage']['points_usage']} / {period['limits']['points_limit']}")
print(f"Requests: {period['usage']['requests_usage']}")
```
