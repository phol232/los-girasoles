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
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  PlusCircle,
  ChevronRight,
  Users,
  Trash2,
  UserPlus,
  X,
  Loader2
} from "lucide-react";
import { clientService, type Cliente, type CreateClientRequest, type UpdateClientRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export function Clients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [filteredClients, setFilteredClients] = useState<Cliente[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Estados para el formulario
  const [formData, setFormData] = useState<CreateClientRequest>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, []);

  // Limpiar formulario cuando se abren/cierran los modales
  useEffect(() => {
    if (!isCreateModalOpen && !isEditModalOpen) {
      resetForm();
    }
  }, [isCreateModalOpen, isEditModalOpen]);

  // Filtrar clientes cuando cambie la búsqueda o pestaña
  useEffect(() => {
    let filtered = clients;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((client) =>
        client.cliente_id.toString().includes(searchTerm) ||
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.telefono && client.telefono.includes(searchTerm)) ||
        (client.direccion && client.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Aquí podrías agregar más filtros por pestaña en el futuro
    // Por ahora solo mostramos todos
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, activeTab]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error cargando clientes:', err);
      setError('Error al cargar los clientes');
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para abrir el modal de detalles
  const handleOpenDetails = (client: Cliente) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  // Función para abrir el modal de edición
  const handleOpenEdit = (client: Cliente) => {
    setSelectedClient(client);
    setFormData({
      nombre: client.nombre,
      apellido: client.apellido,
      email: client.email || "",
      telefono: client.telefono || "",
      direccion: client.direccion || "",
    });
    setIsEditModalOpen(true);
  };

  // Función para abrir el modal de crear cliente
  const handleOpenCreate = () => {
    resetForm(); // Limpiar antes de abrir
    setIsCreateModalOpen(true);
  };

  // Función para crear cliente
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido) {
      toast({
        title: "Error",
        description: "Nombre y apellido son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await clientService.create(formData);
      await loadClients();
      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      });
    } catch (err: any) {
      console.error('Error creando cliente:', err);
      toast({
        title: "Error",
        description: err.message || "Error al crear el cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para actualizar cliente
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !formData.nombre || !formData.apellido) {
      toast({
        title: "Error",
        description: "Nombre y apellido son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await clientService.update(selectedClient.cliente_id, formData);
      await loadClients();
      setIsEditModalOpen(false);
      resetForm();
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      });
    } catch (err: any) {
      console.error('Error actualizando cliente:', err);
      toast({
        title: "Error",
        description: err.message || "Error al actualizar el cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para eliminar cliente
  const handleDeleteClient = async (client: Cliente) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al cliente ${client.nombre} ${client.apellido}?`)) {
      return;
    }

    try {
      await clientService.delete(client.cliente_id);
      await loadClients();
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      });
    } catch (err: any) {
      console.error('Error eliminando cliente:', err);
      toast({
        title: "Error",
        description: err.message || "Error al eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
    });
    setSelectedClient(null);
  };

  const handleInputChange = (field: keyof CreateClientRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Cargando clientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <X className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={loadClients} className="bg-orange-600 hover:bg-orange-700">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clientes</h1>
          <p className="text-gray-500">
            Gestión y seguimiento de clientes ({clients.length} clientes)
          </p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por nombre, email, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredClients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.cliente_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900">
                      {client.nombre} {client.apellido}
                    </CardTitle>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                      ID: {client.cliente_id}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Cliente desde {formatDate(client.created_at)}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {client.telefono && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-orange-600" />
                        <div className="font-medium text-gray-700">{client.telefono}</div>
                      </div>
                    )}

                    {client.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-orange-600" />
                        <div className="font-medium text-gray-700 truncate">{client.email}</div>
                      </div>
                    )}

                    {client.direccion && (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 text-orange-600" />
                        <div className="font-medium text-gray-700 text-sm leading-relaxed">
                          {client.direccion}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Última actualización</div>
                        <div className="font-medium text-gray-700">{formatDate(client.updated_at)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 p-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 flex-1"
                    onClick={() => handleOpenEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClient(client)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleOpenDetails(client)}
                  >
                    Detalles <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">
              <Users className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No hay clientes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 
                  "No se encontraron clientes que coincidan con la búsqueda." :
                  "Aún no has agregado ningún cliente."
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={handleOpenCreate}
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar primer cliente
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para crear cliente */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Agrega la información del nuevo cliente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Apellido *</label>
                <Input
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  placeholder="Apellido"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Cliente'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar cliente */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Apellido *</label>
                <Input
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  placeholder="Apellido"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Cliente'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para ver detalles del cliente */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        {selectedClient && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedClient.nombre} {selectedClient.apellido}</DialogTitle>
              <DialogDescription>
                Cliente ID: {selectedClient.cliente_id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3">
                {selectedClient.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <div className="font-medium">{selectedClient.telefono}</div>
                  </div>
                )}

                {selectedClient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-600" />
                    <div className="font-medium">{selectedClient.email}</div>
                  </div>
                )}

                {selectedClient.direccion && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-orange-600" />
                    <div className="font-medium">{selectedClient.direccion}</div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
                <div className="mb-2 font-medium text-gray-900">Información del registro</div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Creado:</span>
                    <span className="font-medium">{formatDate(selectedClient.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Actualizado:</span>
                    <span className="font-medium">{formatDate(selectedClient.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEdit(selectedClient);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleDeleteClient(selectedClient);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
