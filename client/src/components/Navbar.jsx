import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useUser";
import { IconSearch } from "@tabler/icons-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { data: user } = useMe();
  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold py-3">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt="Left Arrow"
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt="Right Arrow"
          />
        </div>
        <div className="flex items-center gap-4">
          {user?.me?.artist && (
            <button
              onClick={() => navigate('/artist')}
              className="bg-black text-white px-4 py-1 rounded-2xl"
            >
              Upload
            </button>
          )}
          <IconSearch
            onClick={() => navigate("/search")}
            className={`w-5 h-5 cursor-pointer md:hidden`}
          />
          <div className="text-black w-10 h-10 rounded-full flex items-center justify-center">
            <Link to={user?.me?.isArtist ? `/artist/profile` : `/profile`}>
              <img
                className={`rounded-full ${user?.me?.artist ? 'border-2 border-purple-500' : ''}`}
                src={user?.me?.artist?.image || user?.me?.profileImage}
                alt={user?.me?.artist ? 'artist_profile' : 'user_profile'}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
