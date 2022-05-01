import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/client";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";

export default function account() {
  const [posts, setPosts] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    fetchPosts();
  });

  const fetchPosts = async () => {
    const user = supabase.auth.user();
    // save user data
    setAccount(user);
    console.log("account: ", account);
    // get user's essays
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <Layout title="Account">
      {/* <Sidebar /> */}
      <div className="fixed top-0 left-0 h-screen border-r border-blue-200 w-1/6 shadow-lg">
        <Link href="/">
          <a
            onClick={signOut}
            className="fixed top-32 left-8 max-w-fit text-slate-800 text-lg hover:border-b-2 hover:border-blue-400 hover:animate-slider"
          >
            <span>Logout</span>
          </a>
        </Link>
      </div>
      {/* Posts */}
      {posts.map((post, index) => (
        <div key={index} className="flex justify-end w-5/6">
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
            {/* delete */}
            <div className="absolute bottom-3 right-5">
              <button
                className="border-2 border-blue-400 text-blue-400 rounded-sm px-2 hover:text-white hover:bg-blue-400"
                onClick={() => deletePost(post.id)}
              >
                Delete
              </button>
            </div>
            {/* edit */}
            <div className="absolute bottom-3 right-24">
              <Link href={`./edit/${post.id}`}>
                <a className="px-2 hover:text-blue-400">Edit</a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
}
