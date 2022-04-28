import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { supabase } from "../../utils/client";
import ReactMarkdown from "react-markdown";

import React from "react";

export default function Post({ post }) {
  const router = useRouter();

  // initially until page finishes rendering
  if (router.isFallback) {
    return <div className="text-lg">Loading...</div>;
  }

  return (
    <Layout title={`Essay | ${post.title}`}>
      <div className="m-5">
        <div className="flex justify-center">
          <div className="bg-slate-200 rounded-sm w-2/3 py-4">
            <h1 className="text-center text-3xl">{post.title}</h1>
            <p className="font-extralight text-lg mt-2 pl-8">{`author: ${post.user_email}`}</p>
            <p className="font-extralight text-lg mt-2 pl-8">{`date: ${
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
