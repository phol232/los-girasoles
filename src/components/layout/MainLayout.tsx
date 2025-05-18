import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Header } from "./Header";

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - ancho fijo */}
      <aside className="fixed left-0 z-20 h-full w-64 shrink-0">
        <SidebarNav />
      </aside>

      {/* Contenido principal */}
      <main className="ml-64 flex w-full flex-col">
        <Header />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
