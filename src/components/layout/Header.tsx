
import { Bell, Menu, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { toggle, isOpen } = useSidebar();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="flex h-16 items-center border-b bg-white px-6">
      {/* Botón para mostrar/ocultar sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="mr-4"
        aria-label={isOpen ? "Ocultar menú" : "Mostrar menú"}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Búsqueda */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar..."
          className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-10 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="ml-auto flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-orange-500"></span>
        </Button>

        {/* Información del usuario */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.nombre} {user.apellido}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'waiter' ? 'Mesero' : 
                 user.role === 'kitchen' ? 'Cocinero' : user.role}
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Botón de logout */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600"
          title="Cerrar Sesión"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
