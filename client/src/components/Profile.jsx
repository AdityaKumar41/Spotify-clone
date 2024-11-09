import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import {
  IconMathGreater,
  IconMusic,
  IconPlaystationCircle,
  IconUser,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { albumsData, songsData } from "../assets/assets";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";
// import { useCurrentUser } from "../hooks/user";
import { image } from "@nextui-org/theme";
import { useMe } from "../hooks/useUser";

export default function Profile() {
  const { data: user } = useMe();
  const { playWithId } = useContext(PlayerContext);

  // if (!albumData)
  //   return (
  //     <>
  //       <Navbar />
  //       <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
  //         <IconUser className="w-24 h-24 text-gray-500 mb-6" />
  //         <h1 className="text-4xl font-bold mb-4">No User Found</h1>
  //         <p className="text-xl text-gray-400 mb-8">
  //           We couldn't find the user you're looking for.
  //         </p>
  //         <Button className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded-full">
  //           <Link to={"/"}>Go to Home</Link>
  //         </Button>
  //       </main>
  //     </>
  //   );
  console.log(user);
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen ">
        <header className="flex flex-col items-center pt-16 pb-8 px-4">
          {user?.me?.profileImage ? (
            <img
              src={user?.me?.profileImage}
              className="w-40 h-40 mb-4 rounded-full"
            />
          ) : (
            <Avatar className="w-40 h-40 mb-4" />
          )}
          <h1 className="text-3xl font-bold mb-2">{user.me?.username}</h1>
          <p className="text-sm text-gray-400 mb-4">
            1,234 followers • 567 following
          </p>
          <div className=" flex flex-col gap-4">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">
              Edit profile
            </Button>
            <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-br from-indigo-500 to-green-500 border-small border-white/50 shadow-green-500/30 p-4",
                content: "drop-shadow shadow-black text-white",
              }}
            >
              <Link to={"/artist"}>Switch to Artist!</Link>
            </Chip>
          </div>
        </header>
        <main className="flex-1 p-6">
          {/* <h2 className="text-2xl font-bold mb-4">Popular</h2>
          {songsData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
            >
              <p onClick={() => playWithId(item.id)} className="text-white">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <img className="inline w-10 mr-5" src={item.image} alt="" />
                {item.name}
              </p>
              <p className="text-[15px] ">{albumData.name}</p>
              <p className="text-[15px] hidden sm:block cursor-pointer">
                5 days ago
              </p>
              <p className="text-[15px] text-center">{item.duration}</p>
            </div>
          ))} */}
          <h2 className="text-2xl font-bold my-4">Public Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((playlist) => (
              <div key={playlist} className="bg-gray-900 p-4 rounded-lg">
                <div className="relative w-full pb-[100%] mb-4">
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <IconMusic className="w-12 h-12 text-gray-600" />
                  </div>
                  <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <IconPlaystationCircle className="w-6 h-6 text-black" />
                  </button>
                </div>
                <h3 className="font-semibold mb-1">Playlist {playlist}</h3>
                <p className="text-sm text-gray-400">By John Doe</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
