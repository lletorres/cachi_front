import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useUser } from "../context/UserContext";

export default function Users() {
  const { login } = useUser();
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

  // 🔑 Iniciar sesión
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

  // 🆕 Registrar usuario nuevo
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

  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4">
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
