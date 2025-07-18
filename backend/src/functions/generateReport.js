'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { analysisId, format = 'pdf', sections = ['all'] } = requestBody;
    
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
    
    // Generate report content (simplified for demo)
    const reportContent = generateReportContent(
      analysisResult.Item, 
      developmentResult.Item,
      sections
    );
    
    // For demo purposes, we'll just create a JSON file in S3
    // In a real implementation, we would generate a PDF using a library
    const reportId = uuidv4();
    const reportKey = `reports/${reportId}.json`;
    
    await s3.putObject({
      Bucket: process.env.STORAGE_BUCKET,
      Key: reportKey,
      Body: JSON.stringify(reportContent),
      ContentType: 'application/json'
    }).promise();
    
    // Generate a pre-signed URL for the report (expires in 1 hour)
    const reportUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.STORAGE_BUCKET,
      Key: reportKey,
      Expires: 3600
    });
    
    // Store report metadata
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Report expires in 24 hours
    
    await dynamoDB.put({
      TableName: process.env.REPORTS_TABLE,
      Item: {
        id: reportId,
        analysisId: analysisId,
        type: sections.includes('all') ? 'Complete' : 'Custom',
        format: format,
        url: reportUrl,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      }
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Report generated successfully',
        reportId,
        reportUrl
      }),
    };
  } catch (error) {
    console.error('Error generating report:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Error generating report', error: error.message }),
    };
  }
};

function generateReportContent(analysis, development, sections) {
  // Simplified report generation for demo
  const reportContent = {
    title: `Infrastructure Impact Report: ${development.name}`,
    generatedAt: new Date().toISOString(),
    developmentDetails: {
      name: development.name,
      location: development.location,
      specifications: development.specifications
    }
  };
  
  // Add sections based on user selection
  if (sections.includes('all') || sections.includes('legitimacy')) {
    reportContent.legitimacyScore = analysis.legitimacyScore;
  }
  
  if (sections.includes('all') || sections.includes('infrastructure')) {
    reportContent.infrastructureImpact = analysis.infrastructureImpact;
  }
  
  if (sections.includes('all') || sections.includes('zoning')) {
    reportContent.zoningCompliance = analysis.zoningCompliance;
  }
  
  if (sections.includes('all') || sections.includes('participation')) {
    reportContent.participationAudit = analysis.participationAudit;
  }
  
  if (sections.includes('all') || sections.includes('shadow')) {
    reportContent.impactShadow = analysis.impactShadow;
  }
  
  return reportContent;
}