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
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const save = async () => {
    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");

    load();
  };

  const load = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("id", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-16 space-y-6">
      <h1 className="text-3xl font-bold">Smart Bookmark</h1>

      <p>
        Logged in as:{" "}
        <b>{user.user_metadata.full_name || user.email}</b>
      </p>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>

      <input
        className="border w-full p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border w-full p-2"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={save}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>

      {bookmarks.map((b) => (
        <div key={b.id} className="border p-3 rounded">
          <b>{b.title}</b>
          <br />
          <a href={b.url} target="_blank">{b.url}</a>
        </div>
      ))}
    </div>
  );
}
