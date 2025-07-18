import React from 'react';
import { useAppContext } from '../context/AppContext';

function MapLegend({ className = '' }) {
  const { mapLayers } = useAppContext();
  
  const legendItems = [
    { id: 'water', label: 'Water Impact', color: 'bg-water-500' },
    { id: 'power', label: 'Power Impact', color: 'bg-power-500' },
    { id: 'drainage', label: 'Drainage Impact', color: 'bg-drainage-500' },
    { id: 'zoning', label: 'Zoning Violations', color: 'bg-zoning-500' }
  ];

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h3 className="font-semibold mb-2">Map Legend</h3>
      <div className="grid grid-cols-2 gap-2">
        {legendItems.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center ${!mapLayers[item.id] ? 'opacity-50' : ''}`}
          >
            <div className={`w-4 h-4 ${item.color} opacity-50 rounded-full mr-2`}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapLegend;