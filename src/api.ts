import axios from 'axios';
import { ChargingStation } from './types';

const API_KEY = '7c4dfce6-966f-4239-b1e2-a95c86e0dbe3';
const BASE_URL = 'https://api.openchargemap.io/v3';

export const fetchNearbyStations = async (lat: number, lng: number, radius: number = 5000) => {
  try {
    const response = await axios.get<ChargingStation[]>(`${BASE_URL}/poi`, {
      params: {
        key: API_KEY,
        latitude: lat,
        longitude: lng,
        distance: radius / 1000, // Convert to km
        distanceunit: 'km',
        maxresults: 100,
        compact: true,
        verbose: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    throw error;
  }
};

export const fetchStationsAlongRoute = async (waypoints: [number, number][]) => {
  try {
    const stations: ChargingStation[] = [];
    
    // Fetch stations near each waypoint
    for (const [lat, lng] of waypoints) {
      const response = await fetchNearbyStations(lat, lng, 2000);
      stations.push(...response);
    }
    
    // Remove duplicates based on station ID
    return Array.from(new Map(stations.map(s => [s.ID, s])).values());
  } catch (error) {
    console.error('Error fetching stations along route:', error);
    throw error;
  }
};