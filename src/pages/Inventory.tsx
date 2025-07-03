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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Package,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  categoryIngredientService, 
  ingredientService, 
  movementService,
  supplierService,
  employeeService,
  CategoriaIngrediente, 
  Ingrediente,
  Movimiento,
  Proveedor,
  Employee,
  TipoMovimiento,
  DetalleMovimiento
} from "@/services/api";

// Datos de ejemplo
// const ingredientesData: Ingrediente[] = [
//   {
//     ingrediente_id: 1,
//     categoria_id: 1,
//     nombre: "Pollo",
//     descripcion: "Pechuga de pollo",
//     costo_unitario: 2500,
//     unidad: "kg",
//     stock_actual: 15,
//     stock_minimo: 5,
//     estado: 'disponible',
//     categoria: categoriasData[0]
//   },
//   {
//     ingrediente_id: 2,
//     categoria_id: 2,
//     nombre: "Tomate",
//     descripcion: "Tomate fresco",
//     costo_unitario: 800,
//     unidad: "kg",
//     stock_actual: 3,
//     stock_minimo: 5,
//     estado: 'disponible',
//     categoria: categoriasData[1]
//   },
//   {
//     ingrediente_id: 3,
//     categoria_id: 3,
//     nombre: "Queso",
//     descripcion: "Queso gouda",
//     costo_unitario: 3200,
//     unidad: "kg",
//     stock_actual: 8,
//     stock_minimo: 3,
//     estado: 'disponible',
//     categoria: categoriasData[2]
//   },
// ];

const movimientosData = [
  {
    id: 1,
    type: "entrada",
    product: "Pollo",
    quantity: 10,
    unit: "kg",
    reason: "compra",
    date: "2023-06-15 10:30",
    user: "Juan Pérez"
  },
  {
    id: 2,
    type: "salida",
    product: "Tomate",
    quantity: 2,
    unit: "kg",
    reason: "uso",
    date: "2023-06-15 14:20",
    user: "María González"
  },
];

const alertasData = [
  {
    id: 1,
    type: "stock_bajo",
    product: "Tomate",
    currentStock: 3,
    minimumStock: 5,
    severity: "alta",
    date: "2023-06-15"
  },
  {
    id: 2,
    type: "vencimiento",
    product: "Leche",
    expiryDate: "2023-06-17",
    severity: "media",
    date: "2023-06-15"
  },
];



export function Inventory() {
  const { toast } = useToast();

  // Estados para datos
  const [categorias, setCategorias] = useState<CategoriaIngrediente[]>([]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([
    { tipo_movimiento_id: 1, nombre: 'Entrada' },
    { tipo_movimiento_id: 2, nombre: 'Salida' }
  ]);
  const [alertas] = useState(alertasData);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);

  // Estados para modales
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false);
  const [isEditIngredientOpen, setIsEditIngredientOpen] = useState(false);
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  const [isEditMovementOpen, setIsEditMovementOpen] = useState(false);


  // Estados para formularios
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '' });
  const [ingredientForm, setIngredientForm] = useState({
    categoria_id: 0,
    nombre: '',
    descripcion: '',
    costo_unitario: 0,
    unidad: '',
    stock_actual: 0,
    stock_minimo: 0,
    estado: 'disponible' as 'disponible' | 'agotado' | 'descontinuado'
  });

  // Estados para edición
  const [editingCategory, setEditingCategory] = useState<CategoriaIngrediente | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingrediente | null>(null);
  const [editingMovement, setEditingMovement] = useState<Movimiento | null>(null);

  // Estados para formulario de movimientos
  const [movementForm, setMovementForm] = useState({
    tipo_movimiento_id: 0,
    prove_id: 0,
    nota: ''
  });

  // Estados para búsqueda y selección de ingredientes
  const [searchIngredient, setSearchIngredient] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<DetalleMovimiento[]>([]);
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);


  // Función para cargar categorías
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryIngredientService.getAll();
      setCategorias(data);
    } catch (error) {
      toast({
        title: "❌ Error de conexión",
        description: `No se pudieron cargar las categorías. ${error instanceof Error ? error.message : 'Verifique su conexión'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Función para cargar ingredientes
  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientService.getAll();
      setIngredientes(data);
    } catch (error) {
      toast({
        title: "❌ Error de conexión",
        description: `No se pudieron cargar los ingredientes. ${error instanceof Error ? error.message : 'Verifique su conexión'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar movimientos
  const loadMovements = async () => {
    try {
      setLoadingMovements(true);
      const data = await movementService.getAll();
      setMovimientos(data);
    } catch (error) {
      toast({
        title: "❌ Error de conexión",
        description: `No se pudieron cargar los movimientos. ${error instanceof Error ? error.message : 'Verifique su conexión'}`,
        variant: "destructive",
      });
    } finally {
      setLoadingMovements(false);
    }
  };

  // Función para cargar proveedores
  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  // Función para cargar empleados
  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadIngredients();
    loadMovements();
    loadSuppliers();
    loadEmployees();
  }, []);

  // Funciones para categorías
  const handleCreateCategory = async () => {
    try {
      const categoryData = {
        nombre: categoryForm.nombre,
        descripcion: categoryForm.descripcion
      };

      const newCategory = await categoryIngredientService.create(categoryData);
      setCategorias([...categorias, newCategory]);
      setCategoryForm({ nombre: '', descripcion: '' });
      setIsAddCategoryOpen(false);

      toast({
        title: "✅ Categoría agregada",
        description: "La categoría se ha creado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al crear categoría",
        description: `No se pudo crear la categoría. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const openEditCategory = (categoria: CategoriaIngrediente) => {
    setEditingCategory(categoria);
    setCategoryForm({ 
      nombre: categoria.nombre, 
      descripcion: categoria.descripcion || '' 
    });
    setIsEditCategoryOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const categoryData = {
        nombre: categoryForm.nombre,
        descripcion: categoryForm.descripcion
      };

      const updatedCategory = await categoryIngredientService.update(editingCategory.categoria_id, categoryData);

      const updatedCategories = categorias.map(cat => 
        cat.categoria_id === editingCategory.categoria_id ? updatedCategory : cat
      );

      setCategorias(updatedCategories);
      setCategoryForm({ nombre: '', descripcion: '' });
      setEditingCategory(null);
      setIsEditCategoryOpen(false);

      toast({
        title: "✅ Categoría editada",
        description: "La categoría se ha actualizado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al editar categoría",
        description: `No se pudo actualizar la categoría. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await categoryIngredientService.delete(categoryId);
      setCategorias(categorias.filter(cat => cat.categoria_id !== categoryId));

      toast({
        title: "✅ Categoría eliminada",
        description: "La categoría se ha eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al eliminar categoría",
        description: `No se pudo eliminar la categoría. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  // Funciones para ingredientes
  const handleCreateIngredient = async () => {
    try {
      const ingredientData = {
        categoria_id: ingredientForm.categoria_id,
        nombre: ingredientForm.nombre,
        descripcion: ingredientForm.descripcion,
        costo_unitario: ingredientForm.costo_unitario,
        unidad: ingredientForm.unidad,
        stock_actual: ingredientForm.stock_actual,
        stock_minimo: ingredientForm.stock_minimo,
        estado: ingredientForm.estado
      };

      const newIngredient = await ingredientService.create(ingredientData);

      // Recargar ingredientes para obtener la relación con categoría
      await loadIngredients();

      setIngredientForm({
        categoria_id: 0,
        nombre: '',
        descripcion: '',
        costo_unitario: 0,
        unidad: '',
        stock_actual: 0,
        stock_minimo: 0,
        estado: 'disponible'
      });
      setIsAddIngredientOpen(false);

      toast({
        title: "✅ Ingrediente agregado",
        description: "El ingrediente se ha creado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al crear ingrediente",
        description: `No se pudo crear el ingrediente. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const openEditIngredient = (ingrediente: Ingrediente) => {
    setEditingIngredient(ingrediente);
    setIngredientForm({
      categoria_id: ingrediente.categoria_id,
      nombre: ingrediente.nombre,
      descripcion: ingrediente.descripcion || '',
      costo_unitario: ingrediente.costo_unitario,
      unidad: ingrediente.unidad,
      stock_actual: ingrediente.stock_actual,
      stock_minimo: ingrediente.stock_minimo,
      estado: ingrediente.estado
    });
    setIsEditIngredientOpen(true);
  };

  const handleUpdateIngredient = async () => {
    if (!editingIngredient) return;

    try {
      const ingredientData = {
        categoria_id: ingredientForm.categoria_id,
        nombre: ingredientForm.nombre,
        descripcion: ingredientForm.descripcion,
        costo_unitario: ingredientForm.costo_unitario,
        unidad: ingredientForm.unidad,
        stock_actual: ingredientForm.stock_actual,
        stock_minimo: ingredientForm.stock_minimo,
        estado: ingredientForm.estado
      };

      await ingredientService.update(editingIngredient.ingrediente_id, ingredientData);

      // Recargar ingredientes para obtener los datos actualizados
      await loadIngredients();

      setIngredientForm({
        categoria_id: 0,
        nombre: '',
        descripcion: '',
        costo_unitario: 0,
        unidad: '',
        stock_actual: 0,
        stock_minimo: 0,
        estado: 'disponible'
      });
      setEditingIngredient(null);
      setIsEditIngredientOpen(false);

      toast({
        title: "✅ Ingrediente editado",
        description: "El ingrediente se ha actualizado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al editar ingrediente",
        description: `No se pudo actualizar el ingrediente. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteIngredient = async (ingredientId: number) => {
    try {
      await ingredientService.delete(ingredientId);
      setIngredientes(ingredientes.filter(ing => ing.ingrediente_id !== ingredientId));

      toast({
        title: "✅ Ingrediente eliminado",
        description: "El ingrediente se ha eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al eliminar ingrediente",
        description: `No se pudo eliminar el ingrediente. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "entregado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Funciones para manejo de ingredientes en movimientos
  const filteredIngredients = ingredientes.filter(ing => 
    ing.nombre.toLowerCase().includes(searchIngredient.toLowerCase()) &&
    !selectedIngredients.some(selected => selected.ingrediente_id === ing.ingrediente_id)
  );

  const addIngredientToMovement = (ingrediente: Ingrediente) => {
    const newDetail: DetalleMovimiento = {
      ingrediente_id: ingrediente.ingrediente_id,
      cantidad: 1,
      precio_unitario: ingrediente.costo_unitario,
      ingrediente: ingrediente
    };
    setSelectedIngredients([...selectedIngredients, newDetail]);
    setSearchIngredient('');
    setShowIngredientDropdown(false);
  };

  const removeIngredientFromMovement = (ingredienteId: number) => {
    setSelectedIngredients(selectedIngredients.filter(item => item.ingrediente_id !== ingredienteId));
  };

  const updateIngredientQuantity = (ingredienteId: number, cantidad: number) => {
    setSelectedIngredients(selectedIngredients.map(item =>
      item.ingrediente_id === ingredienteId ? { ...item, cantidad } : item
    ));
  };

  const updateIngredientPrice = (ingredienteId: number, precio_unitario: number) => {
    setSelectedIngredients(selectedIngredients.map(item =>
      item.ingrediente_id === ingredienteId ? { ...item, precio_unitario } : item
    ));
  };

  // Función para limpiar el formulario de movimientos
  const clearMovementForm = () => {
    setMovementForm({
      tipo_movimiento_id: 0,
      prove_id: 0,
      nota: ''
    });
    setSelectedIngredients([]);
    setSearchIngredient('');
    setShowIngredientDropdown(false);
    setEditingMovement(null);
  };

  // Funciones para movimientos
  const handleCreateMovement = async () => {
    try {
      if (selectedIngredients.length === 0) {
        toast({
          title: "❌ Error de validación",
          description: "Debe agregar al menos un ingrediente al movimiento.",
          variant: "destructive",
        });
        return;
      }

      if (!movementForm.tipo_movimiento_id || !movementForm.prove_id) {
        toast({
          title: "❌ Error de validación",
          description: "Debe seleccionar tipo de movimiento y proveedor.",
          variant: "destructive",
        });
        return;
      }

      const movementData = {
        tipo_movimiento_id: movementForm.tipo_movimiento_id,
        prove_id: movementForm.prove_id,
        nota: movementForm.nota,
        detalles: selectedIngredients.map(detail => ({
          ingrediente_id: detail.ingrediente_id,
          cantidad: detail.cantidad,
          precio_unitario: detail.precio_unitario
        }))
      };

      await movementService.create(movementData);
      await loadMovements();
      await loadIngredients();

      clearMovementForm();
      setIsAddMovementOpen(false);

      toast({
        title: "✅ Movimiento creado",
        description: "El movimiento se ha registrado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al crear movimiento",
        description: `No se pudo crear el movimiento. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const openEditMovement = (movimiento: Movimiento) => {
    console.log('Editando movimiento:', movimiento);
    
    setEditingMovement(movimiento);

    // Buscar tipo de movimiento por nombre
    const tipoEncontrado = tiposMovimiento.find(tipo => 
      tipo.nombre.toLowerCase() === movimiento.tipo_movimiento?.toLowerCase()
    );
    console.log('Tipo encontrado:', tipoEncontrado);

    // Buscar proveedor por nombre
    const proveedorEncontrado = proveedores.find(proveedor => 
      proveedor.prove_nombre.toLowerCase() === movimiento.proveedor?.toLowerCase()
    );
    console.log('Proveedor encontrado:', proveedorEncontrado);

    setMovementForm({
      tipo_movimiento_id: tipoEncontrado?.tipo_movimiento_id || 0,
      prove_id: proveedorEncontrado?.prove_id || 0,
      nota: movimiento.nota || ''
    });

    // Convertir detalles del movimiento a formato editable
    if (movimiento.detalles) {
      const detalles: DetalleMovimiento[] = movimiento.detalles.map((detalle, index) => {
        const ingrediente = ingredientes.find(ing => 
          ing.nombre.toLowerCase() === detalle.ingrediente?.toLowerCase()
        );
        
        if (!ingrediente) {
          console.warn(`Ingrediente no encontrado: ${detalle.ingrediente}`);
        }

        // Asegurar que precio_unitario esté presente
        let precio_unitario = detalle.precio_unitario;
        if (precio_unitario == null && ingrediente) {
          precio_unitario = ingrediente.costo_unitario;
        }

        return {
          ingrediente_id: ingrediente?.ingrediente_id || index,
          cantidad: detalle.cantidad,
          precio_unitario: precio_unitario || 0,
          ingrediente: ingrediente
        };
      }).filter(detalle => detalle.ingrediente); // Solo incluir detalles con ingrediente válido

      setSelectedIngredients(detalles);
    }

    setIsEditMovementOpen(true);
  };

  const handleUpdateMovement = async () => {
    if (!editingMovement) return;

    try {
      if (selectedIngredients.length === 0) {
        toast({
          title: "❌ Error de validación",
          description: "Debe agregar al menos un ingrediente al movimiento.",
          variant: "destructive",
        });
        return;
      }

      if (!movementForm.tipo_movimiento_id || !movementForm.prove_id) {
        toast({
          title: "❌ Error de validación",
          description: "Debe seleccionar tipo de movimiento y proveedor.",
          variant: "destructive",
        });
        return;
      }

      const movementData = {
        tipo_movimiento_id: movementForm.tipo_movimiento_id,
        prove_id: movementForm.prove_id,
        nota: movementForm.nota,
        detalles: selectedIngredients.map(detail => ({
          ingrediente_id: detail.ingrediente_id,
          cantidad: detail.cantidad,
          precio_unitario: detail.precio_unitario
        }))
      };

      await movementService.update(editingMovement.movimiento_id, movementData);
      await loadMovements();
      await loadIngredients();

      clearMovementForm();
      setIsEditMovementOpen(false);

      toast({
        title: "✅ Movimiento actualizado",
        description: "El movimiento se ha actualizado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al actualizar movimiento",
        description: `No se pudo actualizar el movimiento. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMovement = async (movementId: number) => {
    try {
      await movementService.delete(movementId);
      await loadMovements();
      await loadIngredients(); // Recargar ingredientes para actualizar stock

      toast({
        title: "✅ Movimiento eliminado",
        description: "El movimiento se ha eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "❌ Error al eliminar movimiento",
        description: `No se pudo eliminar el movimiento. ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-gray-500">
            Gestión completa de inventario y stock
          </p>
        </div>
      </div>

      <Tabs defaultValue="ingredientes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredientes" className="space-y-4">
          <div className="flex justify-between items-center">
            <Button onClick={() => setIsCategoryModalOpen(true)} variant="outline" className="gap-2">
              <Tag className="h-4 w-4" />
              Gestionar Categorías
            </Button>
            <Button onClick={() => setIsAddIngredientOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Ingrediente
            </Button>
          </div>

          {loading ? (
            <p>Cargando ingredientes...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ingredientes.map((ingrediente) => (
                <Card key={ingrediente.ingrediente_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{ingrediente.nombre}</CardTitle>
                      <Badge variant={ingrediente.stock_actual <= ingrediente.stock_minimo ? "destructive" : "default"}>
                        {ingrediente.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{ingrediente.descripcion}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Categoría:</span>
                      <span className="font-medium">{ingrediente.categoria?.nombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stock actual:</span>
                      <span className={ingrediente.stock_actual <= ingrediente.stock_minimo ? "text-red-600 font-bold" : "font-medium"}>
                        {ingrediente.stock_actual} {ingrediente.unidad}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stock mínimo:</span>
                      <span className="font-medium">{ingrediente.stock_minimo} {ingrediente.unidad}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Costo unitario:</span>
                      <span className="font-medium">${ingrediente.costo_unitario}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => openEditIngredient(ingrediente)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteIngredient(ingrediente.ingrediente_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Movimientos de inventario</h3>
            <Button onClick={() => {
              clearMovementForm();
              setIsAddMovementOpen(true);
            }} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar movimiento
            </Button>
          </div>

          {loadingMovements ? (
            <p>Cargando movimientos...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {movimientos.map((movimiento) => (
                <Card 
                  key={movimiento.movimiento_id} 
                  className={`h-fit ${
                    movimiento.tipo_movimiento === "Entrada" 
                      ? "bg-green-50/30" 
                      : "bg-red-50/30"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            movimiento.tipo_movimiento === "Entrada" 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {movimiento.tipo_movimiento}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-white/80"
                          onClick={() => openEditMovement(movimiento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-white/80 hover:text-red-600"
                          onClick={() => handleDeleteMovement(movimiento.movimiento_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Información del movimiento */}
                    <div className="space-y-2 text-sm">
                      {movimiento.proveedor && (
                        <div className="flex justify-between items-center p-2 bg-white/60 rounded-md">
                          <span className="text-blue-600 font-medium flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Proveedor:
                          </span>
                          <span className="font-semibold text-gray-800">{movimiento.proveedor}</span>
                        </div>
                      )}
                      {movimiento.empleado && (
                        <div className="flex justify-between items-center p-2 bg-white/60 rounded-md">
                          <span className="text-purple-600 font-medium">Empleado:</span>
                          <span className="font-semibold text-gray-800">{movimiento.empleado}</span>
                        </div>
                      )}
                      {movimiento.fecha && (
                        <div className="flex justify-between items-center p-2 bg-white/60 rounded-md">
                          <span className="text-orange-600 font-medium">Fecha:</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(movimiento.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nota del movimiento */}
                    {movimiento.nota && (
                      <div className="p-3 bg-white/80 rounded-md border border-gray-200">
                        <span className="font-medium text-indigo-600">Nota: </span>
                        <span className="text-gray-700">{movimiento.nota}</span>
                      </div>
                    )}

                    {/* Lista de productos */}
                    {movimiento.detalles && movimiento.detalles.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium text-sm text-gray-700 flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          Productos:
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {movimiento.detalles.map((detalle, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-3 bg-white/80 rounded-md border border-gray-200">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-800 truncate">{detalle.ingrediente}</div>
                                <div className="text-gray-600 text-xs flex items-center gap-2">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                                    {detalle.cantidad} unidades
                                  </span>
                                  {detalle.precio_unitario && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                                      ${detalle.precio_unitario}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {detalle.precio_unitario && (
                                <div className="text-right ml-2">
                                  <div className="font-bold text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Total del movimiento */}
                        {movimiento.detalles.some(d => d.precio_unitario) && (
                          <div className={`flex justify-between items-center p-3 rounded-md border-2 ${
                            movimiento.tipo_movimiento === "Entrada" 
                              ? "bg-green-100 border-green-300" 
                              : "bg-red-100 border-red-300"
                          }`}>
                            <span className="font-bold text-sm text-gray-700">Total:</span>
                            <span className={`font-bold text-lg ${
                              movimiento.tipo_movimiento === "Entrada" 
                                ? "text-green-800" 
                                : "text-red-800"
                            }`}>
                              ${movimiento.detalles.reduce((total, detalle) => 
                                total + (detalle.cantidad * (detalle.precio_unitario || 0)), 0
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {movimientos.length === 0 && (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No hay movimientos registrados</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <h3 className="text-lg font-medium">Alertas de inventario</h3>

          <div className="space-y-4">
            {alertas.map((alerta) => (
              <Card key={alerta.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alerta.severity)}>
                            {alerta.severity.charAt(0).toUpperCase() + alerta.severity.slice(1)}
                          </Badge>
                          <span className="font-medium">{alerta.product}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {alerta.type === "stock_bajo" 
                            ? `Stock bajo: ${alerta.currentStock} (mínimo: ${alerta.minimumStock})`
                            : `Próximo a vencer: ${alerta.expiryDate}`
                          }
                        </p>
                        <p className="text-xs text-gray-400">{alerta.date}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>


      </Tabs>

      {/* Modal para gestionar categorías */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gestionar Categorías</DialogTitle>
            <DialogDescription>
              Administre las categorías de ingredientes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddCategoryOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Categoría
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.categoria_id}>
                    <TableCell>{categoria.categoria_id}</TableCell>
                    <TableCell className="font-medium">{categoria.nombre}</TableCell>
                    <TableCell>{categoria.descripcion || 'Sin descripción'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2"><Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openEditCategory(categoria)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(categoria.categoria_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para añadir categoría */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>
              Agregue una nueva categoría de ingredientes
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input 
                placeholder="Nombre de la categoría" 
                value={categoryForm.nombre}
                onChange={(e) => setCategoryForm({...categoryForm, nombre: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input 
                placeholder="Descripción de la categoría" 
                value={categoryForm.descripcion}
                onChange={(e) => setCategoryForm({...categoryForm, descripcion: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar categoría */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifique los datos de la categoría
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input 
                placeholder="Nombre de la categoría" 
                value={categoryForm.nombre}
                onChange={(e) => setCategoryForm({...categoryForm, nombre: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input 
                placeholder="Descripción de la categoría" 
                value={categoryForm.descripcion}
                onChange={(e) => setCategoryForm({...categoryForm, descripcion: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCategory}>
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para añadir ingrediente */}
      <Dialog open={isAddIngredientOpen} onOpenChange={setIsAddIngredientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Ingrediente</DialogTitle>
            <DialogDescription>
              Agregue un nuevo ingrediente al inventario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={ingredientForm.categoria_id.toString()}
                  onValueChange={(value) => setIngredientForm({...ingredientForm, categoria_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.categoria_id} value={categoria.categoria_id.toString()}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  placeholder="Nombre del ingrediente" 
                  value={ingredientForm.nombre}
                  onChange={(e) => setIngredientForm({...ingredientForm, nombre: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input 
                placeholder="Descripción del ingrediente" 
                value={ingredientForm.descripcion}
                onChange={(e) => setIngredientForm({...ingredientForm, descripcion: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Costo Unitario</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.costo_unitario}
                  onChange={(e) => setIngredientForm({...ingredientForm, costo_unitario: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unidad</label>
                <Input 
                  placeholder="kg, lt, unidad" 
                  value={ingredientForm.unidad}
                  onChange={(e) => setIngredientForm({...ingredientForm, unidad: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={ingredientForm.estado}
                  onValueChange={(value: 'disponible' | 'agotado' | 'descontinuado') => 
                    setIngredientForm({...ingredientForm, estado: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                    <SelectItem value="descontinuado">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Actual</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.stock_actual}
                  onChange={(e) => setIngredientForm({...ingredientForm, stock_actual: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Mínimo</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.stock_minimo}
                  onChange={(e) => setIngredientForm({...ingredientForm, stock_minimo: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddIngredientOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateIngredient}>
              Crear Ingrediente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar ingrediente */}
      <Dialog open={isEditIngredientOpen} onOpenChange={setIsEditIngredientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ingrediente</DialogTitle>
            <DialogDescription>
              Modifique los datos del ingrediente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={ingredientForm.categoria_id.toString()}
                  onValueChange={(value) => setIngredientForm({...ingredientForm, categoria_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.categoria_id} value={categoria.categoria_id.toString()}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  placeholder="Nombre del ingrediente" 
                  value={ingredientForm.nombre}
                  onChange={(e) => setIngredientForm({...ingredientForm, nombre: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input 
                placeholder="Descripción del ingrediente" 
                value={ingredientForm.descripcion}
                onChange={(e) => setIngredientForm({...ingredientForm, descripcion: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Costo Unitario</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.costo_unitario}
                  onChange={(e) => setIngredientForm({...ingredientForm, costo_unitario: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unidad</label>
                <Input 
                  placeholder="kg, lt, unidad" 
                  value={ingredientForm.unidad}
                  onChange={(e) => setIngredientForm({...ingredientForm, unidad: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={ingredientForm.estado}
                  onValueChange={(value: 'disponible' | 'agotado' | 'descontinuado') => 
                    setIngredientForm({...ingredientForm, estado: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                    <SelectItem value="descontinuado">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Actual</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.stock_actual}
                  onChange={(e) => setIngredientForm({...ingredientForm, stock_actual: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Mínimo</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={ingredientForm.stock_minimo}
                  onChange={(e) => setIngredientForm({...ingredientForm, stock_minimo: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditIngredientOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateIngredient}>
              Actualizar Ingrediente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para añadir movimiento */}
      <Dialog open={isAddMovementOpen} onOpenChange={(open) => {
        setIsAddMovementOpen(open);
        if (!open) clearMovementForm();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar movimiento de inventario</DialogTitle>
            <DialogDescription>
              Registre entrada o salida de productos del inventario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Información general del movimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de movimiento *</label>
                <Select
                  value={movementForm.tipo_movimiento_id ? movementForm.tipo_movimiento_id.toString() : ""}
                  onValueChange={(value) => setMovementForm({...movementForm, tipo_movimiento_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimiento.map((tipo) => (
                      <SelectItem key={tipo.tipo_movimiento_id} value={tipo.tipo_movimiento_id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proveedor *</label>
                <Select
                  value={movementForm.prove_id ? movementForm.prove_id.toString() : ""}
                  onValueChange={(value) => setMovementForm({...movementForm, prove_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor.prove_id} value={proveedor.prove_id.toString()}>
                        {proveedor.prove_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nota</label>
                <Input
                  placeholder="Nota descriptiva"
                  value={movementForm.nota}
                  onChange={(e) => setMovementForm({...movementForm, nota: e.target.value})}
                />
              </div>
            </div>

            {/* Buscador de ingredientes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar ingredientes</label>
              <div className="relative">
                <Input
                  placeholder="Escriba para buscar ingredientes..."
                  value={searchIngredient}
                  onChange={(e) => {
                    setSearchIngredient(e.target.value);
                    setShowIngredientDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowIngredientDropdown(searchIngredient.length > 0)}
                />
                {showIngredientDropdown && filteredIngredients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredIngredients.slice(0, 10).map((ingrediente) => (
                      <div
                        key={ingrediente.ingrediente_id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => addIngredientToMovement(ingrediente)}
                      >
                        <div className="font-medium">{ingrediente.nombre}</div>
                        <div className="text-sm text-gray-500">
                          Stock actual: {ingrediente.stock_actual} {ingrediente.unidad} • ${ingrediente.costo_unitario}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lista de ingredientes seleccionados */}
            {selectedIngredients.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredientes seleccionados</label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedIngredients.map((detail) => (
                        <TableRow key={detail.ingrediente_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{detail.ingrediente?.nombre}</div>
                              <div className="text-sm text-gray-500">{detail.ingrediente?.unidad}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={detail.cantidad}
                              onChange={(e) => updateIngredientQuantity(detail.ingrediente_id, parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={detail.precio_unitario || 0}
                              onChange={(e) => updateIngredientPrice(detail.ingrediente_id, parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${((detail.precio_unitario || 0) * detail.cantidad).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeIngredientFromMovement(detail.ingrediente_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-3 bg-gray-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">
                        ${selectedIngredients.reduce((total, detail) => total + ((detail.precio_unitario || 0) * detail.cantidad), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMovement}>
              Registrar Movimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar movimiento */}
      <Dialog open={isEditMovementOpen} onOpenChange={(open) => {
        setIsEditMovementOpen(open);
        if (!open) clearMovementForm();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar movimiento de inventario</DialogTitle>
            <DialogDescription>
              Modifique los datos del movimiento
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Información general del movimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de movimiento *</label>
                <Select
                  value={movementForm.tipo_movimiento_id ? movementForm.tipo_movimiento_id.toString() : ""}
                  onValueChange={(value) => setMovementForm({...movementForm, tipo_movimiento_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimiento.map((tipo) => (
                      <SelectItem key={tipo.tipo_movimiento_id} value={tipo.tipo_movimiento_id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proveedor *</label>
                <Select
                  value={movementForm.prove_id ? movementForm.prove_id.toString() : ""}
                  onValueChange={(value) => setMovementForm({...movementForm, prove_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor.prove_id} value={proveedor.prove_id.toString()}>
                        {proveedor.prove_nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nota</label>
                <Input
                  placeholder="Nota descriptiva"
                  value={movementForm.nota}
                  onChange={(e) => setMovementForm({...movementForm, nota: e.target.value})}
                />
              </div>
            </div>

            {/* Buscador de ingredientes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar más ingredientes</label>
              <div className="relative">
                <Input
                  placeholder="Escriba para buscar ingredientes..."
                  value={searchIngredient}
                  onChange={(e) => {
                    setSearchIngredient(e.target.value);
                    setShowIngredientDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowIngredientDropdown(searchIngredient.length > 0)}
                />
                {showIngredientDropdown && filteredIngredients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredIngredients.slice(0, 10).map((ingrediente) => (
                      <div
                        key={ingrediente.ingrediente_id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => addIngredientToMovement(ingrediente)}
                      >
                        <div className="font-medium">{ingrediente.nombre}</div>
                        <div className="text-sm text-gray-500">
                          Stock actual: {ingrediente.stock_actual} {ingrediente.unidad} • ${ingrediente.costo_unitario}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lista de ingredientes seleccionados */}
            {selectedIngredients.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredientes en el movimiento</label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedIngredients.map((detail) => (
                        <TableRow key={detail.ingrediente_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{detail.ingrediente?.nombre}</div>
                              <div className="text-sm text-gray-500">{detail.ingrediente?.unidad}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={detail.cantidad}
                              onChange={(e) => updateIngredientQuantity(detail.ingrediente_id, parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={detail.precio_unitario || 0}
                              onChange={(e) => updateIngredientPrice(detail.ingrediente_id, parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${((detail.precio_unitario || 0) * detail.cantidad).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeIngredientFromMovement(detail.ingrediente_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-3 bg-gray-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg">
                        ${selectedIngredients.reduce((total, detail) => total + ((detail.precio_unitario || 0) * detail.cantidad), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMovementOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateMovement}>
              Actualizar Movimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}