import React, { useContext } from "react";
import Sidebar from "./components/sidebar";
import Player from "./components/player";
import Display from "./components/Display";
import Singup from "./components/Signup";
import { PlayerContext } from "./context/PlayerContext";
import { Buffer } from "buffer";
import { useMe } from "./hooks/useUser";
window.Buffer = Buffer;

export const App = () => {
  const { audioRef, track } = useContext(PlayerContext);
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212121]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {user?.me ? (
        <div className="h-screen bg-black">
          <div className={`${track ? "h-[90%]" : "h-full"} flex`}>
            <Sidebar />
            <Display />
          </div>
          {track && <Player />}
        </div>
      ) : (
        <Singup />
      )}
    </>
  );
};

export default App;
