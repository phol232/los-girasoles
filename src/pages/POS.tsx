import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  tableService, 
  employeeService, 
  productService, 
  formDataService,
  clientService,
  type Table, 
  type Employee, 
  type Platillo,
  type CategoriaPlatillo,
  type Cliente
} from "@/services/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronLeft,
  CreditCard,
  MinusCircle,
  Plus,
  PlusCircle,
  Printer,
  QrCode,
  Search,
  ShoppingCart,
  Trash2,
  UserCircle,
  Utensils,
  X,
} from "lucide-react";

// Estas categorías se cargarán desde el backend

// Datos que se cargarán desde el backend

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

export function POS() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderModal, setOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productNote, setProductNote] = useState("");
  const [currentProduct, setCurrentProduct] = useState<number | null>(null);
  const [noteModal, setNoteModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedServer, setSelectedServer] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("menu");
  
  // Estados para datos del backend
  const [tables, setTables] = useState<Table[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Platillo[]>([]);
  const [categories, setCategories] = useState<CategoriaPlatillo[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tablesData, employeesData, productsData, formData] = await Promise.all([
          tableService.getAll(),
          employeeService.getAll(),
          productService.getAll(),
          formDataService.getFormData()
        ]);
        setTables(tablesData);
        setEmployees(employeesData);
        setProducts(productsData);
        setCategories(formData.categorias);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Crear categorías dinámicas basadas en los datos
  const dynamicCategories = [
    { id: "all", name: "Menú Completo", count: products.length },
    ...categories.map(cat => ({
      id: cat.categoria_id.toString(),
      name: cat.nombre,
      count: products.filter(p => p.categoria_platillo === cat.nombre).length
    }))
  ];

  // Filtro de productos por categoría y término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || 
      (categories.find(c => c.categoria_id.toString() === activeCategory)?.nombre === product.categoria_platillo);
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtro de productos para el modal de búsqueda
  const modalFilteredProducts = products.filter((product) => {
    return product.nombre.toLowerCase().includes(modalSearchTerm.toLowerCase());
  });

  // Función para convertir precio a número de forma segura
  const safePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Añadir producto al carrito
  const addToCart = (product: Platillo) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.platillo_id);
    const safeProductPrice = safePrice(product.precio_venta);

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
          id: product.platillo_id,
          name: product.nombre,
          price: safeProductPrice,
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
      setNoteModal(true);
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
      setNoteModal(false);
      setCurrentProduct(null);
      setProductNote("");
    }
  };

  // Add effect to load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customersData = await clientService.getAll();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    loadCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    `${customer.nombre} ${customer.apellido}`.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.telefono?.includes(customerSearchTerm)
  );

  // Handle customer selection
  const selectCustomer = (customer: Cliente) => {
    setSelectedCustomer(customer);
    setCustomerName(`${customer.nombre} ${customer.apellido}`);
    setCustomerSearchTerm(`${customer.nombre} ${customer.apellido}`);
    setShowCustomerDropdown(false);
  };

  // Handle customer search input
  const handleCustomerSearch = (value: string) => {
    setCustomerSearchTerm(value);
    setCustomerName(value);
    setShowCustomerDropdown(value.length > 0);
    if (value.length === 0) {
      setSelectedCustomer(null);
    }
  };

  // Procesar pedido
  const processOrder = () => {
    // Aquí se procesaría el envío del pedido al sistema
    console.log({
      table: selectedTable,
      customer: selectedCustomer || { nombre: customerName, apellido: "" },
      server: selectedServer,
      items: cart,
      total: subtotal + tax,
    });

    // Resetear el carrito y cerrar modal
    setCart([]);
    setOrderModal(false);
    setCustomerName("");
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
    setSelectedServer("");
    setShowCustomerDropdown(false);
  };

  // Función para manejar errores de imagen
  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  // Calcular subtotal, impuestos y total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% de impuesto
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full bg-[#f8f5e6]">
      {/* Contenedor principal con sidebar derecho fijo */}
      <div className="flex flex-1 overflow-hidden">
        {/* Productos (sección central) */}
        <div className="flex-1 flex flex-col p-3 overflow-auto md:pr-[280px]">
          {/* Categorías siempre en modo horizontal */}
          <div className="overflow-x-auto mb-3 flex-shrink-0">
            <div className="flex space-x-2 pb-2">
              {dynamicCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all text-sm ${
                    activeCategory === category.id
                      ? "bg-amber-100 font-medium"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {category.name} ({category.count})
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3 flex justify-between items-center flex-shrink-0">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar un platillo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 bg-white rounded-full h-8 text-sm"
              />
            </div>
          </div>

          {/* Grid de productos - 4 por fila en PC, 1 por fila en móvil con ancho completo */}
          <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-16 md:pb-0 ${activeTab === 'pedido' ? 'hidden md:grid' : 'grid'}`}>
            {loadingData ? (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500">Cargando productos...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500">No hay productos disponibles</div>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.platillo_id}
                  className="w-full rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <div className="relative h-[120px] md:h-[100px] overflow-hidden">
                    {product.plat_imagen_url && !imageErrors.has(product.platillo_id) ? (
                      <img
                        src={product.plat_imagen_url}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(product.platillo_id)}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white">
                        <div className="text-white text-sm font-bold text-center px-3 line-clamp-2">
                          {product.nombre}
                        </div>
                      </div>
                    )}
                    {product.categoria_platillo && (
                      <div className="absolute left-2 top-2 bg-blue-600 text-white text-[10px] py-0.5 px-1.5 rounded-md">
                        {product.categoria_platillo}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm mb-1 line-clamp-1">{product.nombre}</div>
                    <div className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">
                      {product.descripcion || "Sin descripción"}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">S/ {safePrice(product.precio_venta).toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                          onClick={() => {
                            const item = cart.find(item => item.id === product.platillo_id);
                            if (item && item.quantity > 1) {
                              updateQuantity(product.platillo_id, -1);
                            } else if (item) {
                              removeFromCart(product.platillo_id);
                            }
                          }}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>

                        <div className="inline-flex h-8 items-center justify-center text-sm w-4">
                          {cart.find(item => item.id === product.platillo_id)?.quantity || 0}
                        </div>

                        <button
                          className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
                          onClick={() => addToCart(product)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de pedido (derecho) - Fijo en PC */}
        <div className="hidden md:block fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-md overflow-auto p-4">
          <div className="mb-3">
            <div className="font-semibold">{customerName || "Cliente"}</div>
            <div className="text-xs text-gray-500">Orden #925 • Comer Aquí</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Mié, Julio 12, 2023 • 06:12 PM</div>
          </div>

          <h2 className="font-semibold text-sm mb-3">Detalle de Orden</h2>

          {/* Lista de productos en el pedido */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 text-xs my-8">
                No hay artículos añadidos a la orden
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="border-b pb-2.5">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 text-xs">x{item.quantity}</span>
                      </div>
                      {item.notes && (
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          Extra: {item.notes}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-1.5">
                        <button
                          className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full"
                          onClick={() => openNoteModal(item.id)}
                        >
                          Notas
                        </button>
                        <button
                          className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-2 w-2" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-xs">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Artículos ({cart.length})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t mt-1.5 pt-1.5">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botón de procesar pedido */}
          <Button
            className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-black h-8 text-xs"
            onClick={() => setOrderModal(true)}
            disabled={cart.length === 0}
          >
            Procesar Pedido
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Button>
        </div>
      </div>

      {/* Tabs para navegación móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-20">
        <div className="flex justify-around p-2">
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'menu' ? 'text-amber-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils className="h-5 w-5 mb-1" />
            <span className="text-xs">Menú</span>
          </button>
          <button 
            className={`flex flex-col items-center p-2 ${activeTab === 'pedido' ? 'text-amber-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pedido')}
          >
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">Pedido ({cart.length})</span>
          </button>
        </div>
      </div>

      {/* Panel de pedido móvil */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-10 p-4 overflow-auto pt-safe pb-[80px] ${
        activeTab === 'pedido' ? 'block' : 'hidden'
      }`}>
        <div className="mb-4">
          <div className="font-semibold text-lg">{customerName || "Cliente"}</div>
          <div className="text-sm text-gray-500">Orden #925 • Comer Aquí</div>
          <div className="text-xs text-gray-400 mt-1">Mié, Julio 12, 2023 • 06:12 PM</div>
        </div>

        <h2 className="font-semibold text-lg mb-4">Detalle de Orden</h2>

        {/* Lista de productos en el pedido móvil */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 my-10">
              No hay artículos añadidos a la orden
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    {item.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        Extra: {item.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                        onClick={() => openNoteModal(item.id)}
                      >
                        Notas
                      </button>
                      <button
                        className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen del pedido móvil */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Artículos ({cart.length})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impuesto (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Botón de procesar pedido móvil */}
        <Button
          className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-black"
          onClick={() => setOrderModal(true)}
          disabled={cart.length === 0}
        >
          Procesar Pedido
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </Button>
      </div>

      {/* Modal para notas de producto */}
      <Dialog open={noteModal} onOpenChange={setNoteModal}>
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
            <Button variant="outline" onClick={() => setNoteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProductNote} className="bg-orange-500 hover:bg-orange-600">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de pedido */}
      <Dialog open={orderModal} onOpenChange={setOrderModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Confirmar Pedido</DialogTitle>
            <DialogDescription>
              Revise los detalles y complete la información para enviar el pedido.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(80vh-200px)] overflow-y-auto">
            <div className="space-y-4">
              {/* Datos del cliente y camarero */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 relative">
                  <label htmlFor="customerName" className="text-sm font-medium">
                    Nombre del Cliente
                  </label>
                  <Input
                    id="customerName"
                    value={customerSearchTerm}
                    onChange={(e) => handleCustomerSearch(e.target.value)}
                    onFocus={() => setShowCustomerDropdown(customerSearchTerm.length > 0)}
                    placeholder="Buscar cliente..."
                    className="w-full"
                  />
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.slice(0, 10).map((customer) => (
                        <div
                          key={customer.cliente_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectCustomer(customer)}
                        >
                          <div className="font-medium">
                            {customer.nombre} {customer.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.email && <span>{customer.email}</span>}
                            {customer.telefono && (
                              <span className={customer.email ? "ml-2" : ""}>
                                {customer.telefono}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Seleccionar Camarero
                  </label>
                  <Select value={selectedServer} onValueChange={setSelectedServer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un camarero" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.empleado_id} value={employee.empleado_id.toString()}>
                          {employee.nombre} {employee.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selección de mesa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Seleccionar Mesa
                </label>
                <Select 
                  value={selectedTable ? selectedTable.toString() : ""} 
                  onValueChange={(value) => setSelectedTable(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.mesa_id} value={table.mesa_id.toString()}>
                        {table.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de productos en el pedido */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Productos Seleccionados</div>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="mt-1 text-sm text-gray-500">
                              {item.quantity} x ${item.price.toFixed(2)}
                              {item.notes && <div className="text-xs">Notas: {item.notes}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Buscador para añadir más productos */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Añadir más productos</div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar más productos..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {modalSearchTerm && (
                  <Card className="mt-2 max-h-48 overflow-y-auto">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {modalFilteredProducts.length > 0 ? (
                          modalFilteredProducts.map((product) => (
                            <div
                              key={product.platillo_id}
                              className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
                              onClick={() => {
                                addToCart(product);
                                setModalSearchTerm("");
                              }}
                            >
                              <div>
                                <div className="font-medium">{product.nombre}</div>
                                <div className="text-sm text-gray-500">
                                  S/ {safePrice(product.precio_venta).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-sm text-gray-500">
                            No se encontraron productos
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Resumen del pedido */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impuestos (5%)</span>
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
              </Card>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={() => setOrderModal(false)}>
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOrderModal(false)}>
                Guardar Borrador
              </Button>
              <Button
                onClick={processOrder}
                disabled={cart.length === 0}
                className="gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Check className="h-4 w-4" />
                Enviar Pedido
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}