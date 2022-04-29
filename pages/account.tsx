import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/client";
import Layout from "../components/Layout";

// TO-DO
// - view works by account
// - edit works
// - delete works

export default function account() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  });

  const fetchPosts = async () => {
    const user = supabase.auth.user();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .filter("user_id", "eq", user.id);

    setPosts(data);
  };

  return (
    <Layout title="Account">
      {posts.map((post, index) => (
        <Link href={`./pages/${post.id}`}>
          <a key={index} className="flex justify-center">
            <div className="flex rounded-sm bg-slate-200 px-10 py-4 w-2/3 mt-8">
              <h1 className="text-md">{post.title}</h1>
              <div className="grow"></div>
              <p className="font-extralight text-md">{`date: ${
                post.inserted_at.split("T")[0]
              }`}</p>
            </div>
          </a>
        </Link>
      ))}
    </Layout>
  );
}
