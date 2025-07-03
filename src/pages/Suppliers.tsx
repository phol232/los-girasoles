
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supplierService, type Proveedor } from "@/services/api";

// Datos simulados para pedidos a proveedores (mientras no tengas el backend)
const pedidosProveedores = [
  {
    id: 1,
    proveedor_id: 1,
    numero_pedido: "PED-001",
    fecha_pedido: "2024-01-15",
    estado: "pendiente",
    total: 1250.00,
    items: [
      { ingrediente: "Tomate", cantidad: 50, unidad: "kg", precio_unitario: 15.00 },
      { ingrediente: "Cebolla", cantidad: 30, unidad: "kg", precio_unitario: 12.50 }
    ]
  },
  {
    id: 2,
    proveedor_id: 2,
    numero_pedido: "PED-002", 
    fecha_pedido: "2024-01-14",
    estado: "recibido",
    total: 800.00,
    items: [
      { ingrediente: "Pollo", cantidad: 20, unidad: "kg", precio_unitario: 40.00 }
    ]
  }
];

export function Suppliers() {
  const { toast } = useToast();

  // Estados para datos
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados para modales
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isViewSupplierOpen, setIsViewSupplierOpen] = useState(false);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Estados para formularios
  const [supplierForm, setSupplierForm] = useState({
    prove_ruc: '',
    prove_nombre: '',
    prove_email: '',
    prove_telefono: '',
    prove_direccion: ''
  });

  // Estados para edición y visualización
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Proveedor | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const proveedoresData = await supplierService.getAll();
      setProveedores(proveedoresData);
    } catch (error: any) {
      toast({
        title: "❌ Error al cargar proveedores",
        description: error.message || "Error al conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      prove_ruc: '',
      prove_nombre: '',
      prove_email: '',
      prove_telefono: '',
      prove_direccion: ''
    });
  };

  const handleCreateSupplier = async () => {
    try {
      setSubmitting(true);
      const newSupplier = await supplierService.create(supplierForm);
      setProveedores([newSupplier, ...proveedores]);
      resetSupplierForm();
      setIsAddSupplierOpen(false);

      toast({
        title: "✅ Proveedor agregado",
        description: "El proveedor se ha creado exitosamente.",
        variant: "default",
      });
    } catch (error: any) {
      let errorMessage = "Error al crear el proveedor";
      
      if (error.message) {
        if (error.message.includes('prove_ruc') || error.message.includes('RUC')) {
          errorMessage = "El RUC ya existe en el sistema";
        } else if (error.message.includes('prove_email') || error.message.includes('email')) {
          errorMessage = "El email ya existe en el sistema";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "❌ Error al crear proveedor",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditSupplier = (proveedor: Proveedor) => {
    setEditingSupplier(proveedor);
    setSupplierForm({
      prove_ruc: proveedor.prove_ruc,
      prove_nombre: proveedor.prove_nombre,
      prove_email: proveedor.prove_email,
      prove_telefono: proveedor.prove_telefono || '',
      prove_direccion: proveedor.prove_direccion || ''
    });
    setIsEditSupplierOpen(true);
  };

  const handleUpdateSupplier = async () => {
    if (!editingSupplier) return;

    try {
      setSubmitting(true);
      console.log('Datos a enviar:', supplierForm);
      console.log('ID del proveedor a actualizar:', editingSupplier.prove_id);
      const updatedSupplier = await supplierService.update(editingSupplier.prove_id, supplierForm);
      
      setProveedores(proveedores.map(prov => 
        prov.prove_id === editingSupplier.prove_id ? updatedSupplier : prov
      ));
      
      resetSupplierForm();
      setEditingSupplier(null);
      setIsEditSupplierOpen(false);

      toast({
        title: "✅ Proveedor actualizado",
        description: "El proveedor se ha actualizado exitosamente.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error al actualizar proveedor:', error);
      let errorMessage = "Error al actualizar el proveedor";
      
      if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Error al actualizar proveedor",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return;

    try {
      await supplierService.delete(supplierId);
      setProveedores(proveedores.filter(prov => prov.prove_id !== supplierId));

      toast({
        title: "✅ Proveedor eliminado",
        description: "El proveedor se ha eliminado exitosamente.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "❌ Error al eliminar proveedor",
        description: error.message || "Error al eliminar el proveedor",
        variant: "destructive",
      });
    }
  };

  const openViewSupplier = (proveedor: Proveedor) => {
    setSelectedSupplier(proveedor);
    setIsViewSupplierOpen(true);
  };

  const openViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewOrderOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' };
      case 'recibido':
        return { label: 'Recibido', color: 'bg-green-100 text-green-800' };
      case 'cancelado':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getProveedorNombre = (proveedorId: number) => {
    const proveedor = proveedores.find(p => p.prove_id === proveedorId);
    return proveedor ? proveedor.prove_nombre : 'Proveedor no encontrado';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando proveedores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-gray-500">
            Gestión de proveedores y pedidos a proveedores
          </p>
        </div>
      </div>

      <Tabs defaultValue="proveedores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos a Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="proveedores" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Lista de Proveedores</h3>
            <Button onClick={() => setIsAddSupplierOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proveedores.map((proveedor) => (
              <Card key={proveedor.prove_id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{proveedor.prove_nombre}</CardTitle>
                    <Badge variant="outline">
                      {proveedor.prove_ruc}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{proveedor.prove_email}</span>
                  </div>
                  {proveedor.prove_telefono && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{proveedor.prove_telefono}</span>
                    </div>
                  )}
                  {proveedor.prove_direccion && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-2">{proveedor.prove_direccion}</span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => openViewSupplier(proveedor)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditSupplier(proveedor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSupplier(proveedor.prove_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pedidos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Pedidos a Proveedores</h3>
            <Button onClick={() => setIsAddOrderOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Pedido
            </Button>
          </div>

          <div className="space-y-4">
            {pedidosProveedores.map((pedido) => (
              <Card key={pedido.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{pedido.numero_pedido}</span>
                        <Badge 
                          variant="secondary"
                          className={getEstadoBadge(pedido.estado).color}
                        >
                          {getEstadoBadge(pedido.estado).label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Proveedor: {getProveedorNombre(pedido.proveedor_id)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium">
                        Total: S/ {pedido.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pedido.items.length} item(s)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openViewOrder(pedido)}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para agregar proveedor */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Proveedor</DialogTitle>
            <DialogDescription>
              Agregue un nuevo proveedor al sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">RUC *</label>
                <Input 
                  placeholder="20123456789" 
                  value={supplierForm.prove_ruc}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_ruc: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Empresa *</label>
                <Input 
                  placeholder="Nombre del proveedor" 
                  value={supplierForm.prove_nombre}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_nombre: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input 
                  type="email"
                  placeholder="contacto@proveedor.com" 
                  value={supplierForm.prove_email}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input 
                  placeholder="+51 987 654 321" 
                  value={supplierForm.prove_telefono}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_telefono: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input 
                placeholder="Dirección completa del proveedor" 
                value={supplierForm.prove_direccion}
                onChange={(e) => setSupplierForm({...supplierForm, prove_direccion: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSupplier} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Proveedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar proveedor */}
      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Modifique los datos del proveedor
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">RUC *</label>
                <Input 
                  placeholder="20123456789" 
                  value={supplierForm.prove_ruc}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_ruc: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Empresa *</label>
                <Input 
                  placeholder="Nombre del proveedor" 
                  value={supplierForm.prove_nombre}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_nombre: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input 
                  type="email"
                  placeholder="contacto@proveedor.com" 
                  value={supplierForm.prove_email}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input 
                  placeholder="+51 987 654 321" 
                  value={supplierForm.prove_telefono}
                  onChange={(e) => setSupplierForm({...supplierForm, prove_telefono: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input 
                placeholder="Dirección completa del proveedor" 
                value={supplierForm.prove_direccion}
                onChange={(e) => setSupplierForm({...supplierForm, prove_direccion: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSupplier} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Proveedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para ver detalles del proveedor */}
      <Dialog open={isViewSupplierOpen} onOpenChange={setIsViewSupplierOpen}>
        {selectedSupplier && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Proveedor</DialogTitle>
              <DialogDescription>
                Información completa del proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">RUC</label>
                  <p className="font-medium">{selectedSupplier.prove_ruc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="font-medium">{selectedSupplier.prove_nombre}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium">{selectedSupplier.prove_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="font-medium">{selectedSupplier.prove_telefono || 'No especificado'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Dirección</label>
                <p className="font-medium">{selectedSupplier.prove_direccion || 'No especificada'}</p>
              </div>
              {selectedSupplier.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de registro</label>
                  <p className="font-medium">{new Date(selectedSupplier.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewSupplierOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal para ver detalles del pedido */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        {selectedOrder && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido {selectedOrder.numero_pedido}</DialogTitle>
              <DialogDescription>
                Información completa del pedido a proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Pedido</label>
                  <p className="font-medium">{selectedOrder.numero_pedido}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <Badge className={getEstadoBadge(selectedOrder.estado).color}>
                    {getEstadoBadge(selectedOrder.estado).label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Proveedor</label>
                  <p className="font-medium">{getProveedorNombre(selectedOrder.proveedor_id)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha</label>
                  <p className="font-medium">{new Date(selectedOrder.fecha_pedido).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Items del Pedido</label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <span className="font-medium">{item.ingrediente}</span>
                        <p className="text-sm text-gray-500">{item.cantidad} {item.unidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">S/ {item.precio_unitario.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          Total: S/ {(item.cantidad * item.precio_unitario).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total del Pedido:</span>
                  <span className="text-lg font-bold">S/ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOrderOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal para agregar nuevo pedido */}
      <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Pedido a Proveedor</DialogTitle>
            <DialogDescription>
              Crear un nuevo pedido a proveedor
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-500">
              Funcionalidad en desarrollo...
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOrderOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
