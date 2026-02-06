import { useState, useRef } from "react";
import type Task from "../../types/Task";
import "./TaskCard.css";
import { Button } from "../Button/Button";

type Props = {
  task: Task;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onRequestDelete: (task: Task) => void;
  onDragStart?: (task: Task) => void;
};

export function TaskCard({ task, onUpdate, onRequestDelete, onDragStart }: Props) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(task.nombre);
  const [descripcion, setDescripcion] = useState(task.descripcion);
  const [importancia, setImportancia] = useState(task.importancia);
  const [duracionDias, setDuracionDias] = useState<number | null>(task.duracionDias);
  const [estado, setEstado] = useState<Task["estado"]>(task.estado);
  const [fechaInicio, setFechaInicio] = useState(task.fechaInicio || "");
  const [fechaVencimiento, setFechaVencimiento] = useState(task.fechaVencimiento || "");
  const [isDragging, setIsDragging] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    
    if (cardRef.current) {
      const clone = cardRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.width = cardRef.current.offsetWidth + "px";
      clone.style.opacity = "0.8";
      clone.style.transform = "rotate(3deg)";
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, 0, 0);
      
      setTimeout(() => document.body.removeChild(clone), 0);
    }
    
    if (onDragStart) {
      onDragStart(task);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPrioridadBadge = () => {
  const hoy = new Date().toISOString().split('T')[0];
  
  if (task.estado === "COMPLETADA" || task.estado === "CANCELADA") {
    return null;
  }
  
  if (task.estaVencida) {
    return (
      <span className="task-priority-badge priority-critical">
        🔴 URGENTE - Vencida
      </span>
    );
  }
  
  if (task.fechaVencimiento === hoy) {
    return (
      <span className="task-priority-badge priority-high">
        🔥 VENCE HOY
      </span>
    );
  }
  
  if (task.importancia === "ALTA" && task.diasRestantes && task.diasRestantes <= 3) {
    return (
      <span className="task-priority-badge priority-warning">
        ⚠️ Alta prioridad
      </span>
    );
  }
  
  return null;
};

  if (editando) {
    return (
      <form className="task-card task-card-editing" onSubmit={handleSubmit}>
        <h3>✏️ Editando tarea</h3>

        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />

        <select
          value={importancia}
          onChange={(e) => setImportancia(e.target.value as "BAJA" | "MEDIA" | "ALTA")}
        >
          <option value="BAJA">Baja</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value as Task["estado"])}>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROGRESO">En Progreso</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>

        <div className="task-dates-edit">
          <div>
            <label>Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div>
            <label>Fecha de vencimiento</label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
            />
          </div>

          <div>
            <label>Duración en días</label>
            <input
              type="number"
              min={1}
              value={duracionDias ?? ""}
              onChange={(e) => setDuracionDias(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
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
    <div
      ref={cardRef}
      className={`task-card ${getEstadoVencimientoClass()} ${
        isDragging ? "task-dragging" : ""
      }`}
      data-importancia={task.importancia}
      draggable={!editando}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-drag-indicator">⋮⋮</div>

      <h3>
        {task.nombre}
        {getPrioridadBadge()}
      </h3>
      
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