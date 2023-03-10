---
sidebar_position: 6
---


# Combined Database

When you query combined database, actually the query goes to the archive and real time databases separately
and then the results are joined together.

That's why this is the combination of features of these databases.

:::note
[Select Block](select_blocks) attributes for combined database controls
how you can query the trunk or branch block updates **ONLY for real time database data part**.
:::

:::tip
Typically you should avoid using this type of query, as it is slower than real time and archive
and does not give full consistency of the data.
:::


Also Check [Archive](archive) and [RealTime](realtime) dataset.