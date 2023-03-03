---
sidebar_position: 6
---


# Combined Database

When you query combined database, actually the query goes to the archive and realtime databases separately
and then the results are joined togerther.

That's why this is the combination of features of these databases.

:::note
[Select Block](select_blocks) attribute for combined database controls
how you can query the trunk or branch block updates **ONLY for realtime database data part**.
:::

:::tip
Typically you should avoid using this type of query, as it is slower than realtime and archive
and does not give full consistency of the data.
:::


Also Check [Archive](archive) and [RealTime](realtime) dataset.