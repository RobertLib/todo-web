import type {
  Todo,
  AuthResponse,
  TodoCreateDto,
  TodoUpdateDto,
} from "../types";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "An error occurred" }));

    // Handle validation errors (errors object)
    if (error.errors) {
      const firstError = Object.values(error.errors)[0];
      throw new ApiError(
        response.status,
        String(firstError) || "Validation error"
      );
    }

    // Handle standard errors (error string)
    throw new ApiError(
      response.status,
      error.error || error.message || "An error occurred"
    );
  }

  // Don't parse JSON for 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; username: string; password: string }) =>
    fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Todos
  getTodos: () => fetchApi<Todo[]>("/todos"),

  getTodo: (id: number) => fetchApi<Todo>(`/todos/${id}`),

  createTodo: (data: TodoCreateDto) =>
    fetchApi<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTodo: (id: number, data: TodoUpdateDto) =>
    fetchApi<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTodo: (id: number) =>
    fetchApi<void>(`/todos/${id}`, {
      method: "DELETE",
    }),
};

export { ApiError };
