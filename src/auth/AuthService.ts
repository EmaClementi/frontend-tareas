import api from "../service/api";

type LoginResponse = {
  jwToken: string;
};

export async function login(email: string, clave: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    clave,
  });

  return response.data.jwToken;
}
