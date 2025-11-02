import { useEffect, useState } from "react";
import {
  getExcursiones,
  createExcursion,
  updateExcursion,
  deleteExcursion,
  getCategorias,
} from "../services/api";
import { useUser } from "../context/UserContext";

export default function Excursiones() {
  const { user } = useUser();
  const [excursiones, setExcursiones] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [precio, setPrecio] = useState("");
  const [lugarSalida, setLugarSalida] = useState("");
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
  const [excursionToDelete, setExcursionToDelete] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Obtener excursiones y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [excursionesData, categoriasData] = await Promise.all([
          getExcursiones(),
          getCategorias(),
        ]);
        console.log("Excursiones cargadas:", excursionesData);
        console.log(
          "Categorías de excursión:",
          categoriasData.filter((c) => c.tipo === "Excursion")
        );
        setExcursiones(excursionesData);
        const categoriasExcursion = categoriasData.filter(
          (c) => c.tipo === "Excursion"
        );
        setCategorias(categoriasExcursion);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtrar excursiones según categoría
  const excursionesFiltradas = filtroCategoria
    ? excursiones.filter((e) => e.categoria?._id === filtroCategoria)
    : excursiones;

  // Crear excursión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = {
        nombre,
        descripcion,
        duracion,
        precio,
        lugarSalida,
        telefono,
        imagen,
        categoria: categoriaSeleccionada || null,
      };
      await createExcursion(data);
      setSuccess("Excursión creada correctamente 🏔️");
      setNombre("");
      setDescripcion("");
      setDuracion("");
      setPrecio("");
      setLugarSalida("");
      setTelefono("");
      setImagen("");
      setCategoriaSeleccionada("");
      const updated = await getExcursiones();
      setExcursiones(updated);
    } catch (err) {
      setError("Error al crear excursión");
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

  const handleEditClick = (e) => {
    setEditData({
      nombre: e.nombre || "",
      descripcion: e.descripcion || "",
      duracion: e.duracion || "",
      precio: e.precio || "",
      lugarSalida: e.lugarSalida || "",
      telefono: e.telefono || "",
      imagen: e.imagen || "",
      _id: e._id,
      categoria: e.categoria?._id || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateExcursion(editData._id, editData);
      setExcursiones((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
      setEditData(null);
      setSuccess("Excursión actualizada correctamente ✅");
    } catch {
      setError("Error al actualizar excursión");
    }
  };

  const handleDeleteClick = (id) => {
    setExcursionToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteExcursion = async () => {
    try {
      await deleteExcursion(excursionToDelete);
      setExcursiones((prev) => prev.filter((e) => e._id !== excursionToDelete));
      setSuccess("Excursión eliminada correctamente 🗑️");
    } catch {
      setError("Error al eliminar excursión");
    } finally {
      setConfirmDelete(false);
      setExcursionToDelete(null);
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
      <h2 className="mb-4 text-center">Excursiones en Cachi</h2>

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
          <h4 className="mb-3">Agregar nueva excursión</h4>
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
            placeholder="Duración (ej: 4 horas)"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Lugar de salida"
            value={lugarSalida}
            onChange={(e) => setLugarSalida(e.target.value)}
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
            Guardar excursión
          </button>
          {success && <div className="alert alert-success mt-3">{success}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      )}

      {/* Listado */}
      <div className="row">
        {excursionesFiltradas.map((e) => (
          <div key={e._id} className="col-md-4 mb-4">
            <div className="card bg-dark text-light h-100">
              {e.imagen && (
                <img
                  src={e.imagen}
                  alt={e.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{e.nombre}</h5>
                {e.categoria && (
                  <span className="badge bg-primary mb-2">
                    {getNombreCategoria(e.categoria)}
                  </span>
                )}
                <p className="card-text">{e.descripcion}</p>
                <p className="text-white mb-1">⏱️ {e.duracion}</p>
                <p className="text-white mb-1">💰 ${e.precio}</p>
                <p className="text-white mb-1">📍 {e.lugarSalida}</p>

                {visiblePhones[e._id] ? (
                  <p className="text-info mt-3 fw-bold">📞 {e.telefono}</p>
                ) : (
                  <button
                    onClick={() => handleVerContacto(e._id)}
                    className="btn btn-outline-info mt-2 w-100"
                  >
                    Ver contacto
                  </button>
                )}

                {user?.rol === "admin" && (
                  <>
                    <button
                      onClick={() => handleEditClick(e)}
                      className="btn btn-outline-warning mt-2 w-100"
                    >
                      Editar excursión
                    </button>
                    <button
                      onClick={() => handleDeleteClick(e._id)}
                      className="btn btn-outline-danger mt-2 w-100"
                    >
                      Eliminar excursión
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
                <p>¿Seguro que deseas eliminar esta excursión?</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                <button
                  className="btn btn-danger w-50"
                  onClick={confirmDeleteExcursion}
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
                <h5 className="modal-title">Editar excursión</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeEdit}
                ></button>
              </div>
              <div className="modal-body">
                {[
                  "nombre",
                  "descripcion",
                  "duracion",
                  "precio",
                  "lugarSalida",
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
