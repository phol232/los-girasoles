import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { SidebarProvider } from "./context/SidebarContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { POS } from "./pages/POS";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Productos } from "./pages/Productos";
import { Inventory } from "./pages/Inventory";
import { Kitchen } from "./pages/Kitchen";
import { Settings } from "./pages/Settings";
import { UnderConstruction } from "./pages/UnderConstruction";
import { Orders } from "./pages/Orders";
import { Clients } from "./pages/Clients";
import { Invoices } from "./pages/Invoices";
import { Delivery } from "./pages/Delivery";
import { Tables } from "./pages/Tables";
import { Employees } from "./pages/Employees";
import { Suppliers } from "./pages/Suppliers";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <SidebarProvider>
          <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Rutas implementadas */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventario" element={<Inventory />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/cocina" element={<Kitchen />} />

                {/* Rutas actualizadas con componentes propios */}
                <Route path="/ordenes" element={<Orders />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/analiticas" element={<UnderConstruction />} />
                <Route path="/facturas" element={<Invoices />} />
                <Route path="/marketing" element={<UnderConstruction />} />
                <Route path="/descuentos" element={<UnderConstruction />} />
                <Route path="/pagos" element={<UnderConstruction />} />
                <Route path="/configuracion" element={<Settings />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/mesas" element={<Tables />} />
                <Route path="/trabajadores" element={<Employees />} />
                <Route path="/proveedores" element={<Suppliers />} />

                {/* Rutas para Analytics Subnav */}
                <Route path="/analiticas/dashboard" element={<UnderConstruction />} />
                <Route path="/analiticas/reportes" element={<UnderConstruction />} />
                <Route path="/analiticas/live" element={<UnderConstruction />} />
              </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
    <Toaster />
        </SidebarProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;