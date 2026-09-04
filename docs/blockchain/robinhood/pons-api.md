---
title: "Pons Launchpad API — Track Pons Launches on Robinhood Chain"
description: "Pons launchpad API on Robinhood Chain. Track Pons V2 launches, curve trades, graduations, the launch factory and locked liquidity with Bitquery GraphQL."
sidebar_position: 7
keywords:
  - Pons launchpad
  - Pons launchpad Robinhood Chain
  - Pons launch factory
  - Pons launch factory contract
  - Pons launchpad liquidity lock
  - Pons launchpad locker
  - Pons launchpad contract address
  - Pons Family launchpad
  - PonsV2LaunchLocker
  - PonsV2MemeHook
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

# Pons Launchpad API — Track Pons Launches on Robinhood Chain

**[Pons](https://www.ponsfamily.com/launchpad)** (Pons Family) is a **token launchpad on Robinhood Chain**. Its **V2 launch factory** gives every token a real **bonding curve** that graduates into a **Uniswap v4 pool behind a Pons-owned hook** with **permanently locked liquidity**, and it lets a creator quote a launch in **native ETH, USDG, cbBTC, or a tokenized stock or ETF** such as TSLA, NVDA or SPY. This guide shows how to track **new Pons launches**, **bonding-curve trades**, **snipe tax**, **graduations**, the **liquidity lock**, and **post-graduation prices and liquidity** with Bitquery GraphQL APIs, using the `EVM(network: robinhood)` and `Trading` cubes.

:::note API Key Required
To query or stream data outside the Bitquery IDE, you need an API access token.

Follow the steps here: [How to generate Bitquery API token ➤](/docs/authorization/how-to-generate/)
:::

:::tip Related docs
- [Robinhood New Pools & Trending Tokens API](/docs/blockchain/robinhood/robinhood-new-pools-trending) — new pools, trending tokens, pair lookup and token search
- [Robinhood Chain API overview](/docs/blockchain/robinhood/) — every Robinhood Chain API, launchpad guide and stream in one place
- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades)
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches)
- [Pools.trade API on Robinhood](/docs/blockchain/robinhood/pools-trade-api)
- [Flap.sh API on Robinhood](/docs/blockchain/robinhood/flap-sh-api)
- [Robinhood Calls API](/docs/blockchain/robinhood/robinhood-calls-api)
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api)
- [Robinhood Liquidity & Slippage API](/docs/blockchain/robinhood/robinhood-liquidity)
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
| Graduation threshold | **4.2 ETH** for native-quoted launches; a per-asset amount for ERC-20 quotes — read it from `graduationThreshold` in `TokenLaunched`, set per asset by `PairTokenEconomicsUpdated` |
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
| Quote assets | ETH, USDG, cbBTC, tokenized stocks and ETFs | Mostly native ETH |
| Curve trades in trade cubes | **Yes**, as `pons_v2` (`Trading`, rolling ~30-day window; EVM `DEXTrades` from 2026-08-14) | N/A — all trades are pool trades |

:::caution Pons V1 is a different protocol with different event signatures
`PonsLaunchFactory` at `0xa5aab3f0c6eeadf30ef1d3eb997108e976351feb` is the **V1** launchpad. It has **no bonding curve** — each token gets a Uniswap V3 pool at launch — and its events carry **different signatures and different topic0 values** from V2:

```text
db51ea9ad51ab453a65a4cb7e60c3cb378c9501bb002609f8f97778fb6c4235a  TokenLaunched(address,address,address,address,address,uint256,uint256,uint256,uint256,uint256)
1461370115e1c2be79cb529f8cfcbd11316e789d9c6099fc83417b0b4c48c62a  TokenDeployed(address,address,address,address,uint256,uint256)
```

Every query on this page targets **V2 only**. A "Pons launches" feed built from V2 alone will not include V1 launches — add the V1 factory address and its topic0s if you need both.

V1 has stopped producing launches — its factory now emits only ownership-admin events. Treat it as history — query `EVM(network: robinhood, dataset: archive)` for logs from `0xa5aab3f0c6eeadf30ef1d3eb997108e976351feb` when you need V1 launches, and re-check the realtime dataset before assuming it is dead for good. V1 pools are created by Robinhood Chain's **chain-wide Uniswap V3 pool factory**, which serves every V3 protocol on the network — a `PoolCreated` event from it is **not** on its own a Pons signal.
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

**Every query on this page runs on `archive` and `combined`** — Pons V2 history reaches back to the first V2 launch — with one exception, verified:

| Construct | realtime | archive | combined |
| --- | --- | --- | --- |
| `Topics: {includes: […]}` filter (incl. topic0) | ✅ | ✅ | ✅ |
| `Call.Input` / `Call.Output`, incl. `Input: {startsWith: […]}` | ✅ | ✅ | ✅ |
| `LogHeader.Address` / `LogHeader.Data`, `Log.Signature.Name` | ✅ | ✅ | ✅ |
| `Transfers`, `Holders`, `DEXTrades` | ✅ | ✅ | ✅ |
| `Log.Signature.SignatureHash` / `Call.Signature.SignatureHash`, filtered or selected | ✅ | ✅ | ✅ |
| **`DEXPoolEvents`, `DEXPoolSlippages`, `TransactionBalances`** | ✅ | ❌ | ❌ |

The `Trading` cube is a separate root that takes no `dataset` argument; it holds a rolling window of roughly the last 30 days, so the `pons_v2` rows it serves are always the most recent month, not a fixed history.

:::note `SignatureHash` works on every dataset
`Log.Signature.SignatureHash` and `Call.Signature.SignatureHash` work on `realtime`, `archive` and `combined`, both as a filter and in the selection set, and a `SignatureHash` filter matches the same rows as a topic0 `Topics` filter. The queries on this page use `Topics: {includes: [{Hash: {is: "<topic0>"}}]}` because it is the same filter on every dataset **and** it is the only way to match an indexed argument of an undecoded event — `Signature: {SignatureHash: …}` is an equally valid choice for topic0 alone.
:::

---

## Pons contract addresses: launch factory, router, hook, locker {#contract-addresses}

Pons V2 runs from a fixed set of contracts. The launch factory `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e` emits every `TokenLaunched`, `LaunchSwept`, and `PoolGraduated`; the launch router `0xe33e9e479df8802cb0866d5d05258bec4cf62948` wraps launch-and-first-buy into one transaction; and the meme hook `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044` sits on every graduated Uniswap v4 pool and is the field that tells a Pons pool apart from any other v4 pool on the network. Each launched token also gets **its own bonding-curve contract**, so curve trades are matched by event signature rather than by a single address.

| Role | Address | Notes |
| --- | --- | --- |
| **Launch factory** (`PonsV2LaunchFactory`) | `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e` | Emits `TokenLaunched`, `LaunchSwept`, `PoolGraduated` |
| **Launch router** (`PonsV2LaunchAndBuy`) | `0xe33e9e479df8802cb0866d5d05258bec4cf62948` | `launchAndBuy()` — creates the token and executes the creator's first buy in one transaction |
| **Meme hook** (`PonsV2MemeHook`) | `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044` | The v4 hook on every graduated pool; emits `PoolRegistered` and `HookFeeCollected` |
| **Launch locker** (`PonsV2LaunchLocker`) | `0x267444d099b10fb5ed7c3cc7b7c767adca574952` | Holds the locked position NFT and the locked supply |
| **Graduation executor** | `0xc7819b64a1daecd7ec19856d026cb14efbd89046` | Emits `GraduationDustSwept` |
| **Bonding curve** | one per token | Address is the **receiver of the launch mint** — see [Newly launched tokens](#newly-launched-tokens) |
| **Uniswap v4 PoolManager** | `0x8366a39cc670b4001a1121b8f6a443a643e40951` | Shared chain singleton — **not** Pons-only |
| **Pons V1 factory** | `0xa5aab3f0c6eeadf30ef1d3eb997108e976351feb` | Separate protocol, no longer launching — see the caution above |

:::caution The v4 PoolManager is not a Pons filter
`0x8366a39c…` is the **Uniswap v4 singleton** for all of Robinhood Chain. Every v4 trade on the network routes through it, [pools.trade](/docs/blockchain/robinhood/pools-trade-api) included. What isolates a **graduated Pons pool** is the `hooks` field being `0xe5e70264…` — see [The graduated Uniswap v4 pool](#the-graduated-uniswap-v4-pool).
:::

### Quote (pair) assets

Native ETH is the default quote asset, but the factory also approves **USDG, cbBTC, and a growing set of tokenized stocks and ETFs**, each with its own graduation threshold denominated in that asset's own decimals. The set is **owner-mutable and grows in batches** — the factory emits `PairTokenApprovalUpdated` (approve or revoke) and `PairTokenEconomicsUpdated` (threshold and decimals) whenever it changes — so treat the table as a snapshot and use the query below it for the live list:

| Symbol | Address | Decimals |
| --- | --- | --- |
| ETH (native) | `0x0000000000000000000000000000000000000000` | 18 |
| USDG | `0x5fc5360d0400a0fd4f2af552add042d716f1d168` | 6 |
| cbBTC | `0xcec185eb182c47d1ba1efc84e6959e18cd620be4` | 8 |
| AAPL | `0xaf3d76f1834a1d425780943c99ea8a608f8a93f9` | 18 |
| AMD | `0x86923f96303d656e4aa86d9d42d1e57ad2023fdc` | 18 |
| AMZN | `0x12f190a9f9d7d37a250758b26824b97ce941bf54` | 18 |
| BB | `0x48e39e56acdba37b09020c0b734a613c9a2f100a` | 18 |
| COIN | `0x6330d8c3178a418788df01a47479c0ce7ccf450b` | 18 |
| COST | `0x4ea005168d7f09a7a0ba9d1def21a479950e44c2` | 18 |
| CRCL | `0xdf0992e440dd0be65bd8439b609d6d4366bf1cb5` | 18 |
| DELL | `0x941ae714ec6d8130c7b75d67160ca08f1e7d11dd` | 18 |
| DJT | `0x1d11f0496982706c5e14a514d4e79f2e6bde4516` | 18 |
| GLD | `0xc9a981fee1f9dec688bb123ccdecc63d0debfc4e` | 18 |
| GME | `0x1b0e319c6a659f002271b69db8a7df2f911c153e` | 18 |
| GOOGL | `0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3` | 18 |
| HIMS | `0xccee82fe024c36fa15e1005ede3e9e4787e23d09` | 18 |
| LLY | `0x8005d266423c7ea827372c9c864491e5786600ea` | 18 |
| META | `0xc0d6457c16cc70d6790dd43521c899c87ce02f35` | 18 |
| MSFT | `0xe93237c50d904957cf27e7b1133b510c669c2e74` | 18 |
| MSTR | `0xec262a75e413fafd0df80480274532c79d42da09` | 18 |
| MU | `0xff080c8ce2e5feadaca0da81314ae59d232d4afd` | 18 |
| NVDA | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` | 18 |
| PLTR | `0x894e1ec2d74ffe5aef8dc8a9e84686accb964f2a` | 18 |
| QQQ | `0xd5f3879160bc7c32ebb4dc785f8a4f505888de68` | 18 |
| RBLX | `0xf0c4bf4c582cb3836e98394b1d4e7b7281101be8` | 18 |
| RDDT | `0x05b37fb53a299a1b874a619e1c4c404d52c36f4c` | 18 |
| SKHY | `0x84cab63bc87912e71ad199ff14a0ba45de68fef8` | 18 |
| SNDK | `0xb90a19ff0af67f7779aff50a882a9cff42446400` | 18 |
| SPCX | `0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea` | 18 |
| SPY | `0x117cc2133c37b721f49de2a7a74833232b3b4c0c` | 18 |
| TSLA | `0x322f0929c4625ed5bad873c95208d54e1c003b2d` | 18 |
| TSM | `0x58ffe4a942d3885baa22d7520691f611ef09e7aa` | 18 |
| TTWO | `0x5e81213613b6b86eab4c6c50d718d34359459786` | 18 |
| USO | `0xa30fa36db767ad9ed3f7a60fc79526fb4d56d344` | 18 |
| WYFI | `0x9e7abd3c9139d14e4c86dce0e455aab7a0c2fb3e` | 18 |

The quote asset of any launch is `pairToken`, the first word of the `TokenLaunched` payload (or the `pairToken` argument once decoded).

### Read the current approved quote assets

Both admin events are decoded, so the live set is one query on the factory. Keep the latest row per `pairToken`: an `approved: false` row revokes the asset, and `graduationThreshold` is in the asset's own `decimals`.

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 200}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e"}}
        Log: {Signature: {Name: {in: ["PairTokenApprovalUpdated", "PairTokenEconomicsUpdated"]}}}
      }
    ) {
      Block { Time }
      Log { Signature { Name } }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Integer_Value_Arg { integer }
          ... on EVM_ABI_Boolean_Value_Arg { bool }
        }
      }
    }
  }
}
```

This query only sees changes made from 2026-08-14 onward: earlier approval rows predate event decoding, carry no `Signature.Name`, and are not matched by the name filter at all (see the [decoding caveat](#event-reference)). The table above already folds in that initial set, so union the two.

---

## Event reference

**Most Pons V2 events are now ABI-decoded.** The factory, the router, every bonding curve, and the locker's `PositionLocked` all come back with `Log.Signature.Name` populated and `Arguments` fully readable — **including the indexed arguments**, which decoding lifts out of the topics for you. Filter and read them by name:

```graphql
where: { Log: { Signature: { Name: {is: "CurveBuy"} } } }
```

Three contracts are still undecoded, and for those the topic0 + `LogHeader.Data` patterns later on this page remain the only route:

| Contract | Decoded? |
| --- | --- |
| Factory `0x7ed598bc…` | ✅ all events |
| Router `0xe33e9e47…` | ✅ `Launched` |
| Bonding curves (one per token) | ✅ all events (`CurveBuy`, `CurveSell`, `SnipeTaxCharged`, …) |
| Locker `0x267444d0…` | ⚠️ `PositionLocked` ✅, `TokenSupplyLocked` ❌ |
| **Meme hook `0xe5e70264…`** | ❌ `PoolRegistered`, `HookFeeCollected`, `PoolFeesSwept` |
| **Graduation executor `0xc7819b64…`** | ❌ `GraduationDustSwept` |

:::caution Decoded names only reach back to 2026-08-14 on `archive`
Decoding was applied from **2026-08-14** onward and older archive rows have not been reprocessed: on `archive`/`combined`, rows before that date carry an **empty `Signature.Name` and no `Arguments`**, so a `Signature: {Name: …}` filter silently drops all earlier history — on a window that straddles that date, the name filter on `TokenLaunched` returns fewer rows than the topic0 filter, and the gap is exactly the pre-2026-08-14 launches. For anything historical, keep filtering with `Topics: {includes: [{Hash: {is: "<topic0>"}}]}` (which matches decoded and undecoded rows alike) and treat `Signature.Name` / `Arguments` as fields that may be empty on old rows. If Bitquery backfills the archive later, this caveat disappears — re-run the count comparison to check.
:::

### Factory events {#factory-events}

Emitter: `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e`

| Event | Indexed | topic0 (`SignatureHash`) |
| --- | --- | --- |
| `TokenLaunched(address,address,address,address,uint256,uint256)` | 3 | `8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607` |
| `LaunchSwept(address,uint256,uint256)` | 1 | `cdb72f157fd3666758a6ce201387ffb52038c7562e4fff352828da1096c4b6b4` |
| `PoolGraduated(address,uint256,uint256,uint256)` | 1 | `0a44ef75df69c534f43cd6c1aa3ef8983065fe5fe79ef9e79f6494e6f258c259` |
| `GraduationTokensPermanentlyLocked(address,uint256)` | 1 | `a0a18f5bf205becee8b268d7cf69addab8548ae8ef361791464cf0e0e17c1361` |
| `CreatorFeeRecipientUpdated(address,address,address)` | 3 | `308c390ed1ab5873392818e036cabdf408bc8ad042fbaead3108954ff75ba980` |
| `CreatorFeeRecipientChangeProposed(address,address,address,uint256,uint256)` | 3 | `7f119e44c84a715429bee60d30ad2e14afdef6c60bb1a7eaa01290ecf6d1b2e5` |
| `BuybackEnabledUpdated(address,bool,address)` | 2 | `bd886f85b7731f66269f57707414d435bf8df930d3357a10becc48a69377f6d5` |
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

### Querying a decoded event by name

For any decoded event, filter on `Log.Signature.Name` and read `Arguments` directly — no `LogHeader.Data` decoding, and the indexed addresses are right there:

```graphql
{
  EVM(network: robinhood) {
    Events(
      limit: {count: 25}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e"}}
        Log: {Signature: {Name: {is: "TokenLaunched"}}}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From }
      Log { Signature { Name } }
      Arguments {
        Name
        Type
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Integer_Value_Arg { integer }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

Each row returns `token`, `curve`, `deployer`, `pairToken`, `launchConfigId` and `graduationThreshold` as named arguments — including the three indexed addresses that used to be locked away in the topics. `graduationThreshold` is a raw integer in the quote asset's own decimals: `4200000000000000000` is 4.2 ETH, `8090000000` is 8,090 USDG. This works on `realtime`, and on `archive`/`combined` for blocks from 2026-08-14 onward — see the [caution above](#event-reference).

### Querying a raw event by topic0

For the undecoded hook, executor, and locker `TokenSupplyLocked` events — and for **any** event on archive rows older than 2026-08-14 — match the topic0 with `Topics: {includes: […]}`, scope with `LogHeader.Address` where the emitter is a fixed contract, and read `LogHeader.Data`:

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

Topic0 values work with or without the `0x` prefix. `Log: {Signature: {SignatureHash: {is: "…"}}}` is an equivalent filter and, like `Topics`, works on every dataset — see [Datasets](#datasets).

:::caution Scope curve and hook events to an emitter where you can
Bonding curves are one contract per token, so a topic0-only filter on `CurveBuy` is the right scope — it captures every curve on the network at once, and `LogHeader.Address` tells you which one.

For fixed-emitter events, **always add `LogHeader.Address`**. A signature such as `PoolRegistered(bytes32,address,address,address)` is generic enough that unrelated contracts on the chain emit the same topic0 with a *different* indexing layout — same hash, incompatible payload. Filtering topic0 alone will mix them into your results.
:::

### Filtering by an indexed argument

On decoded events, indexed arguments are ordinary named arguments — filter them with `Arguments: {includes: …}`:

```graphql
Arguments: {includes: {
  Name: {is: "token"}
  Value: {Address: {is: "0x11ff6356504e85e792c385b3381f273a4b764cfe"}}
}}
```

On undecoded events (the hook and executor) and on pre-2026-08-14 archive rows, the `Topics` filter is the fallback: `Topics: {includes: [{Hash: {is: "…"}}]}` matches any topic in the log, including topic0 and any indexed address padded to 32 bytes:

```graphql
Topics: {includes: [{Hash: {is: "0x000000000000000000000000<token address without 0x>"}}]}
```

The `0x` prefix is optional here. `includes`, `excludes`, `startsWith`, `endsWith` and `length` are all available.

`Topics` is also a perfectly good topic0 filter on every dataset, which is why the queries on this page use it throughout; `Log.Signature.SignatureHash` works equally well. See [Datasets](#datasets).

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

The simplest launch feed is now the decoded `TokenLaunched` event itself — the [name-filtered query above](#querying-a-decoded-event-by-name) returns `token`, `curve`, `deployer`, `pairToken` and `graduationThreshold` as named arguments on every launch. Stream it as a subscription and you have a live launch tape with zero decoding.

The **`Calls` cube is still worth knowing**, for two reasons: it is the only on-chain source of the launch **metadata** (name, symbol, image, socials — see [Token metadata](#token-metadata)), and its archive reaches back further than decoded event names (Calls archive retention is planned to cap at roughly the last 3 months), whereas decoded event names only reach back to 2026-08-14. `Call.Output` holds the function's return data, and every Pons launch entry point returns the addresses you need:

| Selector (`Call.Input` prefix) | Function | `Call.Output` |
| --- | --- | --- |
| `f85f8e41` | `launchAndBuy(...)` on the router | `(address token, address curve, uint256 tokensOut)` |
| `f35abbcf` | `launchToken(params, launchConfigId, pairToken)` | `(address token, address curve)` |
| `a72101af` | `launchToken(params, launchConfigId, pairToken, snipeTaxExemptions)` | `(address token, address curve)` |
| `d6a0eef5` | `launchTokenFor(...)` — what the router calls internally | `(address token, address curve)` |

`Input: {startsWith: […]}` accepts a list, and the `0x` prefix on each selector is optional. `Call: {Signature: {SignatureHash: {is: "a72101af"}}}` is an equivalent single-selector filter and also runs on `archive`.

### The complete launch feed

```graphql
{
  EVM(network: robinhood, dataset: combined) {
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

:::caution Bound this query, or it times out on realtime
The `Input: {startsWith: […]}` scan is the expensive part. Run unbounded against the default realtime dataset, this exact query hits the gateway timeout (`context deadline exceeded`) rather than returning slowly. Either keep `dataset: combined` (or `archive`) as above, which returns promptly and covers full history, or stay on realtime and add a time bound such as `Block: {Time: {since_relative: {hours_ago: 1}}}`. The subscription form below is unaffected — it only sees new blocks.
:::

:::caution Never match `launchTokenFor` and `launchAndBuy` together
`launchAndBuy` on the router calls `launchTokenFor` on the factory internally, so a filter matching both selectors returns **two rows for the same launch** — one for the router's outer call, one for the factory's inner call. Including `d6a0eef5` alongside `f85f8e41` double-counts every router launch; the three-selector filter above counts each launch once.

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

The `Calls` feed above already runs on `combined`, and `archive` works the same way. But the **launch mint transfer** is a second, independent route to the same list, and it is often the more convenient one: it carries name, symbol and decimals directly from `Currency`, and the mint's `Receiver` **is the bonding curve**. Use it when you want token metadata without decoding calldata, or as a cross-check on the call feed.

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

**Curve trades are now indexed as trades** under their own protocol label — `Protocol: "pons_v2"`, `ProtocolFamily: "Pons"` — and the best place to read them is the **`Trading` cube (Crypto Price API)**: one row per trade with `Side`, `Trader`, and **fully populated `PriceInUsd` / `AmountsInUsd`**, plus [OHLCV candles](#ohlcv-price-candles) that work from the token's very first curve trade. `Trading` coverage starts **2026-08-12** (the EVM `DEXTrades` / `DEXTradeByTokens` cubes start 2026-08-14); for anything earlier, the curve's `CurveBuy` / `CurveSell` events remain the only source.

```graphql
{
  Trading {
    Trades(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        Pair: {Market: {Protocol: {is: "pons_v2"} Network: {is: "Robinhood"}}}
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
        Token { Address Symbol }
        QuoteToken { Symbol }
      }
    }
  }
}
```

Add `Pair: {Token: {Address: {is: "<token>"}}}` to scope to one token — and because the same cube also carries the token's post-graduation `uniswap_v4` trades, dropping the protocol filter gives a token's **entire curve-to-pool trade history in one query**. On `pons_v2` rows `Pair.Pool.Address` is the token's **bonding-curve contract** (it matches `curve` in `TokenLaunched`), so every curve trade hands you the curve address for free. The same trades also appear in the EVM `DEXTrades` / `DEXTradeByTokens` cubes (`ProtocolFamily: "Pons"`, curve contract as `Trade.Dex.SmartContract`), but there `PriceInUSD` / `AmountInUSD` are populated only on the realtime dataset and read `0` on `archive` and `combined` — prefer `Trading`.

The event route below is still what you want for the **fee and tax legs** (`fee`, `tax`, snipe-tax attribution), which the trade cubes do not carry, and for curve trades older than the trade-cube coverage (the `Trading` cube's rolling ~30-day window, 2026-08-14 in the EVM `DEXTrades` cubes).

### Every trade on one token's curve

`CurveBuy` and `CurveSell` are decoded, so filter by name and read the arguments — buyer, seller and recipient included, which used to be unreadable indexed topics. Get the curve address from the [launch feed](#newly-launched-tokens), then filter on it as the emitter. The example curve `0x639a7cd2…` belongs to DECK (token `0x2861f208…`), which launched and graduated after 2026-08-14 so every row is decoded; `dataset: combined` keeps the query working once the curve's trades leave the realtime window:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 50}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x639a7cd26c373db065ad009c60abd623a1983c62"}}
        Log: {Signature: {Name: {in: ["CurveBuy", "CurveSell"]}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address }
      Log { Signature { Name } }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

Drop the `LogHeader.Address` filter to get **every curve trade on the network** in one feed — that is the shape you want for a launch-wide tape, and `LogHeader.Address` identifies the curve on each row.

### Reading the arguments

| Argument | `CurveBuy` | `CurveSell` |
| --- | --- | --- |
| `buyer` / `seller` | wallet that traded | wallet that traded |
| `recipient` | receiver of the tokens | receiver of the quote |
| `quoteIn` / `tokensIn` | quote asset spent | tokens sold |
| `tokensOut` / `quoteOut` | tokens received | quote asset received |
| `fee` | base fee **plus snipe tax** | base fee |
| `tax` | creator tax, paid to the creator in full | creator tax |

Price is `quoteIn / tokensOut` (or `quoteOut / tokensIn` on a sell). All amounts are raw integers in their asset's own decimals — 18 for the token, and the quote asset's own for the quote leg (6 for USDG). The base fee rate comes from the launch's config (`curveFeeBps`) rather than a protocol constant, so derive it from the events rather than assuming 100 bps.

For pre-2026-08-14 archive rows, `Arguments` comes back empty — fall back to the topic0 filter (`ec36bf57…` / `8113d738…` from the [event reference](#curve-events)) and decode `LogHeader.Data` yourself; it carries the four non-indexed words in the order above:

```js
const w = i => BigInt('0x' + data.slice(i * 64, (i + 1) * 64));
const [quoteIn, tokensOut, fee, tax] = [w(0), w(1), w(2), w(3)];
```

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
        Log: {Signature: {Name: {is: "SnipeTaxCharged"}}}
      }
    ) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

`recipient` and `amount` come back as named arguments, `LogHeader.Address` is the curve, and `Transaction.From` is the wallet that paid it — which is to say, **the sniper**. Creators can pre-declare exempt wallets at launch; those emit `SnipeTaxExempted` in the launch transaction, so the exemption list for a launch is recoverable from its own transaction hash.

### Graduation progress

There is no on-chain progress event. Sum the net quote taken in by the curve — `CurveBuy.quoteIn` minus `CurveSell.quoteOut` — and compare it against the launch's `graduationThreshold` (the third word of its `TokenLaunched` payload; **4.2 ETH** for native-quoted launches). The curve's live quote balance is the same figure, so a balance read against the curve address works as a cross-check.

---

## Token lifecycle in one query

Factory events are decoded and they all name the token in a `token` argument, so one `Arguments` filter returns a per-token timeline with each event's name attached. Use `dataset: combined` so the launch is still in range after it leaves the realtime window:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 25}
      orderBy: {ascending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e"}}
        Arguments: {includes: {
          Name: {is: "token"}
          Value: {Address: {is: "0x2861f208e71ced7beab010457bf10f0c1ccc0e2d"}}
        }}
      }
    ) {
      Block { Time Number }
      Transaction { Hash From To }
      Log { Signature { Name } }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

The `Arguments` filter only matches rows that were decoded, so **a token launched before 2026-08-14 returns zero rows here** even though its events exist. For those, the topic-padding form still earns its keep — pad the token address to 32 bytes and filter it as a topic (indexed args live in the topics whether decoded or not):

```graphql
Topics: {includes: [{Hash: {is: "0x0000000000000000000000002861f208e71ced7beab010457bf10f0c1ccc0e2d"}}]}
```

Add the event's topic0 as a second `includes` entry to narrow to one event type — multiple hashes are combined with **AND**. Either way you get the full arc:

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

`PoolGraduated` is decoded, so `Log: {Signature: {Name: {is: "PoolGraduated"}}}` on the factory now returns the token, position id and seeded amounts as named arguments — the quickest graduation feed for recent blocks. Two reasons to still use the hook's **`PoolRegistered`** instead: it also carries `quoteToken` and `creator`, and it works across the full archive (the hook is undecoded, so it never depended on decode coverage in the first place):

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

### The Pons pool of one token

Anyone can initialize a Uniswap v4 pool for any token, and popular Pons tokens attract extra pools with `hooks: 0x000…000` and arbitrary `fee` / `tickSpacing`. To land on the **Pons** pool of a specific token, pass two `Arguments` conditions — the list form is combined with **AND**:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 1}
      where: {
        LogHeader: {Address: {is: "0x8366a39cc670b4001a1121b8f6a443a643e40951"}}
        Log: {Signature: {Name: {is: "Initialize"}}}
        Arguments: {includes: [
          {Name: {is: "hooks"}, Value: {Address: {is: "0xe5e702641ea86f4ae6cc3cdaed2b886f976be044"}}},
          {Name: {is: "currency1"}, Value: {Address: {is: "0x2861f208e71ced7beab010457bf10f0c1ccc0e2d"}}}
        ]}
      }
    ) {
      Block { Time }
      Transaction { Hash To }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
          ... on EVM_ABI_Bytes_Value_Arg { hex }
        }
      }
    }
  }
}
```

The launched token is `currency1` when the quote is native ETH (`currency0` is `0x000…000`); for an ERC-20 quote the two currencies sort by address, so check both slots.

:::note Filter on the hook, not on `Transaction.To`
Scoping this query with `Transaction: {To: {is: "<factory>"}}` looks equivalent and is not: graduation is [permissionless](#graduation), so a keeper contract can call `createGraduatedPool` and carry its own address in `Transaction.To`, and those graduations silently drop out of a `Transaction.To` filter. The hook is on every Pons pool regardless of who triggered it.
:::

:::note Why `fee` is zero
Trading fees on a graduated Pons pool are charged by the **hook**, not by the pool. The pool's own LP fee is `0`, and `HookFeeCollected` on `0xe5e70264…` is where the fee and the creator tax actually show up. Reading `fee` from the `PoolKey` and calling it the trading cost will understate it to zero.
:::

---

## Locked liquidity: verifying the Pons liquidity lock {#liquidity-lock}

A graduated Pons token has **two locks**, and both are visible on-chain:

| Lock | What is locked | Where | Event |
| --- | --- | --- | --- |
| Liquidity position | The full-range Uniswap v4 position seeded with 10/49 of supply plus the graduation quote | `PonsV2LaunchLocker` `0x267444d099b10fb5ed7c3cc7b7c767adca574952` holds the position NFT | `PositionLocked(address indexed owner, uint256 indexed tokenId)` on the locker — **decoded** |
| Supply | 4/49 of supply (≈81,632,653 tokens) | The same locker, as a plain token balance | `TokenSupplyLocked(address indexed token, uint256 amount)` on the locker — **undecoded**, topic0 `af33c4ab…`; `GraduationTokensPermanentlyLocked(token, amount)` on the factory is the decoded twin |

Bitquery sees the effect of the locks, not the contract code: the position NFT and the 4/49 balance sit in the locker and, across every graduated token, never leave it. If you need a code-level guarantee, verify the locker source on the explorer. To verify a specific token's lock on-chain, read `PositionLocked` by the `owner` argument — which is the **launched token address**, not a wallet — and check that `tokenId` matches `positionId` in the token's `PoolGraduated`:

```graphql
{
  EVM(network: robinhood, dataset: combined) {
    Events(
      limit: {count: 5}
      orderBy: {descending: Block_Time}
      where: {
        LogHeader: {Address: {is: "0x267444d099b10fb5ed7c3cc7b7c767adca574952"}}
        Log: {Signature: {Name: {is: "PositionLocked"}}}
        Arguments: {includes: {
          Name: {is: "owner"}
          Value: {Address: {is: "0x2861f208e71ced7beab010457bf10f0c1ccc0e2d"}}
        }}
      }
    ) {
      Block { Time }
      Transaction { Hash }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
    }
  }
}
```

The supply lock is a balance, so the cheapest check is the locker's holding of the token — it should read 4/49 of 1,000,000,000:

```graphql
{
  EVM(dataset: archive, network: robinhood) {
    Holders(
      limit: {count: 1}
      where: {
        Currency: {SmartContract: {is: "0x2861f208e71ced7beab010457bf10f0c1ccc0e2d"}}
        Holder: {Address: {is: "0x267444d099b10fb5ed7c3cc7b7c767adca574952"}}
      }
    ) {
      Holder { Address }
      Balance { Amount }
    }
  }
}
```

To stream every new lock as it happens, subscribe to `PositionLocked` on the locker without the `Arguments` filter — one row per graduation, `owner` is the token.

---

## Trading data in the Trading cube (Crypto Price API)

The `Trading` cube covers a Pons token across both venues: curve trades carry `Protocol: "pons_v2"` (see [Bonding-curve trades](#bonding-curve-trades)), and once graduated the token is an ordinary Uniswap v4 market:

| Field | Value |
| --- | --- |
| `Pair.Market.ProtocolFamily` | `Uniswap` |
| `Pair.Market.Protocol` | `uniswap_v4` |
| `Pair.Market.Network` | `Robinhood` |

:::caution The `pons_v2` protocol label covers curve trades, not graduated pools
The `Trading` cube does have a Pons label — `Protocol: "pons_v2"` — but it marks **bonding-curve trades only**. Once a token graduates, its pool trades are plain `uniswap_v4`, which on Robinhood also covers pools created elsewhere, so **graduated Pons tokens cannot be isolated by protocol filter**. Scope by token address: harvest the set from `PoolRegistered`, then filter `Trading` by `Token.Address: {in: [...]}`. A protocol filter on `pons_v2` plus a token filter together give you a token's full curve + pool trade history in one cube.

On `uniswap_v4` rows `Pair.Pool.Address` is the v4 PoolManager singleton, not a per-pool address (on `pons_v2` rows it is the bonding curve). Use the `PoolId` from `Initialize` when you need to identify one pool.
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
Unlike [pools.trade](/docs/blockchain/robinhood/pools-trade-api#latest-trades-for-a-poolstrade-token), Pons v4 pools return **one row per trade leg** — no deduplication is needed. No dedup pass is needed before summing volume.

One user swap can still fan out into several routed legs across different quote pairs in the same transaction, so summing every leg overstates end-user volume. Graduated tokens commonly trade against both ETH and USDG.
:::

### OHLCV price candles

Candles are built from every `Trading` row, so they start from the token's **first bonding-curve trade** — no need to wait for graduation, and the series runs continuously across the curve-to-pool transition:

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

### Top graduated Pons tokens by trade count {#top-graduated-pons-tokens-by-volume}

Pass a token set harvested from [`PoolRegistered`](#enumerating-graduated-tokens):

```graphql
{
  Trading {
    Tokens(
      limit: {count: 25}
      orderBy: {descendingByField: "trades"}
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
  EVM(dataset: archive, network: robinhood) {
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
# 2. Every bonding-curve trade on the network, fully decoded
subscription {
  EVM(network: robinhood) {
    Events(where: {Log: {Signature: {Name: {in: ["CurveBuy", "CurveSell"]}}}}) {
      Block { Time }
      Transaction { Hash From }
      LogHeader { Address }
      Log { Signature { Name } }
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Address_Value_Arg { address }
          ... on EVM_ABI_BigInt_Value_Arg { bigInteger }
        }
      }
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

Subscribe to `Events` filtered on `Log: {Signature: {Name: {is: "TokenLaunched"}}}` — the event is decoded, and its `token`, `curve` and `deployer` arguments are all readable. Use the `Calls` cube instead when you also want the launch metadata (name, symbol, image, socials) or launch history older than 2026-08-14. See [Newly launched tokens](#newly-launched-tokens).

### Why do my Pons trade queries return nothing?

Check the date range: curve trades appear in the trade cubes (as `Protocol: "pons_v2"`, best read via the `Trading` cube) only within the `Trading` cube's rolling ~30-day window, and from 2026-08-14 onward in the EVM `DEXTrades` cubes. For a token that lived and died on its curve before that, `CurveBuy` / `CurveSell` events on the curve contract are the only trade record. And a `uniswap_v4` filter never matches a pre-graduation token — there is no pool until graduation. See [Bonding-curve trades](#bonding-curve-trades).

### Where do I get a token's name, symbol, image, and socials?

Name, symbol and decimals come from `Transfer.Currency` on any transfer. The IPFS image, description and social links exist only in the launch call's arguments — ABI-decode `Call.Input`. See [Token metadata](#token-metadata).

### Why is my effective fee far above 1%?

The snipe tax. `CurveBuy.fee` bundles the 100 bps base fee with the launch-window penalty, which starts at 9,900 bps and halves down to zero within seconds. `SnipeTaxCharged` isolates the penalty. See [Snipe tax](#snipe-tax).

### How do I tell a Pons pool from any other Uniswap v4 pool on Robinhood?

By the `hooks` field: `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044`. The `Trading` cube's `pons_v2` label covers bonding-curve trades only — graduated pools are plain `uniswap_v4` — and the v4 PoolManager address is shared by the whole chain. See [The Pons pool of one token](#the-pons-pool-of-one-token).

### Can I get Pons history older than the realtime window?

Yes — add `dataset: archive` (or `combined`) to the `EVM` root. Almost every query here supports it, including the `Calls` launch feed and every topic0 filter. Only `DEXPoolEvents`, `DEXPoolSlippages` and `TransactionBalances` are realtime-only. Two caveats: forgetting the `dataset` argument is the usual reason a query looks empty, and **decoded `Signature.Name` / `Arguments` are only populated on archive rows from 2026-08-14 onward** — filter historical ranges by topic0, not by name. See [Datasets](#datasets) and the [event reference](#event-reference).

### Is Pons launchpad liquidity locked?

Yes, twice. The Uniswap v4 position minted at graduation is held by `PonsV2LaunchLocker` (`0x267444d099b10fb5ed7c3cc7b7c767adca574952`), and a further 4/49 of supply sits in the same contract as a locked balance; on-chain, neither has ever left the locker. Both are verifiable per token — see [Locked liquidity](#liquidity-lock).

### What is the Pons launch factory contract address?

`PonsV2LaunchFactory` is `0x7ed598bcef8bd9edd8c97a195c6d13f40801ec7e`. Launches that include a first buy go through the `PonsV2LaunchAndBuy` router at `0xe33e9e479df8802cb0866d5d05258bec4cf62948`, graduated pools carry the `PonsV2MemeHook` at `0xe5e702641ea86f4ae6cc3cdaed2b886f976be044`, and the locker is `0x267444d099b10fb5ed7c3cc7b7c767adca574952`. The full list is in [Pons contract addresses](#contract-addresses).

### Does this page cover Pons V1?

No. V1 is a separate protocol with no bonding curve and different event signatures, and it has stopped producing launches — see the [caution above](#pons-vs-poolstrade).

---

## Next steps

- [Robinhood Trades API](/docs/blockchain/robinhood/robinhood-trades) — full trade schema for the network
- [Robinhood Calls API](/docs/blockchain/robinhood/robinhood-calls-api) — more on `Call.Input` / `Call.Output` and internal calls
- [Robinhood Meme Coin Launches API](/docs/blockchain/robinhood/robinhood-meme-coin-launches) — compare launchpads side by side
- [Pools.trade API](/docs/blockchain/robinhood/pools-trade-api) — the other major Robinhood Chain launchpad
- [Robinhood Token Holders API](/docs/blockchain/robinhood/robinhood-token-holders-api) — holder distribution queries
- [WebSocket subscriptions](/docs/subscriptions/websockets/) — turn any query above into a live stream
