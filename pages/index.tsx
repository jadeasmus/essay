import Link from "next/link";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "../utils/client";

// displays essays stored in supabase

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select();
    setPosts(data);
    setLoading(false);
  };

  if (loading) return <div className="text-lg">Loading...</div>;
  if (!posts.length) return <div className="text-lg">No posts</div>;

  return (
    <Layout title="Essay">
      {/* Posts */}
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <a className="flex justify-center">
            <div className="text-center rounded-sm bg-slate-200 px-2 py-4 w-2/3 mt-8">
              <h1 className="text-xl">{post.title}</h1>
              <p className="text-md font-extralight mt-4">
                author: {post.user_email}
              </p>
            </div>
          </a>
        </Link>
      ))}
    </Layout>
  );
};

export default IndexPage;