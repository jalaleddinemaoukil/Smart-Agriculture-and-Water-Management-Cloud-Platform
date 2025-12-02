# SWAMP MQTT Bridge

Bridge service that connects MQTT IoT sensors to Supabase database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

3. Configure environment variables:
- `MQTT_BROKER_URL` - Your HiveMQ Cloud broker URL
- `MQTT_USERNAME` - MQTT username
- `MQTT_PASSWORD` - MQTT password
- `MQTT_TOPIC` - Topic pattern to subscribe to (default: `swamp/sensors/+/data`)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

## Production

Build and run:
```bash
npm run build
npm start
```

## Message Format

The bridge expects messages in this format:

```json
{
  "sensorId": "SENSOR-001",
  "farmId": "optional-farm-uuid",
  "timestamp": "2024-01-01T12:00:00Z",
  "soilMoisture": 45.5,
  "temperature": 25.3,
  "humidity": 60.2,
  "waterUsed": 120.5
}
```

## Deployment

### Render.com

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Other Platforms

The bridge can run on any Node.js hosting platform. Just ensure:
- Node.js 18+ is available
- Environment variables are set
- Port is not required (MQTT client doesn't listen on HTTP)

