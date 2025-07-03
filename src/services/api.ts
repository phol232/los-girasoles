// URL base de la API Laravel
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Función para obtener el token de autenticación del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para realizar peticiones HTTP con autenticación
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    console.log('Error response:', response.status, errorData);

    // Manejar errores de validación de Laravel
    if (response.status === 422 && errorData.errors) {
      const validationErrors = errorData.errors;
      console.log('Validation errors:', validationErrors);

      let errorMessage = '';

      // Errores específicos de proveedores
      if (validationErrors.prove_ruc) {
        errorMessage = Array.isArray(validationErrors.prove_ruc) 
          ? validationErrors.prove_ruc[0] 
          : validationErrors.prove_ruc;
      } else if (validationErrors.prove_email) {
        errorMessage = Array.isArray(validationErrors.prove_email) 
          ? validationErrors.prove_email[0] 
          : validationErrors.prove_email;
      }
      // Errores específicos de movimientos
      else if (validationErrors.tipo_movimiento_id) {
        errorMessage = Array.isArray(validationErrors.tipo_movimiento_id) 
          ? validationErrors.tipo_movimiento_id[0] 
          : validationErrors.tipo_movimiento_id;
      } else if (validationErrors.detalles) {
        errorMessage = Array.isArray(validationErrors.detalles) 
          ? validationErrors.detalles[0] 
          : validationErrors.detalles;
      } else if (validationErrors['detalles.0.ingrediente_id']) {
        errorMessage = 'Error en los ingredientes del movimiento';
      } else if (validationErrors['detalles.0.cantidad']) {
        errorMessage = 'Error en las cantidades del movimiento';
      } else {
        // Tomar el primer error disponible
        const firstError = Object.values(validationErrors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }

      throw new Error(errorMessage);
    }

    // Manejar errores específicos de procedimientos almacenados (código 422 con message directo)
    if (response.status === 422 && errorData.message && !errorData.errors) {
      console.log('Database procedure error:', errorData.message);
      throw new Error(errorData.message);
    }

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Servicios para Empleados
export const employeeService = {
  // Obtener todos los empleados
  getAll: () => apiRequest('/empleados'),

  // Obtener un empleado por ID
  getById: (id: number) => apiRequest(`/empleados/${id}`),

  // Crear un nuevo empleado
  create: (employeeData: any) => apiRequest('/empleados', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }),

  // Actualizar un empleado
  update: (id: number, employeeData: any) => apiRequest(`/empleados/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  }),

  // Eliminar un empleado
  delete: (id: number) => apiRequest(`/empleados/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Mesas
export const tableService = {
  // Obtener todas las mesas
  getAll: () => apiRequest('/mesas'),

  // Obtener una mesa por ID
  getById: (id: number) => apiRequest(`/mesas/${id}`),

  // Crear una nueva mesa
  create: (tableData: any) => apiRequest('/mesas', {
    method: 'POST',
    body: JSON.stringify(tableData),
  }),

  // Actualizar una mesa
  update: (id: number, tableData: any) => apiRequest(`/mesas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tableData),
  }),

  // Eliminar una mesa
  delete: (id: number) => apiRequest(`/mesas/${id}`, {
    method: 'DELETE',
  }),
};

// Tipos para las entidades
export interface Employee {
  empleado_id: number;
  rol_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
  fecha_ingreso: string;
  created_at: string;
  updated_at: string;
}

export interface Table {
  mesa_id: number;
  nombre: string;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  rol_id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
}

export interface UpdateEmployeeRequest {
  rol_id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  telefono?: string;
  estado?: 'activo' | 'inactivo';
}

export interface CreateTableRequest {
  nombre: string;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
}

export interface UpdateTableRequest {
  nombre?: string;
  capacidad?: number;
  estado?: 'libre' | 'ocupada' | 'reservada';
}

// Servicios para Categorías de Ingredientes
export const categoryIngredientService = {
  // Obtener todas las categorías
  getAll: () => apiRequest('/categorias-ingredientes'),

  // Obtener una categoría por ID
  getById: (id: number) => apiRequest(`/categorias-ingredientes/${id}`),

  // Crear una nueva categoría
  create: (categoryData: any) => apiRequest('/categorias-ingredientes', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),

  // Actualizar una categoría
  update: (id: number, categoryData: any) => apiRequest(`/categorias-ingredientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),

  // Eliminar una categoría
  delete: (id: number) => apiRequest(`/categorias-ingredientes/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Ingredientes
export const ingredientService = {
  // Obtener todos los ingredientes
  getAll: () => apiRequest('/ingredientes'),

  // Obtener un ingrediente por ID
  getById: (id: number) => apiRequest(`/ingredientes/${id}`),

  // Crear un nuevo ingrediente
  create: (ingredientData: any) => apiRequest('/ingredientes', {
    method: 'POST',
    body: JSON.stringify(ingredientData),
  }),

  // Actualizar un ingrediente
  update: (id: number, ingredientData: any) => apiRequest(`/ingredientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ingredientData),
  }),

  // Eliminar un ingrediente
  delete: (id: number) => apiRequest(`/ingredientes/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Proveedores
export const supplierService = {
  // Obtener todos los proveedores
  getAll: () => apiRequest('/proveedores'),

  // Obtener un proveedor por ID
  getById: (id: number) => apiRequest(`/proveedores/${id}`),

  // Crear un nuevo proveedor
  create: (supplierData: any) => apiRequest('/proveedores', {
    method: 'POST',
    body: JSON.stringify(supplierData),
  }),

  // Actualizar un proveedor
  update: (id: number, supplierData: any) => {
    console.log('Enviando PUT a:', `/proveedores/${id}`);
    console.log('Datos a enviar:', supplierData);
    return apiRequest(`/proveedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  },

  // Eliminar un proveedor
  delete: (id: number) => apiRequest(`/proveedores/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Tipos de Movimiento
export const movementTypeService = {
  // Obtener todos los tipos de movimiento
  getAll: () => apiRequest('/tipos-movimiento'),

  // Obtener un tipo de movimiento por ID
  getById: (id: number) => apiRequest(`/tipos-movimiento/${id}`),

  // Crear un nuevo tipo de movimiento
  create: (typeData: any) => apiRequest('/tipos-movimiento', {
    method: 'POST',
    body: JSON.stringify(typeData),
  }),

  // Actualizar un tipo de movimiento
  update: (id: number, typeData: any) => apiRequest(`/tipos-movimiento/${id}`, {
    method: 'PUT',
    body: JSON.stringify(typeData),
  }),

  // Eliminar un tipo de movimiento
  delete: (id: number) => apiRequest(`/tipos-movimiento/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Movimientos
export const movementService = {
  // Obtener todos los movimientos
  getAll: () => apiRequest('/movimientos'),

  // Obtener un movimiento por ID
  getById: (id: number) => apiRequest(`/movimientos/${id}`),

  // Crear un nuevo movimiento
  create: (movementData: any) => {
    console.log('Creando movimiento:', movementData);
    return apiRequest('/movimientos', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  },

  // Actualizar un movimiento
  update: (id: number, movementData: any) => {
    console.log('Actualizando movimiento:', id, movementData);
    return apiRequest(`/movimientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movementData),
    });
  },

  // Eliminar un movimiento
  delete: (id: number) => apiRequest(`/movimientos/${id}`, {
    method: 'DELETE',
  }),
};

// Interfaces para ingredientes y categorías
export interface CategoriaIngrediente {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
}

export interface Ingrediente {
  ingrediente_id: number;
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  costo_unitario: number;
  unidad: string;
  stock_actual: number;
  stock_minimo: number;
  estado: 'disponible' | 'agotado' | 'descontinuado';
  categoria?: CategoriaIngrediente;
}

// Interfaces para proveedores y movimientos
export interface Proveedor {
  prove_id: number;
  prove_ruc: string;
  prove_nombre: string;
  prove_email: string;
  prove_telefono?: string;
  prove_direccion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Movimiento {
  movimiento_id: number;
  empleado_id?: number;
  tipo_movimiento_id?: number;
  prove_id?: number;
  fecha?: string;
  nota?: string;
  tipo_movimiento?: string;
  proveedor?: string;
  empleado?: string;
  detalles?: MovimientoDetalle[];
  created_at?: string;
  updated_at?: string;
}

export interface MovimientoDetalle {
  ingrediente: string;
  cantidad: number;
  precio_unitario?: number;
}

export interface DetalleMovimiento {
  detalle_id?: number;
  movimiento_id?: number;
  ingrediente_id: number;
  cantidad: number;
  precio_unitario?: number;
  ingrediente?: Ingrediente;
}

export interface CreateMovementRequest {
  tipo_movimiento_id: number;
  prove_id?: number;
  nota?: string;
  detalles: {
    ingrediente_id: number;
    cantidad: number;
    precio_unitario?: number;
  }[];
}

export interface UpdateMovementRequest {
  tipo_movimiento_id?: number;
  prove_id?: number;
  nota?: string;
  detalles?: {
    ingrediente_id: number;
    cantidad: number;
    precio_unitario?: number;
  }[];
}

export interface TipoMovimiento {
  tipo_movimiento_id: number;
  nombre: string;
  descripcion?: string;
}

export interface CreateSupplierRequest {
  prove_ruc: string;
  prove_nombre: string;
  prove_email: string;
  prove_telefono?: string;
  prove_direccion?: string;
}

export interface UpdateSupplierRequest {
  prove_ruc?: string;
  prove_nombre?: string;
  prove_email?: string;
  prove_telefono?: string;
  prove_direccion?: string;
}

// Servicios para Platillos/Productos
export const productService = {
  // Obtener todos los platillos
  getAll: () => apiRequest('/platillos'),

  // Obtener un platillo por ID
  getById: (id: number) => apiRequest(`/platillos/${id}`),

  // Crear un nuevo platillo
  create: (productData: FormData) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/platillos`, {
      method: 'POST',
      headers,
      body: productData,
    }).then(async response => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  // Actualizar un platillo
  update: (id: number, productData: FormData) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/platillos/${id}`, {
      method: 'POST', // Laravel usa POST con _method=PUT para archivos
      headers,
      body: (() => {
        productData.append('_method', 'PUT');
        return productData;
      })(),
    }).then(async response => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  // Eliminar un platillo
  delete: (id: number) => apiRequest(`/platillos/${id}`, {
    method: 'DELETE',
  }),
};

// Servicio centralizado para datos de formulario
export const formDataService = {
  // Obtener datos de formulario (estaciones y categorías)
  getFormData: () => apiRequest('/form-data'),
};

// Servicios para Estaciones de Cocina
export const estacionCocinaService = {
  // Obtener todas las estaciones de cocina desde form-data
  getAll: async () => {
    const data = await formDataService.getFormData();
    return data.estaciones;
  },

  // Obtener una estación de cocina por ID
  getById: (id: number) => apiRequest(`/estaciones-cocina/${id}`),

  // Crear una nueva estación de cocina
  create: (estacionData: any) => apiRequest('/estaciones-cocina', {
    method: 'POST',
    body: JSON.stringify(estacionData),
  }),

  // Actualizar una estación de cocina
  update: (id: number, estacionData: any) => apiRequest(`/estaciones-cocina/${id}`, {
    method: 'PUT',
    body: JSON.stringify(estacionData),
  }),

  // Eliminar una estación de cocina
  delete: (id: number) => apiRequest(`/estaciones-cocina/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para Categorías de Platillos
export const categoriaPlatilloService = {
  // Obtener todas las categorías de platillos desde form-data
  getAll: async () => {
    const data = await formDataService.getFormData();
    return data.categorias;
  },

  // Obtener una categoría de platillo por ID
  getById: (id: number) => apiRequest(`/categorias-platillos/${id}`),

  // Crear una nueva categoría de platillo
  create: (categoriaData: any) => apiRequest('/categorias-platillos', {
    method: 'POST',
    body: JSON.stringify(categoriaData),
  }),

  // Actualizar una categoría de platillo
  update: (id: number, categoriaData: any) => apiRequest(`/categorias-platillos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoriaData),
  }),

  // Eliminar una categoría de platillo
  delete: (id: number) => apiRequest(`/categorias-platillos/${id}`, {
    method: 'DELETE',
  }),
};

// Interfaces para productos
export interface Platillo {
  platillo_id: number;
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  plat_imagen?: string;
  plat_imagen_url?: string;
  estacion_cocina?: string;
  categoria_platillo?: string;
  ingredientes?: PlatilloIngrediente[];
  created_at?: string;
  updated_at?: string;
}

export interface PlatilloIngrediente {
  ingrediente: string;
  cantidad: number;
  unidad: string;
}

export interface CreateProductRequest {
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  plat_imagen?: File;
  estacion_id?: number;
  ingredientes: {
    ingrediente_id: number;
    cantidad: number;
    unidad: string;
  }[];
}

export interface UpdateProductRequest {
  nombre?: string;
  descripcion?: string;
  precio_venta?: number;
  plat_imagen?: File;
  estacion_id?: number;
  categoria_id?: number;
  ingredientes?: {
    ingrediente_id: number;
    cantidad: number;
    unidad: string;
  }[];
}

// Interfaces para estaciones de cocina
export interface EstacionCocina {
  estacion_id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

// Interfaces para categorías de platillos
export interface CategoriaPlatillo {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

// Servicios para Clientes
export const clientService = {
  // Obtener todos los clientes
  getAll: () => apiRequest('/clientes'),

  // Obtener un cliente por ID
  getById: (id: number) => apiRequest(`/clientes/${id}`),

  // Crear un nuevo cliente
  create: (clientData: CreateClientRequest) => apiRequest('/clientes', {
    method: 'POST',
    body: JSON.stringify(clientData),
  }),

  // Actualizar un cliente
  update: (id: number, clientData: UpdateClientRequest) => apiRequest(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  }),

  // Eliminar un cliente
  delete: (id: number) => apiRequest(`/clientes/${id}`, {
    method: 'DELETE',
  }),
};

// Interfaces para clientes
export interface Cliente {
  cliente_id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface UpdateClientRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}