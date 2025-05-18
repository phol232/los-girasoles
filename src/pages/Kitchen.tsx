import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  Coffee,
  Timer,
  User,
} from "lucide-react";

// Datos simulados para órdenes pendientes en cocina
const pendingOrders = [
  {
    id: 1,
    table: 4,
    server: "Carlos M.",
    time: "10:32",
    elapsed: "8 min",
    items: [
      { id: 101, name: "Ensalada César", status: "pending", time: "4 min" },
      { id: 102, name: "Filete de res término medio", status: "cooking", time: "12 min" },
      { id: 103, name: "Pasta Alfredo", status: "ready", time: "8 min" },
    ],
    notes: "Servir primero la ensalada, mesa VIP",
    priority: "high",
  },
  {
    id: 2,
    table: 7,
    server: "Ana L.",
    time: "10:40",
    elapsed: "0 min",
    items: [
      { id: 201, name: "Sopa de cebolla", status: "pending", time: "7 min" },
      { id: 202, name: "Langosta al ajillo", status: "pending", time: "18 min" },
    ],
    notes: "",
    priority: "normal",
  },
  {
    id: 3,
    table: 2,
    server: "Miguel S.",
    time: "10:37",
    elapsed: "3 min",
    items: [
      { id: 301, name: "Cocktail de camarones", status: "cooking", time: "5 min" },
      { id: 302, name: "Paella Valenciana (2 personas)", status: "pending", time: "20 min" },
      { id: 303, name: "Tiramisú", status: "pending", time: "3 min" },
    ],
    notes: "El cliente tiene prisa, servir lo más rápido posible",
    priority: "high",
  },
  {
    id: 4,
    table: 8,
    server: "Luis R.",
    time: "10:28",
    elapsed: "12 min",
    items: [
      { id: 401, name: "Nachos con queso y guacamole", status: "ready", time: "8 min" },
      { id: 402, name: "Alitas de pollo (12 piezas)", status: "cooking", time: "10 min" },
      { id: 403, name: "Hamburguesa especial", status: "cooking", time: "12 min" },
      { id: 404, name: "Papas fritas", status: "pending", time: "5 min" },
    ],
    notes: "",
    priority: "normal",
  }
];

type OrderItemStatus = "pending" | "cooking" | "ready";

export function Kitchen() {
  const [orders, setOrders] = useState(pendingOrders);

  // Función para actualizar el estado de un ítem de la orden
  const updateItemStatus = (orderId: number, itemId: number, newStatus: OrderItemStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            return { ...item, status: newStatus };
          }
          return item;
        });
        return { ...order, items: updatedItems };
      }
      return order;
    }));
  };

  // Función para marcar toda la orden como lista
  const markOrderReady = (orderId: number) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => ({
          ...item,
          status: "ready" as OrderItemStatus
        }));
        return { ...order, items: updatedItems };
      }
      return order;
    }));
  };

  // Obtener la siguiente acción para un ítem según su estado actual
  const getNextAction = (status: OrderItemStatus): OrderItemStatus => {
    if (status === "pending") return "cooking";
    if (status === "cooking") return "ready";
    return "ready";
  };

  // Obtener el color de fondo según la prioridad de la orden
  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-50 border-red-200";
    return "bg-white";
  };

  // Obtener el índice para ordenamiento (FIFO y por prioridad)
  const getSortIndex = (order: typeof pendingOrders[0]) => {
    const priorityFactor = order.priority === "high" ? 0 : 1;
    const timeFactor = new Date(`2025-05-18 ${order.time}`).getTime();
    return priorityFactor * 1000000 + timeFactor;
  };

  // Ordenar las órdenes por prioridad y tiempo (FIFO)
  const sortedOrders = [...orders].sort((a, b) => getSortIndex(a) - getSortIndex(b));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Cocina</h1>
          <p className="text-gray-500">
            Órdenes pendientes y gestión de preparación
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Historial
          </Button>
          <Button className="gap-2">
            <Coffee className="h-4 w-4" />
            Nuevo Platillo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedOrders.map((order) => (
          <Card
            key={order.id}
            className={`overflow-hidden ${getPriorityColor(order.priority)}`}
          >
            <CardHeader className="border-b bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Mesa {order.table}</CardTitle>
                  {order.priority === "high" && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" /> Prioridad
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Timer className="h-4 w-4" />
                  <span>{order.elapsed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{order.server}</span>
                </div>
                <span>Orden #{order.id} • {order.time}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full
                        ${item.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                          item.status === 'cooking' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'}`}
                      >
                        {item.status === 'pending' ? (
                          <Clock className="h-5 w-5" />
                        ) : item.status === 'cooking' ? (
                          <Coffee className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Tiempo est.: {item.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={item.status === 'ready' ? "ghost" : "outline"}
                      size="sm"
                      className={item.status === 'ready' ? "text-green-500" : ""}
                      onClick={() => updateItemStatus(order.id, item.id, getNextAction(item.status))}
                    >
                      {item.status === 'pending' ? (
                        <>Iniciar</>
                      ) : item.status === 'cooking' ? (
                        <>Listo</>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <div className="border-t bg-yellow-50 p-3 text-sm">
                  <div className="font-medium">Notas:</div>
                  <div className="text-gray-600">{order.notes}</div>
                </div>
              )}
              <div className="border-t bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {order.items.filter(i => i.status === 'ready').length} de {order.items.length} listos
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => markOrderReady(order.id)}
                    disabled={order.items.every(i => i.status === 'ready')}
                  >
                    Marcar Todo Listo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
