---
sidebar_position: 0
---

# Query Building Principles

You query the data using [GraphQL](https://graphql.org/) language. Basically it
defines simple rules how the schema is defined, and how you can query the data needed
using the schema.

## Schema

Schema defines what data you can query and which options ( arguments ) you can apply to the query.
Schema allows [IDE](/docs/ide/login) to create hints to build the query interactively.
[IDE](/docs/ide/login) also shows the schema on query builder and in Document section.
Only queries matching schema can be successfully executed.

Schema for blockchain data is pretty complicated, but for your queries you do not need to
see it full. Typically you only need a portion of it related to your needs.

## Query vs Subscription

