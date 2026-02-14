"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // Check user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const name =
          data.session.user.user_metadata?.full_name || data.session.user.email;
        setUserName(name);
      } else {
        window.location.href = "/auth";
      }
    };
    fetchUser();
  }, []);

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  // Fetch bookmarks & setup realtime
  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase.from("bookmarks").select("*");
      if (data) setBookmarks(data);
    };
    fetchBookmarks();

    // Supabase v2 Realtime subscription
    const bookmarkChannel = supabase
      .channel("public:bookmarks")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        payload => setBookmarks(prev => [...prev, payload.new as Bookmark])
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        payload =>
          setBookmarks(prev =>
            prev.filter(b => b.id !== (payload.old as Bookmark).id)
          )
      )
      .subscribe();

    return () => supabase.removeChannel(bookmarkChannel);
  }, []);

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return;
    setLoading(true);
    await supabase.from("bookmarks").insert({ title, url });
    setTitle("");
    setUrl("");
    setLoading(false);
  };

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (!userName) return null; // wait until session checked

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Smart Bookmark</h1>
          <button
            onClick={logout}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Logged in as: <span className="font-medium text-gray-800">{userName}</span>
        </p>

        {/* Add Bookmark Form */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Bookmark List */}
        <div className="grid gap-4">
          {bookmarks.length === 0 && (
            <p className="text-gray-500 text-center">No bookmarks yet</p>
          )}
          {bookmarks.map(b => (
            <div
              key={b.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <a
                href={b.url}
                target="_blank"
                className="text-indigo-600 font-medium hover:underline"
              >
                {b.title}
              </a>
              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
