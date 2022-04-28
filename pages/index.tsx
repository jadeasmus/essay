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

  return <Layout title="Essay">{/* Posts */}</Layout>;
};

export default IndexPage;
