# InfraShadows Deployment Scripts

This directory contains scripts to help with the deployment and setup of the InfraShadows project.

## Available Scripts

### AWS Setup

Sets up the necessary AWS resources for the InfraShadows project, including S3 bucket for static hosting and budget alerts.

```bash
# On Linux/Mac
./aws-setup.sh [stage] [region]

# On Windows
aws-setup.bat [stage] [region]
```

Parameters:
- `stage`: The deployment stage (default: dev)
- `region`: The AWS region (default: us-east-1)

### Deploy Frontend

Builds and deploys the frontend to the S3 bucket.

```bash
# On Linux/Mac
./deploy-frontend.sh [stage]

# On Windows
deploy-frontend.bat [stage]
```

Parameters:
- `stage`: The deployment stage (default: dev)

### Deploy Backend

Deploys the backend using the Serverless Framework.

```bash
# On Linux/Mac
./deploy-backend.sh [stage] [region]

# On Windows
deploy-backend.bat [stage] [region]
```

Parameters:
- `stage`: The deployment stage (default: dev)
- `region`: The AWS region (default: us-east-1)

## Usage Example

To set up a complete development environment:

```bash
# 1. Set up AWS resources
./aws-setup.sh dev us-east-1

# 2. Deploy the backend
./deploy-backend.sh dev us-east-1

# 3. Update the frontend .env file with the API URL from the backend deployment

# 4. Deploy the frontend
./deploy-frontend.sh dev
```

## Notes

- These scripts assume you have the AWS CLI installed and configured.
- For Windows users, use the .bat files instead of the .sh files.
- Make sure to update the frontend .env file with the API URL from the backend deployment before deploying the frontend.