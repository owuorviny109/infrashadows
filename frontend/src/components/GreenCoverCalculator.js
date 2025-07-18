import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import GreenCoverMetrics from './GreenCoverMetrics';

/**
 * Component for calculating green cover loss based on building specifications
 */
function GreenCoverCalculator({ initialBuildingData = null }) {
  const [buildingData, setBuildingData] = useState(initialBuildingData || {
    plotSize: 0,
    buildingFootprint: 0,
    existingVegetation: {
      trees: 0,
      shrubs: 0,
      grass: 0,
      garden: 0
    },
    proposedVegetation: {
      trees: 0,
      shrubs: 0,
      grass: 0,
      garden: 0
    }
  });
  
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [useDefaultVegetation, setUseDefaultVegetation] = useState(true);
  
  // Reset calculation when building data changes
  useEffect(() => {
    setCalculationComplete(false);
  }, [buildingData]);
  
  // Update existing vegetation when plot size changes and using default vegetation
  useEffect(() => {
    if (useDefaultVegetation && buildingData.plotSize > 0) {
      const plotSize = buildingData.plotSize;
      
      setBuildingData(prev => ({
        ...prev,
        existingVegetation: {
          trees: plotSize * 0.3,
          shrubs: plotSize * 0.2,
          grass: plotSize * 0.4,
          garden: plotSize * 0.1
        }
      }));
    }
  }, [buildingData.plotSize, useDefaultVegetation]);
  
  // Update proposed vegetation when building footprint changes
  useEffect(() => {
    if (buildingData.plotSize > 0 && buildingData.buildingFootprint > 0) {
      const plotSize = buildingData.plotSize;
      const buildingFootprint = buildingData.buildingFootprint;
      const remainingArea = Math.max(0, plotSize - buildingFootprint);
      
      // Assume 70% of remaining area is hardscape (concrete, asphalt, etc.)
      const greenArea = remainingArea * 0.3;
      
      setBuildingData(prev => ({
        ...prev,
        proposedVegetation: {
          trees: greenArea * 0.1,
          shrubs: greenArea * 0.2,
          grass: greenArea * 0.6,
          garden: greenArea * 0.1
        }
      }));
    }
  }, [buildingData.plotSize, buildingData.buildingFootprint]);
  
  // Handle plot size change
  const handlePlotSizeChange = (e) => {
    const plotSize = parseFloat(e.target.value) || 0;
    setBuildingData(prev => ({
      ...prev,
      plotSize
    }));
  };
  
  // Handle building footprint change
  const handleBuildingFootprintChange = (e) => {
    const buildingFootprint = parseFloat(e.target.value) || 0;
    setBuildingData(prev => ({
      ...prev,
      buildingFootprint
    }));
  };
  
  // Handle existing vegetation change
  const handleExistingVegetationChange = (vegetationType, value) => {
    const area = parseFloat(value) || 0;
    
    setBuildingData(prev => ({
      ...prev,
      existingVegetation: {
        ...prev.existingVegetation,
        [vegetationType]: area
      }
    }));
    
    setUseDefaultVegetation(false);
  };
  
  // Handle proposed vegetation change
  const handleProposedVegetationChange = (vegetationType, value) => {
    const area = parseFloat(value) || 0;
    
    setBuildingData(prev => ({
      ...prev,
      proposedVegetation: {
        ...prev.proposedVegetation,
        [vegetationType]: area
      }
    }));
  };
  
  // Calculate total existing vegetation area
  const totalExistingVegetation = Object.values(buildingData.existingVegetation)
    .reduce((sum, area) => sum + area, 0);
  
  // Calculate total proposed vegetation area
  const totalProposedVegetation = Object.values(buildingData.proposedVegetation)
    .reduce((sum, area) => sum + area, 0);
  
  // Calculate green cover loss
  const calculateGreenCoverLoss = () => {
    setCalculationComplete(true);
  };
  
  // Vegetation types
  const vegetationTypes = [
    { id: 'trees', label: 'Trees', description: 'Mature trees and canopy cover' },
    { id: 'shrubs', label: 'Shrubs', description: 'Bushes and woody plants' },
    { id: 'grass', label: 'Grass', description: 'Lawn and grassy areas' },
    { id: 'garden', label: 'Garden', description: 'Cultivated garden areas' }
  ];
  
  return (
    <div className="space-y-6">
      <Card title="Green Cover Loss Calculator">
        <div className="space-y-4">
          {/* Basic building info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plot Size (m²)
              </label>
              <input
                type="number"
                min="0"
                value={buildingData.plotSize || ''}
                onChange={handlePlotSizeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Footprint (m²)
              </label>
              <input
                type="number"
                min="0"
                max={buildingData.plotSize || Infinity}
                value={buildingData.buildingFootprint || ''}
                onChange={handleBuildingFootprintChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Existing vegetation */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Pre-Development Vegetation</h4>
              <div className="text-sm text-gray-500">
                Total: {totalExistingVegetation.toLocaleString()} m²
                {buildingData.plotSize > 0 && totalExistingVegetation !== buildingData.plotSize && (
                  <span className={totalExistingVegetation > buildingData.plotSize ? 'text-red-600 ml-2' : 'text-yellow-600 ml-2'}>
                    (Differs from plot size: {buildingData.plotSize.toLocaleString()} m²)
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {vegetationTypes.map(vegetationType => (
                <div key={vegetationType.id} className="flex items-center space-x-2">
                  <div className="w-24">
                    <label className="text-sm text-gray-700">{vegetationType.label}</label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={buildingData.existingVegetation[vegetationType.id] || ''}
                    onChange={(e) => handleExistingVegetationChange(vegetationType.id, e.target.value)}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="text-xs text-gray-500 flex-1">
                    {vegetationType.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setUseDefaultVegetation(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset to Default Vegetation
              </button>
            </div>
          </div>
          
          {/* Proposed vegetation */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Post-Development Vegetation</h4>
              <div className="text-sm text-gray-500">
                Total: {totalProposedVegetation.toLocaleString()} m²
              </div>
            </div>
            
            <div className="space-y-2">
              {vegetationTypes.map(vegetationType => (
                <div key={vegetationType.id} className="flex items-center space-x-2">
                  <div className="w-24">
                    <label className="text-sm text-gray-700">{vegetationType.label}</label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={buildingData.proposedVegetation[vegetationType.id] || ''}
                    onChange={(e) => handleProposedVegetationChange(vegetationType.id, e.target.value)}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="text-xs text-gray-500 flex-1">
                    {vegetationType.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Calculate button */}
          <div className="pt-2">
            <Button onClick={calculateGreenCoverLoss} className="w-full">
              Calculate Green Cover Loss
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Results */}
      {calculationComplete && (
        <GreenCoverMetrics buildingData={buildingData} />
      )}
    </div>
  );
}

export default GreenCoverCalculator;