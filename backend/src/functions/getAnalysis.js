'use strict';

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const analysisId = event.pathParameters.id;
    
    if (!analysisId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Analysis ID is required' }),
      };
    }
    
    // Get analysis results
    const analysisResult = await dynamoDB.get({
      TableName: process.env.ANALYSIS_RESULTS_TABLE,
      Key: { id: analysisId }
    }).promise();
    
    if (!analysisResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Analysis not found' }),
      };
    }
    
    // Get development details
    const developmentResult = await dynamoDB.get({
      TableName: process.env.DEVELOPMENTS_TABLE,
      Key: { id: analysisResult.Item.developmentId }
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        analysis: analysisResult.Item,
        development: developmentResult.Item
      }),
    };
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Error retrieving analysis', error: error.message }),
    };
  }
};