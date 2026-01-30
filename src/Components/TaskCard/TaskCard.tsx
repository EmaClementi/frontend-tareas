import { useState } from "react";
import type Task from "../../types/Task";
import "./TaskCard.css";
import { Button } from "../Button/Button";
import { FormInput } from "../FormImput/FormInput"; // 🆕

type Props = {
  task: Task;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onRequestDelete: (task: Task) => void;
};

export function TaskCard({ task, onUpdate, onRequestDelete }: Props) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(task.nombre);
  const [descripcion, setDescripcion] = useState(task.descripcion);
  const [importancia, setImportancia] = useState(task.importancia);
  const [duracionDias, setDuracionDias] = useState<number | null>(task.duracionDias);
  const [estado, setEstado] = useState<Task["estado"]>(task.estado);
  const [fechaInicio, setFechaInicio] = useState(task.fechaInicio || "");
  const [fechaVencimiento, setFechaVencimiento] = useState(task.fechaVencimiento || "");

  if (
    !editando &&
    (task.nombre !== nombre ||
      task.descripcion !== descripcion ||
      task.duracionDias !== duracionDias ||
      task.fechaInicio !== (fechaInicio || null) ||
      task.fechaVencimiento !== (fechaVencimiento || null))
  ) {
    setNombre(task.nombre);
    setDescripcion(task.descripcion);
    setImportancia(task.importancia);
    setDuracionDias(task.duracionDias);
    setEstado(task.estado);
    setFechaInicio(task.fechaInicio || "");
    setFechaVencimiento(task.fechaVencimiento || "");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdate(task.id, {
      nombre,
      descripcion,
      estado,
      importancia,
      duracionDias,
      fechaInicio: fechaInicio || null,
      fechaVencimiento: fechaVencimiento || null,
    });

    setEditando(false);
  };

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "No establecida";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEstadoVencimientoClass = () => {
    if (task.estado === "COMPLETADA" || task.estado === "CANCELADA") {
      return "";
    }
    if (task.estaVencida) {
      return "task-vencida";
    }
    if (task.diasRestantes !== null && task.diasRestantes <= 3 && task.diasRestantes >= 0) {
      return "task-proxima-vencer";
    }
    return "";
  };

  if (editando) {
    return (
      <form className="task-card task-card-editing" onSubmit={handleSubmit}>
        <h3>✏️ Editando tarea</h3>

        {/* 🆕 Usar FormInput */}
        <FormInput
          type="text"
          placeholder="Nombre de la tarea"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <FormInput
          type="textarea"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />

        <FormInput
          type="select"
          value={importancia}
          onChange={(e) => setImportancia(e.target.value as "BAJA" | "MEDIA" | "ALTA")}
          options={[
            { value: "BAJA", label: "Baja" },
            { value: "MEDIA", label: "Media" },
            { value: "ALTA", label: "Alta" },
          ]}
        />

        <FormInput
          type="select"
          value={estado}
          onChange={(e) => setEstado(e.target.value as Task["estado"])}
          options={[
            { value: "PENDIENTE", label: "Pendiente" },
            { value: "EN_PROGRESO", label: "En Progreso" },
            { value: "COMPLETADA", label: "Completada" },
            { value: "CANCELADA", label: "Cancelada" },
          ]}
        />

        <div className="task-dates-edit">
          <FormInput
            type="date"
            label="📅 Fecha de inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />

          <FormInput
            type="date"
            label="⏰ Fecha de vencimiento"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />

          <FormInput
            type="number"
            label="📆 Duración en días"
            placeholder="Ej: 7 días"
            value={duracionDias ?? ""}
            onChange={(e) => setDuracionDias(e.target.value ? Number(e.target.value) : null)}
            min={1}
          />
        </div>

        <div className="task-actions">
          <Button type="submit" variant="primary">
            💾 Guardar
          </Button>
          <Button variant="secondary" onClick={() => setEditando(false)}>
            ❌ Cancelar
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className={`task-card ${getEstadoVencimientoClass()}`}>
      <h3>{task.nombre}</h3>
      <p>{task.descripcion}</p>

      <div className="task-metadata">
        <p>
          <strong>Importancia:</strong> {task.importancia}
        </p>
        <p>
          <strong>Estado:</strong> {task.estado}
        </p>

        {task.fechaInicio && (
          <p>
            <strong>📅 Inicio:</strong> {formatearFecha(task.fechaInicio)}
          </p>
        )}

        {task.fechaVencimiento && (
          <p>
            <strong>⏰ Vencimiento:</strong> {formatearFecha(task.fechaVencimiento)}
          </p>
        )}

        {task.diasRestantes !== null && task.estado !== "COMPLETADA" && task.estado !== "CANCELADA" && (
          <p className="task-dias-restantes">
            {task.estaVencida ? (
              <span className="task-vencida-badge">
                ❌ Vencida hace {Math.abs(task.diasRestantes)} días
              </span>
            ) : task.diasRestantes === 0 ? (
              <span className="task-hoy-badge">🔥 Vence HOY</span>
            ) : task.diasRestantes <= 3 ? (
              <span className="task-urgente-badge">
                ⚠️ Vence en {task.diasRestantes} días
              </span>
            ) : (
              <span>📆 {task.diasRestantes} días restantes</span>
            )}
          </p>
        )}

        {task.fechaFinalizacion && (
          <p>
            <strong>✅ Finalizada:</strong> {formatearFecha(task.fechaFinalizacion)}
          </p>
        )}
      </div>

      <div className="task-actions">
        <Button variant="secondary" onClick={() => setEditando(true)}>
          ✏️ Editar
        </Button>

        <Button variant="danger" onClick={() => onRequestDelete(task)}>
          🗑 Eliminar
        </Button>
      </div>
    </div>
  );
}