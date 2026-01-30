import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/UserAuth";
import { Button } from "../../Components/Button/Button";
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
              <Button variant="primary" onClick={() => navigate("/tareas")}>
                Ver mis tareas
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>
              <Button variant="secondary" onClick={() => navigate("/register")}>
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}