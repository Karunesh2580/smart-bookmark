"use client";

import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 mb-6 text-sm md:text-base">
          Login to save your favourite links
        </p>

        <button
          onClick={signIn}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Made by Karunesh Kr Pandey
        </p>

      </div>
    </div>
  );
}
