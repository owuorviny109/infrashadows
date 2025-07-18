import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import WaterDemandMetrics from './WaterDemandMetrics';

/**
 * Component for calculating water demand based on building specifications
 */
function WaterDemandCalculator({ initialBuildingData = null }) {
  const [buildingData, setBuildingData] = useState(initialBuildingData || {
    units: 0,
    unitTypes: [],
    amenities: []
  });
  
  const [calculationComplete, setCalculationComplete] = useState(false);
  
  // Reset calculation when building data changes
  useEffect(() => {
    setCalculationComplete(false);
  }, [buildingData]);
  
  // Handle unit count change
  const handleUnitCountChange = (e) => {
    const units = parseInt(e.target.value) || 0;
    setBuildingData(prev => ({
      ...prev,
      units
    }));
  };
  
  // Handle unit type change
  const handleUnitTypeChange = (index, field, value) => {
    const updatedUnitTypes = [...buildingData.unitTypes];
    updatedUnitTypes[index] = {
      ...updatedUnitTypes[index],
      [field]: field === 'count' ? (parseInt(value) || 0) : value
    };
    
    setBuildingData(prev => ({
      ...prev,
      unitTypes: updatedUnitTypes
    }));
  };
  
  // Add new unit type
  const addUnitType = () => {
    setBuildingData(prev => ({
      ...prev,
      unitTypes: [...prev.unitTypes, { type: '1 bedroom', count: 1 }]
    }));
  };
  
  // Remove unit type
  const removeUnitType = (index) => {
    const updatedUnitTypes = [...buildingData.unitTypes];
    updatedUnitTypes.splice(index, 1);
    
    setBuildingData(prev => ({
      ...prev,
      unitTypes: updatedUnitTypes
    }));
  };
  
  // Handle amenity toggle
  const toggleAmenity = (amenity) => {
    setBuildingData(prev => {
      const amenities = [...prev.amenities];
      
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity]
        };
      }
    });
  };
  
  // Calculate water demand
  const calculateWaterDemand = () => {
    setCalculationComplete(true);
  };
  
  // Common amenities
  const commonAmenities = [
    'swimming pool',
    'gym',
    'garden',
    'water feature',
    'car wash',
    'laundry'
  ];
  
  // Unit types
  const unitTypeOptions = [
    'studio',
    '1 bedroom',
    '2 bedroom',
    '3 bedroom',
    '4 bedroom',
    'penthouse'
  ];
  
  return (
    <div className="space-y-6">
      <Card title="Water Demand Calculator">
        <div className="space-y-4">
          {/* Basic building info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Number of Units
            </label>
            <input
              type="number"
              min="0"
              value={buildingData.units}
              onChange={handleUnitCountChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Unit types */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Unit Types</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addUnitType}
              >
                Add Unit Type
              </Button>
            </div>
            
            {buildingData.unitTypes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No unit types added. Add unit types for more accurate calculation.
              </p>
            ) : (
              <div className="space-y-2">
                {buildingData.unitTypes.map((unitType, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={unitType.type}
                      onChange={(e) => handleUnitTypeChange(index, 'type', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {unitTypeOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={unitType.count}
                      onChange={(e) => handleUnitTypeChange(index, 'count', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeUnitType(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Amenities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {commonAmenities.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={buildingData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`amenity-${amenity}`}
                    className="ml-2 text-sm text-gray-700 capitalize"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Calculate button */}
          <div className="pt-2">
            <Button onClick={calculateWaterDemand} className="w-full">
              Calculate Water Demand
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Results */}
      {calculationComplete && (
        <WaterDemandMetrics buildingData={buildingData} />
      )}
    </div>
  );
}

export default WaterDemandCalculator;