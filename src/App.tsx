import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Inventory } from "./pages/Inventory";
import { Products } from "./pages/Products";
import { POS } from "./pages/POS";
import { Kitchen } from "./pages/Kitchen";
import { UnderConstruction } from "./pages/UnderConstruction";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Rutas implementadas */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventario" element={<Inventory />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/cocina" element={<Kitchen />} />

                {/* Rutas en construcción */}
                <Route path="/ordenes" element={<UnderConstruction />} />
                <Route path="/clientes" element={<UnderConstruction />} />
                <Route path="/analiticas" element={<UnderConstruction />} />
                <Route path="/facturas" element={<UnderConstruction />} />
                <Route path="/marketing" element={<UnderConstruction />} />
                <Route path="/descuentos" element={<UnderConstruction />} />
                <Route path="/pagos" element={<UnderConstruction />} />
                <Route path="/configuracion" element={<UnderConstruction />} />

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
        <Toaster position="top-right" />
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
