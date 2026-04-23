#!/usr/bin/env python3
"""
Generate inline SVG charts for the Bitquery MCP Trading examples docs
from real data captured against the production ClickHouse cluster
(2026-04-23 snapshot).

Re-run this script after refreshing data to update charts in
static/img/mcp/charts/.
"""
from __future__ import annotations

import datetime as dt
import os
from pathlib import Path
from textwrap import dedent

OUT = Path(__file__).resolve().parent.parent / "static" / "img" / "mcp" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

# Bitquery brand-ish palette
BG = "#ffffff"
FG = "#0f172a"
MUTED = "#64748b"
GRID = "#e2e8f0"
ACCENT = "#2563eb"
ACCENT_LIGHT = "#93c5fd"
GREEN = "#16a34a"
RED = "#dc2626"
ORANGE = "#f59e0b"
PURPLE = "#7c3aed"
TEAL = "#0d9488"
PINK = "#db2777"

PALETTE = [ACCENT, GREEN, ORANGE, PURPLE, TEAL, PINK, "#0891b2", "#65a30d", "#9333ea", "#e11d48"]


def fmt_usd(v: float) -> str:
    if v >= 1_000_000_000:
        return f"${v/1_000_000_000:.2f}B"
    if v >= 1_000_000:
        return f"${v/1_000_000:.1f}M"
    if v >= 1_000:
        return f"${v/1_000:.0f}K"
    return f"${v:.0f}"


def write(name: str, svg: str) -> None:
    path = OUT / name
    path.write_text(svg.strip() + "\n")
    print(f"wrote {path}")


# ---------------------------------------------------------------------------
# 1. Top Solana tokens by 24h volume — horizontal bar chart
# ---------------------------------------------------------------------------
def top_tokens_solana_24h() -> None:
    rows = [
        ("MakeTokabu", 319_455_780),
        ("WSOL", 299_249_026),
        ("MakeAliens (DKRd)", 291_197_344),
        ("MakeAliens (7pyn)", 290_780_513),
        ("C0IN", 226_438_525),
        ("SpaceX", 153_822_772),
        ("MakeAliens (3qtA)", 111_499_168),
        ("MakeAliens (AB76)", 111_173_656),
        ("U.S MAGA", 107_129_309),
        ("MakeAliens (Bwpn)", 86_966_392),
    ]
    W, H = 720, 360
    pad_l, pad_r, pad_t, pad_b = 170, 24, 36, 24
    n = len(rows)
    chart_w = W - pad_l - pad_r
    chart_h = H - pad_t - pad_b
    bar_h = chart_h / n - 6
    max_v = max(v for _, v in rows)

    bars = []
    for i, (label, v) in enumerate(rows):
        y = pad_t + i * (chart_h / n)
        w = (v / max_v) * chart_w
        bars.append(
            f'<rect x="{pad_l}" y="{y:.1f}" width="{w:.1f}" height="{bar_h:.1f}" rx="3" fill="{ACCENT}"/>'
            f'<text x="{pad_l - 8}" y="{y + bar_h / 2 + 4:.1f}" text-anchor="end" fill="{FG}" '
            f'font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">{label}</text>'
            f'<text x="{pad_l + w + 6:.1f}" y="{y + bar_h / 2 + 4:.1f}" fill="{FG}" '
            f'font-size="12" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">'
            f'{fmt_usd(v)}</text>'
        )

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Top 10 Solana tokens by 24h volume">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <text x="{pad_l}" y="22" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    Top 10 Solana tokens by 24h DEX volume (Ranking_Weight &gt; 0.7)
  </text>
  {''.join(bars)}
</svg>
""".strip()
    write("top-tokens-solana-24h.svg", svg)


# ---------------------------------------------------------------------------
# 2. Cross-chain DEX 24h volume — donut chart
# ---------------------------------------------------------------------------
def cross_chain_volume_donut() -> None:
    import math

    rows = [
        ("Solana", 25_967_956_957),
        ("BNB Smart Chain", 5_390_157_261),
        ("Ethereum", 2_989_284_502),
        ("Base", 1_520_143_653),
        ("Polygon", 568_848_852),
        ("Arbitrum", 471_467_300),
        ("Tron", 102_238_451),
        ("Optimism", 32_337_160),
    ]
    total = sum(v for _, v in rows)
    W, H = 720, 360
    cx, cy, r_outer, r_inner = 180, 180, 130, 78

    arcs = []
    legend = []
    angle = -math.pi / 2
    for i, (name, v) in enumerate(rows):
        frac = v / total
        sweep = frac * 2 * math.pi
        x1 = cx + r_outer * math.cos(angle)
        y1 = cy + r_outer * math.sin(angle)
        x2 = cx + r_outer * math.cos(angle + sweep)
        y2 = cy + r_outer * math.sin(angle + sweep)
        x3 = cx + r_inner * math.cos(angle + sweep)
        y3 = cy + r_inner * math.sin(angle + sweep)
        x4 = cx + r_inner * math.cos(angle)
        y4 = cy + r_inner * math.sin(angle)
        large = 1 if sweep > math.pi else 0
        d = (
            f"M{x1:.2f},{y1:.2f} "
            f"A{r_outer},{r_outer} 0 {large} 1 {x2:.2f},{y2:.2f} "
            f"L{x3:.2f},{y3:.2f} "
            f"A{r_inner},{r_inner} 0 {large} 0 {x4:.2f},{y4:.2f} Z"
        )
        color = PALETTE[i % len(PALETTE)]
        arcs.append(f'<path d="{d}" fill="{color}"/>')
        legend_y = 60 + i * 32
        legend.append(
            f'<rect x="380" y="{legend_y}" width="14" height="14" rx="3" fill="{color}"/>'
            f'<text x="402" y="{legend_y + 11}" fill="{FG}" font-size="13" font-family="ui-sans-serif, system-ui, sans-serif">{name}</text>'
            f'<text x="565" y="{legend_y + 11}" fill="{FG}" font-size="13" font-weight="600" '
            f'text-anchor="end" font-family="ui-sans-serif, system-ui, sans-serif">{fmt_usd(v)}</text>'
            f'<text x="690" y="{legend_y + 11}" fill="{MUTED}" font-size="12" '
            f'text-anchor="end" font-family="ui-sans-serif, system-ui, sans-serif">{frac*100:.1f}%</text>'
        )
        angle += sweep

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Cross-chain 24h DEX volume share">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <text x="32" y="26" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    24h DEX volume share across chains
  </text>
  {''.join(arcs)}
  <text x="{cx}" y="{cy - 6}" text-anchor="middle" fill="{MUTED}" font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">total</text>
  <text x="{cx}" y="{cy + 18}" text-anchor="middle" fill="{FG}" font-size="20" font-weight="700" font-family="ui-sans-serif, system-ui, sans-serif">{fmt_usd(total)}</text>
  {''.join(legend)}
</svg>
""".strip()
    write("cross-chain-volume.svg", svg)


# ---------------------------------------------------------------------------
# 3. WSOL hourly candlestick chart for last 24h
# ---------------------------------------------------------------------------
def wsol_24h_candles() -> None:
    raw = [
        # (ts, o, h, l, c, v)
        (1776862800, 88.59, 89.1775, 88.4772, 89.1254, 19955916),
        (1776866400, 89.1271, 89.333, 88.5335, 88.7692, 21108840),
        (1776870000, 88.7852, 88.8138, 88.0822, 88.2359, 18302778),
        (1776873600, 88.2311, 88.4826, 87.5611, 87.6745, 12806958),
        (1776877200, 87.6994, 88.0364, 87.6536, 87.8438, 11357992),
        (1776880800, 87.8451, 88.392,  87.824,  87.8301, 8165170),
        (1776884400, 87.7164, 87.8466, 87.1257, 87.393,  13393876),
        (1776888000, 87.393,  87.5115, 87.1099, 87.1584, 6975411),
        (1776891600, 87.1478, 87.6571, 87.1466, 87.6085, 6049588),
        (1776895200, 87.6071, 87.7357, 87.3171, 87.46,   8233444),
        (1776898800, 87.4444, 87.4898, 86.8329, 86.8748, 9970044),
        (1776902400, 86.88,   87.1687, 86.0058, 86.8882, 26457696),
        (1776906000, 86.8756, 86.8815, 86.1577, 86.4594, 13546155),
        (1776909600, 86.4579, 86.4678, 85.7535, 86.009,  14853697),
        (1776913200, 85.9629, 86.1084, 85.5147, 85.801,  12617188),
        (1776916800, 85.798,  86.0071, 85.6677, 85.9959, 6194823),
        (1776920400, 85.9826, 86.1408, 85.5343, 85.8896, 11118545),
        (1776924000, 85.8859, 86.2258, 85.8727, 86.2153, 8020170),
        (1776927600, 86.1978, 86.2304, 85.8789, 85.9204, 6848426),
        (1776931200, 85.9213, 85.965,  85.5677, 85.7207, 8836185),
        (1776934800, 85.745,  85.7461, 85.3015, 85.5425, 8095106),
        (1776938400, 85.5418, 85.6186, 85.2226, 85.4423, 9120243),
        (1776942000, 85.4774, 85.9188, 85.4105, 85.8621, 7095297),
        (1776945600, 85.8635, 86.0983, 85.8368, 86.0391, 30189409),
    ]
    W, H = 720, 380
    pad_l, pad_r, pad_t, pad_b = 56, 16, 36, 80  # extra bottom for volume + axis
    chart_w = W - pad_l - pad_r
    price_h = H - pad_t - pad_b - 60   # 60 reserved for volume strip
    vol_h = 50
    n = len(raw)
    bar_w = chart_w / n
    candle_w = bar_w * 0.55

    p_max = max(r[2] for r in raw)
    p_min = min(r[3] for r in raw)
    pad = (p_max - p_min) * 0.08
    p_max += pad
    p_min -= pad

    v_max = max(r[5] for r in raw)

    def y_price(p):
        return pad_t + (1 - (p - p_min) / (p_max - p_min)) * price_h

    candles = []
    vols = []
    for i, (ts, o, h, l, c, v) in enumerate(raw):
        cx = pad_l + i * bar_w + bar_w / 2
        color = GREEN if c >= o else RED
        # wick
        candles.append(
            f'<line x1="{cx:.2f}" y1="{y_price(h):.2f}" x2="{cx:.2f}" y2="{y_price(l):.2f}" stroke="{color}" stroke-width="1.2"/>'
        )
        # body
        top = y_price(max(o, c))
        bot = y_price(min(o, c))
        body_h = max(bot - top, 1.5)
        candles.append(
            f'<rect x="{cx - candle_w/2:.2f}" y="{top:.2f}" width="{candle_w:.2f}" height="{body_h:.2f}" fill="{color}" rx="1"/>'
        )
        # volume bar
        vh = (v / v_max) * vol_h
        vy = pad_t + price_h + 24 + (vol_h - vh)
        vols.append(
            f'<rect x="{cx - candle_w/2:.2f}" y="{vy:.2f}" width="{candle_w:.2f}" height="{vh:.2f}" fill="{ACCENT_LIGHT}" rx="1"/>'
        )

    # y-axis labels (price)
    y_labels = []
    for i in range(5):
        p = p_min + (p_max - p_min) * (i / 4)
        y = y_price(p)
        y_labels.append(
            f'<line x1="{pad_l}" y1="{y:.2f}" x2="{W - pad_r}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>'
            f'<text x="{pad_l - 8}" y="{y + 4:.2f}" text-anchor="end" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">${p:.2f}</text>'
        )

    # x-axis hour labels (every 4 hours)
    x_labels = []
    for i, (ts, *_rest) in enumerate(raw):
        if i % 4 != 0:
            continue
        cx = pad_l + i * bar_w + bar_w / 2
        hh = dt.datetime.utcfromtimestamp(ts).strftime("%H:%M")
        x_labels.append(
            f'<text x="{cx:.2f}" y="{H - pad_b + vol_h + 14:.2f}" text-anchor="middle" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">{hh}</text>'
        )

    open_first = raw[0][1]
    close_last = raw[-1][4]
    delta = (close_last - open_first) / open_first * 100
    delta_color = GREEN if delta >= 0 else RED

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="WSOL 24h hourly candlesticks">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <text x="{pad_l}" y="22" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    WSOL / USD — 1h candles, last 24h
  </text>
  <text x="{W - pad_r}" y="22" text-anchor="end" fill="{delta_color}" font-size="13" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    {open_first:.2f} → {close_last:.2f} ({delta:+.2f}%)
  </text>
  {''.join(y_labels)}
  {''.join(candles)}
  {''.join(vols)}
  <text x="{pad_l - 8}" y="{pad_t + price_h + 24 + 4:.2f}" text-anchor="end" fill="{MUTED}" font-size="10" font-family="ui-sans-serif, system-ui, sans-serif">vol</text>
  {''.join(x_labels)}
</svg>
""".strip()
    write("wsol-24h-candles.svg", svg)


# ---------------------------------------------------------------------------
# 4. Solana DEX market share — horizontal bar chart
# ---------------------------------------------------------------------------
def solana_dex_share() -> None:
    rows = [
        ("Meteora",        15_970_896_662),
        ("Pumpswap",        8_288_901_340),
        ("Raydium",           704_857_370),
        ("OrcaWhirlpool",     318_519_390),
        ("Manifest",          196_958_870),
        ("GoonFi",            123_480_617),
        ("AlphaQ",            109_917_482),
        ("Pumpfun",           105_111_076),
        ("SolFi",              88_053_481),
        ("PancakeSwap",        51_054_059),
    ]
    W, H = 720, 380
    pad_l, pad_r, pad_t, pad_b = 140, 24, 36, 24
    n = len(rows)
    chart_w = W - pad_l - pad_r
    chart_h = H - pad_t - pad_b
    row_h = chart_h / n
    bar_h = row_h - 8
    max_v = max(v for _, v in rows)

    bars = []
    for i, (label, v) in enumerate(rows):
        y = pad_t + i * row_h
        w = (v / max_v) * chart_w
        color = PALETTE[i % len(PALETTE)]
        bars.append(
            f'<rect x="{pad_l}" y="{y:.1f}" width="{w:.1f}" height="{bar_h:.1f}" rx="3" fill="{color}"/>'
            f'<text x="{pad_l - 8}" y="{y + bar_h/2 + 4:.1f}" text-anchor="end" fill="{FG}" '
            f'font-size="13" font-family="ui-sans-serif, system-ui, sans-serif">{label}</text>'
            f'<text x="{pad_l + w + 6:.1f}" y="{y + bar_h/2 + 4:.1f}" fill="{FG}" '
            f'font-size="13" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">{fmt_usd(v)}</text>'
        )

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Solana DEX market share, 24h volume">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <text x="{pad_l}" y="22" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    Solana DEX market share — 24h USD volume
  </text>
  {''.join(bars)}
</svg>
""".strip()
    write("solana-dex-share.svg", svg)


# ---------------------------------------------------------------------------
# 5. Pump.fun launches per hour — area chart
# ---------------------------------------------------------------------------
def pumpfun_launches_hourly() -> None:
    rows = [
        ("00", 2180), ("01", 1868), ("02", 1856), ("03", 1674), ("04", 1621), ("05", 1520),
        ("06", 1685), ("07", 1893), ("08", 2014), ("09", 1936), ("10", 2113), ("11", 1856),
        ("12", 2174), ("13", 2398), ("14", 2296), ("15", 2660), ("16", 2182), ("17", 2431),
        ("18", 2430), ("19", 2395), ("20", 2698), ("21", 2364), ("22", 2279), ("23", 1861),
        ("00", 1736), ("01", 1505), ("02", 1365), ("03", 1353), ("04", 1404), ("05", 1512),
        ("06", 1608), ("07", 1467), ("08", 1449), ("09", 1503), ("10", 1514), ("11", 1510),
    ]
    W, H = 720, 320
    pad_l, pad_r, pad_t, pad_b = 56, 16, 56, 56
    chart_w = W - pad_l - pad_r
    chart_h = H - pad_t - pad_b
    n = len(rows)
    max_v = max(v for _, v in rows)

    pts = []
    for i, (_, v) in enumerate(rows):
        x = pad_l + (i / (n - 1)) * chart_w
        y = pad_t + (1 - v / max_v) * chart_h
        pts.append(f"{x:.2f},{y:.2f}")
    line_d = "M " + " L ".join(pts)
    area_d = f"M {pts[0].split(',')[0]},{pad_t + chart_h} L " + " L ".join(pts) + f" L {pts[-1].split(',')[0]},{pad_t + chart_h} Z"

    grid = []
    for i in range(5):
        v = max_v * (i / 4)
        y = pad_t + (1 - i / 4) * chart_h
        grid.append(
            f'<line x1="{pad_l}" y1="{y:.2f}" x2="{W - pad_r}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>'
            f'<text x="{pad_l - 8}" y="{y + 4:.2f}" text-anchor="end" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">{int(v):,}</text>'
        )

    x_labels = []
    for i, (lab, _) in enumerate(rows):
        if i % 6 != 0:
            continue
        x = pad_l + (i / (n - 1)) * chart_w
        x_labels.append(
            f'<text x="{x:.2f}" y="{H - pad_b + 14:.2f}" text-anchor="middle" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">{lab}:00</text>'
        )

    total = sum(v for _, v in rows)
    avg = total / n

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Pump.fun new tokens per hour, last 36h">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <defs>
    <linearGradient id="pfGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="{ACCENT}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="{ACCENT}" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <text x="{pad_l}" y="22" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    Pump.fun new tokens per hour — last 36 hours
  </text>
  <text x="{pad_l}" y="40" fill="{MUTED}" font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">
    Total: {total:,}   |   Avg/hr: {avg:.0f}   |   Peak: {max_v:,}
  </text>
  {''.join(grid)}
  <path d="{area_d}" fill="url(#pfGrad)"/>
  <path d="{line_d}" fill="none" stroke="{ACCENT}" stroke-width="2" stroke-linejoin="round"/>
  {''.join(x_labels)}
  <text x="{(pad_l + W - pad_r)/2:.0f}" y="{H - 12}" text-anchor="middle" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">UTC hour</text>
</svg>
""".strip()
    write("pumpfun-launches-hourly.svg", svg)


# ---------------------------------------------------------------------------
# 6. Whale wallet portfolio — buys vs sells per token
# ---------------------------------------------------------------------------
def whale_portfolio() -> None:
    rows = [
        # (symbol, bought_usd, sold_usd)
        ("WSOL",    39_221_628, 44_481_043),
        ("cbBTC",    7_019_935,  6_432_848),
        ("WETH",     3_878_846,  5_184_986),
        ("MET",      4_221_011,  4_216_085),
        ("TRUMP",    3_315_515,  1_204_881),
        ("EURC",     1_010_090,  1_058_785),
        ("WBTC",     1_215_812,    712_091),
        ("JLP",        855_178,  1_025_221),
    ]
    W, H = 720, 360
    pad_l, pad_r, pad_t, pad_b = 84, 24, 56, 56
    chart_w = W - pad_l - pad_r
    chart_h = H - pad_t - pad_b
    n = len(rows)
    group_w = chart_w / n
    bar_w = group_w * 0.36
    max_v = max(max(b, s) for _, b, s in rows)

    bars = []
    for i, (sym, b, s) in enumerate(rows):
        gx = pad_l + i * group_w + group_w / 2
        bh = (b / max_v) * chart_h
        sh = (s / max_v) * chart_h
        bars.append(
            f'<rect x="{gx - bar_w - 2:.1f}" y="{pad_t + chart_h - bh:.1f}" width="{bar_w:.1f}" height="{bh:.1f}" rx="2" fill="{GREEN}"/>'
            f'<rect x="{gx + 2:.1f}" y="{pad_t + chart_h - sh:.1f}" width="{bar_w:.1f}" height="{sh:.1f}" rx="2" fill="{RED}"/>'
            f'<text x="{gx:.1f}" y="{H - pad_b + 14:.1f}" text-anchor="middle" fill="{FG}" font-size="12" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">{sym}</text>'
        )

    grid = []
    for i in range(5):
        v = max_v * (i / 4)
        y = pad_t + (1 - i / 4) * chart_h
        grid.append(
            f'<line x1="{pad_l}" y1="{y:.2f}" x2="{W - pad_r}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>'
            f'<text x="{pad_l - 8}" y="{y + 4:.2f}" text-anchor="end" fill="{MUTED}" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">{fmt_usd(v)}</text>'
        )

    legend = (
        f'<rect x="{pad_l}" y="38" width="14" height="14" rx="3" fill="{GREEN}"/>'
        f'<text x="{pad_l + 20}" y="49" fill="{FG}" font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">Bought (USD)</text>'
        f'<rect x="{pad_l + 130}" y="38" width="14" height="14" rx="3" fill="{RED}"/>'
        f'<text x="{pad_l + 150}" y="49" fill="{FG}" font-size="12" font-family="ui-sans-serif, system-ui, sans-serif">Sold (USD)</text>'
    )

    svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Whale wallet 24h buy vs sell volume per token">
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <text x="{pad_l}" y="22" fill="{FG}" font-size="14" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">
    Whale wallet (MfDuWeqS…) — 24h buy vs sell volume per token
  </text>
  {legend}
  {''.join(grid)}
  {''.join(bars)}
</svg>
""".strip()
    write("whale-portfolio.svg", svg)


if __name__ == "__main__":
    top_tokens_solana_24h()
    cross_chain_volume_donut()
    wsol_24h_candles()
    solana_dex_share()
    pumpfun_launches_hourly()
    whale_portfolio()
    print("done.")
