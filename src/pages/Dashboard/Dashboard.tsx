import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { useToast } from "../../context/useToast";
import { useAuth } from "../../auth/UserAuth";
import { Button } from "../../Components/Button/Button";
import { StatsCard } from "../../Components/StatsCard/StatsCard";
import { ThemeToggle } from "../../Components/ThemeToggle/ThemeToggle";
import { AnimatedPage } from "../../Components/AnimatedPage";
import type Estadisticas from "../../types/Estadisticas";
import "./Dashboard.css";

export function Dashboard() {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();


  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Estadisticas>("/tareas/estadisticas");
      setStats(res.data);
    } catch {
      showError("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="dashboard-container">
          <div className="dashboard-content">
            <header className="dashboard-header">
              <div className="skeleton" style={{ width: '150px', height: '32px' }}></div>
            </header>
            <div className="dashboard-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-md)' }}></div>
              ))}
            </div>
            <div className="dashboard-charts" style={{ marginTop: '2rem' }}>
              <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
              <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!stats) {
    return (
      <AnimatedPage>
        <div className="dashboard-error">
          <p>❌ No se pudieron cargar las estadísticas</p>
          <Button variant="primary" onClick={cargarEstadisticas}>
            Reintentar
          </Button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header con navegación */}
          <header className="dashboard-header">
            <div className="dashboard-header-left">
              <h1>📊 Dashboard</h1>
              <p className="dashboard-subtitle">Resumen de tus tareas</p>
            </div>

            <div className="dashboard-header-actions">
              <ThemeToggle />
              <Button variant="secondary" onClick={() => navigate("/tareas")}>
                📋 Ver tareas
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                🚪 Salir
              </Button>
            </div>
          </header>

          {/* Cards principales */}
          <div className="dashboard-grid">
            <StatsCard
              icon="📝"
              title="Total de tareas"
              value={stats.totalTareas}
              color="blue"
            />

            <StatsCard
              icon="✅"
              title="Completadas"
              value={stats.tareasCompletadas}
              color="green"
              percentage={stats.porcentajeCompletado}
            />

            <StatsCard
              icon="⏳"
              title="Pendientes"
              value={stats.tareasPendientes}
              color="orange"
              percentage={stats.porcentajePendiente}
            />

            <StatsCard
              icon="🚧"
              title="En progreso"
              value={stats.tareasEnProgreso}
              color="purple"
              percentage={stats.porcentajeEnProgreso}
            />

            <StatsCard
              icon="⚠️"
              title="Vencidas"
              value={stats.tareasVencidas}
              color="red"
              percentage={stats.porcentajeVencido}
            />

            <StatsCard
              icon="🔥"
              title="Completadas hoy"
              value={stats.tareasCompletadasHoy}
              subtitle={`${stats.tareasCompletadasEstaSemana} esta semana`}
              color="green"
            />
          </div>

          {/* Gráficos */}
          <div className="dashboard-charts">
            {/* Distribución por estado */}
            <div className="dashboard-chart-card">
              <h3>📊 Distribución por Estado</h3>
              <div className="dashboard-chart-bars">
                {Object.entries(stats.tareasPorEstado).map(([estado, cantidad]) => (
                  <div key={estado} className="dashboard-bar-item">
                    <div className="dashboard-bar-label">
                      {estado.replace("_", " ")}
                    </div>
                    <div className="dashboard-bar-container">
                      <div
                        className={`dashboard-bar dashboard-bar-${estado.toLowerCase()}`}
                        style={{
                          width: `${(cantidad / stats.totalTareas) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="dashboard-bar-value">{cantidad}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por importancia */}
            <div className="dashboard-chart-card">
              <h3>⚡ Distribución por Importancia</h3>
              <div className="dashboard-chart-bars">
                {Object.entries(stats.tareasPorImportancia).map(
                  ([importancia, cantidad]) => (
                    <div key={importancia} className="dashboard-bar-item">
                      <div className="dashboard-bar-label">{importancia}</div>
                      <div className="dashboard-bar-container">
                        <div
                          className={`dashboard-bar dashboard-bar-${importancia.toLowerCase()}`}
                          style={{
                            width: `${(cantidad / stats.totalTareas) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="dashboard-bar-value">{cantidad}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="dashboard-summary">
            <h3>💡 Resumen</h3>
            <div className="dashboard-summary-content">
              {stats.tareasVencidas > 0 && (
                <div className="dashboard-alert dashboard-alert-warning">
                  <span className="dashboard-alert-icon">⚠️</span>
                  <div>
                    <strong>¡Atención!</strong>
                    <p>
                      Tienes {stats.tareasVencidas} tarea
                      {stats.tareasVencidas !== 1 ? "s" : ""} vencida
                      {stats.tareasVencidas !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}

              {stats.porcentajeCompletado === 100 && (
                <div className="dashboard-alert dashboard-alert-success">
                  <span className="dashboard-alert-icon">🎉</span>
                  <div>
                    <strong>¡Excelente trabajo!</strong>
                    <p>Has completado todas tus tareas</p>
                  </div>
                </div>
              )}

              {stats.porcentajeCompletado >= 50 &&
                stats.porcentajeCompletado < 100 && (
                  <div className="dashboard-alert dashboard-alert-info">
                    <span className="dashboard-alert-icon">👍</span>
                    <div>
                      <strong>¡Buen progreso!</strong>
                      <p>
                        Has completado más de la mitad de tus tareas (
                        {stats.porcentajeCompletado}%)
                      </p>
                    </div>
                  </div>
                )}

              {stats.totalTareas === 0 && (
                <div className="dashboard-alert dashboard-alert-info">
                  <span className="dashboard-alert-icon">📝</span>
                  <div>
                    <strong>Comienza ahora</strong>
                    <p>No tienes tareas creadas. ¡Crea tu primera tarea!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}