# Pairs Cube


```
subscription{
  Trading {
    Pairs(
      where: {Currency: {Id: {is: "bid:bitcoin"}}, QuoteCurrency: {Id: {is: "usdt"}}}
    ) {
      Currency {
        Name
        Id
      }
      Market {
        Name
        NetworkBid
        Network
        Address
      }
      Price {
        IsQuotedInUsd
        Average {
          Mean
        }
      }
      QuoteCurrency {
        Id
        Symbol
        Name
      }
      QuoteToken {
        Symbol
        Name
        Id
        NetworkBid
        Network
        Did
        Address
      }
      Token {
        Name
        Id
        NetworkBid
      }
    }
  }
}

```