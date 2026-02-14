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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const categories = ["General", "Study", "Work", "Personal"];

  // ✅ AUTH FIX (first login redirect)
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
      <div className="min-h-screen bg-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Smart Bookmark</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Logged in as <b>{user.user_metadata.full_name}</b>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 text-xs sm:text-sm md:text-base bg-red-500 text-white rounded"
          >
            Logout
          </button>

        </div>

        {/* SEARCH */}
        <div className="max-w-5xl mx-auto mt-4">
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 text-sm sm:text-base md:text-base border rounded"
          />
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto mt-4 bg-white p-4 rounded-xl shadow">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="border p-2 text-sm sm:text-base md:text-base rounded"
            />

            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="URL"
              className="border p-2 text-sm sm:text-base md:text-base rounded"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 text-sm sm:text-base md:text-base rounded"
            >
              {categories.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={editing ? updateBookmark : addBookmark}
              className="bg-indigo-600 text-white text-sm sm:text-base md:text-base rounded"
            >
              {editing ? "Update" : "Save"}
            </button>

          </div>
        </div>

        {loading && <p className="text-center mt-6 animate-pulse text-sm sm:text-base md:text-base">Loading...</p>}

        {/* BOOKMARKS */}
        <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow">

              <a href={b.url} target="_blank">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">{b.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-500">{b.category}</p>
              </a>

              <div className="flex justify-between mt-3 text-xs sm:text-sm md:text-base">

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

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500"
                >
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
