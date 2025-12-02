-- SWAMP Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'farmer' CHECK (role IN ('admin', 'farmer', 'viewer')),
  phone TEXT,
  language TEXT DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FARMS TABLE
-- ============================================
CREATE TABLE public.farms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  size_hectares DECIMAL(10, 2),
  crop_type TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SENSORS TABLE
-- ============================================
CREATE TABLE public.sensors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sensor_id TEXT UNIQUE NOT NULL, -- External sensor ID (e.g., "SENSOR-001")
  type TEXT DEFAULT 'agro' CHECK (type IN ('agro', 'weather', 'irrigation')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'offline')),
  battery_level INTEGER,
  signal_strength INTEGER,
  last_seen TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SENSOR READINGS TABLE
-- ============================================
CREATE TABLE public.sensor_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  soil_moisture DECIMAL(5, 2) CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2) CHECK (humidity >= 0 AND humidity <= 100),
  water_used DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE public.alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  moisture_threshold DECIMAL(5, 2) DEFAULT 30,
  temp_threshold DECIMAL(5, 2) DEFAULT 35,
  email_alerts BOOLEAN DEFAULT true,
  sms_alerts BOOLEAN DEFAULT false,
  critical_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FARM MEMBERS TABLE (for multi-user access)
-- ============================================
CREATE TABLE public.farm_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'manager', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(farm_id, user_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_farms_owner_id ON public.farms(owner_id);
CREATE INDEX idx_sensors_farm_id ON public.sensors(farm_id);
CREATE INDEX idx_sensors_sensor_id ON public.sensors(sensor_id);
CREATE INDEX idx_sensors_status ON public.sensors(status);
CREATE INDEX idx_readings_sensor_id ON public.sensor_readings(sensor_id);
CREATE INDEX idx_readings_farm_id ON public.sensor_readings(farm_id);
CREATE INDEX idx_readings_timestamp ON public.sensor_readings(timestamp DESC);
CREATE INDEX idx_readings_sensor_timestamp ON public.sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX idx_alerts_farm_id ON public.alerts(farm_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_farm_members_farm_id ON public.farm_members(farm_id);
CREATE INDEX idx_farm_members_user_id ON public.farm_members(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_members ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- FARMS POLICIES
CREATE POLICY "Users can view own farms"
  ON public.farms FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.farm_members
      WHERE farm_id = farms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create farms"
  ON public.farms FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own farms"
  ON public.farms FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete own farms"
  ON public.farms FOR DELETE
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all farms"
  ON public.farms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SENSORS POLICIES
CREATE POLICY "Users can view sensors in their farms"
  ON public.sensors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = sensors.farm_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.farm_members
          WHERE farm_id = sensors.farm_id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create sensors in own farms"
  ON public.sensors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = sensors.farm_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sensors in own farms"
  ON public.sensors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = sensors.farm_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sensors in own farms"
  ON public.sensors FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = sensors.farm_id AND owner_id = auth.uid()
    )
  );

-- SENSOR READINGS POLICIES
CREATE POLICY "Users can view readings from their farms"
  ON public.sensor_readings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = sensor_readings.farm_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.farm_members
          WHERE farm_id = sensor_readings.farm_id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Service role can insert readings"
  ON public.sensor_readings FOR INSERT
  WITH CHECK (true); -- MQTT bridge will use service role

-- ALERTS POLICIES
CREATE POLICY "Users can view alerts from their farms"
  ON public.alerts FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = alerts.farm_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.farm_members
          WHERE farm_id = alerts.farm_id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON public.alerts FOR UPDATE
  USING (user_id = auth.uid());

-- USER PREFERENCES POLICIES
CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- FARM MEMBERS POLICIES
CREATE POLICY "Users can view farm members"
  ON public.farm_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = farm_members.farm_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.farm_members fm
          WHERE fm.farm_id = farm_members.farm_id AND fm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Farm owners can manage members"
  ON public.farm_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = farm_members.farm_id AND owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE id = farm_members.farm_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON public.sensors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update sensor last_seen
CREATE OR REPLACE FUNCTION public.update_sensor_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.sensors
  SET last_seen = NEW.timestamp,
      status = CASE 
        WHEN NOW() - NEW.timestamp > INTERVAL '1 hour' THEN 'offline'
        ELSE 'active'
      END
  WHERE id = NEW.sensor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update sensor status on new reading
CREATE TRIGGER update_sensor_status_on_reading
  AFTER INSERT ON public.sensor_readings
  FOR EACH ROW EXECUTE FUNCTION public.update_sensor_last_seen();

-- ============================================
-- ENABLE REALTIME (must be after tables are created)
-- ============================================

-- Note: If these commands fail, enable Realtime via Supabase Dashboard:
-- Go to Database → Replication → Enable for sensor_readings and alerts tables

-- Enable Realtime on sensor_readings table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sensor_readings;
  END IF;
END $$;

-- Enable Realtime on alerts table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
  END IF;
END $$;

