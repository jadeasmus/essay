import React from "react";
import Link from "next/link";
import { supabase } from "../utils/client";

// TODO: Add 'save as draft' function

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen border-r border-blue-200 w-1/6 shadow-lg">
      <Link href="/">
        <a
          onClick={signOut}
          className="fixed top-32 left-8 text-slate-800 text-lg hover:border-b-2 hover:border-blue-400 hover:animate-slider"
        >
          <span>Logout</span>
        </a>
      </Link>
    </div>
  );
};

export default Sidebar;
