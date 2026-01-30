import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/UserAuth";
import type { JSX } from "react";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Si ya está autenticado, redirigir a tareas
    return <Navigate to="/tareas" replace />;
  }

  return children;
}