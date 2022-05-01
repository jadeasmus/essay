import Link from "next/link";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "../utils/client";
// displays essays stored in supabase

// FIXME: scroll doesn't work?
// TODO: make sign in its own component
// TODO: stay signed in

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch posts in realtime
  useEffect(() => {
    fetchPosts();
    const realtime = () => {
      const mySubscription = supabase
        .from("posts")
        .on("*", () => fetchPosts())
        .subscribe();
      return () => supabase.removeSubscription(mySubscription);
    };
    realtime();
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
      <div className="h-screen">
        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="flex justify-center w-full">
            <div className="w-2/3">
              <Link href={`/posts/${post.id}`}>
                <a className="flex justify-center">
                  <div className="text-center rounded-sm bg-slate-200 px-2 py-4 w-full mt-8">
                    <h1 className="text-xl">{post.title}</h1>
                    <p className="text-md font-extralight mt-4">
                      author: {post.user_email}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default IndexPage;
