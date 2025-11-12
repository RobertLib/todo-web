import { useState } from "react";
import type { Todo } from "../types";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number, completed: boolean) => void;
  onUpdate: (
    id: number,
    data: { title?: string; description?: string }
  ) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(todo.id, { title, description: description || undefined });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-title-input"
          placeholder="Todo title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-description-input"
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="todo-actions">
          <button onClick={handleSave} className="btn-save">
            Save
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggleComplete(todo.id, e.target.checked)}
        />
      </div>
      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}
