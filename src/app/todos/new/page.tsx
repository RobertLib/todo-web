"use client";

import { useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { CREATE_TODO, GET_TODOS } from "../../../lib/graphql-operations";
import ProtectedRoute from "../../../components/protected-route";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation";

export default function NewTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      router.push("/todos");
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createTodo({
      variables: {
        createTodoInput: {
          title,
          description,
          completed,
        },
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Todo</h1>

            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Completed</span>
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/todos")}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {loading ? "Creating..." : "Create Todo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
