import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado y no hay un usuario guardado en localStorage, redirigir al login
  if (!isAuthenticated) {
    // Verificar si hay un usuario en localStorage para mantener la sesión
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return <Navigate to={redirectTo} replace />;
    }
    // Si hay un usuario en localStorage pero no está en el contexto, la sesión
    // se restaurará en el AuthProvider, así que permitimos que continúe
  }

  // Si hay roles permitidos y el usuario no tiene un rol permitido, redirigir
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role as UserRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y tiene los permisos necesarios, renderizar el contenido de la ruta
  return <Outlet />;
}
