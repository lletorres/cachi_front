import { useEffect, useState } from "react";
import {
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "../services/api";
import { useUser } from "../context/UserContext";

export default function Restaurants() {
  const { user } = useUser(); // usuario actual
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [visiblePhones, setVisiblePhones] = useState({});
  const [editData, setEditData] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    especialidad: "",
    telefono: "",
    imagen: "",
  });

  // Cargar restaurantes al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error al cargar restaurantes:", error);
      }
    };
    fetchData();
  }, []);

  // Crear restaurante (solo admin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Iniciando creación de restaurante...");
      const nuevoRestaurante = {
        nombre,
        descripcion,
        direccion,
        especialidad,
        telefono,
        imagen,
        categoria: null,
      };

      await createRestaurant(nuevoRestaurante);
      console.log("Restaurante creado exitosamente");
      setSuccess("Restaurante agregado correctamente 🍽️");

      // limpiar campos
      setNombre("");
      setDescripcion("");
      setDireccion("");
      setEspecialidad("");
      setTelefono("");
      setImagen("");

      // recargar lista
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError("Error al crear restaurante");
    }
  };

  // Mostrar teléfono o modal
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

  // Eliminar restaurante
  const handleDeleteClick = (id) => {
    setRestaurantToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteRestaurant = async () => {
    try {
      await deleteRestaurant(restaurantToDelete);
      setRestaurants((prev) =>
        prev.filter((r) => r._id !== restaurantToDelete)
      );
      setSuccess("Restaurante eliminado correctamente 🗑️");
    } catch (err) {
      setError("Error al eliminar restaurante");
    } finally {
      setConfirmDelete(false);
      setRestaurantToDelete(null);
    }
  };

  // Editar restaurante
  const handleEditClick = (r) => {
    setEditingRestaurant(r);
    setEditData({
      nombre: r.nombre,
      descripcion: r.descripcion,
      direccion: r.direccion,
      especialidad: r.especialidad,
      telefono: r.telefono,
      imagen: r.imagen,
    });
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateRestaurant(editingRestaurant._id, editData);
      setRestaurants((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setEditingRestaurant(null);
      setSuccess("Restaurante actualizado correctamente ✅");
    } catch (err) {
      setError("Error al actualizar restaurante");
    }
  };

  const closeModal = () => setShowModal(false);
  const closeConfirm = () => setConfirmDelete(false);
  const closeEdit = () => setEditingRestaurant(null);

  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4">Restaurantes</h2>

      {/* Formulario solo para admin */}
      {user?.rol === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="bg-dark p-4 rounded shadow mx-auto mt-5"
          style={{ maxWidth: "600px", marginBottom: "3rem" }}
        >
          <h4 className="mb-3">Agregar nuevo restaurante</h4>

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
            type="text"
            className="form-control mb-3"
            placeholder="Especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
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
          <button type="submit" className="btn btn-primary w-100">
            Guardar restaurante
          </button>

          {success && <div className="alert alert-success mt-3">{success}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      )}

      {/* Listado de restaurantes */}
      <div className="row">
        {restaurants.map((r) => (
          <div key={r._id} className="col-md-4 mb-4">
            <div className="card bg-dark text-light h-100">
              {r.imagen && (
                <img
                  src={r.imagen}
                  alt={r.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{r.nombre}</h5>
                <p className="card-text">{r.descripcion}</p>
                <p className="text-white mb-1">📍 {r.direccion}</p>
                <p className="text-white mb-1">🍴 {r.especialidad}</p>

                {visiblePhones[r._id] ? (
                  <p className="text-info mt-3 fw-bold">📞 {r.telefono}</p>
                ) : (
                  <button
                    onClick={() => handleVerContacto(r._id)}
                    className="btn btn-outline-info mt-2 w-100"
                  >
                    Ver contacto
                  </button>
                )}

                {user?.rol === "admin" && (
                  <>
                    <button
                      onClick={() => handleEditClick(r)}
                      className="btn btn-outline-warning mt-2 w-100"
                    >
                      Editar restaurante
                    </button>
                    <button
                      onClick={() => handleDeleteClick(r._id)}
                      className="btn btn-outline-danger mt-2 w-100"
                    >
                      Eliminar restaurante
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal genérico */}
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
                <p>¿Seguro que deseas eliminar este restaurante?</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center gap-2">
                <button
                  className="btn btn-danger w-50"
                  onClick={confirmDeleteRestaurant}
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
      {editingRestaurant && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Editar restaurante</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeEdit}
                ></button>
              </div>
              <div className="modal-body">
                {Object.keys(editData).map((field) => (
                  <div className="mb-3" key={field}>
                    <label>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData[field]}
                      onChange={(e) =>
                        setEditData({ ...editData, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
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
