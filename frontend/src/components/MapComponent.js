import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { useAppContext } from '../context/AppContext';

// Use environment variable for Mapbox token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiaW5mcmFzaGFkb3dzIiwiYSI6ImNsbjRtYTBjdzBhMTYycnFyMHN5Z2VlcXEifQ.EXAMPLE-TOKEN';

// Kilimani, Nairobi coordinates
const KILIMANI_CENTER = [36.7820, -1.2921];
const DEFAULT_ZOOM = 13;

function MapComponent({ 
  className = '',
  markers = [],
  shadows = [],
  onMarkerClick,
  interactive = true
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const shadowsRef = useRef({});
  const { mapLayers } = useAppContext();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: KILIMANI_CENTER,
      zoom: DEFAULT_ZOOM,
      interactive: interactive
    });

    // Add navigation controls if interactive
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Set up map load event
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, [interactive]);

  // Handle markers
  useEffect(() => {
    if (!mapLoaded || !markers.length) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    markers.forEach(markerData => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerData.color || '#3b82f6';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2)';
      el.style.cursor = 'pointer';

      // Create popup if content provided
      let popup;
      if (markerData.popupContent) {
        popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(markerData.popupContent);
      }

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(markerData.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler if provided
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(markerData);
        });
      }

      // Store marker reference
      markersRef.current[markerData.id] = marker;
    });
  }, [mapLoaded, markers, onMarkerClick]);

  // Handle impact shadows
  useEffect(() => {
    if (!mapLoaded || !shadows.length) return;

    // Add shadow layers if they don't exist
    shadows.forEach(shadow => {
      const layerId = `shadow-${shadow.id}-${shadow.type}`;
      
      // Skip if layer visibility should be off based on mapLayers
      if (!mapLayers[shadow.type]) return;
      
      // Check if layer already exists
      if (map.current.getLayer(layerId)) {
        // Update existing layer
        map.current.setPaintProperty(layerId, 'circle-radius', shadow.radius);
        map.current.setPaintProperty(layerId, 'circle-opacity', shadow.opacity);
        return;
      }

      // Add source if it doesn't exist
      const sourceId = `source-${shadow.id}`;
      if (!map.current.getSource(sourceId)) {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: shadow.coordinates
            },
            properties: {
              id: shadow.id,
              type: shadow.type,
              intensity: shadow.intensity
            }
          }
        });
      }

      // Get color based on shadow type
      const colorMap = {
        water: 'rgba(14, 165, 233, 0.3)',     // water-500 with opacity
        power: 'rgba(234, 179, 8, 0.3)',      // power-500 with opacity
        drainage: 'rgba(34, 197, 94, 0.3)',    // drainage-500 with opacity
        zoning: 'rgba(239, 68, 68, 0.3)'       // zoning-500 with opacity
      };

      // Add layer
      map.current.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': shadow.radius,
          'circle-color': colorMap[shadow.type] || 'rgba(100, 100, 100, 0.3)',
          'circle-opacity': shadow.opacity || 0.5,
          'circle-blur': 0.5
        }
      });

      // Store reference
      shadowsRef.current[layerId] = { id: shadow.id, type: shadow.type };
    });

    // Remove shadows that are no longer in the list
    Object.entries(shadowsRef.current).forEach(([layerId, shadowRef]) => {
      const stillExists = shadows.some(s => s.id === shadowRef.id && s.type === shadowRef.type);
      if (!stillExists && map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        delete shadowsRef.current[layerId];
      }
    });
  }, [mapLoaded, shadows, mapLayers]);

  // Update layer visibility when mapLayers changes
  useEffect(() => {
    if (!mapLoaded) return;

    Object.entries(shadowsRef.current).forEach(([layerId, shadowRef]) => {
      if (map.current.getLayer(layerId)) {
        const visibility = mapLayers[shadowRef.type] ? 'visible' : 'none';
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  }, [mapLoaded, mapLayers]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}

export default MapComponent;