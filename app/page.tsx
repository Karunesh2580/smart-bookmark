"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const categories = ["General", "Study", "Work", "Personal"];

  // ✅ FIX LOGIN REDIRECT
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth");
      } else {
        setUser(data.session.user);
        fetchBookmarks();
      }
      setLoading(false);
    });
  }, []);

  // ✅ FIX DARK MODE
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("id", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      category,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    setCategory("General");
    fetchBookmarks();
  };

  const updateBookmark = async () => {
    await supabase
      .from("bookmarks")
      .update({ title, url, category })
      .eq("id", editing.id);

    setEditing(null);
    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id: number) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold dark:text-white">Smart Bookmark</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as <b>{user.user_metadata.full_name}</b>
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setDark(!dark)} className="px-4 py-2 border rounded dark:text-white">
              {dark ? "Light" : "Dark"}
            </button>

            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
              Logout
            </button>
          </div>

        </div>

        {/* SEARCH */}
        <div className="max-w-5xl mx-auto mt-4">
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            />

            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="URL"
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            >
              {categories.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={editing ? updateBookmark : addBookmark}
              className="bg-indigo-600 text-white rounded"
            >
              {editing ? "Update" : "Save"}
            </button>

          </div>
        </div>

        {loading && <p className="text-center mt-6 animate-pulse">Loading...</p>}

        {/* BOOKMARKS */}
        <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map((b) => (
            <div key={b.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">

              <a href={b.url} target="_blank">
                <h3 className="font-semibold dark:text-white">{b.title}</h3>
                <p className="text-xs text-gray-500">{b.category}</p>
              </a>

              <div className="flex justify-between mt-3 text-sm">

                <button
                  onClick={() => {
                    setEditing(b);
                    setTitle(b.title);
                    setUrl(b.url);
                    setCategory(b.category);
                  }}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button onClick={() => deleteBookmark(b.id)} className="text-red-500">
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
