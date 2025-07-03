import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings as SettingsIcon,
  Users,
  Store,
  CreditCard,
  Receipt,
  Mail,
  Printer,
  Bell,
  FileText,
  Smartphone,
  Lock,
  Save,
  Plus,
  Trash2,
  Database,
  RefreshCw,
  Cloud,
  HelpCircle,
} from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-gray-500">
          Administre la configuración de su restaurante
        </p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="receipts">Comprobantes</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="backup">Respaldos</TabsTrigger>
        </TabsList>

        {/* Pestaña: Configuración General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Restaurante</CardTitle>
              <CardDescription>
                Detalles básicos sobre su establecimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Restaurante</label>
                <Input defaultValue="Los Girasoles Resto" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección</label>
                <Input defaultValue="Av. Principal 123, Santiago" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input defaultValue="+56 2 1234 5678" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Correo Electrónico</label>
                  <Input defaultValue="contacto@losgirasoles.cl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horario de Atención</label>
                <Input defaultValue="Lun-Dom: 12:00 - 23:00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">RUT</label>
                <Input defaultValue="77.888.999-0" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Impuestos</CardTitle>
                <CardDescription>Configuración de impuestos aplicables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">IVA (%)</label>
                  <Input defaultValue="19" type="number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impuesto Adicional (%)</label>
                  <Input defaultValue="0" type="number" />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Guardar</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moneda</CardTitle>
                <CardDescription>Configuración de moneda y formato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moneda</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="CLP">Peso Chileno (CLP)</option>
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Símbolo</label>
                  <Input defaultValue="$" />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Guardar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña: Usuarios */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>
                  Administre los usuarios que tienen acceso al sistema
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Administrador",
                    email: "admin@losgirasoles.cl",
                    role: "Administrador",
                    status: "Activo",
                  },
                  {
                    name: "Carlos Mendoza",
                    email: "carlos@losgirasoles.cl",
                    role: "Mesero",
                    status: "Activo",
                  },
                  {
                    name: "Valentina Torres",
                    email: "valentina@losgirasoles.cl",
                    role: "Mesera",
                    status: "Activo",
                  },
                  {
                    name: "Fernando Díaz",
                    email: "fernando@losgirasoles.cl",
                    role: "Delivery",
                    status: "Activo",
                  },
                  {
                    name: "María Espinoza",
                    email: "maria@losgirasoles.cl",
                    role: "Cocina",
                    status: "Inactivo",
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <span className="text-lg font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{user.role}</Badge>
                      <Badge
                        className={
                          user.status === "Activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roles y Permisos</CardTitle>
              <CardDescription>
                Configure los niveles de acceso para cada rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    role: "Administrador",
                    description: "Acceso completo a todas las funciones",
                    permissions: "Completo",
                  },
                  {
                    role: "Mesero",
                    description: "Gestión de órdenes y mesas",
                    permissions: "Limitado",
                  },
                  {
                    role: "Cocina",
                    description: "Vista de cocina y gestión de pedidos",
                    permissions: "Básico",
                  },
                  {
                    role: "Delivery",
                    description: "Gestión de entregas a domicilio",
                    permissions: "Básico",
                  },
                ].map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="font-medium">{role.role}</div>
                      <div className="text-sm text-gray-500">
                        {role.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{role.permissions}</Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña: Pagos */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>
                  Configure los métodos de pago aceptados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { method: "Efectivo", enabled: true },
                  { method: "Tarjeta de Crédito", enabled: true },
                  { method: "Tarjeta de Débito", enabled: true },
                  { method: "Transferencia Bancaria", enabled: true },
                  { method: "Aplicaciones Móviles", enabled: false },
                ].map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="font-medium">{method.method}</div>
                    <div className="flex items-center">
                      <Badge
                        className={
                          method.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {method.enabled ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-1">
                  <Plus className="h-4 w-4" />
                  Agregar Método de Pago
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Procesador de Pagos</CardTitle>
                <CardDescription>
                  Configure su procesador de pagos con tarjeta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-medium">Transbank</div>
                    <Badge className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">
                        Código de Comercio
                      </label>
                      <Input defaultValue="598745632" type="password" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">API Key</label>
                      <Input defaultValue="********" type="password" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-medium">Khipu</div>
                    <Badge className="bg-red-100 text-red-800">
                      No conectado
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Configurar
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Guardar Configuración
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña: Comprobantes */}
        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Boletas y Facturas</CardTitle>
              <CardDescription>
                Personalice los documentos tributarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Razón Social en Documentos
                </label>
                <Input defaultValue="Los Girasoles Restaurante SpA" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dirección en Documentos
                </label>
                <Input defaultValue="Av. Principal 123, Santiago" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Mensaje en Boletas
                </label>
                <Input defaultValue="¡Gracias por su preferencia!" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo en Documentos</label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md border-2 border-dashed flex items-center justify-center">
                    <Store className="h-8 w-8 text-gray-400" />
                  </div>
                  <Button variant="outline" size="sm">
                    Subir Logo
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Impresión</CardTitle>
              <CardDescription>
                Configure las opciones de impresión de documentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Impresora Predeterminada</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Impresora Térmica (Caja)</option>
                  <option>Impresora Cocina</option>
                  <option>Impresora Oficina</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamaño de Papel</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>80mm (Térmica)</option>
                  <option>Carta</option>
                  <option>1/2 Carta</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Imprimir Automáticamente</div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Imprimir en Cocina</div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Guardar Configuración</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña: Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones por Correo</CardTitle>
              <CardDescription>
                Configure las notificaciones enviadas por correo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Nuevas Órdenes Online</div>
                  <div className="text-sm text-gray-500">
                    Recibir notificaciones cuando ingresen órdenes online
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Resumen Diario</div>
                  <div className="text-sm text-gray-500">
                    Recibir un resumen con las ventas del día
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Alertas de Inventario</div>
                  <div className="text-sm text-gray-500">
                    Recibir alertas cuando el inventario esté bajo
                  </div>
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-800">Desactivado</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Correos Destinatarios</label>
                <Input defaultValue="admin@losgirasoles.cl, gerencia@losgirasoles.cl" />
                <p className="text-xs text-gray-500">
                  Separe múltiples correos con comas
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Guardar Preferencias</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones Push</CardTitle>
              <CardDescription>
                Configure las notificaciones en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Nuevas Órdenes</div>
                  <div className="text-sm text-gray-500">
                    Notificar cuando ingrese una nueva orden
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Órdenes Listas</div>
                  <div className="text-sm text-gray-500">
                    Notificar cuando una orden esté lista para servir
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">Alertas de Delivery</div>
                  <div className="text-sm text-gray-500">
                    Notificar cuando un delivery esté listo para despachar
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Guardar Preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña: Integraciones */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Plataformas de Delivery</CardTitle>
                <CardDescription>
                  Integre con aplicaciones de entrega a domicilio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "PedidosYa", connected: true },
                  { name: "Rappi", connected: false },
                  { name: "Uber Eats", connected: false },
                ].map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="font-medium">{platform.name}</div>
                    {platform.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          Conectado
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm">Conectar</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Otras Integraciones</CardTitle>
                <CardDescription>
                  Conecte con otros servicios y aplicaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Sistema Contable", connected: true },
                  { name: "WhatsApp Business", connected: false },
                  { name: "Google Analytics", connected: true },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="font-medium">{service.name}</div>
                    {service.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          Conectado
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm">Conectar</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API y Desarrolladores</CardTitle>
              <CardDescription>
                Credenciales y configuración para desarrolladores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-3 font-medium">Claves API</div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">API Key</label>
                    <div className="flex gap-2">
                      <Input defaultValue="sk_live_5aFYQ8u07R1bnUVZP9HaLzN" type="password" readOnly />
                      <Button variant="outline" size="sm">
                        Mostrar
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">API Secret</label>
                    <div className="flex gap-2">
                      <Input defaultValue="****************************************" type="password" readOnly />
                      <Button variant="outline" size="sm">
                        Mostrar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Regenerar Claves
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña: Respaldos */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Respaldo de Datos</CardTitle>
              <CardDescription>
                Gestione respaldos y restauración de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Respaldo Automático</div>
                  <Badge className="bg-green-100 text-green-800">Activado</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Los respaldos se realizan automáticamente todos los días a las 3:00 AM
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium">Respaldos Recientes</div>
                {[
                  { date: "2023-06-15 03:00", size: "45.2 MB", status: "Completo" },
                  { date: "2023-06-14 03:00", size: "44.8 MB", status: "Completo" },
                  { date: "2023-06-13 03:00", size: "44.5 MB", status: "Completo" },
                ].map((backup, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="font-medium">{backup.date}</div>
                      <div className="text-sm text-gray-500">{backup.size}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {backup.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Descargar
                      </Button>
                      <Button variant="outline" size="sm">
                        Restaurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsBackupDialogOpen(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Respaldo Manual
              </Button>
              <Button className="gap-2">
                <Cloud className="h-4 w-4" />
                Configurar Almacenamiento
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exportación de Datos</CardTitle>
              <CardDescription>
                Exporte datos para análisis o migración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="justify-start gap-2">
                  <Database className="h-4 w-4" />
                  Exportar Ventas (CSV)
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Exportar Clientes (CSV)
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Store className="h-4 w-4" />
                  Exportar Productos (CSV)
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Receipt className="h-4 w-4" />
                  Exportar Inventario (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Respaldo Manual */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Respaldo Manual</DialogTitle>
            <DialogDescription>
              El sistema creará un respaldo completo de la base de datos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-yellow-50 p-4 text-sm">
              <div className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Tenga en cuenta que:
                  </p>
                  <p className="mt-1 text-yellow-700">
                    Este proceso puede tomar varios minutos dependiendo del tamaño de la base de datos. El sistema seguirá funcionando normalmente durante este proceso.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción del respaldo (opcional)</label>
              <Input placeholder="Ej: Antes de actualización" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Crear Respaldo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
