import { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "admin" | "waiter" | "kitchen";

export interface User {
  empleado_id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol_id: number;
  role: UserRole;
  telefono?: string;
  estado: "activo" | "inactivo";
  fecha_ingreso: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  rol_id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  password_confirmation: string;
  telefono?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const defaultContextValue: AuthContextType = {
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isLoading: true,
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AuthContext = createContext<AuthContextType>(defaultContextValue);

const mapRoleIdToUserRole = (rol_id: number): UserRole => {
  switch (rol_id) {
    case 1:
      return "admin";
    case 2:
      return "kitchen";
    case 3:
      return "waiter";
    default:
      return "admin";
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      const userWithRole = {
        ...data.empleado,
        role: mapRoleIdToUserRole(data.empleado.rol_id),
      };

      setUser(userWithRole);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al registrar usuario');
      }

      const userWithRole = {
        ...responseData.empleado,
        role: mapRoleIdToUserRole(responseData.empleado.rol_id),
      };

      setUser(userWithRole);
      setToken(responseData.token);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("token", responseData.token);
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
