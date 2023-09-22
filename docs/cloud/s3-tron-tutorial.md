---
sidebar_position: 4
---

# Getting Tron Data from AWS Marketplace - Step by Step Tutorial in Python

We are now offering raw blockchain data on Amazon S3, taking a step towards providing a faster way to build dApps.

Data on S3 uses the `Protobuf` schema that allows for more efficient data transfer and storage. To make things easier, I'll walk you through how to access the storage and parse the data in Python.

For this tutorial, we'll be using readily available sample datasets. So, let's get started!

There are two parts to this : 

- We first download the file, decompress and untar it
- Next we use the proto file to extract specific data

## Downloading from AWS and extracting the file

For this step, you need to get your AWS Access Keys.

- Go to your AWS Console https://aws.amazon.com/console/
- Navigate to your profile -> Security credentials -> Generate Access Key
  ![credentials](/img/aws/aws_cred.png)

You can find the details of the demo buckets here https://docs.bitquery.io/docs/cloud/s3/demo/


