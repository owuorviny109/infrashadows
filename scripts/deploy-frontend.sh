#!/bin/bash

# Frontend Deployment Script for InfraShadows
# This script builds and deploys the frontend to S3

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Set variables
STAGE=${1:-dev}
BUCKET_NAME="infrashadows-storage-$STAGE"

echo "Deploying frontend to S3 bucket: $BUCKET_NAME"

# Navigate to frontend directory
cd ../frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the frontend
echo "Building frontend..."
npm run build

# Deploy to S3
echo "Deploying to S3..."
aws s3 sync build/ s3://$BUCKET_NAME --delete

echo "Frontend deployment complete!"
echo "Your website is available at: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com/"