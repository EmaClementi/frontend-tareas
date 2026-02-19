import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import api from "../../service/api";
import { useToast } from "../../context/useToast";
import { TaskCard } from "../../Components/TaskCard/TaskCard";
import { TaskCreate } from "./TaskCreate/TaskCreate";
import { TaskFilters, type FiltrosState } from "../../Components/TaskFilters/TaskFilters";
import { DropZones } from "../../Components/DropZones/DropZones";
import { Modal } from "../../Components/Modal/Modal";
import { Button } from "../../Components/Button/Button";
import { ThemeToggle } from "../../Components/ThemeToggle/ThemeToggle";
import { AnimatedPage } from "../../Components/AnimatedPage";
import { TaskSkeleton } from "../../Components/TaskSkeleton/TaskSkeleton";
import { EmptyState } from "../../Components/EmptyState/EmptyState";
import { useAuth } from "../../auth/UserAuth";
import type TaskType from "../../types/Task";

import "./TaskList.css";

const FILTROS_INICIALES: FiltrosState = {
  busqueda: "",
  estado: "",
  importancia: "",
  fechaDesde: "",
  fechaHasta: "",
  soloVencidas: false,
  diasDuracion: "",
  ordenarPor: "",
  direccion: "ASC",
};

type FiltrosBackend = {
  busqueda?: string;
  estado?: string;
  importancia?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  soloVencidas?: boolean;
  diasDuracion?: number;
  ordenarPor?: string;
  direccion?: string;
};

export function Task() {
  const { success, error: showError } = useToast();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [draggedTask, setDraggedTask] = useState<TaskType | null>(null);
  const [showDropZones, setShowDropZones] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const dragTimeoutRef = useRef<number | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const cargarTareas = useCallback(async (filtrosAplicados?: FiltrosState) => {
    try {
      setLoading(true);
      setError(null);

      const filtrosActuales = filtrosAplicados || filtros;
      const filtrosBackend: FiltrosBackend = {};

      if (filtrosActuales.busqueda) {
        filtrosBackend.busqueda = filtrosActuales.busqueda;
      }
      if (filtrosActuales.estado) {
        filtrosBackend.estado = filtrosActuales.estado;
      }
      if (filtrosActuales.importancia) {
        filtrosBackend.importancia = filtrosActuales.importancia;
      }
      if (filtrosActuales.fechaDesde) {
        filtrosBackend.fechaDesde = filtrosActuales.fechaDesde;
      }
      if (filtrosActuales.fechaHasta) {
        filtrosBackend.fechaHasta = filtrosActuales.fechaHasta;
      }
      if (filtrosActuales.soloVencidas) {
        filtrosBackend.soloVencidas = true;
      }
      if (filtrosActuales.diasDuracion) {
        filtrosBackend.diasDuracion = parseInt(filtrosActuales.diasDuracion);
      }
      if (filtrosActuales.ordenarPor) {
        filtrosBackend.ordenarPor = filtrosActuales.ordenarPor;
        filtrosBackend.direccion = filtrosActuales.direccion;
      }

      const res = await api.post<TaskType[]>("/tareas/filtrar", filtrosBackend);
      setTasks(res.data);
    } catch {
      setError("❌ Error al cargar las tareas");
      showError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [filtros, showError]);

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current !== null) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const handleAplicarFiltros = (filtrosCustom?: FiltrosState) => {
    const filtrosAUsar = filtrosCustom || filtros;
    cargarTareas(filtrosAUsar);
    setMostrarFiltros(false);
  };

  const handleLimpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    cargarTareas(FILTROS_INICIALES);
    setMostrarFiltros(false);
    success("Filtros limpiados");
  };

  const actualizarTarea = async (id: number, data: Partial<TaskType>) => {
    try {
      await api.put(`/tareas/${id}`, data);
      await cargarTareas(filtros);
      success("Tarea actualizada correctamente");
    } catch {
      showError("Error al actualizar la tarea");
    }
  };

  const eliminarTarea = async () => {
    if (!taskToDelete) return;

    try {
      setLoadingDelete(true);
      await api.delete(`/tareas/${taskToDelete.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
      success("Tarea eliminada correctamente");
    } catch {
      showError("Error al eliminar la tarea");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    success("Sesión cerrada correctamente");
  };

  const handleDragStart = (task: TaskType) => {
    setDraggedTask(task);

    dragTimeoutRef.current = window.setTimeout(() => {
      setShowDropZones(true);
    }, 200);
  };

  const handleDrop = async (nuevoEstado: string) => {
    if (dragTimeoutRef.current !== null) {
      clearTimeout(dragTimeoutRef.current);
    }

    if (!draggedTask) return;

    if (draggedTask.estado === nuevoEstado) {
      setDraggedTask(null);
      setShowDropZones(false);
      return;
    }

    try {
      await actualizarTarea(draggedTask.id, {
        ...draggedTask,
        estado: nuevoEstado as TaskType["estado"]
      });
      success(`Tarea movida a ${nuevoEstado.replace("_", " ")}`);
    } catch {
      showError("Error al actualizar el estado");
    } finally {
      setDraggedTask(null);
      setShowDropZones(false);
    }
  };

  const handleDragLeave = () => {
    if (dragTimeoutRef.current !== null) {
      clearTimeout(dragTimeoutRef.current);
    }

    setDraggedTask(null);
    setShowDropZones(false);
  };


  if (loading && tasks.length === 0) {
    return (
      <AnimatedPage>
        <div className="task-container">
          <div className="task-content">
            <header className="task-header">
              <div className="skeleton skeleton-title" style={{ width: '200px', height: '32px' }}></div>
            </header>
            <div style={{ marginTop: '2rem' }}>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="task-container">
        {showDropZones && (
          <DropZones onDrop={handleDrop} onDragLeave={handleDragLeave} />
        )}

        <div className="task-content">
          <header className="task-header">
            <h1>📋 Mis tareas</h1>
            <div className="task-header-actions">
              <ThemeToggle />
              <Button variant="primary" onClick={() => navigate("/dashboard")}>
                📊 Dashboard
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                🚪 Salir
              </Button>
            </div>
          </header>

          {error && <div className="task-error">{error}</div>}

          <TaskFilters
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onAplicar={handleAplicarFiltros}
            onLimpiar={handleLimpiarFiltros}
            mostrarFiltros={mostrarFiltros}
            onToggleFiltros={() => setMostrarFiltros(!mostrarFiltros)}
          />

          <div className="task-form-section">
            <button
              className={`task-form-toggle ${showForm ? "task-form-toggle-open" : ""}`}
              onClick={() => setShowForm(!showForm)}
              type="button"
            >
              <span className="task-form-toggle-icon">{showForm ? "−" : "+"}</span>
              <span>{showForm ? "Cerrar formulario" : "Nueva tarea"}</span>
            </button>

            {showForm && (
              <div className="task-form-collapsible">
                <TaskCreate onTaskCreated={() => {
                  cargarTareas(filtros);
                  setShowForm(false);
                }} />
              </div>
            )}
          </div>

          {loading && (
            <div className="task-loading-overlay">
              <div className="task-spinner">⏳ Filtrando...</div>
            </div>
          )}

          {!loading && tasks.length === 0 ? (
            <EmptyState
              title="¡Todo despejado por aquí!"
              subtitle={filtros.busqueda || filtros.estado || filtros.importancia
                ? "Prueba ajustando los filtros para encontrar lo que buscas."
                : "No tienes tareas pendientes. ¡Crea una nueva para empezar el día!"}
              type={filtros.busqueda ? "search" : "tasks"}
            />
          ) : (
            <div className="task-results-info">
              <div
                className="task-sort-indicator"
                data-type={!filtros.ordenarPor ? "intelligent" : "custom"}
              >
                {!filtros.ordenarPor ? (
                  <>
                    <span>🧠</span>
                    <span>
                      <strong>Ordenamiento inteligente</strong> - Prioriza tareas vencidas y urgentes
                    </span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>
                      Ordenado por:{" "}
                      <strong>
                        {filtros.ordenarPor === "fechaVencimiento" && "Fecha de vencimiento"}
                        {filtros.ordenarPor === "fechaCreacion" && "Fecha de creación"}
                        {filtros.ordenarPor === "importancia" && "Importancia"}
                        {filtros.ordenarPor === "nombre" && "Nombre"}
                      </strong>
                      {" "}
                      <span style={{ opacity: 0.7 }}>
                        ({filtros.direccion === "ASC" ? "↑ Ascendente" : "↓ Descendente"})
                      </span>
                    </span>
                  </>
                )}
              </div>

              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                📊 Mostrando <strong>{tasks.length}</strong> tarea{tasks.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={actualizarTarea}
                onRequestDelete={setTaskToDelete}
                onDragStart={handleDragStart}
                onDragEnd={() => setShowDropZones(false)}
              />
            ))}
          </AnimatePresence>

          <Modal
            open={!!taskToDelete}
            title="Eliminar tarea"
            onClose={() => setTaskToDelete(null)}
          >
            <p>
              ¿Seguro que querés eliminar la tarea
              <strong> {taskToDelete?.nombre}</strong>?
            </p>

            <div className="task-actions">
              <Button
                variant="danger"
                disabled={loadingDelete}
                onClick={eliminarTarea}
              >
                {loadingDelete ? "Eliminando..." : "Sí, eliminar"}
              </Button>

              <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
                Cancelar
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </AnimatedPage>
  );
}