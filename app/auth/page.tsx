"use client";

import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Smart Bookmark</h1>
        <p className="mb-4">Login with your Google account to continue</p>
        <button
          onClick={loginWithGoogle}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
