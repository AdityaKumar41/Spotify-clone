import React from "react";
import { useNavigate } from "react-router-dom";
const AlbumItems = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artists/${id}`)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img className="rounded w-40 h-40 object-cover" src={image} alt="" />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 test-sm">{desc}</p>
    </div>
  );
};

export default AlbumItems;
