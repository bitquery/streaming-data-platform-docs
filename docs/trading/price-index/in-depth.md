# Breaking Down Price Streams in Detail

This section is not a necesary reading to start using the APIs, it is an explanation of how we have setup and designed the APIs, what algorithmic rules we follow to show data.
You can go the examples section to start using it.

## Understanding Base and Quote in Pairs API

This section explains the design philosophy and algorithmic choices behind the Pairs data cube, specifically how we determine the base and quote tokens in a trading pair.

In every trading pair, one token is designated as the base, and the other as the quote. The price you see is how much of the quote token is needed to buy 1 unit of the base token.

For example:
If SOL/USDC = 180.0, then 1 SOL costs 180 USDC. Here, SOL is the base and USDC is the quote.

But how do we determine which token is the base and which is the quote?
price feed: pairs -> base and quote differentiated

### The Logic Behind Quote Token Selection

We use the following rules to determine the **quote** token:

1.  **Stablecoin Priority**  
    If one of the tokens is a **stablecoin**, it is chosen as the **quote**.

    > Example: In a USDC/ETH pair, ETH is base, USDC is quote — you get the ETH price in USD.

Stablecoins include:

- USDT
- USDC
- DAI
- USDS
- USD1
- TUSD
- USDD
- USD₮0

2.  **Native Assets vs Another Token**  
    If neither token is a stablecoin but one is a **native token** of the blockchain (e.g., ETH on Ethereum, SOL on Solana, BTC on Bitcoin), we choose the native token as the **quote**.

    > Example: For a wBTC/ETH pair on Ethereum, ETH is quote because it's the native asset of that chain.

3.  **Dynamic Volume-Based Decision**  
    If neither of the above rules apply (i.e., two non-stable, non-native tokens), we determine the quote **dynamically** based on liquidity:

    - We calculate the **trading volume** of both tokens across all stablecoin pairs.
    - The token with the **higher total volume in USD** is selected as the **quote**.

    > This ensures that the quote is the more liquid asset, which leads to more stable and usable price data.
