export default interface TaskType {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA";
  importancia: "BAJA" | "MEDIA" | "ALTA";
}
