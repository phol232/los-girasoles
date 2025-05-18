import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, FileText, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    // No es necesario navegar manualmente, ya que ProtectedRoute redirigirá al login
  };

  // Función para obtener las iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para obtener el rol en español
  const getUserRoleDisplay = () => {
    if (!user) return "";
    switch (user.role) {
      case "admin":
        return "Administrador";
      case "waiter":
        return "Mesero";
      case "kitchen":
        return "Cocina";
      default:
        return user.role;
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Buscador */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="w-full rounded-full border-gray-200 pl-10 text-sm"
        />
      </div>

      {/* Botones de acción y perfil */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Nueva orden #152</span>
                  <span className="text-xs text-gray-500">Hace 5 minutos</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Stock bajo: Tomates</span>
                  <span className="text-xs text-gray-500">Hace 20 minutos</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Orden #147 completada</span>
                  <span className="text-xs text-gray-500">Hace 35 minutos</span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mensajes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <FileText className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mensajes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Actualización de inventario</span>
                <span className="text-xs text-gray-500">Sistema, hoy 10:45</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Nuevo proveedor registrado</span>
                <span className="text-xs text-gray-500">Admin, ayer 16:30</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Foto de perfil" />
                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{getUserRoleDisplay()}</span>
                <span className="text-xs text-gray-500">{user?.name || "Usuario"}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4 text-gray-500"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
