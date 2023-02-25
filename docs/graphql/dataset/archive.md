---
sidebar_position: 5
---

# Archive Database

Archive database contains the data with the delay from tens of minutes to several hours,
depening on the blockchain. It contains the data from the first ( genesis ).

You need to query it when you need:

* statistics, where the latest data does not contribute much value
* all the blocks including the blockchain
* aggegated queries, like balances, counts, volumes

Realtime Database features:

* includes all blocks from the genesis ( first one )
* has a strong consistency of the data
* only trunk blocks included
* has significant delay of data ( from tens of minutes to hours )
* queries need to be optimized, as the archive size quite significant