import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/UserAuth";
import { ThemeToggle } from "../../Components/ThemeToggle/ThemeToggle";
import { AnimatedPage } from "../../Components/AnimatedPage";
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
    <AnimatedPage>
      <div className="home-container">
        <div className="theme-toggle-wrapper">
          <ThemeToggle />
        </div>

        {/* Decorative orbs */}
        <div className="home-orb home-orb-1"></div>
        <div className="home-orb home-orb-2"></div>
        <div className="home-orb home-orb-3"></div>

        <div className="home-hero">
          <div className="home-icon-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>

          <h1 className="home-title">Task Manager</h1>

          <p className="home-subtitle">
            Organiza tus tareas de forma simple y eficiente.<br />
            Mantén el control de lo que debes hacer y aumenta tu productividad.
          </p>

          <div className="home-features">
            <div className="home-feature-card">
              <div className="feature-icon-wrapper feature-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="feature-label">Crear Tareas</span>
            </div>
            <div className="home-feature-card">
              <div className="feature-icon-wrapper feature-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-8 4 5 4-10" />
                </svg>
              </div>
              <span className="feature-label">Seguimiento</span>
            </div>
            <div className="home-feature-card">
              <div className="feature-icon-wrapper feature-icon-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="feature-label">Prioridades</span>
            </div>
          </div>

          <div className="home-actions">
            {!isAuthenticated ? (
              <>
                <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate("/register")}>
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" size="lg" onClick={() => navigate("/tareas")}>
                  Ver mis tareas
                </Button>
                <Button variant="secondary" size="lg" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </div>
        </div>

        <footer className="home-footer">
          Task Manager &copy; {new Date().getFullYear()} — Hecho con 💜
        </footer>
      </div>
    </AnimatedPage>
  );
}
