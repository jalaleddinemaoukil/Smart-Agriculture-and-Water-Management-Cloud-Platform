# SWAMP Project - Current State Summary

**Project Name:** Smart Agriculture & Water Management Platform (SWAMP)  
**Date:** Current State as of project scan  
**Type:** IoT Platform for Smart Agriculture Monitoring

---

## 📋 Project Overview

A comprehensive IoT platform for smart agriculture monitoring and water management, leveraging Azure cloud services for real-time data processing and predictive analytics. The system processes sensor data streams, detects anomalies, and delivers actionable insights through an intuitive web dashboard.

---

## 🏗️ Architecture

### Frontend Application
- **Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite 7.2.4
- **UI Framework:** Tailwind CSS 4.1.17 + Shadcn UI components
- **State Management:** Zustand 5.0.8
- **Routing:** React Router DOM 7.9.6
- **Charts:** Recharts 2.15.4
- **Forms:** React Hook Form 7.66.1 + Zod 4.1.12
- **Authentication:** Supabase Auth + Azure MSAL (dual support)

### Backend Infrastructure (Planned/Configured)
- Azure Event Hub for IoT data ingestion
- Azure Stream Analytics for real-time data processing
- Azure Cosmos DB for NoSQL data storage
- Azure Functions for REST API endpoints
- Azure ML for predictive analytics and anomaly detection

### Infrastructure as Code
- Terraform configuration for Azure resources
- Docker setup for IoT simulator

---

## 📁 Project Structure

```
swamp/
├── src/
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   │
│   ├── auth/                      # Authentication module
│   │   ├── AuthProvider.tsx       # Supabase auth context provider
│   │   ├── ProtectedRoute.tsx    # Route protection component
│   │   └── useAuth.ts             # Auth hook
│   │
│   ├── components/                # React components
│   │   ├── app-sidebar.tsx        # Main sidebar navigation
│   │   ├── MetricCard.tsx         # Metric display card
│   │   ├── nav-main.tsx           # Navigation menu
│   │   ├── nav-user.tsx           # User navigation
│   │   └── ui/                    # Shadcn UI component library (50+ components)
│   │
│   ├── pages/                     # Application pages
│   │   ├── Dashboard.tsx          # Main dashboard with metrics & charts
│   │   ├── Analytics.tsx          # Analytics page
│   │   ├── Settings.tsx           # Settings page
│   │   └── Login.tsx               # Login page
│   │
│   ├── services/                  # API integration
│   │   └── api.ts                 # Axios-based API client with mock data fallback
│   │
│   ├── stores/                    # State management
│   │   └── sensorStore.ts         # Zustand store for sensor data
│   │
│   ├── types/                     # TypeScript types
│   │   └── sensor.ts              # Sensor data types
│   │
│   ├── lib/                       # Utilities
│   │   ├── supabaseClient.ts     # Supabase client configuration
│   │   └── utils.ts               # Helper functions
│   │
│   ├── config/                    # Configuration
│   │   └── authconfig.ts          # Auth configuration
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── use-mobile.ts          # Mobile detection hook
│   │
│   └── routes/                    # Route definitions
│       └── ProtectedRoute.tsx     # Route protection wrapper
│
├── public/                        # Static assets
│   ├── farm.jpg
│   ├── swamp-icon.png
│   └── swamp-logo.svg
│
├── docker/                        # Docker & IoT simulator
│   ├── Dockerfile
│   ├── iot_simulator.py          # Python IoT data simulator
│   └── requirements.txt          # Python dependencies (azure-eventhub)
│
├── terraform/                     # Infrastructure as Code
│   ├── main.tf                    # Main Terraform configuration
│   ├── variables.tf               # Variable definitions
│   └── outputs.tf                 # Output definitions
│
├── dist/                          # Build output
│   └── assets/                    # Compiled assets
│
├── node_modules/                  # Dependencies
│
├── package.json                   # NPM dependencies & scripts
├── pnpm-lock.yaml                 # PNPM lock file
├── pnpm-workspace.yaml            # PNPM workspace config
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
├── eslint.config.js               # ESLint configuration
├── components.json                # Shadcn components config
├── index.html                     # HTML entry point
├── LICENSE                        # License file
└── README.md                      # Project documentation (has merge conflict markers)
```

---

## 🔑 Key Features & Implementation Status

### ✅ Implemented

1. **Dashboard Page**
   - Real-time sensor data display (soil moisture, temperature, humidity, water usage)
   - Metric cards with trend indicators
   - Line charts for 24-hour historical data (Recharts)
   - Recent readings table
   - Auto-refresh polling (30-second intervals)
   - Loading states and error handling
   - Alert system integration

2. **Authentication System**
   - Supabase authentication integration
   - AuthProvider context for global auth state
   - Protected routes (currently in DEV_MODE bypass)
   - Session management

3. **State Management**
   - Zustand store for sensor data
   - Polling mechanism for real-time updates
   - Error state management
   - Loading state management

4. **API Integration**
   - Axios-based API client
   - Mock data fallback for development
   - Request interceptors for auth tokens
   - Error handling
   - Endpoints configured:
     - `GET /sensors/readings` - Fetch sensor readings
     - `GET /sensors/latest` - Get latest reading
     - `GET /sensors/historical` - Historical data
     - `GET /alerts` - Active alerts
     - `GET /health` - Health check

5. **UI Components**
   - Complete Shadcn UI component library (50+ components)
   - Custom MetricCard component
   - App sidebar with navigation
   - Responsive design with Tailwind CSS

6. **Infrastructure Setup**
   - Terraform configuration for Azure resources:
     - Resource Group
     - Event Hub Namespace & Event Hub
     - Cosmos DB Account, Database, Container
     - Log Analytics Workspace
     - Container App Environment
     - Container Registry
     - App Service Plan & Linux Web App
   - Docker setup for IoT simulator

### 🚧 In Progress / Planned

1. **Backend API**
   - Azure Functions not yet implemented
   - API endpoints need to be connected to Cosmos DB
   - Real-time data streaming from Event Hub

2. **Authentication**
   - Azure Entra ID integration (MSAL packages installed but not fully integrated)
   - Currently using Supabase, but MSAL is available

3. **Analytics Page**
   - UI implemented with placeholder cards
   - Shows "Coming Soon" message for Phase 3 features
   - Planned features: Predictive Irrigation, Anomaly Detection, Yield Prediction, Historical Comparison, Auto Reports
   - Currently displays feature previews but no actual analytics

4. **Settings Page**
   - Fully functional UI implemented
   - Profile settings (name, email, phone, language)
   - Alert thresholds (soil moisture, temperature)
   - Notification preferences (email, SMS, critical only)
   - Form state management with local state
   - Save functionality (currently logs to console, needs API integration)

---

## 🔧 Configuration Files

### package.json Scripts
- `dev` - Start development server (Vite)
- `build` - Build for production
- `lint` - Run ESLint
- `preview` - Preview production build
- `storybook` - Run Storybook dev server
- `build-storybook` - Build Storybook
- `check` - Type check + lint

### Environment Variables (Expected)
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Development Mode
- `DEV_MODE = true` in `App.tsx` - Bypasses protected routes for development

---

## 📦 Dependencies

### Core Dependencies
- React 19.2.0 + React DOM 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- React Router DOM 7.9.6
- Zustand 5.0.8 (state management)
- Axios 1.13.2 (HTTP client)
- Supabase JS 2.86.0 (auth & database)

### UI Dependencies
- Tailwind CSS 4.1.17
- Radix UI components (50+ components)
- Lucide React 0.554.0 (icons)
- Recharts 2.15.4 (charts)
- Sonner 2.0.7 (toasts)

### Auth Dependencies
- @azure/msal-browser 4.26.2
- @azure/msal-react 3.0.22
- @supabase/supabase-js 2.86.0

### Form Dependencies
- React Hook Form 7.66.1
- Zod 4.1.12
- @hookform/resolvers 5.2.2

### Dev Dependencies
- ESLint 9.39.1
- TypeScript ESLint
- Vitest 4.0.14 (testing)
- Playwright 1.57.0 (E2E testing)
- Husky 9.1.7 (Git hooks)

---

## 🗄️ Data Models

### Sensor Reading (from types/sensor.ts)
```typescript
interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: string; // ISO format
  soilMoisture: number; // percentage (0-100)
  temperature: number; // celsius
  humidity: number; // percentage (0-100)
  waterUsed: number; // liters
}
```

### Alert
```typescript
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string; // ISO format
}
```

### SensorState (Zustand Store)
```typescript
interface SensorState {
  readings: SensorReading[];
  latestReading: SensorReading | null;
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
```

### MetricCard
```typescript
interface MetricCard {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon: string;
}
```

---

## 🔄 Current Data Flow

1. **Frontend → API**
   - Dashboard component mounts
   - `useSensorStore` hook initializes
   - `startPolling()` called (30s interval)
   - `fetchSensorData()` and `fetchAlerts()` called via API service
   - Data stored in Zustand store
   - Components re-render with new data

2. **Mock Data Fallback**
   - If `USE_MOCK_DATA = true` or API fails
   - Generates 100 mock readings with realistic values
   - Generates sample alerts

3. **Real-time Updates**
   - Polling every 30 seconds
   - Manual refresh button available
   - Loading states during fetch
   - Error states on failure

---

## 🚀 Deployment Configuration

### Terraform Resources
- **Location:** Configurable via variables
- **Resource Group:** Configurable
- **Event Hub:** Basic tier, 2 partitions
- **Cosmos DB:** Serverless, Session consistency
- **Web App:** Linux, Free tier (F1), Node.js 18

### Docker
- Python-based IoT simulator
- Azure Event Hub client for data ingestion

---

## ⚠️ Known Issues / Notes

1. **README.md** has merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> master`)
2. **DEV_MODE** is enabled, bypassing authentication
3. **API Backend** not yet implemented - using mock data
4. **Dual Auth Systems:** Both Supabase and Azure MSAL configured, but Supabase is active
5. **Environment Variables:** Need to be configured for production

---

## 🎯 Next Steps (Recommended)

1. Resolve README.md merge conflict
2. Implement Azure Functions backend API
3. Connect API to Cosmos DB for real data
4. Set up Event Hub data ingestion pipeline
5. Complete Analytics and Settings pages
6. Integrate Azure Entra ID authentication (or choose one auth system)
7. Set up CI/CD pipeline
8. Configure production environment variables
9. Test end-to-end data flow
10. Deploy to Azure

---

## 📝 Code Quality

- TypeScript strict mode enabled
- ESLint configured with React hooks rules
- Husky for Git hooks
- Vitest + Playwright for testing (configured but tests not visible)

---

## 👥 Team (from README)

- **Oussama** - Backend development, Azure Functions, Authentication
- **Jalal Eddine** - Frontend development, Infrastructure, CI/CD, UI/UX
- **Zineb** - Testing, Documentation, IoT Research

---

## 📄 License

Academic final year project (PFE)

---

**Last Updated:** Current project state scan  
**Project Status:** Active Development - Frontend mostly complete, Backend infrastructure configured but not fully implemented

