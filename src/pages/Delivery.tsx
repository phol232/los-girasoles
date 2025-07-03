
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Truck,
  Search,
  Filter,
  MapPin,
  User,
  Phone,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  CreditCard,
  ArrowRight,
  LocateFixed,
  UserCircle,
  Bike,
  Timer,
  ChevronRight,
} from "lucide-react";

// Datos de ejemplo para entregas (delivery)
const deliveriesData = [
  {
    id: 1001,
    customer: {
      name: "Juan Pérez",
      phone: "+56 9 8765 4321",
      address: "Av. Principal 123, Santiago",
      location: { lat: -33.456, lng: -70.648 }
    },
    order: {
      id: 2001,
      items: [
        { name: "Pasta Alfredo", quantity: 1, price: 120.00 },
        { name: "Cerveza Artesanal", quantity: 2, price: 60.00 }
      ],
      total: 240.00,
      paymentMethod: "Efectivo",
      notes: "Tocar el timbre 2 veces"
    },
    status: "delivered",
    assignedTo: "Fernando Díaz",
    estimatedDelivery: "30-40 min",
    actualDelivery: "35 min",
    created: "2023-06-15 20:00",
    dispatched: "2023-06-15 20:15",
    delivered: "2023-06-15 20:35"
  },
  {
    id: 1002,
    customer: {
      name: "María González",
      phone: "+56 9 1234 5678",
      address: "Calle Los Pinos 456, Santiago",
      location: { lat: -33.478, lng: -70.625 }
    },
    order: {
      id: 2002,
      items: [
        { name: "Parrillada Mixta", quantity: 2, price: 220.00 },
        { name: "Limonada Natural", quantity: 4, price: 35.00 }
      ],
      total: 580.00,
      paymentMethod: "Tarjeta de Crédito",
      notes: "Dejar en recepción"
    },
    status: "in_transit",
    assignedTo: "Valentina Torres",
    estimatedDelivery: "40-50 min",
    actualDelivery: "",
    created: "2023-06-15 20:30",
    dispatched: "2023-06-15 20:45",
    delivered: ""
  },
  {
    id: 1003,
    customer: {
      name: "Roberto Fernández",
      phone: "+56 9 5555 6666",
      address: "Pasaje Las Flores 789, Santiago",
      location: { lat: -33.442, lng: -70.662 }
    },
    order: {
      id: 2003,
      items: [
        { name: "Pasta Alfredo", quantity: 2, price: 120.00 },
        { name: "Costillas BBQ", quantity: 1, price: 180.00 },
        { name: "Cerveza Artesanal", quantity: 3, price: 60.00 }
      ],
      total: 600.00,
      paymentMethod: "Transferencia Bancaria",
      notes: ""
    },
    status: "pending",
    assignedTo: "",
    estimatedDelivery: "45-55 min",
    actualDelivery: "",
    created: "2023-06-15 19:15",
    dispatched: "",
    delivered: ""
  },
  {
    id: 1004,
    customer: {
      name: "Carolina Silva",
      phone: "+56 9 4321 8765",
      address: "Avenida El Bosque 234, Santiago",
      location: { lat: -33.485, lng: -70.598 }
    },
    order: {
      id: 2004,
      items: [
        { name: "Ensalada César", quantity: 1, price: 95.00 },
        { name: "Parrillada Mixta", quantity: 1, price: 220.00 },
        { name: "Limonada Natural", quantity: 2, price: 35.00 }
      ],
      total: 385.00,
      paymentMethod: "Efectivo",
      notes: "Edificio azul, apto 502"
    },
    status: "preparing",
    assignedTo: "Fernando Díaz",
    estimatedDelivery: "50-60 min",
    actualDelivery: "",
    created: "2023-06-15 21:00",
    dispatched: "",
    delivered: ""
  },
  {
    id: 1005,
    customer: {
      name: "Diego Morales",
      phone: "+56 9 7777 8888",
      address: "Avenida Central 234, Santiago",
      location: { lat: -33.451, lng: -70.631 }
    },
    order: {
      id: 2005,
      items: [
        { name: "Parrillada Mixta", quantity: 1, price: 220.00 },
        { name: "Ensalada César", quantity: 1, price: 95.00 },
        { name: "Tiramisú", quantity: 1, price: 75.00 }
      ],
      total: 390.00,
      paymentMethod: "Tarjeta de Débito",
      notes: ""
    },
    status: "cancelled",
    assignedTo: "María Espinoza",
    estimatedDelivery: "35-45 min",
    actualDelivery: "",
    created: "2023-06-15 20:00",
    dispatched: "2023-06-15 20:10",
    delivered: ""
  },
  {
    id: 1006,
    customer: {
      name: "Ana Martínez",
      phone: "+56 9 9876 5432",
      address: "Calle Las Hortensias 567, Santiago",
      location: { lat: -33.462, lng: -70.612 }
    },
    order: {
      id: 2006,
      items: [
        { name: "Tostadas de Atún", quantity: 2, price: 85.00 },
        { name: "Limonada Natural", quantity: 2, price: 35.00 }
      ],
      total: 240.00,
      paymentMethod: "Efectivo",
      notes: "Llamar al llegar"
    },
    status: "delivered",
    assignedTo: "Valentina Torres",
    estimatedDelivery: "30-40 min",
    actualDelivery: "38 min",
    created: "2023-06-15 18:45",
    dispatched: "2023-06-15 19:00",
    delivered: "2023-06-15 19:38"
  }
];

// Lista de repartidores
const deliveryPersons = [
  "Fernando Díaz",
  "Valentina Torres",
  "María Espinoza",
  "Carlos Ramírez",
  "Julia Soto"
];

export function Delivery() {
  const [deliveries, setDeliveries] = useState(deliveriesData);
  const [isAssignDeliveryOpen, setIsAssignDeliveryOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar entregas según pestaña seleccionada y búsqueda
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Filtrar por pestaña
    const matchesTab =
      activeTab === "all" ||
      activeTab === delivery.status;

    // Filtrar por búsqueda
    const matchesSearch =
      delivery.id.toString().includes(searchTerm) ||
      delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (delivery.assignedTo && delivery.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Función para abrir el modal de asignar repartidor
  const handleAssignDelivery = (delivery: any) => {
    setCurrentDelivery(delivery);
    setIsAssignDeliveryOpen(true);
  };

  // Función para asignar repartidor (simulada)
  const assignDeliveryPerson = (deliveryId: number, person: string) => {
    setDeliveries(deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        return {
          ...delivery,
          assignedTo: person,
          status: delivery.status === "pending" ? "preparing" : delivery.status
        };
      }
      return delivery;
    }));
    setIsAssignDeliveryOpen(false);
  };

  // Función para actualizar el estado de una entrega (simulada)
  const updateDeliveryStatus = (deliveryId: number, newStatus: string) => {
    setDeliveries(deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        const now = new Date();
        const timeStr = now.toISOString().split('T')[0] + ' ' + 
                        now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
        
        let updatedDelivery = { ...delivery, status: newStatus };
        
        if (newStatus === "in_transit") {
          updatedDelivery.dispatched = timeStr;
        } else if (newStatus === "delivered") {
          updatedDelivery.delivered = timeStr;
          // Calculamos tiempo de entrega real
          const dispatchTime = new Date(updatedDelivery.dispatched);
          const deliveredTime = now;
          const diffMinutes = Math.round((deliveredTime.getTime() - dispatchTime.getTime()) / 60000);
          updatedDelivery.actualDelivery = `${diffMinutes} min`;
        }
        
        return updatedDelivery;
      }
      return delivery;
    }));
  };

  // Función para obtener el color de la insignia según el estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" };
      case "preparing":
        return { label: "Preparando", color: "bg-blue-100 text-blue-800" };
      case "in_transit":
        return { label: "En camino", color: "bg-purple-100 text-purple-800" };
      case "delivered":
        return { label: "Entregado", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Función para obtener el siguiente estado posible
  const getNextStatus = (currentStatus: string) => {
    const statusFlow: Record<string, { next: string, label: string }> = {
      "pending": { next: "preparing", label: "Preparar" },
      "preparing": { next: "in_transit", label: "Despachar" },
      "in_transit": { next: "delivered", label: "Entregar" }
    };
    
    return statusFlow[currentStatus] || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery</h1>
          <p className="text-gray-500">
            Gestión de entregas a domicilio
          </p>
        </div>
        <Button className="gap-2">
          <MapPin className="h-4 w-4" />
          Ver Mapa
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por ID, cliente o dirección..."
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
          <TabsTrigger value="preparing">Preparando</TabsTrigger>
          <TabsTrigger value="in_transit">En camino</TabsTrigger>
          <TabsTrigger value="delivered">Entregados</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>Entrega #{delivery.id}</span>
                        <Badge
                          variant="secondary"
                          className={getStatusBadge(delivery.status).color}
                        >
                          {getStatusBadge(delivery.status).label}
                        </Badge>
                      </CardTitle>
                      <div className="mt-1 text-sm text-gray-500">
                        Pedido #{delivery.order.id} • {delivery.created.split(' ')[1]}
                      </div>
                    </div>
                    {delivery.status !== "pending" && delivery.status !== "cancelled" && (
                      <div className="flex items-center gap-1 text-sm">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span>{delivery.estimatedDelivery}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="mt-1 h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{delivery.customer.name}</div>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {delivery.customer.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Dirección de entrega</div>
                        <div className="font-medium">{delivery.customer.address}</div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm text-gray-500">Pedido:</div>
                      <div className="space-y-1">
                        {delivery.order.items.map((item, index) => (
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
                      </div>
                      <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                        <span>Total:</span>
                        <span>${delivery.order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Método de pago</div>
                        <div className="font-medium">{delivery.order.paymentMethod}</div>
                      </div>
                    </div>

                    {delivery.assignedTo && (
                      <div className="flex items-center gap-3">
                        <Bike className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Repartidor</div>
                          <div className="font-medium">{delivery.assignedTo}</div>
                        </div>
                      </div>
                    )}

                    {delivery.order.notes && (
                      <div className="rounded-md bg-yellow-50 p-3 text-sm">
                        <div className="font-medium">Notas:</div>
                        <div className="text-gray-600">{delivery.order.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <div className="flex w-full items-center justify-between">
                    {delivery.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleAssignDelivery(delivery)}
                      >
                        <UserCircle className="h-4 w-4" />
                        Asignar Repartidor
                      </Button>
                    ) : delivery.status === "preparing" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateDeliveryStatus(delivery.id, "in_transit")}
                      >
                        <Truck className="h-4 w-4" />
                        Despachar
                      </Button>
                    ) : delivery.status === "in_transit" ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => updateDeliveryStatus(delivery.id, "delivered")}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirmar Entrega
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        {delivery.status === "delivered" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">
                              Entregado • {delivery.actualDelivery}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Cancelado</span>
                          </>
                        )}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="gap-1">
                      Detalles <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
              <Truck className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">No hay entregas</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron entregas que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para asignar repartidor */}
      <Dialog open={isAssignDeliveryOpen} onOpenChange={setIsAssignDeliveryOpen}>
        {currentDelivery && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Repartidor</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-md border bg-gray-50 p-3">
                <div className="text-sm text-gray-500">Entrega #{currentDelivery.id}</div>
                <div className="font-medium">{currentDelivery.customer.name}</div>
                <div className="text-sm">{currentDelivery.customer.address}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Seleccionar Repartidor:</label>
                <div className="grid gap-2">
                  {deliveryPersons.map((person) => (
                    <Button
                      key={person}
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => assignDeliveryPerson(currentDelivery.id, person)}
                    >
                      <UserCircle className="h-5 w-5" />
                      {person}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDeliveryOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
