import Link from "next/link";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "../utils/client";
// displays essays stored in supabase

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  // fetch posts in realtime
  useEffect(() => {
    fetchPosts();
    getProfiles();
    const user = supabase.auth.user().id;
    setUserID(user);
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
    } else {
      console.log("getProfile didnt work");
    }
  };

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
                    <h1 className="text-xl mb-3">{post.title}</h1>
                    {profiles.map((profile) => {
                      if (
                        post.user_id === profile.id &&
                        profile.username !== null
                      ) {
                        if (profile.id === userID) {
                          // if user clicks own username it routes to their account page
                          return (
                            <Link key={profile.id} href={`/account`}>
                              <span className="w-fit text-md font-extralight hover:text-blue-400">
                                {profile.username}
                              </span>
                            </Link>
                          );
                        } else {
                          return (
                            <Link
                              key={profile.id}
                              href={`/profiles/${profile.id}`}
                            >
                              <span className="w-fit text-md font-extralight hover:text-blue-400">
                                {profile.username}
                              </span>
                            </Link>
                          );
                        }
                      } else if (
                        post.user_id === profile.id &&
                        profile.username === null
                      ) {
                        return (
                          <Link
                            key={profile.id}
                            href={`/profiles/${profile.id}`}
                          >
                            <span className="w-fit block text-md font-extralight hover:text-blue-400">
                              {post.user_email}
                            </span>
                          </Link>
                        );
                      }
                    })}
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
