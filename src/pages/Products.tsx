import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  Download,
  Edit,
  Eye,
  Filter,
  Image,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

// Datos de ejemplo para productos
const productsData = [
  {
    id: 1,
    name: "Parrillada Mixta",
    description: "Selección de cortes de carne a la parrilla con vegetales asados y salsa chimichurri.",
    image: "parrillada.jpg",
    category: "Platos Fuertes",
    price: 220.00,
    ingredients: [
      { id: 101, name: "Filete de res", quantity: "200g" },
      { id: 102, name: "Chorizo", quantity: "100g" },
      { id: 103, name: "Pechuga de pollo", quantity: "150g" },
      { id: 104, name: "Pimiento", quantity: "1 unidad" },
      { id: 105, name: "Cebolla", quantity: "1 unidad" },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Ensalada César",
    description: "Lechuga romana, aderezo césar, crutones, queso parmesano y pechuga de pollo.",
    image: "ensalada-cesar.jpg",
    category: "Entradas",
    price: 95.00,
    ingredients: [
      { id: 201, name: "Lechuga romana", quantity: "200g" },
      { id: 202, name: "Pechuga de pollo", quantity: "100g" },
      { id: 203, name: "Queso parmesano", quantity: "30g" },
      { id: 204, name: "Aderezo césar", quantity: "60ml" },
      { id: 205, name: "Crutones", quantity: "50g" },
    ],
    status: "active",
  },
  {
    id: 3,
    name: "Pasta Alfredo",
    description: "Fettuccine con salsa cremosa, mantequilla, ajo y queso parmesano.",
    image: "pasta-alfredo.jpg",
    category: "Platos Fuertes",
    price: 120.00,
    ingredients: [
      { id: 301, name: "Pasta fettuccine", quantity: "200g" },
      { id: 302, name: "Crema", quantity: "100ml" },
      { id: 303, name: "Mantequilla", quantity: "50g" },
      { id: 304, name: "Queso parmesano", quantity: "60g" },
      { id: 305, name: "Ajo", quantity: "2 dientes" },
    ],
    status: "active",
  },
  {
    id: 4,
    name: "Tostadas de Atún",
    description: "Tostadas con atún fresco marinado, aguacate, cebolla morada y cilantro.",
    image: "tostadas-atun.jpg",
    category: "Entradas",
    price: 85.00,
    ingredients: [
      { id: 401, name: "Atún fresco", quantity: "150g" },
      { id: 402, name: "Tostadas", quantity: "3 unidades" },
      { id: 403, name: "Aguacate", quantity: "1 unidad" },
      { id: 404, name: "Cebolla morada", quantity: "50g" },
      { id: 405, name: "Cilantro", quantity: "20g" },
    ],
    status: "active",
  },
  {
    id: 5,
    name: "Costillas BBQ",
    description: "Costillas de cerdo marinadas y cocinadas lentamente con salsa barbecue.",
    image: "costillas-bbq.jpg",
    category: "Platos Fuertes",
    price: 180.00,
    ingredients: [
      { id: 501, name: "Costillas de cerdo", quantity: "500g" },
      { id: 502, name: "Salsa BBQ", quantity: "100ml" },
      { id: 503, name: "Papas", quantity: "200g" },
      { id: 504, name: "Especias", quantity: "10g" },
    ],
    status: "active",
  },
  {
    id: 6,
    name: "Limonada Natural",
    description: "Refrescante limonada preparada con limones frescos y azúcar.",
    image: "limonada.jpg",
    category: "Bebidas",
    price: 35.00,
    ingredients: [
      { id: 601, name: "Limones", quantity: "3 unidades" },
      { id: 602, name: "Azúcar", quantity: "30g" },
      { id: 603, name: "Agua", quantity: "500ml" },
      { id: 604, name: "Hielo", quantity: "100g" },
    ],
    status: "active",
  },
  {
    id: 7,
    name: "Cerveza Artesanal",
    description: "Cerveza artesanal de malta tostada con notas de caramelo.",
    image: "cerveza.jpg",
    category: "Bebidas Alcohólicas",
    price: 60.00,
    ingredients: [
      { id: 701, name: "Cerveza artesanal", quantity: "1 botella" },
    ],
    status: "inactive",
  },
  {
    id: 8,
    name: "Tiramisú",
    description: "Postre italiano tradicional con capas de bizcocho, café, queso mascarpone y cacao.",
    image: "tiramisu.jpg",
    category: "Postres",
    price: 75.00,
    ingredients: [
      { id: 801, name: "Bizcochos", quantity: "100g" },
      { id: 802, name: "Café", quantity: "50ml" },
      { id: 803, name: "Queso mascarpone", quantity: "150g" },
      { id: 804, name: "Cacao en polvo", quantity: "10g" },
      { id: 805, name: "Azúcar", quantity: "50g" },
    ],
    status: "active",
  },
];

// Categorías disponibles
const categories = [
  "Entradas",
  "Platos Fuertes",
  "Postres",
  "Bebidas",
  "Bebidas Alcohólicas",
];

// Ingredientes disponibles para seleccionar
const availableIngredients = [
  { id: 1, name: "Tomates", unit: "g" },
  { id: 2, name: "Cebolla", unit: "g" },
  { id: 3, name: "Ajo", unit: "dientes" },
  { id: 4, name: "Pechuga de pollo", unit: "g" },
  { id: 5, name: "Filete de res", unit: "g" },
  { id: 6, name: "Pasta", unit: "g" },
  { id: 7, name: "Arroz", unit: "g" },
  { id: 8, name: "Queso parmesano", unit: "g" },
  { id: 9, name: "Lechuga", unit: "g" },
  { id: 10, name: "Limones", unit: "unidades" },
  { id: 11, name: "Aceite de oliva", unit: "ml" },
  { id: 12, name: "Sal", unit: "g" },
  { id: 13, name: "Pimienta", unit: "g" },
  { id: 14, name: "Crema", unit: "ml" },
  { id: 15, name: "Mantequilla", unit: "g" },
];

export function Products() {
  const [products, setProducts] = useState(productsData);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar productos según la pestaña seleccionada y término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && product.status === "active") ||
      (activeTab === "inactive" && product.status === "inactive") ||
      product.category.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Función para abrir el modal de ver producto
  const handleViewProduct = (product: any) => {
    setCurrentProduct(product);
    setIsViewProductOpen(true);
  };

  // Función para eliminar un producto (simulada)
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-gray-500">
            Gestión del menú, platos y bebidas
          </p>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Añadir nuevo producto al menú</DialogTitle>
              <DialogDescription>
                Complete los detalles del producto, incluyendo imagen, precio e ingredientes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              {/* Primera fila: Información básica */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre del producto
                  </label>
                  <Input id="name" placeholder="Nombre del producto" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Segunda fila: Precio y estado */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Precio
                  </label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Estado
                  </label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Tercera fila: Descripción */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  id="description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Descripción detallada del producto"
                />
              </div>

              {/* Cuarta fila: Imagen */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagen del producto</label>
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Image className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Arrastra una imagen o
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="mr-2 h-4 w-4" />
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quinta fila: Ingredientes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredientes</label>
                <Card>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between">
                      <CardTitle className="text-sm">Lista de ingredientes</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" />
                        Añadir ingrediente
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingrediente</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Unidad</TableHead>
                          <TableHead className="w-16"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <select className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm">
                              <option>Seleccionar ingrediente</option>
                              {availableIngredients.map((ing) => (
                                <option key={ing.id} value={ing.id}>
                                  {ing.name}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" className="h-8" placeholder="0" />
                          </TableCell>
                          <TableCell>
                            <select className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm">
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                              <option value="unidades">unidades</option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddProductOpen(false)}>
                Guardar producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex cursor-pointer items-center">
                        Producto
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ingredientes</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-gray-200">
                            <div
                              className="h-full w-full rounded-md bg-cover bg-center"
                              style={{
                                backgroundImage: `url('https://placehold.co/100x100/orange/white?text=${encodeURIComponent(product.name.charAt(0))}')`
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={product.status === "active" ? "default" : "secondary"}
                          className={product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {product.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.ingredients.length} ingredientes</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-xs text-gray-500">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de vista detallada del producto */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        {currentProduct && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{currentProduct.name}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="aspect-video w-full rounded-md bg-gray-200">
                  <div
                    className="h-full w-full rounded-md bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://placehold.co/600x400/orange/white?text=${encodeURIComponent(currentProduct.name)}')`
                    }}
                  />
                </div>

                <div className="mt-4">
                  <h3 className="mb-2 font-medium">Descripción</h3>
                  <p className="text-sm text-gray-600">{currentProduct.description}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{currentProduct.category}</Badge>
                  <Badge variant="outline" className={
                    currentProduct.status === "active"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-500 bg-gray-50 text-gray-700"
                  }>
                    {currentProduct.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">
                    ${currentProduct.price.toFixed(2)}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Ingredientes</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingrediente</TableHead>
                          <TableHead>Cantidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProduct.ingredients.map((ingredient: any) => (
                          <TableRow key={ingredient.id}>
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewProductOpen(false)}>
                Cerrar
              </Button>
              <Button>Editar</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
