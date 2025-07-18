@echo off
REM AWS Free Tier Setup Script for InfraShadows
REM This script helps set up the necessary AWS resources for the InfraShadows project

REM Check if AWS CLI is installed
where aws >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Check if AWS is configured
aws sts get-caller-identity >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo AWS CLI is not configured. Please run 'aws configure' first.
    exit /b 1
)

REM Set variables
set STAGE=%1
if "%STAGE%"=="" set STAGE=dev
set REGION=%2
if "%REGION%"=="" set REGION=us-east-1
set BUCKET_NAME=infrashadows-storage-%STAGE%

echo Setting up AWS resources for InfraShadows (%STAGE% environment in %REGION% region)

REM Create S3 bucket
echo Creating S3 bucket: %BUCKET_NAME%
aws s3 mb s3://%BUCKET_NAME% --region %REGION%

REM Configure bucket for static website hosting
echo Configuring bucket for static website hosting
aws s3 website s3://%BUCKET_NAME% --index-document index.html --error-document error.html

REM Set bucket policy for public read access
echo Setting bucket policy for public read access
powershell -Command "(Get-Content -Path ..\backend\bucket-policy.json) -replace 'infrashadows-storage-dev', '%BUCKET_NAME%' | Set-Content -Path .\temp-bucket-policy.json"
aws s3api put-bucket-policy --bucket %BUCKET_NAME% --policy file://temp-bucket-policy.json
del temp-bucket-policy.json

echo AWS setup complete!
echo Next steps:
echo 1. Deploy the backend: cd ..\backend ^&^& serverless deploy --stage %STAGE%
echo 2. Update the frontend .env file with the API URL
echo 3. Deploy the frontend: cd ..\frontend ^&^& npm run build ^&^& aws s3 sync build/ s3://%BUCKET_NAME% --delete