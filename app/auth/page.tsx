"use client";

import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Smart Bookmark</h1>
        <p className="text-gray-500 mb-8">
          Save and manage your favorite links
        </p>

        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${location.origin}/`,
              },
            })
          }
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Secure login powered by Supabase
        </p>
      </div>
    </div>
  );
}
