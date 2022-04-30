// .pages/edit/[id]

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../../utils/client";
import Layout from "../../components/Layout";

// FIXME:
/* 
  - title doesn't stay during edit
  - edit doesn't update supabase
*/

interface PostObject {
  [key: string]: any;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
const initialState: PostObject = { title: "", content: "" };

export default function edit() {
  const [post, setPost] = useState(initialState);
  const { title, content } = post; // deconstructing post object
  const router = useRouter();
  const { id } = router.query; // defaults to {}, way to check if id was fetched

  // gets post associated with id
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("posts")
        .select()
        .filter("id", "eq", id)
        .single();
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) return null;

  const onChange = (e) => {
    console.log(`name: ${e.target.name}, value: ${e.target.value}`);
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  };

  const updatePost = async () => {
    if (!title || !content) {
      console.log("title or content required");
      return;
    }
    console.log("post: ", post);
    await supabase.from("posts").update([{ title, content }]).match({ id });

    // route back to account page after update
    router.push("/account");
  };

  return (
    <Layout title="Edit Post">
      <div className="mx-10">
        <h1 className="text-2xl pb-5">Edit Post</h1>
        <input
          className="border-2 rounded-md w-full text-xl p-1 mb-4"
          name="title"
          placeholder="Title"
          value={post.title}
          onChange={onChange}
        />
        <SimpleMDE
          value={post.content}
          onChange={(value) => setPost({ ...post, content: value })}
        />
        <button
          type="button"
          onClick={updatePost}
          className="text-lg bg-slate-200 px-2 py-1 rounded-sm"
        >
          Save Changes
        </button>
      </div>
    </Layout>
  );
}
