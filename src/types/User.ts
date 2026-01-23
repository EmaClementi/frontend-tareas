import type TaskType from "./Task";

export type Role = "ADMIN" | "USER";

export default interface UserType {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  role: Role;
  tareas: TaskType[];
}
