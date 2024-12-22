# Add-Liquidity Signals Telegram Bot

This bot fetches real-time data on added liquidity for Solana DEX pools and sends alerts via Telegram. It highlights key details such as added liquidity, post-liquidity amounts, and provides direct trading links.

Github Repository Link - [here](https://github.com/Akshat-cs/Add-Liquidity-Signal-Bot/tree/main)

import VideoPlayer from "../../src/components/videoplayer.js";

## Tutorial Video

<VideoPlayer url="https://www.youtube.com/watch?v=s5GTjKhUmEo" />

## Features

- Monitors added liquidity for Solana DEX pools in real-time.
- Sends detailed updates on:
  - Base and Quote currencies.
  - Added liquidity and post-liquidity values.
  - DEX protocol details.
- Includes "Trade Now" links for immediate trading actions.
- Handles Telegram message length limitations with intelligent splitting.
- Periodically fetches updates (default: every 30 minutes).

## Prerequisites

1. **Python 3.8+** installed on your system.
2. **Telegram Bot Token** from [BotFather](https://telegram.me/BotFather).
3. **Bitquery API Token** for accessing Solana liquidity data. Get your API token [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/).

## Installation

1. Clone this repository and navigate to the project directory:

   ```bash
   git clone https://github.com/Akshat-cs/Add-Liquidity-Signal-Bot
   ```

2. Install the required dependencies:

   ```bash
   pip install python-telegram-bot aiohttp
   ```

3. Replace Bot token and OAuth Token values in the `top-liquidity-additions.py` file with your own tokens. Get the BOT_TOKEN from Bot father and Bitquery OAuth token using these [steps](https://docs.bitquery.io/docs/authorisation/how-to-generate/):

   ```
   BOT_TOKEN=your-telegram-bot-token
    OAUTH_TOKEN=your-bitquery-oauth-token
   ```

4. Start the bot:

   ```bash
   python top-liquidity-additions.py
   ```

5. Use the `/start` command in your Telegram chat with the bot to begin monitoring Solana pools with liquidity additions.

## How It Works

1. **Real-Time Monitoring**:

   - The bot queries the Bitquery API every 30 minutes for liquidity data from Solana DEX pools.
   - Fetches and formats data for pools with added liquidity in the last 5 minutes.

2. **Data Formatting**:

   - Extracts details about:
     - **Base and Quote Currencies**: Names, symbols, and mint addresses.
     - **Liquidity Information**: Added liquidity and post-liquidity values.
     - **Protocol Details**: Protocol family and name.
   - Includes direct "Trade Now" links for each pool.

3. **Message Splitting**:
   - Automatically splits long messages exceeding Telegram's character limit (4096 characters).
   - Handles Telegram's flood control by waiting and retrying if rate limits are exceeded.

## Code Walkthrough

### 1. **Configuration**

- **`BOT_TOKEN`**: Your Telegram bot token from BotFather.
- **`OAUTH_TOKEN`**: Your Bitquery API token for accessing Solana DEX data.
- **Logging**: Configures logging to track bot operations and errors.

### 2. **Helper Functions**

- **`split_text(text, max_length)`**:
  - Splits long messages into smaller parts to adhere to Telegram's 4096-character limit.
- **`send_long_message(update, context, message_generator)`**:
  - Sends long messages as multiple parts.
  - Handles Telegram’s flood control by retrying after delays.

### 3. **GraphQL Query**

- Queries the Bitquery API for Solana DEX pools with recently added liquidity:
  - Filters for pools with added liquidity (`ChangeAmount > 0`).
  - Retrieves market details, added liquidity, and post-liquidity values.
  - Limits results to the top 10 pools based on the `Block_Time`.

### 4. **Core Functions**

- **`send_query_and_process(update, context)`**:

  - Sends the GraphQL query to the API and processes the response.
  - Formats the data into a user-friendly message using `format_message()`.
  - Sends the formatted messages to the Telegram chat.

- **`format_message(data)`**:
  - Processes the API response data to extract:
    - Base and quote currency details.
    - Added liquidity and post-liquidity values.
    - Protocol information and trading links.
  - Constructs HTML-formatted Telegram messages.
  - Splits messages if they exceed the character limit.

### 5. **Task Management**

- **Global Flag (`is_task_running`)**:

  - Prevents multiple instances of the periodic task from running simultaneously.

- **`start_regular_requests(update, context)`**:
  - Continuously fetches and sends updates every 30 minutes.
  - Handles errors gracefully and ensures the global flag resets on task completion.

### 6. **Command Handlers**

- **`/start` Command**:
  - Initializes the bot and starts the periodic task for fetching liquidity updates.

### 7. **Main Execution**

- Initializes the Telegram bot using the `ApplicationBuilder` from `python-telegram-bot`.
- Adds the `/start` command handler to the bot.
- Runs the bot with polling to listen for incoming commands.
