import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import {
  IconArrowLeft,
  IconMathGreater,
  IconMusic,
  IconPlaystationCircle,
  IconUser,
} from "@tabler/icons-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { albumsData, songsData } from "../assets/assets";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";
// import { useCurrentUser } from "../hooks/user";
import { image } from "@nextui-org/theme";
import { useMe, useFollowedArtists, useIsFollowingArtist } from "../hooks/useUser";

export default function Profile() {
  const { data: user } = useMe();
  const { playWithId } = useContext(PlayerContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const isArtist = user?.me?.artist;

  // Fetch followed artists data
  const { data: followArtist } = useFollowedArtists(user?.me?.id);
  const followedArtists = followArtist;
  console.log(followedArtists);
  const followersCount = user?.me?.followersCount || 0;
  console.log(followersCount);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 340);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fy_token");
    window.location.href = "/";
  };

  return (
    <div className="bg-black min-h-screen text-white">
      
      {/* Sticky Header - Enhanced background opacity */}
      <div className={`bg-black/95 backdrop-blur-md z-20 py-4 px-4 md:px-[32px] transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className="cursor-pointer hover:bg-[#282828] rounded-full p-2" onClick={() => navigate(-1)}>
            <IconArrowLeft className="w-[20px] h-[20px] text-[#a7a7a7]" />
          </div>
          {isArtist ? (
            <img
              src={user?.me?.artist.image || user?.me?.profileImage}
              alt="Artist"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
          ) : (
            user?.me?.profileImage ? (
              <img
                src={user.me.profileImage}
                alt="Profile"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-[#282828] rounded-full flex items-center justify-center">
                <IconUser className="w-[20px] h-[20px] text-[#7f7f7f]" />
              </div>
            )
          )}
          <h1 className="text-lg font-bold">
            {isArtist ? (user?.me?.artist.name || 'Artist Name') : (user?.me?.username || 'User Name')}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Enhanced Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[340px] bg-gradient-to-b from-blue-600/30 via-purple-500/20 to-[#121212] opacity-90" />
        
        {/* Profile Info - Added subtle text shadow */}
        <div className="relative pt-[96px] px-[32px]">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Enhanced Profile/Artist Image with glow effect */}
            {isArtist ? (
              <img
                src={user?.me?.artist?.image || user?.me?.profileImage}
                alt="Artist"
                className="w-[192px] h-[192px] md:w-[232px] md:h-[232px] shadow-2xl rounded-full object-cover ring-4 ring-white/10 hover:ring-white/20 transition-all duration-300"
              />
            ) : (
              user?.me?.profileImage ? (
                <img
                  src={user.me.profileImage}
                  alt="Profile"
                  className="w-[192px] h-[192px] md:w-[232px] md:h-[232px] shadow-2xl rounded-full object-cover"
                />
              ) : (
                <div className="w-[192px] h-[192px] md:w-[232px] md:h-[232px] bg-[#282828] rounded-full flex items-center justify-center">
                  <IconUser className="w-[96px] h-[96px] text-[#7f7f7f]" />
                </div>
              )
            )}
            
            {/* Enhanced Profile Text with text shadow */}
            <div className="flex flex-col text-center md:text-left">
              <span className="text-sm font-bold text-white/80">{isArtist ? 'Artist' : 'Profile'}</span>
              <h1 className="text-[2rem] md:text-[3rem] font-bold mt-2 mb-4 text-shadow-lg">
                {isArtist ? user?.me?.artist?.name : user?.me?.username}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#a7a7a7]">
                {isArtist ? (
                  <>
                    <span>{user?.me?.monthlyListeners || 0} Monthly Listeners</span>
                    <span>•</span>
                    <span>{user?.me?.totalSongs || 0} Songs</span>
                    <span>•</span>
                    <span>{followersCount} Followers</span>
                  </>
                ) : (
                  <>
                    <span>{user?.me?.playlistCount || 0} Public Playlists</span>
                    <span>•</span>
                    <span>{followedArtists?.length || 0} Followed Artists</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons with better hover effects */}
        <div className="px-[32px] py-6 flex flex-wrap gap-4">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full px-8 py-3 text-[14px] transition-all duration-300"
          >
            Edit profile
          </Button>
          {isArtist ? (
            <Button
              className="bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-bold rounded-full px-8 py-3 text-[14px] transition-all duration-300"
            >
              <Link to="/artist">Upload Songs</Link>
            </Button>
          ) : (
            <Button
              className="bg-transparent hover:bg-[#ffffff1a] border border-[#ffffff4d] text-white font-bold rounded-full px-8 py-3 text-[14px]"
            >
              <Link to="/artist">Switch to Artist</Link>
            </Button>
          )}
          <Button
            onClick={handleLogout}
            className="bg-transparent hover:bg-[#ffffff1a] border border-[#ffffff4d] text-white font-bold rounded-full px-8 py-3 text-[14px]"
          >
            Logout
          </Button>
        </div>

        {/* Enhanced Content Sections */}
        <div className="bg-gradient-to-b from-[#121212] to-black relative">
          {/* Enhanced Playlists Grid */}
          <div className="px-[32px] py-4">
            <h2 className="text-2xl font-bold mb-4 text-shadow-sm">Public Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {/* Enhanced playlist cards */}
              {[1, 2, 3, 4, 5].map((playlist) => (
                <div 
                  key={playlist} 
                  className="bg-[#181818]/90 hover:bg-[#282828] backdrop-blur-sm transition-all duration-300 p-4 rounded-lg group cursor-pointer hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square bg-[#282828] rounded-md flex items-center justify-center">
                      <IconMusic className="w-12 h-12 text-[#7f7f7f]" />
                    </div>
                    <button 
                      className="absolute bottom-2 right-2 bg-[#1ed760] rounded-full p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1fdf64]"
                    >
                      <IconPlaystationCircle className="w-6 h-6 text-black" />
                    </button>
                  </div>
                  <h3 className="font-bold text-base mb-2 truncate">Playlist {playlist}</h3>
                  <p className="text-sm text-[#a7a7a7] truncate">By {user?.me?.username}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Top Songs */}
          <div className="px-[32px] py-4">
            <h2 className="text-2xl font-bold mb-4 text-shadow-sm">Top Songs</h2>
            <div className="flex flex-col">
              {songsData.slice(0, 5).map((song, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[16px,4fr,2fr] md:grid-cols-[16px,4fr,2fr,1fr] items-center p-2 rounded-md hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group"
                >
                  <span className="text-[#a7a7a7] group-hover:hidden">{index + 1}</span>
                  <button className="hidden group-hover:block text-white">
                    <IconPlaystationCircle className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4">
                    <img src={song.image} alt={song.name} className="w-10 h-10" />
                    <div>
                      <p className="text-white font-normal line-clamp-1">{song.name}</p>
                      <p className="text-sm text-[#a7a7a7] line-clamp-1">Artist name</p>
                    </div>
                  </div>
                  <span className="hidden md:block text-[#a7a7a7] truncate">Album name</span>
                  <span className="text-white/60">{song.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
