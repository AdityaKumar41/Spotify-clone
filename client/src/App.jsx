import React, { useContext, useState } from "react";
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
  const { data: user } = useMe();

  console.log(user);
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
