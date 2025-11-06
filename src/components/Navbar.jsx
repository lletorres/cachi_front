import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/cachiexplorer.png";

export default function Navbar() {
  const { user, logout } = useUser();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass sticky-top py-2">
      {/* 👆 Agregá py-2 para reducir padding vertical */}
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold d-flex align-items-center"
          to="../pages/Home.jsx"
        >
          <img
            src={logo}
            alt="Cachi Explorer"
            style={{
              height: "70px",
              width: "auto",
            }}
          />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/excursiones">
                Excursiones
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/restaurantes">
                Restaurantes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/alojamientos">
                Alojamientos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/usuarios"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "5px",
                  padding: "0.375rem 1rem",
                }}
              >
                Iniciar sesión
              </NavLink>
            </li>
            {user?.rol === "admin" && (
              <ul>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users">
                    Users
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/categorias">
                    Categorías
                  </NavLink>
                </li>
              </ul>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
