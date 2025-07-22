# Solana Wash Trades Detector

This project fetches on-chain Solana DEX trades data from Bitquery, labels potential wash-trades based on a set of defined rules, trains an XGBoost model, and deploys an interactive Streamlit dashboard to visualize suspicious trades and compute risk metrics.

## How It Works

1. `Data Collection`:
Live Solana DEX trades are fetched from Bitquery using GraphQL APIs.
2. `Trade Labeling`:
A set of defined rules (e.g., self-trading, repeated trading loops, price spoofing) is applied to label trades as potentially suspicious (wash trades).
3. `Model Training`:
A machine learning model (XGBoost) is trained on the labeled data to learn patterns indicative of wash trading.
4. `Visualization`:
A clean and interactive dashboard built with Streamlit displays incoming trades, volume metrics, risk concentration, and predicted suspicious activity in real time.

## Project Structure

```bash
├── get_data.py             # Fetches trades from Bitquery
├── label.py                # Rule-based labeling functions
├── main.py                 # Preprocesses data, trains XGBoost, saves model + features
├── app.py                  # Streamlit app for live inference & visualization
├── requirements.txt        # List of pip packages required for the project
├── model_features.json     # Saved feature list used during training
├── xgb_wash_model.pkl      # Trained XGBoost model
└── .streamlit/secrets.toml # To store secret keys such as Bitquery Access Token
```

You can checkout the entire codebase of the project [here](https://github.com/Kshitij0O7/wash-trading-detector).