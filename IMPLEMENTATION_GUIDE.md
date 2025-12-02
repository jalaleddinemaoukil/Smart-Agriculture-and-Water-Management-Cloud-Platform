# SWAMP Implementation Guide - Free Stack Migration

## 🎯 Quick Start Checklist

### Phase 1: Database Setup ✅

1. **Create Supabase Project**
   - Go to https://app.supabase.com
   - Create new project
   - Note your project URL and anon key

2. **Run Database Migration**
   - Open Supabase SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL script
   - Verify tables are created

3. **Enable Realtime** ⚠️ IMPORTANT
   - After running the SQL migration, go to Database → Replication in Supabase Dashboard
   - Enable replication for `sensor_readings` table
   - Enable replication for `alerts` table
   - (The SQL tries to enable it automatically, but if it fails, do it manually via dashboard)

4. **Create Test Data** (Optional)
   ```sql
   -- Create a test farm (replace user_id with your auth user id)
   INSERT INTO farms (owner_id, name, description, location_lat, location_lng)
   VALUES (
     'your-user-id-here',
     'Test Farm',
     'My first farm',
     33.5731,
     -7.5898
   );

   -- Create a test sensor
   INSERT INTO sensors (farm_id, name, sensor_id, type, status)
   VALUES (
     'farm-id-from-above',
     'Main Sensor',
     'SENSOR-001',
     'agro',
     'active'
   );
   ```

---

### Phase 2: Environment Variables

1. **Frontend (.env.local)**
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **MQTT Bridge (.env in bridge/)**
   ```bash
   MQTT_BROKER_URL=mqtts://dd95be6fa8eb408f8d88969d081c5d8d.s1.eu.hivemq.cloud:8883
   MQTT_USERNAME=jalaledn
   MQTT_PASSWORD=VyneJoestar@123
   MQTT_TOPIC=swamp/sensors/+/data
   SUPABASE_URL=https://hhdhnvrfcvitjuzshmmh.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZGhudnJmY3ZpdGp1enNobW1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDY4NTM2NSwiZXhwIjoyMDgwMjYxMzY1fQ.BeLmK0yDEwRVjH7WK6nuYXcO70xUy2izgnhUZ_338xQ
   ```

3. **IoT Simulator (.env in docker/)**
   ```bash
   MQTT_BROKER=your-broker.hivemq.cloud
   MQTT_PORT=8883
   MQTT_USERNAME=your_mqtt_username
   MQTT_PASSWORD=your_mqtt_password
   MQTT_TOPIC_PREFIX=swamp/sensors
   SENSOR_ID=SENSOR-001
   FARM_ID=your-farm-uuid
   UPDATE_INTERVAL=30
   ```

---

### Phase 3: MQTT Bridge Setup

1. **Install Dependencies**
   ```bash
   cd bridge
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Render**
   - Create new Web Service
   - Connect GitHub repo
   - Set root directory: `bridge`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add environment variables
   - Deploy

---

### Phase 4: Frontend Updates

1. **Install Dependencies** (if needed)
   ```bash
   npm install
   ```

2. **Update Environment Variables**
   - Create `.env.local` with Supabase credentials

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Update Dashboard**
   - The store now uses Supabase automatically
   - Real-time updates work automatically
   - No code changes needed!

---

### Phase 5: IoT Simulator

1. **Install Dependencies**
   ```bash
   cd docker
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Get Farm ID**
   - Go to Supabase dashboard
   - Query farms table to get your farm ID
   - Update `FARM_ID` in `.env`

4. **Run Simulator**
   ```bash
   python iot_simulator_mqtt.py
   ```

---

## 🔧 Troubleshooting

### Database Issues

**Problem:** RLS policies blocking queries
**Solution:** Check that user is authenticated and owns the farm

**Problem:** Realtime not working
**Solution:** 
- Verify replication is enabled in Supabase dashboard
- Check that you're subscribed to correct channel
- Verify RLS allows SELECT on the table

### MQTT Bridge Issues

**Problem:** Bridge not receiving messages
**Solution:**
- Check MQTT broker connection
- Verify topic subscription matches publisher
- Check message format matches schema

**Problem:** Bridge can't insert data
**Solution:**
- Verify service role key is correct
- Check sensor exists in database
- Verify sensor_id matches

### Frontend Issues

**Problem:** No data showing
**Solution:**
- Check browser console for errors
- Verify Supabase credentials
- Check network tab for API calls
- Ensure user is authenticated

**Problem:** Real-time not updating
**Solution:**
- Check Supabase Realtime is enabled
- Verify subscription is active
- Check RLS policies allow SELECT

---

## 📊 Testing Checklist

- [ ] Database tables created
- [ ] RLS policies working
- [ ] Can create farm
- [ ] Can create sensor
- [ ] MQTT bridge connects
- [ ] Simulator publishes data
- [ ] Bridge receives and stores data
- [ ] Frontend displays data
- [ ] Real-time updates work
- [ ] Alerts are created
- [ ] User preferences save

---

## 🚀 Next Steps

After basic setup works:

1. **Add Farm Management UI**
   - Farm selection dropdown
   - Create/edit farms
   - Farm details page

2. **Add Sensor Management**
   - Sensor list page
   - Add/edit sensors
   - Sensor status monitoring

3. **Enhance Dashboard**
   - Date range filtering
   - Multiple sensor support
   - Export functionality

4. **Add Features**
   - Alert management
   - Historical data analysis
   - Farm map integration

---

## 📝 Notes

- The bridge uses service role key to bypass RLS for inserts
- Frontend uses anon key with RLS for security
- Real-time subscriptions automatically handle updates
- Mock data fallback removed - now uses Supabase only

