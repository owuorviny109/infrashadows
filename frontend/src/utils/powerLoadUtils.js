/**
 * Utility functions for calculating power load based on building specifications
 * Based on Kenya Power standards and typical usage patterns in Kilimani area
 */

// Constants for power load calculation (kilowatt-hours per day)
const POWER_LOAD_CONSTANTS = {
  // Per person demand (kWh per day)
  PERSON_DEMAND: 3.5,
  
  // Average occupancy per unit type (same as water demand for consistency)
  OCCUPANCY: {
    'studio': 1.2,
    '1 bedroom': 1.5,
    '2 bedroom': 2.5,
    '3 bedroom': 3.5,
    '4 bedroom': 4.5,
    'penthouse': 4.0,
    'default': 2.5 // Default occupancy if unit type is unknown
  },
  
  // Additional demand for amenities (kWh per day)
  AMENITIES: {
    'swimming pool': 25,
    'gym': 40,
    'elevator': 30,
    'central air conditioning': 100,
    'security system': 10,
    'common area lighting': 15,
    'water heating': 50,
    'laundry': 20
  },
  
  // Base demand for common areas (kWh per day per unit)
  COMMON_AREAS: 1.2,
  
  // Kilimani area grid capacity (kWh per day)
  KILIMANI_GRID_CAPACITY: 50000,
  
  // Risk thresholds (percentage of capacity)
  RISK_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60
  }
};

/**
 * Calculate power load based on building specifications
 * @param {object} buildingData - Building specifications
 * @returns {object} - Power load calculation results
 */
export const calculatePowerLoad = (buildingData) => {
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
      let occupancyRate = POWER_LOAD_CONSTANTS.OCCUPANCY.default;
      Object.keys(POWER_LOAD_CONSTANTS.OCCUPANCY).forEach(key => {
        if (type.includes(key)) {
          occupancyRate = POWER_LOAD_CONSTANTS.OCCUPANCY[key];
        }
      });
      
      const typeOccupancy = count * occupancyRate;
      totalOccupancy += typeOccupancy;
      unitBasedDemand += typeOccupancy * POWER_LOAD_CONSTANTS.PERSON_DEMAND;
    });
  } else if (units) {
    // If we only have total units count
    totalOccupancy = units * POWER_LOAD_CONSTANTS.OCCUPANCY.default;
    unitBasedDemand = totalOccupancy * POWER_LOAD_CONSTANTS.PERSON_DEMAND;
  }
  
  // Calculate common areas demand
  const commonAreasDemand = (units || 0) * POWER_LOAD_CONSTANTS.COMMON_AREAS;
  
  // Calculate amenities demand
  let amenitiesDemand = 0;
  if (amenities && amenities.length > 0) {
    amenities.forEach(amenity => {
      const amenityLower = amenity.toLowerCase();
      Object.keys(POWER_LOAD_CONSTANTS.AMENITIES).forEach(key => {
        if (amenityLower.includes(key)) {
          amenitiesDemand += POWER_LOAD_CONSTANTS.AMENITIES[key];
        }
      });
    });
  }
  
  // Calculate total demand
  const totalDailyDemand = unitBasedDemand + commonAreasDemand + amenitiesDemand;
  
  // Calculate strain percentage on local grid
  const strainPercentage = (totalDailyDemand / POWER_LOAD_CONSTANTS.KILIMANI_GRID_CAPACITY) * 100;
  
  // Determine risk level
  let riskLevel = 'High';
  if (strainPercentage <= POWER_LOAD_CONSTANTS.RISK_THRESHOLDS.LOW) {
    riskLevel = 'Low';
  } else if (strainPercentage <= POWER_LOAD_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    riskLevel = 'Medium';
  }
  
  // Calculate peak demand (kW) - typically 1.5x the average hourly demand
  const peakDemandKW = (totalDailyDemand / 24) * 1.5;
  
  return {
    dailyDemandKWh: Math.round(totalDailyDemand),
    monthlyDemandKWh: Math.round(totalDailyDemand * 30),
    peakDemandKW: parseFloat(peakDemandKW.toFixed(2)),
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
 * Calculate power load score (0-100) based on strain percentage
 * @param {number} strainPercentage - Strain percentage on local grid
 * @returns {number} - Power load score (0-100)
 */
export const calculatePowerLoadScore = (strainPercentage) => {
  // Convert strain percentage to a score from 0-100
  // Higher strain = higher score = worse impact
  if (strainPercentage >= 100) {
    return 100; // Maximum score for strain >= 100%
  }
  
  // Scale the score: 0% strain = 0 score, 100% strain = 100 score
  return Math.round(strainPercentage);
};

/**
 * Get power conservation recommendations based on demand calculation
 * @param {object} powerLoad - Power load calculation results
 * @returns {string[]} - List of recommendations
 */
export const getPowerConservationRecommendations = (powerLoad) => {
  const recommendations = [];
  
  if (powerLoad.strainPercentage > POWER_LOAD_CONSTANTS.RISK_THRESHOLDS.MEDIUM) {
    recommendations.push('Install energy-efficient appliances to reduce consumption');
    recommendations.push('Implement solar panels to supplement grid power');
    recommendations.push('Consider energy storage solutions for peak demand management');
  }
  
  if (powerLoad.breakdown.amenitiesDemand > 100) {
    recommendations.push('Use timers or motion sensors for common area lighting');
    recommendations.push('Install energy-efficient equipment in gym facilities');
    recommendations.push('Consider variable frequency drives for pool pumps');
  }
  
  if (powerLoad.strainPercentage > POWER_LOAD_CONSTANTS.RISK_THRESHOLDS.LOW) {
    recommendations.push('Install individual meters for units to encourage conservation');
    recommendations.push('Consider load-shedding strategies during peak hours');
  }
  
  // Always include general recommendations
  recommendations.push('Use LED lighting throughout the building');
  recommendations.push('Install programmable thermostats for climate control');
  recommendations.push('Consider energy-efficient building envelope design');
  
  return recommendations;
};