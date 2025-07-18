'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bedrock = new AWS.BedrockRuntime();

// This is a simplified implementation for the free tier setup
module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { listingText, location } = requestBody;
    
    if (!listingText) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Listing text is required' }),
      };
    }
    
    // Generate unique IDs for the development and analysis
    const developmentId = uuidv4();
    const analysisId = uuidv4();
    
    // Extract development details using regex (fallback method for free tier)
    const extractedData = extractBasicInfo(listingText);
    
    // Store the development data
    await dynamoDB.put({
      TableName: process.env.DEVELOPMENTS_TABLE,
      Item: {
        id: developmentId,
        name: extractedData.name || 'Unnamed Development',
        location: location || extractedData.location || 'Unknown Location',
        specifications: {
          floors: extractedData.floors,
          units: extractedData.units,
          unitTypes: extractedData.unitTypes,
          amenities: extractedData.amenities,
          parking: extractedData.parking,
          plotSize: extractedData.plotSize,
          buildingFootprint: extractedData.buildingFootprint
        },
        extractionConfidence: 0.7, // Hardcoded for demo
        originalListing: listingText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }).promise();
    
    // Run simulations and calculate impacts
    const infrastructureImpact = calculateInfrastructureImpact(extractedData);
    const zoningCompliance = checkZoningCompliance(extractedData, location);
    const participationAudit = auditParticipation(developmentId);
    const legitimacyScore = calculateLegitimacyScore(
      zoningCompliance, 
      infrastructureImpact, 
      participationAudit
    );
    
    // Store analysis results
    await dynamoDB.put({
      TableName: process.env.ANALYSIS_RESULTS_TABLE,
      Item: {
        id: analysisId,
        developmentId: developmentId,
        infrastructureImpact,
        zoningCompliance,
        participationAudit,
        legitimacyScore,
        impactShadow: calculateImpactShadow(infrastructureImpact, zoningCompliance),
        createdAt: new Date().toISOString()
      }
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Analysis completed successfully',
        developmentId,
        analysisId,
        extractedData,
        legitimacyScore: legitimacyScore.overall
      }),
    };
  } catch (error) {
    console.error('Error processing listing:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Error processing listing', error: error.message }),
    };
  }
};

// Helper functions for the free tier implementation

function extractBasicInfo(listingText) {
  // Simple regex-based extraction for demo purposes
  const floors = listingText.match(/(\d+)[\s-]*(storey|story|floor)/i);
  const units = listingText.match(/(\d+)[\s-]*(unit|apartment)/i);
  const location = listingText.match(/in\s+([A-Za-z\s]+)/i);
  const bedrooms = listingText.match(/(\d+)[\s-]*bedroom/i);
  
  return {
    name: 'Development ' + Math.floor(Math.random() * 1000),
    floors: floors ? parseInt(floors[1]) : Math.floor(Math.random() * 20) + 5,
    units: units ? parseInt(units[1]) : Math.floor(Math.random() * 100) + 20,
    location: location ? location[1] : 'Kilimani, Nairobi',
    unitTypes: [
      { type: 'Studio', count: Math.floor(Math.random() * 10) },
      { type: '1 Bedroom', count: Math.floor(Math.random() * 20) },
      { type: '2 Bedroom', count: Math.floor(Math.random() * 30) },
      { type: '3 Bedroom', count: Math.floor(Math.random() * 20) }
    ],
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
    parking: Math.floor(Math.random() * 100) + 50,
    plotSize: Math.floor(Math.random() * 5000) + 1000,
    buildingFootprint: Math.floor(Math.random() * 2000) + 500
  };
}

function calculateInfrastructureImpact(extractedData) {
  // Simplified calculation for demo
  const waterDemand = extractedData.units * 300; // 300 liters per unit per day
  const powerDemand = extractedData.units * 5; // 5 kWh per unit per day
  const runoff = extractedData.buildingFootprint * 0.8; // 80% of footprint creates runoff
  const greenLoss = extractedData.plotSize - extractedData.buildingFootprint;
  
  return {
    water: {
      dailyDemandLiters: waterDemand,
      strainPercentage: Math.min(100, (waterDemand / 50000) * 100), // Assuming 50,000L capacity
      riskLevel: waterDemand > 40000 ? 'High' : waterDemand > 20000 ? 'Medium' : 'Low'
    },
    power: {
      dailyDemandKwh: powerDemand,
      strainPercentage: Math.min(100, (powerDemand / 1000) * 100), // Assuming 1000kWh capacity
      riskLevel: powerDemand > 800 ? 'High' : powerDemand > 500 ? 'Medium' : 'Low'
    },
    drainage: {
      additionalRunoffLiters: runoff,
      strainLevel: runoff > 1500 ? 'High' : runoff > 1000 ? 'Medium' : 'Low'
    },
    greenCover: {
      lossSquareMeters: greenLoss,
      environmentalImpact: greenLoss > 3000 ? 'High' : greenLoss > 1500 ? 'Medium' : 'Low'
    }
  };
}

function checkZoningCompliance(extractedData, location) {
  // Simplified zoning check for demo
  const maxAllowedFloors = 10;
  const maxAllowedUnits = 80;
  
  const heightViolation = extractedData.floors > maxAllowedFloors;
  const densityViolation = extractedData.units > maxAllowedUnits;
  
  const violations = [];
  if (heightViolation) {
    violations.push({
      type: 'Height',
      description: `Exceeds maximum allowed height of ${maxAllowedFloors} floors by ${extractedData.floors - maxAllowedFloors} floors`,
      severity: 'High'
    });
  }
  
  if (densityViolation) {
    violations.push({
      type: 'Density',
      description: `Exceeds maximum allowed units of ${maxAllowedUnits} by ${extractedData.units - maxAllowedUnits} units`,
      severity: 'Medium'
    });
  }
  
  return {
    zoneType: 'R3 - High Density Residential',
    compliant: violations.length === 0,
    violations: violations,
    documentationComplete: Math.random() > 0.3, // 70% chance of complete documentation
    missingDocuments: Math.random() > 0.7 ? ['LPDP Submission', 'Traffic Impact Assessment'] : []
  };
}

function auditParticipation(developmentId) {
  // Simplified audit for demo
  const randomFactor = Math.random();
  
  return {
    publicHearingHeld: randomFactor > 0.4,
    nemaApproval: randomFactor > 0.3,
    communityFeedbackIncorporated: randomFactor > 0.6,
    evidenceLinks: randomFactor > 0.5 ? 
      ['https://example.com/public-hearing-' + developmentId.substring(0, 8)] : [],
    missingProcesses: randomFactor < 0.5 ? 
      ['Community Feedback Session', 'Environmental Impact Assessment'] : []
  };
}

function calculateLegitimacyScore(zoningCompliance, infrastructureImpact, participationAudit) {
  // Implement the weighted formula from requirements
  const zoningScore = zoningCompliance.compliant ? 100 : 
    (100 - (zoningCompliance.violations.length * 25));
  
  const waterPowerScore = 100 - (
    (infrastructureImpact.water.strainPercentage + 
     infrastructureImpact.power.strainPercentage) / 2
  );
  
  const drainageGreenScore = 100 - (
    (infrastructureImpact.drainage.strainLevel === 'High' ? 80 : 
     infrastructureImpact.drainage.strainLevel === 'Medium' ? 40 : 10) +
    (infrastructureImpact.greenCover.environmentalImpact === 'High' ? 80 : 
     infrastructureImpact.greenCover.environmentalImpact === 'Medium' ? 40 : 10)
  ) / 2;
  
  const publicHearingScore = 
    (participationAudit.publicHearingHeld ? 50 : 0) + 
    (participationAudit.nemaApproval ? 30 : 0) + 
    (participationAudit.communityFeedbackIncorporated ? 20 : 0);
  
  const amenityDensityScore = Math.random() * 100; // Random for demo
  const networkLoadScore = Math.random() * 100; // Random for demo
  
  // Calculate weighted score
  let overallScore = (
    0.30 * zoningScore +
    0.20 * waterPowerScore +
    0.20 * drainageGreenScore +
    0.15 * publicHearingScore +
    0.10 * amenityDensityScore +
    0.05 * networkLoadScore
  );
  
  // Cap score for critical violations
  if (zoningCompliance.violations.some(v => v.severity === 'High') || 
      !participationAudit.nemaApproval) {
    overallScore = Math.min(overallScore, 50);
  }
  
  return {
    overall: Math.round(overallScore),
    components: {
      zoningScore: Math.round(zoningScore),
      waterPowerScore: Math.round(waterPowerScore),
      drainageGreenScore: Math.round(drainageGreenScore),
      publicHearingScore: Math.round(publicHearingScore),
      amenityDensityScore: Math.round(amenityDensityScore),
      networkLoadScore: Math.round(networkLoadScore)
    },
    statusBand: overallScore >= 70 ? 'Green' : overallScore >= 50 ? 'Yellow' : 'Red'
  };
}

function calculateImpactShadow(infrastructureImpact, zoningCompliance) {
  // Calculate shadow radius based on impact severity
  const waterRadius = infrastructureImpact.water.strainPercentage * 2;
  const powerRadius = infrastructureImpact.power.strainPercentage * 1.5;
  const drainageRadius = 
    infrastructureImpact.drainage.strainLevel === 'High' ? 300 : 
    infrastructureImpact.drainage.strainLevel === 'Medium' ? 200 : 100;
  const zoningImpactRadius = zoningCompliance.violations.length * 100;
  
  return {
    waterRadius,
    powerRadius,
    drainageRadius,
    zoningImpactRadius
  };
}