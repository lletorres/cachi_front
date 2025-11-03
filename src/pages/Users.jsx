import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const { user, login, logout } = useUser();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPassword("");
  };

  // Iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(email, password);
      login(data.user || data);
      sessionStorage.setItem("token", data.token);
      setSuccess("Inicio de sesión exitoso 🎉");
      resetForm();
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  // Registrar usuario nuevo
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await registerUser(nombre, apellido, email, password);
      setSuccess("Usuario creado correctamente ✅ Ahora podés iniciar sesión.");
      resetForm();
      setIsRegister(false);
    } catch (err) {
      setError("Error al crear el usuario. Verificá los datos.");
    }
  };

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("token");
    setSuccess("Sesión cerrada correctamente 👋");
  };

  // 👇 NUEVO: Si ya hay sesión activa, mostrar mensaje
  if (user) {
    return (
      <div className="container mt-5 text-light">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-dark text-light shadow">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <span className="display-1">✅</span>
                </div>
                <h3 className="mb-3">Sesión activa</h3>
                <p className="text-muted mb-1">Bienvenido/a</p>
                <h5 className="mb-4">
                  {user.nombre} {user.apellido}
                </h5>

                {success && (
                  <div className="alert alert-success mb-3">{success}</div>
                )}

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/")}
                  >
                    Ir al inicio
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 👇 Si NO hay sesión, mostrar formulario de login/registro
  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4 text-center">
        {isRegister ? "Registro de nuevo usuario" : "Iniciar sesión"}
      </h2>
      <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="bg-dark p-4 rounded shadow"
        >
          {isRegister && (
            <>
              <div className="mb-3">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "Registrarse" : "Ingresar"}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link text-light"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
            >
              {isRegister
                ? "¿Ya tenés cuenta? Iniciá sesión"
                : "¿No tenés cuenta? Registrate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
