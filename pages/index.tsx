import Link from "next/link";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "../utils/client";
// displays essays stored in supabase

// TODO: make sign in its own component
// TODO: stay signed in

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch posts in realtime
  useEffect(() => {
    fetchPosts();
    getProfiles();
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

  const getProfiles = async () => {
    let { data } = await supabase.from("profiles").select();
    if (data) {
      setProfiles(data);
      // profiles.map((profile) => console.log(profile));
    } else {
      console.log("getProfile didnt work");
    }
  };

  // profiles.map((profile) => console.log(profile));

  if (loading)
    return (
      <Layout title="Essay">
        <div className="text-lg mt-20 flex justify-center">Loading...</div>
      </Layout>
    );
  if (!posts.length)
    return (
      <Layout title="Essay">
        <div className="text-lg mt-20 flex justify-center">No posts</div>
      </Layout>
    );

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
                    {/* {post.user_id === profiles.id ? (
                      <p className="text-md font-extralight mt-4">
                        author: {profiles.username}
                      </p>
                    ) : (
                      <p className="text-md font-extralight mt-4">
                        author: {post.user_email}
                      </p>
                    )} */}
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
