import { useAuth } from "./useAuth"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"

interface ProtectedRouteProps {
  children: ReactNode
  role?: string
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, role: userRole, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-12" />
    </div>
  )
  if (!user) return <Navigate to="/login" />

  if (role && userRole !== role) return <Navigate to="/login" />

  return children
}
