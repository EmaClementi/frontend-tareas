import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/UserAuth";
import "./Home.css";

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">📋 Task Manager</h1>

        <p className="home-description">
          Organiza tus tareas de forma simple y eficiente. Mantén el control de
          lo que debes hacer y aumenta tu productividad.
        </p>

        <div className="home-features">
          <div className="home-feature-box">
            <div className="home-feature-icon">✅</div>
            <strong>Crear Tareas</strong>
          </div>
          <div className="home-feature-box">
            <div className="home-feature-icon">📊</div>
            <strong>Seguimiento</strong>
          </div>
          <div className="home-feature-box">
            <div className="home-feature-icon">🎯</div>
            <strong>Prioridades</strong>
          </div>
        </div>

        <div className="home-button-container">
          {isAuthenticated ? (
            <>
              <button
                className="home-button home-button-primary"
                onClick={() => navigate("/tareas")}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                Ver mis tareas
              </button>
              <button
                className="home-button home-button-secondary"
                onClick={handleLogout}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="home-button home-button-primary"
                onClick={() => navigate("/login")}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                Iniciar sesión
              </button>
              <button
                className="home-button home-button-secondary"
                onClick={() => navigate("/register")}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
