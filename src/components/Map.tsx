/**
 * Map Component
 * Displays an interactive map with charging stations, user location, and route visualization
 * Built using react-leaflet for map rendering and interactions
 */

import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { LatLng, Icon, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChargingStation, RoutePoint } from '../types';
import { Compass, Navigation } from 'lucide-react';

interface MapProps {
  userLocation: LatLng | null;  // Current user location
  stations: ChargingStation[];  // List of charging stations to display
  selectedStation: ChargingStation | null;  // Currently selected station
  routePoints: RoutePoint[];  // Points defining the route
  onFindNearest?: () => void;  // Callback for finding nearest stations
}

/**
 * Location Button Component
 * Appears when user's location is out of view
 * Allows quick navigation back to user's location
 */
function LocationButton() {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);

  // Update button visibility when map moves
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      const userLocation = new LatLng(center.lat, center.lng);
      setIsVisible(!bounds.contains(userLocation));
    }
  });

  // Handle click to center map on user location
  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = new LatLng(position.coords.latitude, position.coords.longitude);
        map.flyTo(userLocation, map.getZoom());  // Smooth animation to location
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  return isVisible ? (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 z-[1000] bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
      title="Find my location"
    >
      <Compass className="w-6 h-6 text-blue-600" />
    </button>
  ) : null;
}

/**
 * Main Map Component
 * Renders the map and manages all map-related functionality
 */
export default function Map({ userLocation, stations, selectedStation, routePoints, onFindNearest }: MapProps) {
  const mapRef = useRef<LeafletMap>(null);

  /**
   * Get the appropriate icon for a charging station
   * Green for operational stations, red for non-operational
   */
  const getStationIcon = (station: ChargingStation) => {
    const isOperational = station.Connections.some(
      conn => conn.StatusType?.IsOperational !== false
    );
    
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${isOperational ? 'green' : 'red'}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Determine map center based on user location or route
  const center = userLocation || 
    (routePoints.length > 0 ? 
      new LatLng(routePoints[0].lat, routePoints[0].lng) : 
      new LatLng(51.1657, 10.4515));  // Default to center of Germany

  // Filter valid route points and format for polyline
  const routeCoordinates = routePoints
    .filter(point => point.lat !== 0 && point.lng !== 0)
    .map(point => [point.lat, point.lng] as [number, number]);

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={13}
        className="h-full w-full"
      >
        {/* Base map layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationButton />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={new Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Route visualization */}
        {routeCoordinates.length >= 2 && (
          <Polyline 
            positions={routeCoordinates}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}

        {/* Charging station markers */}
        {stations.map((station) => (
          <Marker
            key={station.ID}
            position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
            icon={getStationIcon(station)}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg mb-2">{station.AddressInfo.Title}</h3>
                <p className="text-sm text-gray-600 mb-2">{station.AddressInfo.AddressLine1}</p>
                <div className="space-y-1">
                  {station.Connections.map((conn, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{conn.ConnectionType?.Title || 'Unknown Type'}</span>
                      {conn.PowerKW && (
                        <span className="text-gray-600"> - {conn.PowerKW}kW</span>
                      )}
                    </div>
                  ))}
                </div>
                {station.UsageCost && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Cost:</span> {station.UsageCost}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Find nearest stations button */}
      {onFindNearest && (
        <button
          onClick={onFindNearest}
          className="absolute top-4 right-4 z-[1000] bg-white rounded-lg px-4 py-2 shadow-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Navigation className="w-5 h-5 text-blue-600" />
          <span>Find Nearest Stations</span>
        </button>
      )}
    </>
  );
}