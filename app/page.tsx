"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else setUser(data.user);
    });

    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase.from("bookmarks").select("*");
    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold">Smart Bookmark</h1>
          <p className="text-sm text-gray-600">
            Logged in as: <b>{user.user_metadata.full_name}</b>
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>

      </div>

      {/* ADD BOOKMARK */}
      <div className="max-w-5xl mx-auto mt-6 bg-white p-4 rounded-xl shadow">

        <div className="flex flex-col md:flex-row gap-3">

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-2 rounded w-full"
          />

          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addBookmark}
            className="bg-indigo-600 text-white px-6 py-2 rounded w-full md:w-auto"
          >
            Save
          </button>

        </div>
      </div>

      {/* BOOKMARKS */}
      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks yet</p>
        )}

        {bookmarks.map((b, i) => (
          <a
            key={i}
            href={b.url}
            target="_blank"
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-xs text-gray-500 truncate">{b.url}</p>
          </a>
        ))}

      </div>
    </div>
  );
}
