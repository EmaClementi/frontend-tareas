import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor de REQUEST - Agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🆕 Interceptor de RESPONSE - Manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Manejar errores de autenticación (401 Unauthorized)
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      
      // Redirigir al login solo si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Manejar error 403 (Forbidden - sin permisos)
    if (error.response?.status === 403) {
      console.error("No tienes permisos para realizar esta acción");
    }

    // Manejar errores de servidor (500+)
    if (error.response?.status >= 500) {
      console.error("Error del servidor. Intenta más tarde.");
    }

    return Promise.reject(error);
  }
);

export const eliminarTarea = (id: number) => api.delete(`/tareas/${id}`);

export default api;