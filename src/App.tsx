import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BatteryCharging, MapPin, Plug } from 'lucide-react';
import Map from './components/Map';
import Filters from './components/Filters';
import RouteSearch from './components/RouteSearch';
import { fetchNearbyStations, fetchStationsAlongRoute } from './api';
import { ChargingStation, FilterOptions, RoutePoint } from './types';
import { LatLng } from 'leaflet';

function App() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [nearestStations, setNearestStations] = useState<ChargingStation[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    minPower: 0,
    connectorType: '',
  });

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(new LatLng(position.coords.latitude, position.coords.longitude));
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ['stations', userLocation, routePoints],
    queryFn: async () => {
      if (routePoints.length >= 2 && routePoints.every(p => p.lat !== 0 && p.lng !== 0)) {
        return fetchStationsAlongRoute(
          routePoints.map(p => [p.lat, p.lng] as [number, number])
        );
      } else if (userLocation) {
        return fetchNearbyStations(userLocation.lat, userLocation.lng);
      }
      return [];
    },
    enabled: !!userLocation || (routePoints.length >= 2),
  });

  const filteredStations = stations.filter((station: ChargingStation) => {
    if (filters.minPower && !station.Connections.some(conn => (conn.PowerKW || 0) >= filters.minPower)) {
      return false;
    }
    if (filters.connectorType && !station.Connections.some(conn => 
      conn.ConnectionType?.Title?.includes(filters.connectorType!)
    )) {
      return false;
    }
    return true;
  });

  const handleFindNearest = () => {
    if (!userLocation) return;
    
    const sorted = [...filteredStations].sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.AddressInfo.Latitude,
        a.AddressInfo.Longitude
      );
      const distB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.AddressInfo.Latitude,
        b.AddressInfo.Longitude
      );
      return distA - distB;
    });

    setNearestStations(sorted.slice(0, 3));
    if (sorted.length > 0) {
      setSelectedStation(sorted[0]);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const sendNotification = (station: ChargingStation) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Charging Station Selected', {
        body: `${station.AddressInfo.Title}\n${station.AddressInfo.AddressLine1}`,
        icon: '/charging-icon.png'
      });
    }
  };

  const handleRouteChange = (points: RoutePoint[]) => {
    setRoutePoints(points);
    setNearestStations([]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">EV Charging Finder</h1>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>Location found</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex">
        <aside className="w-96 bg-gray-50 p-4 overflow-y-auto">
          <RouteSearch onRouteChange={handleRouteChange} />
          <Filters filters={filters} onFilterChange={setFilters} />
          
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              {nearestStations.length > 0 ? 'Nearest Stations' : 'Available Stations'}
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {(nearestStations.length > 0 ? nearestStations : filteredStations).map((station: ChargingStation) => (
                  <div
                    key={station.ID}
                    className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedStation(station);
                      sendNotification(station);
                    }}
                  >
                    <h3 className="font-medium text-lg">{station.AddressInfo.Title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {station.AddressInfo.AddressLine1}
                    </p>
                    <div className="space-y-1">
                      {station.Connections.map((conn, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-1">
                          <Plug className="w-4 h-4 text-blue-600" />
                          <span>{conn.ConnectionType?.Title || 'Unknown Type'}</span>
                          {conn.PowerKW && (
                            <span className="text-gray-600">- {conn.PowerKW}kW</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 relative">
          <Map
            userLocation={userLocation}
            stations={nearestStations.length > 0 ? nearestStations : filteredStations}
            selectedStation={selectedStation}
            routePoints={routePoints}
            onFindNearest={handleFindNearest}
          />
        </div>
      </main>
    </div>
  );
}

export default App;