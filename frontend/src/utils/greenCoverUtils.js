/**
 * Utility functions for calculating green cover loss based on building specifications
 * Based on environmental standards and typical vegetation patterns in Kilimani area
 */

// Constants for green cover loss calculation
const GREEN_COVER_CONSTANTS = {
  // Average carbon sequestration rates (kg CO2 per m² per year)
  CARBON_SEQUESTRATION: {
    'trees': 2.5,
    'shrubs': 1.2,
    'grass': 0.5,
    'garden': 1.0
  },
  
  // Average biodiversity scores (0-10 scale)
  BIODIVERSITY_SCORES: {
    'trees': 8.0,
    'shrubs': 6.0,
    'grass': 3.0,
    'garden': 7.0
  },
  
  // Average cooling effect (°C reduction)
  COOLING_EFFECT: {
    'trees': 2.0,
    'shrubs': 0.8,
    'grass': 0.5,
    'garden': 1.0
  },
  
  // Default vegetation distribution for undeveloped plots in Kilimani
  DEFAULT_VEGETATION_DISTRIBUTION: {
    'trees': 0.3,
    'shrubs': 0.2,
    'grass': 0.4,
    'garden': 0.1
  },
  
  // Environmental impact thresholds (percentage of green cover lost)
  IMPACT_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60
  }
};

/**
 * Calculate green cover loss based on building specifications
 * @param {object} buildingData - Building specifications
 * @returns {object} - Green cover loss calculation results
 */
export const calculateGreenCoverLoss = (buildingData) => {
  const { 
    plotSize = 0, 
    buildingFootprint = 0, 
    surfaces = null,
    existingVegetation = null,
    proposedVegetation = null
  } = buildingData;
  
  // If plot size is not provided, estimate it based on building footprint
  const estimatedPlotSize = plotSize > 0 ? plotSize : buildingFootprint * 2.5;
  
  // Calculate pre-development vegetation areas
  let preDevelopmentVegetation = {};
  
  if (existingVegetation) {
    // Use provided existing vegetation data
    preDevelopmentVegetation = existingVegetation;
  } else {
    // Use default vegetation distribution
    const distribution = GREEN_COVER_CONSTANTS.DEFAULT_VEGETATION_DISTRIBUTION;
    
    Object.keys(distribution).forEach(key => {
      preDevelopmentVegetation[key] = estimatedPlotSize * distribution[key];
    });
  }
  
  // Calculate total pre-development green cover
  const totalPreDevelopmentGreenCover = Object.values(preDevelopmentVegetation)
    .reduce((sum, area) => sum + area, 0);
  
  // Calculate post-development vegetation areas
  let postDevelopmentVegetation = {};
  
  if (proposedVegetation) {
    // Use provided proposed vegetation data
    postDevelopmentVegetation = proposedVegetation;
  } else if (surfaces) {
    // Estimate from surface data
    postDevelopmentVegetation = {
      'trees': surfaces.garden ? surfaces.garden * 0.3 : 0,
      'shrubs': surfaces.garden ? surfaces.garden * 0.3 : 0,
      'grass': (surfaces.grass || 0) + (surfaces.garden ? surfaces.garden * 0.4 : 0),
      'garden': surfaces.garden ? surfaces.garden * 0.0 : 0 // Already counted in trees, shrubs, and grass
    };
  } else {
    // Estimate based on building footprint and plot size
    const developedArea = buildingFootprint + (estimatedPlotSize - buildingFootprint) * 0.7; // Assume 70% of remaining area is developed
    const remainingGreenArea = estimatedPlotSize - developedArea;
    
    postDevelopmentVegetation = {
      'trees': remainingGreenArea * 0.1,
      'shrubs': remainingGreenArea * 0.2,
      'grass': remainingGreenArea * 0.6,
      'garden': remainingGreenArea * 0.1
    };
  }
  
  // Calculate total post-development green cover
  const totalPostDevelopmentGreenCover = Object.values(postDevelopmentVegetation)
    .reduce((sum, area) => sum + area, 0);
  
  // Calculate green cover loss
  const greenCoverLoss = totalPreDevelopmentGreenCover - totalPostDevelopmentGreenCover;
  const greenCoverLossPercentage = (greenCoverLoss / totalPreDevelopmentGreenCover) * 100;
  
  // Calculate environmental impacts
  
  // Carbon sequestration loss
  let preDevelopmentCarbonSequestration = 0;
  let postDevelopmentCarbonSequestration = 0;
  
  Object.entries(preDevelopmentVegetation).forEach(([type, area]) => {
    preDevelopmentCarbonSequestration += area * (GREEN_COVER_CONSTANTS.CARBON_SEQUESTRATION[type] || 0);
  });
  
  Object.entries(postDevelopmentVegetation).forEach(([type, area]) => {
    postDevelopmentCarbonSequestration += area * (GREEN_COVER_CONSTANTS.CARBON_SEQUESTRATION[type] || 0);
  });
  
  const carbonSequestrationLoss = preDevelopmentCarbonSequestration - postDevelopmentCarbonSequestration;
  
  // Biodiversity impact
  let preDevelopmentBiodiversityScore = 0;
  let postDevelopmentBiodiversityScore = 0;
  
  Object.entries(preDevelopmentVegetation).forEach(([type, area]) => {
    preDevelopmentBiodiversityScore += area * (GREEN_COVER_CONSTANTS.BIODIVERSITY_SCORES[type] || 0);
  });
  
  Object.entries(postDevelopmentVegetation).forEach(([type, area]) => {
    postDevelopmentBiodiversityScore += area * (GREEN_COVER_CONSTANTS.BIODIVERSITY_SCORES[type] || 0);
  });
  
  // Normalize biodiversity scores to 0-100 scale
  const normalizedPreBiodiversityScore = preDevelopmentBiodiversityScore / totalPreDevelopmentGreenCover * 10;
  const normalizedPostBiodiversityScore = postDevelopmentBiodiversityScore > 0 ? 
    postDevelopmentBiodiversityScore / totalPostDevelopmentGreenCover * 10 : 0;
  
  const biodiversityImpactPercentage = 
    ((normalizedPreBiodiversityScore - normalizedPostBiodiversityScore) / normalizedPreBiodiversityScore) * 100;
  
  // Urban heat island effect
  let preDevelopmentCoolingEffect = 0;
  let postDevelopmentCoolingEffect = 0;
  
  Object.entries(preDevelopmentVegetation).forEach(([type, area]) => {
    preDevelopmentCoolingEffect += area * (GREEN_COVER_CONSTANTS.COOLING_EFFECT[type] || 0);
  });
  
  Object.entries(postDevelopmentVegetation).forEach(([type, area]) => {
    postDevelopmentCoolingEffect += area * (GREEN_COVER_CONSTANTS.COOLING_EFFECT[type] || 0);
  });
  
  // Normalize cooling effect to the plot size
  const normalizedPreCoolingEffect = preDevelopmentCoolingEffect / estimatedPlotSize;
  const normalizedPostCoolingEffect = postDevelopmentCoolingEffect / estimatedPlotSize;
  
  const coolingEffectLoss = normalizedPreCoolingEffect - normalizedPostCoolingEffect;
  const temperatureIncrease = coolingEffectLoss;
  
  // Determine environmental impact level
  let environmentalImpact = 'High';
  if (greenCoverLossPercentage <= GREEN_COVER_CONSTANTS.IMPACT_THRESHOLDS.LOW) {
    environmentalImpact = 'Low';
  } else if (greenCoverLossPercentage <= GREEN_COVER_CONSTANTS.IMPACT_THRESHOLDS.MEDIUM) {
    environmentalImpact = 'Medium';
  }
  
  return {
    preDevelopmentGreenCover: Math.round(totalPreDevelopmentGreenCover),
    postDevelopmentGreenCover: Math.round(totalPostDevelopmentGreenCover),
    greenCoverLoss: Math.round(greenCoverLoss),
    greenCoverLossPercentage: parseFloat(greenCoverLossPercentage.toFixed(1)),
    environmentalImpact,
    carbonSequestrationLoss: parseFloat(carbonSequestrationLoss.toFixed(1)),
    biodiversityImpactPercentage: parseFloat(biodiversityImpactPercentage.toFixed(1)),
    temperatureIncrease: parseFloat(temperatureIncrease.toFixed(1)),
    preDevelopmentVegetation: Object.fromEntries(
      Object.entries(preDevelopmentVegetation).map(([key, value]) => [key, Math.round(value)])
    ),
    postDevelopmentVegetation: Object.fromEntries(
      Object.entries(postDevelopmentVegetation).map(([key, value]) => [key, Math.round(value)])
    )
  };
};

/**
 * Get green cover mitigation recommendations based on calculation results
 * @param {object} greenCoverLoss - Green cover loss calculation results
 * @returns {string[]} - List of recommendations
 */
export const getGreenCoverRecommendations = (greenCoverLoss) => {
  const recommendations = [];
  
  if (greenCoverLoss.greenCoverLossPercentage > GREEN_COVER_CONSTANTS.IMPACT_THRESHOLDS.MEDIUM) {
    recommendations.push('Implement green roofs to increase vegetation coverage');
    recommendations.push('Create vertical gardens on building facades');
    recommendations.push('Increase tree planting density in remaining green spaces');
  }
  
  if (greenCoverLoss.temperatureIncrease > 1.0) {
    recommendations.push('Plant shade trees around the building to reduce heat island effect');
    recommendations.push('Use light-colored or reflective materials for hardscapes');
    recommendations.push('Install water features to provide evaporative cooling');
  }
  
  if (greenCoverLoss.biodiversityImpactPercentage > GREEN_COVER_CONSTANTS.IMPACT_THRESHOLDS.LOW) {
    recommendations.push('Create diverse planting areas with native species');
    recommendations.push('Install bird and insect habitats throughout the landscape');
    recommendations.push('Establish wildlife corridors connecting green spaces');
  }
  
  // Always include general recommendations
  recommendations.push('Preserve existing mature trees wherever possible');
  recommendations.push('Use drought-resistant native plants to reduce water consumption');
  recommendations.push('Implement sustainable landscape maintenance practices');
  
  return recommendations;
};