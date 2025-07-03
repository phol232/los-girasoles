import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Layers,
  Crown,
  ChefHat,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const roles = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo al sistema",
    icon: "👑",
    color: "#FF0000"
  },
  {
    id: 2,
    name: "Cocinero", 
    description: "Encargado de la preparación de platillos",
    icon: "👨‍🍳",
    color: "#00AA00"
  },
  {
    id: 3,
    name: "Mesero",
    description: "Atención al cliente en mesas", 
    icon: "👨‍💼",
    color: "#0000FF"
  }
];

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    rol_id: "1", // Por defecto Administrador
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rol_id) newErrors.rol_id = "Selecciona un rol";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const registerPayload = {
        ...formData,
        rol_id: parseInt(formData.rol_id)
      };
      
      await register(registerPayload);
      navigate("/");
    } catch (error: any) {
      setErrors({ general: error.message || "Error al registrar usuario" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="w-full max-w-4xl">
        {/* Header del sistema */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
            <Layers className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LOS GIRASOLES</h1>
          <p className="text-gray-600 text-lg">Sistema de Gestión de Restaurante</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Panel izquierdo - Información */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">¡Únete a nuestro equipo!</CardTitle>
                <CardDescription className="text-orange-100">
                  Crea tu cuenta y comienza a gestionar el restaurante de manera eficiente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Control total del sistema</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ChefHat className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Gestión de cocina y pedidos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Atención al cliente optimizada</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">¿Ya tienes una cuenta?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Si ya eres parte del equipo, inicia sesión para acceder al sistema.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Iniciar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                </div>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  {errors.general && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Rol */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Rol en el Sistema</label>
                    <Select 
                      value={formData.rol_id} 
                      onValueChange={(value) => handleInputChange("rol_id", value)}
                    >
                      <SelectTrigger className={`h-12 ${errors.rol_id ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span>{role.icon}</span>
                              <div>
                                <div className="font-medium">{role.name}</div>
                                <div className="text-xs text-gray-500">{role.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.rol_id && <p className="text-sm text-red-500">{errors.rol_id}</p>}
                  </div>
                  
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Tu nombre"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange("nombre", e.target.value)}
                          className={`pl-9 h-12 ${errors.nombre ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                        />
                      </div>
                      {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Apellido</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Tu apellido"
                          value={formData.apellido}
                          onChange={(e) => handleInputChange("apellido", e.target.value)}
                          className={`pl-9 h-12 ${errors.apellido ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                        />
                      </div>
                      {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                    </div>
                  </div>
                  
                  {/* Email y Teléfono */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`pl-9 h-12 ${errors.email ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          value={formData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                          className="pl-9 h-12 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contraseñas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`pl-9 pr-9 h-12 ${errors.password ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirma tu contraseña"
                          value={formData.password_confirmation}
                          onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                          className={`pl-9 pr-9 h-12 ${errors.password_confirmation ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50 p-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium text-base shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "🚀 Crear mi cuenta"}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 font-medium">
                      Inicia sesión aquí
                    </Link>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
