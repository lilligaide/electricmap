import React from 'react';
import { FilterOptions } from '../types';
import { SlidersHorizontal, Zap, Battery, Plug } from 'lucide-react';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const connectorTypes = [
    'Type 2',
    'CCS',
    'CHAdeMO',
    'Tesla Supercharger',
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Filter Options</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Zap className="w-4 h-4" />
            Minimum Power (kW)
          </label>
          <input
            type="range"
            min="0"
            max="350"
            step="50"
            value={filters.minPower || 0}
            onChange={(e) => onFilterChange({ ...filters, minPower: parseInt(e.target.value) })}
            className="w-full accent-blue-600"
          />
          <span className="text-sm text-gray-600">{filters.minPower || 0}kW</span>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Plug className="w-4 h-4" />
            Connector Type
          </label>
          <select
            value={filters.connectorType || ''}
            onChange={(e) => onFilterChange({ ...filters, connectorType: e.target.value })}
            className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {connectorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}