import Layout from "../components/Layout";

// this component takes user input and sends to supabase for storing,
// under that user's account

const Post = () => (
  <>
    <a href="space-y-5">
      <h1 className="flex w-2/3 h-32 m-auto bg-slate-200 items-center justify-center">
        <input type="text" placeholder="Essay title"></input>
      </h1>
      <p>
        <textarea placeholder="Write your essay!"></textarea>
      </p>
    </a>
  </>
);

export default Post;
