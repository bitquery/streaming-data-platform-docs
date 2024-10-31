# How to build a Crypto Price Change Signal Bot on Telegram

This bot fetches real-time trading data from Bitquery and sends alerts on significant token price changes. The bot is built using the `python-telegram-bot` library to handle interactions with Telegram users and `aiohttp` for making asynchronous API requests.

Github Repository Link - [here](https://github.com/bitquery/Price-Change-Signal-Telegram-Bot/tree/main)

import VideoPlayer from "../../src/components/videoplayer.js";

## Tutorial Video

<VideoPlayer url="https://www.youtube.com/watch?v=0jbNXwNRuwE" />

## Components

1. **Libraries and Dependencies**

   - `re`, `asyncio`, `json`, `logging`, `aiohttp`, `os`: For general utilities, asynchronous handling, JSON parsing, and logging.
   - Telegram Libraries (`telegram`, `ApplicationBuilder`, etc.): For Telegram bot interaction.
   - `datetime`: For time manipulation in API requests.

2. **Configuration and Constants**

   - `BOT_TOKEN`: The Telegram bot token from the BotFather.
   - `OAUTH_TOKEN`: The authorization token for the Bitquery API. Check out the steps on how to get it [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/)
   - `logging.basicConfig`: Configures logging to track bot operations and potential errors.

3. **Helper Functions**

   - `split_text(text, max_length)`

     - **Purpose**: Splits long messages into smaller chunks to avoid Telegram's message length limit (4096 characters).
     - **Parameters**:
       - `text (str)`: Message to be split.
       - `max_length (int)`: Character limit.
     - **Returns**: List of text parts.

   - `send_long_message(update, context, long_message, max_message_length=4000)`
     - **Purpose**: Sends long messages in parts to avoid Telegram’s message length limit.
     - **Parameters**:
       - `update`, `context` (Telegram update and context).
       - `long_message (str)`: Message content.
       - `max_message_length` (default=4000).
     - **Operation**: Handles `RetryAfter` exceptions if Telegram’s flood control limit is reached, retrying after a delay.

4. **Core Functions**

   - `send_query_and_process(update, context)`

     - **Purpose**: Sends GraphQL query to Bitquery API, retrieves data, processes, and sends alerts.
     - **Operation**:
       - Creates a query with specified variables.
       - Sends a POST request to Bitquery.
       - Processes the response to calculate price changes over different timeframes (5 minutes and 1 hour).
       - Sorts and formats the data, then sends it to Telegram using `send_long_message`.

   - `calculate_percentage_change(start_price, end_price)`

     - **Purpose**: Calculates and formats the percentage change between two prices.
     - **Parameters**:
       - `start_price`, `end_price (float)`: Starting and ending prices.
     - **Returns**: Formatted string showing percentage change with symbols (📈 or 📉).

   - `format_message(data)`
     - **Purpose**: Formats the retrieved data for user-friendly display in Telegram.
     - **Parameters**:
       - `data (dict)`: JSON data from Bitquery API.
     - **Operation**:
       - Iterates over the trading data items.
       - Formats each data point with trade and volume information, using fallback values if data is missing.
       - Adds a "Trade Now" link for easy access to trading.

5. **Global Flag**

   - `is_task_running`: A global flag to prevent multiple instances of `send_query_and_process` from running concurrently, which could lead to excessive API calls or repeated messages.

6. **Command Handlers**

   - `start_regular_requests(update, context)`

     - **Purpose**: Starts a recurring task to fetch data every 30 minutes.
     - **Operation**:
       - Checks if a task is already running (using `is_task_running`).
       - Sets up a loop to call `send_query_and_process` every 30 minutes.

   - `start(update, context)`
     - **Purpose**: Command handler for `/start`. Triggers `start_regular_requests` to begin data polling.
     - **Usage**: Users send `/start` to the bot to start receiving regular updates.

7. **Main Execution Block**
   - **Purpose**: Initializes the Telegram bot using `ApplicationBuilder` and starts polling for incoming `/start` commands.

## How to Run

1. **Clone the Repository**

   ```bash
   git clone bitquery/Price-Change-Signal-Telegram-Bot
   ```

2. **Set up virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the bot**
   ```bash
   python bot.py
   ```

That's it for this tutorial. Happy coding, happy trading!
