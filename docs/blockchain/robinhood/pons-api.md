---
title: "Pons API — Bonding Curve Launchpad on Robinhood Chain"
description: "Pons API: track the Pons V2 bonding-curve launchpad on Robinhood Chain with Bitquery GraphQL. Query new launches, curve trades, snipe tax, graduations, and Uniswap v4 pools."
sidebar_position: 7
keywords:
  - Pons API
  - Pons Robinhood API
  - Pons V2 API
  - Pons launchpad API
  - PonsV2LaunchFactory
  - PonsV2LaunchAndBuy
  - Pons bonding curve API
  - Pons curve trades API
  - Pons CurveBuy event
  - Pons CurveSell event
  - Pons TokenLaunched event
  - Pons PoolGraduated event
  - Pons LaunchSwept event
  - Pons graduation API
  - Pons snipe tax
  - Pons meme hook
  - Pons Uniswap v4 pool
  - Pons new token stream
  - Pons launch subscription
  - Pons token metadata API
  - Pons creator fee API
  - Robinhood Chain launchpad API
  - Robinhood Chain 4663
  - Bitquery Pons API
  - Bitquery Robinhood Events API
  - Bitquery Robinhood Calls API
  - newly launched tokens Robinhood
  - meme coin launchpad API
  - launch memecoin against tokenized stock
  - Pons pair tokens
  - Pons sniper bot data
  - track Pons launches real time
  - Pons holders API
  - Pons pool liquidity API
---

# Pons API — Bonding Curve Launchpad on Robinhood Chain

**[Pons](https://www.ponsfamily.com/launchpad)** is a token launchpad on **Robinhood Chain**. Its **V2** contracts run a real **bonding curve** that graduates into a **Uniswap v4 pool behind a Pons-owned hook**, and they let a creator quote a launch in **native ETH, USDG, or a tokenized stock** such as TSLA or NVDA. This guide shows how to track **new Pons launches**, **bonding-curve trades**, **snipe tax**, **graduations**, and **post-graduation prices and liquidity** with Bitquery GraphQL APIs, using the `EVM(network: robinhood)` and `Trading` cubes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Pools.trade API on Robinhood](/docs/blockchain/robinhood/pools-trade-api)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api)
- [Robinhood Calls API](/docs/blockchain/robinhood/robinhood-calls-api)
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api)
- [WebSocket subscriptions](/docs/subscriptions/websockets/)
:::

---

## How a Pons V2 launch works

Every launch mints a **fixed 1,000,000,000 supply** straight into its own **bonding curve contract**. Traders buy and sell against that curve — not against any DEX — until the curve has taken in its **graduation threshold** of the quote asset. At that point the curve is **swept**, and the proceeds seed a **Uniswap v4 pool** whose liquidity position is **permanently locked**.

| Property | Value |
| --- | --- |
| Network | Robinhood Chain (`network: robinhood`, chain ID **4663**) |
| Launch supply | `1000000000` (1 billion, decimal-normalized), 18 decimals |
| Pre-graduation venue | **Pons bonding curve**, one contract per token |
| Post-graduation venue | **Uniswap v4** (`Protocol: uniswap_v4`) |
| Graduation threshold | **4.2 ETH** for native-quoted launches; a per-asset amount for ERC-20 quotes |
| Curve trade fee | **100 bps** (1%) of the quote leg — from the launch config, not a protocol constant |
| Creator tax | set per launch, capped by the factory (`maxCreatorTaxBps`) |
| Launch fee | **0.0005 ETH** |
| Graduated pool `fee` | `0` — **all fees are taken by the hook**, not by the pool |
| Graduated pool `tickSpacing` | `200` |
| Graduated pool `hooks` | `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044` (**PonsV2MemeHook**) |

### The supply split

The curve's shape fixes exactly how much supply reaches the pool, and it is the same for every launch regardless of quote asset:

| Slice | Share of supply | Where it ends up |
| --- | --- | --- |
| Sold on the curve | **5/7** (≈714,285,714) | Buyers |
| Swept at graduation | **2/7** (≈285,714,286) | Split below |
| ↳ seeds the v4 pool | **10/49** (≈204,081,633) | Locked full-range position |
| ↳ permanently locked | **4/49** (≈81,632,653) | `PonsV2LaunchLocker` |

### How Pons differs from pools.trade {#pons-vs-poolstrade}

Pons and [pools.trade](/docs/blockchain/robinhood/pools-trade-api) are structurally opposite, and queries do not transfer between them:

| | Pons V2 | pools.trade |
| --- | --- | --- |
| Pre-graduation venue | Real bonding-curve contract | Uniswap v4 pool from block one |
| Graduation event | **Yes** — `LaunchSwept` + `PoolGraduated` | None |
| Pool `hooks` | PonsV2MemeHook | `0x000…000` |
| Pool `fee` / `tickSpacing` | `0` / `200` | `2500` / `25` or `60` |
| Quote assets | ETH, USDG, tokenized stocks | Mostly native ETH |
| Curve trades in `Trading` cube | **No** | N/A — all trades are pool trades |

:::caution Pons V1 is a different protocol and is still live
`PonsLaunchFactory` at `0xa5aab3f0c6eeadf30ef1d3eb997108e976351feb` is the **V1** launchpad. It is **still deploying tokens**, it has **no bonding curve** (each token gets a Uniswap V3 pool at launch), and its events have **different signatures and different topic0 values** from V2:

```text
db51ea9ad51ab453a65a4cb7e60c3cb378c9501bb002609f8f97778fb6c4235a  TokenLaunched(address,address,address,address,address,uint256,uint256,uint256,uint256,uint256)
1461370115e1c2be79cb529f8cfcbd11316e789d9c6099fc83417b0b4c48c62a  TokenDeployed(address,address,address,address,uint256,uint256)
```

Every query on this page targets **V2 only**. A "Pons launches" feed built from V2 alone silently misses all V1 activity — add the V1 factory address and its topic0s if you need both.
:::

---

## Datasets {#datasets}

:::danger Omitting `dataset` gives you realtime — a rolling window, not history
`EVM(network: robinhood)` with no `dataset` argument queries the **realtime** dataset, which holds only a rolling window of recent blocks. This is the single most common reason a Pons query "works" but returns nothing older than a few days, and nothing in the response says which dataset served it.

If you want history, say so explicitly:

| Dataset | What it covers | When to use it |
| --- | --- | --- |
| *(omitted)* → `realtime` | Rolling recent window | Live streams, dashboards of the last few hours |
| `dataset: archive` | Full history from the chain's indexing start | Backfills, per-day counts, anything dated |
| `dataset: combined` | Archive merged with the realtime tail | A continuous view from launch day to now; slower |

```graphql
EVM(network: robinhood, dataset: archive)    { ... }
EVM(network: robinhood, dataset: combined)   { ... }
```

See [Dataset options](/docs/graphql/dataset/options), [archive](/docs/graphql/dataset/archive), [realtime](/docs/graphql/dataset/realtime), [combined](/docs/graphql/dataset/combined), and [data coverage and retention](/docs/graphql/data-coverage-retention).
:::

**Every query on this page runs on `archive` and `combined`** — Pons V2 history reaches back to the first V2 launch — with two exceptions, both verified:

| Construct | realtime | archive | combined |
| --- | --- | --- | --- |
| `Topics: {includes: […]}` filter (incl. topic0) | ✅ | ✅ | ✅ |
| `Call.Input` / `Call.Output`, incl. `Input: {startsWith: […]}` | ✅ | ✅ | ✅ |
| `LogHeader.Address` / `LogHeader.Data`, `Log.Signature.Name` | ✅ | ✅ | ✅ |
| `Transfers`, `Holders`, `DEXTrades`, `Trading` | ✅ | ✅ | ✅ |
| **`Log.Signature.SignatureHash` / `Call.Signature.SignatureHash`** | ✅ | ❌ | ❌ |
| **`DEXPoolEvents`, `DEXPoolSlippages`, `TransactionBalances`** | ✅ | ❌ | ❌ |

:::caution `SignatureHash` breaks archive whether you filter *or* select it
Both of these force realtime, and the second one is easy to miss because the filter looks innocent:

```graphql
where: { Log: { Signature: { SignatureHash: {is: "…"} } } }   # filtering  → realtime only
Log { Signature { SignatureHash } }                            # selecting → realtime only
```

On `archive` either one fails with `no candidate table can serve: [Log_Signature_SignatureHash]`; on `combined` it returns `no data available yet to query dataset combined`. **`Topics: {includes: [{Hash: {is: "<topic0>"}}]}` is the drop-in replacement** and works on all three datasets — so prefer it, and keep `SignatureHash` out of your selection set. That is exactly what the queries below do.
:::

---

## Contract addresses

| Role | Address | Notes |
| --- | --- | --- |
| **Launch factory** (`PonsV2LaunchFactory`) | `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e` | Emits `TokenLaunched`, `LaunchSwept`, `PoolGraduated` |
| **Launch router** (`PonsV2LaunchAndBuy`) | `0xe33e9e479df8802cb0866d5d05258bec4cf62948` | `launchAndBuy()` — creates the token and executes the creator's first buy in one transaction |
| **Meme hook** (`PonsV2MemeHook`) | `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044` | The v4 hook on every graduated pool; emits `PoolRegistered` and `HookFeeCollected` |
| **Launch locker** (`PonsV2LaunchLocker`) | `0x267444d099b10fb5ed7c3cc7b7c767adca574952` | Holds the locked position NFT and the locked supply |
| **Graduation executor** | `0xc7819b64a1daecd7ec19856d026cb14efbd89046` | Emits `GraduationDustSwept` |
| **Bonding curve** | one per token | Address is the **receiver of the launch mint** — see [Newly launched tokens](#newly-launched-tokens) |
| **Uniswap v4 PoolManager** | `0x8366a39cc670b4001a1121b8f6a443a643e40951` | Shared chain singleton — **not** Pons-only |
| **Pons V1 factory** | `0xa5aab3f0c6eeadf30ef1d3eb997108e976351feb` | Separate protocol, still active — see the caution above |

:::caution The v4 PoolManager is not a Pons filter
`0x8366a39c…` is the **Uniswap v4 singleton** for all of Robinhood Chain. Every v4 trade on the network routes through it, [pools.trade](/docs/blockchain/robinhood/pools-trade-api) included. What isolates a **graduated Pons pool** is the `hooks` field being `0xe5e70264…` — see [The graduated Uniswap v4 pool](#the-graduated-uniswap-v4-pool).
:::

### Quote (pair) assets

Native ETH is the default quote asset, but the factory also approves **USDG and a set of tokenized stocks**, each with its own graduation threshold denominated in that asset's own decimals:

| Symbol | Address | Decimals |
| --- | --- | --- |
| ETH (native) | `0x0000000000000000000000000000000000000000` | 18 |
| USDG | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` | 6 |
| AAPL | `0xaf3d76f1834a1d425780943c99ea8a608f8a93f9` | 18 |
| AMD | `0x86923f96303d656e4aa86d9d42d1e57ad2023fdc` | 18 |
| AMZN | `0x12f190a9f9d7d37a250758b26824b97ce941bf54` | 18 |
| COIN | `0x6330d8c3178a418788df01a47479c0ce7ccf450b` | 18 |
| CRCL | `0xdf0992e440dd0be65bd8439b609d6d4366bf1cb5` | 18 |
| GME | `0x1b0e319c6a659f002271b69db8a7df2f911c153e` | 18 |
| GOOGL | `0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3` | 18 |
| META | `0xc0d6457c16cc70d6790dd43521c899c87ce02f35` | 18 |
| MSFT | `0xe93237c50d904957cf27e7b1133b510c669c2e74` | 18 |
| MU | `0xff080c8ce2e5feadaca0da81314ae59d232d4afd` | 18 |
| NVDA | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` | 18 |
| PLTR | `0x894e1ec2d74ffe5aef8dc8a9e84686accb964f2a` | 18 |
| SNDK | `0xb90a19ff0af67f7779aff50a882a9cff42446400` | 18 |
| SPCX | `0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea` | 18 |
| SPY | `0x117cc2133c37b721f49de2a7a74833232b3b4c0c` | 18 |
| TSLA | `0x322f0929c4625ed5bad873c95208d54e1c003b2d` | 18 |

The quote asset of any launch is `pairToken`, the first word of the `TokenLaunched` payload. The set is owner-mutable — the factory emits `PairTokenApprovalUpdated` and `PairTokenEconomicsUpdated` when it changes.

---

## Event reference

**Bitquery has no ABI for any Pons V2 contract**, so `Log.Signature.Name` is empty on every event on this page and `Arguments` comes back empty. The events are still fully indexed: filter on the event's **topic0** and read the payload from `LogHeader.Data`.

:::tip Check before you build a decoder
ABI coverage gets added over time — the sibling [pools.trade page](/docs/blockchain/robinhood/pools-trade-api) documented raw events until Bitquery decoded them. Run any event query below and look at `Log { Signature { Name } }` and `Arguments`: if they come back populated, skip the manual `LogHeader.Data` decoding on this page and read the arguments directly.
:::

The **Indexed** column is what makes Pons awkward — indexed arguments live in the log's topics, and Bitquery does not expose topics as an output field. An event with all its addresses indexed has a payload that tells you nothing about *which* token it concerns. Two mechanisms get around that: the [`Topics` filter](#filtering-by-an-indexed-argument) and the [`Calls` cube](#newly-launched-tokens).

### Factory events {#factory-events}

Emitter: `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e`

| Event | Indexed | topic0 (`SignatureHash`) |
| --- | --- | --- |
| `TokenLaunched(address,address,address,address,uint256,uint256)` | 3 | `8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607` |
| `LaunchSwept(address,uint256,uint256)` | 1 | `cdb72f157fd3666758a6ce201387ffb52038c7562e4fff352828da1096c4b6b4` |
| `PoolGraduated(address,uint256,uint256,uint256)` | 1 | `0a44ef75df69c534f43cd6c1aa3ef8983065fe5fe79ef9e79f6494e6f258c259` |
| `GraduationTokensPermanentlyLocked(address,uint256)` | 1 | `a0a18f5bf205becee8b268d7cf69addab8548ae8ef361791464cf0e0e17c1361` |
| `CreatorFeeRecipientUpdated(address,address,address)` | 3 | `308c390ed1ab5873392818e036cabdf408bc8ad042fbaead3108954ff75ba980` |
| `LaunchForceSwept(address)` *(rare)* | 1 | `52c1a28345695afc7f6b7629133124dec5d61ee745affd65e4fd2a776bc05840` |
| `LaunchGraduationRescued(address,address,uint256,uint256)` *(rare)* | 2 | `7017304fdd491394686dce984eac721f0be1a22228346210f16694772bde44ca` |

### Bonding curve events {#curve-events}

Emitter: one contract per token — see [Newly launched tokens](#newly-launched-tokens).

| Event | Indexed | topic0 (`SignatureHash`) |
| --- | --- | --- |
| `CurveBuy(address,address,uint256,uint256,uint256,uint256)` | 2 | `ec36bf571f136799e8dc0b0b8bea4b04d8bd3d43de838aab0d5fc21d4cbfc455` |
| `CurveSell(address,address,uint256,uint256,uint256,uint256)` | 2 | `8113d738abdcb6b38357e9d53a54a7157861a09031b453651f0fe7fe151f59df` |
| `SnipeTaxCharged(address,uint256)` | 1 | `3bc39a5562b28f5fe8f36cecabfbaa12bb969acf05717994709225fc412a9934` |
| `SnipeTaxExempted(address)` | 1 | `e4b7e48fbd47c2f602bacadee76ad33b16542ddb4997cfc0de04c311adcfa8c7` |
| `FeesSwept(uint256,uint256,uint256)` | 0 | `9f4cd7c4ed99d08a797804560c9c5d71d2cf7e101f2e3b5e7d1ca8a24c370e4f` |
| `CurveBuyRefunded(address,uint256)` | 1 | `a69e8258ccc7b9bbb70ab953fc2d1062b4ee28b8ca827534097e1732e87b0262` |
| `CurveCompleted(address,uint256,uint256)` | 0 | `f8d37a90738ae063b8b8058b66f5880cf3cf7ab0c5d4fa78219696591dfbfb67` |
| `Initialized(address)` | 0 | `908408e307fc569b417f6cbec5d5a06f44a0a505ac0479b47d421a4b2fd6a1e6` |
| `BuybackLocked(uint256,uint256)` *(rare)* | 0 | `5feba9b0d52c92ada4b9c571c2bee52390c54f2947208ab250221e6ee32f12ff` |
| `AutoGraduationFailed(address,uint256)` *(rare)* | 1 | `e2cd2f31ebc05ec28640102987f4c8fc5f20e269e1b3aa82577f3f2f0e35c7c6` |

### Meme hook events {#hook-events}

Emitter: `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044`

| Event | Indexed | topic0 (`SignatureHash`) |
| --- | --- | --- |
| `PoolRegistered(bytes32,address,address,address)` | 1 | `01bf263a1db1652580721573296e1a1fa70b3d4c87f61d02a69c4e1109d2d573` |
| `HookFeeCollected(bytes32,address,uint256,uint256)` | 1 | `c532c43b3423e14ef72748f1c8291238829ca0af8ba9b67975ad1483485a4b4d` |
| `PoolFeesSwept(bytes32,uint256,uint256,uint256,uint256)` | 1 | `2f3c43579b9064b6f28edcf41608f3815792d274a56afe024359703cb4ea9b30` |

### Router, locker, vault, executor

| Event | Emitter | Indexed | topic0 (`SignatureHash`) |
| --- | --- | --- | --- |
| `Launched(address,address,address,address,uint256,uint256)` | router | 3 | `dcacba5e347ae7abd91cb519eb877af8fa7774e347b85dd3ddcd24a2ba8cdf37` |
| `TokenSupplyLocked(address,uint256)` | locker | 1 | `af33c4aba92959b3e7ddc83ab728938262da159a6c05ca836f6c46f9bcb2c740` |
| `PositionLocked(address,uint256)` | locker | 2 | `2cabb2a2973327d5863ceb4707e9441851243897e86d587ee35943599752eb54` |
| `Locked(address,address,uint256,uint256)` | buyback vault | 2 | `967ad762aa9070ada8db64577288e214771e89667066ae38e8750cb8a86c5429` |
| `GraduationDustSwept(address,address,uint256)` | executor | 2 | `80a5a2ff8b8c5533e5862e4e161bbcade9af6fd9d67bef56a590b062107f027f` |

Every topic0 above was verified two ways: keccak-256 preimage match against the signature from the verified contract source, and live occurrence on Robinhood Chain. Rows marked *(rare)* are admin or failure paths that exist in the ABI but fire infrequently.

### Querying a raw event by topic0

The pattern is the same for every row above — match the topic0 with `Topics: {includes: […]}`, scope with `LogHeader.Address` where the emitter is a fixed contract, and read `LogHeader.Data`:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e"}}
        Topics: {includes: [{Hash: {is: "8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607"}}]}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From To }
      LogHeader { Data }
    }
  }
}
```

Topic0 values work with or without the `0x` prefix. `Log: {Signature: {SignatureHash: {is: "…"}}}` is an equivalent filter, but it pins the query to the realtime dataset — see [Datasets](#datasets).

:::caution Scope curve and hook events to an emitter where you can
Bonding curves are one contract per token, so a topic0-only filter on `CurveBuy` is the right scope — it captures every curve on the network at once, and `LogHeader.Address` tells you which one.

For fixed-emitter events, **always add `LogHeader.Address`**. A signature such as `PoolRegistered(bytes32,address,address,address)` is generic enough that unrelated contracts on the chain emit the same topic0 with a *different* indexing layout — same hash, incompatible payload. Filtering topic0 alone will mix them into your results.
:::

### Filtering by an indexed argument

Indexed arguments are not readable, but they **are** filterable. `Topics: {includes: [{Hash: {is: "…"}}]}` matches any topic in the log, including topic0 and any indexed address padded to 32 bytes. This is what makes an all-indexed event like `TokenLaunched` usable — see [Token lifecycle](#token-lifecycle-in-one-query).

```graphql
Topics: {includes: [{Hash: {is: "0x000000000000000000000000<token address without 0x>"}}]}
```

The `0x` prefix is optional here. `includes`, `excludes`, `startsWith`, `endsWith` and `length` are all available.

This is also **the archive-safe way to filter by topic0**, which is why every query on this page uses it in place of `Log.Signature.SignatureHash`. See [Datasets](#datasets).

### Full signatures for client-side decoding

```text
# factory — 0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e
8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607  TokenLaunched(address indexed token, address indexed curve, address indexed deployer, address pairToken, uint256 launchConfigId, uint256 graduationThreshold)
cdb72f157fd3666758a6ce201387ffb52038c7562e4fff352828da1096c4b6b4  LaunchSwept(address indexed token, uint256 quoteOut, uint256 tokenOut)
0a44ef75df69c534f43cd6c1aa3ef8983065fe5fe79ef9e79f6494e6f258c259  PoolGraduated(address indexed token, uint256 positionId, uint256 tokenAmount, uint256 pairTokenAmount)
a0a18f5bf205becee8b268d7cf69addab8548ae8ef361791464cf0e0e17c1361  GraduationTokensPermanentlyLocked(address indexed token, uint256 amount)

# bonding curve — one per token
ec36bf571f136799e8dc0b0b8bea4b04d8bd3d43de838aab0d5fc21d4cbfc455  CurveBuy(address indexed buyer, address indexed recipient, uint256 quoteIn, uint256 tokensOut, uint256 fee, uint256 tax)
8113d738abdcb6b38357e9d53a54a7157861a09031b453651f0fe7fe151f59df  CurveSell(address indexed seller, address indexed recipient, uint256 tokensIn, uint256 quoteOut, uint256 fee, uint256 tax)
3bc39a5562b28f5fe8f36cecabfbaa12bb969acf05717994709225fc412a9934  SnipeTaxCharged(address indexed recipient, uint256 amount)
f8d37a90738ae063b8b8058b66f5880cf3cf7ab0c5d4fa78219696591dfbfb67  CurveCompleted(address recipient, uint256 quoteOut, uint256 tokenOut)

# meme hook — 0xe5e702641ea86f4ae6cc3cdaed2b886f976be044
01bf263a1db1652580721573296e1a1fa70b3d4c87f61d02a69c4e1109d2d573  PoolRegistered(PoolId indexed poolId, address memecoin, address quoteToken, address creator)
c532c43b3423e14ef72748f1c8291238829ca0af8ba9b67975ad1483485a4b4d  HookFeeCollected(PoolId indexed poolId, address currency, uint256 feeAmount, uint256 taxAmount)

# router — 0xe33e9e479df8802cb0866d5d05258bec4cf62948
dcacba5e347ae7abd91cb519eb877af8fa7774e347b85dd3ddcd24a2ba8cdf37  Launched(address indexed token, address indexed curve, address indexed deployer, address pairToken, uint256 launchConfigId, uint256 graduationThreshold)
```

---

## Newly launched tokens

`TokenLaunched` indexes **token, curve and deployer**, so its payload carries only `pairToken`, `launchConfigId` and `graduationThreshold`. It is a good *counter* of launches and a good *lifecycle marker*, but on its own it never tells you which token launched.

The **`Calls` cube solves this completely.** `Call.Output` holds the function's return data, and every Pons launch entry point returns the addresses you need:

| Selector (`Call.Input` prefix) | Function | `Call.Output` |
| --- | --- | --- |
| `f85f8e41` | `launchAndBuy(...)` on the router | `(address token, address curve, uint256 tokensOut)` |
| `f35abbcf` | `launchToken(params, launchConfigId, pairToken)` | `(address token, address curve)` |
| `a72101af` | `launchToken(params, launchConfigId, pairToken, snipeTaxExemptions)` | `(address token, address curve)` |
| `d6a0eef5` | `launchTokenFor(...)` — what the router calls internally | `(address token, address curve)` |

`Input: {startsWith: […]}` accepts a list, and the `0x` prefix on each selector is optional. Do **not** use `Call: {Signature: {SignatureHash: …}}` here — it is the equivalent filter but pins the query to realtime, see [Datasets](#datasets).

### The complete launch feed

```graphql
{
  EVM(network: robinhood) {
    Calls(
      limit: {count: 20}
      orderBy: {descending: Block_Time}
      where: {
        Call: {
          To: {in: [
            "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e",
            "0xe33e9e479df8802cb0866d5d05258bec4cf62948"
          ]}
          Input: {startsWith: ["0xf35abbcf", "0xa72101af", "0xf85f8e41"]}
          Success: true
        }
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Call { To Value Input Output }
    }
  }
}
```

`Transaction.From` is the creator. `Call.Value` is the ETH attached (launch fee plus, on `launchAndBuy`, the creator's first buy). Take the first two 32-byte words of `Call.Output` for the token and the curve:

```js
const o = call.Output.replace(/^0x/, '');
const token = '0x' + o.slice(24, 64);
const curve = '0x' + o.slice(88, 128);
```

:::caution Never match `launchTokenFor` and `launchAndBuy` together
`launchAndBuy` on the router calls `launchTokenFor` on the factory internally, so a filter matching both selectors returns **two rows for the same launch** — one for the router's outer call, one for the factory's inner call. Measured over 200 rows, including `d6a0eef5` alongside `f85f8e41` inflates the feed **1.4×**; the three-selector filter above is exactly 1.0×.

That is why `d6a0eef5` is absent from the query. Router launches are attributed to the router call, which is also where `Transaction.From` is the real creator. If you do need `launchTokenFor` — to catch a launch routed through some other contract — add it and deduplicate on `Transaction.Hash`.
:::

### Stream new launches in real time

```graphql
subscription {
  EVM(network: robinhood) {
    Calls(
      where: {
        Call: {
          To: {in: [
            "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e",
            "0xe33e9e479df8802cb0866d5d05258bec4cf62948"
          ]}
          Input: {startsWith: ["0xf35abbcf", "0xa72101af", "0xf85f8e41"]}
          Success: true
        }
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      Call { To Value Input Output }
    }
  }
}
```

### Token metadata: name, symbol, image, description, socials {#token-metadata}

Pons puts **all** launch metadata in the call arguments rather than in an event, so `Call.Input` is the only on-chain source for the description, the IPFS image and the social links. The struct is:

```solidity
struct LaunchParams {
    string name;
    string symbol;
    string logo;            // ipfs:// URI
    string description;
    Socials socials;        // (twitter, telegram, discord, website, farcaster)
    address creatorFeeRecipient;
    uint16  creatorTaxBps;
    bool    buybackEnabled;
    bytes32 expectedEconomics;
    bytes32 salt;
}
```

ABI-decoding `Call.Input` from the launch feed above yields, for example:

```text
token               0x6a3b0c271d335450365297cdd10a24dc8364bf63
curve               0x9314af455ff11d02b5f87317fed8ddc9d6b17bb9
name                TickerYard
symbol              YARD
logo                ipfs://bafkreifqznqij7bgl7glhavtsg44ra2lf2axifmoc6r7sgwacssmlkmdzm
description         Route markets. Open verifiable protocol work.
twitter             https://x.com/TickerYardHQ
creatorFeeRecipient 0x84adad3ed94495c978e834bcef1e5a7f533cf981
creatorTaxBps       100
```

For `launchAndBuy` the outer arguments after the struct are `launchConfigId`, `pairToken`, `quoteIn`, `minTokensOut`, `recipient` and `snipeTaxExemptions[]` — `quoteIn` is the size of the creator's own first buy, which is a useful signal on its own.

### Full history: the launch mint on `archive` {#launch-mint-archive}

The `Calls` feed above already runs on `archive` — just add the argument. But the **launch mint transfer** is a second, independent route to the same list, and it is often the more convenient one: it carries name, symbol and decimals directly from `Currency`, and the mint's `Receiver` **is the bonding curve**. Use it when you want token metadata without decoding calldata, or as a cross-check on the call feed.

```graphql
{
  EVM(network: robinhood, dataset: archive) {
    Transfers(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Transfer: {
          Sender: {is: "0x0000000000000000000000000000000000000000"}
          Amount: {eq: "1000000000"}
        }
        Transaction: {To: {in: [
          "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e",
          "0xe33e9e479df8802cb0866d5d05258bec4cf62948"
        ]}}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From To }
      Transfer {
        Amount
        Receiver
        Currency { Name Symbol Decimals SmartContract }
      }
    }
  }
}
```

`Transfer.Currency.SmartContract` is the token, `Transfer.Receiver` is its curve, `Transaction.From` is the creator, and `Block.Time` is the launch time.

:::caution `Transaction.To` misses indirect launches
This pattern only catches launches where the factory or router is the transaction target. A small share of launches route through third-party contracts or arrive inside contract-creation transactions and carry a different `Transaction.To`. The [`Calls` feed](#the-complete-launch-feed) matches on `Call.To`, so it catches those too — and it runs on `archive` as well. Treat the call feed as the source of truth, and this one as the convenient metadata-carrying view.
:::

### Most active token creators

```graphql
{
  EVM(network: robinhood, dataset: archive) {
    Transfers(
      limit: {count: 25}
      orderBy: {descendingByField: "launches"}
      where: {
        Transfer: {
          Sender: {is: "0x0000000000000000000000000000000000000000"}
          Amount: {eq: "1000000000"}
        }
        Transaction: {To: {in: [
          "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e",
          "0xe33e9e479df8802cb0866d5d05258bec4cf62948"
        ]}}
        Block: {Time: {since_relative: {days_ago: 7}}}
      }
    ) {
      Transaction { From }
      launches: count
    }
  }
}
```

---

## Bonding-curve trades

**Pre-graduation trades are not in any DEX cube.** `DEXTrades`, `DEXTradeByTokens` and `Trading.Trades` all return zero rows for a token still on its curve, because there is no pool yet. The curve's own `CurveBuy` and `CurveSell` events are the only source.

### Every trade on one token's curve

Get the curve address from the [launch feed](#newly-launched-tokens), then filter on it as the emitter:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x45ee6e38b1e8c570de48baf42144cddd7bfb3cc6"}}
        Topics: {includes: [{Hash: {in: [
          "ec36bf571f136799e8dc0b0b8bea4b04d8bd3d43de838aab0d5fc21d4cbfc455",
          "8113d738abdcb6b38357e9d53a54a7157861a09031b453651f0fe7fe151f59df"
        ]}}]}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address Data }
    }
  }
}
```

Drop the `LogHeader.Address` filter to get **every curve trade on the network** in one feed — that is the shape you want for a launch-wide tape, and `LogHeader.Address` identifies the curve on each row.

### Reading the payload

Both events carry four 32-byte words. `Transaction.From` is the trader; the indexed `buyer`/`seller` and `recipient` are not readable. The base fee rate comes from the launch's config (`curveFeeBps`) rather than a protocol constant, so derive it from the events rather than assuming 100 bps.

| Word | `CurveBuy` | `CurveSell` |
| --- | --- | --- |
| 0 | `quoteIn` — quote asset spent | `tokensIn` — tokens sold |
| 1 | `tokensOut` — tokens received | `quoteOut` — quote asset received |
| 2 | `fee` — base fee **plus snipe tax** | `fee` |
| 3 | `tax` — creator tax, paid to the creator in full | `tax` |

```js
const w = i => BigInt('0x' + data.slice(i * 64, (i + 1) * 64));
const [quoteIn, tokensOut, fee, tax] = [w(0), w(1), w(2), w(3)];
const price = Number(quoteIn) / Number(tokensOut);   // quote per token
```

Both legs are raw integers in their asset's own decimals — 18 for the token, and the quote asset's own for the quote leg (6 for USDG).

### Snipe tax

Pons charges a punishing, fast-decaying tax on buys inside the launch window. The curve snapshots the factory's settings when it initializes, so a launch keeps the terms it launched under:

```text
snipeTaxBps(elapsed) = snipeTaxStartBps >> ((elapsed * 14) / snipeTaxSeconds)
```

with integer division, `elapsed` in seconds since the launch transaction, and zero once `elapsed >= snipeTaxSeconds`. At the factory's current settings — `snipeTaxStartBps = 9900`, `snipeTaxSeconds = 3` — that resolves to **9900 bps in the launch second, 618 bps in the next, 19 bps in the next, then zero**. Both settings are owner-mutable; read the current values with `snipeTaxStartBps()` (`0x50e25ac2`) and `snipeTaxSeconds()` (`0x6783774b`) through the `Calls` cube, taking `Call.Output`.

Because `CurveBuy.fee` bundles the base fee and the snipe tax, the snipe portion is what makes an early buy's effective rate jump far above the launch's base rate. `SnipeTaxCharged` isolates it:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        Topics: {includes: [{Hash: {is: "3bc39a5562b28f5fe8f36cecabfbaa12bb969acf05717994709225fc412a9934"}}]}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address Data }
    }
  }
}
```

`LogHeader.Data` is the single `amount` word, `LogHeader.Address` is the curve, and `Transaction.From` is the wallet that paid it — which is to say, **the sniper**. Creators can pre-declare exempt wallets at launch; those emit `SnipeTaxExempted` in the launch transaction, so the exemption list for a launch is recoverable from its own transaction hash.

### Graduation progress

There is no on-chain progress event. Sum the net quote taken in by the curve — `CurveBuy.quoteIn` minus `CurveSell.quoteOut` — and compare it against the launch's `graduationThreshold` (the third word of its `TokenLaunched` payload; **4.2 ETH** for native-quoted launches). The curve's live quote balance is the same figure, so a balance read against the curve address works as a cross-check.

---

## Token lifecycle in one query

The `Topics` filter turns the factory's all-indexed events into a per-token timeline. Pad the token address to 32 bytes and every factory event that names it comes back in order:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {ascending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e"}}
        Topics: {includes: [{Hash: {is: "0x00000000000000000000000095d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4"}}]}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From To }
      LogHeader { Data }
    }
  }
}
```

Add the event's topic0 as a second `includes` entry to narrow to one event type — multiple hashes are combined with **AND**. Map each row against the [event reference](#factory-events) and you get the full arc:

```text
TokenLaunched                      →  launch
LaunchSwept                        →  threshold hit, curve drained
GraduationTokensPermanentlyLocked  →  4/49 of supply locked forever
PoolGraduated                      →  v4 pool created and seeded
```

:::caution This works on the factory, not on the curve
The trick only works where the token address is actually one of the log's topics. Factory events index the token, so they match. The **curve's** events do not — `CreatorFeeRecipientUpdated` indexes the two recipient addresses and `SnipeTaxExempted` indexes the exempted account, so filtering a curve address by the token topic returns **zero rows**. Query curve history by the curve's own address plus the event topic0 instead.
:::

---

## Graduation

Graduation is **permissionless and two-phase**. Anyone can trigger it once the threshold is crossed, and in practice keeper bots race for it, so `Transaction.To` on the sweep is usually a third-party contract rather than Pons itself:

1. **`graduate(address)`** (`0xff6d8d05`) — sweeps curve fees, halts trading, pulls the quote and remaining supply into the factory. Emits `CurveCompleted` on the curve and `LaunchSwept` on the factory.
2. **`createGraduatedPool(address)`** (`0x2f53ef2f`) — creates the v4 pool, mints and locks the full-range position, registers the hook. Emits `GraduationTokensPermanentlyLocked`, `PoolGraduated`, `Initialize` and `ModifyLiquidity` on the PoolManager, `PoolRegistered` on the hook, and `TokenSupplyLocked` + `PositionLocked` on the locker.

The two phases land in **separate transactions**, seconds to minutes apart. A token in between is `Swept` — drained but not yet tradeable anywhere.

### Enumerating graduated tokens

`PoolGraduated` indexes the token, so it cannot tell you *which* token graduated. The hook's **`PoolRegistered` can** — its `memecoin`, `quoteToken` and `creator` are all in the payload:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"}}
        Topics: {includes: [{Hash: {is: "01bf263a1db1652580721573296e1a1fa70b3d4c87f61d02a69c4e1109d2d573"}}]}
      }
    ) {
      Block { Time Number }
      Transaction { Hash }
      LogHeader { Data }
    }
  }
}
```

```js
const d = log.Data;
const memecoin   = '0x' + d.slice(24, 64);
const quoteToken = '0x' + d.slice(88, 128);   // 0x000…000 for native ETH
const creator    = '0x' + d.slice(152, 192);
```

This is the query to run first when you want a **token set** to feed into the `Trading` cube — see [Top graduated tokens](#top-graduated-pons-tokens-by-volume). Keep the `LogHeader.Address` filter on the hook; without it this topic0 also matches an unrelated contract on the chain.

### The graduated Uniswap v4 pool

The PoolManager's `Initialize` **is** decoded, so the `PoolKey` reads without manual decoding. Scope it by the **`hooks` argument** — the Pons hook is what makes a pool a Pons pool:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
        Arguments: {includes: {
          Name: {is: "hooks"}
          Value: {Address: {is: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"}}
        }}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_Integer_Value_Arg { integer }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

Returns `id` (the **PoolId** you need for [liquidity and slippage](#pool-liquidity-slippage-and-balance-changes)), `currency0`, `currency1`, `fee`, `tickSpacing`, `hooks`, `sqrtPriceX96` and `tick`. Every Pons pool comes back with `fee: 0`, `tickSpacing: 200` and `hooks: 0xe5e702641ea86f4ae6cc3cdaed2b886f976be044`.

:::note Filter on the hook, not on `Transaction.To`
Scoping this query with `Transaction: {To: {is: "<factory>"}}` looks equivalent and is not: graduation is [permissionless](#graduation), so a keeper contract can call `createGraduatedPool` and carry a different `Transaction.To`. Measured over three days, the `Transaction.To` form returned 33 of 34 graduations while the `hooks` argument filter returned all 34. The hook is on every Pons pool regardless of who triggered it.
:::

:::note Why `fee` is zero
Trading fees on a graduated Pons pool are charged by the **hook**, not by the pool. The pool's own LP fee is `0`, and `HookFeeCollected` on `0xe5e70264…` is where the fee and the creator tax actually show up. Reading `fee` from the `PoolKey` and calling it the trading cost will understate it to zero.
:::

---

## Trading data (post-graduation)

Once graduated, a Pons token is an ordinary Uniswap v4 market:

| Field | Value |
| --- | --- |
| `Pair.Market.ProtocolFamily` | `Uniswap` |
| `Pair.Market.Protocol` | `uniswap_v4` |
| `Pair.Market.Network` | `Robinhood` |

:::caution There is no `Pons` protocol label
Pons tokens **cannot be isolated by protocol filter** — `uniswap_v4` on Robinhood also covers pools created elsewhere. Scope by token address: harvest the set from `PoolRegistered`, then filter `Trading` by `Token.Address: {in: [...]}`.

`Pair.Pool.Address` is the v4 PoolManager singleton on every row, not a per-pool address. Use the `PoolId` from `Initialize` when you need to identify one pool.
:::

### Latest trades for a graduated token

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {
          Token: {Address: {is: "0x95d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4"}}
          Market: {Network: {is: "Robinhood"}}
        }
      }
    ) {
      Block { Time }
      Side
      Price
      PriceInUsd
      Amounts { Base Quote }
      AmountsInUsd { Base Quote }
      Trader { Address }
      TransactionHeader { Hash }
      Pair {
        Token { Address Symbol Name }
        QuoteToken { Address Symbol }
        Market { Protocol ProtocolFamily Network }
      }
    }
  }
}
```

:::note Legs are not duplicated on Pons pools
Unlike [pools.trade](/docs/blockchain/robinhood/pools-trade-api#latest-trades-for-a-poolstrade-token), Pons v4 pools return **one row per trade leg** — measured samples deduplicate to a 1.0× factor on `(TransactionHeader.Hash, Block.Time, Side, Amounts.Base, Pair.QuoteToken.Symbol, Trader.Address)`. No dedup pass is needed before summing volume.

One user swap can still fan out into several routed legs across different quote pairs in the same transaction, so summing every leg overstates end-user volume. Graduated tokens commonly trade against both ETH and USDG.
:::

### OHLCV price candles

```graphql
{
  Trading {
    Tokens(
      limit: {count: 24}
      orderBy: {descending: Block_Time}
      where: {
        Token: {Address: {is: "0x95d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4"} Network: {is: "Robinhood"}}
        Interval: {Time: {Duration: {eq: 3600}}}
      }
    ) {
      Block { Time }
      Token { Address Symbol Name }
      Volume { Usd }
      Price { Ohlc { Open High Low Close } }
    }
  }
}
```

Change `Duration` to `60`, `300`, `900` or `86400` for other candle sizes. Add `Supply { MarketCap CirculatingSupply }` for FDV.

### Top graduated Pons tokens by volume

Pass a token set harvested from [`PoolRegistered`](#enumerating-graduated-tokens):

```graphql
{
  Trading {
    Tokens(
      limit: {count: 25}
      orderBy: {descendingByField: "vol"}
      where: {
        Token: {
          Address: {in: [
            "0x95d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4",
            "0xddec0170ceb4426ea05f2fbd485dffa4fafa6615",
            "0xd928a068d2b90798373a470c9d9ba562322acdef"
          ]}
          Network: {is: "Robinhood"}
        }
        Interval: {Time: {Duration: {eq: 3600}}}
        Block: {Time: {since_relative: {days_ago: 1}}}
      }
    ) {
      Token { Address Symbol Name }
      vol: sum(of: Volume_Usd)
      trades: count
    }
  }
}
```

:::note Keep per-interval metrics out of aggregations
Selecting a per-row metric such as `Supply { MarketCap }` alongside `sum(of: Volume_Usd)` adds it as a grouping key, so you get one row **per interval** instead of one row per token. Time windows go in `Block: {Time: …}` — `Interval.Time.Since` is not a valid field.
:::

---

## Pool liquidity, slippage, and balance changes

These three cubes are **realtime-only** on Robinhood — `archive` and `combined` both error on them, unlike the rest of this page (see [Datasets](#datasets)) — so use them for live monitoring and persist what you need. All three key off the **`PoolId`** from `Initialize`.

### Live pool liquidity (depth)

```graphql
{
  EVM(network: robinhood) {
    DEXPoolEvents(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        PoolEvent: {Pool: {PoolId: {is: "0x99b36f2b55ff70f807132c497431c399c5db8301ba1a43f3e70dc1d08b908eaa"}}}
      }
    ) {
      Block { Time }
      Log { Signature { Name } }
      PoolEvent {
        Dex { ProtocolName ProtocolVersion }
        Pool { PoolId CurrencyA { Symbol } CurrencyB { Symbol } }
        Liquidity { AmountCurrencyA AmountCurrencyAInUSD AmountCurrencyB AmountCurrencyBInUSD }
      }
    }
  }
}
```

`AmountCurrencyA` is the quote side (ETH in the example) and `AmountCurrencyB` the token side. The token side's USD value reads `0` for unpriced launch tokens — value the pool from the quote leg.

### Per-swap slippage

```graphql
{
  EVM(network: robinhood) {
    DEXPoolSlippages(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        Price: {Pool: {PoolId: {is: "0x99b36f2b55ff70f807132c497431c399c5db8301ba1a43f3e70dc1d08b908eaa"}}}
      }
    ) {
      Block { Time }
      Price {
        Dex { ProtocolName }
        Pool { PoolId CurrencyA { Symbol } CurrencyB { Symbol } }
        AtoB { Price MaxAmountIn MinAmountOut }
        SlippageBasisPoints
      }
    }
  }
}
```

Streamed with `SlippageBasisPoints: {gt: 100}`, this is a ready-made toxic-fill alert.

### Per-transaction balance changes

```graphql
{
  EVM(network: robinhood) {
    TransactionBalances(
      limit: {count: 10}
      orderBy: {descending: Block_Time}
      where: {
        TokenBalance: {Currency: {SmartContract: {is: "0x95d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4"}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      TokenBalance {
        Address
        PreBalance
        PostBalance
        HasPreBalance
        TotalSupply
        Currency { Symbol }
      }
    }
  }
}
```

:::note Check `HasPreBalance`
When `HasPreBalance` is `false`, `PreBalance` reads `0` meaning "unknown", not "zero". Treat the delta as reliable only when it is `true`. `TotalSupply` reads `1000000000` for every Pons launch, which is a cheap sanity check that you are looking at the right contract.
:::

---

## Holders and supply

```graphql
{
  EVM(dataset: combined, network: robinhood) {
    Holders(
      limit: {count: 100}
      orderBy: {descending: Balance_Amount}
      where: {
        Currency: {SmartContract: {is: "0x95d3bc5d467d448ac83c5b33ff90f4dcfaf4c1e4"}}
        Balance: {Amount: {gt: "0"}}
        Holder: {Address: {notIn: [
          "0x8366a39cc670b4001a1121b8f6a443a643e40951",
          "0x267444d099b10fb5ed7c3cc7b7c767adca574952",
          "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"
        ]}}
      }
    ) {
      Holder { Address }
      Balance { Amount FirstChangeTime LastChangeTime UpdateCount }
    }
  }
}
```

:::caution Exclude three protocol addresses, not one
On a graduated Pons token the top holders are all protocol contracts:

- **`0x8366a39c…`** — the v4 PoolManager, which custodies the pool's liquidity
- **`0x267444d0…`** — `PonsV2LaunchLocker`, holding the permanently locked 4/49 of supply
- **`0xe5e70264…`** — the meme hook, holding accrued fees in the token

Leave them in and the protocol itself dominates every holder count, concentration ratio and top-wallet leaderboard. The `notIn` filter above removes all three.

For a token **still on its curve**, the curve contract holds all unsold supply and should be excluded the same way.
:::

For circulating supply and market cap, see [Robinhood Token Supply](/docs/blockchain/robinhood/robinhood-token-supply).

---

## Streaming

Every query on this page runs as a subscription — switch `query` to `subscription` and drop `limit`/`orderBy`. Connect to `wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-transport-ws` subprotocol (`connection_init` → `connection_ack` → `subscribe`). See [WebSocket authentication](/docs/authorization/websocket/).

The three feeds worth running continuously:

```graphql
# 1. Every new launch, with token + curve + full metadata
subscription {
  EVM(network: robinhood) {
    Calls(where: {Call: {
      To: {in: ["0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e", "0xe33e9e479df8802cb0866d5d05258bec4cf62948"]}
      Input: {startsWith: ["0xf35abbcf", "0xa72101af", "0xf85f8e41"]}
      Success: true
    }}) {
      Block { Time }
      Transaction { Hash From }
      Call { To Value Input Output }
    }
  }
}
```

```graphql
# 2. Every bonding-curve trade on the network
subscription {
  EVM(network: robinhood) {
    Events(where: {Topics: {includes: [{Hash: {in: [
      "ec36bf571f136799e8dc0b0b8bea4b04d8bd3d43de838aab0d5fc21d4cbfc455",
      "8113d738abdcb6b38357e9d53a54a7157861a09031b453651f0fe7fe151f59df"
    ]}}]}}) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address Data }
    }
  }
}
```

```graphql
# 3. Every graduation, with the token address readable in the payload
subscription {
  EVM(network: robinhood) {
    Events(where: {
      LogHeader: {Address: {is: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"}}
      Topics: {includes: [{Hash: {is: "01bf263a1db1652580721573296e1a1fa70b3d4c87f61d02a69c4e1109d2d573"}}]}
    }) {
      Block { Time }
      Transaction { Hash }
      LogHeader { Data }
    }
  }
}
```

---

## FAQ

### How do I detect a newly launched Pons token?

Subscribe to the `Calls` cube on the factory and router and read `Call.Output` for the token and curve addresses. `TokenLaunched` indexes all three of its addresses, so the event alone cannot identify the token. See [Newly launched tokens](#newly-launched-tokens).

### Why do my Pons trade queries return nothing?

Almost certainly because the token has not graduated. Bonding-curve trades exist only as `CurveBuy` / `CurveSell` events on the token's own curve contract — `DEXTrades` and `Trading.Trades` have no rows until the v4 pool is created. See [Bonding-curve trades](#bonding-curve-trades).

### Where do I get a token's name, symbol, image, and socials?

Name, symbol and decimals come from `Transfer.Currency` on any transfer. The IPFS image, description and social links exist only in the launch call's arguments — ABI-decode `Call.Input`. See [Token metadata](#token-metadata).

### Why is my effective fee far above 1%?

The snipe tax. `CurveBuy.fee` bundles the 100 bps base fee with the launch-window penalty, which starts at 9,900 bps and halves down to zero within seconds. `SnipeTaxCharged` isolates the penalty. See [Snipe tax](#snipe-tax).

### How do I tell a Pons pool from any other Uniswap v4 pool on Robinhood?

By the `hooks` field: `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044`. There is no `Pons` protocol label in the `Trading` cube, and the v4 PoolManager address is shared by the whole chain.

### Can I get Pons history older than the realtime window?

Yes — add `dataset: archive` (or `combined`) to the `EVM` root. Almost every query here supports it, including the `Calls` launch feed and every topic0 filter, because they use `Topics: {includes: […]}` rather than `SignatureHash`. Only `DEXPoolEvents`, `DEXPoolSlippages` and `TransactionBalances` are realtime-only. See [Datasets](#datasets) — forgetting this is the usual reason a query looks empty.

### Does this page cover Pons V1?

No. V1 is a separate, still-active protocol with no bonding curve and different event signatures — see the [caution above](#pons-vs-poolstrade).

---

## Next steps

- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) — full trade schema for the network
- [Robinhood Calls API](/docs/blockchain/robinhood/robinhood-calls-api) — more on `Call.Input` / `Call.Output` and internal calls
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) — compare launchpads side by side
- [Pools.trade API](/docs/blockchain/robinhood/pools-trade-api) — the other major Robinhood Chain launchpad
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api) — holder distribution queries
- [WebSocket subscriptions](/docs/subscriptions/websockets/) — turn any query above into a live stream
