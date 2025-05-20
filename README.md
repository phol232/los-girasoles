# 🌻 LOS GIRASOLES - Sistema de Gestión de Restaurante

Sistema completo para la gestión de un restaurante, desarrollado con React + Vite + TypeScript + shadcn/ui. Esta aplicación frontend permite la administración del negocio desde diferentes roles: administrador, mesero y cocina.

## ✨ Funcionalidades principales

- **Autenticación y roles de usuario**: Inicio de sesión simulado para 3 roles diferentes.
- **Dashboard analítico**: Visualización de KPIs, gráficos y estadísticas.
- **Gestión de inventario**: Control de stock, alertas y movimientos.
- **Menú y productos**: Catálogo, precios, ingredientes y categorías.
- **Punto de venta (POS)**: Interfaz para meseros, selección de productos y mesas.
- **Panel de cocina**: Visualización y gestión de órdenes pendientes.
- **Facturas y pagos**: Procesamiento de diferentes métodos de pago.

## 🚀 Instalación y uso

### Requisitos previos
- Node.js 16+
- Bun o npm o pnpm

### Configuración

1. Clona este repositorio
```bash
git clone https://github.com/tuusuario/los-girasoles.git
cd los-girasoles
```

2. Instala las dependencias
```bash
# Usando bun (recomendado)
bun install

# O usando npm
npm install

# O usando pnpm
pnpm install
```

3. Inicia el servidor de desarrollo
```bash
# Usando bun
bun dev

# O usando npm
npm run dev

# O usando pnpm
pnpm dev
```

4. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 📱 Acceso y navegación

### Acceso rápido (demo)
- Puedes acceder con tres roles diferentes desde la página de login:
  - **Administrador**: Acceso completo a todas las funcionalidades
  - **Mesero**: Enfocado en el POS y gestión de órdenes
  - **Cocina**: Panel de cocina con órdenes pendientes

### Rutas principales
- `/`: Dashboard principal
- `/login`: Página de acceso
- `/inventario`: Gestión de inventario
- `/productos`: Catálogo de productos y menú
- `/pos`: Punto de venta para meseros
- `/cocina`: Panel para personal de cocina
- `/ordenes`: Gestión de órdenes
- `/clientes`: Base de datos de clientes
- `/facturas`: Gestión de facturas y pagos
- `/configuracion`: Ajustes del sistema

## 🔍 Características técnicas

- **Frontend**: React + Vite + TypeScript
- **Componentes UI**: shadcn/ui (basado en TailwindCSS)
- **Enrutamiento**: React Router v7
- **Gráficos**: Recharts
- **Tablas**: TanStack Table
- **Estado**: Context API + Hooks + Zustand
- **Estilos**: TailwindCSS
- **Estructura**: Modular y escalable

## 📋 Notas

- Esta es una aplicación frontend demo. En una implementación real se conectaría a un backend con Node.js + Express/Nest.js y una base de datos PostgreSQL/MySQL.
- Los datos mostrados son de ejemplo y se resetean al recargar la página.
- Para una implementación completa, se recomienda integrar:
  - API RESTful para la comunicación frontend-backend
  - Autenticación JWT
  - Base de datos relacional
  - Manejo de imágenes
  - Pasarelas de pago

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles

---

Desarrollado por PHOL TAQUIRI para Los Girasoles Restaurante © 2025
