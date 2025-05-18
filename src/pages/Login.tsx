import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Coffee, Layers, Lock, User, UserCircle } from "lucide-react";

// Este componente simula un inicio de sesión real
// En una aplicación real, esto se conectaría a un backend para autenticación

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [remember, setRemember] = useState(false);
  const [loginTab, setLoginTab] = useState("credentials");

  // En una aplicación real, aquí iría la lógica de autenticación
  // Por ahora, simulamos un inicio de sesión exitoso sin validación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulamos guardar datos de usuario en localStorage
    const user = {
      name: username || "Usuario Demo",
      role: selectedRole,
      avatar: "",
    };

    // En una app real usaríamos un token JWT, etc.
    localStorage.setItem("user", JSON.stringify(user));

    // Redireccionar a la página principal
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white">
            <Layers className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LOS GIRASOLES</h1>
          <p className="text-gray-600">Sistema de Gestión de Restaurante</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta para administrar el restaurante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginTab} onValueChange={setLoginTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="credentials" className="flex-1">
                  Credenciales
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex-1">
                  Modo Demo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credentials">
                <form onSubmit={handleLogin} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Usuario
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                      <Input
                        id="username"
                        placeholder="Nombre de usuario"
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(checked) => setRemember(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm">
                        Recordarme
                      </label>
                    </div>
                    <a href="#" className="text-sm text-orange-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="demo">
                <div className="space-y-4 py-4">
                  <div className="text-center text-sm text-gray-500">
                    Selecciona un rol para acceder en modo demo
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card
                      className={`cursor-pointer ${
                        selectedRole === "admin" ? "border-orange-500 bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedRole("admin")}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 rounded-full bg-orange-100 p-2 text-orange-600">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-center text-sm">Admin</CardTitle>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer ${
                        selectedRole === "waiter" ? "border-orange-500 bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedRole("waiter")}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 rounded-full bg-blue-100 p-2 text-blue-600">
                          <User className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-center text-sm">Mesero</CardTitle>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer ${
                        selectedRole === "kitchen" ? "border-orange-500 bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedRole("kitchen")}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <div className="mb-2 rounded-full bg-green-100 p-2 text-green-600">
                          <Coffee className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-center text-sm">Cocina</CardTitle>
                      </CardContent>
                    </Card>
                  </div>

                  <Button className="w-full" onClick={handleLogin}>
                    Acceder como {selectedRole === "admin" ? "Administrador" : selectedRole === "waiter" ? "Mesero" : "Cocina"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2 border-t bg-gray-50 p-6">
            <div className="text-center text-sm text-gray-600">
              Sistema de Gestión Restaurante © 2025 LOS GIRASOLES
            </div>
            <div className="text-center text-xs text-gray-500">
              v1.0.0 - Todos los derechos reservados
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
