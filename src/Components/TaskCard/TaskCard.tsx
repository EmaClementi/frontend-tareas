import "./TaskCard.css";
import type Task from "../../types/Task";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  return (
    <div className="task-card">
      <h3 className="task-card__title">{task.nombre}</h3>

      <p className="task-card__description">
        {task.descripcion || "Sin descripción"}
      </p>

      <div className="task-card__meta">
        <span className="task-card__estado">
          <strong>Estado:</strong> {task.estado}
        </span>

        <span className="task-card__importancia">
          <strong>Importancia:</strong> {task.importancia}
        </span>
      </div>
    </div>
  );
}
