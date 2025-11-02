import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Cachi Explorer
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
            {/* 🔹 Nuevo link Home */}
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

            <li className="nav-item ms-lg-3">
              <NavLink className="btn btn-outline-light btn-sm" to="/usuarios">
                Usuarios
              </NavLink>
            </li>
            {user?.rol === "admin" && (
              <li className="nav-item ms-lg-3">
                <NavLink
                  className="btn btn-outline-light btn-sm"
                  to="/admin/users"
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
