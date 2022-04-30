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

  const deletePost = async (id) => {
    await supabase.from("posts").delete().match({ id });
    // refresh posts
    fetchPosts();
  };

  return (
    <Layout title="Account">
      {posts.map((post, index) => (
        <div key={index} className="flex justify-center w-full">
          <div className="w-2/3 relative">
            <Link href={`./posts/${post.id}`}>
              <a className="flex justify-center">
                <div className="flex rounded-sm bg-slate-100 hover:shadow-md px-4 py-4 w-full mt-8 pb-16">
                  <h1 className="text-md">{post.title}</h1>
                  <div className="grow"></div>
                  <p className="font-extralight text-md">{`date: ${
                    post.inserted_at.split("T")[0]
                  }`}</p>
                </div>
              </a>
            </Link>
            <div className="absolute bottom-3 right-5">
              <button
                className="border-2 border-blue-400 text-blue-400 rounded-sm px-2 hover:text-white hover:bg-blue-400"
                onClick={() => deletePost(post.id)}
              >
                Delete
              </button>
            </div>
            <div className="absolute bottom-3 right-24">
              <Link href={`./edit/${post.id}`}>
                <a className="px-2 hover:text-blue-400">Edit</a>
              </Link>
            </div>
          </div>
        </div>
        // </div>
      ))}
    </Layout>
  );
}
