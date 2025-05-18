import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ClipboardList,
  DollarSign,
  Package,
  Pizza,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos simulados para las gráficas
const salesData = [
  { name: "Ene", clientes: 20, ordenes: 55, ventas: 45 },
  { name: "Feb", clientes: 25, ordenes: 65, ventas: 50 },
  { name: "Mar", clientes: 35, ordenes: 85, ventas: 70 },
  { name: "Abr", clientes: 30, ordenes: 75, ventas: 60 },
  { name: "May", clientes: 40, ordenes: 90, ventas: 75 },
  { name: "Jun", clientes: 35, ordenes: 80, ventas: 70 },
  { name: "Jul", clientes: 45, ordenes: 95, ventas: 85 },
  { name: "Ago", clientes: 50, ordenes: 100, ventas: 90 },
  { name: "Sep", clientes: 55, ordenes: 110, ventas: 100 },
  { name: "Oct", clientes: 60, ordenes: 115, ventas: 110 },
  { name: "Nov", clientes: 55, ordenes: 105, ventas: 95 },
  { name: "Dic", clientes: 70, ordenes: 120, ventas: 115 },
];

// Datos simulados para las estadísticas de los países
const countryData = [
  { id: 1, pais: "México", porcentaje: 35 },
  { id: 2, pais: "España", porcentaje: 24.3 },
  { id: 3, pais: "Otros", porcentaje: 8.2 },
];

// Datos simulados para el menú popular
const popularMenu = [
  { id: 1, name: "Parrillada Mixta", sold: 523, price: "$2,200.00" },
  { id: 2, name: "Ensalada César", sold: 294, price: "$1,643.04" },
  { id: 3, name: "Paella Valenciana", sold: 172, price: "$800.02" },
  { id: 4, name: "Langosta al ajillo", sold: 98, price: "$812.33" },
  { id: 5, name: "Pollo a la brasa", sold: 87, price: "$710.23" },
  { id: 6, name: "Sopa de cebolla", sold: 53, price: "$230.63" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de ingresos */}
        <Card className="bg-[#1c1c24] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Ingresos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200.44</div>
            <p className="text-xs text-gray-300">Últimos 7 días</p>
          </CardContent>
        </Card>

        {/* Tarjeta de propinas */}
        <Card className="bg-[#1c1c24] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Monto propinas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$190.21</div>
            <p className="text-xs text-gray-300">Últimos 7 días</p>
          </CardContent>
        </Card>

        {/* Tarjeta de órdenes pagadas */}
        <Card className="bg-[#1c1c24] text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Órdenes pagadas
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-gray-300">Últimos 7 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas y mapa de clientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Estadísticas de pago y pedidos */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Estadísticas de pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Transacciones totales */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total transacciones</div>
                    <div className="text-xl font-semibold">$1,200.44</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  + 26%
                </Badge>
              </div>

              {/* Pedidos confirmados */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <ClipboardList className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pedidos confirmados</div>
                    <div className="text-xl font-semibold">345</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-600">
                  - 1.8%
                </Badge>
              </div>

              {/* Órdenes entregadas */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Órdenes entregadas</div>
                    <div className="text-xl font-semibold">2309</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  + 33%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapa y distribución por país */}
        <div className="col-span-2">
          <Card className="bg-orange-500">
            <CardHeader>
              <CardTitle className="text-white">Clientes por país</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between pb-3 text-white">
                {countryData.map((country) => (
                  <div key={country.id} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                    <span>
                      {country.pais}: {country.porcentaje}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Imagen de mapa simulada */}
              <div className="relative h-[180px] w-full">
                <div className="absolute inset-0 bg-opacity-20 bg-[url('https://cdn-icons-png.flaticon.com/512/854/854878.png')] bg-center bg-no-repeat bg-cover opacity-30"></div>
                {/* Puntos del mapa */}
                <div className="absolute left-1/4 top-1/3 h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <div className="absolute left-1/2 top-1/4 h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <div className="absolute left-3/4 top-1/2 h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <div className="absolute left-1/3 top-2/3 h-2 w-2 animate-pulse rounded-full bg-white"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfica de ventas y menú popular */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfica de ventas */}
        <div className="col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resumen de Pedidos y Ventas</CardTitle>
              <Button variant="outline" size="sm">
                Este mes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clientes"
                      name="Nuevos Clientes"
                      stroke="#ff8a00"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ordenes"
                      name="Órdenes"
                      stroke="#0ea5e9"
                    />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      name="Ventas"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Punto destacado de la gráfica */}
              <div className="mt-4 rounded-md bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span>Nuevos Clientes</span>
                  <span className="ml-1 font-bold">1,200</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menú popular */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Menú Popular</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span>Este mes</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    Monto vendido
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full px-4">
                    Este mes
                  </Button>
                </div>

                <div className="space-y-4">
                  {popularMenu.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100">
                          <Pizza className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.sold} vendidos</div>
                        </div>
                      </div>
                      <div className="font-medium">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
