# Model Training

This script handles the entire training pipeline for detecting wash trades using an XGBoost classifier. It combines real trade data from Bitquery, rule-based labeling, feature preprocessing, model training, evaluation, and model serialization.

## Code Breakdown

### Imports

```py
import pandas as pd
from get_data import get_trades
from label import label_trades
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle
import json
```

### Data Processing

The code snippet given below fetch live DEX trade data from Bitquery, apply rule-based labeling and modify the labelled dataframe to prepare datasets for training the model. Here:

- `X` = All the features.
- `Y` = Binary label indicating whether the trade is suspicious.

Finally the model features are stored in a `JSON` list for consistent preprocessing during inference.

```py
trade_data = get_trades()
df = label_trades(trade_data)

for col in df.columns:
    if df[col].dtype == 'object' and col != 'is_wash_trade':
        df[col] = df[col].astype('category')

X = df.drop(columns=["is_wash_trade"])
y = df["is_wash_trade"]

with open("model_features.json", "w") as f:
    json.dump(X.columns.tolist(), f)
```

### Split Dataset for Training and Testing

This splits the data into `80%` for training and `20%` for testing, using a fixed random seed for reproducibility.

```py
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Train XGBoost Classifier

The model is trained on Bitquery DEX trades data in the code given below.

```py
model = XGBClassifier(enable_categorical=True, tree_method='hist')
model.fit(X_train, y_train)
```

Notes:
- `enable_categorical`=True allows XGBoost to natively handle categorical features.
- `tree_method`='hist' improves training speed.

### Save the Trained Model

The trained model is stored in a pickle file with `.pkl` extension and will be later loaded in app.py for inference.

```py
with open("xgb_wash_model.pkl", "wb") as f:
    pickle.dump(model, f)
```

### Evaluate Model

The code snippet below, prints performance metrics like precision, recall, F1-score for both wash and non-wash trades.

```py
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
```