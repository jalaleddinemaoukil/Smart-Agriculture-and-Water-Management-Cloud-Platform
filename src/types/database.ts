// Database types matching Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      farms: {
        Row: Farm;
        Insert: Omit<Farm, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Farm, 'id' | 'created_at'>>;
      };
      sensors: {
        Row: Sensor;
        Insert: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sensor, 'id' | 'created_at'>>;
      };
      sensor_readings: {
        Row: SensorReading;
        Insert: Omit<SensorReading, 'id' | 'created_at'>;
        Update: Partial<Omit<SensorReading, 'id' | 'created_at'>>;
      };
      alerts: {
        Row: Alert;
        Insert: Omit<Alert, 'id' | 'created_at'>;
        Update: Partial<Omit<Alert, 'id' | 'created_at'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences, 'id' | 'created_at'>>;
      };
      farm_members: {
        Row: FarmMember;
        Insert: Omit<FarmMember, 'id' | 'created_at'>;
        Update: Partial<FarmMember>;
      };
    };
  };
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'farmer' | 'viewer';
  phone: string | null;
  language: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location_lat: number | null;
  location_lng: number | null;
  address: string | null;
  size_hectares: number | null;
  crop_type: string | null;
  region: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sensor {
  id: string;
  farm_id: string;
  name: string;
  sensor_id: string; // External sensor ID
  type: 'agro' | 'weather' | 'irrigation';
  location_lat: number | null;
  location_lng: number | null;
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
  battery_level: number | null;
  signal_strength: number | null;
  last_seen: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  farm_id: string;
  timestamp: string;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  water_used: number;
  created_at: string;
}

export interface Alert {
  id: string;
  sensor_id: string | null;
  farm_id: string;
  user_id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  moisture_threshold: number;
  temp_threshold: number;
  email_alerts: boolean;
  sms_alerts: boolean;
  critical_only: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmMember {
  id: string;
  farm_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'viewer';
  created_at: string;
}

// Extended types with relations
export interface SensorWithFarm extends Sensor {
  farm: Farm;
}

export interface SensorReadingWithSensor extends SensorReading {
  sensor: Sensor;
  farm: Farm;
}

export interface FarmWithSensors extends Farm {
  sensors: Sensor[];
  sensor_count: number;
}

export interface AlertWithDetails extends Alert {
  sensor: Sensor | null;
  farm: Farm;
}

