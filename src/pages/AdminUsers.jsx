import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Solo permitir acceso al admin
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Acceso denegado 🚫");
      navigate("/");
    }
  }, [navigate]);

  // Cargar usuarios desde la API
  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>
      <p className="text-muted">Gestión de usuarios</p>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(u._id)}
                >
                  Eliminar
                </button>
                <button className="btn btn-warning btn-sm">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
