import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { supabase } from "../../utils/client";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import React, { useState, useEffect } from "react";

export default function Post({ post }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);

  // initially until page finishes rendering
  if (router.isFallback) {
    return <div className="text-lg">Loading...</div>;
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", post.user_id)
      .single();

    if (data.username) setUsername(data.username);
    // console.log(username);
  };

  return (
    <Layout title={`Essay | ${post.title}`}>
      <div className="m-5">
        <div className="flex justify-center">
          <div className="bg-slate-200 rounded-sm w-2/3 py-4">
            <h1 className="text-center text-3xl">{post.title}</h1>
            {username ? (
              <Link href={`/profiles/${post.user_id}`}>
                <span className="cursor-pointer hover:text-blue-400 font-extralight text-lg mt-2 pl-8">{`${username}`}</span>
              </Link>
            ) : (
              <Link href={`/profiles/${post.user_id}`}>
                <span className="cursor-pointer hover:text-blue-400 font-extralight text-lg mt-2 pl-8">{`${post.user_email}`}</span>
              </Link>
            )}
            <p className="font-extralight text-lg mt-2 pl-8">{`${
              post.inserted_at.split("T")[0]
            }`}</p>
          </div>
        </div>
        <div className="mt-16 mx-16 rounded-sm h-screen">
          {/* Allows for string of md to be rendered */}
          <ReactMarkdown className="prose" children={post.content} />
        </div>
      </div>
    </Layout>
  );
}

// getStaticPaths = dynamically builds pages based on API posts at build time
export async function getStaticPaths() {
  const { data, error } = await supabase.from("posts").select("id");
  const paths = data.map((post) => ({
    params: { id: JSON.stringify(post.id) },
  }));
  return {
    paths,
    fallback: true, // enabled for dynamic SSG page generation
  };
}

// fetches post data from supabase table and passes into page as props
// getStaticProps = at build time
export async function getStaticProps({ params }) {
  const { id } = params;
  const { data } = await supabase
    .from("posts")
    .select()
    .filter("id", "eq", id)
    .single();
  return {
    props: {
      post: data,
    },
  };
}
