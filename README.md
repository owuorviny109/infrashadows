# InfraShadows

A civic-intelligence system that visualizes the hidden infrastructure impacts of high-rise developments in Nairobi's Kilimani area.

## Project Overview

InfraShadows transforms real estate listings, building proposals, or location pins into real-time infrastructure strain reports, exposing the hidden cost of unregulated urban verticalization. The system visualizes the "invisible impact shadows" of high-rise developments on water, drainage, power, zoning compliance, and community process through a map-based, simulation-driven, AI-augmented urban analysis platform.

## Repository Structure

- `/frontend` - React-based web application with Mapbox integration
- `/backend` - AWS Lambda functions and serverless infrastructure
- `/docs` - Documentation and setup guides

## Getting Started

### Prerequisites

- AWS Account with Free Tier access
- Node.js 18.x or higher
- AWS CLI configured locally

### Setup Instructions

1. Clone this repository
2. Follow the setup instructions in the `/docs` directory
3. Configure AWS credentials as described in the setup guide

## Features

- AI-powered extraction of development data from real estate listings
- Infrastructure impact simulation (water, power, drainage, green cover)
- Zoning compliance verification
- Public participation audit
- Legitimacy scoring
- Map-based visualization of impact shadows
- Report generation

## AWS Free Tier Usage

This project is designed to operate within AWS Free Tier limits, utilizing:
- S3 for static hosting and storage
- Lambda for serverless functions
- API Gateway for API endpoints
- DynamoDB for data storage
- AWS Bedrock for AI capabilities (with usage limits)