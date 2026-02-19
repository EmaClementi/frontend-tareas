import { useState } from "react";
import { Button } from "../Button/Button";
import { FormInput } from "../FormInput/FormInput";
import "./TaskFilters.css";

export type FiltrosState = {
  busqueda: string;
  estado: string;
  importancia: string;
  fechaDesde: string;
  fechaHasta: string;
  soloVencidas: boolean;
  diasDuracion: string;
  ordenarPor: string;
  direccion: string;
};

type Props = {
  filtros: FiltrosState;
  onFiltrosChange: (filtros: FiltrosState) => void;
  onAplicar: (filtrosCustom?: FiltrosState) => void;
  onLimpiar: () => void;
  mostrarFiltros: boolean;
  onToggleFiltros: () => void;
};

export function TaskFilters({
  filtros,
  onFiltrosChange,
  onAplicar,
  onLimpiar,
  mostrarFiltros,
  onToggleFiltros,
}: Props) {
  const [filtrosAbiertos, setFiltrosAbiertos] = useState({
    fechas: false,
    avanzados: false,
  });

  const handleChange = (campo: keyof FiltrosState, valor: unknown) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    });
  };


  const aplicarOrdenamiento = (ordenarPor: string, direccion: string) => {
    const nuevosFiltros: FiltrosState = {
      ...filtros,
      ordenarPor,
      direccion
    };

    // Actualizar estado local
    onFiltrosChange(nuevosFiltros);

    // Aplicar inmediatamente con los nuevos filtros
    onAplicar(nuevosFiltros);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.busqueda) count++;
    if (filtros.estado) count++;
    if (filtros.importancia) count++;
    if (filtros.fechaDesde && filtros.fechaHasta) count++;
    if (filtros.soloVencidas) count++;
    if (filtros.diasDuracion) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <div className="task-filters-container">
      {/* Barra de búsqueda principal */}
      <div className="task-search-bar">
        <div className="task-search-input-wrapper">
          <span className="task-search-icon">🔍</span>
          <input
            type="text"
            className="task-search-input"
            placeholder="Buscar tareas por nombre o descripción..."
            value={filtros.busqueda}
            onChange={(e) => handleChange("busqueda", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAplicar()}
          />
          {filtros.busqueda && (
            <button
              className="task-search-clear"
              onClick={() => handleChange("busqueda", "")}
            >
              ✕
            </button>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={onToggleFiltros}
        >
          🎯 Filtros {filtrosActivos > 0 && `(${filtrosActivos})`}
        </Button>

        <Button variant="primary" onClick={() => onAplicar()}>
          Buscar
        </Button>
      </div>

      {/* Panel lateral de filtros */}
      {mostrarFiltros && (
        <div className="task-filters-panel">
          <div className="task-filters-header">
            <h3>🎯 Filtros</h3>
            <button className="task-filters-close" onClick={onToggleFiltros}>
              ✕
            </button>
          </div>

          <div className="task-filters-content">
            {/* Filtros rápidos */}
            <div className="task-filters-section">
              <h4>⚡ Filtros rápidos</h4>
              <div className="task-quick-filters">
                <button
                  className={`task-quick-filter ${filtros.soloVencidas ? "active" : ""}`}
                  onClick={() => handleChange("soloVencidas", !filtros.soloVencidas)}
                >
                  ⚠️ Vencidas
                </button>
              </div>
            </div>


            <div className="task-filters-section">
              <h4>🔀 Ordenamiento</h4>
              <div className="task-quick-filters">
                <button
                  className={`task-quick-filter ${!filtros.ordenarPor ? "active" : ""}`}
                  onClick={() => aplicarOrdenamiento("", "ASC")}
                  title="Orden inteligente: vencidas primero, luego por importancia y fecha"
                >
                  ⚡ Inteligente
                </button>

                <button
                  className={`task-quick-filter ${filtros.ordenarPor === "fechaVencimiento" ? "active" : ""}`}
                  onClick={() => aplicarOrdenamiento("fechaVencimiento", "ASC")}
                >
                  📅 Por fecha
                </button>

                <button
                  className={`task-quick-filter ${filtros.ordenarPor === "importancia" ? "active" : ""}`}
                  onClick={() => aplicarOrdenamiento("importancia", "DESC")}
                >
                  ⚡ Por importancia
                </button>

                <button
                  className={`task-quick-filter ${filtros.ordenarPor === "fechaCreacion" ? "active" : ""}`}
                  onClick={() => aplicarOrdenamiento("fechaCreacion", "DESC")}
                >
                  🆕 Más recientes
                </button>
              </div>

              {/* Tooltip explicativo */}
              {!filtros.ordenarPor && (
                <div className="task-sort-explanation">
                  <p>
                    <small>
                      <strong>Orden inteligente:</strong>
                      <br />
                      1️⃣ Tareas vencidas (más urgentes primero)
                      <br />
                      2️⃣ Vencen hoy
                      <br />
                      3️⃣ Por importancia (Alta → Media → Baja)
                      <br />
                      4️⃣ Por fecha de vencimiento
                      <br />
                      5️⃣ Completadas y canceladas al final
                    </small>
                  </p>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="task-filters-section">
              <h4>📊 Estado</h4>
              <FormInput
                type="select"
                value={filtros.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                options={[
                  { value: "", label: "Todos los estados" },
                  { value: "PENDIENTE", label: "Pendiente" },
                  { value: "EN_PROGRESO", label: "En Progreso" },
                  { value: "COMPLETADA", label: "Completada" },
                  { value: "CANCELADA", label: "Cancelada" },
                ]}
              />
            </div>

            {/* Importancia */}
            <div className="task-filters-section">
              <h4>⚡ Importancia</h4>
              <FormInput
                type="select"
                value={filtros.importancia}
                onChange={(e) => handleChange("importancia", e.target.value)}
                options={[
                  { value: "", label: "Todas las importancias" },
                  { value: "BAJA", label: "Baja" },
                  { value: "MEDIA", label: "Media" },
                  { value: "ALTA", label: "Alta" },
                ]}
              />
            </div>

            {/* Fechas */}
            <div className="task-filters-section">
              <button
                className="task-filters-section-toggle"
                onClick={() =>
                  setFiltrosAbiertos((prev) => ({
                    ...prev,
                    fechas: !prev.fechas,
                  }))
                }
              >
                <h4>📅 Filtrar por fechas</h4>
                <span>{filtrosAbiertos.fechas ? "▼" : "▶"}</span>
              </button>

              {filtrosAbiertos.fechas && (
                <div className="task-filters-subsection">
                  <FormInput
                    type="date"
                    label="Desde"
                    value={filtros.fechaDesde}
                    onChange={(e) => handleChange("fechaDesde", e.target.value)}
                  />
                  <FormInput
                    type="date"
                    label="Hasta"
                    value={filtros.fechaHasta}
                    onChange={(e) => handleChange("fechaHasta", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Filtros avanzados */}
            <div className="task-filters-section">
              <button
                className="task-filters-section-toggle"
                onClick={() =>
                  setFiltrosAbiertos((prev) => ({
                    ...prev,
                    avanzados: !prev.avanzados,
                  }))
                }
              >
                <h4>⚙️ Filtros avanzados</h4>
                <span>{filtrosAbiertos.avanzados ? "▼" : "▶"}</span>
              </button>

              {filtrosAbiertos.avanzados && (
                <div className="task-filters-subsection">
                  <FormInput
                    type="number"
                    label="Duración en días"
                    placeholder="Ej: 7"
                    value={filtros.diasDuracion}
                    onChange={(e) => handleChange("diasDuracion", e.target.value)}
                    min={1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="task-filters-actions">
            <Button variant="primary" onClick={() => onAplicar()}>
              Aplicar filtros
            </Button>
            <Button variant="secondary" onClick={onLimpiar}>
              Limpiar todo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
