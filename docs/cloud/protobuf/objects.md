---
sidebar_position: 2
---

# Objects


Objects are the files encoded in protobuf data schema and compressed using 
[lz4](https://github.com/lz4/lz4) utility.

So the file has extention of ```.lz4```.Before decoding with protobuf, you have to de-compress it
using [lz4](https://github.com/lz4/lz4).

Objects are grouped into folders by 1000 blockchain blocks each. The name of the blocks folder
is padded with vertain number of '0-s', that enable you to sort blocks using S3 search functions.

# Object Naming

Example of the full path to the Object is ```eth.blocks.s3/000001881000/000001881143_0x6076a99f05633913f4746a0b64fbf516c96f528107ba9d10c28919ecbbb50133_d0687720be3358b36f07209d080c3b9600f2ee4300f5abd16e74a4bf539c53d6.block.lz4```

* ```eth.blocks.s3``` is the name of the bucket](/docs/cloud/protobuf/evm) containing EVM Block Objects
* ```000001881000``` contains Objects for blocks between 1881000 and 1881999
* ```000001881143``` is the number of the block
* ```0x6076a99f05633913f4746a0b64fbf516c96f528107ba9d10c28919ecbbb50133``` is the block hash
* ```d0687720be3358b36f07209d080c3b9600f2ee4300f5abd16e74a4bf539c53d6``` is the Object body hash
* ```block.lz4``` is file extention meaning it is block of data with [lz4](https://github.com/lz4/lz4) compression

# Identity

Object object in S3 is naturally identified by the full path. It includes blockchain-related attributes, as 
block hash and block number (or height).

Object content is identified by the Object body hash, also included in the S3 path. 
As many nodes can write to the same stream, the Objects may contain several Objects for the same blockchain block
with different body hash.

# Metadata

Object object in S3 has several specific [metadata](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html) attributes, added to every Object:

![AWS S3 metadata](/img/aws/metadata.png)

There are atttributes common for all Objects:

* ```x-amz-meta-auth-body-hash``` Object body hash. Hash calculated with keccak-256 algorith, with 32 first bytes used.
* ```x-amz-meta-auth-timestamp``` Object timestamp in nanosecond UNIx timestamp
* ```x-amz-meta-auth-Object-id``` Object unique identifier
* ```x-amz-meta-auth-signature``` Object signature
* ```x-amz-meta-auth-signer``` signer of the Object
* ```x-amz-meta-size``` size of the body (uncompressed)

There are specific attributes for the blockchain (depending on schema):

* ```x-amz-meta-descriptor-chain-id``` [blockchain identifier](/docs/graphql/dataset/network)
* ```x-amz-meta-descriptor-block-hash``` block hash
* ```x-amz-meta-descriptor-parent-hash``` block parent hash
* ```x-amz-meta-descriptor-block-number``` block number (height)


# Signature

Object identifier is generated as a concatenation of:

* Object body hash
* timestamp
* descriptor of Object, json serialized (not included in S3 metadata)

It is signed with ECDSA private key of the node owner. 

Object metadata attribute ```x-amz-meta-auth-signer``` shows the owner of the node, which 
generated the Object. Object can be validated with ```x-amz-meta-auth-signature``` attribute.

:::caution
As descriptor is not a part of the Object metadata, you can not validate the signature against the body content.
:::