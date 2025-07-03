import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ConstructionIcon, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export function UnderConstruction({ 
  title = "Página en construcción", 
  description = "Esta funcionalidad estará disponible próximamente." 
}: UnderConstructionProps) {
  const location = useLocation();
  const { section } = useParams<{ section?: string }>();

  // Determina el título de la sección basado en la URL actual
  const getSectionTitle = () => {
    if (section) {
      return section.charAt(0).toUpperCase() + section.slice(1);
    }

    // Extrae el nombre de la sección de la ruta
    const path = location.pathname.split("/")[1];
    if (!path) return "Esta sección";

    // Convertir el slug a un título legible
    const title = path.charAt(0).toUpperCase() + path.slice(1);

    // Mapeo de rutas a nombres más amigables
    const routeNameMap: Record<string, string> = {
      "ordenes": "Órdenes",
      "clientes": "Clientes",
      "analiticas": "Analíticas y reportes",
      "facturas": "Facturación",
      "marketing": "Marketing",
      "descuentos": "Descuentos y promociones",
      "pagos": "Pagos",
      "configuracion": "Configuración",
    };

    return routeNameMap[path] || title;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 rounded-full bg-orange-100 p-6">
        <ConstructionIcon className="h-12 w-12 text-orange-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 max-w-md text-gray-500">
        {description}
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Ir al Dashboard
          </Link>
        </Button>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>
    </div>
  );
}