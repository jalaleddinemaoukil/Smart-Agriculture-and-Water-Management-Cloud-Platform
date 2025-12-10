import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./auth/ProtectedRoute";

const DEV_MODE = false;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
