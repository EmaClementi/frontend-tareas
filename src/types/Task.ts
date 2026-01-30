type Task = {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
  fechaCreacion: string; // ISO string desde el backend
  fechaInicio: string | null; // 🆕
  fechaVencimiento: string | null; // 🆕
  fechaFinalizacion: string | null;
  importancia: "BAJA" | "MEDIA" | "ALTA";
  duracionDias: number | null;
  estaVencida: boolean; // 🆕
  diasRestantes: number | null; // 🆕
};

export type { Task as default };