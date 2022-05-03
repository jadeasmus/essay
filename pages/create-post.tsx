import { useState } from "react";
import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import "easymde/dist/easymde.min.css";
import Layout from "../components/Layout";

interface PostObject {
  [key: string]: any;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
const initialState: PostObject = { title: "", content: "" };

export default function createPost() {
  const [post, setPost] = useState(initialState);
  const { title, content } = post; // deconstructing post object
  const router = useRouter();

  const onChange = (e) => {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  };

  const createNewPost = async () => {
    if (!title || !content) return;
    const user = supabase.auth.user();
    const id = uuid(); // generates unique id
    post.id = id; // adds unique id to post object
    const { data } = await supabase
      .from("posts")
      .insert([{ title, content, user_id: user.id, user_email: user.email }])
      .single();
    router.push(`/posts/${data.id}`); // changes url to match post
  };

  const saveDraft = async () => {};

  return (
    <Layout title="New Post">
      <div className="mx-10">
        <h1 className="text-2xl pb-5">Post New Essay</h1>
        <input
          className="border-2 rounded-md w-full text-xl p-1 mb-4"
          type="text"
          name="title"
          placeholder="Title"
          onChange={onChange}
          value={post.title}
        />
        <SimpleMDE
          value={post.content}
          onChange={(value) => {
            setPost({ ...post, content: value });
          }}
        />
        <button
          type="button"
          onClick={createNewPost}
          className="text-lg text-white bg-blue-400 px-2 py-1 rounded-sm hover:bg-blue-500"
        >
          Create Post
        </button>
        <button
          type="button"
          onClick={createNewPost}
          className="text-lg ml-4 text-slate-800 hover:text-slate-600"
        >
          Save as draft
        </button>
      </div>
    </Layout>
  );
}
