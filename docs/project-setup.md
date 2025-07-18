# InfraShadows Project Setup Guide

This guide will help you set up the InfraShadows project for local development and deployment.

## Prerequisites

- Node.js 18.x or higher
- AWS CLI installed and configured
- Git
- Mapbox account for free API key

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/infrashadows.git
cd infrashadows
```

## Step 2: Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for environment variables
echo "REACT_APP_API_URL=http://localhost:3000/dev" > .env
echo "REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here" >> .env

# Start the development server
npm start
```

The frontend will be available at http://localhost:3000

## Step 3: Backend Setup

```bash
# Navigate to the backend directory
cd ../backend

# Install dependencies
npm install

# Start the local development server
serverless offline start
```

The backend API will be available at http://localhost:3000/dev

## Step 4: Configure Mapbox

1. Sign up for a free Mapbox account at https://www.mapbox.com/
2. Create a new API token with the following scopes:
   - styles:read
   - fonts:read
   - datasets:read
   - vision:read
3. Update the `REACT_APP_MAPBOX_TOKEN` in the frontend `.env` file

## Step 5: Local Development Workflow

1. Make changes to the frontend or backend code
2. Test changes locally using the development servers
3. Run tests to ensure functionality
4. Commit changes to Git

## Step 6: Deployment

### Frontend Deployment

```bash
# Build the frontend
cd frontend
npm run build

# Deploy to S3
aws s3 sync build/ s3://infrashadows-storage-dev --delete
```

### Backend Deployment

```bash
# Deploy the backend
cd ../backend
serverless deploy --stage dev
```

## Project Structure

```
infrashadows/
├── frontend/               # React frontend application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
│
├── backend/                # Serverless backend
│   ├── src/                # Source code
│   │   └── functions/      # Lambda functions
│   ├── serverless.yml      # Serverless configuration
│   └── package.json        # Backend dependencies
│
└── docs/                   # Documentation
    ├── aws-setup.md        # AWS setup guide
    └── project-setup.md    # Project setup guide
```

## Environment Variables

### Frontend (.env)

- `REACT_APP_API_URL`: URL of the backend API
- `REACT_APP_MAPBOX_TOKEN`: Mapbox API token

### Backend (serverless.yml)

- `DEVELOPMENTS_TABLE`: DynamoDB table for developments
- `ANALYSIS_RESULTS_TABLE`: DynamoDB table for analysis results
- `REPORTS_TABLE`: DynamoDB table for reports
- `STORAGE_BUCKET`: S3 bucket for storage

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
npm test
```

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check that the backend server is running
   - Verify the `REACT_APP_API_URL` is correct
   - Check CORS configuration in the API Gateway

2. **Mapbox Not Loading**
   - Verify the Mapbox token is correct
   - Check that the token has the necessary scopes

3. **AWS Deployment Issues**
   - Verify AWS credentials are configured correctly
   - Check CloudWatch logs for Lambda errors
   - Ensure IAM permissions are set correctly