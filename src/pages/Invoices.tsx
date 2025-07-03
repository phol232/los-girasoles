import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Clock,
  CreditCard,
  Download,
  Mail,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Receipt
} from "lucide-react";

// Datos de ejemplo para facturas y boletas
const invoicesData = [
  {
    id: "F-001234",
    type: "factura",
    date: "2023-06-15",
    time: "14:30",
    customer: {
      name: "Empresa Los Álamos S.A.",
      rut: "76.123.456-7",
      email: "contacto@alamos.cl"
    },
    items: [
      { name: "Servicio de Catering Ejecutivo", quantity: 1, price: 450000 },
      { name: "Servicio de Café y Pastelería", quantity: 1, price: 120000 }
    ],
    total: 570000,
    tax: 108300,
    status: "paid",
    paymentMethod: "Transferencia Bancaria",
    paymentDate: "2023-06-16",
    notes: "Evento corporativo del 14/06/2023"
  },
  {
    id: "B-005678",
    type: "boleta",
    date: "2023-06-15",
    time: "20:45",
    customer: {
      name: "Juan Pérez",
      rut: "12.345.678-9",
      email: "juan.perez@example.com"
    },
    items: [
      { name: "Cena Familiar (4 personas)", quantity: 1, price: 75000 },
      { name: "Botella Vino Reserva", quantity: 1, price: 25000 }
    ],
    total: 100000,
    tax: 19000,
    status: "paid",
    paymentMethod: "Tarjeta de Crédito",
    paymentDate: "2023-06-15",
    notes: ""
  },
  {
    id: "F-001235",
    type: "factura",
    date: "2023-06-14",
    time: "11:15",
    customer: {
      name: "Distribuidora Santiago Ltda.",
      rut: "77.987.654-3",
      email: "compras@distsantiago.cl"
    },
    items: [
      { name: "Servicio de Alimentación Mensual", quantity: 1, price: 1200000 }
    ],
    total: 1200000,
    tax: 228000,
    status: "pending",
    paymentMethod: "Transferencia Bancaria",
    paymentDate: "",
    notes: "Contrato mensual junio 2023"
  },
  {
    id: "B-005679",
    type: "boleta",
    date: "2023-06-14",
    time: "19:30",
    customer: {
      name: "María González",
      rut: "15.876.543-2",
      email: "maria.gonzalez@example.com"
    },
    items: [
      { name: "Menú Ejecutivo", quantity: 2, price: 12000 },
      { name: "Postre del Día", quantity: 2, price: 5000 },
      { name: "Bebidas", quantity: 2, price: 3000 }
    ],
    total: 40000,
    tax: 7600,
    status: "paid",
    paymentMethod: "Efectivo",
    paymentDate: "2023-06-14",
    notes: ""
  },
  {
    id: "F-001236",
    type: "factura",
    date: "2023-06-13",
    time: "10:00",
    customer: {
      name: "Hotel Costa Azul",
      rut: "76.543.210-8",
      email: "adquisiciones@costaazul.cl"
    },
    items: [
      { name: "Servicio de Catering Desayuno", quantity: 1, price: 350000 },
      { name: "Servicio de Catering Almuerzo", quantity: 1, price: 500000 },
      { name: "Servicio de Catering Cena", quantity: 1, price: 450000 }
    ],
    total: 1300000,
    tax: 247000,
    status: "overdue",
    paymentMethod: "Transferencia Bancaria",
    paymentDate: "",
    notes: "Conferencia Internacional 12-13/06/2023"
  },
  {
    id: "B-005680",
    type: "boleta",
    date: "2023-06-13",
    time: "21:15",
    customer: {
      name: "Roberto Fernández",
      rut: "9.876.543-2",
      email: "roberto.fernandez@example.com"
    },
    items: [
      { name: "Parrillada Familiar (6 personas)", quantity: 1, price: 120000 },
      { name: "Bebidas Surtidas", quantity: 1, price: 15000 },
      { name: "Postres Variados", quantity: 1, price: 18000 }
    ],
    total: 153000,
    tax: 29070,
    status: "paid",
    paymentMethod: "Tarjeta de Débito",
    paymentDate: "2023-06-13",
    notes: "Cumpleaños Roberto"
  }
];

export function Invoices() {
  const [invoices, setInvoices] = useState(invoicesData);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Filtrar facturas y boletas según pestaña seleccionada y búsqueda
  const filteredInvoices = invoices.filter((invoice) => {
    // Filtrar por pestaña
    const matchesTab =
      activeTab === "all" ||
      activeTab === invoice.type ||
      activeTab === invoice.status;

    // Filtrar por búsqueda
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.rut.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Función para abrir el modal de detalles
  const handleOpenDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Función para formatear el dinero en pesos chilenos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  // Función para obtener el color de la insignia según el estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return { label: "Pagado", color: "bg-green-100 text-green-800" };
      case "pending":
        return { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" };
      case "overdue":
        return { label: "Vencido", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Boletas / Facturas</h1>
          <p className="text-gray-500">
            Gestión de documentos tributarios
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Documento
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por número, cliente o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="factura">Facturas</TabsTrigger>
          <TabsTrigger value="boleta">Boletas</TabsTrigger>
          <TabsTrigger value="paid">Pagados</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>{invoice.id}</span>
                        <Badge
                          variant="secondary"
                          className={getStatusBadge(invoice.status).color}
                        >
                          {getStatusBadge(invoice.status).label}
                        </Badge>
                      </CardTitle>
                      <div className="mt-1 text-sm text-gray-500">
                        {invoice.date} • {invoice.time}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {invoice.type === "factura" ? "Factura" : "Boleta"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="mt-1 h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{invoice.customer.name}</div>
                        <div className="text-sm text-gray-500">
                          RUT: {invoice.customer.rut}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm text-gray-500">Detalles:</div>
                      <div className="space-y-1">
                        {invoice.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                        {invoice.items.length > 2 && (
                          <div className="text-sm italic text-gray-500">
                            Y {invoice.items.length - 2} ítem(s) más...
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-between border-t pt-2 text-sm">
                        <span>Neto:</span>
                        <span>{formatCurrency(invoice.total - invoice.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA (19%):</span>
                        <span>{formatCurrency(invoice.tax)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>Total:</span>
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Método de pago</div>
                        <div className="font-medium">{invoice.paymentMethod}</div>
                      </div>
                    </div>

                    {invoice.notes && (
                      <div className="rounded-md bg-yellow-50 p-3 text-sm">
                        <div className="font-medium">Notas:</div>
                        <div className="text-gray-600">{invoice.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <div className="flex w-full items-center justify-between">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleOpenDetails(invoice)}
                    >
                      Detalles <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
              <FileText className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">No hay documentos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron documentos que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal para ver detalles del documento */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        {selectedInvoice && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedInvoice.id}
                <Badge
                  variant="secondary"
                  className={getStatusBadge(selectedInvoice.status).color}
                >
                  {getStatusBadge(selectedInvoice.status).label}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedInvoice.type === "factura" ? "Factura" : "Boleta"} •{" "}
                {selectedInvoice.date} • {selectedInvoice.time}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-md border p-3">
                <div className="mb-2 font-medium">Cliente</div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Nombre:</span> {selectedInvoice.customer.name}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">RUT:</span> {selectedInvoice.customer.rut}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Email:</span> {selectedInvoice.customer.email}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 font-medium">Detalle de Items</div>
                <div className="rounded-md border p-3">
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Neto:</span>
                        <span>{formatCurrency(selectedInvoice.total - selectedInvoice.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (19%):</span>
                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedInvoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div className="font-medium">{selectedInvoice.paymentMethod}</div>
                </div>
                {selectedInvoice.paymentDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="font-medium">{selectedInvoice.paymentDate}</div>
                  </div>
                )}
              </div>

              {selectedInvoice.notes && (
                <div className="rounded-md bg-yellow-50 p-3 text-sm">
                  <div className="font-medium">Notas:</div>
                  <div className="text-gray-600">{selectedInvoice.notes}</div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" className="gap-2 sm:w-auto">
                <Mail className="h-4 w-4" />
                Enviar por Email
              </Button>
              <Button variant="outline" className="gap-2 sm:w-auto">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button className="gap-2 sm:w-auto">
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}