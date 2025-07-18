/**
 * Utility functions for extracting structured data from real estate listings
 * using regex patterns as a fallback when AI extraction is not available.
 */

/**
 * Extract building height (number of floors) from listing text
 * @param {string} text - The listing text
 * @returns {number|null} - The number of floors or null if not found
 */
export const extractFloors = (text) => {
  // Match patterns like "12-storey", "12 story", "12-floor", "12 floors"
  const patterns = [
    /(\d+)[\s-]*(storey|story|floor|floors)/i,
    /(\d+)[\s-]*levels/i,
    /(\d+)[\s-]*stories/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
};

/**
 * Extract number of units from listing text
 * @param {string} text - The listing text
 * @returns {number|null} - The number of units or null if not found
 */
export const extractUnits = (text) => {
  // Match patterns like "48 units", "48 apartments", "48 flats"
  const patterns = [
    /(\d+)[\s-]*(unit|units|apartment|apartments)/i,
    /(\d+)[\s-]*(flat|flats)/i,
    /(\d+)[\s-]*(home|homes)/i,
    /consisting of (\d+)/i,
    /comprising of (\d+)/i,
    /total of (\d+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
};

/**
 * Extract location from listing text
 * @param {string} text - The listing text
 * @returns {string|null} - The location or null if not found
 */
export const extractLocation = (text) => {
  // Match patterns for Kilimani area locations
  const patterns = [
    /located in ([A-Za-z\s]+),?\s*Kilimani/i,
    /located at ([A-Za-z\s]+),?\s*Kilimani/i,
    /located along ([A-Za-z\s]+Road|[A-Za-z\s]+Street|[A-Za-z\s]+Avenue)/i,
    /in ([A-Za-z\s]+),?\s*Kilimani/i,
    /at ([A-Za-z\s]+),?\s*Kilimani/i,
    /([A-Za-z\s]+Road|[A-Za-z\s]+Street|[A-Za-z\s]+Avenue),?\s*Kilimani/i,
    /Kilimani,?\s*([A-Za-z\s]+Road|[A-Za-z\s]+Street|[A-Za-z\s]+Avenue)/i,
    /Kilimani area/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If we can't find a specific location but Kilimani is mentioned
  if (text.match(/Kilimani/i)) {
    return "Kilimani, Nairobi";
  }
  
  return null;
};

/**
 * Extract amenities from listing text
 * @param {string} text - The listing text
 * @returns {string[]} - Array of amenities
 */
export const extractAmenities = (text) => {
  const amenities = [];
  const commonAmenities = [
    { name: "Swimming Pool", patterns: [/swimming pool/i, /pool/i] },
    { name: "Gym", patterns: [/gym/i, /fitness/i, /exercise/i] },
    { name: "Security", patterns: [/security/i, /guard/i, /cctv/i, /surveillance/i, /gated/i] },
    { name: "Parking", patterns: [/parking/i, /garage/i, /basement parking/i] },
    { name: "Elevator", patterns: [/elevator/i, /lift/i] },
    { name: "Garden", patterns: [/garden/i, /landscaped/i] },
    { name: "Playground", patterns: [/playground/i, /play area/i, /children/i] },
    { name: "Backup Generator", patterns: [/generator/i, /backup power/i] },
    { name: "Water Storage", patterns: [/water tank/i, /borehole/i, /water storage/i] },
    { name: "Clubhouse", patterns: [/clubhouse/i, /club house/i, /community center/i] }
  ];
  
  commonAmenities.forEach(amenity => {
    for (const pattern of amenity.patterns) {
      if (text.match(pattern)) {
        amenities.push(amenity.name);
        break; // Once we've found this amenity, no need to check other patterns
      }
    }
  });
  
  return amenities;
};

/**
 * Extract parking spaces from listing text
 * @param {string} text - The listing text
 * @returns {number|null} - The number of parking spaces or null if not found
 */
export const extractParkingSpaces = (text) => {
  // Match patterns like "48 parking spaces", "48 parking slots"
  const patterns = [
    /(\d+)[\s-]*(parking space|parking spaces|parking slot|parking slots)/i,
    /parking for (\d+)/i,
    /(\d+)[\s-]*car park/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  // If we found parking as an amenity but no specific number, estimate based on units
  if (text.match(/parking/i)) {
    const units = extractUnits(text);
    if (units) {
      // Estimate 1 parking space per unit
      return units;
    }
  }
  
  return null;
};

/**
 * Extract all available information from a real estate listing
 * @param {string} listingText - The full listing text
 * @returns {object} - Structured data extracted from the listing
 */
export const extractListingData = (listingText) => {
  const floors = extractFloors(listingText);
  const units = extractUnits(listingText);
  const location = extractLocation(listingText);
  const amenities = extractAmenities(listingText);
  const parkingSpaces = extractParkingSpaces(listingText);
  
  // Calculate confidence score based on how many fields we were able to extract
  let extractedCount = 0;
  let totalFields = 5; // floors, units, location, amenities, parkingSpaces
  
  if (floors !== null) extractedCount++;
  if (units !== null) extractedCount++;
  if (location !== null) extractedCount++;
  if (amenities.length > 0) extractedCount++;
  if (parkingSpaces !== null) extractedCount++;
  
  const confidenceScore = Math.round((extractedCount / totalFields) * 100);
  
  return {
    floors,
    units,
    location,
    amenities,
    parkingSpaces,
    confidenceScore,
    extractionMethod: 'regex'
  };
};

/**
 * Validate extracted data and identify missing required fields
 * @param {object} extractedData - The extracted data
 * @returns {object} - Validation results with missing fields
 */
export const validateExtractedData = (extractedData) => {
  const missingFields = [];
  
  if (extractedData.floors === null) missingFields.push('floors');
  if (extractedData.units === null) missingFields.push('units');
  if (extractedData.location === null) missingFields.push('location');
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    isComplete: extractedData.confidenceScore === 100
  };
};