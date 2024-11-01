import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplyAlbum";
import Profile from "./Profile";
import Artist from "./Artist";
import { albumsData } from "../assets/assets";
import CreateArtist from "./CreateArtist";

const Display = () => {
  const displayref = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const isProfile = location.pathname.includes("profile");
  const albumId = isAlbum ? location.pathname.split("/").pop() : ""; // Get the album ID from the URL
  console.log(albumId);

  const albumData = isAlbum ? albumsData[Number(albumId)] : null; // Only fetch album data if on album page
  const bgColor = albumData ? albumData.bgColor : "#121212"; // Default background color if albumData is not available
  console.log(bgColor);

  useEffect(() => {
    if (isAlbum && albumData) {
      // For album page, set the background based on the album's bgColor
      displayref.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else if (isProfile) {
      // For profile page, you can set a different background or color
      displayref.current.style.background = `linear-gradient(#4CAF50, #121212)`; // Customize this for profile page
    } else {
      // Default background color for other pages
      displayref.current.style.background = `#121212`;
    }
  }, [isAlbum, isProfile, bgColor, albumData]);

  return (
    <div
      ref={displayref}
      className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-3/4 lg:ml-0"
    >
      <Routes>
        <Route path="/artist" element={<Artist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
      </Routes>
    </div>
  );
};

export default Display;
