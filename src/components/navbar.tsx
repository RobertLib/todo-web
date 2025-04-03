"use client";

import Link from "next/link";
import { useAuth } from "../contexts/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/todos" className="text-xl font-bold">
          Todo App
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span>Hello, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
