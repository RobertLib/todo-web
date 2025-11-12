export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreateDto {
  title: string;
  description?: string;
}

export interface TodoUpdateDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
