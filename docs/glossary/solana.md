# Solana Builder Terms Explaination

### Dataset Parameters

Solana API allows you to narrow down your results using these parameters:

- `archive`: Archive dataset contains the data from May 2024 up until the realtime dataset(not including).
- `realtime`: Realtime dataset containing last set of blocks. Eg. only few hours recent data
- `combined`: Combined dataset ( realtime and archive ).

### Filter Parameters

Solana API allows you to narrow down your results using these parameters:

- `limit`: Limit the results to a specified number.
- `limitBy`: Limit results based on a specific field's value.
- `orderBy`: Order results according to a field's value.
- `where`: Filter results based on specific criteria related to the value of the returned field.

### BalanceUpdate API Terms

- `Account`: The specific Solana account that the balance update pertains to.
- `Amount`: The quantity of tokens that were added to or subtracted from the account.
- `AmountInUSD`: AmountInUSD will always be calculated based on the USD value of an asset pulled from centralized exchanges. If it is 0, it means we don't have a USD value. In such cases, you can use counterparty AmountInUSD. For example, if token A is traded against WSOL, and we are showing 0 for token A's AmountInUSD, it means we don't have token A's USD value, but you can use the AmountInUSD of WSOL.
- `Currency`: The type of token or cryptocurrency involved in the balance update.
- `PostBalance`: The account's balance after the update has been applied.
- `PostBalanceInUSD`: The equivalent value of the PostBalance in US dollars at the time of the transaction.
- `PreBalance`: The account's balance before the update was applied.
- `PreBalanceInUSD`: The equivalent value of the PreBalance in US dollars at the time of the transaction.

### Block API Terms

- `Date`: The specific date on which a block was created or recorded on the Solana blockchain.
- `Hash`: A unique identifier generated from the block's data, ensuring data integrity and security.
- `Height`: The position of a block in the blockchain, indicating its order relative to other blocks.
- `ParentHash`: The unique identifier (hash) of the preceding block in the blockchain, linking the current block to its parent.
- `ParentSlot`: The slot number of the block that precedes the current block, used to maintain the order of blocks.
- `RewardsCount`: The number of rewards transactions included in a block, often related to staking or validation rewards.
- `Slot`: A specific time interval in which a block is proposed and validated on the Solana network.
- `Time`: The precise timestamp when the block was created, recorded in Coordinated Universal Time (UTC).
- `TxCount`: The total number of transactions included within a specific block on the Solana blockchain.

### DEXOrders API

DEX Orders API contains Order field in OrderEvent Field which has below attributes:

- `Account`: The Solana account initiating the order.
- `BuySide`: Indicates whether the order is a buy (true) or sell (false).
- `LimitAmount`: The maximum quantity of the asset to be traded.
- `LimitAmountInUSD`: The maximum trade amount expressed in USD.
- `LimitPrice`: The price per unit of the asset specified in the order.
- `LimitPriceInUSD`: The price per unit of the asset specified in USD.
- `Mint`: The specific token mint address for the asset being traded.
- `OrderID`: A unique identifier for the order.
- `Owner`: The owner of the order, typically the Solana wallet address.
- `Payer`: The Solana account responsible for paying transaction fees.

### DEXTradeByTokens API

DEXTradeByTokens API gives us trades wrt a token pair. `Trade{Currency}` is first currency and details just before side are for this first currency. Whereas details such as Account, Amount, Price, PriceInUSD, etc inside side are for side currency. Side also has `type` field which tells us if its a `buy` trade or a `sell` trade. The `type` is wrt the pool and side currency.

DEXTradeByTokens API contains Trade field which has below attributes:

- `Account`: The unique identifier for the wallet involved in the trade.
- `Amount`: The quantity of tokens traded.
- `AmountInUSD`: The value of the traded tokens in US dollars.
- `Currency`: The name of the token being traded.
- `DEX`: This contains `ProtocolName`, `ProtocolFamily`, `ProgramAddress`. Here, Protocol or Program refers to DEX.
- `Index`: The position number of the trade within a sequence.
- `Market`: The address of the trading pair or market.
- `Price`: The rate at which this currency is exchanged for the side currency.
- `PriceInUSD`: The token's price in US dollars
- `Side`: Specifies the `account` address, side `currency`, `amount`, `type` etc.

### DEXTrades API

Using DEXTrades API, you will be able to get the trades and will easily be able to bifurcate according to buyside and sellside.

- `Buy`: Details of the buy side of the trade.
  - `Amount`: Quantity of tokens bought.
  - `AmountInUSD`: Equivalent value of tokens bought in USD.
  - `Price`: Price at which tokens were bought.
  - `PriceInUSD`: Price of bought tokens in USD.
  - `Account`
    - `Address`: Address of the buyer's account.
  - `Currency`: Details such as name, symbol, program address(mint address) of the bought Currency.
- `Dex`: Details of the decentralized exchange.
  - `ProgramAddress`: Address of the DEX program.
  - `ProtocolFamily`: Family of the DEX protocol.
  - `ProtocolName`: Name of the DEX protocol.
- `Market`
  - `MarketAddress`: Address of the trading pair or market.
- `Sell`: Details of the sell side of the trade.
  - `Account`
    - `Address`: Address of the seller's account.
  - `Amount`: Quantity of tokens sold.
  - `AmountInUSD`: Equivalent value of tokens sold in USD.
  - `Price`: Price at which tokens were sold.
  - `PriceInUSD`: Price of sold tokens in USD.
  - `Currency`: Details such as name, symbol, program address(mint address) of the bought Currency.

### Instructions API

Instructions API contains Trade field which has below attributes:

- `Accounts`: Details about the accounts involved, including address, writable status, token mint, owner, and program ID.
- `AncestorIndexes`: Indexes of ancestor instructions in the call path.
- `BalanceUpdatesCount`: The number of balance updates associated with the instruction.
- `CallPath`: The sequence of calls leading to the instruction.
- `CallerIndex`: Index of the calling instruction.
- `Data`: Raw data of the instruction.
- `Logs`: Execution logs generated by the instruction.
- `InternalSeqNumber`: Internal sequence number of the instruction.
- `Index`: Position number of the instruction within the transaction.
- `ExternalSeqNumber`: External sequence number of the instruction.
- `Depth`: Depth of the instruction in the call stack.
- `TokenBalanceUpdatesCount`: Number of token balance updates triggered by the instruction.
- `Program`: Information about the program, including parsed details, name, JSON, arguments, address, and account names. The Accounts addresses that we got above with `Accounts{Address}` are the addresses mapped directly to these `AccountNames`.

### Rewards API

Rewards API contains Trade field which has below attributes:

- `Address`: The wallet address receiving the reward.
- `Amount`: The quantity of tokens rewarded.
- `AmountInUSD`: The value of the rewarded tokens in US dollars.
- `CommissionInUSD`: The commission earned in US dollars.
- `Commission`: The commission percentage earned.
- `RewardType`: The type or category of the reward.
- `PostBalanceInUSD`: The wallet balance after receiving the reward in US dollars.
- `PostBalance`: The wallet balance after receiving the reward in tokens.
- `Index`: The position or sequence number of the reward entry.

### Transactions API

Transactions API contains Trade field which has below attributes:

- `Address`: The address of an account involved in the transaction.
- `IsWritable`: Indicates whether the account can be modified in the transaction.
- `ProgramId`: The identifier of the program associated with a token.
- `Mint`: Token Program Address.
- `BalanceUpdatesCount`: Number of changes in token balances during the transaction.
- `Fee`: The fee paid for executing the transaction.
- `FeeInUSD`: The equivalent fee amount in US dollars.
- `FeePayer`: The account responsible for paying the transaction fee.
- `RecentBlockhash`: The hash of the recent block involved in the transaction.
- `InstructionsCount`: Number of instructions in the transaction.
- `Index`: The position or sequence number of the transaction.
- `Signature`: The digital signature of the transaction.
- `Success`: Indicates whether the transaction was successful.
- `ErrorMessage`: Details of any error encountered during the transaction.
- `Signer`: The account that signed the transaction.
- `TokenBalanceUpdatesCount`: Number of changes in token balances due to the transaction.

### Transfers API

Transfers API contains Trade field which has below attributes:

`Amount`: The quantity of tokens transferred.
`AmountInUSD`: The equivalent value of the transferred tokens in US dollars.
`Authority`: The wallet address that authorized the transfer.
`Index`: The sequential number or position of the transfer event.
`Currency`: Details about the token transferred, including its name, mint address, and metadata address, etc.
`Receiver`: The recipient's wallet address and ownership details of the received tokens.
`Sender`: The sender's wallet address and ownership details of the transferred tokens.

### Currency field Terms Explained

Currency has many attributes. It can be a fungible token or non-fungible token(NFT). So it needs an altogether different explaination of its terms-

- **CollectionAddress**: Collection address of the NFT, if the currency is an NFT.
- **Decimals**: Number of decimals for the token's precision.
- **EditionNonce**: Nonce used to derive the edition account address.
- **Wrapped**: Indicates if the token is wrapped or not.
- **VerifiedCollection**: Indicates if the token's collection is verified.
- **Uri**: URI associated with the token.
- **UpdateAuthority**: Authority allowed to update the token.
- **TokenStandard**: Standard or protocol governing the token.
- **TokenCreator**:
  - **Verified**: Indicates if the token creator is verified.
  - **Share**: Share of the token creator.
  - **Address**: Address of the token creator.
- **Symbol**: Symbol representing the token.
- **SellerFeeBasisPoints**: Basis points of the seller's fee.
- **ProgramAddress**: Address of the program managing the token.
- **PrimarySaleHappened**: Indicates if the primary sale has occurred.
- **Native**: Indicates if the token is native to the blockchain.
- **Name**: Name of the token.
- **MintAddress**: Token Program Address.
- **IsMutable**: Indicates if the token is mutable.
- **Fungible**: Indicates if the token is fungible.
