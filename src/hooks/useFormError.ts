import { useState } from "react";

interface ErrorDetail {
  campo: string;
  error: string;
}

interface ErrorResponse {
  detalles?: ErrorDetail[];
  message?: string;
}

export function useFormError() {
  const [error, setError] = useState("");

  const handleError = (error: unknown) => {
    const axiosError = error as { response?: { data?: unknown } };
    const errorData = axiosError.response?.data as ErrorResponse | undefined;

    if (errorData?.detalles && Array.isArray(errorData.detalles)) {
      const mensajes = errorData.detalles
        .map((det) => det.error)
        .join(", ");
      setError(mensajes);
    } else if (errorData?.message) {
      setError(errorData.message);
    } else {
      setError("Error al procesar la solicitud");
    }
  };

  const clearError = () => setError("");

  return { error, handleError, clearError, setError };
}
