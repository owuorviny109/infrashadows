#!/bin/bash

# Backend Deployment Script for InfraShadows
# This script deploys the backend using the Serverless Framework

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "Serverless Framework is not installed. Installing now..."
    npm install -g serverless
fi

# Set variables
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "Deploying backend to AWS ($STAGE environment in $REGION region)"

# Navigate to backend directory
cd ../backend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Deploy using Serverless Framework
echo "Deploying with Serverless Framework..."
serverless deploy --stage $STAGE --region $REGION

echo "Backend deployment complete!"
echo "Note the API Gateway endpoint URL in the output above. You'll need to update the frontend .env file with this URL."