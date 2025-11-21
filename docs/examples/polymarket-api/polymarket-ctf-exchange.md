---
title: "Polymarket CTF Exchange API"
description: "Learn how to query Polymarket CTF Exchange: Get token registrations, order fills, calculate market prices. Track OrderFilled, OrderMatched, TokenRegistered events to get Polymarket trading data and prices."
keywords:
  - Polymarket CTF Exchange
  - Polymarket prices API
  - how to get Polymarket prices
  - Polymarket trades API
  - TokenRegistered
  - OrderMatched
  - OrderFilled
  - Polymarket trading data
  - calculate Polymarket prices
  - Polymarket order filled
  - prediction market trading
  - conditional token trading
  - Polymarket asset ID
  - Polymarket token0 token1
---

# Polymarket CTF Exchange API - How to Get Prices and Trades

Learn how to query Polymarket CTF Exchange to get real-time prices, trading data, and token registrations. This guide shows you how to calculate Polymarket market prices from OrderFilled events and track all trading activity.

The Polymarket CTF Exchange is Polymarket's trading venue, where users buy and sell ERC-1155 outcome tokens created by the CTF contract. This exchange handles trading of conditional tokens with AMM and orderbook logic.

## Contract Addresses

| Contract | Address | Status |
|----------|---------|--------|
| **CTF Exchange (Current)** | `0xC5d563A36AE78145C45a50134d48A1215220f80a` | NegRisk multi-outcome markets |
| **CTF Exchange (Legacy)** | `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E` | Binary markets (legacy) |

## Contract Overview

This is Polymarket's trading venue, where users buy and sell the ERC-1155 outcome tokens created by the CTF contract.

**What it does:**
- Handles OrderMatched, OrderFilled, TokenRegistered events
- Settles trades: swaps outcome tokens ↔ USDC.e collateral
- Integrates with off-chain orderbook APIs (RFQ or AMM)
- Enforces pricing, slippage, and liquidity provider logic

**Think of it as:** The "exchange layer" that gives the conditional tokens a live market.

## Key Events

The Polymarket CTF Exchange has 3 major events that enable all trading:

### 1. TokenRegistered

The `TokenRegistered` event gets emitted when a new AssetId gets created because a position split occurs. This is very similar to new pools getting created on an AMM.

**TokenRegistered has 3 fields:**
- Token0
- Token1
- Condition ID

**Emitted When:**
- A new trading pair is registered for a condition
- Position split creates new outcome tokens that need to be traded
- Similar to liquidity pool creation on AMMs

### 2. OrderMatched

The `OrderMatched` event is emitted when orders are successfully matched between counterparties.

**Emitted When:**
- Buy and sell orders are matched
- Trade execution occurs on-chain or through relayers
- Used for tracking trading volume and activity

### 3. OrderFilled

The `OrderFilled` event tracks individual order fills and partial executions.

**Emitted When:**
- An order is filled (fully or partially)
- Used for detailed trade analysis and price discovery
- Contains price and amount information for calculating market prices

## How to Calculate Polymarket Prices

### Price Calculation Formula (from OrderFilled Events)

Learn how to calculate Polymarket market prices from `OrderFilled` events. This is the standard method to get real-time YES/NO prices for any Polymarket market.

Once you have the OrderFilled event for a condition, use this formula:

**Price (YES) = USDC paid / YES tokens received**

or equivalently:

**Price (NO) = 1 - Price(YES)**

**Example**: If a trade shows 1000 USDC paid for 2000 YES tokens, the price is 1000/2000 = 0.5 USDC per YES token (50 cents).

### Important: Decimal Normalization


- **USDC**: Has 6 decimals. Divide by `10^6` (1,000,000) to get human-readable USDC
- **Outcome Tokens**: Typically have 18 decimals. Divide by `10^18` to get human-readable tokens

**Correct Price Calculation**:
```python
# Raw amounts from blockchain (in smallest units)
usdc_paid_raw = 1000000  # 1 USDC in smallest units
tokens_received_raw = 2000000000000000000  # 2 tokens in smallest units

# Normalize to human-readable units
usdc_normalized = usdc_paid_raw / 1e6  # = 1.0 USDC
tokens_normalized = tokens_received_raw / 1e18  # = 2.0 tokens

# Calculate price
price = usdc_normalized / tokens_normalized  # = 0.5 USDC per token
```

### OrderFilled Event Structure

The `OrderFilled` event contains these key fields:

- **makerAssetId**: Asset ID that maker is giving (0 = USDC, otherwise = outcome token)
- **takerAssetId**: Asset ID that taker is giving (0 = USDC, otherwise = outcome token)
- **makerAmountFilled** or **makerAmount**: Amount maker is giving (in smallest units)
- **takerAmountFilled** or **takerAmount**: Amount taker is giving (in smallest units)
- **maker**: Maker wallet address
- **taker**: Taker wallet address

**Identifying USDC vs Tokens**:
- If `makerAssetId == "0"` or `0`, maker is giving USDC
- If `takerAssetId == "0"` or `0`, taker is giving USDC
- The non-zero asset ID is the outcome token (YES or NO token)

**Python Implementation Example**:
```python
def calculate_price_from_order_filled(event):
    """Calculate price from OrderFilled event."""
    args = {arg["Name"]: arg["Value"] for arg in event.get("Arguments", [])}
    
    # Extract asset IDs
    maker_asset_id = extract_value(args.get("makerAssetId"))
    taker_asset_id = extract_value(args.get("takerAssetId"))
    
    # Identify USDC (asset ID = "0")
    maker_is_usdc = str(maker_asset_id).strip() == "0"
    taker_is_usdc = str(taker_asset_id).strip() == "0"
    
    # Get amounts (try multiple field name variations)
    maker_amount = extract_value(
        args.get("makerAmountFilled") or 
        args.get("makerAmount") or 
        args.get("makerFillAmount")
    )
    taker_amount = extract_value(
        args.get("takerAmountFilled") or 
        args.get("takerAmount") or 
        args.get("takerFillAmount")
    )
    
    # Determine which side is USDC
    if maker_is_usdc:
        usdc_paid_raw = maker_amount
        tokens_received_raw = taker_amount
        outcome_asset_id = taker_asset_id
    elif taker_is_usdc:
        usdc_paid_raw = taker_amount
        tokens_received_raw = maker_amount
        outcome_asset_id = maker_asset_id
    else:
        return None  # Can't determine without USDC
    
    # Normalize amounts
    usdc_normalized = usdc_paid_raw / 1e6  # USDC: 6 decimals
    tokens_normalized = tokens_received_raw / 1e18  # Tokens: 18 decimals
    
    # Calculate price
    if tokens_normalized > 0:
        price = usdc_normalized / tokens_normalized
        return {
            "price": price,
            "asset_id": outcome_asset_id,
            "usdc_paid": usdc_normalized,
            "tokens_received": tokens_normalized
        }
    return None
```

## Practical Trading Implementation

### Setup and Configuration

Before using the trading tools, configure your environment:

**1. Install Dependencies**:
```bash
pip install -r requirements.txt
```

**2. Create `.env` file**:
```env
# Required: Bitquery API token
OAUTH_TOKEN=your_bitquery_oauth_token

# Optional: For executing trades
PRIVATE_KEY=your_wallet_private_key
POLYGON_RPC_URL=https://polygon-rpc.com

# Contract addresses (defaults provided)
CTF_EXCHANGE_ADDRESS=0xC5d563A36AE78145C45a50134d48A1215220f80a
LEGACY_EXCHANGE_ADDRESS=0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E
```

**3. Get Bitquery API Token**:
- Sign up at [Bitquery.io](https://bitquery.io)
- Navigate to API settings
- Generate an OAuth token
- Add it to your `.env` file

### Using the Polymarket Copy Trading Tool

This codebase provides a complete implementation for querying Polymarket trades and calculating prices. Here's how to use it:

#### 1. Track Recent Trades

```python
from bitquery_client import BitqueryClient
from position_tracker import PositionTracker

# Initialize
client = BitqueryClient()
tracker = PositionTracker(client)

# Get recent trades
positions = tracker.get_recent_positions(limit=20)

for pos in positions:
    print(f"Asset: {pos.asset_id}")
    print(f"Price: ${pos.price:.4f}")  # Already normalized
    print(f"Amount: {pos.amount:.4f}")  # Already normalized
    print(f"Trader: {pos.trader_address}")
    print(f"Time: {pos.timestamp}")
```

#### 2. Track Specific Trader

```python
# Monitor a specific trader's positions
trader_address = "0x1234..."
positions = tracker.track_trader(trader_address, limit=50)

# Calculate trader statistics
summary = tracker.get_trader_summary(trader_address)
print(f"Total Volume: ${summary['total_volume']:.2f}")
print(f"Average Price: ${summary['avg_price']:.4f}")
```

#### 3. Calculate Market Price for Asset

```python
# Get current market price for a specific asset ID
asset_id = "39182227286566757926769923857730776203547401708661426564300709353277001600667"
price = tracker.calculate_market_price(asset_id)

if price:
    print(f"Current Price: ${price:.4f}")
    print(f"Implied Probability: {price * 100:.2f}%")
```

#### 4. Copy a Position

```python
from copy_trader import CopyTrader

# Initialize copy trader
copy_trader = CopyTrader(tracker)

# Get positions for an asset
positions = tracker.get_positions_by_asset(asset_id)
latest_position = max(positions, key=lambda p: p.timestamp)

# Simulate copying the position (2x multiplier)
result = copy_trader.copy_position(latest_position, multiplier=2.0, execute=False)
sim = result.get("simulation", {})

print(f"Amount to buy: {sim['amount']:.4f} tokens")
print(f"Price: ${sim['price']:.4f}")
print(f"Total Cost: ${sim['total_cost']:.2f} USDC")
```

#### 5. Query OrderFilled Events Directly

```python
from bitquery_client import BitqueryClient

client = BitqueryClient()

# Query by asset IDs
asset_ids = [
    "39182227286566757926769923857730776203547401708661426564300709353277001600667"
]
events = client.get_order_filled_events(limit=100, asset_ids=asset_ids)

# Query by trader address
trader_address = "0x1234..."
events = client.get_order_filled_events(limit=50, trader_address=trader_address)

# Query recent events (last 24 hours)
events = client.get_order_filled_events(limit=20, since_hours=24)
```

### Key Implementation Details

**Decimal Handling**: The `PositionTracker` class automatically handles decimal normalization:
- USDC amounts are normalized from 6 decimals
- Token amounts are normalized from 18 decimals
- All prices and amounts in `Position` objects are already in human-readable format

**Event Parsing**: The `parse_order_filled_event()` method handles:
- Multiple field name variations (`makerAmountFilled`, `makerAmount`, etc.)
- USDC identification (asset ID = "0")
- Price calculation with proper normalization
- Trader address extraction

**Price Calculation**: Prices are calculated as:
```python
usdc_normalized = usdc_paid_raw / 1e6
tokens_normalized = tokens_received_raw / 1e18
price = usdc_normalized / tokens_normalized
```

### Understanding OrderFilled Event Data

**Raw Event Structure** (from Bitquery API):
```json
{
  "Arguments": [
    {
      "Name": "makerAssetId",
      "Value": {
        "bigInteger": "0"  // or outcome token asset ID
      }
    },
    {
      "Name": "takerAssetId",
      "Value": {
        "bigInteger": "39182227286566757926769923857730776203547401708661426564300709353277001600667"
      }
    },
    {
      "Name": "makerAmountFilled",
      "Value": {
        "bigInteger": "1000000"  // 1 USDC in smallest units (6 decimals)
      }
    },
    {
      "Name": "takerAmountFilled",
      "Value": {
        "bigInteger": "2000000000000000000"  // 2 tokens in smallest units (18 decimals)
      }
    },
    {
      "Name": "maker",
      "Value": {
        "address": "0x1234..."
      }
    },
    {
      "Name": "taker",
      "Value": {
        "address": "0x5678..."
      }
    }
  ],
  "Block": {
    "Time": "2024-01-01T12:00:00Z",
    "Number": 12345678
  },
  "Transaction": {
    "Hash": "0xabc...",
    "From": "0x5678..."
  }
}
```

**Parsed Position Object** (after processing):
```python
Position(
    asset_id="39182227286566757926769923857730776203547401708661426564300709353277001600667",
    trader_address="0x5678...",
    amount=2.0,  # Normalized tokens
    price=0.5,   # USDC per token (normalized)
    direction="YES",
    timestamp=datetime(2024, 1, 1, 12, 0, 0),
    tx_hash="0xabc...",
    block_number=12345678
)
```

**Key Points**:
- Raw amounts are always integers (bigInteger) in smallest units
- Asset ID "0" always represents USDC
- The trader is the one receiving outcome tokens (buying)
- Prices are calculated and normalized automatically

## How to Query Polymarket CTF Exchange Events

Learn how to query Polymarket trading data, get token registrations, track orders, and calculate prices. These queries show you how to access all CTF Exchange contract events.

### 1. Token Registered Events

**Endpoint**: [PolyMarket CTF Exchange Contract - TokenRegistered Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----TokenRegistered-Event)

Track when new outcome tokens are registered for trading. This event is emitted when new AssetIds are created because position splits occur.

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 6}}},
        Arguments: {
          includes: {
            Name: {is: "conditionId"}, 
            Value: {Bytes: {is: "CONDITION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["TokenRegistered"]}}}, 
        LogHeader: {Address: {is: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"}}
      }
      limit: {count: 10}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**Use Case**:
- Monitor new trading pairs
- Build token registries
- Track market expansion
- Discover new markets as they become tradeable

**Registration Data**:
- Token addresses and metadata (Token0, Token1)
- Market associations (Condition ID)
- Trading parameters

**Note**: Replace `CONDITION_ID_HERE` with the actual condition ID you want to query. This condition ID can be found in `ConditionPreparation` events from the Main Polymarket Contract.

### 2. Orders Matched Events

**Endpoint**: [PolyMarket CTF Exchange Contract - OrdersMatched Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderMatched-Event_2)

Monitor successful order matching and trade executions.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log: {Signature: {Name: {in: ["OrdersMatched"]}}}, 
        LogHeader: {Address: {is: "0xC5d563A36AE78145C45a50134d48A1215220f80a"}}
      }
      limit: {count: 20}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**Use Case**:
- Track trading volume and activity
- Analyze price discovery
- Calculate market metrics
- Monitor market liquidity

**Match Data**:
- Order details and participants
- Trade amounts and prices
- Market identifiers
- Execution timestamps

### 3. Order Filled Events

**Endpoint**: [PolyMarket CTF Exchange Contract - OrderFilled Event](https://ide.bitquery.io/Polymarket-Neg-Risk-CTF-Exchange-contract----OrderFilled-Event)

Track individual order fills and partial executions. Use this to calculate current market prices.

**Key Fields for Trading**:
- `makerAssetId`: Asset ID maker is giving (0 = USDC, otherwise = outcome token)
- `takerAssetId`: Asset ID taker is giving (0 = USDC, otherwise = outcome token)
- `makerAmountFilled` or `makerAmount`: Amount in smallest units (USDC: 6 decimals, tokens: 18 decimals)
- `takerAmountFilled` or `takerAmount`: Amount in smallest units
- `maker`: Maker wallet address
- `taker`: Taker wallet address

**Note**: The codebase handles both current and legacy exchange addresses automatically.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Log: {Signature: {Name: {in: ["OrderFilled"]}}}, 
        LogHeader: {Address: {is: "0xC5d563A36AE78145C45a50134d48A1215220f80a"}}
      }
      limit: {count: 20}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Receipt {
        ContractAddress
      }
      Topics {
        Hash
      }
      TransactionStatus {
        Success
      }
      LogHeader {
        Address
        Index
        Data
      }
      Transaction {
        Hash
        From
        To
      }
      Log {
        EnterIndex
        ExitIndex
        Index
        LogAfterCallIndex
        Pc
        SmartContract
        Signature {
          Name
          Signature
        }
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```


**Fill Data**:
- Order IDs and fill amounts
- Price execution details
- Maker/taker information
- Fee calculations

**Field Name Variations**:
The codebase handles multiple possible field names for amounts:
- `makerAmountFilled`, `makerAmount`, `makerFillAmount`, `makerFilledAmount`
- `takerAmountFilled`, `takerAmount`, `takerFillAmount`, `takerFilledAmount`, `fillAmount`, `amount`

This ensures compatibility with different event structures and API versions.

### 4. Order Filled by Asset IDs

Query orders using specific asset IDs. Asset IDs can be obtained from `TokenRegistered` events.

```graphql
{
  EVM(dataset: realtime, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Arguments: {
          includes: {
            Value: {
              BigInteger: {
                in: [
                  "39182227286566757926769923857730776203547401708661426564300709353277001600667",
                  "114636268124494503037490860756604355363103779670431653896732128698851479935310"
                ]
              }
            }
          }
        }, 
        Log: {Signature: {Name: {in: ["OrderFilled"]}}}, 
        LogHeader: {
          Address: {
            in: [
              "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
              "0xC5d563A36AE78145C45a50134d48A1215220f80a"
            ]
          }
        }
      }
      limit: {count: 100}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
        }
      }
    }
  }
}
```

**Use Case**:
- Track trading activity for specific markets
- Calculate prices for specific outcome tokens
- Monitor liquidity for particular asset pairs

**How to Use**:
Replace the asset IDs in the `BigInteger` array with the actual asset IDs you want to query. These can be obtained from `TokenRegistered` events.

## Workflow: Finding Market Data

This workflow shows how to discover newly registered tokens and retrieve their associated question metadata. The process starts by finding newly registered tokens from `TokenRegistered` events, then uses two additional queries to get the complete question metadata through the condition ID and question ID relationships.

### Step 1: Get Condition ID from TokenRegistered

Query `TokenRegistered` events to find the condition ID for a market:

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {Time: {since_relative: {days_ago: 6}}},
        Log: {Signature: {Name: {in: ["TokenRegistered"]}}}, 
        LogHeader: {Address: {is: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"}}
      }
      limit: {count: 10}
    ) {
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

### Step 2: Get Question ID from ConditionPreparation

Use the condition ID to query `ConditionPreparation` events from the Main Polymarket Contract to get the question ID. See the [Main Polymarket Contract documentation](./main-polymarket-contract.md) for details.

### Step 3: Get Question Metadata from UMA Adapter

Use the question ID to query `QuestionInitialized` events from the UMA Adapter contract to get the question metadata (ancillaryData). See the [UMA Adapter Contract documentation](./uma-adapter-contract.md) for details.

```graphql
{
  EVM(dataset: combined, network: matic) {
    Events(
      orderBy: {descending: Block_Time}
      where: {
        Block: {
          Time: {
            since_relative: {hours_ago: 36}
          }
        }, 
        Arguments: {
          includes: {
            Name: {is: "questionID"}, 
            Value: {Bytes: {is: "QUESTION_ID_HERE"}}
          }
        }, 
        Log: {Signature: {Name: {in: ["QuestionInitialized"]}}}, 
        LogHeader: {Address: {is: "0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7"}}
      }
      limit: {count: 1}
    ) {
      Block {
        Time
        Number
        Hash
      }
      Transaction {
        Hash
        From
        To
      }
      TransactionStatus {
        Success
      }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
        }
      }
    }
  }
}
```

### Step 4: Decode Ancillary Data

The `ancillaryData` field in `QuestionInitialized` events contains hex-encoded market question metadata. Decode it to get human-readable market information.

#### Decoding Process

The `ancillaryData` is stored as a hex string and needs to be decoded to UTF-8 to extract the market question details.

**Python Example:**

```python
def decode_ancillary_data(hex_string):
    """
    Decode ancillaryData hex string to UTF-8 text.
    
    Args:
        hex_string: Hex string from ancillaryData field (without 0x prefix)
    
    Returns:
        Decoded text containing market question metadata
    """
    # Remove 0x prefix if present
    if hex_string.startswith('0x'):
        hex_string = hex_string[2:]
    
    # Decode hex to bytes, then to UTF-8 string
    decoded_text = bytes.fromhex(hex_string).decode("utf-8")
    return decoded_text

# Example usage
ancillary_data_hex = "713a207469746c653a205370726561643a20536f75746865726e204d69737320476f6c64656e204561676c657320282d322e35292c206465736372697074696f6e3a20496e20746865207570636f6d696e67204342422067616d652c207363686564756c656420666f72204e6f76656d626572203320617420363a33303020504d2045543a0a0a54686973206d61726b65742077696c6c207265736f6c766520746f2022536f75746865726e204d69737320476f6c64656e204561676c6573222069662074686520536f75746865726e204d69737320476f6c64656e204561676c65732077696e207468652067616d652062792033206f72206d6f726520706f696e74732e0a0a4f74686572776973652c2074686973206d61726b65742077696c6c207265736f6c766520746f202242756666616c6f2042756c6c73222e200a0a54686520726573756c742077696c6c2062652064657465726d696e6564206261736564206f6e207468652066696e616c2073636f726520696e636c7564696e6720616e79206f76657274696d6520706572696f64732e0a0a4966207468652067616d6520697320706f7374706f6e65642c2074686973206d61726b65742077696c6c2072656d61696e206f70656e20756e74696c207468652067616d6520686173206265656e20636f6d706c657465642e204966207468652067616d652069732063616e63656c656420656e746972656c792c2077697468206e6f206d616b652d75702067616d652c2074686973206d61726b65742077696c6c207265736f6c76652035302d35302e206d61726b65745f69643a20363630323236207265735f646174613a2070313a20302c2070323a20312c2070333a20302e352e20576865726520703120636f72726573706f6e647320746f2042756666616c6f2042756c6c732c20703220746f20536f75746865726e204d69737320476f6c64656e204561676c65732c20703320746f20756e6b6e6f776e2f35302d35302e2055706461746573206d61646520627920746865207175657374696f6e2063726561746f7220766961207468652062756c6c6574696e20626f61726420617420307836353037304245393134373734363044384137416545623934656639326665303536433266324137206173206465736372696265642062792068747470733a2f2f706f6c79676f6e7363616e2e636f6d2f74782f3078613134663031623131356334393133363234666333663530386639363066346465613235323735386537336332386635663037663865313964376263613036362073686f756c6420626520636f6e736964657265642e2c696e697469616c697a65723a39313433306361643264333937353736363439393731376661306436366137386438313465356335"

decoded = decode_ancillary_data(ancillary_data_hex)
print(decoded)
```

**JavaScript/TypeScript Example:**

```javascript
function decodeAncillaryData(hexString) {
  // Remove 0x prefix if present
  const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  
  // Convert hex to bytes, then to UTF-8 string
  const bytes = Buffer.from(hex, 'hex');
  return bytes.toString('utf-8');
}

// Example usage
const ancillaryDataHex = "713a207469746c653a205370726561643a20536f75746865726e204d69737320476f6c64656e204561676c657320282d322e35292c...";
const decoded = decodeAncillaryData(ancillaryDataHex);
console.log(decoded);
```

#### Decoded Data Structure

The decoded `ancillaryData` contains structured market information in a text format. Here's the typical structure:

| Field | Description | Usage |
|-------|-------------|-------|
| `title` | Short market question | Display in UI, used by indexers |
| `description` | Defines resolution conditions | Used by UMA oracle for resolution |
| `market_id` | Polymarket numeric ID | Links UI to Oracle bridge |
| `res_data` | Payout mapping | Used by CTF payout logic |
| `p1`, `p2`, `p3` | Outcome labels | Used by traders and oracles |
| `initializer` | Market creator address | Used by UMA adapter |
| `bulletin board address` | Update contract address | Oracle reference for updates |
| `transaction link` | Proof of creation | Used for dispute validation |

**Example Decoded Output:**

```
q: title: Spread: Southern Miss Golden Eagles (-2.5), description: In the upcoming CBB game, scheduled for November 3 at 6:30 PM ET:

This market will resolve to "Southern Miss Golden Eagles" if the Southern Miss Golden Eagles win the game by 3 or more points.

Otherwise, this market will resolve to "Buffalo Bulls". 

The result will be determined based on the final score including any overtime periods.

If the game is postponed, this market will remain open until the game has been completed. If the game is canceled entirely, with no make-up game, this market will resolve 50-50. market_id: 660226 res_data: p1: 0, p2: 1, p3: 0.5. Where p1 corresponds to Buffalo Bulls, p2 to Southern Miss Golden Eagles, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7 as described by https://polygonscan.com/tx/0xa14f01b115c49136246fc3f508f960f64dea252758e73c28f5f07e8e19d7bca066 should be considered.,initializer:91430cad2d3975766499717fa0d66a78d814e5c5
```

#### Parsing the Decoded Data

The decoded text follows a structured format that can be parsed to extract individual fields:

```python
import re

def parse_ancillary_data(decoded_text):
    """
    Parse decoded ancillaryData to extract structured fields.
    
    Returns a dictionary with parsed fields.
    """
    parsed = {}
    
    # Extract title
    title_match = re.search(r'title:\s*([^,]+)', decoded_text)
    if title_match:
        parsed['title'] = title_match.group(1).strip()
    
    # Extract description
    desc_match = re.search(r'description:\s*([^m]+?)(?=market_id:)', decoded_text, re.DOTALL)
    if desc_match:
        parsed['description'] = desc_match.group(1).strip()
    
    # Extract market_id
    market_id_match = re.search(r'market_id:\s*(\d+)', decoded_text)
    if market_id_match:
        parsed['market_id'] = market_id_match.group(1)
    
    # Extract res_data
    res_data_match = re.search(r'res_data:\s*([^\.]+)', decoded_text)
    if res_data_match:
        parsed['res_data'] = res_data_match.group(1).strip()
    
    # Extract outcome labels (p1, p2, p3)
    p1_match = re.search(r'p1:\s*([^,]+)', decoded_text)
    p2_match = re.search(r'p2:\s*([^,]+)', decoded_text)
    p3_match = re.search(r'p3:\s*([^,]+)', decoded_text)
    
    if p1_match:
        parsed['p1'] = p1_match.group(1).strip()
    if p2_match:
        parsed['p2'] = p2_match.group(1).strip()
    if p3_match:
        parsed['p3'] = p3_match.group(1).strip()
    
    # Extract initializer
    init_match = re.search(r'initializer:([a-f0-9]+)', decoded_text)
    if init_match:
        parsed['initializer'] = '0x' + init_match.group(1)
    
    return parsed
```

### Step 5: Query Trading Activity

Use the asset IDs from `TokenRegistered` events to query `OrderFilled` events and calculate current market prices. See the [Order Filled Events](#3-order-filled-events) and [Order Filled by Asset IDs](#4-order-filled-by-asset-ids) queries above for examples.

## Integration with Other Contracts

### Finding Condition ID

The `TokenRegistered` event contains a `conditionId` field that links to the `ConditionPreparation` event in the Main Polymarket Contract. This allows you to:

1. Track when new markets become tradeable
2. Link trading activity to market conditions
3. Get question metadata through the condition → question ID relationship

### Price Discovery

Use `OrderFilled` events to calculate real-time market prices:

- **Price (YES) = USDC paid / YES tokens received**
- **Price (NO) = 1 - Price(YES)**

This provides accurate pricing data for prediction market analytics and trading applications.

## Best Practices for Trading

### Price Calculation
- **Always normalize decimals**: USDC uses 6 decimals, tokens use 18 decimals
- **Use latest OrderFilled events**: Most recent trades reflect current market prices
- **Handle multiple field names**: The API may return `makerAmountFilled`, `makerAmount`, or other variations
- **Identify USDC correctly**: Asset ID "0" (string or integer) represents USDC

### Trading Workflow
1. **Discover Markets**: Query `TokenRegistered` events to find new tradeable markets
2. **Get Asset IDs**: Extract asset IDs from TokenRegistered events for YES/NO tokens
3. **Track Prices**: Query `OrderFilled` events filtered by asset IDs
4. **Calculate Prices**: Normalize amounts and calculate `price = USDC / tokens`
5. **Monitor Traders**: Track specific wallet addresses to identify successful trading patterns
6. **Copy Trades**: Use calculated prices to execute copy trades with position multipliers

## Code Examples

### Complete Trading Example

```python
from bitquery_client import BitqueryClient
from position_tracker import PositionTracker
from copy_trader import CopyTrader

# 1. Initialize components
client = BitqueryClient()
tracker = PositionTracker(client)
copy_trader = CopyTrader(tracker)

# 2. Get recent trades
print("Fetching recent trades...")
positions = tracker.get_recent_positions(limit=10)

# 3. Analyze each position
for pos in positions:
    print(f"\n{'='*60}")
    print(f"Asset ID: {pos.asset_id}")
    print(f"Price: ${pos.price:.4f}")
    print(f"Amount: {pos.amount:.4f} tokens")
    print(f"Total Value: ${pos.amount * pos.price:.2f} USDC")
    print(f"Trader: {pos.trader_address}")
    print(f"Time: {pos.timestamp}")
    
    # 4. Calculate market price
    market_price = tracker.calculate_market_price(pos.asset_id)
    if market_price:
        print(f"Current Market Price: ${market_price:.4f}")
        print(f"Implied Probability: {market_price * 100:.2f}%")
    
    # 5. Simulate copying the trade
    result = copy_trader.copy_position(pos, multiplier=1.0, execute=False)
    if result.get("success"):
        sim = result.get("simulation", {})
        print(f"Copy Trade Cost: ${sim.get('total_cost', 0):.2f} USDC")
```

### Track and Copy Trader Example

```python
# Monitor a successful trader and copy their trades
trader_address = "0x1234..."  # Replace with actual trader address

# Get trader's recent positions
positions = tracker.track_trader(trader_address, limit=20)

# Get trader statistics
summary = tracker.get_trader_summary(trader_address)
print(f"Trader Summary:")
print(f"  Total Positions: {summary['total_positions']}")
print(f"  Total Volume: ${summary['total_volume']:.2f}")
print(f"  Average Price: ${summary['avg_price']:.4f}")
print(f"  Unique Assets: {summary['unique_assets']}")

# Copy all positions with 0.5x multiplier
for position in positions:
    result = copy_trader.copy_position(position, multiplier=0.5, execute=False)
    if result.get("success"):
        sim = result.get("simulation", {})
        print(f"Copied: {sim['amount']:.4f} tokens @ ${sim['price']:.4f}")
```

### Price Monitoring Example

```python
# Monitor price for a specific market
asset_id = "39182227286566757926769923857730776203547401708661426564300709353277001600667"

# Get all recent positions for this asset
positions = tracker.get_positions_by_asset(asset_id)

if positions:
    # Sort by timestamp (most recent first)
    positions.sort(key=lambda p: p.timestamp, reverse=True)
    
    # Get latest price
    latest_price = positions[0].price
    print(f"Latest Price: ${latest_price:.4f}")
    
    # Calculate average price
    avg_price = sum(p.price for p in positions) / len(positions)
    print(f"Average Price (last {len(positions)} trades): ${avg_price:.4f}")
    
    # Price trend
    if len(positions) > 1:
        price_change = latest_price - positions[-1].price
        print(f"Price Change: ${price_change:.4f} ({price_change/latest_price*100:.2f}%)")
```

## Additional Resources

- [Polymarket API Overview](./polymarket-api.md)
- [Main Polymarket Contract](./main-polymarket-contract.md)
- [UMA Adapter Contract](./uma-adapter-contract.md)
- [Bitquery GraphQL API Documentation](https://docs.bitquery.io/)
- [DEX Trading Data Documentation](https://docs.bitquery.io/docs/evm/dextrades/)
- [Polymarket Copy Trading Tool GitHub Repository](https://github.com/your-repo/polymarket-copytrade)

