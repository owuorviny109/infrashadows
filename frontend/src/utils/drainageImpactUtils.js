/**
 * Utility functions for calculating drainage impact based on building specifications
 * Based on Nairobi drainage standards and typical rainfall patterns in Kilimani area
 */

// Constants for drainage impact calculation
const DRAINAGE_IMPACT_CONSTANTS = {
  // Average annual rainfall in Kilimani, Nairobi (mm)
  ANNUAL_RAINFALL_MM: 1000,
  
  // Runoff coefficients for different surface types
  RUNOFF_COEFFICIENTS: {
    'roof': 0.95,
    'concrete': 0.90,
    'asphalt': 0.85,
    'gravel': 0.50,
    'grass': 0.25,
    'garden': 0.35,
    'natural_ground': 0.30
  },
  
  // Default surface distribution if not specified (percentage of plot area)
  DEFAULT_SURFACE_DISTRIBUTION: {
    'roof': 0.40,
    'concrete': 0.30,
    'grass': 0.20,
    'garden': 0.10
  },
  
  // Kilimani area drainage capacity (liters per second per hectare)
  KILIMANI_DRAINAGE_CAPACITY: 150,
  
  // Risk thresholds (percentage of capacity)
  RISK_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60
  },
  
  // Conversion factors
  SQMETER_TO_HECTARE: 0.0001,
  MM_TO_LITERS_PER_SQMETER: 1
};

/**
 * Calculate drainage impact based on building specifications
 * @param {object} buildingData - Building specifications
 * @returns {object} - Drainage impact calculation results
 */
export const calculateDrainageImpact = (buildingData) => {
  const { plotSize = 0, buildingFootprint = 0, surfaces = null } = buildingData;
  
  // If plot size is not provided, estimate it based on building footprint
  const estimatedPlotSize = plotSize > 0 ? plotSize : buildingFootprint * 2.5;
  
  // Calculate surface areas based on provided surfaces or default distribution
  let surfaceAreas = {};
  
  if (surfaces) {
    // Use provided surface distribution
    surfaceAreas = surfaces;
  } else {
    // Use default surface distribution
    const distribution = DRAINAGE_IMPACT_CONSTANTS.DEFAULT_SURFACE_DISTRIBUTION;
    
    // If building footprint is provided, use it for roof area
    if (buildingFootprint > 0) {
      const roofArea = buildingFootprint;
      const remainingArea = estimatedPlotSize - roofArea;
      
      // Distribute remaining area according to default distribution (excluding roof)
      const totalNonRoofPercentage = 
        Object.entries(distribution)
          .filter(([key]) => key !== 'roof')
          .reduce((sum, [, value]) => sum + value, 0);
      
      surfaceAreas = {
        'roof': roofArea,
        'concrete': remainingArea * (distribution.concrete / totalNonRoofPercentage),
        'grass': remainingArea * (distribution.grass / totalNonRoofPercentage),
        'garden': remainingArea * (distribution.garden / totalNonRoofPercentage)
      };
    } else {
      // Use default distribution for the entire plot
      Object.keys(distribution).forEach(key => {
        surfaceAreas[key] = estimatedPlotSize * distribution[key];
      });
    }
  }
  
  // Calculate weighted runoff coefficient
  let totalArea = 0;
  let weightedRunoffCoefficient = 0;
  
  Object.entries(surfaceAreas).forEach(([surfaceType, area]) => {
    const coefficient = DRAINAGE_IMPACT_CONSTANTS.RUNOFF_COEFFICIENTS[surfaceType] || 
                       DRAINAGE_IMPACT_CONSTANTS.RUNOFF_COEFFICIENTS.natural_ground;
    weightedRunoffCoefficient += coefficient * area;
    totalArea += area;
  });
  
  weightedRunoffCoefficient = weightedRunoffCoefficient / totalArea;
  
  // Calculate annual runoff volume (liters)
  const annualRainfallLiters = DRAINAGE_IMPACT_CONSTANTS.ANNUAL_RAINFALL_MM * 
                              DRAINAGE_IMPACT_CONSTANTS.MM_TO_LITERS_PER_SQMETER * 
                              totalArea;
  const annualRunoffLiters = annualRainfallLiters * weightedRunoffCoefficient;
  
  // Calculate peak runoff rate for a typical heavy rainfall event (25mm/hour)
  const peakRainfallIntensityMmPerHour = 25;
  const peakRunoffLitersPerSecond = (peakRainfallIntensityMmPerHour / 3600) * 
                                   weightedRunoffCoefficient * 
                                   totalArea;
  
  // Calculate strain on local drainage system
  const plotSizeHectares = totalArea * DRAINAGE_IMPACT_CONSTANTS.SQMETER_TO_HECTARE;
  const drainageCapacityLitersPerSecond = DRAINAGE_IMPACT_CONSTANTS.KILIMANI_DRAINAGE_CAPACITY * 
                                         plotSizeHectares;
  const strainPercentage = (peakRunoffLitersPerSecond / drainageCapacityLitersPerSecond) * 100;
  
  // Determine risk level
  let riskLevel = 'High';
  if (strainPercentage <= DRAINAGE_IMPACT_CONSTANTS.RISK_THRESHOLDS.LOW) {
    riskLevel = 'Low';
  } else if (strainPercentage <= DRAINAGE_IMPACT_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    riskLevel = 'Medium';
  }
  
  // Calculate pre-development runoff (assuming natural ground)
  const preDevelopmentCoefficient = DRAINAGE_IMPACT_CONSTANTS.RUNOFF_COEFFICIENTS.natural_ground;
  const preDevelopmentRunoffLiters = annualRainfallLiters * preDevelopmentCoefficient;
  
  // Calculate additional runoff due to development
  const additionalRunoffLiters = annualRunoffLiters - preDevelopmentRunoffLiters;
  
  return {
    annualRunoffLiters: Math.round(annualRunoffLiters),
    peakRunoffLitersPerSecond: parseFloat(peakRunoffLitersPerSecond.toFixed(2)),
    strainPercentage: parseFloat(strainPercentage.toFixed(2)),
    riskLevel,
    weightedRunoffCoefficient: parseFloat(weightedRunoffCoefficient.toFixed(2)),
    additionalRunoffLiters: Math.round(additionalRunoffLiters),
    preDevelopmentRunoffLiters: Math.round(preDevelopmentRunoffLiters),
    surfaceAreas: Object.fromEntries(
      Object.entries(surfaceAreas).map(([key, value]) => [key, Math.round(value)])
    ),
    totalArea: Math.round(totalArea),
    floodRisk: strainPercentage > 100 ? 'High' : (strainPercentage > 70 ? 'Medium' : 'Low')
  };
};

/**
 * Get drainage impact mitigation recommendations based on calculation results
 * @param {object} drainageImpact - Drainage impact calculation results
 * @returns {string[]} - List of recommendations
 */
export const getDrainageMitigationRecommendations = (drainageImpact) => {
  const recommendations = [];
  
  if (drainageImpact.strainPercentage > DRAINAGE_IMPACT_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    recommendations.push('Install rainwater harvesting system to reduce runoff');
    recommendations.push('Implement detention ponds or underground storage tanks');
    recommendations.push('Consider permeable paving for parking areas and walkways');
  }
  
  if (drainageImpact.weightedRunoffCoefficient > 0.7) {
    recommendations.push('Increase green space to improve water absorption');
    recommendations.push('Install green roofs to reduce runoff from roof surfaces');
    recommendations.push('Use bioswales and rain gardens for natural drainage');
  }
  
  if (drainageImpact.strainPercentage > DRAINAGE_IMPACT_CONSTANTS.RISK_THRESHOLDS.LOW) {
    recommendations.push('Implement proper site grading to direct water away from buildings');
    recommendations.push('Install French drains around the perimeter of the property');
  }
  
  // Always include general recommendations
  recommendations.push('Regularly maintain drainage systems to prevent blockages');
  recommendations.push('Consider sustainable urban drainage systems (SUDS)');
  
  return recommendations;
};