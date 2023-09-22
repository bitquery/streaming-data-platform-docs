---
sidebar_position: 3
---

# Getting Ethereum Data from AWS Marketplace- Tutorial

We are now offering raw blockchain data on Amazon S3, taking a step towards providing a faster way to build dApps.

Data on S3 uses the `Protobuf` schema that allows for more efficient data transfer and storage. To make things easier, I'll walk you through how to access the storage and parse the data in Python.

You can access the product on the AWS Marketplace here: https://aws.amazon.com/marketplace/pp/prodview-oi4sbdu6zro3i

For this tutorial, we'll be using readily available sample datasets. So, let's get started!

![marketplace](/img/aws/marketplace.png)

## What does this code do?

This code performs the download and processing of two different files from an Amazon Web Services (AWS) S3 bucket. Specifically, it downloads two files, decompresses them, and extracts information from them using Protocol Buffers.

You can access the complete Git repo here: https://github.com/bitquery/S3-Sample-Parse-Tutorial/tree/main

## Step-by-Step Implemention

### Import the necessary libraries

```python

import boto3

import lz4.frame

import block_message_pb2

import json

import dex_block_message_pb2

from google.protobuf.json_format import MessageToJson

```

### Access S3 bucket

For this step, you need to get your AWS Access Keys.

- Go to your AWS Console https://aws.amazon.com/console/
- Navigate to your profile -> Security credentials -> Generate Access Key
  ![credentials](/img/aws/aws_cred.png)

You can find the details of the demo buckets here https://docs.bitquery.io/docs/cloud/s3/demo/

The first part of the code uses the boto3 library to connect to the S3 bucket with the specified credentials. It then defines two object keys, block_object_key and dextrades_object_key, which correspond to the S3 object keys for the two files to be downloaded. It also specifies two local file paths, blocks_local_path and dextrades_local_path, which are where the downloaded files will be saved on the local system.

```python

s3 = boto3.client('s3', aws_access_key_id='YOUR ID', aws_secret_access_key='YOUR KEY', region_name='us-east-1')

bucket_name = 'demo-streaming-eth'

block_object_key = 'eth.blocks.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_41452bd33251301d32c606c704120d027de580505d611e4fb1c5ff3ef51d0cb7.block.lz4'

dextrades_object_key = 'eth.dextrades.s3/000016780000/000016780000_0xf127ae770b9b73af1be93e5a7ac19be5e3bac41673b2685c6b4619fb09af09f0_0a81237e6f43853cf5ed19cd1a0e527fa6e5b08364d7113d796d9dc9c4b2e7cf.block.lz4'

blocks_local_path = 'PATH TO YOUR FILE/s3downloadblocks.lz4'

dextrades_local_path = 'PATH TO YOUR FILE/s3downloaddextrades.lz4'

```

### Download the Files

In this step we use **block_message_pb2** and **dex_block_message_pb2** which are protobuf message files which contains the structure of the data.

We use the s3.download_file() method to download the file specified by block_object_key from the S3 bucket and save it to the local file path specified by blocks_local_path. The downloaded file is in a compressed format, so the code then uses the lz4.frame.decompress() method from the lz4 library to decompress the data.

```python

s3.download_file(bucket_name, block_object_key, blocks_local_path)

with open(blocks_local_path, 'rb') as f:

compressed_data = f.read()

decompressed_data = lz4.frame.decompress(compressed_data)

print('here')

block_headers = block_message_pb2.BlockHeader()

block_headers.ParseFromString(decompressed_data)

print('here1')

```

### Write to JSON files

The decompressed data is then parsed using the block_message_pb2.BlockHeader() method, which returns an object containing information about the block headers. The code then converts this object to a JSON string using the MessageToJson() method from the google.protobuf.json_format library and saves it to a file named block_headers.json.

```python

with open('block_headers.json', 'w') as f:

json_string = MessageToJson(block_headers)

f.write(json_string)

```

### Repeat the same for Dex Trades

The second part of the code follows a similar structure to the first part. It downloads the file specified by dextrades_object_key from the S3 bucket and saves it to the local file path specified by dextrades_local_path.

It then uses the lz4.frame.decompress() method to decompress the data and parses it using the dex_block_message_pb2.DexInfo() method, which returns an object containing information about the dextrades.

The code again converts this object to a JSON string using the MessageToJson() method .

```python

#### dextrades###

s3.download_file(bucket_name, dextrades_object_key, dextrades_local_path)

with open(dextrades_local_path, 'rb') as f:

dex_compressed_data = f.read()

dex_decompressed_data = lz4.frame.decompress(dex_compressed_data)

print('here3')

dextrades = dex_block_message_pb2.DexBlockMessage()

dextrades.ParseFromString(dex_decompressed_data)

```

### Converting the data to Hex

We write a `decode_all_fields` function takes a JSON object and decodes all of the base64-encoded strings in the object. The function first checks if the object is a dictionary or a list. If the object is a dictionary, the function recursively calls itself on each of the object's keys and values. If the object is a list, the function recursively calls itself on each of the elements in the list.

The function then checks if the value is a string. If the value is a string and the key is not in the `fields_to_skip` list, the function decodes the string using base64 and then converts the decoded string to hexadecimal. If the key is in the `fields_numerical` list, the function also converts the hexadecimal value to an integer.

```

def decode_all_fields(dex_json_object):
    """
    Decodes all of the base64-encoded strings in a JSON object.

    Args:
        dex_json_object: The JSON object to decode.

    Returns:
        The decoded JSON object.
    """

    fields_to_skip = [
        "GasLimit",
        "GasUsed",
        "Time",
        "ProtocolName",
        "ProtocolFamily",
        "Name",
        "Symbol",
        "ProtocolVersion",
        "Config",
    ]

    fields_numerical = ["Number", "Amount", "BaseFee", "ChainId"]

    if isinstance(dex_json_object, dict):
        for key, value in dex_json_object.items():
            if isinstance(value, dict):

                dex_json_object[key] = decode_all_fields(value)
            elif isinstance(value, list):

                for i in range(len(value)):
                    value[i] = decode_all_fields(value[i])
            elif isinstance(value, str) and key not in fields_to_skip:

                decoded_value = base64.b64decode(value)
                hex_decoded_value = "0x" + \
                    binascii.hexlify(decoded_value).decode()

                if key in fields_numerical:
                    Int_hex_decoded_value=int(hex_decoded_value,16)
                    hex_decoded_value=Int_hex_decoded_value
                    print(Int_hex_decoded_value)
                dex_json_object[key] = hex_decoded_value

    elif isinstance(dex_json_object, list):
        for i, item in enumerate(dex_json_object):
            if isinstance(item, dict):
                dex_json_object[i] = decode_all_fields(item)

    return dex_json_object
```

The `fields_to_skip` list contains a list of strings that should not be decoded. These strings are typically used for metadata or other information that does not need to be decoded.

The `fields_numerical` list contains a list of strings that are numerical values. These strings are decoded and converted to integers before being added to the decoded JSON object.

#### Convert the Values

Then we will continue to call this function to parse nested items in the dexBlockMessage data:

```
dex_json_string = json.loads(MessageToJson(dextrades))

print(type(dex_json_string["Trades"][0]["Dex"]["Currencies"]))
for i in range(len(dex_json_string["Trades"])):
    dex_json_string["Trades"][i]["Dex"] = decode_all_fields(
        dex_json_string["Trades"][i]["Dex"])
    dex_json_string["Trades"][i]["Buy"] = decode_all_fields(
        dex_json_string["Trades"][i]["Buy"])
    dex_json_string["Trades"][i]["Sell"] = decode_all_fields(
        dex_json_string["Trades"][i]["Sell"])

dex_json_string["Header"] = decode_all_fields(dex_json_string["Header"])
dex_json_string["Chain"]= decode_all_fields(dex_json_string["Chain"])
```

#### Save to file

```
with open('file_hex.json', 'w') as file:
    json.dump(dex_json_string, file, indent=4)
```
