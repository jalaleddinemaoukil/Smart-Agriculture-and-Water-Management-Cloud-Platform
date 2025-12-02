# Smart Agriculture & Water Management Platform

A comprehensive IoT platform for smart agriculture monitoring and water management, leveraging Supabase, HiveMQ, and modern web technologies for real-time data processing and analytics.

## Overview

This platform enables agricultural monitoring through IoT sensors, providing real-time insights into soil conditions, water usage, and environmental parameters. The system processes sensor data streams via MQTT, stores data in Supabase PostgreSQL, and delivers actionable insights through an intuitive React dashboard.

## Architecture

### Backend Infrastructure
- **HiveMQ Cloud** for IoT data ingestion via MQTT
- **Supabase PostgreSQL** for data storage
- **Supabase Realtime** for live data updates
- **Node.js MQTT Bridge** for connecting IoT sensors to database

### Frontend Application
- React 19 with TypeScript
- Vite as build tool
- Tailwind CSS and Shadcn UI components
- Recharts for data visualization
- Supabase Auth for authentication

### Infrastructure
- Supabase (Database, Auth, Realtime)
- HiveMQ Cloud (MQTT Broker)
- Render (MQTT Bridge deployment)
- Vercel (Frontend deployment)

## Project Structure
```
.
├── src/                    # React frontend application
│   ├── components/         # React components
│   ├── pages/              # Application pages
│   ├── services/           # API integration (Supabase)
│   ├── stores/             # State management (Zustand)
│   └── types/              # TypeScript types
├── bridge/                 # MQTT bridge service
│   └── src/                # Node.js bridge code
├── docker/                 # IoT simulator
│   └── iot_simulator_mqtt.py
├── supabase/               # Database migrations
│   └── migrations/
└── terraform/              # Infrastructure as Code (legacy Azure)
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Python 3.x (for IoT simulator)
- Supabase account
- HiveMQ Cloud account (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/jalaleddinemaoukil/Smart-Agriculture-and-Water-Management-Cloud-Platform.git
cd Smart-Agriculture-and-Water-Management-Cloud-Platform
```

2. Install frontend dependencies
```bash
npm install
```

3. Set up Supabase
   - Create a project at https://app.supabase.com
   - Run the SQL migration in `supabase/migrations/001_initial_schema.sql`
   - Enable Realtime on `sensor_readings` and `alerts` tables

4. Set up environment variables
```bash
# Frontend (.env.local)
cp .env.example .env.local
# Add your Supabase URL and anon key
```

5. Run the development server
```bash
npm run dev
```

## Branching Strategy

- `main` - Production-ready code
- `dev` - Development and integration branch
- Feature branches created from `dev`

## IoT Simulator

The platform includes a Python-based IoT simulator that publishes sensor data to MQTT.
```bash
cd docker
pip install -r requirements.txt
python iot_simulator_mqtt.py
```

## Deployment

### Frontend (Vercel)
The frontend can be deployed to Vercel through GitHub integration.

### MQTT Bridge (Render)
The bridge service is deployed to Render. See `bridge/README.md` for details.

## Testing
```bash
npm run check
```

## Documentation

- `IMPLEMENTATION_GUIDE.md` - Complete setup guide
- `PROJECT_STATE.md` - Current project status
- `DASHBOARD_AND_SIDEBAR_EXPLANATION.md` - UI component documentation

## Team

- Oussama - Backend development, Azure Functions, Authentication
- Jalal Eddine - Frontend development, Infrastructure, CI/CD, UI/UX
- Zineb - Testing, Documentation, IoT Research

## Technologies

**Cloud Services:** Supabase (PostgreSQL, Auth, Realtime), HiveMQ Cloud (MQTT)

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, Recharts

**Backend:** Node.js, Python, MQTT

**DevOps:** GitHub Actions, Git

**Testing:** Vitest, Playwright

## License

This project is part of an academic final year project (PFE).

## Contact

For questions or feedback, please contact the development team through the project repository.
