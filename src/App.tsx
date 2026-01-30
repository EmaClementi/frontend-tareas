import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Task } from "./pages/Task/TaskList";
import { Dashboard } from "./pages/Dashboard/Dashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

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

        <Route
          path="/tareas"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}