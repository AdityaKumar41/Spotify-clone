import React from "react";
import { assets } from "../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { IconFolder, IconMusic } from "@tabler/icons-react";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 pl-8 cursor-pointer"
        >
          <img className="w-6" src={assets.home_icon} alt="Home Icon" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/search")}>
          <img className="w-6" src={assets.search_icon} alt="Search Icon" />
          <p className="font-bold">Search</p>
        </div>
      </div>
      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex place-items-center justify-between">
          <div className="flex place-items-center gap-3">
            <img
              className="w-8 cursor-pointer"
              src={assets.stack_icon}
              alt=""
            />
            <p className="font-semibold cursor-pointer">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              className="w-5 cursor-pointer"
              src={assets.arrow_icon}
              alt=""
            />
            <Popover placement="right">
              <PopoverTrigger>
                <img
                  className="w-5 cursor-pointer"
                  src={assets.stack_icon}
                  alt=""
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-4 py-3 bg-[#121212] text-white rounded-md">
                  <div className="text-small flex items-center gap-2 p-2 hover:bg-gray-900 transition-all cursor-pointer rounded-md">
                    <IconMusic />
                    <p>Add to Music</p>
                  </div>
                  <div className="text-small flex items-center gap-2 p-2 hover:bg-gray-900 transition-all cursor-pointer rounded-md">
                    <IconFolder />
                    <p>Create Playlist</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
          <h1>Create Your First Playlist</h1>
          <p className="font-light">Its easy we will help you</p>
          <button className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4">
            Create Playlist
          </button>
        </div>
        <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1>Let's find some podcasts to Follow</h1>
          <p className="font-light">We'll keep you update on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4">
            Brows Podcasts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
