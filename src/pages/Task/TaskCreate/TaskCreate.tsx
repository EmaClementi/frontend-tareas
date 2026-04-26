import { useState } from "react";
import api from "../../../service/api";
import { useToast } from "../../../context/useToast";
import { Button } from "../../../Components/Button/Button";
import { FormInput } from "../../../Components/FormInput/FormInput";
import "./TaskCreate.css";

type TaskCreateProps = {
  onTaskCreated: () => void;
};

export function TaskCreate({ onTaskCreated }: TaskCreateProps) {
  const { success, error: showError } = useToast();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [importancia, setImportancia] = useState("MEDIA");
  const [duracionDias, setDuracionDias] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (!duracionDias && !fechaVencimiento) {
      showError("Debes especificar la duración en días o la fecha de vencimiento");
      return;
    }

    setLoading(true);

    try {
      await api.post("/tareas", {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        importancia,
        duracionDias: duracionDias || null,
        fechaInicio: fechaInicio || null,
        fechaVencimiento: fechaVencimiento || null,
      });

      setNombre("");
      setDescripcion("");
      setImportancia("MEDIA");
      setDuracionDias("");
      setFechaInicio("");
      setFechaVencimiento("");

      onTaskCreated();
      success("Tarea creada exitosamente");
    } catch (error) {
      console.error("Error al crear tarea", error);
      showError("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-create" onSubmit={handleSubmit}>
      <h2>➕ Nueva tarea</h2>


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
        label="Importancia"
        value={importancia}
        onChange={(e) => setImportancia(e.target.value)}
        options={[
          { value: "BAJA", label: "Baja" },
          { value: "MEDIA", label: "Media" },
          { value: "ALTA", label: "Alta" },
        ]}
      />

      <div className="task-dates-grid">
        <div className="task-date-field">
          <FormInput
            type="date"
            label="📅 Fecha de inicio (opcional)"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="task-date-field">
          <FormInput
            type="date"
            label="⏰ Fecha de vencimiento"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />
        </div>

        <div className="task-date-divider">
          <span>O</span>
        </div>

        <div className="task-date-field">
          <FormInput
            type="number"
            label="📆 Duración en días"
            placeholder="Ej: 7 días"
            value={duracionDias}
            onChange={(e) => setDuracionDias(e.target.value ? Number(e.target.value) : "")}
            min={1}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" disabled={loading || !nombre.trim()}>
        {loading ? "Creando..." : "Crear tarea"}
      </Button>
    </form>
  );
}