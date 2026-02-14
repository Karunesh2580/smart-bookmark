"use client";

import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Smart Bookmark</h1>

        <button
          onClick={signIn}
          className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
