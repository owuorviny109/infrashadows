/**
 * Utility functions for calculating water demand based on building specifications
 * Based on Nairobi Water Company standards and typical usage patterns in Kilimani area
 */

// Constants for water demand calculation (liters per day)
const WATER_DEMAND_CONSTANTS = {
  // Per person demand (liters per day)
  PERSON_DEMAND: 150,
  
  // Average occupancy per unit type
  OCCUPANCY: {
    'studio': 1.2,
    '1 bedroom': 1.5,
    '2 bedroom': 2.5,
    '3 bedroom': 3.5,
    '4 bedroom': 4.5,
    'penthouse': 4.0,
    'default': 2.5 // Default occupancy if unit type is unknown
  },
  
  // Additional demand for amenities (liters per day)
  AMENITIES: {
    'swimming pool': 5000,
    'gym': 2000,
    'garden': 3000,
    'water feature': 1500,
    'car wash': 2000,
    'laundry': 3000
  },
  
  // Base demand for common areas (liters per day per unit)
  COMMON_AREAS: 50,
  
  // Kilimani area supply capacity (liters per day)
  KILIMANI_SUPPLY_CAPACITY: 2000000,
  
  // Risk thresholds (percentage of capacity)
  RISK_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60
  }
};

/**
 * Calculate water demand based on building specifications
 * @param {object} buildingData - Building specifications
 * @returns {object} - Water demand calculation results
 */
export const calculateWaterDemand = (buildingData) => {
  const { units, unitTypes = [], amenities = [] } = buildingData;
  
  // Calculate occupancy and unit-based demand
  let totalOccupancy = 0;
  let unitBasedDemand = 0;
  
  if (unitTypes && unitTypes.length > 0) {
    // If we have detailed unit type information
    unitTypes.forEach(unitType => {
      const type = unitType.type.toLowerCase();
      const count = unitType.count || 0;
      
      // Find the closest matching occupancy rate
      let occupancyRate = WATER_DEMAND_CONSTANTS.OCCUPANCY.default;
      Object.keys(WATER_DEMAND_CONSTANTS.OCCUPANCY).forEach(key => {
        if (type.includes(key)) {
          occupancyRate = WATER_DEMAND_CONSTANTS.OCCUPANCY[key];
        }
      });
      
      const typeOccupancy = count * occupancyRate;
      totalOccupancy += typeOccupancy;
      unitBasedDemand += typeOccupancy * WATER_DEMAND_CONSTANTS.PERSON_DEMAND;
    });
  } else if (units) {
    // If we only have total units count
    totalOccupancy = units * WATER_DEMAND_CONSTANTS.OCCUPANCY.default;
    unitBasedDemand = totalOccupancy * WATER_DEMAND_CONSTANTS.PERSON_DEMAND;
  }
  
  // Calculate common areas demand
  const commonAreasDemand = (units || 0) * WATER_DEMAND_CONSTANTS.COMMON_AREAS;
  
  // Calculate amenities demand
  let amenitiesDemand = 0;
  if (amenities && amenities.length > 0) {
    amenities.forEach(amenity => {
      const amenityLower = amenity.toLowerCase();
      Object.keys(WATER_DEMAND_CONSTANTS.AMENITIES).forEach(key => {
        if (amenityLower.includes(key)) {
          amenitiesDemand += WATER_DEMAND_CONSTANTS.AMENITIES[key];
        }
      });
    });
  }
  
  // Calculate total demand
  const totalDailyDemand = unitBasedDemand + commonAreasDemand + amenitiesDemand;
  
  // Calculate strain percentage on local supply
  const strainPercentage = (totalDailyDemand / WATER_DEMAND_CONSTANTS.KILIMANI_SUPPLY_CAPACITY) * 100;
  
  // Determine risk level
  let riskLevel = 'High';
  if (strainPercentage <= WATER_DEMAND_CONSTANTS.RISK_THRESHOLDS.LOW) {
    riskLevel = 'Low';
  } else if (strainPercentage <= WATER_DEMAND_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    riskLevel = 'Medium';
  }
  
  return {
    dailyDemandLiters: Math.round(totalDailyDemand),
    monthlyDemandLiters: Math.round(totalDailyDemand * 30),
    monthlyDemandCubicMeters: Math.round(totalDailyDemand * 30 / 1000),
    strainPercentage: parseFloat(strainPercentage.toFixed(2)),
    riskLevel,
    breakdown: {
      unitBasedDemand: Math.round(unitBasedDemand),
      commonAreasDemand: Math.round(commonAreasDemand),
      amenitiesDemand: Math.round(amenitiesDemand)
    },
    estimatedOccupancy: Math.round(totalOccupancy)
  };
};

/**
 * Calculate water demand score (0-100) based on strain percentage
 * @param {number} strainPercentage - Strain percentage on local supply
 * @returns {number} - Water demand score (0-100)
 */
export const calculateWaterDemandScore = (strainPercentage) => {
  // Convert strain percentage to a score from 0-100
  // Higher strain = higher score = worse impact
  if (strainPercentage >= 100) {
    return 100; // Maximum score for strain >= 100%
  }
  
  // Scale the score: 0% strain = 0 score, 100% strain = 100 score
  return Math.round(strainPercentage);
};

/**
 * Get water conservation recommendations based on demand calculation
 * @param {object} waterDemand - Water demand calculation results
 * @returns {string[]} - List of recommendations
 */
export const getWaterConservationRecommendations = (waterDemand) => {
  const recommendations = [];
  
  if (waterDemand.strainPercentage > WATER_DEMAND_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    recommendations.push('Install water-efficient fixtures to reduce consumption');
    recommendations.push('Implement rainwater harvesting system');
    recommendations.push('Consider greywater recycling for landscaping');
  }
  
  if (waterDemand.breakdown.amenitiesDemand > 5000) {
    recommendations.push('Use pool covers to reduce evaporation from swimming pools');
    recommendations.push('Install drip irrigation for gardens instead of sprinklers');
  }
  
  if (waterDemand.strainPercentage > WATER_DEMAND_CONSTANTS.RISK_THRESHOLDS.LOW) {
    recommendations.push('Install water meters for individual units to encourage conservation');
    recommendations.push('Consider borehole water supply to supplement municipal water');
  }
  
  // Always include general recommendations
  recommendations.push('Regular maintenance of plumbing to prevent leaks');
  recommendations.push('Install low-flow toilets and showerheads');
  
  return recommendations;
};