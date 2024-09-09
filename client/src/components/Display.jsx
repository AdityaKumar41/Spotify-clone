import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import DisplayAlbum from './DisplyAlbum';
import { albumsData } from '../assets/assets';

const Display = () => {

      const displayref = useRef();
      const location = useLocation();
      const isAlbum = location.pathname.includes("album");
      const albumId = isAlbum ? location.pathname.slice(-1) : "";
      console.log(albumId);
      const bgColor = albumsData[Number(albumId)].bgColor;
      console.log(bgColor)

      useEffect(()=>{
        if (isAlbum) {
            displayref.current.style.background = `linear-gradient(${bgColor},#121212)`
        }
        else {
          displayref.current.style.background = `#121212`
        }
      })


  return (
    <div ref={displayref} className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-3/4 lg:ml-0">
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
      </Routes>
    </div>
  );
};

export default Display;
