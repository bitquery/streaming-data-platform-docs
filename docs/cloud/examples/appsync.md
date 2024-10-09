---
sidebar_position: 6
---

# How to Integrate Lambda Function with Appsync to get Ethereum Data from AWS (Use AWS for Web3 )

We will be using Lambda functions to use Ethereum data from [S3 buckets](/docs/cloud/protobuf/evm.md) with Appsync.
S3 buckets often store sensitive or valuable data. By using AWS Lambda as an intermediary, you can enforce access control and implement specific permissions logic before retrieving data from the S3 bucket. This adds an extra layer of security to your data access.

Lambda functions allow you to implement custom logic or preprocessing steps before fetching data from S3. This could involve data transformations, validations, or any other custom operations required before responding to the GraphQL query.


### Prerequisites:
1. An AWS account with permissions to access AWS AppSync and Lambda.
2. Existing Lambda function(s) to connect with AppSync. Read more on how to create Lambda function for blockchain data [here](/docs/cloud/examples/lambda-functions.md)

### Steps:

#### 1. Access AWS AppSync Console
- Open your web browser and go to [AWS AppSync Console](https://us-east-1.console.aws.amazon.com/appsync/home?region=us-east-1#/apis)
  - Replace `us-east-1` in the URL with your desired AWS region if needed.

![appsync](/img/aws/appsync.png)

#### 2. Create a Data Source using Lambda Function
- In the AWS AppSync console, click on your API or create a new one if required.
- Navigate to the "Data Sources" section.
- Click on "Create data source".
- Choose the type of data source. In this case, select "AWS_LAMBDA".
- Provide a name for your data source (e.g., `get_blocks`) and specify the ARN of your Lambda function (`arn:aws:lambda:....:function:getBlocks`).

![AWS data source](/img/aws/appsync_datasources.png)

#### 3. Define Schema
- Go to the "Schema" section in your AWS AppSync API.
- Design your schema using GraphQL SDL (Schema Definition Language). For instance:

```graphql
type Block {
  id: ID!
  name: String!
}

type Query {
  getBlocks: Block
}

schema {
  query: Query
}
```

![schema](/img/aws/appsync_schema.png)

#### 4. Attach Resolvers
- In the "Resolvers" section of your AWS AppSync API, attach resolvers to your defined schema.
- Click "Attach" for each field in the schema (`id`, `name`, `getBlocks`) to associate them with their respective data sources or resolvers.
  - For `getBlocks`, select the data source you created (`get_blocks`).
  - AWS AppSync will manage the mapping between your GraphQL schema and the Lambda function.

#### 5. Save and Deploy
- Save the schema changes and deploy your API.
- AWS AppSync will generate the necessary GraphQL API endpoints and handle the communication between your GraphQL schema and the Lambda function(s) based on the resolvers you've set.

#### 6. Test your GraphQL API
- Once deployed, you can use the provided GraphQL endpoint to test your queries against the Lambda function integrated through AWS AppSync.
- Try running queries against the `getBlocks` resolver and ensure that it retrieves the expected data from your Lambda function.

Remember to replace the placeholders (`getBlocks`, Lambda ARN, etc.) with your actual resource names and ARNs as required in your AWS environment.

This integration enables your GraphQL API to interact with your Lambda function(s), allowing you to perform operations defined in your schema using GraphQL queries.