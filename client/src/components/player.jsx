import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { Link } from "react-router-dom";

const Player = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    track,
    time,
    playStatus,
    play,
    pause,
    seekBg,
    seekBar,
    seekSong,
    next,
    previous
  } = useContext(PlayerContext);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`h-[10%] bg-black flex justify-between items-center text-white px-4 
      transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
      {/* Track Info */}
      <div className="hidden lg:flex items-center gap-4 w-60">
        {track && (
          <>
            <img className="w-12" src={track.coverImage} alt={track.title || "Track Cover"} />
            <div>
              <p>{track.title.length > 20 ? `${track.title.substring(0, 18)}...` : track.title || "Unknown Title"}</p>
              <Link to={`/artists/${track.artist?.id}`} className="cursor-pointer hover:underline">{track.artist?.name || "Unknown Artist"}</Link>
            </div>
          </>
        )}
      </div>

      {/* Controls and Seek Bar */}
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="shuffle" />
          <img 
            className="w-4 cursor-pointer" 
            src={assets.prev_icon} 
            alt="previous" 
            onClick={previous}
          />
          {playStatus ? (
            <img
              onClick={pause}
              className="w-4 cursor-pointer"
              src={assets.pause_icon}
              alt="pause"
            />
          ) : (
            <img
              onClick={play}
              className="w-4 cursor-pointer"
              src={assets.play_icon}
              alt="play"
            />
          )}
          <img 
            className="w-4 cursor-pointer" 
            src={assets.next_icon} 
            alt="next" 
            onClick={next}
          />
          <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="loop" />
        </div>

        {/* Seek Bar and Time Display */}
        <div className="flex items-center gap-5">
          <p>
            {String(time.currentTime.minute).padStart(2, "0")}:
            {String(time.currentTime.seconds).padStart(2, "0")}
          </p>
          <div 
            ref={seekBg}
            onClick={seekSong}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr 
              ref={seekBar}
              className="h-1 border-none w-0 bg-green-800 rounded-full cursor-pointer" 
            />
          </div>
          <p>
            {String(time.totalTime.minute).padStart(2, "0")}:
            {String(time.totalTime.seconds).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Extra Player Controls */}
      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <img className="w-4" src={assets.plays_icon} alt="plays" />
        <img className="w-4" src={assets.mic_icon} alt="mic" />
        <img className="w-4" src={assets.queue_icon} alt="queue" />
        <img className="w-4" src={assets.speaker_icon} alt="speaker" />
        <img className="w-4" src={assets.volume_icon} alt="volume" />
        <div className="w-20 bg-slate-50 h-1 rounded"></div>
        <img className="w-4" src={assets.mini_player_icon} alt="mini-player" />
        <img className="w-4" src={assets.zoom_icon} alt="zoom" />
      </div>
    </div>
  );
};

export default Player;
