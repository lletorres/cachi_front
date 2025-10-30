// 📡 URL base del backend (configurable desde .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Iniciar sesión
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // si usás sesiones en Express
  });
  if (!res.ok) throw new Error("Error al iniciar sesión");
  return res.json();
}

// Registrarse
export async function registerUser(nombre, email, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });
  if (!res.ok) throw new Error("Error al registrarse");
  return res.json();
}

// Borrar usuarios

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return res.json();
}

// Cerrar sesión
export async function logoutUser() {
  const res = await fetch(`${API_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al cerrar sesión");
  return res.json();
}

// Obtener todos los usuarios
export const getUsers = async () => {
  const token = sessionStorage.getItem("token"); // 👈 Asegurate de tenerlo guardado
  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 importante
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return res.json();
};

// Obtener categorías
export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
}

// Obtener alojamientos
export async function getAlojamientos() {
  const res = await fetch(`${API_URL}/alojamientos`);
  if (!res.ok) throw new Error("Error al obtener alojamientos");
  return res.json();
}

// Obtener excursiones
export async function getExcursiones() {
  const res = await fetch(`${API_URL}/excursiones`);
  if (!res.ok) throw new Error("Error al obtener excursiones");
  return res.json();
}

// Obtener restaurantes
export async function getRestaurantes() {
  const res = await fetch(`${API_URL}/restaurantes`);
  if (!res.ok) throw new Error("Error al obtener restaurantes");
  return res.json();
}
