import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { TaskCard } from "../../Components/TaskCard/TaskCard";
import { useAuth } from "../../auth/UserAuth";
import type TaskType from "../../types/Task";
import "./Task.css";

export function Task() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<TaskType[]>("/tareas")
      .then((res) => setTasks(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("❌ Error al cargar las tareas. Intenta nuevamente.");
        }
      })
      .finally(() => setLoading(false));
  }, [logout, navigate]);

  if (loading) {
    return (
      <div className="task-container">
        <div className="task-content">
          <div className="task-loading">⏳ Cargando tus tareas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-container">
      <div className="task-content">
        <header className="task-header">
          <h1>📋 Mis tareas</h1>
          <button
            className="task-logout"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Salir
          </button>
        </header>

        {error && <div className="task-error">{error}</div>}

        {tasks.length === 0 ? (
          <div className="task-empty">
            <p>📭 No tienes tareas aún</p>
            <p className="task-empty-sub">
              Comienza a crear tareas para organizarte mejor
            </p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
