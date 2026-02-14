"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

interface Bookmark {
  id: number;
  title: string;
  url: string;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else setUser(data.user);
    });

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchBookmarks() {
    const { data } = await supabase.from("bookmarks").select("*").order("id");
    if (data) setBookmarks(data);
  }

  async function addBookmark() {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert([{ title, url }]);
    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: number) {
    await supabase.from("bookmarks").delete().eq("id", id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Smart Bookmark</h1>
            <p className="text-sm text-gray-500">
              Logged in as {user.user_metadata?.full_name}
            </p>
          </div>

          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <input
            className="border p-2 rounded"
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button
          onClick={addBookmark}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition mb-6"
        >
          Save Bookmark
        </button>

        {bookmarks.length === 0 && (
          <p className="text-center text-gray-400">No bookmarks yet</p>
        )}

        <ul className="space-y-3">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <a
                href={b.url}
                target="_blank"
                className="font-medium text-indigo-600 hover:underline"
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
