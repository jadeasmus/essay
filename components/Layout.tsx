import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { supabase } from "../utils/client";

export interface LayoutProps {
  children?: ReactNode;
  title?: string;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
}

const Layout = ({
  children,
  title = "This is the default title",
}: LayoutProps) => {
  const [user, setUser] = useState(null);
  const [magicLink, setMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      checkUser();
    });
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
    console.log(user);
  }

  const onClick = () => {
    setMagicLink(true);
  };

  const handleSubmit = async (event) => {
    // don't submit unless event is explicitly handled
    event.preventDefault();
    if (!email) return;

    setMagicLink(false);

    const { error } = await supabase.auth.signIn({ email });

    if (error) {
      alert(error.message);
    } else {
      setHasSubmitted(true);
    }
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="">
        <nav className="p-8 flex mb-5">
          <Link href="/">
            <a className="flex items-center text-slate-800 text-3xl tracking-widest font-light">
              ESSAY
            </a>
          </Link>
          <div className="grow"></div>
          {!user ? (
            <Link href="/">
              <a
                onClick={onClick}
                className="flex items-center space-x-2 text-slate-800 text-lg border-2 rounded-sm px-2"
              >
                <span className="">Start Writing</span>
              </a>
            </Link>
          ) : (
            <div className="flex space-x-8">
              <Link href="/create-post">
                <a className="flex items-center space-x-2 bg-slate-500 text-white text-lg rounded-sm px-2">
                  <span>Contribute</span>
                </a>
              </Link>
              <Link href="/">
                <a
                  onClick={signOut}
                  className="flex items-center space-x-2 text-slate-800 text-lg hover:text-slate-600"
                >
                  <span>Logout</span>
                </a>
              </Link>
            </div>
          )}
        </nav>
        {magicLink && !user ? (
          <div className="mx-auto border-2 border-blue-400 w-1/3 p-4 rounded-sm">
            <form
              onSubmit={handleSubmit}
              className=" bg-white w-full rounded-sm"
            >
              <input
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
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
        ) : hasSubmitted && !user ? (
          <div className="mx-auto border-2 border-blue-400 w-1/3 p-6 rounded-sm">
            <p className="font-extralight">Please check your email to login</p>
          </div>
        ) : (
          children
        )}
      </header>
    </div>
  );
};

export default Layout;
