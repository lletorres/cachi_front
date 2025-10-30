import { useState, useEffect } from "react";
import { getUsers, loginUser } from "../services/api";
import { useUser } from "../context/UserContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Manejador de login
  const { user, login } = useUser(); // 👈 accedemos a la función login del contexto
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(email, password);
      // Guardamos el token para usarlo en futuras peticiones
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }

      // Actualizamos el contexto global con los datos del usuario

      // 👇 Usamos el contexto para guardar el usuario globalmente
      login(data.user || data);

      alert("Inicio de sesión exitoso");

      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  // 🔹 Si hay usuario logueado, traer usuarios del backend
  // useEffect(() => {
  //   if (user) {
  //     getUsers().then(setUsers).catch(console.error);
  //   }
  // }, [user]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Usuarios</h2>

      {/* FORM LOGIN */}
      {!user && (
        <form onSubmit={handleLogin} className="mb-4" style={{ maxWidth: 400 }}>
          <h4>Iniciar sesión</h4>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
      )}

      {/* LISTADO DE USUARIOS */}
      {user && (
        <>
          <div className="alert alert-success">
            Bienvenido, {user.nombre || "usuario"} 👋
          </div>
          <ul className="list-group">
            {users.map((u) => (
              <li key={u._id} className="list-group-item">
                {u.nombre} – {u.email}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
