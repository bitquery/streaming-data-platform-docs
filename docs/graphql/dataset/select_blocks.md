---
sidebar_position: 10
---

# Blockchain Reorg Tree


Blocks in the blockhain form a tree ( or directed acyclic graph DAG in general):

![Blockchain graph](/img/diagrams/tree.png)

Blocks that linked together from the highest tip we call the __trunk__ :

![Blockchain trunk](/img/diagrams/trunk.png)

Blocks that not having the highest tip linked to are called __branches__ :

![Blockchain branches](/img/diagrams/branches.png)

Archive database contains only trunk blocks, branches ( forked Block 101 and Block 102 )
are not included in archive database.

:::note
Branched block 102 however is included in realtime database.
:::
## Select Blocks



Select blocks attribute controls realtime and combined database queries in terms of which block data 
to include in the result set.

It has the following options:

* ```trunk``` ( default ) will include only blocks that are on the main curent trunk ( having the maximum height on tip )
* ```branches``` for only branched blocks ( not on trunk )
* ```tree``` all tree, combining trunk and branches

:::tip
You need ```tree``` and ```branches``` only in a very special cases, when you need to analyse the reorganisation tree
of the blockchain.
:::
