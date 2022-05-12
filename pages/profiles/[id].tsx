import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { supabase } from "../../utils/client";

export default function profiles({ profile }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const user = supabase.auth.user();
    setUser(user);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .filter("user_id", "eq", user.id);

    setPosts(data);
  };

  // initially until page finishes rendering
  if (router.isFallback) {
    return <div className="text-lg">Loading...</div>;
  }

  return (
    <Layout title={`Essay | ${profile.username}`}>
      <div className="flex justify-center w-full mb-10">
        {!profile.username && !profile.bio ? (
          <div className="">
            <h1 className="text-xl">{user.email}</h1>
          </div>
        ) : (
          <div>
            <h1 className="text-xl">{profile.username}</h1>
            <p className="text-lg font-light mt-2">{profile.bio}</p>
          </div>
        )}
      </div>
      {/* Posts */}
      {posts.map((post, index) => (
        <div key={index} className="flex justify-center">
          <div className="w-1/2">
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
          </div>
        </div>
      ))}
    </Layout>
  );
}

// getStaticPaths = dynamically builds pages based on API posts at build time
export async function getStaticPaths() {
  const { data, error } = await supabase.from("profiles").select("id");
  const paths = data.map((profile) => ({
    params: { id: JSON.stringify(profile.id) },
  }));
  return {
    paths,
    fallback: true, // enabled for dynamic SSG page generation
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const { data } = await supabase
    .from("profiles")
    .select()
    .filter("id", "eq", id)
    .single();
  return {
    props: {
      profile: data,
    },
  };
}
