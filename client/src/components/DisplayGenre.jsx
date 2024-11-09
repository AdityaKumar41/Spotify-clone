import { useParams, useLocation } from "react-router-dom";
import { formatDuration } from "../utils/formatTime";
import {
  IconClock,
  IconPlayerPlayFilled,
  IconHeart,
  IconMusic,
  IconPlaylist,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";
import { useGetGenre } from "../hooks/useSong";
import { useContext, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";

export default function DisplayGenre() {
  const { id } = useParams();
  const location = useLocation();
  const genreColor = location.state?.color || "#1E3264"; // Default color if none provided
  const { data: genre, isLoading, error } = useGetGenre(id);
  const { 
    track, 
    playStatus, 
    setTrack,
    audioRef,
    play,
    pause
  } = useContext(PlayerContext);

  // Debug log to check context values
  useEffect(() => {
    console.log("Current track:", track);
    console.log("Play status:", playStatus);
    console.log("Audio ref:", audioRef.current);
  }, [track, playStatus]);

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      // Convert milliseconds to Date object
      const date = new Date(parseInt(dateString));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };


  // Get up to 4 song images for the playlist cover
  const getPlaylistImages = () => {
    if (!genre?.songs?.length) return [];
    return genre.songs
      .filter((song) => song.coverImage)
      .slice(0, 4)
      .map((song) => song.coverImage);
  };

  // Update handlePlayAll function with debug logs
  const handlePlayAll = async () => {
    if (genre?.songs?.length > 0) {
      const firstPlayableSong = genre.songs[0]; // Get first song

      console.log("First playable song:", firstPlayableSong);
      
      if (firstPlayableSong?.fileUrl) {
        try {
          // Set track with artist from song's artist object
          setTrack({
            ...firstPlayableSong,
            id: firstPlayableSong.fileUrl,
            name: firstPlayableSong.artist?.name || "Unknown Artist"
          });
          
          audioRef.current.src = firstPlayableSong.fileUrl;
          await audioRef.current.play();
          play();
        } catch (error) {
          console.error("Error in handlePlayAll:", error);
        }
      }
    }
  };

  // Update handleSongPlay function with debug logs
  const handleSongPlay = async (song) => {
    if (!song.fileUrl) {
      console.log("Cannot play song - missing fileUrl");
      return;
    }

    try {
      // Use fileUrl as id for comparison
      if (track?.fileUrl === song.fileUrl && playStatus) {
        pause();
        audioRef.current.pause();
      } else {
        // Set track with artist from song's artist object
        setTrack({
          ...song,
          id: song.fileUrl,
          name: song.artist?.name || "Unknown Artist"
        });
        
        audioRef.current.src = song.fileUrl;
        await audioRef.current.play();
        play();
      }
    } catch (error) {
      console.error("Error in handleSongPlay:", error);
    }
  };

  // Update isPlaying check
  const isPlaying = (song) => {
    return track?.fileUrl === song.fileUrl && playStatus;
  };

  // Create dynamic gradient styles
  const headerStyle = {
    background: `linear-gradient(to bottom, ${genreColor}dd 0%, rgba(0,0,0,1) 100%)`,
    minHeight: "40vh",
  };

  const mainGradient = {
    background: `linear-gradient(to bottom, ${genreColor}22 0%, rgba(0,0,0,1) 100%)`,
  };

  useEffect(() => {
    if (genre?.songs?.length > 0) {
      const firstPlayableSong = genre.songs.find(
        (song) => song.id && song.fileUrl
      );
      if (firstPlayableSong) {
        setTrack(firstPlayableSong);
        audioRef.current.src = firstPlayableSong.fileUrl;

      }
    }
  }, [genre, setTrack]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // ... error and null checks remain the same ...

  return (
    <>
      <div className="min-h-screen text-white" style={mainGradient}>
        <Navbar />
        {/* Enhanced Header Section with Dynamic Color */}
        <div className="p-6" style={headerStyle}>
          <div className="flex items-end gap-6 h-full pt-20">
            <div className="aspect-square w-[232px] h-[232px] shadow-lg rounded-lg overflow-hidden">
              {getPlaylistImages().length > 0 ? (
                <div className="w-full h-full">
                  {getPlaylistImages().length === 1 ? (
                    <img
                      src={getPlaylistImages()[0]}
                      alt="Playlist cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="grid grid-cols-2 h-full">
                      {getPlaylistImages().map((image, index) => (
                        <div key={index} className="relative w-full h-full">
                          <img
                            src={image}
                            alt={`Cover ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${genreColor}66` }}
                >
                  <IconMusic className="w-24 h-24 text-white/75" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Genre</p>
              <h1 className="text-8xl font-bold my-4 truncate">
                {genre?.name}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {genre?.songs?.length || 0} songs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section with Fade Effect */}
        <div className="px-6 -mt-8 relative z-10">
          {/* Play Button with Dynamic Color */}
          {genre?.songs?.length > 0 && (
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handlePlayAll}
                className="w-14 h-14 flex items-center justify-center rounded-full hover:scale-105 transition-all group"
                style={{ backgroundColor: genreColor }}
              >
                <IconPlayerPlayFilled className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {!genre?.songs?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <IconPlaylist className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Songs Yet</h3>
              <p>This genre doesn't have any songs yet.</p>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-neutral-400 text-sm border-b border-neutral-700">
                  <th className="w-14 text-center pb-2">#</th>
                  <th className="text-left pb-2">Title</th>
                  <th className="text-left pb-2">Album</th>
                  <th className="text-left pb-2">Date added</th>
                  <th className="w-14 pb-2">
                    <IconClock className="w-5 h-5" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {genre.songs.map((song, index) => (
                  <tr
                    key={song.fileUrl} // Use fileUrl as key
                    className={`group hover:bg-white/10 rounded-md text-sm text-neutral-400 
                                        ${isPlaying(song) ? "bg-white/20" : ""}`}
                  >
                    <td className="w-14 text-center py-2">
                      <span className={`group-hover:hidden ${isPlaying(song) ? "hidden" : ""}`}>
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleSongPlay(song)}
                        className={`${isPlaying(song) || "group-hover:block"} 
                          ${isPlaying(song) ? "block" : "hidden"} mx-auto
                          ${!song.fileUrl ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={!song.fileUrl}
                      >
                        {isPlaying(song) ? (
                          <IconPlayerPauseFilled className="w-4 h-4 text-green-500" />
                        ) : (
                          <IconPlayerPlayFilled className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden bg-neutral-800">
                          {song.coverImage ? (
                            <img
                              src={song.coverImage}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <IconMusic className="w-6 h-6 text-neutral-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-medium hover:underline cursor-pointer
                                                    ${
                                                      isPlaying(song)
                                                        ? `text-[${genreColor}]`
                                                        : "text-white"
                                                    }`}
                          >
                            {song.title}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {song.artist?.name || "Unknown Artist"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">-</td>
                    <td className="py-2">{formatDate(song.releaseDate)}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-4 justify-end">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconHeart className="w-4 h-4 hover:text-white transition-colors" />
                        </button>
                        <span>{formatDuration(song.duration)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
