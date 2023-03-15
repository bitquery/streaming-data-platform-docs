---
sidebar_position: 4
---

# Using AWS CLI command line interface

To list objects and download them from cloud you will need to install 
[AWS CLI command line interface](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

After install you can use [S3 commands](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3-commands.html) to interact with S3 storage:

To list the bucket folders:
```
> aws s3 ls --region us-east-1 demo-streaming-eth
                           PRE eth.blocks.s3/
                           PRE eth.dextrades.s3/
                           PRE eth.tokens.s3/
                           PRE eth.transactions.s3/
```

To list objects in folders:

```
> aws s3 ls --region us-east-1 demo-streaming-eth/eth.blocks.s3/
                           PRE 000016780000/
2023-03-15 11:00:52          0

> aws s3 ls --region us-east-1 demo-streaming-eth/eth.blocks.s3/000016780000/ | head
2023-03-15 12:21:36     352610 000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4
2023-03-15 12:21:36     445458 000016780001_0xe51ad733fdc0d348da51100d35f1e3b32329f36fe4175c1438e7c0746eb74215_d9769334af36c0c57fc037ff6455eab2da7dd35a56dff7cfa700de48d1cab682.block.lz4
2023-03-15 12:21:36     489905 000016780002_0x4179971da12ba5111332da4e97e693c6ba538fd3b95086c1e77c62a170c98b60_2ba37e2886073f0017e88e839f4eca869f9d8966e1b2794f8a4d1897ca2ad3db.block.lz4
2023-03-15 12:21:36     706818 000016780003_0x1707a19cb718322985946fb5aebcfa2ac218abee68921226734c9dd46548c930_c7bf76da445b121eadd056b0f2c37ab44ff4cd5f14f293f27ad5e0f8f82a1aaa.block.lz4
2023-03-15 12:21:36     457259 000016780004_0x810bbbd86b0ea46e10a1b967465e3394f3986f91b81f2d8553612b17b51c2ba7_52660efb0d438144072feacaaeaac090dca9533dd4c4385d3ab578368170b8bb.block.lz4
2023-03-15 12:21:36     628685 000016780005_0x696aeb8622c1a684392de03df5eb1be005a643d06186578605dfc70809e596c0_cbdf2e715b5b956945ed20d12dba519afdeae5efb8920fcd6ef11c05b49b37b7.block.lz4
2023-03-15 12:21:36     596971 000016780006_0xe63845618eb21b53825dce0ba203a90e8ada420fac9ceefc4df4327dc1cc5add_55073661dbf029049d53fc3ace583f7faa21d5f197f1fe6316b515e3e780f11b.block.lz4
2023-03-15 12:21:36     414787 000016780007_0xff8e51c5b3d3db1ed47400bcc1c7a17e780e3802aae5354109996f6be5f11973_35cc761bb0ce9cf849b0a0c85a876229a216db4f570c857940072f0fa749ce6b.block.lz4
2023-03-15 12:21:36     511978 000016780008_0x3dee8348ae597f1d59f9c1731e6eb0f31d8ca83fe21b8e876a28f8c26d384615_4a576cedd2a476a2d882376cabd35286c8a0c0c9f7433ce9d60df4786490ecf0.block.lz4
2023-03-15 12:21:36     390520 000016780009_0x35ad2f3e727bc787c3508fd4a470a769d04f7bca7e400b0b9376edbf9f9c71d7_3a544dedebf6891109465dabd8a96c8b05906cab22c05d65ab983b9f9dc03863.block.lz4
```

Download any object then:

```
>aws s3 cp --region us-east-1 s3://demo-streaming-eth/eth.blocks.s3/000016780000/000016780009_0x35ad2f3e727bc787c3508fd4a470a769d04f7bca7e400b0b9376edbf9f9c71d7_3a544dedebf6891109465dabd8a96c8b05906cab22c05d65ab983b9f9dc03863.block.lz4 .
download: s3://demo-streaming-eth/eth.blocks.s3/000016780000/000016780009_0x35ad2f3e727bc787c3508fd4a470a769d04f7bca7e400b0b9376edbf9f9c71d7_3a544dedebf6891109465dabd8a96c8b05906cab22c05d65ab983b9f9dc03863.block.lz4 to ./000016780009_0x35ad2f3e727bc787c3508fd4a470a769d04f7bca7e400b0b9376edbf9f9c71d7_3a544dedebf6891109465dabd8a96c8b05906cab22c05d65ab983b9f9dc03863.block.lz4
> ls -l
-rw-r--r--    1 staff  staff      390520 Mar 15 12:21 000016780009_0x35ad2f3e727bc787c3508fd4a470a769d04f7bca7e400b0b9376edbf9f9c71d7_3a544dedebf6891109465dabd8a96c8b05906cab22c05d65ab983b9f9dc03863.block.lz4
```

Download whole folder:
```
> aws s3 cp --region us-east-1 's3://demo-streaming-eth/eth.dextrades.s3/000016780000' . --recursive
```

