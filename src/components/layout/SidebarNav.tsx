import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Clipboard,
  Coffee,
  FileText,
  Home,
  Layers,
  PackageOpen,
  Percent,
  Refrigerator,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  UtensilsCrossed,
  Wallet,
  Table,
  UserCircle
} from "lucide-react";

// Definición de las rutas de navegación con iconos
const navItems = [
  { name: "Inicio", path: "/", icon: <Home className="h-5 w-5" /> },
  { name: "POS", path: "/pos", icon: <ShoppingCart className="h-5 w-5" /> },
  { name: "Órdenes", path: "/ordenes", icon: <Clipboard className="h-5 w-5" /> },
  { name: "Cocina", path: "/cocina", icon: <UtensilsCrossed className="h-5 w-5" /> },
  { name: "Clientes", path: "/clientes", icon: <Users className="h-5 w-5" /> },
  { name: "Inventario", path: "/inventario", icon: <Refrigerator className="h-5 w-5" /> },
  { name: "Platillos", path: "/productos", icon: <Coffee className="h-5 w-5" /> },
  
  { name: "Proveedores", path: "/proveedores", icon: <Truck className="h-5 w-5" /> },
    { name: "Mesas", path: "/mesas", icon: <Table className="h-5 w-5" />, },
  { name: "Trabajadores", path: "/trabajadores", icon: <UserCircle className="h-5 w-5" />, },
  { name: "Boletas/Facturas", path: "/facturas", icon: <FileText className="h-5 w-5" /> },
];

// Componente de navegación secundaria específico para Analytics
const analyticsSubNav = [
  { name: "Dashboard", path: "/analiticas/dashboard" },
  { name: "Reportes", path: "/analiticas/reportes" },
  { name: "Vista en vivo", path: "/analiticas/live" },
];

export function SidebarNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isAnalyticsActive = location.pathname.startsWith("/analiticas");

  return (
    <div className="flex h-full flex-col bg-[#1c1c24] text-slate-300">
      {/* Logo y nombre del restaurante */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 text-white">
          <Layers className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold text-white">LOS GIRASOLES</span>
      </div>

      {/* Selector de restaurante (simulado) */}
      <div className="mx-4 mb-4 flex items-center justify-between rounded-md bg-[#242430] px-3 py-2">
        <div className="text-sm font-medium text-white">BUEN SABOR</div>
        <div className="rounded bg-[#333342] p-1">
          <Layers className="h-4 w-4" />
        </div>
      </div>

      {/* Elementos de navegación principal */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.path) || (item.path === "/analiticas" && isAnalyticsActive)
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-[#242430] hover:text-white"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Subnavegación para Analytics, visible solo cuando Analytics está activo */}
      {isAnalyticsActive && (
        <div className="px-3 py-2">
          {analyticsSubNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "ml-8 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-[#242430] text-white"
                  : "text-slate-400 hover:bg-[#242430] hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Footer con botones de ayuda y contacto */}
      <div className="mt-auto p-3">
        <div className="flex justify-between px-2 py-3">
          <button className="rounded-full bg-[#333342] p-2 text-slate-400 hover:bg-[#242430] hover:text-white">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-full bg-[#333342] p-2 text-slate-400 hover:bg-[#242430] hover:text-white">
            <span className="flex h-5 w-5 items-center justify-center font-bold">?</span>
          </button>
        </div>
      </div>
    </div>
  );
}