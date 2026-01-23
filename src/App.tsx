import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Task } from "./pages/Task/Task";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

