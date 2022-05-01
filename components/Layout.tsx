import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
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
  const router = useRouter();

  // check if user is loggedin
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      checkUser();
    });
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const user = supabase.auth.user();
    setUser(user);
    // console.log(user)
  };

  const onClick = () => {
    router.push("/sign-in");
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
                className="flex items-center space-x-2 text-slate-800 text-lg border-2 rounded-sm px-2 hover:border-blue-400 hover:text-blue-400"
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
              <Link href="/account">
                <a className="flex items-center space-x-2 text-slate-800 text-lg hover:text-slate-600">
                  <span>Account</span>
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
