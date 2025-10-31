import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [successModal, setSuccessModal] = useState(false); // ✅ nuevo modal de confirmación
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "user",
  });

  // 🔹 Cargar usuarios
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users || data))
      .catch((err) => console.error("Error al traer usuarios:", err));
  }, []);

  // ✏️ Abrir modal de edición
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol || user.role || "user",
    });
  };

  // 📩 Manejar cambios del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Guardar cambios
  const handleUpdate = async () => {
    try {
      const updated = await updateUser(editingUser._id, formData);
      setUsers(users.map((u) => (u._id === updated._id ? updated : u)));
      setEditingUser(null);
      setSuccessModal(true); // 👈 mostrar modal de éxito
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar el usuario");
    }
  };

  // 🗑️ Abrir modal de confirmación
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  // 🗑️ Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      await deleteUser(deletingUser._id);
      setUsers(users.filter((u) => u._id !== deletingUser._id));
      setDeletingUser(null);
      setSuccessModal(true); // 👈 reutilizamos el mismo modal para éxito
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("❌ Error al eliminar el usuario");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-light">Panel de Administración</h2>
      <p className="text-muted">Gestión de usuarios</p>

      <table className="table table-dark table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.email}</td>
                <td className={u.rol === "admin" ? "text-warning fw-bold" : ""}>
                  {u.rol || u.role}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(u)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(u)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-secondary">
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✏️ Modal de edición */}
      {editingUser && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setEditingUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleUpdate}>
                  💾 Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Modal de confirmación */}
      {deletingUser && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-danger">
              <div className="modal-header border-danger">
                <h5 className="modal-title text-danger">
                  ⚠️ Confirmar eliminación
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setDeletingUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Seguro que deseas eliminar al usuario{" "}
                  <strong>
                    {deletingUser.nombre} {deletingUser.apellido}
                  </strong>
                  ?
                </p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeletingUser(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  🗑️ Eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal de confirmación de éxito */}
      {successModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-success">
              <div className="modal-header border-success">
                <h5 className="modal-title text-success">
                  ✅ Operación exitosa
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>El usuario ha sido actualizado o eliminado correctamente.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => setSuccessModal(false)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
