#!/bin/bash

# AWS Free Tier Setup Script for InfraShadows
# This script helps set up the necessary AWS resources for the InfraShadows project

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Set variables
STAGE=${1:-dev}
REGION=${2:-us-east-1}
BUCKET_NAME="infrashadows-storage-$STAGE"

echo "Setting up AWS resources for InfraShadows ($STAGE environment in $REGION region)"

# Create S3 bucket
echo "Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo "Configuring bucket for static website hosting"
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document error.html

# Set bucket policy for public read access
echo "Setting bucket policy for public read access"
sed "s/infrashadows-storage-dev/$BUCKET_NAME/g" ../backend/bucket-policy.json > ./temp-bucket-policy.json
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://temp-bucket-policy.json
rm ./temp-bucket-policy.json

# Set up budget alert (optional)
echo "Would you like to set up a budget alert? (y/n)"
read -r setup_budget

if [[ $setup_budget == "y" ]]; then
    echo "Enter your email address for budget alerts:"
    read -r email
    
    # Create budget definition file
    cat > budget.json << EOF
{
    "BudgetName": "InfraShadows-Budget",
    "BudgetLimit": {
        "Amount": "1",
        "Unit": "USD"
    },
    "BudgetType": "COST",
    "CostFilters": {},
    "CostTypes": {
        "IncludeTax": true,
        "IncludeSubscription": true,
        "UseBlended": false,
        "IncludeRefund": false,
        "IncludeCredit": false,
        "IncludeUpfront": true,
        "IncludeRecurring": true,
        "IncludeOtherSubscription": true,
        "IncludeSupport": true,
        "IncludeDiscount": true,
        "UseAmortized": false
    },
    "TimeUnit": "MONTHLY",
    "TimePeriod": {
        "Start": $(date +%s),
        "End": 2147483647
    },
    "NotificationsWithSubscribers": [
        {
            "Notification": {
                "NotificationType": "ACTUAL",
                "ComparisonOperator": "GREATER_THAN",
                "Threshold": 50,
                "ThresholdType": "PERCENTAGE"
            },
            "Subscribers": [
                {
                    "SubscriptionType": "EMAIL",
                    "Address": "$email"
                }
            ]
        },
        {
            "Notification": {
                "NotificationType": "ACTUAL",
                "ComparisonOperator": "GREATER_THAN",
                "Threshold": 80,
                "ThresholdType": "PERCENTAGE"
            },
            "Subscribers": [
                {
                    "SubscriptionType": "EMAIL",
                    "Address": "$email"
                }
            ]
        },
        {
            "Notification": {
                "NotificationType": "ACTUAL",
                "ComparisonOperator": "GREATER_THAN",
                "Threshold": 100,
                "ThresholdType": "PERCENTAGE"
            },
            "Subscribers": [
                {
                    "SubscriptionType": "EMAIL",
                    "Address": "$email"
                }
            ]
        }
    ]
}
EOF

    # Create budget
    echo "Creating budget alert"
    aws budgets create-budget --account-id $(aws sts get-caller-identity --query Account --output text) --budget file://budget.json
    rm budget.json
fi

echo "AWS setup complete!"
echo "Next steps:"
echo "1. Deploy the backend: cd ../backend && serverless deploy --stage $STAGE"
echo "2. Update the frontend .env file with the API URL"
echo "3. Deploy the frontend: cd ../frontend && npm run build && aws s3 sync build/ s3://$BUCKET_NAME --delete"