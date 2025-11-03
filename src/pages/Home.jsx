import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExcursiones,
  getRestaurants,
  getAlojamientos,
} from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [excursiones, setExcursiones] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [excursionesData, restaurantesData, alojamientosData] =
          await Promise.all([
            getExcursiones(),
            getRestaurants(),
            getAlojamientos(),
          ]);
        setExcursiones(excursionesData.slice(0, 3));
        setRestaurantes(restaurantesData.slice(0, 3));
        setAlojamientos(alojamientosData.slice(0, 3));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="hero bg-dark text-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">Descubrí Cachi</h1>
              <p className="lead mb-4">
                Explorá los valles calchaquíes, sus sabores únicos y paisajes
                inolvidables. Tu próxima aventura empieza acá.
              </p>
              <div className="d-flex gap-3">
                <button
                  onClick={() => navigate("/excursiones")}
                  className="btn btn-primary btn-lg"
                >
                  Ver excursiones
                </button>
                <button
                  onClick={() => navigate("/alojamientos")}
                  className="btn btn-outline-light btn-lg"
                >
                  Alojamientos
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Cachi"
                className="img-fluid rounded shadow-lg"
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* EXCURSIONES */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 text-light mb-1">🏔️ Excursiones destacadas</h2>
              <p className="text-light mb-0">
                Aventuras en los valles calchaquíes
              </p>
            </div>
            <button
              onClick={() => navigate("/excursiones")}
              className="btn btn-outline-light btn-sm"
            >
              Ver todas →
            </button>
          </div>
          <div className="row g-4">
            {excursiones.map((exc) => (
              <div key={exc._id} className="col-md-4">
                <div
                  className="card bg-dark text-light h-100 border-secondary hover-card clickable-card"
                  onClick={() => navigate("/excursiones")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={exc.imagen}
                    alt={exc.nombre}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {exc.categoria?.nombre && (
                      <span className="badge bg-primary mb-2">
                        {exc.categoria.nombre}
                      </span>
                    )}
                    <h5 className="card-title">{exc.nombre}</h5>
                    <p className="card-text text-light small">
                      {exc.descripcion.substring(0, 80)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="text-warning fw-bold">
                        ${exc.precio}
                      </span>
                      <span className="small text-light">
                        ⏱️ {exc.duracion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANTES */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(to bottom, #1a1a1a, #0d0d0d)" }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 text-light mb-1">🍴 Gastronomía local</h2>
              <p className="text-light mb-0">Sabores auténticos de la región</p>
            </div>
            <button
              onClick={() => navigate("/restaurantes")}
              className="btn btn-outline-light btn-sm"
            >
              Ver todos →
            </button>
          </div>
          <div className="row g-4">
            {restaurantes.map((rest) => (
              <div key={rest._id} className="col-md-4">
                <div
                  className="card bg-dark text-light h-100 border-secondary hover-card clickable-card"
                  onClick={() => navigate("/restaurantes")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={rest.imagen}
                    alt={rest.nombre}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {rest.categoria?.nombre && (
                      <span className="badge bg-success mb-2">
                        {rest.categoria.nombre}
                      </span>
                    )}
                    <h5 className="card-title">{rest.nombre}</h5>
                    <p className="card-text text-light small">
                      {rest.descripcion.substring(0, 80)}...
                    </p>
                    <div className="mt-3">
                      <span className="small text-warning">
                        ✨ {rest.especialidad}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALOJAMIENTOS */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 text-light mb-1">🏡 Donde alojarte</h2>
              <p className="text-light mb-0">Descansá en los mejores lugares</p>
            </div>
            <button
              onClick={() => navigate("/alojamientos")}
              className="btn btn-outline-light btn-sm"
            >
              Ver todos →
            </button>
          </div>
          <div className="row g-4">
            {alojamientos.map((aloj) => (
              <div key={aloj._id} className="col-md-4">
                <div
                  className="card bg-dark text-light h-100 border-secondary hover-card clickable-card"
                  onClick={() => navigate("/alojamientos")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={aloj.imagen}
                    alt={aloj.nombre}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {aloj.categoria?.nombre && (
                      <span className="badge bg-info mb-2">
                        {aloj.categoria.nombre}
                      </span>
                    )}
                    <h5 className="card-title">{aloj.nombre}</h5>
                    <p className="card-text text-light small">
                      {aloj.descripcion.substring(0, 80)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="text-success fw-bold">
                        ${aloj.precioPorNoche}
                      </span>
                      <span className="small text-light">por noche</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .clickable-card:hover {
          border-color: #667eea !important;
        }
      `}</style>
    </>
  );
}
