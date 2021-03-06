import { useState, useEffect } from "react";
import { supabase } from "../utils/client";

import React from "react";

export default function Profile({ user }) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [website, setWebsite] = useState("");
  // const [avatarURL, setAvatarURL] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      const user = await supabase.auth.user();
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, bio`)
        .eq("id", user.id)
        .single();

      console.log(status);
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setBio(data.bio);
        // setAvatarURL(data.avatar_url);
        // setWebsite(data.website);
      }
    } catch (error) {
      console.log("error in getProfile", error.message);
    }
  }

  async function updateProfile() {
    try {
      const user = supabase.auth.user();
      const updates = {
        id: user.id,
        username,
        bio,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("error in updateProfile", error.message);
    }

    // getProfile();
  }

  const handleEdit = () => {
    setEditing(true);
  };

  console.log(username);
  console.log(bio);
  console.log(user.email);

  return (
    <div className="flex justify-end w-5/6 mb-10">
      <div className="flex px-4 w-2/3">
        {!editing && !username ? (
          <div>
            <h1 className="text-xl grow">{user.email}</h1>
            <p className="text-lg font-light">{bio}</p>
          </div>
        ) : !editing && username ? (
          <div className="grow">
            <h1 className="text-xl grow">{username}</h1>
            <p className="text-lg font-light pt-5">{bio}</p>
          </div>
        ) : editing ? (
          <form className="flex flex-col grow">
            <label htmlFor="username" className="text-xs font-extralight">
              username
            </label>
            <input
              id="username"
              type="username"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xl pl-1 pt-3 border-b border-blue-400 focus:text-blue-400 focus:outline-none"
            />
            <label htmlFor="bio" className="text-xs font-extralight pt-5">
              profile description
            </label>
            <input
              id="bio"
              type="bio"
              placeholder="Say something about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xl pl-1 pt-3 border-b border-blue-400 focus:text-blue-400 focus:outline-none"
            />
          </form>
        ) : null}
        <div className="grow"></div>
        {!editing ? (
          <div className="">
            <button
              onClick={handleEdit}
              type="button"
              className="max-h-fit text-extralight text-sm hover:text-blue-400"
            >
              <span className="">Edit Profile</span>
            </button>
          </div>
        ) : (
          <div className="">
            <button
              className="text-extralight max-h-fit text-sm hover:text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                updateProfile();
                setEditing(false);
              }}
            >
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
