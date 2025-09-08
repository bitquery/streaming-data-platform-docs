# Solana Logs API

Solana Logs API helps you filter program instruction logs using regular expressions.



# Finding Instructions with Log Matching

The Solana Logs API allows you to search for specific instructions based on log content that matches exact phrases. For example, to find logs related to 'AnchorError' with a specific error code and message
You can find the query [here](https://ide.bitquery.io/SlippageToleranceExceeded#)

```
{
  Solana {
    Instructions(
      limit: {count: 1}
      where: {Instruction: {Logs: {includes: {is: "Program log: AnchorError occurred. Error Code: SlippageToleranceExceeded. Error Number: 6001. Error Message: Slippage tolerance exceeded."}}}}
    ) {
      Instruction {
        Accounts {
          Address
        }
        Data
        Index
        Logs
        ExternalSeqNumber
        Program {
          Json
          AccountNames
          Method
          Name
          Arguments {
            Name
            Type
          }
        }
        Index
      }
      Transaction {
        Result {
          ErrorMessage
        }
      }
    }
  }
}

```

## Filtering Instructions using Not Like Filter

To exclude instructions containing specific log phrases such as 'AnchorError' you can use the `notLike` filter.

You can find the query [here](https://ide.bitquery.io/Not-Anchor-Error-Solana-Logs)

```
{
  Solana {
    Instructions(
      limit: {count: 1}
      where: {Instruction: {Logs: {includes: {notLike: "Program log: AnchorError occurred."}}}}
    ) {
      Instruction {
        Accounts {
          Address
        }
        Data
        Index
        Logs
        ExternalSeqNumber
        Program {
          Json
          AccountNames
          Method
          Name
          Arguments {
            Name
            Type
          }
        }
        Index
      }
      Transaction {
        Result {
          ErrorMessage
        }
      }
    }
  }
}

```

## Finding Instructions using Like Filter

To find instructions based on logs that contain specific patterns or keywords, such as an invoke log, you can use the `like` filter.

```
{
  Solana {
    Instructions(
      limit: {count: 1}
      where: {Instruction: {Logs: {includes: {like: "Program Vote111111111111111111111111111111111111111 invoke [1]"}}}}
    ) {
      Instruction {
        Accounts {
          Address
        }
        Data
        Index
        Logs
        ExternalSeqNumber
        Program {
          Json
          AccountNames
          Method
          Name
          Arguments {
            Name
            Type
          }
        }
        Index
      }
      Transaction {
        Result {
          ErrorMessage
        }
      }
    }
  }
}

```
## Searching Logs using a Particular Keyword

To find instructions based on logs that contain specific patterns or keywords, such as an ZETA market log, you can use the `includes` filter which searches for the presence of the keyword as a whole in the log. 
You can run the query [here](https://ide.bitquery.io/Solana-Zeta-Market-logs)

```
{
  Solana {
    Instructions(
      where: {Instruction: {Logs: {includes: {includes: "ZETA"}}}}
      limit: {count: 10}
    ) {
      Transaction {
        Signature
      }
      Instruction {
        Logs
      }
    }
  }
}
```