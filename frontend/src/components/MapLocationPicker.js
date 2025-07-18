import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from './Button';

// Use environment variable for Mapbox token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiaW5mcmFzaGFkb3dzIiwiYSI6ImNsbjRtYTBjdzBhMTYycnFyMHN5Z2VlcXEifQ.EXAMPLE-TOKEN';

// Kilimani, Nairobi coordinates
const KILIMANI_CENTER = [36.7820, -1.2921];
const DEFAULT_ZOOM = 14;

function MapLocationPicker({ 
  onLocationSelect,
  initialLocation = KILIMANI_CENTER,
  className = '',
  height = 'h-64'
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialLocation,
      zoom: DEFAULT_ZOOM
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker on map load
    map.current.on('load', () => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Create and add marker
      marker.current = new mapboxgl.Marker({
        element: el,
        draggable: true
      })
        .setLngLat(initialLocation)
        .addTo(map.current);

      // Update location when marker is dragged
      marker.current.on('dragend', () => {
        const lngLat = marker.current.getLngLat();
        setLocation([lngLat.lng, lngLat.lat]);
        reverseGeocode([lngLat.lng, lngLat.lat]);
      });

      // Initial reverse geocoding
      reverseGeocode(initialLocation);
    });

    // Add click handler to map
    map.current.on('click', (e) => {
      marker.current.setLngLat(e.lngLat);
      setLocation([e.lngLat.lng, e.lngLat.lat]);
      reverseGeocode([e.lngLat.lng, e.lngLat.lat]);
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, [initialLocation]);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (coordinates) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress('Error getting address');
    } finally {
      setLoading(false);
    }
  };

  // Forward geocode to get coordinates from address
  const forwardGeocode = async (searchAddress) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?proximity=${KILIMANI_CENTER[0]},${KILIMANI_CENTER[1]}&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const newLocation = data.features[0].center;
        setLocation(newLocation);
        marker.current.setLngLat(newLocation);
        map.current.flyTo({ center: newLocation, zoom: DEFAULT_ZOOM });
        setAddress(data.features[0].place_name);
      }
    } catch (error) {
      console.error('Error forward geocoding:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (address.trim()) {
      forwardGeocode(address);
    }
  };

  // Handle confirm location
  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect({
        coordinates: location,
        address: address
      });
    }
  };

  return (
    <div className={className}>
      <div className={`relative ${height} mb-3`}>
        <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      </div>
      
      <form onSubmit={handleSearch} className="flex mb-3">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Search for a location"
          className="flex-grow border rounded-l-md p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <Button type="submit" className="rounded-l-none" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>Longitude: {location[0].toFixed(6)}</p>
          <p>Latitude: {location[1].toFixed(6)}</p>
        </div>
        <Button onClick={handleConfirm}>
          Confirm Location
        </Button>
      </div>
    </div>
  );
}

export default MapLocationPicker;