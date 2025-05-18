import { createContext, useContext, useEffect, useState } from "react";

// Tipo para el usuario
export type UserRole = "admin" | "waiter" | "kitchen";

export interface User {
  name: string;
  role: UserRole;
  avatar?: string;
}

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Valores por defecto para el contexto
const defaultContextValue: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
};

// Creación del contexto con valores por defecto
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Al montar el componente, verificar si hay un usuario en localStorage
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Sincronizar autenticación entre pestañas
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Función para iniciar sesión
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  if (isLoading) {
    // Opcional: Podrías mostrar un spinner aquí si la carga toma tiempo
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}
