---
slug: arguments-calls-events
title: Arguments for Calls and Events refactored
authors: [astudnev]
tags: [arguments]
---

There is the major modification in the today release of Graphql:

1. Arguments and return value for Calls and Events are now represented as arrays of structures. Use union to read values of arguments. Refer to [arguments](/docs/schema/evm/arguments) for details on data structures.
2. Names of objects in GraphQL schema are simplified and no more contain UUID identifiers. It simplifies working with schema and allows to use fragments easier
3. Set of bug fixed for using arrays, fragments and others