
export interface SensorReading {
    id: string;
    sensorId: string;
    timestamp: string;
    soilMoisture: number; // percentage (0-100)
    temperature: number; // celsius
    humidity: number; // percentage (0-100)
    waterUsed: number; // liters
  }


export function dbReadingToLegacy(reading: import('./database').SensorReading, sensorId: string): SensorReading {
  return {
    id: reading.id,
    sensorId: sensorId,
    timestamp: reading.timestamp,
    soilMoisture: reading.soil_moisture ?? 0,
    temperature: reading.temperature ?? 0,
    humidity: reading.humidity ?? 0,
    waterUsed: reading.water_used ?? 0,
  };
}
  
  export interface MetricCard {
    title: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
    icon: string;
  }
  
  export interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }
  
  export interface SensorState {
    readings: SensorReading[];
    latestReading: SensorReading | null;
    alerts: Alert[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: string | null;
  }