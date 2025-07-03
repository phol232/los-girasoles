
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Menu, 
  CalendarDays, 
  Eye,
  Grid2X2,
  List,
  MapPin,
  History,
  Users,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { tableService, Table as TableType, CreateTableRequest, UpdateTableRequest } from "@/services/api";

// Capacidades disponibles
const capacities = [2, 4, 6, 8, 10, 12];

export function Tables() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
  const [isDeleteTableModalOpen, setIsDeleteTableModalOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<TableType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Nueva mesa
  const [newTable, setNewTable] = useState<CreateTableRequest>({
    nombre: '',
    capacidad: 4,
    estado: 'libre'
  });

  // Cargar mesas al montar el componente
  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const data = await tableService.getAll();
      setTables(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading tables:", err);
      setError(err.message || "Error al cargar mesas");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar mesas
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || table.estado === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Agregar mesa
  const handleAddTable = async () => {
    if (!newTable.nombre || !newTable.capacidad) {
      setError("Nombre y capacidad son requeridos");
      return;
    }

    try {
      setActionLoading(true);
      await tableService.create(newTable);
      await loadTables();
      setIsAddTableModalOpen(false);
      setNewTable({ nombre: '', capacidad: 4, estado: 'libre' });
      setError(null);
    } catch (err: any) {
      console.error("Error adding table:", err);
      setError(err.message || "Error al agregar mesa");
    } finally {
      setActionLoading(false);
    }
  };

  // Editar mesa
  const handleEditTable = async () => {
    if (!currentTable) return;

    try {
      setActionLoading(true);
      const updateData: UpdateTableRequest = {
        nombre: currentTable.nombre,
        capacidad: currentTable.capacidad,
        estado: currentTable.estado,
      };
      
      await tableService.update(currentTable.mesa_id, updateData);
      await loadTables();
      setIsEditTableModalOpen(false);
      setCurrentTable(null);
      setError(null);
    } catch (err: any) {
      console.error("Error updating table:", err);
      setError(err.message || "Error al actualizar mesa");
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar mesa
  const handleDeleteTable = async () => {
    if (!currentTable) return;

    try {
      setActionLoading(true);
      await tableService.delete(currentTable.mesa_id);
      await loadTables();
      setIsDeleteTableModalOpen(false);
      setCurrentTable(null);
      setError(null);
    } catch (err: any) {
      console.error("Error deleting table:", err);
      setError(err.message || "Error al eliminar mesa");
    } finally {
      setActionLoading(false);
    }
  };

  // Obtener color según el estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "libre":
        return { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800" };
      case "ocupada":
        return { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" };
      case "reservada":
        return { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800" };
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case "libre":
        return "Libre";
      case "ocupada":
        return "Ocupada";
      case "reservada":
        return "Reservada";
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando mesas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mesas</h1>
          <p className="text-gray-500">
            Gestión de mesas y reservaciones
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddTableModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva Mesa
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar mesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <Menu className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="libre">Libre</SelectItem>
            <SelectItem value="ocupada">Ocupada</SelectItem>
            <SelectItem value="reservada">Reservada</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-md border">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="libre">Libres</TabsTrigger>
          <TabsTrigger value="ocupada">Ocupadas</TabsTrigger>
          <TabsTrigger value="reservada">Reservadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            // Vista en cuadrícula
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
              {filteredTables.map((table) => {
                const statusColor = getStatusColor(table.estado);
                return (
                  <Card
                    key={table.mesa_id}
                    className={`overflow-hidden border ${statusColor.border} ${statusColor.bg}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-2 text-3xl font-bold">{table.nombre}</div>
                      <div className="mt-1 text-xs">
                        <Users className="mr-1 inline-block h-3 w-3" />
                        {table.capacidad} personas
                      </div>
                      <Badge className={`mt-2 ${statusColor.badge}`}>
                        {getStatusLabel(table.estado)}
                      </Badge>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t bg-white p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setCurrentTable(table);
                          setIsEditTableModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setCurrentTable(table);
                          setIsDeleteTableModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Vista en lista
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => {
                    const statusColor = getStatusColor(table.estado);
                    return (
                      <TableRow key={table.mesa_id}>
                        <TableCell className="font-medium">{table.nombre}</TableCell>
                        <TableCell>{table.capacidad} personas</TableCell>
                        <TableCell>
                          <Badge className={statusColor.badge}>
                            {getStatusLabel(table.estado)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setCurrentTable(table);
                              setIsEditTableModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setCurrentTable(table);
                              setIsDeleteTableModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredTables.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
              <Menu className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">No se encontraron mesas</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay mesas que coincidan con los criterios seleccionados.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal: Agregar Mesa */}
      <Dialog open={isAddTableModalOpen} onOpenChange={setIsAddTableModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Mesa</DialogTitle>
            <DialogDescription>
              Complete los detalles para agregar una nueva mesa al sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Nombre
              </label>
              <Input
                value={newTable.nombre}
                onChange={(e) => setNewTable({...newTable, nombre: e.target.value})}
                placeholder="Ej: Mesa 1"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Capacidad
              </label>
              <Select 
                value={newTable.capacidad.toString()} 
                onValueChange={(val) => setNewTable({...newTable, capacidad: parseInt(val)})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona capacidad" />
                </SelectTrigger>
                <SelectContent>
                  {capacities.map(capacity => (
                    <SelectItem key={capacity} value={capacity.toString()}>
                      {capacity} personas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Estado
              </label>
              <Select 
                value={newTable.estado} 
                onValueChange={(val: "libre" | "ocupada" | "reservada") => setNewTable({...newTable, estado: val})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="libre">Libre</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="reservada">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTableModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTable} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Agregar Mesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Mesa */}
      <Dialog open={isEditTableModalOpen} onOpenChange={setIsEditTableModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Mesa</DialogTitle>
            <DialogDescription>
              Actualice los detalles de la mesa.
            </DialogDescription>
          </DialogHeader>

          {currentTable && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Nombre
                </label>
                <Input
                  value={currentTable.nombre}
                  onChange={(e) => setCurrentTable({...currentTable, nombre: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Capacidad
                </label>
                <Select 
                  value={currentTable.capacidad.toString()} 
                  onValueChange={(val) => setCurrentTable({...currentTable, capacidad: parseInt(val)})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona capacidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {capacities.map(capacity => (
                      <SelectItem key={capacity} value={capacity.toString()}>
                        {capacity} personas
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Estado
                </label>
                <Select 
                  value={currentTable.estado} 
                  onValueChange={(val: "libre" | "ocupada" | "reservada") => setCurrentTable({...currentTable, estado: val})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="libre">Libre</SelectItem>
                    <SelectItem value="ocupada">Ocupada</SelectItem>
                    <SelectItem value="reservada">Reservada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTableModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTable} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Eliminar Mesa */}
      <Dialog open={isDeleteTableModalOpen} onOpenChange={setIsDeleteTableModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Mesa</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar la mesa {currentTable?.nombre}?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteTableModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTable} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Eliminar Mesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
