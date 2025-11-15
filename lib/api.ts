import { IUser } from "@/types/user";

const BASE_URL = "/api/users";

// obtener lista de usuarios con paginación
export const getUsers = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  return res.json();
};

// obtener un usuario por id
export const getUserById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

// crear un nuevo usuario
export const createUser = async (user: IUser) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};

// actualizar un usuario existente
export const updateUser = async (id: string, user: Partial<IUser>) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};

// eliminar un usuario por id
export const deleteUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res.json();
};
