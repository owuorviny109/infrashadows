import React from 'react';
import Button from './Button';

function MapControls({ 
  layers = {}, 
  onToggleLayer,
  className = ''
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.entries(layers).map(([layerName, isActive]) => {
        const colorMap = {
          water: 'bg-water-500 hover:bg-water-700',
          power: 'bg-power-500 hover:bg-power-700',
          drainage: 'bg-drainage-500 hover:bg-drainage-700',
          zoning: 'bg-zoning-500 hover:bg-zoning-700',
        };
        
        const baseColor = colorMap[layerName] || 'bg-gray-500 hover:bg-gray-700';
        
        return (
          <Button
            key={layerName}
            variant="custom"
            className={`${isActive ? baseColor : 'bg-gray-200 text-gray-700'} text-white`}
            onClick={() => onToggleLayer(layerName)}
          >
            {layerName.charAt(0).toUpperCase() + layerName.slice(1)} Impact
          </Button>
        );
      })}
    </div>
  );
}

export default MapControls;