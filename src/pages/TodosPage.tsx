import { useState, useEffect } from "react";
import type { Todo } from "../types";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import TodoItem from "../components/TodoItem";
import TodoForm from "../components/TodoForm";
import "./TodosPage.css";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  const loadTodos = async () => {
    try {
      setError("");
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (title: string, description: string) => {
    try {
      const newTodo = await api.createTodo({ title, description });
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    }
  };

  const handleUpdate = async (
    id: number,
    data: { title?: string; description?: string; completed?: boolean }
  ) => {
    try {
      const updatedTodo = await api.updateTodo(id, data);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    await handleUpdate(id, { completed });
  };

  return (
    <div className="todos-container">
      <header className="todos-header">
        <h1>My Todos</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}!</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <TodoForm onSubmit={handleCreate} />

      {isLoading ? (
        <div className="loading">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Create your first one!</p>
        </div>
      ) : (
        <div className="todos-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
