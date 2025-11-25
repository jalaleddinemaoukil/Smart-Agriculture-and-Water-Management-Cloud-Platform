export interface SensorReading {
    id: string;
    sensorId: string;
    timestamp: string;
    soilMoisture: number; // percentage (0-100)
    temperature: number; // celsius
    humidity: number; // percentage (0-100)
    waterUsed: number; // liters
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