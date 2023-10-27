---
sidebar_position: 4
---

In this final step, this code snippet will calculate the P&L for the specified token over the specified time period. You can modify the code to calculate the P&L for multiple tokens, different time periods, or to use a different P&L calculation formula.

1.  Import the necessary libraries:

```Python
import pandas as pd

```

2.  Get the final and initial balance from the `combined_df` DataFrame:

```Python
final_balance=Balances[0]
initial_balance = Balances.tail(1).values[0]

```

3.  Get the initial and final price from the `trade_earliest` and `trade_latest` DataFrames:

```Python
initial_price=trade_earliest['Trade'][0]['Price']
final_price=trade_latest['Trade'][0]['Price']

```

4.  Convert the string values to floats:

```Python
initial_balance = float(initial_balance)
final_balance = float(final_balance)
initial_price = float(initial_price)
final_price = float(final_price)

```

5.  Calculate the change in balance and change in price:

```Python
change_in_balance = final_balance - initial_balance
change_in_price = final_price - initial_price

```

6.  Calculate the P&L:

```Python
pnl = change_in_balance * change_in_price

```

7.  Print the change in balance and P&L:

```Python
print("change_in_balance ",change_in_balance)
if pnl>0:
    print("Profit",pnl)
else:
    print("Loss",pnl)

```
