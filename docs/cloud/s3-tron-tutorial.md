---
sidebar_position: 4
---

# Getting Tron Data from AWS Marketplace - Step by Step Tutorial in Python

We are now offering raw blockchain data on Amazon S3, taking a step towards providing a faster way to build dApps.

Data on S3 uses the `Protobuf` schema that allows for more efficient data transfer and storage. To make things easier, I'll walk you through how to access the storage and parse the data in Python.

For this tutorial, we'll be using readily available sample datasets. The complete code repo is available [here](https://github.com/bitquery/AWS-Tron-Sample). So, let's get started!

There are two parts to this :

- We first download the file, decompress and untar it
- Next we use the proto file to extract specific data


## Downloading from AWS and extracting the file

For this step, you need to get your AWS Access Keys.

- Go to your AWS Console https://aws.amazon.com/console/
- Navigate to your profile -> Security credentials -> Generate Access Key
  ![credentials](/img/aws/aws_cred.png)

You can find the details of the demo buckets here https://docs.bitquery.io/docs/cloud/s3/demo/

### Step by Step Tutorial

In this part we will download a compressed file from S3, decompress it, and extract the contents of the tar archive:

**1. Import the necessary libraries.**

```
import lz4.frame
import tarfile
import boto3
import io

```

**2. Create an S3 client.**

```
s3 = boto3.client('s3', aws_access_key_id='keyy id', aws_secret_access_key='keys', region_name='us-east-1')

```

**3. Define the bucket name and block object key.**

```
bucket_name = 'streaming-tron'
block_object_key = 'tron.blocks.s3/000054886000/000054886487_0000000003458057278ecebe85b54d89e4795f4c07efcefacadb7020f45babb2_71992297fe129c7f4b7d2212504a78cac21aea1ea58311211add19a835090762.block.tar.lz4'

```

**4. Define the local path where you want to save the downloaded file.**

```
blocks_local_path = 'C:/Your Path/s3downloadblocks.tar.lz4'

```

**5. Download the file from S3.**

```
s3.download_file(bucket_name, block_object_key, blocks_local_path)

```

**6. Read the compressed data from the file.**

```
compressed_data = open(blocks_local_path, "rb").read()

```

**7. Decompress the data.**

```
decompressed_data = lz4.frame.decompress(compressed_data)

```

**8. Wrap the decompressed data in a file object.**

```
decompressed_file = io.BytesIO(decompressed_data)

```

**9. Extract the contents of the tar archive.**

```
decompressed_file = tarfile.TarFile(fileobj=decompressed_file)
decompressed_file.extractall()
```

## Parsing data from the file

In this section we will decode a base64-encoded hash from a BlockHeader proto message:

**Prerequisites**:

- block_message_pb2 proto message file (available in the repo)


1.  **Import the necessary libraries.**

```
import block_message_pb2
import base64
import binascii

```

2.  **Read the proto message from the file.**

```
with open("block_proto_message", "rb") as f:
    message_data = f.read()

```

3.  **Create a BlockHeader object from the proto message data.**

```
block_message = block_message_pb2.BlockHeader()
block_message.ParseFromString(message_data)

```

4.  **Decode the base64-encoded hash.**

```
decoded_hash = base64.b64decode(block_message.Hash)

```

5.  **Convert the decoded hash to hexadecimal format.**

```
hex_hash = binascii.hexlify(decoded_hash)

```

6.  **Print the hexadecimal hash to the console.**

```
print(hex_hash)
```
