"use client";

import { useMutation, useQuery } from "@apollo/client";
import { FormEvent, use, useState } from "react";
import { GET_TODO, UPDATE_TODO } from "../../../lib/graphql-operations";
import ProtectedRoute from "../../../components/protected-route";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation";

export default function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { loading: queryLoading, error: queryError } = useQuery(GET_TODO, {
    variables: { id },
    onCompleted: (data) => {
      setTitle(data.todo.title);
      setDescription(data.todo.description);
      setCompleted(data.todo.completed);
    },
  });

  const [updateTodo, { loading: mutationLoading }] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      router.push("/todos");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateTodo({
      variables: {
        updateTodoInput: {
          id,
          title,
          description,
          completed,
        },
      },
    });
  };

  if (queryLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading todo...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (queryError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>Error: {queryError.message}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Todo</h1>

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
                  disabled={mutationLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {mutationLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
