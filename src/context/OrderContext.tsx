import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Tipos para las órdenes
export type OrderStatus = "pending" | "in_progress" | "ready" | "delivered" | "cancelled";
export type OrderItemStatus = "pending" | "cooking" | "ready";

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  status: OrderItemStatus;
  timeEstimated: string; // Tiempo estimado en minutos
}

export interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  serverName: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  notes?: string;
  priority: "normal" | "high";
}

// Interfaz para el contexto
interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "priority">) => void;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  updateItemStatus: (orderId: number, itemId: number, status: OrderItemStatus) => void;
  getOrderById: (orderId: number) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus | OrderStatus[]) => Order[];
  markAllItemsAsReady: (orderId: number) => void;
  cancelOrder: (orderId: number) => void;
}

// Crear el contexto
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Componente proveedor
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Cargar órdenes desde localStorage al inicio
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Error parsing stored orders:", error);
        localStorage.removeItem("orders");
      }
    }
  }, []);

  // Guardar órdenes en localStorage cada vez que cambien
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Crear una nueva orden
  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "status" | "priority">) => {
    const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: "pending",
      priority: "normal",
      items: orderData.items.map(item => ({
        ...item,
        status: "pending"
      }))
    };

    setOrders((prev) => [...prev, newOrder]);
    toast.success(`Orden #${newId} creada exitosamente`);
    return newId;
  };

  // Actualizar estado de una orden
  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast.success(`Orden #${orderId} actualizada a: ${getStatusText(status)}`);
  };

  // Actualizar estado de un item específico
  const updateItemStatus = (orderId: number, itemId: number, status: OrderItemStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item.id === itemId ? { ...item, status } : item
          );

          // Si todos los items están listos, podemos marcar la orden como lista
          const allReady = updatedItems.every((item) => item.status === "ready");
          const newStatus = allReady ? "ready" : order.status === "pending" ? "in_progress" : order.status;

          return {
            ...order,
            items: updatedItems,
            status: newStatus,
          };
        }
        return order;
      })
    );
  };

  // Obtener una orden por ID
  const getOrderById = (orderId: number) => {
    return orders.find((order) => order.id === orderId);
  };

  // Obtener órdenes por estado
  const getOrdersByStatus = (status: OrderStatus | OrderStatus[]) => {
    const statusArray = Array.isArray(status) ? status : [status];
    return orders.filter((order) => statusArray.includes(order.status));
  };

  // Marcar todos los items de una orden como listos
  const markAllItemsAsReady = (orderId: number) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => ({
            ...item,
            status: "ready" as OrderItemStatus,
          }));

          return {
            ...order,
            items: updatedItems,
            status: "ready",
          };
        }
        return order;
      })
    );
    toast.success(`Todos los items de la orden #${orderId} marcados como listos`);
  };

  // Cancelar una orden
  const cancelOrder = (orderId: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
    toast.success(`Orden #${orderId} cancelada`);
  };

  // Función auxiliar para traducir estados
  const getStatusText = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      pending: "Pendiente",
      in_progress: "En preparación",
      ready: "Lista para servir",
      delivered: "Entregada",
      cancelled: "Cancelada",
    };
    return statusMap[status] || status;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        updateItemStatus,
        getOrderById,
        getOrdersByStatus,
        markAllItemsAsReady,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// Hook para usar el contexto
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders debe ser usado dentro de un OrderProvider");
  }
  return context;
}
