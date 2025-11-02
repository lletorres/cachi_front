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

// Registrar usuario
export const registerUser = async (nombre, apellido, email, password) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido, email, password }),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return await res.json();
};

// Borrar usuarios

export const deleteUser = async (id) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Respuesta backend:", errText);
    throw new Error("Error al eliminar usuario");
  }

  return res.json();
};

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

// Actualizar usuario
export const updateUser = async (id, updatedData) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return res.json();
};

// Obtener restaurantes

export async function getRestaurants() {
  try {
    const res = await fetch(`${API_URL}/restaurantes`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Respuesta del backend:", errorText);
      throw new Error("Error al obtener restaurantes");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getRestaurants:", error);
    throw error;
  }
}

//editar restaurante
export const updateRestaurant = async (id, updatedData) => {
  const res = await fetch(`${API_URL}/restaurantes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Error al actualizar restaurante");
  return await res.json();
};
//Crear restaurante
export const createRestaurant = async (restauranteData) => {
  const res = await fetch(`${API_URL}/restaurantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restauranteData),
  });
  if (!res.ok) throw new Error("Error al crear restaurante");
  return await res.json();
};
//borrar restaurante
export const deleteRestaurant = async (id) => {
  const res = await fetch(`${API_URL}/restaurantes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar restaurante");
  return await res.json();
};
