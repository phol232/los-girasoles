import { useState, useEffect, useRef } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Image,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { 
  productService, 
  ingredientService, 
  estacionCocinaService, 
  categoriaPlatilloService,
  formDataService,
  type Platillo, 
  type Ingrediente,
  type EstacionCocina,
  type CategoriaPlatillo
} from "@/services/api";

export function Productos() {
  const [products, setProducts] = useState<Platillo[]>([]);
  const [ingredients, setIngredients] = useState<Ingrediente[]>([]);
  const [estaciones, setEstaciones] = useState<EstacionCocina[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPlatillo[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Platillo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_venta: "",
    plat_imagen: null as File | null,
    estacion_id: "",
    categoria_id: "",
    ingredientes: [] as { ingrediente_id: number; cantidad: number; unidad: string; }[]
  });

  // Estados para ingredientes temporales
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");
  
  // New states for ingredient search dropdown
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [isIngredientDropdownOpen, setIsIngredientDropdownOpen] = useState(false);
  const [highlightedIngredient, setHighlightedIngredient] = useState(-1);
  const ingredientDropdownRef = useRef<HTMLDivElement>(null);
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  // Estado para el producto seleccionado (para ver detalles)
  const [selectedProduct, setSelectedProduct] = useState<Platillo | null>(null);

  // Add state for image loading errors
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ingredientsData, formData] = await Promise.all([
        productService.getAll(),
        ingredientService.getAll(),
        formDataService.getFormData()
      ]);
      setProducts(productsData);
      setIngredients(ingredientsData);
      setEstaciones(formData.estaciones);
      setCategorias(formData.categorias);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio_venta: "",
      plat_imagen: null,
      estacion_id: "",
      categoria_id: "",
      ingredientes: []
    });
    setSelectedIngredient("");
    setIngredientSearch("");
    setIngredientAmount("");
    setIngredientUnit("");
    // Reset dropdown state
    setIsIngredientDropdownOpen(false);
    setHighlightedIngredient(-1);
  };

  const openEditProduct = (product: Platillo) => {
    setEditingProduct(product);
    
    // Buscar la estación por nombre
    const estacion = estaciones.find(e => e.nombre === product.estacion_cocina);
    const categoria = categorias.find(c => c.nombre === product.categoria_platillo);
    
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio_venta: product.precio_venta.toString(),
      plat_imagen: null,
      estacion_id: estacion?.estacion_id.toString() || "",
      categoria_id: categoria?.categoria_id.toString() || "",
      ingredientes: product.ingredientes?.map(ing => {
        const ingredient = ingredients.find(i => i.nombre === ing.ingrediente);
        return {
          ingrediente_id: ingredient?.ingrediente_id || 0,
          cantidad: ing.cantidad,
          unidad: ing.unidad
        };
      }) || []
    });
    setIsEditProductOpen(true);
  };

  // Filter ingredients based on search
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.nombre.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  // Handle ingredient selection
  const selectIngredient = (ingredient: Ingrediente) => {
    setSelectedIngredient(ingredient.ingrediente_id.toString());
    setIngredientSearch(ingredient.nombre);
    setIsIngredientDropdownOpen(false);
    setHighlightedIngredient(-1);
  };

  // Handle keyboard navigation for ingredient dropdown
  const handleIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (!isIngredientDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        // Only open if there's text to search or show filtered results
        if (ingredientSearch.trim() || filteredIngredients.length > 0) {
          setIsIngredientDropdownOpen(true);
          setHighlightedIngredient(0);
        }
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIngredient(prev => 
          prev < filteredIngredients.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIngredient(prev => prev > 0 ? prev - 1 : prev);
        e.preventDefault();
        break;
      case 'Enter':
        if (highlightedIngredient >= 0 && filteredIngredients[highlightedIngredient]) {
          selectIngredient(filteredIngredients[highlightedIngredient]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsIngredientDropdownOpen(false);
        setHighlightedIngredient(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ingredientDropdownRef.current && !ingredientDropdownRef.current.contains(event.target as Node)) {
        setIsIngredientDropdownOpen(false);
        setHighlightedIngredient(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredientToList = () => {
    if (!selectedIngredient || !ingredientAmount || !ingredientUnit) return;

    const ingredient = ingredients.find(i => i.ingrediente_id.toString() === selectedIngredient);
    if (!ingredient) return;

    const newIngredient = {
      ingrediente_id: ingredient.ingrediente_id,
      cantidad: parseFloat(ingredientAmount),
      unidad: ingredientUnit
    };

    setFormData(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, newIngredient]
    }));

    // Reset ingredient search states
    setSelectedIngredient("");
    setIngredientSearch("");
    setIngredientAmount("");
    setIngredientUnit("");
    // Close dropdown after adding
    setIsIngredientDropdownOpen(false);
    setHighlightedIngredient(-1);
  };

  const handleSubmit = async (isEdit: boolean = false) => {
    try {
      if (!formData.nombre || !formData.precio_venta || formData.ingredientes.length === 0) {
        alert('Por favor complete todos los campos obligatorios');
        return;
      }

      const submitData = new FormData();
      submitData.append('nombre', formData.nombre);
      submitData.append('descripcion', formData.descripcion);
      submitData.append('precio_venta', formData.precio_venta);
      if (formData.plat_imagen) {
        submitData.append('plat_imagen', formData.plat_imagen);
      }
      if (formData.estacion_id) {
        submitData.append('estacion_id', formData.estacion_id);
      }
      if (formData.categoria_id) {
        submitData.append('categoria_id', formData.categoria_id);
      }
      submitData.append('ingredientes', JSON.stringify(formData.ingredientes));

      if (isEdit && editingProduct) {
        await productService.update(editingProduct.platillo_id, submitData);
        setIsEditProductOpen(false);
        setEditingProduct(null);
      } else {
        await productService.create(submitData);
        setIsAddProductOpen(false);
      }

      clearForm();
      await loadData();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;

    try {
      await productService.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar el producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIngredientName = (ingredienteId: number) => {
    const ingredient = ingredients.find(i => i.ingrediente_id === ingredienteId);
    return ingredient ? ingredient.nombre : 'Ingrediente desconocido';
  };

  // Función para formatear precio en soles
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'S/ 0.00' : `S/ ${numPrice.toFixed(2)}`;
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  // Remove ingredient from the list by index
  const removeIngredientFromList = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platillos</h1>
          <p className="text-gray-500">
            Gestión del menú y catálogo de platillos
          </p>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={(open) => {
          setIsAddProductOpen(open);
          if (!open) clearForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Platillo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Añadir nuevo platillo</DialogTitle>
              <DialogDescription>
                Complete todos los campos para agregar un nuevo platillo al menú.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre del platillo *
                  </label>
                  <Input
                    id="name"
                    placeholder="Nombre del platillo"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Precio de venta (S/) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.precio_venta}
                      onChange={(e) => setFormData(prev => ({ ...prev, precio_venta: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  id="description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Descripción del platillo"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="estacion" className="text-sm font-medium">
                    Estación de cocina
                  </label>
                  <Select value={formData.estacion_id} onValueChange={(value) => setFormData(prev => ({ ...prev, estacion_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estación" />
                    </SelectTrigger>
                    <SelectContent>
                      {estaciones.map((estacion) => (
                        <SelectItem key={estacion.estacion_id} value={estacion.estacion_id.toString()}>
                          {estacion.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="categoria" className="text-sm font-medium">
                    Categoría del platillo
                  </label>
                  <Select value={formData.categoria_id} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Imagen del platillo</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData(prev => ({ ...prev, plat_imagen: file }));
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Seleccionar imagen
                  </label>
                  {formData.plat_imagen && (
                    <span className="text-sm text-gray-600">{formData.plat_imagen.name}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Ingredientes *</label>
                
                <div className="grid gap-4 md:grid-cols-4">
                  {/* Custom Ingredient Search Dropdown */}
                  <div className="relative" ref={ingredientDropdownRef}>
                    <div className="relative">
                      <Input
                        ref={ingredientInputRef}
                        type="text"
                        placeholder="Buscar ingrediente..."
                        value={ingredientSearch}
                        onChange={(e) => {
                          setIngredientSearch(e.target.value);
                          // Only open dropdown if there's text or if we want to show filtered results
                          if (e.target.value.trim()) {
                            setIsIngredientDropdownOpen(true);
                          } else {
                            setIsIngredientDropdownOpen(false);
                          }
                          setSelectedIngredient("");
                        }}
                        onFocus={() => {
                          // Only open on focus if there's text to search
                          if (ingredientSearch.trim()) {
                            setIsIngredientDropdownOpen(true);
                          }
                        }}
                        onKeyDown={handleIngredientKeyDown}
                        className="pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // Only toggle if there's text or filtered ingredients
                          if (ingredientSearch.trim() || filteredIngredients.length > 0) {
                            setIsIngredientDropdownOpen(!isIngredientDropdownOpen);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isIngredientDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {/* Dropdown Menu */}
                    {isIngredientDropdownOpen && ingredientSearch.trim() && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredIngredients.length > 0 ? (
                          filteredIngredients.map((ingredient, index) => (
                            <button
                              key={ingredient.ingrediente_id}
                              type="button"
                              onClick={() => selectIngredient(ingredient)}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                                index === highlightedIngredient ? 'bg-blue-50 text-blue-700' : ''
                              } ${
                                selectedIngredient === ingredient.ingrediente_id.toString() ? 'bg-blue-100 text-blue-700' : ''
                              }`}
                            >
                              <span>{ingredient.nombre}</span>
                              {selectedIngredient === ingredient.ingrediente_id.toString() && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No se encontraron ingredientes
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Cantidad"
                    value={ingredientAmount}
                    onChange={(e) => setIngredientAmount(e.target.value)}
                  />
                  
                  <Input
                    placeholder="Unidad (ej: gr, ml, pz)"
                    value={ingredientUnit}
                    onChange={(e) => setIngredientUnit(e.target.value)}
                  />
                  
                  <Button
                    type="button"
                    onClick={addIngredientToList}
                    disabled={!selectedIngredient || !ingredientAmount || !ingredientUnit}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                {formData.ingredientes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Ingredientes agregados:</h4>
                    <div className="space-y-2">
                      {formData.ingredientes.map((ing, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">
                            {getIngredientName(ing.ingrediente_id)} - {ing.cantidad} {ing.unidad}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeIngredientFromList(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => handleSubmit(false)}>
                Guardar platillo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Edición */}
      <Dialog open={isEditProductOpen} onOpenChange={(open) => {
        setIsEditProductOpen(open);
        if (!open) {
          setEditingProduct(null);
          clearForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar platillo</DialogTitle>
            <DialogDescription>
              Modifique los datos del platillo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nombre del platillo *
                </label>
                <Input
                  id="edit-name"
                  placeholder="Nombre del platillo"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-price" className="text-sm font-medium">
                  Precio de venta (S/) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.precio_venta}
                    onChange={(e) => setFormData(prev => ({ ...prev, precio_venta: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="edit-description"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                placeholder="Descripción del platillo"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="edit-estacion" className="text-sm font-medium">
                  Estación de cocina
                </label>
                <Select value={formData.estacion_id} onValueChange={(value) => setFormData(prev => ({ ...prev, estacion_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estación" />
                  </SelectTrigger>
                  <SelectContent>
                    {estaciones.map((estacion) => (
                      <SelectItem key={estacion.estacion_id} value={estacion.estacion_id.toString()}>
                        {estacion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-categoria" className="text-sm font-medium">
                  Categoría del platillo
                </label>
                <Select value={formData.categoria_id} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}>
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen del platillo</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/svg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData(prev => ({ ...prev, plat_imagen: file }));
                  }}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label
                  htmlFor="edit-image-upload"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Cambiar imagen
                </label>
                {formData.plat_imagen && (
                  <span className="text-sm text-gray-600">{formData.plat_imagen.name}</span>
                )}
                {editingProduct?.plat_imagen_url && !formData.plat_imagen && (
                  <img
                    src={editingProduct.plat_imagen_url}
                    alt="Imagen actual"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Ingredientes *</label>
              
              <div className="grid gap-4 md:grid-cols-4">
                {/* Custom Ingredient Search Dropdown for Edit Modal */}
                <div className="relative" ref={ingredientDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar ingrediente..."
                      value={ingredientSearch}
                      onChange={(e) => {
                        setIngredientSearch(e.target.value);
                        // Only open dropdown if there's text or if we want to show filtered results
                        if (e.target.value.trim()) {
                          setIsIngredientDropdownOpen(true);
                        } else {
                          setIsIngredientDropdownOpen(false);
                        }
                        setSelectedIngredient("");
                      }}
                      onFocus={() => {
                        // Only open on focus if there's text to search
                        if (ingredientSearch.trim()) {
                          setIsIngredientDropdownOpen(true);
                        }
                      }}
                      onKeyDown={handleIngredientKeyDown}
                      className="pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Only toggle if there's text or filtered ingredients
                        if (ingredientSearch.trim() || filteredIngredients.length > 0) {
                          setIsIngredientDropdownOpen(!isIngredientDropdownOpen);
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isIngredientDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {isIngredientDropdownOpen && ingredientSearch.trim() && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ingredient, index) => (
                          <button
                            key={ingredient.ingrediente_id}
                            type="button"
                            onClick={() => selectIngredient(ingredient)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                              index === highlightedIngredient ? 'bg-blue-50 text-blue-700' : ''
                            } ${
                              selectedIngredient === ingredient.ingrediente_id.toString() ? 'bg-blue-100 text-blue-700' : ''
                            }`}
                          >
                            <span>{ingredient.nombre}</span>
                            {selectedIngredient === ingredient.ingrediente_id.toString() && (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No se encontraron ingredientes
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cantidad"
                  value={ingredientAmount}
                  onChange={(e) => setIngredientAmount(e.target.value)}
                />
                
                <Input
                  placeholder="Unidad (ej: gr, ml, pz)"
                  value={ingredientUnit}
                  onChange={(e) => setIngredientUnit(e.target.value)}
                />
                
                <Button
                  type="button"
                  onClick={addIngredientToList}
                  disabled={!selectedIngredient || !ingredientAmount || !ingredientUnit}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>

              {formData.ingredientes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Ingredientes agregados:</h4>
                  <div className="space-y-2">
                    {formData.ingredientes.map((ing, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">
                          {getIngredientName(ing.ingrediente_id)} - {ing.cantidad} {ing.unidad}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeIngredientFromList(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(true)}>
              Actualizar platillo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalles */}
      {selectedProduct && (
        <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Platillo</DialogTitle>
              <DialogDescription>
                Información detallada sobre el platillo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img 
                    src={selectedProduct.plat_imagen_url || '/placeholder-food.jpg'} 
                    alt={selectedProduct.nombre}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwNS41MjMgMTIwIDExMCAxMTUuNTIzIDExMCAxMTBDMTEwIDEwNC40NzcgMTA1LjUyMyAxMDAgMTAwIDEwMEM5NC40NzcgMTAwIDkwIDEwNC40NzcgOTAgMTEwQzkwIDExNS41MjMgOTQuNDc3IDEyMCAxMDAgMTIwWiIgZmlsbD0iIzkzOTNBMyIvPgo8cGF0aCBkPSJNMTcwIDkwSDMwQzI3LjIzODYgOTAgMjUgOTIuMjM4NiAyNSA5NVYxNzVDMjUgMTc3Ljc2MSAyNy4yMzg2IDE4MCAzMCAxODBIMTcwQzE3Mi43NjEgMTgwIDE3NSAxNzcuNzYxIDE3NSAxNzVWOTVDMTc1IDkyLjIzODYgMTcyLjc2MSA5MCAxNzAgOTBaIiBzdHJva2U9IiM5MzkzQTMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-gray-700">Nombre:</label>
                    <p>{selectedProduct.nombre}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Descripción:</label>
                    <p>{selectedProduct.descripcion || 'Sin descripción'}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Precio:</label>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(selectedProduct.precio_venta)}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Categoría:</label>
                    <p>{selectedProduct.categoria_platillo || 'Sin categoría'}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Estación:</label>
                    <p>{selectedProduct.estacion_cocina || 'Sin estación'}</p>
                  </div>
                </div>
              </div>
              
              {/* Ingredientes si existen */}
              {selectedProduct.ingredientes && selectedProduct.ingredientes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Ingredientes:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedProduct.ingredientes.map((ingrediente, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded text-sm">
                        {ingrediente.ingrediente} - {ingrediente.cantidad}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar platillos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.platillo_id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Imagen del producto - altura muy reducida */}
            <div className="w-full h-32 bg-gray-100 rounded-t-lg overflow-hidden">
              {product.plat_imagen_url && !imageErrors.has(product.platillo_id) ? (
                <img
                  src={product.plat_imagen_url}
                  alt={product.nombre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  onError={() => handleImageError(product.platillo_id)}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white">
                  <Image className="h-8 w-8 mb-1" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>
            
            {/* Contenido más compacto */}
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {product.nombre}
              </h3>
              
              {product.descripcion && (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {product.descripcion}
                </p>
              )}
              
              {/* Categoría como badge pequeño */}
              {product.categoria_platillo && (
                <Badge variant="secondary" className="text-xs">
                  {product.categoria_platillo}
                </Badge>
              )}
              
              {/* Precio y botones */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold text-green-600">
                  {formatPrice(product.precio_venta)}
                </span>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedProduct(product)}
                    className="h-7 px-2 text-xs"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditProduct(product)}
                    className="h-7 px-2 text-xs"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.platillo_id)}
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
          <Image className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium">No hay platillos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron platillos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </div>
  );
}
