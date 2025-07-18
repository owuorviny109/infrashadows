# AWS Free Tier Setup Guide for InfraShadows

This guide will help you set up the necessary AWS services for the InfraShadows project while staying within the AWS Free Tier limits.

## Prerequisites

- AWS Account with Free Tier access
- AWS CLI installed and configured
- Node.js 18.x or higher
- Serverless Framework installed (`npm install -g serverless`)

## Step 1: Set Up AWS Budget Alerts

To avoid unexpected charges, set up AWS Budget Alerts:

1. Go to the AWS Management Console
2. Navigate to AWS Budgets (under "Cost Management")
3. Click "Create budget"
4. Select "Cost budget"
5. Set a monthly budget limit (e.g., $1.00 to stay well below free tier limits)
6. Configure alerts at 50%, 80%, and 100% of your budget
7. Add email notifications for alerts

## Step 2: Configure AWS Services

### S3 Bucket Setup

The S3 bucket will be used for static website hosting and report storage:

```bash
# Create S3 bucket for development environment
aws s3 mb s3://infrashadows-storage-dev --region us-east-1

# Configure bucket for static website hosting
aws s3 website s3://infrashadows-storage-dev --index-document index.html --error-document error.html

# Set bucket policy for public read access (for static website)
aws s3api put-bucket-policy --bucket infrashadows-storage-dev --policy file://bucket-policy.json
```

Create a file named `bucket-policy.json` with the following content:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::infrashadows-storage-dev/*"
    }
  ]
}
```

### DynamoDB Tables

The DynamoDB tables will be created automatically by the Serverless Framework deployment.

### Lambda Functions and API Gateway

The Lambda functions and API Gateway will be deployed using the Serverless Framework:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Deploy to AWS
serverless deploy --stage dev
```

## Step 3: AWS Bedrock Setup (Limited Usage)

For the AI extraction component, we'll use AWS Bedrock with Claude 3 Sonnet:

1. Go to the AWS Management Console
2. Navigate to Amazon Bedrock
3. Request access to Claude 3 Sonnet model
4. Create an API key for limited usage
5. Update the environment variables in the serverless.yml file with your API key

## Step 4: Monitoring Free Tier Usage

To ensure you stay within the AWS Free Tier limits:

1. Set up AWS Cost Explorer to monitor usage
2. Check the AWS Free Tier page regularly to see your usage
3. Configure CloudWatch alarms for Lambda function duration and invocation counts
4. Monitor S3 storage and data transfer usage

## Free Tier Limits to Be Aware Of

- **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests
- **Lambda**: 1 million free requests per month, 400,000 GB-seconds of compute time
- **API Gateway**: 1 million API calls per month
- **DynamoDB**: 25GB of storage, 25 WCU and 25 RCU
- **CloudWatch**: 10 custom metrics and 10 alarms
- **AWS Bedrock**: No free tier, so use sparingly or implement caching

## Automatic Resource Cleanup

To avoid unnecessary charges, implement automatic cleanup of unused resources:

1. Set up S3 lifecycle policies to delete old reports
2. Configure TTL (Time to Live) for DynamoDB items
3. Use CloudWatch Events to shut down resources during inactive periods

## Troubleshooting

If you encounter issues with the AWS setup:

1. Check the CloudWatch Logs for Lambda function errors
2. Verify IAM permissions for the Lambda execution role
3. Ensure all required environment variables are set
4. Check API Gateway CORS configuration if experiencing frontend-backend integration issues