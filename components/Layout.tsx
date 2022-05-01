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
        <nav className="p-8 flex">
          <Link href="/">
            <a className="flex items-center cursor-pointer text-slate-800 text-3xl tracking-widest font-light">
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
                <a className="flex items-center text-lg text-white bg-blue-400 px-3 rounded-tl-lg rounded-br-lg hover:bg-blue-500">
                  <span>Write</span>
                  <svg
                    className="font-extrabold ml-2"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                    <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
                  </svg>
                </a>
              </Link>

              <Link href="/account">
                <a className="flex items-center text-slate-800 text-lg hover:text-slate-600">
                  <span>Profile</span>
                  <svg
                    className="font-extrabold ml-2"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
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
