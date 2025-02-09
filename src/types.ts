export interface ChargingStation {
  ID: number;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Latitude: number;
    Longitude: number;
  };
  Connections: Array<{
    PowerKW: number;
    StatusType?: {
      IsOperational: boolean;
    };
    ConnectionType: {
      Title: string;
    };
  }>;
  UsageCost?: string;
}

export interface FilterOptions {
  maxPrice?: number;
  minPower?: number;
  connectorType?: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  label: string;
}