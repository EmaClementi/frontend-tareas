import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Task } from "./pages/Task/TaskList";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública - Home siempre accesible */}
        <Route path="/" element={<Home />} />

        {/* Rutas públicas - Solo para NO autenticados */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rutas privadas - Solo para autenticados */}
        <Route
          path="/tareas"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}