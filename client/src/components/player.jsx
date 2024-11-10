import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { Link } from "react-router-dom";
import { IconX } from "@tabler/icons-react";

const Player = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    previous,
  } = useContext(PlayerContext);

  // Add new refs for full screen seek bars
  const fullScreenSeekBg = useRef(null);
  const fullScreenSeekBar = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (seekBar.current) {
      seekBar.current.style.width = `${
        ((time.currentTime.seconds + time.currentTime.minute * 60) /
          (time.totalTime.seconds + time.totalTime.minute * 60)) *
        100
      }%`;
    }
    if (fullScreenSeekBar.current) {
      fullScreenSeekBar.current.style.width = `${
        ((time.currentTime.seconds + time.currentTime.minute * 60) /
          (time.totalTime.seconds + time.totalTime.minute * 60)) *
        100
      }%`;
    }
  }, [time]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = (x / rect.width) * 100;
    if (seekBar.current) {
      seekBar.current.style.width = `${progress}%`;
    }
    seekSong(e);
  };

  // Add new seek handler for full screen
  const seekSongFullScreen = (e) => {
    if (fullScreenSeekBg.current) {
      const width = fullScreenSeekBg.current.clientWidth;
      const clickX = e.nativeEvent.offsetX;
      const duration = time.totalTime.minute * 60 + time.totalTime.seconds;
      const seekTime = (clickX / width) * duration;
      seekSong(e, seekTime);
    }
  };

  return (
    <>
      {/* Full Screen View */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 text-white">
          {/* Top glassy gradient background */}
          <div
            className="absolute inset-0 backdrop-blur-[100px]"
            style={{
              background:
                "linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 15%, rgb(0, 0, 0) 100%)",
            }}
          />

          {/* Additional subtle glass overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div className="relative h-full flex flex-col p-8 z-10">
            {/* Header with close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsFullScreen(false)}
                className="text-white hover:text-gray-300 p-2 rounded-full backdrop-blur-md bg-white/10"
              >
                <IconX size={24} />
              </button>
            </div>

            {/* Song Info and Cover with animation */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {track && (
                <>
                  <img
                    className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] shadow-2xl rounded-md
                             transition-transform duration-500 hover:scale-105"
                    src={track.coverImage}
                    alt={track.title}
                  />
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
                    <Link
                      to={`/artists/${track.artist?.id}`}
                      className="text-xl text-gray-300 hover:underline"
                    >
                      {track.artist?.name}
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 mb-8 backdrop-blur-sm bg-black/20 py-6 rounded-lg">
              <div className="flex items-center gap-8">
                <img
                  className="w-6 cursor-pointer"
                  src={assets.shuffle_icon}
                  alt="shuffle"
                />
                <img
                  className="w-6 cursor-pointer"
                  src={assets.prev_icon}
                  alt="previous"
                  onClick={previous}
                />
                {playStatus ? (
                  <img
                    onClick={pause}
                    className="w-8 cursor-pointer"
                    src={assets.pause_icon}
                    alt="pause"
                  />
                ) : (
                  <img
                    onClick={play}
                    className="w-8 cursor-pointer"
                    src={assets.play_icon}
                    alt="play"
                  />
                )}
                <img
                  className="w-6 cursor-pointer"
                  src={assets.next_icon}
                  alt="next"
                  onClick={next}
                />
                <img
                  className="w-6 cursor-pointer"
                  src={assets.loop_icon}
                  alt="loop"
                />
              </div>

              {/* Seek Bar */}
              <div className="w-full max-w-2xl flex items-center gap-4">
                <p>
                  {String(time.currentTime.minute).padStart(2, "0")}:
                  {String(time.currentTime.seconds).padStart(2, "0")}
                </p>
                <div
                  ref={fullScreenSeekBg}
                  onClick={seekSongFullScreen}
                  className="flex-1 bg-gray-600 rounded-full cursor-pointer"
                >
                  <hr
                    ref={fullScreenSeekBar}
                    className="h-1 border-none w-0 bg-white rounded-full cursor-pointer"
                  />
                </div>
                <p>
                  {String(time.totalTime.minute).padStart(2, "0")}:
                  {String(time.totalTime.seconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Original Player - update the zoom icon click handler */}
      <div
        className={`h-[10%] bg-black flex justify-between items-center text-white px-4 
        transition-all duration-500 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        } md:cursor-default`}
        onClick={(e) => {
          if (window.innerWidth < 768) {
            setIsFullScreen(true);
          }
        }}
      >
        {/* Track Info */}
        <div className="hidden lg:flex items-center gap-4 w-60">
          {track && (
            <>
              <img
                className="w-12"
                src={track.coverImage}
                alt={track.title || "Track Cover"}
              />
              <div>
                <p>
                  {track.title.length > 20
                    ? `${track.title.substring(0, 18)}...`
                    : track.title || "Unknown Title"}
                </p>
                <Link
                  to={`/artists/${track.artist?.id}`}
                  className="cursor-pointer hover:underline"
                >
                  {track.artist?.name || "Unknown Artist"}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Controls and Seek Bar */}
        <div className="flex flex-col items-center gap-1 m-auto">
          <div className="flex gap-4">
            <img
              className="w-4 cursor-pointer"
              src={assets.shuffle_icon}
              alt="shuffle"
            />
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
            <img
              className="w-4 cursor-pointer"
              src={assets.loop_icon}
              alt="loop"
            />
          </div>

          {/* Seek Bar and Time Display */}
          <div className="flex items-center gap-5">
            <p>
              {String(time.currentTime.minute).padStart(2, "0")}:
              {String(time.currentTime.seconds).padStart(2, "0")}
            </p>
            <div
              ref={seekBg}
              onClick={handleSeek}
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
          <img
            className="w-4"
            src={assets.mini_player_icon}
            alt="mini-player"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.zoom_icon}
            alt="zoom"
            onClick={() => setIsFullScreen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default Player;
