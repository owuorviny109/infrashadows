import React, { useState } from 'react';
import Container from '../components/Container';
import Card from '../components/Card';
import MapControls from '../components/MapControls';
import MapComponent from '../components/MapComponent';
import MapLegend from '../components/MapLegend';
import { useAppContext } from '../context/AppContext';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Button from '../components/Button';

function MapPage() {
  const { mapLayers, toggleMapLayer } = useAppContext();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Sample development data for demonstration
  const sampleDevelopments = [
    {
      id: 'dev-1',
      name: 'Kilimani Heights',
      coordinates: [36.7820, -1.2921],
      color: '#3b82f6',
      popupContent: '<strong>Kilimani Heights</strong><br/>12 floors, 48 units',
      details: {
        floors: 12,
        units: 48,
        legitimacyScore: 78
      }
    },
    {
      id: 'dev-2',
      name: 'Rose Apartments',
      coordinates: [36.7850, -1.2940],
      color: '#ef4444',
      popupContent: '<strong>Rose Apartments</strong><br/>8 floors, 32 units',
      details: {
        floors: 8,
        units: 32,
        legitimacyScore: 45
      }
    },
    {
      id: 'dev-3',
      name: 'Green Gardens',
      coordinates: [36.7790, -1.2900],
      color: '#22c55e',
      popupContent: '<strong>Green Gardens</strong><br/>6 floors, 24 units',
      details: {
        floors: 6,
        units: 24,
        legitimacyScore: 85
      }
    }
  ];

  // Sample impact shadows for demonstration
  const sampleShadows = [
    {
      id: 'dev-1',
      type: 'water',
      coordinates: [36.7820, -1.2921],
      radius: 300,
      opacity: 0.4,
      intensity: 'medium'
    },
    {
      id: 'dev-1',
      type: 'power',
      coordinates: [36.7820, -1.2921],
      radius: 200,
      opacity: 0.4,
      intensity: 'low'
    },
    {
      id: 'dev-1',
      type: 'drainage',
      coordinates: [36.7820, -1.2921],
      radius: 350,
      opacity: 0.4,
      intensity: 'high'
    },
    {
      id: 'dev-1',
      type: 'zoning',
      coordinates: [36.7820, -1.2921],
      radius: 150,
      opacity: 0.4,
      intensity: 'low'
    },
    {
      id: 'dev-2',
      type: 'water',
      coordinates: [36.7850, -1.2940],
      radius: 250,
      opacity: 0.4,
      intensity: 'medium'
    },
    {
      id: 'dev-2',
      type: 'power',
      coordinates: [36.7850, -1.2940],
      radius: 300,
      opacity: 0.4,
      intensity: 'high'
    },
    {
      id: 'dev-2',
      type: 'zoning',
      coordinates: [36.7850, -1.2940],
      radius: 200,
      opacity: 0.4,
      intensity: 'medium'
    },
    {
      id: 'dev-3',
      type: 'water',
      coordinates: [36.7790, -1.2900],
      radius: 150,
      opacity: 0.4,
      intensity: 'low'
    },
    {
      id: 'dev-3',
      type: 'drainage',
      coordinates: [36.7790, -1.2900],
      radius: 200,
      opacity: 0.4,
      intensity: 'medium'
    }
  ];

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowInfoModal(true);
  };

  return (
    <Container size="large" className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-3xl font-bold">Impact Shadow Map</h1>
        
        <div className="flex items-center">
          <Alert type="info" className="mr-4 py-1 text-sm">
            Showing impact shadows for 3 developments
          </Alert>
          <Button size="sm" variant="outline">
            Add Development
          </Button>
        </div>
      </div>
      
      <MapControls 
        layers={mapLayers} 
        onToggleLayer={toggleMapLayer} 
        className="mb-4"
      />
      
      <div className="flex-grow border rounded-lg overflow-hidden">
        <MapComponent 
          className="h-full w-full" 
          markers={sampleDevelopments}
          shadows={sampleShadows}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Cumulative Impact</h3>
            <Badge variant="warning">Medium Risk</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            The combined impact of all developments shows significant strain on drainage systems and moderate water supply pressure.
          </p>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </Card>
        
        <MapLegend />
      </div>
      
      {/* Development Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={selectedMarker?.name || 'Development Details'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowInfoModal(false)}>
              Close
            </Button>
            <Button>
              View Full Report
            </Button>
          </>
        }
      >
        {selectedMarker && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{selectedMarker.name}</h3>
                <p className="text-gray-600 text-sm">Kilimani, Nairobi</p>
              </div>
              <div className="text-center">
                <div className={`inline-block rounded-full w-12 h-12 flex items-center justify-center font-bold text-white ${
                  selectedMarker.details.legitimacyScore >= 70 ? 'bg-green-500' : 
                  selectedMarker.details.legitimacyScore >= 50 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}>
                  {selectedMarker.details.legitimacyScore}
                </div>
                <p className="text-xs mt-1">Legitimacy Score</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2">
                <p className="text-sm text-gray-600">Floors</p>
                <p className="font-semibold">{selectedMarker.details.floors}</p>
              </div>
              <div className="border rounded p-2">
                <p className="text-sm text-gray-600">Units</p>
                <p className="font-semibold">{selectedMarker.details.units}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Impact Summary</h4>
              <ul className="space-y-1">
                {sampleShadows
                  .filter(shadow => shadow.id === selectedMarker.id)
                  .map(shadow => {
                    const intensityColor = 
                      shadow.intensity === 'low' ? 'text-green-600' :
                      shadow.intensity === 'medium' ? 'text-yellow-600' :
                      'text-red-600';
                    
                    return (
                      <li key={`${shadow.id}-${shadow.type}`} className="flex items-center">
                        <span className={`w-3 h-3 rounded-full bg-${shadow.type}-500 mr-2`}></span>
                        <span className="capitalize">{shadow.type} Impact:</span>
                        <span className={`ml-1 ${intensityColor} font-medium capitalize`}>
                          {shadow.intensity}
                        </span>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
}

export default MapPage;