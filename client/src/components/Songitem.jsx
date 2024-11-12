import React from "react";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const Songitem = ({ name, image, author, id}) => {
  const { playWithId } = useContext(PlayerContext);

  return (<>
  
    <div
      onClick={() => playWithId(id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img className="rounded w-40 h-40 object-cover" src={image} alt="" />
      <p className="font-bold mt-2 mb-1 truncate">
        {name.length > 20 ? `${name.substring(0, 18)}...` : name}
      </p>
      <p className="text-slate-200 text-sm ">{author}</p>
    </div>
    {/* <div ref={ref}></div> */}
  </>
  );
};

export default Songitem;
