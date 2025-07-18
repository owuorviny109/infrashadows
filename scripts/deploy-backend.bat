@echo off
REM Backend Deployment Script for InfraShadows
REM This script deploys the backend using the Serverless Framework

REM Check if Serverless Framework is installed
where serverless >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Serverless Framework is not installed. Installing now...
    call npm install -g serverless
)

REM Set variables
set STAGE=%1
if "%STAGE%"=="" set STAGE=dev
set REGION=%2
if "%REGION%"=="" set REGION=us-east-1

echo Deploying backend to AWS (%STAGE% environment in %REGION% region)

REM Navigate to backend directory
cd ..\backend

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Deploy using Serverless Framework
echo Deploying with Serverless Framework...
call serverless deploy --stage %STAGE% --region %REGION%

echo Backend deployment complete!
echo Note the API Gateway endpoint URL in the output above. You'll need to update the frontend .env file with this URL.