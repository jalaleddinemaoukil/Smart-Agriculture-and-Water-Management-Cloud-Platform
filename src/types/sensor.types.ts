export interface Sensor {
    id: string;
    sensorId: string;
    fieldId?: string;
    cropType?: string;
    areaHectares?: number;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    phLevel?: number;
    waterLevel?: number;
    lightIntensity?: number;
    status?: 'normal' | 'warning' | 'critical';
    timestamp: string;
    location?: string;
    name?: string;
    alerts?: {
      soilMoisture: string;
      temperature: string;
      humidity: string;
      ph: string;
      waterLevel: string;
    };
  }
  
  export interface Alert {
    id: string;
    alertId?: string;
    sensorId: string;
    fieldId?: string;
    type?: string;
    alertType?: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    value?: string | number;
    threshold?: string | number;
    timestamp: string;
  }
  
  export interface Stats {
    totalSensors: number;
    activeAlerts: number;
    avgTemperature: number;
    avgHumidity: number;
    avgSoilMoisture: number;
  }
  
  export interface Report {
    generatedAt: string;
    period: {
      start: string;
      end: string;
    };
    fields: string[];
    reportType: string;
    stats: Stats;
    sensors: Sensor[];
  }