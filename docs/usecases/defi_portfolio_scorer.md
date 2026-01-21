# DeFi Portfolio Scorer

This guide demonstrates how to build a DeFi Portfolio Scorer tool that analyzes Ethereum wallet address and calculates a DeFi Strategy Score based on transaction patterns, protocol interactions, and asset holdings using Bitquery APIs.

GitHub Repository: [Defi-Portfolio-Profiler](https://github.com/Akshat-cs/Defi-Portfolio-Profiler)

<img src="/img/usecases/defi_portfolio_profiler.png" />

## Overview

The DeFi Portfolio Scorer is a Python-based analysis tool built with Bitquery APIs that calculates a DeFi Strategy Score (ranging from 25-100) for Ethereum wallet addresses. The score is based on four key pillars that measure different aspects of DeFi engagement:

### Four Pillars of DeFi Strategy Score

1. **P1: Transaction Count** - Measures overall wallet activity
   - 0-10 transactions = 0 points
   - 100+ transactions = 100 points
   - Linear interpolation between 10 and 100

2. **P2: Transaction Types** - Measures diversity of DeFi activities
   - 1 type = 0 points
   - 5+ types = 100 points
   - Linear interpolation between 1 and 5
   - Activity types include: Lending, Staking, Liquidity, Bridging, Yield Farming, ERC-20 Trading, NFT Trading

3. **P3: Protocols Used** - Measures ecosystem engagement
   - 1 protocol = 0 points
   - 8+ protocols = 100 points
   - Linear interpolation between 1 and 8
   - Tracks interactions with major DeFi protocols (Aave, Compound, Uniswap, Lido, RocketPool, Yearn, Convex, etc.)

4. **P4: Assets Held** - Measures portfolio diversity
   - 1 asset = 0 points
   - 15+ assets = 100 points
   - Linear interpolation between 1 and 15
   - Counts ERC-20 tokens with balance ≥ $10 USD and individual NFTs

### Score Calculation

**Formula**: `25 (Base Score) + (Average Pillar Score × 0.75)`

The final score ranges from 25 (minimum) to 100 (maximum), providing a comprehensive assessment of a wallet's DeFi engagement level.

### Features

- **Real-time Analysis**: Uses Bitquery APIs to fetch live blockchain data
- **Comprehensive Metrics**: Analyzes transaction history, protocol interactions, and asset holdings
- **Parallel Query Execution**: Optimized performance using concurrent API calls
- **Modern Web Interface**: Clean, minimal UI with detailed score breakdown
- **Command Line Interface**: Terminal-based tool for quick analysis
- **Recent Wallets Cache**: Tracks up to 5 recently analyzed wallets

## Prerequisites

1. **Python 3.7+** installed on your system
2. **Bitquery API Token** - Get your API token [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
3. Basic understanding of Ethereum blockchain and DeFi protocols

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Akshat-cs/Defi-Portfolio-Profiler
cd Defi-Portfolio-Profiler
```

2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Set up your API key:

   - Copy `.env.sample` to `.env`:
   ```bash
   cp .env.sample .env
   ```

   - Edit `.env` and replace `your_api_key_here` with your actual Bitquery API key:
   ```
   BITQUERY_API_KEY=BQ_your_actual_api_key_here
   ```

## Project Structure

The project consists of two main files:

- **`defi_tracker.py`**: Core analysis logic with GraphQL queries, scoring algorithms, and Bitquery API client
- **`app.py`**: Flask web application that provides the UI and API endpoints

## How It Works

The tool uses multiple GraphQL queries from Bitquery APIs (both v1 and v2) to analyze wallet behavior:

1. **Transaction Count Query (P1)**: Fetches total transaction count from the last 3 years
2. **Protocol Interactions Query (P2/P3)**: Identifies smart contract calls to major DeFi protocols
3. **DEX and NFT Activity Query**: Detects DEX swaps and NFT trading activity
4. **Asset Holdings Query (P4)**: Retrieves ERC-20 token balances (≥ $10) and NFT holdings

### Code Walkthrough

#### 1. Bitquery Client

The tool uses a custom `BitqueryClient` class to interact with Bitquery APIs:

```python
class BitqueryClient:
    """Client for interacting with Bitquery GraphQL API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }
    
    def execute_query(self, query: str, variables: Optional[Dict] = None, endpoint: Optional[str] = None) -> Tuple[Dict, float]:
        """Execute a GraphQL query and return result with timing"""
        payload = {
            "query": query,
            "variables": variables or {}
        }
        
        endpoint = endpoint or BITQUERY_ENDPOINT_V2
        
        start_time = time.time()
        response = requests.post(
            endpoint,
            json=payload,
            headers=self.headers,
            timeout=200
        )
        response.raise_for_status()
        data = response.json()
        
        elapsed_time = time.time() - start_time
        return data.get("data", {}), elapsed_time
```

#### 2. P1: Transaction Count Query

Fetches the total number of transactions sent by the address in the last 3 years:

```python
def get_p1_transaction_count(client: BitqueryClient, address: str, time_3yr_ago: str) -> Tuple[int, float]:
    """Get transaction count for P1 using v1 API"""
    query = """
    query MyQuery($address: String, $time3yr_ago: ISO8601DateTime) {
      ethereum {
        transactions(
          txSender: {is: $address}
          time: {since: $time3yr_ago}
        ) {
          count
        }
      }
    }
    """
    
    variables = {
        "address": address,
        "time3yr_ago": time_3yr_ago
    }
    
    data, elapsed_time = client.execute_query(query, variables, endpoint=BITQUERY_ENDPOINT_V1)
    count = data.get("ethereum", {}).get("transactions", [{}])[0].get("count", 0)
    return int(count) if count else 0, elapsed_time
```

#### 3. P2/P3: Protocol Interactions Query

Identifies smart contract calls to major DeFi protocols and categorizes them:

```python
def get_p2_p3_data(client: BitqueryClient, address: str, time_3yr_ago: str) -> Tuple[Set[str], Set[str], float]:
    """Get transaction types and protocols for P2 and P3 using v1 API"""
    query = """
    query MyQuery($time3yr_ago: ISO8601DateTime, $protocols: [String!], $address: String) {
      ethereum(network: ethereum) {
        smartContractCalls(
          txFrom: {is: $address}
          smartContractAddress: {in: $protocols}
          time: {since: $time3yr_ago}
        ) {
          smartContract {
            address {
              address
            }
          }
          txc: count
        }
      }
    }
    """
    
    variables = {
        "address": address,
        "protocols": ALL_PROTOCOL_ADDRESSES,  # List of major DeFi protocol addresses
        "time3yr_ago": time_3yr_ago
    }
    
    data, elapsed_time = client.execute_query(query, variables, endpoint=BITQUERY_ENDPOINT_V1)
    
    interacted_protocols = set()
    activity_types = set()
    
    calls = data.get("ethereum", {}).get("smartContractCalls", [])
    for call in calls:
        protocol_address = call.get("smartContract", {}).get("address", {}).get("address", "")
        if protocol_address:
            protocol_address_lower = protocol_address.lower()
            interacted_protocols.add(protocol_address_lower)
            
            # Categorize by protocol type
            if any(addr.lower() == protocol_address_lower for addr in PROTOCOL_ADDRESSES["lending"]):
                activity_types.add("Lending")
            elif any(addr.lower() == protocol_address_lower for addr in PROTOCOL_ADDRESSES["staking"]):
                activity_types.add("Staking")
            elif any(addr.lower() == protocol_address_lower for addr in PROTOCOL_ADDRESSES["liquidity"]):
                activity_types.add("Liquidity")
            elif any(addr.lower() == protocol_address_lower for addr in PROTOCOL_ADDRESSES["bridging"]):
                activity_types.add("Bridging")
            elif any(addr.lower() == protocol_address_lower for addr in PROTOCOL_ADDRESSES["yield_farming"]):
                activity_types.add("Yield Farming")
    
    return activity_types, interacted_protocols, elapsed_time
```

The tool tracks major DeFi protocols organized by category:
- **Lending**: Aave (v2, v3), Compound (v2, v3), Sparklend, Morpho
- **Staking**: Lido, RocketPool
- **Liquidity**: Uniswap V3
- **Bridging**: Across, Stargate
- **Yield Farming**: Yearn Finance, Convex Finance

#### 4. DEX and NFT Activity Query

Detects DEX swaps and NFT trading using the v2 API:

```python
def get_dex_and_nft_activity(client: BitqueryClient, address: str) -> Tuple[int, int, Set[str], float]:
    """Get DEX swaps and NFT trading activity using v2 API"""
    query = """
    query TraderDexMarketsEvm($network: evm_network!, $trader: String!) {
      EVM(network: $network) {
        DEXTradeByTokens(
          where: {
            TransactionStatus: {Success: true}
            Block: {Time: {since_relative: {years_ago: 3}}}
            any: [
              {Trade: {Seller: {is: $trader}}}
              {Trade: {Buyer: {is: $trader}}}
            ]
          }
        ) {
          dex_count_fungible: count(
            distinct: Trade_Dex_ProtocolName
            if: {Trade: {Currency: {Fungible: true}}}
          )
          dex_count_nonfungible: count(
            distinct: Trade_Dex_ProtocolName
            if: {Trade: {Currency: {Fungible: false}}}
          )
        }
      }
    }
    """
    
    variables = {"network": "eth", "trader": address}
    data, elapsed_time = client.execute_query(query, variables, endpoint=BITQUERY_ENDPOINT_V2)
    
    trades = data.get("EVM", {}).get("DEXTradeByTokens", [{}])[0]
    dex_count_fungible = int(trades.get("dex_count_fungible", "0") or 0)
    dex_count_nonfungible = int(trades.get("dex_count_nonfungible", "0") or 0)
    
    # Add activity types based on counts
    if dex_count_fungible > 0:
        activity_types.add("ERC-20 Trading")
    if dex_count_nonfungible > 0:
        activity_types.add("NFT Trading")
    
    return dex_count_fungible, dex_count_nonfungible, dex_protocols, elapsed_time
```

#### 5. P4: Asset Holdings Query

Retrieves ERC-20 tokens with balance ≥ $10 and NFT holdings:

```python
def get_p4_assets(client: BitqueryClient, address: str) -> Tuple[int, float]:
    """Get unique assets count for P4 (ERC-20 > $10 + NFTs) using v2 API"""
    # ERC-20 tokens query
    erc20_query = """
    query MyQuery($address: String) {
      EVM(network: eth, dataset: combined) {
        BalanceUpdates(
          orderBy: {descendingByField: "Balance_usd"}
          where: {
            BalanceUpdate: {Address: {is: $address}}
            Currency: {Fungible: true}
          }
        ) {
          Currency {
            Name
            Symbol
            SmartContract
          }
          Balance: sum(of: BalanceUpdate_Amount selectWhere: {gt: "0"})
          Balance_usd: sum(of: BalanceUpdate_AmountInUSD selectWhere: {ge: "10"})
        }
      }
    }
    """
    
    # NFT balances query
    nft_query = """
    query MyQuery($address: String) {
      EVM(dataset: combined, network: eth) {
        BalanceUpdates(
          where: {
            BalanceUpdate: {Address: {is: $address}}
            Currency: {Fungible: false}
          }
          orderBy: {descendingByField: "balance"}
        ) {
          Currency {
            Name
            Symbol
            SmartContract
          }
          balance: sum(of: BalanceUpdate_Amount)
        }
      }
    }
    """
    
    unique_assets = set()
    nft_count = 0
    
    # Get ERC-20 tokens (only count those with Balance_usd >= $10)
    erc20_data, _ = client.execute_query(erc20_query, {"address": address}, endpoint=BITQUERY_ENDPOINT_V2)
    balances = erc20_data.get("EVM", {}).get("BalanceUpdates", [])
    for balance in balances:
        balance_usd = balance.get("Balance_usd")
        if balance_usd:  # Only if >= $10
            contract = balance.get("Currency", {}).get("SmartContract", "")
            if contract:
                unique_assets.add(contract)
    
    # Get NFTs (count individual NFTs, not collections)
    nft_data, _ = client.execute_query(nft_query, {"address": address}, endpoint=BITQUERY_ENDPOINT_V2)
    nft_balances = nft_data.get("EVM", {}).get("BalanceUpdates", [])
    for nft_balance in nft_balances:
        balance_str = nft_balance.get("balance", "0")
        try:
            balance_value = int(float(balance_str))
            nft_count += balance_value
        except (ValueError, TypeError):
            pass
    
    # Total assets = ERC-20 tokens + individual NFT count
    total_assets = len(unique_assets) + nft_count
    return total_assets, total_time
```

#### 6. Score Calculation Functions

Each pillar has a dedicated scoring function:

```python
def calculate_p1_score(tx_count: int) -> float:
    """Calculate P1 score based on transaction count"""
    if tx_count <= 10:
        return 0.0
    if tx_count >= 100:
        return 100.0
    # Linear interpolation between 10 and 100
    return min(100.0, ((tx_count - 10) / (100 - 10)) * 100.0)

def calculate_p2_score(unique_types: int) -> float:
    """Calculate P2 score based on unique transaction types"""
    if unique_types <= 1:
        return 0.0
    if unique_types >= 5:
        return 100.0
    # Linear interpolation between 1 and 5
    return min(100.0, ((unique_types - 1) / (5 - 1)) * 100.0)

def calculate_p3_score(unique_protocols: int) -> float:
    """Calculate P3 score based on unique protocols used"""
    if unique_protocols <= 1:
        return 0.0
    if unique_protocols >= 8:
        return 100.0
    # Linear interpolation between 1 and 8
    return min(100.0, ((unique_protocols - 1) / (8 - 1)) * 100.0)

def calculate_p4_score(unique_assets: int) -> float:
    """Calculate P4 score based on unique assets held"""
    if unique_assets <= 1:
        return 0.0
    if unique_assets >= 15:
        return 100.0
    # Linear interpolation between 1 and 15
    return min(100.0, ((unique_assets - 1) / (15 - 1)) * 100.0)
```

#### 7. Main Score Calculation

The main function orchestrates parallel queries and calculates the final score:

```python
def calculate_defi_score(address: str, api_key: str, verbose: bool = True) -> Dict:
    """Calculate DeFi Strategy Score for an address"""
    client = BitqueryClient(api_key)
    time_3yr_ago = get_time_3_years_ago()
    
    # Run queries in parallel for performance
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            "p1": executor.submit(get_p1_transaction_count, client, address, time_3yr_ago),
            "p2_p3": executor.submit(get_p2_p3_data, client, address, time_3yr_ago),
            "dex_nft": executor.submit(get_dex_and_nft_activity, client, address),
            "p4": executor.submit(get_p4_assets, client, address),
        }
        
        # Collect results as they complete
        results = {}
        for future in as_completed(futures.values()):
            name = [k for k, v in futures.items() if v == future][0]
            results[name] = future.result()
    
    # Process results and calculate scores
    tx_count, _ = results["p1"]
    p1_score = calculate_p1_score(tx_count)
    
    activity_types, interacted_protocols, _ = results["p2_p3"]
    dex_count_fungible, dex_count_nonfungible, dex_protocols, _ = results["dex_nft"]
    
    # Add DEX protocols to P3
    interacted_protocols.update(dex_protocols)
    
    # Add activity types from DEX/NFT
    if dex_count_fungible > 0:
        activity_types.add("ERC-20 Trading")
    if dex_count_nonfungible > 0:
        activity_types.add("NFT Trading")
    
    unique_types = len(activity_types)
    unique_protocols = len(interacted_protocols)
    p2_score = calculate_p2_score(unique_types)
    p3_score = calculate_p3_score(unique_protocols)
    
    unique_assets, _ = results["p4"]
    p4_score = calculate_p4_score(unique_assets)
    
    # Calculate final score
    avg_pillar_score = (p1_score + p2_score + p3_score + p4_score) / 4.0
    final_score = 25 + (avg_pillar_score * 0.75)
    final_score_rounded = round(final_score)
    
    return {
        "address": address,
        "p1": {"tx_count": tx_count, "score": p1_score},
        "p2": {"unique_types": unique_types, "score": p2_score},
        "p3": {"unique_protocols": unique_protocols, "score": p3_score},
        "p4": {"unique_assets": unique_assets, "score": p4_score},
        "average_pillar_score": avg_pillar_score,
        "final_score": final_score,
        "final_score_rounded": final_score_rounded
    }
```

#### 8. Web Application (Flask)

The Flask app (`app.py`) provides a REST API endpoint:

```python
@app.route('/api/calculate', methods=['POST'])
def calculate():
    """API endpoint to calculate DeFi score"""
    data = request.get_json()
    address = data.get('address', '').strip()
    
    # Validate address format
    if not address.startswith('0x') or len(address) != 42:
        return jsonify({'error': 'Invalid Ethereum address format'}), 400
    
    # Get API key
    api_key = os.getenv('BITQUERY_API_KEY')
    if not api_key:
        return jsonify({'error': 'API key not configured'}), 500
    
    # Calculate score
    result = calculate_defi_score(address, api_key, verbose=True)
    
    # Store in recent wallets cache (max 5)
    global recent_wallets
    recent_wallets = [w for w in recent_wallets if w['address'].lower() != address.lower()]
    recent_wallets.insert(0, {
        'address': result['address'],
        'p1': result['p1']['score'],
        'p2': result['p2']['score'],
        'p3': result['p3']['score'],
        'p4': result['p4']['score'],
        'final_score': result['final_score_rounded']
    })
    recent_wallets = recent_wallets[:5]
    
    return jsonify({
        'success': True,
        'data': result
    })
```

## Running the Tool

### Option 1: Web UI (Recommended)

1. Start the Flask web server:

```bash
python app.py
```

2. Open your browser and navigate to `http://localhost:5001`

3. Enter an Ethereum address in the search box

4. Click "Analyze" to calculate the DeFi Strategy Score

The web UI features:
- Clean, minimal interface
- Real-time score calculation
- Detailed breakdown of all four pillars
- Recent wallets history (last 5 analyzed)
- Responsive design

### Option 2: Command Line

Run the analysis directly from the command line:

```bash
python defi_tracker.py 0x6979B914f3A1d8C0fec2C1FD602f0e674cdf9862
```

The CLI output includes:
- Detailed query execution timing
- Individual pillar scores and metrics
- Final DeFi Strategy Score
- Debug information for troubleshooting

## Understanding the Output

### Score Breakdown

The tool provides a comprehensive breakdown:

- **P1 Score**: Transaction count and corresponding points
- **P2 Score**: Number of unique activity types and corresponding points
- **P3 Score**: Number of unique protocols interacted with and corresponding points
- **P4 Score**: Number of unique assets held and corresponding points
- **Average Pillar Score**: Average of all four pillar scores
- **Final DeFi Strategy Score**: Calculated using the formula `25 + (Average × 0.75)`

### Example Output

```
============================================================
DEFI STRATEGY SCORE RESULTS
============================================================
Address: 0x6979B914f3A1d8C0fec2C1FD602f0e674cdf9862

Pillar Scores:
  P1 (Transaction Count): 85.50 points (95 transactions)
  P2 (Transaction Types): 75.00 points (4 types)
  P3 (Protocols Used): 62.50 points (6 protocols)
  P4 (Assets Held): 90.00 points (12 assets)

Average Pillar Score: 78.25

Final DeFi Strategy Score: 84
============================================================
```

## API Endpoints

The Flask web application provides the following endpoints:

### POST `/api/calculate`

Calculates the DeFi Strategy Score for an Ethereum address.

**Request Body:**
```json
{
  "address": "0x6979B914f3A1d8C0fec2C1FD602f0e674cdf9862"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x6979B914f3A1d8C0fec2C1FD602f0e674cdf9862",
    "p1": {
      "tx_count": 95,
      "score": 85.5
    },
    "p2": {
      "unique_types": 4,
      "score": 75.0
    },
    "p3": {
      "unique_protocols": 6,
      "score": 62.5
    },
    "p4": {
      "unique_assets": 12,
      "score": 90.0
    },
    "average_pillar_score": 78.25,
    "final_score": 83.6875,
    "final_score_rounded": 84
  }
}
```

### GET `/api/recent`

Returns a list of recently analyzed wallets (max 5).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "address": "0x6979B914f3A1d8C0fec2C1FD602f0e674cdf9862",
      "p1": 85.5,
      "p2": 75.0,
      "p3": 62.5,
      "p4": 90.0,
      "final_score": 84
    }
  ]
}
```

## Important Considerations

- **Time Window**: The analysis looks at the last 3 years of activity
- **Asset Threshold**: Only ERC-20 tokens with balance ≥ $10 USD are counted in P4
- **NFT Counting**: Individual NFTs are counted (not collections) in P4
- **Protocol Coverage**: The tool tracks major DeFi protocols but may not include all protocols
- **API Rate Limits**: Subject to Bitquery API rate limits and quota restrictions
- **Query Performance**: Queries are executed in parallel for optimal performance
- **Data Accuracy**: Scores are based on on-chain data available through Bitquery APIs

## Use Cases

This tool is useful for:

- **Portfolio Analysis**: Understand your own DeFi engagement level
- **Wallet Research**: Analyze other wallets for due diligence or research
- **DeFi Strategy Assessment**: Evaluate how diversified and active a wallet's DeFi strategy is
- **Learning Tool**: Understand how to query and analyze Ethereum blockchain data using Bitquery
- **Foundation for Advanced Tools**: Use this as a starting point to build more sophisticated analysis systems

## Support

For questions or issues:
- Check the [GitHub repository](https://github.com/Akshat-cs/Defi-Portfolio-Profiler) for updates and issues
- Contact Bitquery support via [Telegram](https://t.me/Bloxy_info) or create a ticket [here](https://support.bitquery.io/)
