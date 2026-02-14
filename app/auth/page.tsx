"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300 px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl p-8 text-center">

        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 mb-6">
          Save links beautifully
        </p>

        <button
          onClick={signIn}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
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
