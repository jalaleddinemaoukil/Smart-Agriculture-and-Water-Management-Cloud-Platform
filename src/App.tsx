import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard"; 
import ProtectedRoute from "./routes/ProtectedRoute";


const DEV_MODE = true; 

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          DEV_MODE ? (
            <DashboardPage />
          ) : (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )
        }
      />

     
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
