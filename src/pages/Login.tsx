import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Layers,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (error: any) {
      setErrors({ general: error.message || "Error al iniciar sesión" });
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
                <CardTitle className="text-2xl font-bold">¡Bienvenido!</CardTitle>
                <CardDescription className="text-orange-100">
                  Gestiona tu restaurante de manera eficiente y profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Administración Completa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Gestión de Cocina</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Atención al Cliente</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-500 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-blue-100 text-sm">Disponibilidad</div>
                </CardContent>
              </Card>
              <Card className="bg-green-500 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-green-100 text-sm">Seguro</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">¿Nuevo en el equipo?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Si aún no tienes una cuenta, regístrate para formar parte del equipo.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/register")}
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Registrarse
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
                    onClick={() => navigate("/register")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Acceso al Sistema</CardTitle>
                <CardDescription className="text-gray-600">
                  Inicia sesión o registra una nueva cuenta
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  {errors.general && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-9 h-12 ${errors.email ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {/* Contraseña */}
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

                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">
                      Para registro completo{" "}
                      <Link to="/register" className="text-orange-600 hover:text-orange-500 font-medium">
                        haz clic aquí
                      </Link>
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50 p-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium text-base shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "🚀 INICIAR SESION"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <span className="text-orange-600 hover:text-orange-500 font-medium cursor-pointer">
                      Inicia sesión aquí
                    </span>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    © 2025 LOS GIRASOLES - Sistema de Gestión v1.0.0
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