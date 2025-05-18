import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  CreditCard,
  MinusCircle,
  Plus,
  PlusCircle,
  Printer,
  QrCode,
  Trash2,
  UserCircle,
  Utensils,
  X,
} from "lucide-react";

// Datos de ejemplo para productos
const productsData = [
  {
    id: 1,
    name: "Parrillada Mixta",
    image: "/meat-grill.jpg",
    price: 220.00,
    category: "Platos Fuertes",
  },
  {
    id: 2,
    name: "Ensalada César",
    image: "/caesar-salad.jpg",
    price: 95.00,
    category: "Entradas",
  },
  {
    id: 3,
    name: "Pasta Alfredo",
    image: "/pasta.jpg",
    price: 120.00,
    category: "Platos Fuertes",
  },
  {
    id: 4,
    name: "Tostadas de Atún",
    image: "/tuna-toast.jpg",
    price: 85.00,
    category: "Entradas",
  },
  {
    id: 5,
    name: "Costillas BBQ",
    image: "/ribs.jpg",
    price: 180.00,
    category: "Platos Fuertes",
  },
  {
    id: 6,
    name: "Limonada Natural",
    image: "/lemonade.jpg",
    price: 35.00,
    category: "Bebidas",
  },
  {
    id: 7,
    name: "Cerveza Artesanal",
    image: "/beer.jpg",
    price: 60.00,
    category: "Bebidas Alcohólicas",
  },
  {
    id: 8,
    name: "Tiramisú",
    image: "/tiramisu.jpg",
    price: 75.00,
    category: "Postres",
  },
];

// Datos de ejemplo para mesas
const tablesData = [
  { id: 1, number: 1, status: "free", capacity: 4, section: "Interior" },
  { id: 2, number: 2, status: "occupied", capacity: 2, section: "Interior" },
  { id: 3, number: 3, status: "free", capacity: 6, section: "Interior" },
  { id: 4, number: 4, status: "occupied", capacity: 4, section: "Terraza" },
  { id: 5, number: 5, status: "reserved", capacity: 8, section: "VIP" },
  { id: 6, number: 6, status: "free", capacity: 4, section: "Terraza" },
  { id: 7, number: 7, status: "free", capacity: 2, section: "Barra" },
  { id: 8, number: 8, status: "occupied", capacity: 4, section: "Interior" },
];

// Categorías de productos
const categories = [
  "Todos",
  "Entradas",
  "Platos Fuertes",
  "Bebidas",
  "Bebidas Alcohólicas",
  "Postres",
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

export function POS() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [paymentModal, setPaymentModal] = useState(false);
  const [productNoteModal, setProductNoteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productNote, setProductNote] = useState("");

  // Filtro de productos por categoría y término de búsqueda
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Añadir producto al carrito
  const addToCart = (product: typeof productsData[0]) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar cantidad
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      // Si es un producto nuevo, añadirlo al carrito
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          notes: "",
        },
      ]);
    }
  };

  // Función para eliminar producto del carrito
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Función para modificar la cantidad de un producto
  const updateQuantity = (id: number, change: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
  };

  // Función para abrir modal de notas para un producto
  const openNoteModal = (id: number) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      setProductNote(item.notes);
      setCurrentProduct(id);
      setProductNoteModal(true);
    }
  };

  // Función para guardar la nota de un producto
  const saveProductNote = () => {
    if (currentProduct) {
      const newCart = cart.map((item) => {
        if (item.id === currentProduct) {
          return { ...item, notes: productNote };
        }
        return item;
      });
      setCart(newCart);
      setProductNoteModal(false);
      setCurrentProduct(null);
      setProductNote("");
    }
  };

  // Calcular subtotal, impuestos y total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16; // 16% de impuesto
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Punto de Venta</h1>
          <p className="text-gray-500">Toma de órdenes y cobro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Últimos Tickets
          </Button>
          <Button className="gap-2">
            <UserCircle className="h-4 w-4" />
            Cliente
          </Button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-3">
        {/* Panel izquierdo: Selección de mesa y carrito */}
        <div className="flex flex-col overflow-hidden">
          <Tabs defaultValue="cart" className="flex h-full flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="cart" className="flex-1">
                Pedido
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex-1">
                Mesas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tables" className="flex-1 overflow-auto p-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3">
                {tablesData.map((table) => (
                  <Card
                    key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    className={`cursor-pointer ${
                      selectedTable === table.id
                        ? "border-2 border-orange-500"
                        : ""
                    } ${
                      table.status === "occupied"
                        ? "bg-orange-50"
                        : table.status === "reserved"
                        ? "bg-blue-50"
                        : "bg-green-50"
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-2 text-3xl font-bold">{table.number}</div>
                      <div className="text-sm">{table.section}</div>
                      <div className="mt-1 text-xs">{table.capacity} personas</div>
                      <Badge
                        className={`mt-2 ${
                          table.status === "occupied"
                            ? "bg-orange-500"
                            : table.status === "reserved"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {table.status === "occupied"
                          ? "Ocupada"
                          : table.status === "reserved"
                          ? "Reservada"
                          : "Libre"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cart" className="flex flex-1 flex-col overflow-hidden">
              {selectedTable === null ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                  <Utensils className="mb-2 h-10 w-10 text-gray-400" />
                  <h3 className="text-lg font-medium">Sin mesa seleccionada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Seleccione una mesa para tomar la orden
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Mesa #{selectedTable}</h3>
                      <p className="text-sm text-gray-500">
                        {tablesData.find((t) => t.id === selectedTable)?.section} - {" "}
                        {tablesData.find((t) => t.id === selectedTable)?.capacity} personas
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedTable(null)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-auto">
                    {cart.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                        <Utensils className="mb-2 h-10 w-10 text-gray-400" />
                        <h3 className="text-lg font-medium">Carrito vacío</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Añada productos al pedido
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cart.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="flex">
                              <CardContent className="flex flex-1 p-3">
                                <div className="flex flex-1 flex-col">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    ${item.price.toFixed(2)}
                                  </div>
                                  {item.notes && (
                                    <div className="mt-1 text-xs text-gray-400">
                                      Notas: {item.notes}
                                    </div>
                                  )}
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => updateQuantity(item.id, -1)}
                                      >
                                        <MinusCircle className="h-3 w-3" />
                                      </Button>
                                      <span>{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => updateQuantity(item.id, 1)}
                                      >
                                        <PlusCircle className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openNoteModal(item.id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="h-4 w-4 text-gray-500"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                      </Button>
                                      <div className="font-medium">
                                        $
                                        {(item.price * item.quantity).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Impuestos (16%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 bg-gray-50 p-4">
                      <Button
                        className="flex-1"
                        disabled={cart.length === 0}
                        onClick={() => setPaymentModal(true)}
                      >
                        Procesar Pago
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Guardar Pedido
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel central y derecho: Categorías y productos */}
        <div className="col-span-2 flex flex-col overflow-hidden">
          <div className="mb-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer overflow-hidden hover:shadow-md"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-square w-full bg-gray-200">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://placehold.co/600x400/orange/white?text=${encodeURIComponent(product.name)}')`
                      }}
                    />
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="truncate text-sm">{product.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="flex justify-between p-3 pt-0">
                    <span className="font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para notas de producto */}
      <Dialog open={productNoteModal} onOpenChange={setProductNoteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notas especiales</DialogTitle>
            <DialogDescription>
              Añade instrucciones o peticiones especiales para este platillo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              value={productNote}
              onChange={(e) => setProductNote(e.target.value)}
              className="h-24 w-full rounded-md border p-2"
              placeholder="Ej: Sin cebolla, término medio, salsa aparte..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductNoteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProductNote}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de pago */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Procesar Pago</DialogTitle>
            <DialogDescription>
              Seleccione el método de pago para completar la transacción.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:border-orange-500">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <CreditCard className="mb-2 h-8 w-8 text-orange-600" />
                  <span className="text-sm font-medium">Tarjeta</span>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-orange-500">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <svg
                    className="mb-2 h-8 w-8 text-orange-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span className="text-sm font-medium">Efectivo</span>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-orange-500">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <QrCode className="mb-2 h-8 w-8 text-orange-600" />
                  <span className="text-sm font-medium">QR / App</span>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium">Resumen de pago</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Impuestos (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Propina sugerida (10%)</span>
                  <span>${(subtotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-medium">
                  <span>Total</span>
                  <span>${(total + subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setPaymentModal(false)} className="gap-2">
              <Check className="h-4 w-4" />
              Completar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
