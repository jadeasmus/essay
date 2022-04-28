import { useState } from "react";
// import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { supabase } from "../utils/client";
import "easymde/dist/easymde.min.css";

// CREATING A NEW ROW IN 'POSTS' DB
// const { data, error } = await supabase.from("posts").insert([
//   {
//     title: "hello world",
//     content: "My first post",
//     user_id: "some_user_id",
//     user_email: "myemail@gmail.com",
//   },
// ]);

// const SimpleMDE = dynamic(() => import("react-simplemd-editor"), {
//   ssr: false,
// });
