"use client";

import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TODO, GET_TODOS } from "../../lib/graphql-operations";
import ProtectedRoute from "../../components/protected-route";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useState } from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TodosPage() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_TODOS);

  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTodo({ variables: { id } });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Todos</h1>
            <Link
              href="/todos/new"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add New Todo
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading your todos...</p>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>Error: {error.message}</p>
            </div>
          ) : data?.todos?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                You don&apos;t have any todos yet. Create one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.todos.map((todo: Todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold mb-2">{todo.title}</h2>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        todo.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{todo.description}</p>

                  <div className="flex justify-between items-center mt-4">
                    <Link
                      href={`/todos/${todo.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(todo.id)}
                      disabled={deletingId === todo.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingId === todo.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
