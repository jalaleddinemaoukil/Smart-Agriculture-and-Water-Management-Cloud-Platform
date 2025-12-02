import { useAuth } from "./useAuth"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  role?: string
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, role: userRole, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  if (role && userRole !== role) return <Navigate to="/login" />

  return children
}
