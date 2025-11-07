import { useEffect, useState } from "react";
import { getCategorias } from "../services/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function AdminCategories() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("Alojamiento");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  // Redirigir si no es admin
  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Cargar categorías
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  // Crear categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion, tipo }),
      });

      if (!res.ok) throw new Error("Error al crear categoría");

      setSuccess("Categoría creada correctamente ✅");
      setNombre("");
      setDescripcion("");
      setTipo("Alojamiento");
      fetchCategorias();
    } catch (err) {
      setError("Error al crear categoría");
    }
  };

  // Editar categoría
  const handleEditClick = (cat) => {
    setEditingCategoria(cat);
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/categorias/${editingCategoria._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingCategoria),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      setSuccess("Categoría actualizada correctamente ✅");
      setEditingCategoria(null);
      fetchCategorias();
    } catch (err) {
      setError("Error al actualizar categoría");
    }
  };

  // Eliminar categoría
  const handleDeleteClick = (id) => {
    setCategoriaToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteCategoria = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/categorias/${categoriaToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      setSuccess("Categoría eliminada correctamente 🗑️");
      fetchCategorias();
    } catch (err) {
      setError("Error al eliminar categoría");
    } finally {
      setConfirmDelete(false);
      setCategoriaToDelete(null);
    }
  };

  // Agrupar por tipo
  const categoriasPorTipo = {
    Alojamiento: categorias.filter((c) => c.tipo === "Alojamiento"),
    Excursion: categorias.filter((c) => c.tipo === "Excursion"),
    Restaurante: categorias.filter((c) => c.tipo === "Restaurante"),
  };

  if (!user || user.rol !== "admin") {
    return null;
  }

  return (
    <div className="container mt-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Categorías</h2>
      </div>

      {/* Formulario crear */}
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-4 rounded shadow mb-5"
        style={{ maxWidth: "600px" }}
      >
        <h4 className="mb-3">Crear nueva categoría</h4>

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
          <label>Descripción</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="Alojamiento">Alojamiento</option>
            <option value="Excursion">Excursión</option>
            <option value="Restaurante">Restaurante</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear categoría
        </button>

        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>

      {/* Listado por tipo */}
      <div className="row g-4">
        {Object.entries(categoriasPorTipo).map(([tipo, cats]) => (
          <div key={tipo} className="col-md-4">
            <div className="card bg-dark border-secondary">
              <div className="card-header">
                <h5 className="mb-0">
                  {tipo === "Excursion" ? "Excursiones" : tipo + "s"}
                  <span className="badge bg-primary ms-2">{cats.length}</span>
                </h5>
              </div>
              <div className="card-body">
                {cats.length === 0 ? (
                  <p className="text-muted small">No hay categorías</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {cats.map((cat) => (
                      <div
                        key={cat._id}
                        className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-start"
                      >
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{cat.nombre}</h6>
                          <small className="text-muted">
                            {cat.descripcion}
                          </small>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEditClick(cat)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(cat._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal editar */}
      {editingCategoria && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Editar categoría</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setEditingCategoria(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingCategoria.nombre}
                    onChange={(e) =>
                      setEditingCategoria({
                        ...editingCategoria,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingCategoria.descripcion || ""}
                    onChange={(e) =>
                      setEditingCategoria({
                        ...editingCategoria,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Tipo</label>
                  <select
                    className="form-select"
                    value={editingCategoria.tipo}
                    onChange={(e) =>
                      setEditingCategoria({
                        ...editingCategoria,
                        tipo: e.target.value,
                      })
                    }
                  >
                    <option value="Alojamiento">Alojamiento</option>
                    <option value="Excursion">Excursión</option>
                    <option value="Restaurante">Restaurante</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-success w-50" onClick={handleUpdate}>
                  Guardar cambios
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setEditingCategoria(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setConfirmDelete(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Seguro que deseas eliminar esta categoría?</p>
                <p className="text-warning small">
                  ⚠️ Los elementos asociados quedarán sin categoría
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-danger w-50"
                  onClick={confirmDeleteCategoria}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
