
import { useState } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Search,
  Filter,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Settings2
} from "lucide-react";

// Datos de ejemplo para órdenes
const ordersData = [
  {
    id: 1001,
    customer: "Juan Pérez",
    phone: "+56 9 8765 4321",
    table: "Mesa 4",
    address: null,
    items: [
      { name: "Pasta Alfredo", quantity: 1, price: 120.00 },
      { name: "Cerveza Artesanal", quantity: 2, price: 60.00 }
    ],
    total: 240.00,
    status: "completed",
    paymentMethod: "Efectivo",
    notes: "Sin cebolla",
    date: "2023-06-15",
    time: "20:15",
    type: "dine_in"
  },
  {
    id: 1002,
    customer: "María González",
    phone: "+56 9 1234 5678",
    table: null,
    address: "Calle Los Pinos 456, Santiago",
    items: [
      { name: "Hamburguesa Completa", quantity: 2, price: 95.00 },
      { name: "Papas Fritas Grande", quantity: 1, price: 45.00 },
      { name: "Bebida Cola", quantity: 2, price: 30.00 }
    ],
    total: 295.00,
    status: "in_process",
    paymentMethod: "Tarjeta de Crédito",
    notes: "Llamar al llegar a la puerta",
    date: "2023-06-15",
    time: "20:30",
    type: "delivery"
  },
  {
    id: 1003,
    customer: "Roberto Fernández",
    phone: "+56 9 5555 6666",
    table: "Mesa 7",
    address: null,
    items: [
      { name: "Pizza Familiar", quantity: 1, price: 150.00 },
      { name: "Ensalada César", quantity: 1, price: 80.00 },
      { name: "Agua Mineral", quantity: 3, price: 25.00 }
    ],
    total: 305.00,
    status: "pending",
    paymentMethod: "Transferencia Bancaria",
    notes: "",
    date: "2023-06-15",
    time: "19:45",
    type: "dine_in"
  },
  {
    id: 1004,
    customer: "Carolina Silva",
    phone: "+56 9 4321 8765",
    table: null,
    address: "Avenida El Bosque 234, Santiago",
    items: [
      { name: "Costillas BBQ", quantity: 1, price: 180.00 },
      { name: "Papas Fritas Grande", quantity: 1, price: 45.00 },
      { name: "Bebida Naranja", quantity: 1, price: 30.00 }
    ],
    total: 255.00,
    status: "cancelled",
    paymentMethod: "Efectivo",
    notes: "Cliente canceló por demora",
    date: "2023-06-15",
    time: "21:00",
    type: "delivery"
  },
  {
    id: 1005,
    customer: "Diego Morales",
    phone: "+56 9 7777 8888",
    table: "Mesa 2",
    address: null,
    items: [
      { name: "Parrillada Mixta", quantity: 1, price: 220.00 },
      { name: "Ensalada César", quantity: 1, price: 80.00 },
      { name: "Vino Tinto Copa", quantity: 2, price: 45.00 }
    ],
    total: 390.00,
    status: "in_process",
    paymentMethod: "Tarjeta de Débito",
    notes: "",
    date: "2023-06-15",
    time: "20:00",
    type: "dine_in"
  },
  {
    id: 1006,
    customer: "Ana Martínez",
    phone: "+56 9 9876 5432",
    table: null,
    address: "Calle Las Hortensias 567, Santiago",
    items: [
      { name: "Sushi Mixto 24 piezas", quantity: 1, price: 180.00 },
      { name: "Gyozas", quantity: 1, price: 60.00 }
    ],
    total: 240.00,
    status: "completed",
    paymentMethod: "Efectivo",
    notes: "Sin wasabi",
    date: "2023-06-15",
    time: "18:30",
    type: "delivery"
  }
];

export function Orders() {
  const [orders, setOrders] = useState(ordersData);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filtrar órdenes según pestaña seleccionada y búsqueda
  const filteredOrders = orders.filter((order) => {
    // Filtrar por pestaña
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "dine_in" && order.type === "dine_in") ||
      (activeTab === "delivery" && order.type === "delivery") ||
      activeTab === order.status;

    // Filtrar por búsqueda
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.table && order.table.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Función para abrir el modal de detalles de pedido
  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Función para actualizar el estado de una orden (simulada)
  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // Función para obtener el color de la insignia según el estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" };
      case "in_process":
        return { label: "En proceso", color: "bg-blue-100 text-blue-800" };
      case "completed":
        return { label: "Completado", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-gray-500">
            Gestión de pedidos y comandas
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Orden
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Configuración
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por ID, cliente o mesa..."
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
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="in_process">En Proceso</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          <TabsTrigger value="dine_in">En Local</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>Orden #{order.id}</span>
                        <Badge
                          variant="secondary"
                          className={getStatusBadge(order.status).color}
                        >
                          {getStatusBadge(order.status).label}
                        </Badge>
                      </CardTitle>
                      <div className="mt-1 text-sm text-gray-500">
                        {order.date} • {order.time}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {order.type === "dine_in" ? "En Local" : "Delivery"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="mt-1 h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {order.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.table ? (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div className="font-medium">{order.table}</div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Dirección</div>
                          <div className="font-medium">{order.address}</div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="mb-2 text-sm text-gray-500">Pedido:</div>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm italic text-gray-500">
                            Y {order.items.length - 2} ítem(s) más...
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div className="font-medium">{order.paymentMethod}</div>
                    </div>

                    {order.notes && (
                      <div className="rounded-md bg-yellow-50 p-3 text-sm">
                        <div className="font-medium">Notas:</div>
                        <div className="text-gray-600">{order.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <div className="flex w-full items-center justify-between">
                    {order.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateOrderStatus(order.id, "in_process")}
                      >
                        <Clock className="h-4 w-4" />
                        Procesar
                      </Button>
                    ) : order.status === "in_process" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateOrderStatus(order.id, "completed")}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Completar
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        {order.status === "completed" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Completado</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Cancelado</span>
                          </>
                        )}
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleOpenDetails(order)}
                    >
                      Detalles <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
              <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">No hay órdenes</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron órdenes que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para ver detalles de pedido */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        {selectedOrder && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Orden #{selectedOrder.id}
                <Badge
                  variant="secondary"
                  className={getStatusBadge(selectedOrder.status).color}
                >
                  {getStatusBadge(selectedOrder.status).label}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedOrder.date} • {selectedOrder.time} • 
                {selectedOrder.type === "dine_in" ? " En Local" : " Delivery"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">{selectedOrder.customer}</div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedOrder.phone}
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.table ? (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div className="font-medium">{selectedOrder.table}</div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Dirección</div>
                    <div className="font-medium">{selectedOrder.address}</div>
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 text-sm font-medium">Pedido:</div>
                <div className="space-y-2 rounded-md border p-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div className="font-medium">{selectedOrder.paymentMethod}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div className="font-medium">{selectedOrder.date}</div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="rounded-md bg-yellow-50 p-3 text-sm">
                  <div className="font-medium">Notas:</div>
                  <div className="text-gray-600">{selectedOrder.notes}</div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
              {selectedOrder.status === "pending" ? (
                <div className="flex w-full space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "in_process");
                    }}
                  >
                    Procesar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "cancelled");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : selectedOrder.status === "in_process" ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, "completed");
                  }}
                >
                  Completar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Cerrar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
