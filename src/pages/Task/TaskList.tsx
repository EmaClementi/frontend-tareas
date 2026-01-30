import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../service/api";
import { useToast } from "../../context/useToast";
import { TaskCard } from "../../Components/TaskCard/TaskCard";
import { TaskCreate } from "./TaskCreate/TaskCreate";
import { TaskFilters, type FiltrosState } from "../../Components/TaskFilters/TaskFilters"; // 🔧 FIX 1
import { Modal } from "../../Components/Modal/Modal";
import { Button } from "../../Components/Button/Button";
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

// 🔧 FIX 2: Tipo explícito para filtros del backend
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

  const { logout } = useAuth();
  const navigate = useNavigate();

  const cargarTareas = useCallback(async (filtrosAplicados?: FiltrosState) => {
    try {
      setLoading(true);
      setError(null);

      const filtrosActuales = filtrosAplicados || filtros;

      // 🔧 FIX 2: Tipo explícito en lugar de any
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
      // 🔧 FIX 3: Removido 'err' sin usar
      setError("❌ Error al cargar las tareas");
      showError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [filtros, showError]);

  // 🔧 FIX 4: Agregado cargarTareas a las dependencias
  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  const handleAplicarFiltros = () => {
    cargarTareas(filtros);
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

  if (loading && tasks.length === 0) {
    return <div className="task-loading">⏳ Cargando...</div>;
  }

  return (
    <div className="task-container">
      <div className="task-content">
        <header className="task-header">
          <h1>📋 Mis tareas</h1>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            📊 Dashboard
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            🚪 Salir
          </Button>
        </header>

        {error && <div className="task-error">{error}</div>}

        <TaskCreate onTaskCreated={() => cargarTareas(filtros)} />

        <TaskFilters
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onAplicar={handleAplicarFiltros}
          onLimpiar={handleLimpiarFiltros}
          mostrarFiltros={mostrarFiltros}
          onToggleFiltros={() => setMostrarFiltros(!mostrarFiltros)}
        />

        {loading && (
          <div className="task-loading-overlay">
            <div className="task-spinner">⏳ Filtrando...</div>
          </div>
        )}

        {!loading && tasks.length === 0 ? (
          <div className="task-empty">
            <p>📭 No se encontraron tareas</p>
            <p className="task-empty-sub">
              {filtros.busqueda || filtros.estado || filtros.importancia
                ? "Intenta ajustar los filtros"
                : "Crea tu primera tarea para comenzar"}
            </p>
          </div>
        ) : (
          <div className="task-results-info">
            <p>
              📊 Mostrando <strong>{tasks.length}</strong> tarea{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={actualizarTarea}
            onRequestDelete={setTaskToDelete}
          />
        ))}

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
  );
}