import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../../auth/AuthService";
import { useAuth } from "../../auth/UserAuth";
import { FormInput } from "../../Components/FormInput/FormInput";
import { Button } from "../../Components/Button/Button";
import { useFormError } from "../../hooks/useFormError";
import { AnimatedPage } from "../../Components/AnimatedPage";
import "../../styles/auth-shared.css";
import "./Login.css";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useFormError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const token = await loginService(email, clave);
      login(token);
      navigate("/tareas");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="auth-container">
        <div className="auth-card login-card">
          <h1 className="auth-title">🔐 Iniciar sesión</h1>
          <p className="auth-subtitle">
            Accede a tu cuenta para gestionar tus tareas
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Entrar"}
            </Button>
          </form>

          <div className="auth-links">
            ¿No tienes cuenta?{" "}
            <Link to="/register">Regístrate aquí</Link>
          </div>

          <div className="auth-links">
            <Link to="/">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}