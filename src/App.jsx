import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Excursiones from "./pages/Excursiones";
import Restaurantes from "./pages/Restaurantes";
import Alojamientos from "./pages/Alojamientos";
import Users from "./pages/Users";
import AdminUsers from "./pages/AdminUsers";
import AdminCategories from "./pages/AdminCategories";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="py-4 app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursiones" element={<Excursiones />} />
          <Route path="/restaurantes" element={<Restaurantes />} />
          <Route path="/alojamientos" element={<Alojamientos />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categorias" element={<AdminCategories />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
