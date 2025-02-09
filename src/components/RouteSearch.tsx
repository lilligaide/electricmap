/**
 * RouteSearch Component
 * Provides address search functionality for planning routes between locations
 * Uses OpenStreetMap's Nominatim API for geocoding addresses
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { RoutePoint } from '../types';
import { searchAddress } from '../services/geocoding';

interface RouteSearchProps {
  onRouteChange: (points: RoutePoint[]) => void;  // Callback when route points change
}

/**
 * RouteSearch Component
 * Allows users to input start and destination addresses with autocomplete suggestions
 */
export default function RouteSearch({ onRouteChange }: RouteSearchProps) {
  // State for managing route points with addresses
  const [points, setPoints] = useState<(RoutePoint & { address: string })[]>([
    { lat: 0, lng: 0, label: 'Start', address: '' },
    { lat: 0, lng: 0, label: 'Destination', address: '' }
  ]);

  // State for managing search results and loading states
  const [searchResults, setSearchResults] = useState<{ [key: number]: any[] }>({});
  const [isSearching, setIsSearching] = useState<{ [key: number]: boolean }>({});

  /**
   * Handle address input changes
   * Performs address search when input length > 3 characters
   * @param index - Index of the route point (0 for start, 1 for destination)
   * @param address - New address value
   */
  const handleAddressChange = async (index: number, address: string) => {
    const newPoints = [...points];
    newPoints[index].address = address;
    setPoints(newPoints);

    // Only search if address has meaningful length
    if (address.length > 3) {
      setIsSearching({ ...isSearching, [index]: true });
      try {
        const results = await searchAddress(address);
        setSearchResults({ ...searchResults, [index]: results });
      } catch (error) {
        console.error('Error searching address:', error);
      }
      setIsSearching({ ...isSearching, [index]: false });
    } else {
      setSearchResults({ ...searchResults, [index]: [] });
    }
  };

  /**
   * Handle selection of an address from search results
   * Updates route point coordinates and triggers route change
   * @param index - Index of the route point
   * @param result - Selected address result from geocoding
   */
  const handleSelectAddress = (index: number, result: any) => {
    const newPoints = [...points];
    newPoints[index] = {
      ...newPoints[index],
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name
    };
    setPoints(newPoints);
    setSearchResults({ ...searchResults, [index]: [] });
    onRouteChange(newPoints);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Route Planning</h2>
      </div>

      {/* Route points input fields */}
      {points.map((point, index) => (
        <div key={index} className="mb-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              {point.label}
            </label>
          </div>
          <div className="relative">
            {/* Address input with autocomplete */}
            <input
              type="text"
              placeholder={`Enter ${point.label.toLowerCase()} address`}
              value={point.address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* Loading indicator */}
            {isSearching[index] && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
            {/* Search results dropdown */}
            {searchResults[index]?.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults[index].map((result, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleSelectAddress(index, result)}
                  >
                    {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}