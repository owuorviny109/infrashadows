import React from 'react';
import MapComponent from './MapComponent';
import Card from './Card';
import { Link } from 'react-router-dom';
import Button from './Button';

function MapPreview({ 
  development,
  shadows = [],
  className = '',
  showViewButton = true,
  height = 'h-64'
}) {
  // Create marker from development data
  const marker = development ? {
    id: development.id,
    name: development.name || 'Development',
    coordinates: development.coordinates,
    color: '#3b82f6',
    popupContent: `<strong>${development.name || 'Development'}</strong>`
  } : null;

  return (
    <Card 
      title="Location Impact"
      className={className}
      footer={showViewButton && (
        <div className="flex justify-end">
          <Link to="/map">
            <Button variant="outline" size="sm">View Full Map</Button>
          </Link>
        </div>
      )}
    >
      <div className={`w-full ${height} relative rounded overflow-hidden`}>
        <MapComponent
          className="h-full w-full"
          markers={marker ? [marker] : []}
          shadows={shadows}
          interactive={false}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        This preview shows the impact shadows of the development on local infrastructure.
      </p>
    </Card>
  );
}

export default MapPreview;