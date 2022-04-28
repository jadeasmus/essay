import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

import { supabase } from "../utils/client";

export interface LayoutProps {
  children?: ReactNode;
  title?: string;
}

async function signInWithEmail() {
  const { user, session, error } = await supabase.auth.signIn({
    email: "jadeasmus99@gmail.com",
  });
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
}

// const Layout = (props: LayoutProps & { title="Default", children: ReactNode }) => (
const Layout = ({
  children,
  title = "This is the default title",
}: LayoutProps) => {
  const [user, setUser] = useState(null);

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
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav className="p-8 flex mb-12">
          <Link href="/">
            <a className="flex items-center text-slate-800 text-3xl tracking-widest font-light">
              ESSAY
            </a>
          </Link>
          <div className="grow"></div>
          {!user ? (
            <Link href="/">
              <a
                onClick={signInWithEmail}
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
        {children}
      </header>
    </div>
  );
};

export default Layout;
