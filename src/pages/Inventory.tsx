import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowUpDown,
  Check,
  Download,
  Edit,
  Filter,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos simulados para el inventario
const inventoryData = [
  {
    id: 1,
    name: "Tomates",
    category: "Vegetales",
    unit: "Kg",
    stockMin: 10,
    stockCurrent: 5,
    supplier: "Agrícola del Sur",
    buyPrice: "$45.00",
    status: "low",
  },
  {
    id: 2,
    name: "Arroz",
    category: "Granos",
    unit: "Kg",
    stockMin: 20,
    stockCurrent: 35,
    supplier: "Distribuidora Central",
    buyPrice: "$28.50",
    status: "normal",
  },
  {
    id: 3,
    name: "Aceite de oliva",
    category: "Aceites",
    unit: "L",
    stockMin: 5,
    stockCurrent: 8,
    supplier: "Importadora Gourmet",
    buyPrice: "$120.00",
    status: "normal",
  },
  {
    id: 4,
    name: "Carne de res",
    category: "Carnes",
    unit: "Kg",
    stockMin: 15,
    stockCurrent: 12,
    supplier: "Carnicería Premium",
    buyPrice: "$180.00",
    status: "warning",
  },
  {
    id: 5,
    name: "Pollo",
    category: "Carnes",
    unit: "Kg",
    stockMin: 20,
    stockCurrent: 25,
    supplier: "Granja Avícola",
    buyPrice: "$95.00",
    status: "normal",
  },
  {
    id: 6,
    name: "Cebolla",
    category: "Vegetales",
    unit: "Kg",
    stockMin: 8,
    stockCurrent: 3,
    supplier: "Agrícola del Sur",
    buyPrice: "$22.00",
    status: "low",
  },
  {
    id: 7,
    name: "Ajo",
    category: "Vegetales",
    unit: "Kg",
    stockMin: 2,
    stockCurrent: 4,
    supplier: "Agrícola del Sur",
    buyPrice: "$60.00",
    status: "normal",
  },
  {
    id: 8,
    name: "Vino tinto",
    category: "Bebidas",
    unit: "Botella",
    stockMin: 10,
    stockCurrent: 12,
    supplier: "Viñedos España",
    buyPrice: "$200.00",
    status: "normal",
  },
];

// Historial simulado de movimientos
const movementsData = [
  {
    id: 1,
    date: "2025-05-18 08:30",
    product: "Tomates",
    type: "Entrada",
    quantity: "10 Kg",
    user: "Ana López",
    notes: "Reposición de stock",
  },
  {
    id: 2,
    date: "2025-05-17 14:15",
    product: "Carne de res",
    type: "Salida",
    quantity: "5 Kg",
    user: "Carlos Ruiz",
    notes: "Consumo cocina",
  },
  {
    id: 3,
    date: "2025-05-16 11:00",
    product: "Aceite de oliva",
    type: "Ajuste manual",
    quantity: "+2 L",
    user: "Admin",
    notes: "Corrección de inventario",
  },
  {
    id: 4,
    date: "2025-05-15 09:45",
    product: "Cebolla",
    type: "Salida",
    quantity: "3 Kg",
    user: "María González",
    notes: "Preparación de menú del día",
  },
  {
    id: 5,
    date: "2025-05-14 16:30",
    product: "Vino tinto",
    type: "Entrada",
    quantity: "12 Botellas",
    user: "Luis Hernández",
    notes: "Pedido mensual",
  },
];

export function Inventory() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-gray-500">
            Gestión de existencias y movimientos de productos.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir nuevo producto al inventario</DialogTitle>
              <DialogDescription>
                Complete los detalles del producto que desea añadir al inventario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input id="name" placeholder="Nombre del producto" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría
                  </label>
                  <Input id="category" placeholder="Categoría" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unidad
                  </label>
                  <Input id="unit" placeholder="Kg, L, unidad" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="minStock" className="text-sm font-medium">
                    Stock mínimo
                  </label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="currentStock" className="text-sm font-medium">
                    Stock actual
                  </label>
                  <Input id="currentStock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="supplier" className="text-sm font-medium">
                    Proveedor
                  </label>
                  <Input id="supplier" placeholder="Nombre del proveedor" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Precio de compra
                  </label>
                  <Input id="price" placeholder="$0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notas adicionales
                </label>
                <Input id="notes" placeholder="Notas adicionales" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={() => setShowAddDialog(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            className="pl-8"
            placeholder="Buscar productos..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
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

      <Tabs defaultValue="inventory" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex cursor-pointer items-center">
                        Producto
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Stock Min.</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Precio Compra</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.stockMin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.stockCurrent}
                          {item.status === "low" && (
                            <Badge variant="destructive" className="text-xs">
                              Bajo
                            </Badge>
                          )}
                          {item.status === "warning" && (
                            <Badge variant="warning" className="bg-yellow-100 text-xs text-yellow-800">
                              Alerta
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.buyPrice}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
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
                Mostrando <strong>8</strong> de <strong>8</strong> productos
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex cursor-pointer items-center">
                        Fecha y Hora
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementsData.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{movement.date}</TableCell>
                      <TableCell>{movement.product}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "Entrada"
                              ? "outline"
                              : movement.type === "Salida"
                              ? "secondary"
                              : "default"
                          }
                          className={
                            movement.type === "Entrada"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : movement.type === "Salida"
                              ? "bg-orange-100 text-orange-700"
                              : ""
                          }
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell>{movement.notes}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-xs text-gray-500">
                Mostrando <strong>5</strong> de <strong>5</strong> movimientos
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Alertas de Inventario</CardTitle>
              <CardDescription>
                Productos que están por debajo del nivel mínimo de stock establecido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryData
                  .filter((item) => item.status === "low" || item.status === "warning")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Stock actual: <strong>{item.stockCurrent}</strong> {item.unit} |
                            Mínimo: <strong>{item.stockMin}</strong> {item.unit}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Reordenar</Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
