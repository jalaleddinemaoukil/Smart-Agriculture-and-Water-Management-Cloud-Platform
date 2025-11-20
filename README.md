<<<<<<< HEAD
# Smart Agriculture & Water Management Platform

A comprehensive IoT platform for smart agriculture monitoring and water management, leveraging Azure cloud services for real-time data processing and predictive analytics.

## Overview

This platform enables agricultural monitoring through IoT sensors, providing real-time insights into soil conditions, water usage, and environmental parameters. The system processes sensor data streams, detects anomalies, and delivers actionable insights through an intuitive web dashboard.

## Architecture

### Backend Infrastructure
- Azure Event Hub for IoT data ingestion
- Azure Stream Analytics for real-time data processing
- Azure Cosmos DB for NoSQL data storage
- Azure Functions for REST API endpoints
- Azure ML for predictive analytics and anomaly detection

### Frontend Application
- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS and Shadcn UI components
- Recharts for data visualization
- Leaflet.js for geospatial mapping
- SignalR for real-time updates

### Authentication & Security
- Azure Entra ID for identity management
- Facebook authentication provider integration
- Role-based access control

### Infrastructure as Code
- Terraform for infrastructure provisioning
- CI/CD pipeline automation
- Separate production and development environments

## Project Structure
```
.
├── backend/
│   ├── functions/          # Azure Functions APIs
│   ├── stream-analytics/   # Stream processing queries
│   └── simulator/          # IoT data simulator
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API integration
│   │   └── utils/          # Utility functions
│   └── public/
├── infrastructure/
│   └── terraform/          # IaC configuration
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Python 3.x
- Azure CLI
- Terraform
- Azure subscription

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/sawmp-platform.git
cd sawmp-platform
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Configure Azure resources
```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

4. Set up environment variables
```bash
cp .env.example .env
# Configure your Azure credentials and endpoints
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

The platform includes a Python-based IoT simulator that generates realistic sensor data based on AgroLora specifications.
```bash
cd backend/simulator
python simulator.py
```

## API Endpoints

- GET `/api/sensors` - Retrieve sensor data
- GET `/api/analytics` - Get analytics insights
- POST `/api/alerts` - Create alert configuration
- GET `/api/anomalies` - Retrieve detected anomalies
- GET `/api/predictions` - Get ML predictions
- POST `/api/user/preferences` - Update user settings

## Deployment

### Frontend Deployment
The frontend is deployed to Azure Static Web Apps through the CI/CD pipeline.

### Backend Deployment
Azure Functions are deployed automatically via GitHub Actions on push to main branch.

## Testing
```bash
npm run test
```

## Documentation

Detailed technical documentation is available in the `/docs` directory, including:
- Architecture design documents
- API specifications
- Deployment guides
- User manuals

## Team

- Oussama - Backend development, Azure Functions, Authentication
- Jalal Eddine - Frontend development, Infrastructure, CI/CD, UI/UX
- Zineb - Testing, Documentation, IoT Research

## Technologies

**Cloud Services:** Azure Event Hub, Stream Analytics, Cosmos DB, Azure Functions, Azure ML, Azure Entra ID

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn, Recharts, Leaflet.js

**Backend:** Node.js, Python, SignalR

**DevOps:** Terraform, Azure CLI, GitHub Actions, Git

**Testing:** Postman, Jest

## License

This project is part of an academic final year project (PFE).

## Contact

For questions or feedback, please contact the development team through the project repository.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> master
