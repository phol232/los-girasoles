
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Header } from "./Header";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export function MainLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - ancho dinámico basado en estado */}
      <aside 
        className={cn(
          "fixed left-0 z-20 h-full w-64 shrink-0 transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav />
      </aside>

      {/* Botón flotante para mostrar sidebar cuando está oculto */}
      {!isOpen && (
        <button
          onClick={() => useSidebar().open()}
          className="fixed bottom-4 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700"
          aria-label="Mostrar menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Contenido principal - ajustable según sidebar */}
      <main 
        className={cn(
          "flex w-full flex-col transition-all duration-300",
          isOpen ? "ml-64" : "ml-0"
        )}
      >
        <Header />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
