import { useEffect, useState } from "react";
import {
  getAlojamientos,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
  getCategorias,
} from "../services/api";
import { useUser } from "../context/UserContext";

export default function Alojamientos() {
  const { user } = useUser();
  const [alojamientos, setAlojamientos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [precioPorNoche, setPrecioPorNoche] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [visiblePhones, setVisiblePhones] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [alojamientoToDelete, setAlojamientoToDelete] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Obtener alojamientos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alojamientosData, categoriasData] = await Promise.all([
          getAlojamientos(),
          getCategorias(),
        ]);
        setAlojamientos(alojamientosData);
        const categoriasAlojamiento = categoriasData.filter(
          (c) => c.tipo === "Alojamiento"
        );
        setCategorias(categoriasAlojamiento);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtrar alojamientos según categoría
  const alojamientosFiltrados = filtroCategoria
    ? alojamientos.filter((a) => a.categoria?._id === filtroCategoria)
    : alojamientos;

  // Crear alojamiento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = {
        nombre,
        descripcion,
        direccion,
        precioPorNoche,
        telefono,
        imagen,
        categoria: categoriaSeleccionada || null,
      };
      await createAlojamiento(data);
      setSuccess("Alojamiento creado correctamente 🏡");
      setNombre("");
      setDescripcion("");
      setDireccion("");
      setPrecioPorNoche("");
      setTelefono("");
      setImagen("");
      setCategoriaSeleccionada("");
      const updated = await getAlojamientos();
      setAlojamientos(updated);
    } catch (err) {
      setError("Error al crear alojamiento");
    }
  };

  const handleVerContacto = (id) => {
    if (user) {
      setVisiblePhones((prev) => ({ ...prev, [id]: true }));
    } else {
      setModalMessage(
        "🔒 Para ver el contacto, debe registrarse o iniciar sesión."
      );
      setShowModal(true);
    }
  };

  const handleEditClick = (a) => {
    setEditData({
      ...a,
      categoria: a.categoria?._id || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateAlojamiento(editData._id, editData);
      setAlojamientos((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setEditData(null);
      setSuccess("Alojamiento actualizado correctamente ✅");
    } catch {
      setError("Error al actualizar alojamiento");
    }
  };

  const handleDeleteClick = (id) => {
    setAlojamientoToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteAlojamiento = async () => {
    try {
      await deleteAlojamiento(alojamientoToDelete);
      setAlojamientos((prev) =>
        prev.filter((a) => a._id !== alojamientoToDelete)
      );
      setSuccess("Alojamiento eliminado correctamente 🗑️");
    } catch {
      setError("Error al eliminar alojamiento");
    } finally {
      setConfirmDelete(false);
      setAlojamientoToDelete(null);
    }
  };

  const closeModal = () => setShowModal(false);
  const closeConfirm = () => setConfirmDelete(false);
  const closeEdit = () => setEditData(null);

  const getNombreCategoria = (categoriaObj) => {
    if (!categoriaObj) return "";
    if (categoriaObj.nombre) return categoriaObj.nombre;
    const cat = categorias.find((c) => c._id === categoriaObj);
    return cat ? cat.nombre : "";
  };

  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4 text-center">Alojamientos en Cachi</h2>

      {/* Filtro de categorías */}
      <div className="mb-4">
        <label className="form-label">Filtrar por categoría:</label>
        <select
          className="form-select"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ maxWidth: "300px" }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario solo para admin */}
      {user?.rol === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="bg-dark p-4 rounded shadow mx-auto"
          style={{ maxWidth: "600px", marginBottom: "3rem" }}
        >
          <h4 className="mb-3">Agregar nuevo alojamiento</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-3"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Precio por noche"
            value={precioPorNoche}
            onChange={(e) => setPrecioPorNoche(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="URL de la imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
          <select
            className="form-select mb-3"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary w-100">
            Guardar alojamiento
          </button>
          {success && <div className="alert alert-success mt-3">{success}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      )}

      {/* Listado */}
      <div className="row">
        {alojamientosFiltrados.map((a) => (
          <div key={a._id} className="col-md-4 mb-4">
            <div className="card bg-dark text-light h-100">
              {a.imagen && (
                <img
                  src={a.imagen}
                  alt={a.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{a.nombre}</h5>
                {a.categoria && (
                  <span className="badge bg-primary mb-2">
                    {getNombreCategoria(a.categoria)}
                  </span>
                )}
                <p className="card-text">{a.descripcion}</p>
                <p className="text-white mb-1">📍 {a.direccion}</p>
                <p className="text-white mb-1">
                  💰 ${a.precioPorNoche} / noche
                </p>

                {visiblePhones[a._id] ? (
                  <p className="text-info mt-3 fw-bold">📞 {a.telefono}</p>
                ) : (
                  <button
                    onClick={() => handleVerContacto(a._id)}
                    className="btn btn-outline-info mt-2 w-100"
                  >
                    Ver contacto
                  </button>
                )}

                {user?.rol === "admin" && (
                  <>
                    <button
                      onClick={() => handleEditClick(a)}
                      className="btn btn-outline-warning mt-2 w-100"
                    >
                      Editar alojamiento
                    </button>
                    <button
                      onClick={() => handleDeleteClick(a._id)}
                      className="btn btn-outline-danger mt-2 w-100"
                    >
                      Eliminar alojamiento
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de login requerido */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light text-center p-4">
              <h5>Información</h5>
              <p className="mt-2">{modalMessage}</p>
              <button
                className="btn btn-outline-light mt-3"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
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
                  onClick={closeConfirm}
                ></button>
              </div>
              <div className="modal-body d-flex justify-content-center gap-2">
                <p>¿Seguro que deseas eliminar este alojamiento?</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                <button
                  className="btn btn-danger w-50"
                  onClick={confirmDeleteAlojamiento}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={closeConfirm}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {editData && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Editar alojamiento</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeEdit}
                ></button>
              </div>
              <div className="modal-body">
                {[
                  "nombre",
                  "descripcion",
                  "direccion",
                  "precioPorNoche",
                  "telefono",
                  "imagen",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData[field] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label>Categoría</label>
                  <select
                    className="form-select"
                    value={editData.categoria || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, categoria: e.target.value })
                    }
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-success w-50" onClick={handleUpdate}>
                  Guardar cambios
                </button>
                <button className="btn btn-secondary w-50" onClick={closeEdit}>
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
