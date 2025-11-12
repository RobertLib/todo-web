import { useState } from "react";
import type { FormEvent } from "react";
import "./TodoForm.css";

interface TodoFormProps {
  onSubmit: (title: string, description: string) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, description);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-form-main">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-form-input"
          onFocus={() => setIsExpanded(true)}
        />
        <button type="submit" disabled={!title.trim()}>
          Add
        </button>
      </div>

      {isExpanded && (
        <div className="todo-form-expanded">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="todo-form-textarea"
            rows={2}
          />
        </div>
      )}
    </form>
  );
}
