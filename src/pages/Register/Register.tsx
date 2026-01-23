import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api";
import { FormInput } from "../../Components/FormImput/FormInput";
import { useFormError } from "../../hooks/useFormError";
import "./Register.css";

export function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const { error, handleError, clearError } = useFormError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await api.post("/auth/registro", {
        nombre,
        apellido,
        email,
        clave,
      });
      setOk(true);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (ok) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-success">
            <h2>✅ ¡Registro exitoso!</h2>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <p>
              Ahora podés <Link to="/login">iniciar sesión</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">📝 Registrarse</h1>
        <p className="register-subtitle">
          Crea una cuenta para empezar a gestionar tus tareas
        </p>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <FormInput
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          <FormInput
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            type="password"
            placeholder="Contraseña (6-10 caracteres)"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            minLength={6}
            maxLength={10}
          />

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="register-links">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>

        <div className="register-links">
          <Link to="/">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
