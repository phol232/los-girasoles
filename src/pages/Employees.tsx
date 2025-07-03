import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
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
  User, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Utensils, 
  ChefHat, 
  Activity, 
  Coffee, 
  Grid, 
  List,
  UserCircle2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { employeeService, Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "@/services/api";

// Roles disponibles
const roles = [
  { id: 1, name: "Administrador", department: "Administración" },
  { id: 2, name: "Mesero", department: "Servicio" },
  { id: 3, name: "Cocina", department: "Cocina" },
];

// Departamentos
const departments = [
  "Servicio",
  "Cocina", 
  "Administración",
  "Delivery",
  "Limpieza"
];

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Nuevo empleado
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeRequest>({
    rol_id: 2,
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    estado: "activo",
  });

  // Cargar empleados al montar el componente
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading employees:", err);
      setError(err.message || "Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  // Obtener el nombre del rol
  const getRoleName = (rol_id: number) => {
    const role = roles.find(r => r.id === rol_id);
    return role?.name || "Desconocido";
  };

  // Obtener el departamento del rol
  const getDepartmentByRole = (rol_id: number) => {
    const role = roles.find(r => r.id === rol_id);
    return role?.department || "Desconocido";
  };

  // Filtrar empleados
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.telefono && employee.telefono.includes(searchTerm));

    const employeeDepartment = getDepartmentByRole(employee.rol_id);
    const matchesDepartment = selectedDepartment === "all" || employeeDepartment === selectedDepartment;

    const matchesRole = selectedRole === "all" || employee.rol_id.toString() === selectedRole;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Agregar empleado
  const handleAddEmployee = async () => {
    if (!newEmployee.nombre || !newEmployee.apellido || !newEmployee.email || !newEmployee.password) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      setActionLoading(true);
      await employeeService.create(newEmployee);
      await loadEmployees();
      setIsAddEmployeeModalOpen(false);
      setNewEmployee({
        rol_id: 2,
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        estado: "activo",
      });
      setError(null);
    } catch (err: any) {
      console.error("Error adding employee:", err);
      setError(err.message || "Error al agregar empleado");
    } finally {
      setActionLoading(false);
    }
  };

  // Editar empleado
  const handleEditEmployee = async () => {
    if (!currentEmployee) return;

    try {
      setActionLoading(true);
      const updateData: UpdateEmployeeRequest = {
        rol_id: currentEmployee.rol_id,
        nombre: currentEmployee.nombre,
        apellido: currentEmployee.apellido,
        email: currentEmployee.email,
        telefono: currentEmployee.telefono,
        estado: currentEmployee.estado,
      };

      await employeeService.update(currentEmployee.empleado_id, updateData);
      await loadEmployees();
      setIsEditEmployeeModalOpen(false);
      setCurrentEmployee(null);
      setError(null);
    } catch (err: any) {
      console.error("Error updating employee:", err);
      setError(err.message || "Error al actualizar empleado");
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar empleado
  const handleDeleteEmployee = async () => {
    if (!currentEmployee) return;

    try {
      setActionLoading(true);
      await employeeService.delete(currentEmployee.empleado_id);
      await loadEmployees();
      setIsDeleteEmployeeModalOpen(false);
      setCurrentEmployee(null);
      setError(null);
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      setError(err.message || "Error al eliminar empleado");
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado de empleado
  const toggleEmployeeStatus = async (employee: Employee) => {
    try {
      setActionLoading(true);
      const newStatus = employee.estado === "activo" ? "inactivo" : "activo";
      await employeeService.update(employee.empleado_id, { estado: newStatus });
      await loadEmployees();
      setError(null);
    } catch (err: any) {
      console.error("Error toggling employee status:", err);
      setError(err.message || "Error al cambiar estado del empleado");
    } finally {
      setActionLoading(false);
    }
  };

  // Obtener ícono según departamento
  const getDepartmentIcon = (rol_id: number) => {
    const department = getDepartmentByRole(rol_id);
    switch (department) {
      case "Servicio":
        return <Utensils className="h-5 w-5" />;
      case "Cocina":
        return <ChefHat className="h-5 w-5" />;
      case "Administración":
        return <Activity className="h-5 w-5" />;
      case "Delivery":
        return <Coffee className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando empleados...</span>
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
          <h1 className="text-2xl font-bold tracking-tight">Trabajadores</h1>
          <p className="text-gray-500">
            Gestión del personal del restaurante
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddEmployeeModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo Trabajador
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
            <Activity className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map(department => (
              <SelectItem key={department} value={department}>{department}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <UserCircle2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-md border">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
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

      {/* Contenido */}
      {viewMode === "grid" ? (
        // Vista en cuadrícula
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.empleado_id}
              className={`overflow-hidden ${
                employee.estado === "inactivo" ? "opacity-70" : ""
              }`}
            >
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">{employee.nombre} {employee.apellido}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {getRoleName(employee.rol_id)}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    {getDepartmentIcon(employee.rol_id)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{employee.telefono}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Desde: {new Date(employee.fecha_ingreso).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${
                      getDepartmentByRole(employee.rol_id) === "Servicio" ? "bg-blue-100 text-blue-800" :
                      getDepartmentByRole(employee.rol_id) === "Cocina" ? "bg-green-100 text-green-800" :
                      getDepartmentByRole(employee.rol_id) === "Administración" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {getDepartmentByRole(employee.rol_id)}
                    </Badge>
                    <Badge className={`${
                      employee.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {employee.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => toggleEmployeeStatus(employee)}
                  disabled={actionLoading}
                >
                  {employee.estado === "activo" ? (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Desactivar</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Activar</span>
                    </>
                  )}
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setCurrentEmployee(employee);
                      setIsEditEmployeeModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setCurrentEmployee(employee);
                      setIsDeleteEmployeeModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Vista en lista
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.empleado_id} className={employee.estado === "inactivo" ? "opacity-70" : ""}>
                  <TableCell className="font-medium">
                    {employee.nombre} {employee.apellido}
                  </TableCell>
                  <TableCell>{getRoleName(employee.rol_id)}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      getDepartmentByRole(employee.rol_id) === "Servicio" ? "bg-blue-100 text-blue-800" :
                      getDepartmentByRole(employee.rol_id) === "Cocina" ? "bg-green-100 text-green-800" :
                      getDepartmentByRole(employee.rol_id) === "Administración" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {getDepartmentByRole(employee.rol_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">{employee.email}</div>
                    {employee.telefono && (
                      <div className="text-xs">{employee.telefono}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      employee.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {employee.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleEmployeeStatus(employee)}
                      disabled={actionLoading}
                    >
                      {employee.estado === "activo" ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setCurrentEmployee(employee);
                        setIsEditEmployeeModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setCurrentEmployee(employee);
                        setIsDeleteEmployeeModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">No se encontraron trabajadores</h3>
          <p className="mt-1 text-sm text-gray-500">
            No hay trabajadores que coincidan con los criterios seleccionados.
          </p>
        </div>
      )}

      {/* Modal: Agregar Empleado */}
      <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Trabajador</DialogTitle>
            <DialogDescription>
              Complete los detalles para agregar un nuevo trabajador al sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Rol
              </label>
              <Select 
                value={newEmployee.rol_id.toString()} 
                onValueChange={(val) => setNewEmployee({...newEmployee, rol_id: parseInt(val)})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Nombre
              </label>
              <Input
                value={newEmployee.nombre}
                onChange={(e) => setNewEmployee({...newEmployee, nombre: e.target.value})}
                placeholder="Ej: Juan"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Apellido
              </label>
              <Input
                value={newEmployee.apellido}
                onChange={(e) => setNewEmployee({...newEmployee, apellido: e.target.value})}
                placeholder="Ej: Pérez"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                placeholder="correo@ejemplo.com"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Contraseña
              </label>
              <Input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                placeholder="Mínimo 8 caracteres"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Teléfono
              </label>
              <Input
                value={newEmployee.telefono}
                onChange={(e) => setNewEmployee({...newEmployee, telefono: e.target.value})}
                placeholder="+56 9 1234 5678"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEmployee} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Agregar Trabajador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Empleado */}
      <Dialog open={isEditEmployeeModalOpen} onOpenChange={setIsEditEmployeeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Trabajador</DialogTitle>
            <DialogDescription>
              Actualice los detalles del trabajador.
            </DialogDescription>
          </DialogHeader>

          {currentEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Rol
                </label>
                <Select 
                  value={currentEmployee.rol_id.toString()} 
                  onValueChange={(val) => setCurrentEmployee({...currentEmployee, rol_id: parseInt(val)})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Nombre
                </label>
                <Input
                  value={currentEmployee.nombre}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, nombre: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Apellido
                </label>
                <Input
                  value={currentEmployee.apellido}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, apellido: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  value={currentEmployee.email}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  value={currentEmployee.telefono || ""}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, telefono: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Estado
                </label>
                <Select 
                  value={currentEmployee.estado} 
                  onValueChange={(val: "activo" | "inactivo") => setCurrentEmployee({...currentEmployee, estado: val})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEmployee} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Eliminar Empleado */}
      <Dialog open={isDeleteEmployeeModalOpen} onOpenChange={setIsDeleteEmployeeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Trabajador</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar a {currentEmployee?.nombre} {currentEmployee?.apellido}?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteEmployeeModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Eliminar Trabajador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}