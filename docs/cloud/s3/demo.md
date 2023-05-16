---
sidebar_position: 3
---

# Demo Buckets

Demo S3 buckets are open for a limited access from public domain after the blockchain name with ```demo-streaming-``` prefix:

* ```demo-streaming-eth``` for Ethereum Mainnet
* ```demo-streaming-bsc``` for Binance Smart Chain Mainnet

Buckets are open to list content ( using S3 API ) and get objects ( using S3 and HTTP access).
The easiest way to try them is just download the content using HTTP URLs below.

:::note
AWS S3 region for these buckets is ```us-east-1```
:::

For full access you will need to use AWS S3 API or use [AWS CLI command line interface](/docs/cloud/s3/awscli)


## demo-streaming-eth

The bucket with Amazon Resource Name (ARN): arn:aws:s3:::demo-streaming-eth has public permission
to list objects in the bucket and get any object in it. It contains data about 1000 blocks of
Ethereum Mainnet from 16780000 to 16780999.

Refer to [EVM data schema](/docs/cloud/protobuf/evm) to instructions on decoding the data in the objects.

Bucket has the following folders:

### ```eth.blocks.s3``` 

Example of block object ( height 16780000 ) is:
```
Key: eth.blocks.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4
S3 URI: s3://demo-streaming-eth/eth.blocks.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4
ARN: arn:aws:s3:::demo-streaming-eth/eth.blocks.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4
HTTP: https://demo-streaming-eth.s3.eu-central-1.amazonaws.com/eth.blocks.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4
```

### ```eth.transactions.s3```

Example of transactions object ( height 16780000 ) is:
```
Key: eth.transactions.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_77353d8f2028775059ad7ee3136d57a926162ad74fa350f8c92a1cfd6afa8a56.block.lz4
S3 URI: s3://demo-streaming-eth/eth.transactions.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_77353d8f2028775059ad7ee3136d57a926162ad74fa350f8c92a1cfd6afa8a56.block.lz4
ARN: arn:aws:s3:::demo-streaming-eth/eth.transactions.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_77353d8f2028775059ad7ee3136d57a926162ad74fa350f8c92a1cfd6afa8a56.block.lz4
HTTP: https://demo-streaming-eth.s3.eu-central-1.amazonaws.com/eth.transactions.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_77353d8f2028775059ad7ee3136d57a926162ad74fa350f8c92a1cfd6afa8a56.block.lz4
```

### ```eth.tokens.s3```

Example of token transfers object ( height 16780000 ) is:
```
Key: eth.tokens.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_7663bf0ba77528f26553fdd3650f05de063258a34861a92ea9bc3d113caccfce.block.lz4
S3 URI: s3://demo-streaming-eth/eth.tokens.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_7663bf0ba77528f26553fdd3650f05de063258a34861a92ea9bc3d113caccfce.block.lz4
ARN: arn:aws:s3:::demo-streaming-eth/eth.tokens.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_7663bf0ba77528f26553fdd3650f05de063258a34861a92ea9bc3d113caccfce.block.lz4
HTTP: https://demo-streaming-eth.s3.eu-central-1.amazonaws.com/eth.tokens.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_7663bf0ba77528f26553fdd3650f05de063258a34861a92ea9bc3d113caccfce.block.lz4
```


### ```eth.dextrades.s3```

Example of DEX trades object ( height 16780000 ) is:
```
Key: eth.dextrades.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_0a81237e6f43853cf5ed19cd1a0e527fa6e5b08364d7113d796d9dc9c4b2e7cf.block.lz4
S3 URI: s3://demo-streaming-eth/eth.dextrades.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_0a81237e6f43853cf5ed19cd1a0e527fa6e5b08364d7113d796d9dc9c4b2e7cf.block.lz4
ARN: arn:aws:s3:::demo-streaming-eth/eth.dextrades.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_0a81237e6f43853cf5ed19cd1a0e527fa6e5b08364d7113d796d9dc9c4b2e7cf.block.lz4
HTTP: https://demo-streaming-eth.s3.eu-central-1.amazonaws.com/eth.dextrades.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_0a81237e6f43853cf5ed19cd1a0e527fa6e5b08364d7113d796d9dc9c4b2e7cf.block.lz4
```

## demo-streaming-bsc

The bucket with Amazon Resource Name (ARN): arn:aws:s3:::demo-streaming-bsc has public permission
to list objects in the bucket and get any object in it. It contains data about 1000 blocks of
Binance Smart Chain Mainnet from 26400000 to 26400999.

Refer to [EVM data schema](/docs/cloud/protobuf/evm) to instructions on decoding the data in the objects.


Bucket has the following folders:

### ```bsc.blocks.s3```

Example of block object ( height 26400000 ) is:
```
Key: bsc.blocks.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_898957e990fba5bf505b19a143ff54203b9e52cf44be04d4ea26a32b6f15c108.block.lz4
S3 URI: s3://demo-streaming-bsc/bsc.blocks.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_898957e990fba5bf505b19a143ff54203b9e52cf44be04d4ea26a32b6f15c108.block.lz4
ARN: arn:aws:s3:::demo-streaming-bsc/bsc.blocks.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_898957e990fba5bf505b19a143ff54203b9e52cf44be04d4ea26a32b6f15c108.block.lz4
HTTP: https://demo-streaming-bsc.s3.eu-central-1.amazonaws.com/bsc.blocks.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_898957e990fba5bf505b19a143ff54203b9e52cf44be04d4ea26a32b6f15c108.block.lz4
```

### ```bsc.transactions.s3```

Example of transactions object ( height 26400000 ) is:
```
Key: bsc.transactions.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_a1763ab10e16b01f0441980c6286207c2523fc60c8db36e8f9c94b7fe71030f6.block.lz4
S3 URI: s3://demo-streaming-bsc/bsc.transactions.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_a1763ab10e16b01f0441980c6286207c2523fc60c8db36e8f9c94b7fe71030f6.block.lz4
ARN: arn:aws:s3:::demo-streaming-bsc/bsc.transactions.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_a1763ab10e16b01f0441980c6286207c2523fc60c8db36e8f9c94b7fe71030f6.block.lz4
HTTP: https://demo-streaming-bsc.s3.eu-central-1.amazonaws.com/bsc.transactions.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_a1763ab10e16b01f0441980c6286207c2523fc60c8db36e8f9c94b7fe71030f6.block.lz4
```

### ```bsc.tokens.s3```

Example of tokens transfers object ( height 26400000 ) is:
```
Key: bsc.tokens.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_e5f05450461fab9dd4ad698afaa169a5b94e4f92bbc18677d1ead788f29851e2.block.lz4
S3 URI: s3://demo-streaming-bsc/bsc.tokens.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_e5f05450461fab9dd4ad698afaa169a5b94e4f92bbc18677d1ead788f29851e2.block.lz4
ARN: arn:aws:s3:::demo-streaming-bsc/bsc.tokens.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_e5f05450461fab9dd4ad698afaa169a5b94e4f92bbc18677d1ead788f29851e2.block.lz4
HTTP: https://demo-streaming-bsc.s3.eu-central-1.amazonaws.com/bsc.tokens.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_e5f05450461fab9dd4ad698afaa169a5b94e4f92bbc18677d1ead788f29851e2.block.lz4
```

### ```bsc.dextrades.s3```

Example of DEX trades object ( height 26400000 ) is:
```
Key: bsc.dextrades.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_c3fdd1cf5c47a1127ceaa65cea162f9349e45b1ada3750adb146411b3e94c212.block.lz4
S3 URI: s3://demo-streaming-bsc/bsc.dextrades.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_c3fdd1cf5c47a1127ceaa65cea162f9349e45b1ada3750adb146411b3e94c212.block.lz4
ARN: arn:aws:s3:::demo-streaming-bsc/bsc.dextrades.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_c3fdd1cf5c47a1127ceaa65cea162f9349e45b1ada3750adb146411b3e94c212.block.lz4
HTTP: https://demo-streaming-bsc.s3.eu-central-1.amazonaws.com/bsc.dextrades.s3/000026400000/000026400000_0x17baa3901b546fd9efab6353045c7e437578227e1d156a2ba4a75da96c20dc3c_c3fdd1cf5c47a1127ceaa65cea162f9349e45b1ada3750adb146411b3e94c212.block.lz4
```
