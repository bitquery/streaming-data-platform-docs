---
title: "Solana RFQ API - Jupiter Z & Intent Settlement"
sidebar_label: "Solana RFQ API"
description: "Query and stream Solana RFQ trades: Jupiter Z order_engine fills, quote expiry, maker spreads and tokenized-equity prices, over API and WebSocket."
keywords:
  - Solana RFQ API
  - Jupiter Z API
  - Jupiter RFQ data
  - Solana order_engine fills
  - Mayan Swift API
  - Solana intent settlement
  - tokenized equity price API
  - xStocks RFQ price
  - Solana market maker data
---

# Solana RFQ API

In an RFQ (Request For Quote) trade there is no pool. The taker asks market makers for a
price off chain, a maker signs a firm quote, and the only thing that reaches the chain is a
settlement instruction that moves both legs at once.

Which means the data lands somewhere most people are not looking.

:::danger RFQ fills do not appear in DEX trade data
`DEXTrades` and `DEXTradeByTokens` return zero rows for Jupiter Z, Jupiter Limit Order v2,
Mayan Swift, HumidiFi, Tessera V and ZeroFi. There is no pool and no swap event, so no
`Trade` object is ever created.

A fill leaves one `Instructions` row and two `Transfers` rows. If you compute Solana volume,
price or venue market share from trade tables alone, you are missing this flow, including
some assets that trade nowhere else.
:::

Everything here uses the [Solana Instructions cube](/docs/blockchain/Solana/solana-instructions),
the [Transfers cube](/docs/blockchain/Solana/solana-transfers) and
[Instruction Balance Updates](/docs/blockchain/Solana/solana-instruction-balance-updates).

---

## Quickstart

Endpoint, auth header, and a request you can paste into a terminal right now.

```bash
curl -X POST https://streaming.bitquery.io/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BITQUERY_TOKEN" \
  -d '{"query":"{ Solana { Instructions(limit: {count: 3} orderBy: {descending: Block_Time} where: {Transaction: {Result: {Success: true}} Instruction: {Program: {Address: {is: \"61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH\"} Method: {is: \"fill\"}}}}) { Block { Time } Transaction { Signature } Instruction { Program { Arguments { Name Value { ... on Solana_ABI_BigInt_Value_Arg { bigInteger } } } } } } } }"}'
```

For streams, the same document works over WebSocket at
`wss://streaming.bitquery.io/graphql?token=YOUR_TOKEN` with the `graphql-ws` subprotocol.
See [generating a token](/docs/authorization/how-to-generate) and
[WebSocket authorization](/docs/authorization/websocket).

:::info Query window
Historical depth depends on your plan, so a
query with an old `since` date can come back empty even when the filter is correct. Test
without a date filter first.
:::

---

## Which protocols exist

Two families. Both price off chain, but only the first settles through a named RFQ
instruction.

### Family 1: true RFQ and intent settlement

| Protocol | Program ID | IDL / instruction | What it is |
|---|---|---|---|
| Jupiter Z (JupiterZ) | `61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH` | `order_engine` → `fill` | Same-chain RFQ. The maker signs and pays gas, the taker pays nothing. |
| Jupiter Z (2nd deployment) | `2En5Y11SEAGLNmEezTuRUCwTyzyNReHaMbSnS5gjGsL1` | `order_engine` → `fill` | Same IDL and same maker set, but the taker or a relayer pays gas. |
| Jupiter Limit Order v2 | `j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X` | `limit_order_2` → `fill_order` | Resting maker orders filled by a keeper. |
| Mayan Swift | `mayan34VedncxdK2XobtvWFDXQASUTBXhUVzt2kKgny` | `swift` → `init_order` / `fulfill` / `settle` | Cross-chain intent auction with competing drivers (solvers). |
| 1inch Fusion | `HNarfxC3kYMMhFkxUFeYb8wHVdPzY5t9pupqW5fL2meM` | `fusion_swap` → `fill` | Dutch-auction intents. Deployed, but barely used on Solana. |

### Family 2: proprietary market-maker AMMs

These have RFQ economics (one professional maker quotes, aggregators route to it) with AMM
plumbing (a `swap` instruction against program-owned inventory). Several publish quote
updates directly on chain, covered in [the quote tape](#the-on-chain-quote-tape).

| Venue | Program ID | Indexed as DEX trades? |
|---|---|---|
| SolFi v2 | `SV2EYYJyRz2YhfXwXnhNAevDEui5Q6yrfyo13WtupPF` | Yes |
| GoonFi v2 | `goonuddtQRrWqqn5nFyczVKaie28f3kDkHWkHtURSLE` | Yes |
| BisonFi | `BiSoNHVpsVZW2F7rx2eQ59yQwKxzU5NvBcmKshCSUypi` | Yes |
| AlphaQ | `ALPHAQmeA7bjrVuccPsYPiCvsi428SNwte66Srvs4pHA` | Yes |
| Aquifer | `AQU1FRd7papthgdrwPTTq5JacJh8YtwEXaBfKU3bTz45` | Yes |
| HumidiFi | `9H6tua7jkLhdm3w8BvgpTn5LZNU7g4ZynDmCiNN3q6Rp` | No |
| Tessera V | `TessVdML9pBGgG9yGks7o4HewRaXVAMuoVj4x83GLQH` | No |
| ZeroFi | `ZERor4xhbUycZ6gb9ntrhqscUcZmAbQDjEAtCf4hbZY` | No |

---

## Anatomy of a Jupiter Z fill

One instruction, three arguments, eleven accounts.

```
program:  61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH   (IDL name: order_engine)
method:   fill

arguments
  input_amount    u64   exact amount the taker sends   (raw, token decimals)
  output_amount   u64   exact amount the taker receives (raw, token decimals)
  expire_at       i64   unix timestamp the quote stops being valid

accounts (positional)
  0  taker
  1  maker
  2  taker_input_mint_token_account
  3  maker_input_mint_token_account
  4  taker_output_mint_token_account
  5  maker_output_mint_token_account
  6  input_mint
  7  input_token_program
  8  output_mint
  9  output_token_program
 10  system_program
```

The execution price is exact, so you never touch pool math:

```
price = (output_amount / 10^outDecimals) / (input_amount / 10^inDecimals)
```

There is no fee tier or curve to model. The number on chain is the fill.

:::caution Account 2 is not always a token account
When the taker pays with native SOL, position 2 holds the program ID itself as a stand-in for
an unused optional account. Read mints from positions 6 and 8 rather than assuming every
token account slot is populated.
:::

---

## Latest RFQ fills

```graphql
query LatestRFQFills {
  Solana {
    Instructions(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Block { Time Slot }
      Transaction { Signature Signer Fee }
      Instruction {
        Accounts { Address Token { Mint Owner } }
        Program {
          Method
          AccountNames
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_BigInt_Value_Arg { bigInteger }
              ... on Solana_ABI_Integer_Value_Arg { integer }
            }
          }
        }
      }
    }
  }
}
```

A trimmed real response:

```json
{
  "Block": { "Slot": "436710297", "Time": "2026-08-02T05:57:11Z" },
  "Transaction": {
    "Signature": "5y22FzbLk7iTPQTs6kMuLEjd3P7YGmdNvWM21G4LkFU3pydps7ou9HTkAdw2qRZWTbXhebdEyLGrhgFMJTM7D1Fc",
    "Signer": "CreQJ2t94QK5dsxUZGXfPJ8Nx7wA9LHr5chxjSMkbNft"
  },
  "Instruction": {
    "Accounts": [
      { "Address": "F8FEvP6ekyGhDQLsKopD2qgD1j3qcYeYWJ1cWotJnGhn" },
      { "Address": "CreQJ2t94QK5dsxUZGXfPJ8Nx7wA9LHr5chxjSMkbNft" },
      { "Address": "12To3szF9J3gJGUwYkPJD6Y8efHt3TxD6dsz3fyCddYe" },
      { "Address": "6jz3UuC5tKeYGt5FiX18LRDEeceDmC55jmn5cDUL8wh7" },
      { "Address": "BWZYEPYehnLddXBa31LUo5yDv4ns1tC4RskLrnsqHYfR" },
      { "Address": "2rXQvUwk9P2gQhzoPvVwNFhJAKnSsjoidrXFko2qrqZt" },
      { "Address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
      { "Address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
      { "Address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
      { "Address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
      { "Address": "11111111111111111111111111111111" }
    ],
    "Program": {
      "Method": "fill",
      "Arguments": [
        { "Name": "input_amount",  "Type": "u64", "Value": { "bigInteger": "3298000943" } },
        { "Name": "output_amount", "Type": "u64", "Value": { "bigInteger": "3300746136" } },
        { "Name": "expire_at",     "Type": "i64", "Value": { "bigInteger": "1785650286" } }
      ]
    }
  }
}
```

`Transaction.Signer` is the fee payer. On the main deployment that is always the maker, which
is how you detect gasless RFQ. See [who pays gas](#who-pays-for-the-transaction).

:::warning This response does not name the tokens
The mints are in there (positions 6 and 8, `EPjFWdd5…` and `Es9vMFrz…`) but you get base58,
not symbols or decimals. Two ways to fix that: decode positionally against your own token
list, or use [Instruction Balance Updates](#which-currencies-actually-moved), which returns
`Currency` metadata and USD values directly.
:::

### Decoding a fill

Positions 6 and 8 are the mints, positions 0 and 1 the counterparties. Applied to the
response above:

```js
const KNOWN = {
  So11111111111111111111111111111111111111112: { symbol: "SOL",  decimals: 9 },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { symbol: "USDC", decimals: 6 },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: { symbol: "USDT", decimals: 6 },
};

function decodeFill(node) {
  const accounts = node.Instruction.Accounts.map((a) => a.Address);
  const args = Object.fromEntries(
    node.Instruction.Program.Arguments.map((a) => [a.Name, BigInt(a.Value.bigInteger)])
  );

  const [taker, maker] = accounts;
  const tokenIn = KNOWN[accounts[6]] ?? { symbol: accounts[6].slice(0, 4), decimals: 9 };
  const tokenOut = KNOWN[accounts[8]] ?? { symbol: accounts[8].slice(0, 4), decimals: 9 };

  const amountIn = Number(args.input_amount) / 10 ** tokenIn.decimals;
  const amountOut = Number(args.output_amount) / 10 ** tokenOut.decimals;

  return {
    time: node.Block.Time,
    taker,
    maker,
    feePayer: node.Transaction.Signer,
    pair: `${tokenIn.symbol}/${tokenOut.symbol}`,
    amountIn,
    amountOut,
    price: amountOut / amountIn,
    quoteValidForSec:
      Number(args.expire_at) - Math.floor(Date.parse(node.Block.Time) / 1000),
  };
}
```

Output:

```js
{
  time: '2026-08-02T05:57:11Z',
  taker: 'F8FEvP6ekyGhDQLsKopD2qgD1j3qcYeYWJ1cWotJnGhn',
  maker: 'CreQJ2t94QK5dsxUZGXfPJ8Nx7wA9LHr5chxjSMkbNft',
  feePayer: 'CreQJ2t94QK5dsxUZGXfPJ8Nx7wA9LHr5chxjSMkbNft',
  pair: 'USDC/USDT',
  amountIn: 3298.000943,
  amountOut: 3300.746136,
  price: 1.0008323809020816,
  quoteValidForSec: 55
}
```

A 3,298 USDC to USDT swap at 1.00083, on a quote with 55 seconds left to live.

---

## Which currencies actually moved

If you would rather not decode positions yourself, query the balance updates attached to the
same instruction. This returns `Currency` with symbol and decimals, a signed decimal `Amount`,
and `AmountInUSD`.

```graphql
query RFQFillsWithCurrency {
  Solana {
    InstructionBalanceUpdates(
      limit: { count: 40 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
        BalanceUpdate: { Currency: { Native: false } }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      BalanceUpdate {
        Amount
        AmountInUSD
        Currency { Symbol Name MintAddress Decimals }
        Account { Address Token { Owner } }
      }
    }
  }
}
```

One fill comes back as a readable four-row set. Negative is the sender, positive the receiver:

| Symbol | Amount | AmountInUSD | Token.Owner |
|---|---:|---:|---|
| USD1 | -56.995411 | -56.937057 | `7mXZXgRT6LR8iA…` (taker) |
| USDC | -56.943005 | -56.934574 | `CreQJ2t94QK5ds…` (maker) |
| USD1 | 56.995411 | 56.937057 | `CreQJ2t94QK5ds…` (maker) |
| USDC | 56.943005 | 56.934574 | `7mXZXgRT6LR8iA…` (taker) |

:::caution Native SOL legs behave differently
`Currency: { Native: false }` keeps the SPL token legs and drops lamport noise. When one side
of the trade is native SOL, that side disappears from the results and you will see only the
maker's WSOL row. Remove the filter to catch it, but expect a native SOL leg to emit both a
lamport movement and a WSOL token update for the same value. Do not sum them.
:::

Pair this with the fill instruction when you need `expire_at`, which balance updates do not
carry.

---

## Stream fills in real time

Change `query` to `subscription` and drop the ordering.

```graphql
subscription RFQFillStream {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature Signer }
      Instruction {
        Accounts { Address Token { Mint Owner } }
        Program {
          Arguments {
            Name
            Value {
              ... on Solana_ABI_BigInt_Value_Arg { bigInteger }
            }
          }
        }
      }
    }
  }
}
```

Both Jupiter Z deployments in one stream:

```graphql
subscription AllJupiterZFills {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: {
              in: [
                "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH"
                "2En5Y11SEAGLNmEezTuRUCwTyzyNReHaMbSnS5gjGsL1"
              ]
            }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature Signer }
      Instruction {
        Accounts { Address }
        Program {
          Address
          Arguments {
            Name
            Value { ... on Solana_ABI_BigInt_Value_Arg { bigInteger } }
          }
        }
      }
    }
  }
}
```

The same `decodeFill` function above works on each pushed message.

## The money legs

The Transfers cube gives you two USD-denominated rows per fill. It cannot filter on the RFQ
program directly, so filter on the makers instead, which works because the maker is the fee
payer.

:::caution Do not hard-code the maker set
The addresses below are placeholders. The active maker set is small and it rotates, so pull it
from the [maker leaderboard query](#maker-leaderboard-and-market-share) and substitute the
current values rather than copying these.
:::

```graphql
query RFQTransferLegs {
  Solana {
    Transfers(
      limit: { count: 20 }
      where: {
        Transaction: {
          # replace with the current maker set, see the maker leaderboard query
          Signer: { in: [
            "CreQJ2t94QK5dsxUZGXfPJ8Nx7wA9LHr5chxjSMkbNft"
            "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa"
            "FkaLnX17cXZGyeu3kZGdHCNdFMJJzBrPPYVvd18B3MZp"
          ] }
          Result: { Success: true }
        }
      }
      orderBy: { descending: Block_Time }
    ) {
      Block { Time }
      Transaction { Signature }
      Transfer {
        Amount
        AmountInUSD
        Currency { Symbol MintAddress Decimals }
        Sender { Address }
        Receiver { Address }
      }
    }
  }
}
```

This also catches the maker's own hedging transactions, since those share the same fee payer.
Join back to the `fill` instruction by signature if you need fills only.

---

## Filter fills by asset

Account-level filtering uses `Accounts: { includes: { Address: ... } }`. Pass a mint and you
get every fill where that token was either leg.

```graphql
query RFQFillsForAsset {
  Solana {
    Instructions(
      limit: { count: 25 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: { Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" } }
          Accounts: { includes: { Address: { is: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W" } } }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      Instruction {
        Accounts { Address }
        Program {
          Arguments {
            Name
            Value { ... on Solana_ABI_BigInt_Value_Arg { bigInteger } }
          }
        }
      }
    }
  }
}
```

That mint is SPYx (SP500 xStock). Swap in TSLAx
`XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB` or anything from the
[asset reference](#assets-that-trade-only-on-rfq).

For a stable-quoted pair, price is one line. With `input_mint` USDC (6 decimals) and
`output_mint` TSLAx (9 decimals):

```
price_usd_per_share = (input_amount / 1e6) / (output_amount / 1e9)
```

Invert when the direction is reversed. Both amounts are exact and the quote was firm, so this
is a genuine executed print rather than a mid or an estimate.

---

## Quote expiry: how long a maker commits

`expire_at` minus block time gives the validity remaining at settlement. It is one of the few
places where a market maker's risk appetite is legible on chain.

```graphql
query QuoteExpiry {
  Solana {
    Instructions(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Block { Time }
      Instruction {
        Program {
          Arguments {
            Name
            Value { ... on Solana_ABI_BigInt_Value_Arg { bigInteger } }
          }
        }
      }
    }
  }
}
```

Jupiter Z quotes are minted with roughly a minute of validity and typically land within a few
seconds of issuance, so the remaining validity clusters just under the ceiling. Mayan Swift
intents carry a `deadline` an order of magnitude longer, because a cross-chain fill has to
survive settlement latency on the far side.

Watch the distribution rather than any single fill. Compression in remaining validity is a
volatility signal from professional makers, and it shows up before anything you can read off
an AMM.

---

## Maker leaderboard and market share

```graphql
query RFQMakerActivity {
  Solana {
    Instructions(
      limit: { count: 30 }
      orderBy: { descendingByField: "fills" }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Transaction { Signer }
      Block {
        firstSeen: Time(minimum: Block_Time)
        lastSeen: Time(maximum: Block_Time)
      }
      fills: count
      gasUsd: sum(of: Transaction_FeeInUSD)
    }
  }
}
```

Since the maker pays the fee on the main deployment, grouping by `Transaction.Signer` gives
you the maker leaderboard for free. No extra join, no address list to maintain.

The active maker set is small (low tens) and turns over, so treat any specific roster as a
result you generate rather than a constant. Two patterns hold up across runs and are worth
building around:

- **Fill count and notional rank differently.** The maker with the most fills is usually not
  the maker moving the most money. Rank by both, or you will mistake a dust book for a
  dominant one.
- **Makers specialise by size.** Some quote block flow at thousands of dollars a fill, others
  run dust books averaging a few dollars or less. Dividing notional by fills separates them
  immediately, and the spread they charge tracks that split (see
  [execution quality](#execution-quality-in-basis-points)).

Notional is not returned directly, so pair the query above with
[Instruction Balance Updates](#which-currencies-actually-moved) and sum `AmountInUSD` per
maker.

---

## Who pays for the transaction

```graphql
query RFQFeePayer {
  Solana {
    Instructions(
      limit: { count: 10 }
      orderBy: { descendingByField: "txs" }
      where: {
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
        }
      }
    ) {
      Transaction { Signer Result { Success } }
      txs: count(distinct: Transaction_Signature)
      totalFeeUsd: sum(of: Transaction_FeeInUSD)
    }
  }
}
```

Compare the returned `Signer` set against the takers (account 0) and makers (account 1). The
two deployments differ by design:

- On `61DFfeTK…` the fee payer is the maker, on essentially every fill. The taker pays nothing,
  which is what makes the flow gasless.
- On `2En5Y11S…` the maker never pays. The cost falls on the taker or on a relayer submitting
  for them.

Either way the fee sits close to the base rate: two signatures worth of lamports plus a
negligible priority fee. RFQ fills barely bid in the priority-fee auction, because a firm
off-chain price leaves nothing to front-run. Compare that against any AMM route on the same
chain and the difference is a couple of orders of magnitude.

---

## Execution quality in basis points

You need two sources: the RFQ fill, and an AMM reference price for the same minute.

Pull the RFQ prints with [Latest RFQ fills](#latest-rfq-fills) filtered to one pair, then
compute `price = output/input` with decimals applied. Then pull the AMM reference:

```graphql
query AmmReferencePrice {
  Solana {
    DEXTradeByTokens(
      limit: { count: 100 }
      orderBy: { descending: Block_Time }
      where: {
        Trade: {
          Currency: { MintAddress: { is: "So11111111111111111111111111111111111111112" } }
          Side: { Currency: { MintAddress: { is: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } } }
        }
        Transaction: { Result: { Success: true } }
      }
    ) {
      Block { Time }
      Trade { Price PriceInUSD Amount AmountInUSD }
    }
  }
}
```

For a taker buying the base asset, `bps = (ref - rfq_price) / ref * 10000`. Invert the sign
when selling. Positive means the taker beat the AMM mid.

### What to expect from the result

Run this on a liquid pair such as SOL/USDC and the shape of the answer is consistent, even
though the exact basis points move with volatility and with which makers are active.

:::warning RFQ is usually not cheaper than the AMM on price
Expect the median RFQ fill to price a few basis points *worse* than the AMM mid, with only a
small minority of fills beating it. That gap is the maker's spread, and on liquid pairs it
runs several times the AMM's own effective spread at retail size. If you are benchmarking
venues on price alone, RFQ loses. Verify with your own window rather than trusting a number
published here.
:::

The advantage sits at the two ends of the size distribution:

- **Small trades.** Gasless settlement dominates. When the fee to send an AMM swap is a
  meaningful fraction of a small trade, and a third of those swaps have to be retried, a few
  bps of spread is cheap by comparison.
- **Large trades.** AMM price impact grows with size while the maker's quoted spread stays
  roughly flat. Past a certain notional the pool costs more than the spread, and that
  crossover is the number worth measuring for your own sizes.
- **In between.** Roughly a wash on price, and RFQ wins on certainty instead.

Fill sizes reflect that: the distribution is a barbell, with a large count of very small fills
and most of the notional carried by a handful of large ones. Compute the AMM side by bucketing
`AmountInUSD` and taking the absolute deviation from the minute mid, so you get the crossover
for the pair and period you actually trade.

---

## Landing rate

Bitquery indexes failed transactions, so you can measure how many attempts actually settle.
Drop the `Success` filter and group by result.

```graphql
query LandingRateComparison {
  Solana {
    rfq: Instructions(
      limit: { count: 4 }
      where: {
        Instruction: {
          Program: { Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" } }
        }
      }
    ) {
      Transaction { Result { Success } }
      txs: count(distinct: Transaction_Signature)
    }
    jupiterRoute: Instructions(
      limit: { count: 4 }
      where: {
        Instruction: {
          Program: {
            Address: { is: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4" }
            Method: { in: ["route", "route_v2", "shared_accounts_route", "shared_accounts_route_v2"] }
          }
        }
      }
    ) {
      Transaction { Result { Success } }
      txs: count(distinct: Transaction_Signature)
    }
    solfi: Instructions(
      limit: { count: 4 }
      where: {
        Instruction: {
          Program: {
            Address: { is: "SV2EYYJyRz2YhfXwXnhNAevDEui5Q6yrfyo13WtupPF" }
            Method: { is: "swap" }
          }
        }
      }
    ) {
      Transaction { Result { Success } }
      txs: count(distinct: Transaction_Signature)
    }
  }
}
```

The ordering this produces is stable even as the absolute counts change hour to hour.
Off-chain-quoted settlement lands almost every time it is submitted, because the price was
agreed before the transaction was built and nothing on chain can move underneath it. AMM
routing does not: a large share of submitted swaps fail on slippage or on a stale pool, and
oracle-priced proprietary AMMs fare worst of all because bots race to hit quotes that have
already moved.

Arbitrage-bot spam inflates the AMM failure counts, and a retail-only figure would look
better. The fees on those failures are still real and still paid. If you are choosing what to
route through, run this for your own venues and weigh the landing rate against the spread,
because the gap between the two families is far larger than the few basis points separating
their prices.

---

## Assets that trade only on RFQ

Tokenized equities on Solana settle almost entirely through the RFQ order engine. Two issuers
are active, xStocks from Backed (symbols ending `x`) and Ondo Global Markets (ending `on`),
and a large share of their mints have no DEX trades at all. For those, the `fill` instruction
is the only on-chain price print in existence.

There is a structural reason. You cannot run an AMM for an asset whose underlying is closed 16
hours a day and settles in the traditional system. A broker quotes it, or it does not trade.

```graphql
query TokenizedEquityRFQPrints {
  Solana {
    Instructions(
      limit: { count: 50 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "61DFfeTKM7trxYcPQCM78bJ794ddZprZpAwAnLiwTpYH" }
            Method: { is: "fill" }
          }
          Accounts: {
            includes: {
              Address: {
                in: [
                  "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W"
                  "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ"
                  "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB"
                  "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"
                  "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN"
                  "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu"
                ]
              }
            }
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature Signer }
      Instruction {
        Accounts { Address Token { Mint Owner } }
        Program {
          Arguments {
            Name
            Value { ... on Solana_ABI_BigInt_Value_Arg { bigInteger } }
          }
        }
      }
    }
  }
}
```

### The cross-issuer spread

Both issuers list several of the same underlyings (S&P 500, Nasdaq, Tesla, Alphabet, NVIDIA,
Meta, Microsoft, Intel, Circle, SpaceX). Decode a fill from each and you get two independent
prints of the same asset, quoted by two independent market makers.

In practice they track each other closely, usually well inside a percent. That is a useful
sanity check on your decoding: if `GOOGLx` and `GOOGLon` disagree by orders of magnitude, you
have a decimals bug rather than an arbitrage. It is also a genuine cross-issuer spread you can
stream, and the moments it widens are the interesting ones.

### Liquidity is concentrated

Expect a single maker to be quoting an entire issuer's range, with the second issuer covered
by one or two others. Resolve the current set from account index 1 rather than hard-coding
addresses, because that is exactly the kind of thing that rotates. If the maker for a ticker
stops quoting, the ticker stops trading, which makes a per-issuer maker heartbeat a
worthwhile alert.

A large part of this flow also lands outside US market hours, when the underlying is closed.
The maker is pricing a shut market and carrying the overnight gap risk, which is one reason
the spread here is wider than on a crypto pair.

### Mint reference

| Symbol | Name | Mint |
|---|---|---|
| SPYx | SP500 xStock | `XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W` |
| QQQx | Nasdaq xStock | `Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ` |
| TSLAx | Tesla xStock | `XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB` |
| NVDAx | NVIDIA xStock | `Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh` |
| GOOGLx | Alphabet xStock | `XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN` |
| METAx | Meta xStock | `Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu` |
| MSFTx | Microsoft xStock | `XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX` |
| AMZNx | Amazon.com xStock | `Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg` |
| AAPLx | Apple xStock | `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp` |
| COINx | Coinbase xStock | `Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu` |
| CRCLx | Circle xStock | `XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1` |
| MSTRx | MicroStrategy xStock | `XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ` |
| HOODx | Robinhood xStock | `XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg` |
| INTCx | Intel xStock | `XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM` |
| SPCXx | SpaceX xStock | `Xs3oZwbHvqis4NYcf4YKWmEia2eC84wSiVrcYcTqpH8` |
| SPYon | SPDR S&P 500 ETF (Ondo) | `k18WJUULWheRkSpSquYGdNNmtuE2Vbw1hpuUi92ondo` |
| QQQon | Invesco QQQ (Ondo) | `HrYNm6jTQ71LoFphjVKBTdAE4uja7WsmLG8VxB8ondo` |
| TSLAon | Tesla (Ondo) | `KeGv7bsfR4MheC1CkmnAVceoApjrkvBhHYjWb67ondo` |
| NVDAon | NVIDIA (Ondo) | `gEGtLTPNQ7jcg25zTetkbmF7teoDLcrfTnQfmn2ondo` |
| GOOGLon | Alphabet Class A (Ondo) | `bbahNA5vT9WJeYft8tALrH1LXWffjwqVoUbqYa1ondo` |
| METAon | Meta Platforms (Ondo) | `fDxs5y12E7x7jBwCKBXGqt71uJmCWsAQ3Srkte6ondo` |
| MSFTon | Microsoft (Ondo) | `FRmH6iRkMr33DLG6zVLR7EM4LojBFAuq6NtFzG6ondo` |
| AAPLon | Apple (Ondo) | `123mYEnRLM2LLYsJW3K6oyYh8uP1fngj732iG638ondo` |
| AMDon | AMD (Ondo) | `14diAn5z8kjrKwSC8WLqvBqqe5YmihJhjxRxd8Z6ondo` |
| AVGOon | Broadcom (Ondo) | `1FWZtdWN7y38BSXGzbs8D6Shk88oL9atDNgbVz9ondo` |
| ARMon | Arm Holdings plc (Ondo) | `15SsCZqCsM9fZGhTmP4rdJTPT9WGZKazDSsgeQ8ondo` |
| CRCLon | Circle Internet Group (Ondo) | `6xHEyem9hmkGtVq6XGCiQUGpPsHBaoYuYdFNZa5ondo` |
| INTCon | Intel (Ondo) | `cJpUMp5R7rZ6fGeLHbHhrRuJzK9mkyKDjZqNpT3ondo` |
| MUon | Micron Technology (Ondo) | `Fz9edBpaURPPzpKVRR1A8PENYDEgHqwx5D5th28ondo` |
| MRVLon | Marvell Technology (Ondo) | `FovBwhoV5KQjZCdhoM6jgXYwXLX3F8vgAfvmLH7ondo` |
| SKHYon | SK Hynix (Ondo) | `Huyb2fyDDjSuDKCRWsN9ci2rmcgPo6NFiLbx9ZDondo` |
| SNDKon | SanDisk (Ondo) | `EJmUVvDqAdfH5zEohkdS4234bi3c6iunqEMobjmondo` |
| SPCXon | SpaceX (Ondo) | `wzAyQTorWyoVXuJKj2x8EqKEGJpS13z6EWE9z5Aondo` |
| TSMon | Taiwan Semiconductor (Ondo) | `keybg184d4vyXeQdFqs4o99YsMg7xBthxTJ6Ky3ondo` |
| GLWon | Corning (Ondo) | `YQzNQh2YSFQ6nh91E8Ja71U6JuZDLap5jJCsELGondo` |
| USDon | Ondo US Dollar Token | `ZPFtoCe7WWqG4N3ZFRccS8T9SMBeHsd1Vmgv2i7ondo` |

All Ondo mints use 9 decimals. The [xStocks API page](/docs/blockchain/Solana/xstocks-api)
covers the pool-traded side of these assets.

### What else trades on RFQ

Aggregate `AmountInUSD` from
[Instruction Balance Updates](#which-currencies-actually-moved) grouped by currency pair and
the mix is consistently unlike the Solana DEX tape. SOL against the majors leads, but a large
block of volume is **stablecoin to stablecoin** (USDC/USDT and the newer dollar tokens), with
wrapped BTC and ETH, a handful of large-cap tokens, and the tokenized equities making up the
rest. Long-tail memecoin churn is largely absent.

That mix is the signature of professional treasury and inventory flow rather than retail
speculation, and it is the main reason RFQ notional looks small next to DEX notional while
being far more concentrated per fill.

---

## Jupiter Limit Order v2

Resting orders rather than quotes, but the fill path has the same shape (`taker`, `maker`,
`order`).

```graphql
query JupiterLimitOrders {
  Solana {
    Instructions(
      limit: { count: 20 }
      orderBy: { descendingByField: "cnt" }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X" }
            Method: { in: ["initialize_order", "fill_order", "cancel_order"] }
          }
        }
      }
    ) {
      Instruction { Program { Method } }
      Transaction { Signer }
      cnt: count
      signers: count(distinct: Transaction_Signer)
    }
  }
}
```

Two things fall out of that grouping and both are structural. Orders are cancelled far more
often than they are filled, so treat `initialize_order` as intent rather than volume. And
while many distinct makers create orders, the `fill_order` signer set collapses to a single
Jupiter-operated keeper, which makes the fill path a single point of failure worth monitoring
separately from the orders themselves.

---

## Mayan Swift: cross-chain intents

Solana is both a source and a destination here. `init_order` starts an outbound intent, while
`fulfill` and `settle` complete an inbound one.

```graphql
query MayanSwiftIntents {
  Solana {
    Instructions(
      limit: { count: 20 }
      orderBy: { descending: Block_Time }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "mayan34VedncxdK2XobtvWFDXQASUTBXhUVzt2kKgny" }
            Method: { is: "init_order" }
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature Signer }
      Instruction {
        Accounts { Address }
        Program {
          Method
          AccountNames
          Arguments {
            Name
            Type
            Value {
              ... on Solana_ABI_Json_Value_Arg { json }
              ... on Solana_ABI_BigInt_Value_Arg { bigInteger }
            }
          }
        }
      }
    }
  }
}
```

The `InitOrderParams` JSON carries the complete intent:

```
amount_in_min, amount_out_min      user's limit price
chain_dest, token_out              destination chain (Wormhole chain id) and token
deadline                           intent expiry (minutes, not seconds)
gas_drop                           destination gas top-up
fee_cancel, fee_refund             failure-path economics
addr_ref, fee_rate_ref             referrer address and referral fee rate
fee_rate_mayan                     protocol fee rate
auction_mode                       auction type
```

`addr_ref` and `fee_rate_ref` together give you per-integrator revenue attribution: which
frontend sourced the order, and what it earned.

Outbound and inbound legs run at broadly similar rates, so Solana is a genuine two-way hub
rather than mostly an exit. Decode `chain_dest` against Wormhole chain ids to get the current
destination mix; the major EVM chains dominate it.

:::note Solver concentration
The trader side of Mayan is wide, with a distinct signer on almost every order. The solver
side is not: fulfils come from a very small set of driver addresses, typically with one taking
the large majority. Track drivers with account index 1 on `fulfill` and alert on that set
shrinking, because it is the part of the system with the least redundancy.
:::

To stream cross-chain flow leaving Solana:

```graphql
subscription MayanOutboundIntents {
  Solana {
    Instructions(
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: {
            Address: { is: "mayan34VedncxdK2XobtvWFDXQASUTBXhUVzt2kKgny" }
            Method: { is: "init_order" }
          }
        }
      }
    ) {
      Block { Time }
      Transaction { Signature }
      Instruction {
        Accounts { Address }
        Program {
          Arguments {
            Name
            Value { ... on Solana_ABI_Json_Value_Arg { json } }
          }
        }
      }
    }
  }
}
```

---

## The on-chain quote tape

Several proprietary market makers publish quote updates as top-level instructions that move
zero tokens. They are not trades and appear in no trade table, yet they are the
highest-frequency structured data on Solana.

Use `Instruction.Depth` to tell them apart. Depth `0` is a standalone quote update. Depth `1`
or deeper is a CPI from an aggregator router, meaning a real swap.

```graphql
query QuoteTapeVsFills {
  Solana {
    Instructions(
      limit: { count: 10 }
      orderBy: { descendingByField: "cnt" }
      where: {
        Transaction: { Result: { Success: true } }
        Instruction: {
          Program: { Address: { is: "9H6tua7jkLhdm3w8BvgpTn5LZNU7g4ZynDmCiNN3q6Rp" } }
        }
      }
    ) {
      Instruction { Depth }
      cnt: count
      signers: count(distinct: Transaction_Signer)
    }
  }
}
```

Swap the program address for any venue in
[Family 2](#family-2-proprietary-market-maker-amms) and the depth-0 to depth-1 ratio sorts
them into two architectures:

- **Quote-posting.** Depth-0 instructions vastly outnumber routed fills, often by an order of
  magnitude. HumidiFi, Tessera V, Aquifer and BisonFi work this way, and the busiest of them
  emit updates at a rate measured in millions per day. This is a live market-maker quote feed
  sitting on chain, and it exists in no trade table.
- **Oracle-at-swap.** Little or no depth-0 traffic, because the venue prices from an oracle at
  execution time. SolFi, GoonFi, ZeroFi and AlphaQ sit here. There is nothing to watch until a
  trade lands.

The `signers` count is the second tell. A venue running its whole quote feed from a single
signer is a different operational risk from one spreading it across dozens.

:::caution No IDL for these programs
Bitquery has no IDL for HumidiFi, Tessera V or ZeroFi, so `Program.Method` and `Program.Name`
come back empty and the payload arrives as raw `Instruction.Data`. You get timing, frequency,
signer and account set, but not decoded quote levels.
:::

---

## Notes on method

This page deliberately states patterns and gives you the queries, rather than publishing point
in time statistics that go stale. A few things to get right when you run them yourself:

- **Value the stable leg.** For notional, take the stablecoin side at $1 where one exists and
  fall back to the SOL leg otherwise. `AmountInUSD` on
  [Instruction Balance Updates](#which-currencies-actually-moved) already does this for you.
- **Prefer medians for reference prices.** `average(of: Trade_PriceInUSD)` is badly skewed on
  thin pairs and will hand you a SOL price that is tens of percent wrong. Use a median over a
  liquid pair instead.
- **A minute-median AMM price approximates the mid**, not a same-block quote. It is good
  enough for spread work on liquid pairs and misleading on illiquid ones.
- **Size buckets need volume.** The interesting crossover sits above $100k, where fills are
  rare. Widen the window before drawing conclusions about large size.
- **AMM landing rates include bot traffic.** A retail-only figure is higher. Compare like with
  like if you are using it to justify a routing decision.

One open item: the second `order_engine` deployment is identified here from a shared maker set
and matching IDL, not from protocol documentation.

---

## Related

- [Solana Instructions API](/docs/blockchain/Solana/solana-instructions), the cube most queries here use
- [Instruction Balance Updates](/docs/blockchain/Solana/solana-instruction-balance-updates), for currency and USD on each leg
- [Solana Transfers API](/docs/blockchain/Solana/solana-transfers)
- [Solana Jupiter API](/docs/blockchain/Solana/solana-jupiter-api), the aggregator and routing side
- [xStocks API](/docs/blockchain/Solana/xstocks-api), pool-traded tokenized equities
- [SolFi API](/docs/blockchain/Solana/SolFi-api) and [GoonFi API](/docs/blockchain/Solana/goonfi-api)
- [Solana DEX Orders API](/docs/blockchain/Solana/Solana-DEX-Orders-API), limit-order book data
