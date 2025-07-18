import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import DrainageImpactMetrics from './DrainageImpactMetrics';

/**
 * Component for calculating drainage impact based on building specifications
 */
function DrainageImpactCalculator({ initialBuildingData = null }) {
  const [buildingData, setBuildingData] = useState(initialBuildingData || {
    plotSize: 0,
    buildingFootprint: 0,
    surfaces: null
  });
  
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [customSurfaces, setCustomSurfaces] = useState(false);
  const [surfaceAreas, setSurfaceAreas] = useState({
    roof: 0,
    concrete: 0,
    asphalt: 0,
    gravel: 0,
    grass: 0,
    garden: 0,
    natural_ground: 0
  });
  
  // Reset calculation when building data changes
  useEffect(() => {
    setCalculationComplete(false);
  }, [buildingData]);
  
  // Update surface areas when plot size or building footprint changes
  useEffect(() => {
    if (!customSurfaces) {
      const plotSize = buildingData.plotSize || 0;
      const buildingFootprint = buildingData.buildingFootprint || 0;
      
      if (plotSize > 0 && buildingFootprint > 0) {
        const remainingArea = Math.max(0, plotSize - buildingFootprint);
        
        setSurfaceAreas({
          roof: buildingFootprint,
          concrete: remainingArea * 0.5,
          asphalt: remainingArea * 0.1,
          gravel: 0,
          grass: remainingArea * 0.2,
          garden: remainingArea * 0.1,
          natural_ground: remainingArea * 0.1
        });
      }
    }
  }, [buildingData.plotSize, buildingData.buildingFootprint, customSurfaces]);
  
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
  
  // Handle surface area change
  const handleSurfaceAreaChange = (surfaceType, value) => {
    const area = parseFloat(value) || 0;
    
    setSurfaceAreas(prev => ({
      ...prev,
      [surfaceType]: area
    }));
    
    setCustomSurfaces(true);
  };
  
  // Calculate total surface area
  const totalSurfaceArea = Object.values(surfaceAreas).reduce((sum, area) => sum + area, 0);
  
  // Calculate drainage impact
  const calculateDrainageImpact = () => {
    setBuildingData(prev => ({
      ...prev,
      surfaces: surfaceAreas
    }));
    
    setCalculationComplete(true);
  };
  
  // Surface types
  const surfaceTypes = [
    { id: 'roof', label: 'Roof', description: 'Building roof area' },
    { id: 'concrete', label: 'Concrete', description: 'Concrete surfaces (patios, walkways)' },
    { id: 'asphalt', label: 'Asphalt', description: 'Asphalt surfaces (driveways, parking)' },
    { id: 'gravel', label: 'Gravel', description: 'Gravel surfaces' },
    { id: 'grass', label: 'Grass', description: 'Grass lawns' },
    { id: 'garden', label: 'Garden', description: 'Garden areas with plants' },
    { id: 'natural_ground', label: 'Natural Ground', description: 'Undisturbed natural ground' }
  ];
  
  return (
    <div className="space-y-6">
      <Card title="Drainage Impact Calculator">
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
          
          {/* Surface areas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Surface Areas</h4>
              <div className="text-sm text-gray-500">
                Total: {totalSurfaceArea.toLocaleString()} m²
                {buildingData.plotSize > 0 && totalSurfaceArea !== buildingData.plotSize && (
                  <span className="text-yellow-600 ml-2">
                    (Differs from plot size: {buildingData.plotSize.toLocaleString()} m²)
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {surfaceTypes.map(surfaceType => (
                <div key={surfaceType.id} className="flex items-center space-x-2">
                  <div className="w-32">
                    <label className="text-sm text-gray-700">{surfaceType.label}</label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={surfaceAreas[surfaceType.id] || ''}
                    onChange={(e) => handleSurfaceAreaChange(surfaceType.id, e.target.value)}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="text-xs text-gray-500 flex-1">
                    {surfaceType.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Calculate button */}
          <div className="pt-2">
            <Button onClick={calculateDrainageImpact} className="w-full">
              Calculate Drainage Impact
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Results */}
      {calculationComplete && (
        <DrainageImpactMetrics buildingData={buildingData} />
      )}
    </div>
  );
}

export default DrainageImpactCalculator;