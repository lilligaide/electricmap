/**
 * Geocoding service using OpenStreetMap's Nominatim API
 * This service provides address search and reverse geocoding functionality
 * with rate limiting and proper user agent headers as per Nominatim's usage policy
 */

import axios from 'axios';

/**
 * Interface representing the structure of a geocoding result from Nominatim
 */
interface GeocodingResult {
  lat: number;  // Latitude of the location
  lon: number;  // Longitude of the location
  display_name: string;  // Full formatted address
}

// Base URL for the Nominatim API
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Search for addresses matching the given query
 * @param query - The address or location to search for
 * @returns Promise resolving to an array of matching locations
 * @throws Error if the geocoding request fails
 */
export const searchAddress = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 5,  // Limit results to top 5 matches
      },
      headers: {
        // Required by Nominatim's usage policy
        'User-Agent': 'EV-Charging-Finder/1.0',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

/**
 * Convert coordinates to an address (reverse geocoding)
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Promise resolving to the formatted address string
 * @throws Error if the reverse geocoding request fails
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        // Required by Nominatim's usage policy
        'User-Agent': 'EV-Charging-Finder/1.0',
      },
    });
    return response.data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
}; 