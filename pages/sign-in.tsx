import { useState, useEffect } from "react";
import { supabase } from "../utils/client";
import Layout from "../components/Layout";

// handles when user clicks 'sign in' button in layout

export default function SignIn() {
  //   const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userEmail) return;

    const { error } = await supabase.auth.signIn({ email: userEmail });
    if (error) {
      console.log({ error: error });
    } else {
      setHasSubmitted(true);
    }
  };

  return (
    <Layout title="Sign in">
      {!hasSubmitted ? (
        <div className="mx-auto border-2 border-blue-400 w-1/3 p-4 rounded-sm">
          <form onSubmit={handleSubmit} className=" bg-white w-full rounded-sm">
            <input
              type="email"
              autoComplete="email"
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="email@gmail.com"
              className="border-2 p-1 mb-2"
            />
            <button
              type="submit"
              className="ml-4 py-1 px-2 border-2 rounded-sm border-blue-200 bg-blue-100 hover:bg-blue-200"
            >
              send
            </button>
            <div className="border-b border-2 border-blue-200"></div>
            <p className="font-extralight mt-2">Sign in with magic link</p>
          </form>
        </div>
      ) : (
        <div className="mx-auto border-2 border-blue-400 w-1/3 p-6 rounded-sm">
          <p className="font-extralight">Please check your email to login</p>
        </div>
      )}
    </Layout>
  );
}
