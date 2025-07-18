@echo off
REM Frontend Deployment Script for InfraShadows
REM This script builds and deploys the frontend to S3

REM Check if AWS CLI is installed
where aws >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Set variables
set STAGE=%1
if "%STAGE%"=="" set STAGE=dev
set BUCKET_NAME=infrashadows-storage-%STAGE%

echo Deploying frontend to S3 bucket: %BUCKET_NAME%

REM Navigate to frontend directory
cd ..\frontend

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Build the frontend
echo Building frontend...
call npm run build

REM Deploy to S3
echo Deploying to S3...
aws s3 sync build/ s3://%BUCKET_NAME% --delete

echo Frontend deployment complete!
echo Your website is available at: http://%BUCKET_NAME%.s3-website-%REGION%.amazonaws.com/