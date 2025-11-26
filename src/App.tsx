import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./routes/ProtectedRoute";

const DEV_MODE = true; 

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          DEV_MODE ? (
            <Dashboard />
          ) : (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )
        }
      />

      <Route
        path="/settings"
        element={
          DEV_MODE ? (
            <Settings />
          ) : (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          )
        }
      />

      <Route
        path="/analytics"
        element={
          DEV_MODE ? (
            <Analytics />
          ) : (
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          )
        }
      />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}