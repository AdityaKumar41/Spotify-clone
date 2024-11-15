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
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";
import { useInView } from "react-intersection-observer"; // Import the intersection observer

export default function DisplayGenre() {
  const { id } = useParams();
  const location = useLocation();
  const genreColor = location.state?.color || "#1E3264"; // Default color if none provided
  const {
    data: tempgen,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetGenre(id);
  const genre = tempgen?.pages[0];
  const { track, playStatus, setTrack, audioRef, play, pause, setPlaylist } =
    useContext(PlayerContext);

  const { ref: loadMoreRef, inView } = useInView();
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (inView && !isLoading && hasNextPage && !loadingMore) {
      console.log("Fetching next page..."); // Debug log
      setLoadingMore(true); // Set loading state
      fetchNextPage().finally(() => {
        console.log("Finished fetching next page."); // Debug log
        setLoadingMore(false); // Reset loading state after fetch
      });
    }
  }, [inView, isLoading, hasNextPage, fetchNextPage, loadingMore]);

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

  // Update handlePlayAll function to set the playlist in context
  const handlePlayAll = async () => {
    if (genre?.songs?.length > 0) {
      const firstPlayableSong = genre.songs[0]; // Get first song

      console.log("First playable song:", firstPlayableSong);

      if (firstPlayableSong?.fileUrl) {
        try {
          // Set the playlist in context
          setTrack({
            ...firstPlayableSong,
            id: firstPlayableSong._id, // Use the actual _id instead of fileUrl
            name: firstPlayableSong.artist?.name || "Unknown Artist",
          });

          // Set the entire playlist in context
          setPlaylist(genre.songs);

          // Wait for audio to load before playing
          audioRef.current.src = firstPlayableSong.fileUrl;
          await audioRef.current.load();
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
        // Set track with all necessary properties
        setTrack({
          ...song,
          id: song._id, // Use the actual _id instead of fileUrl
          name: song.artist?.name || "Unknown Artist",
        });

        // Wait for audio to load before playing
        audioRef.current.src = song.fileUrl;
        await audioRef.current.load();
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
    minHeight: "30vh",
  };

  const mainGradient = {
    background: `linear-gradient(to bottom, ${genreColor}22 0%, rgba(0,0,0,1) 100%)`,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  console.log("genere", genre);

  // Render
  return (
    <>
      <div className="min-h-screen text-white" style={mainGradient}>
        <Navbar />
        {/* Header Section */}
        <div className="p-4 md:p-6" style={headerStyle}>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 h-full pt-16 md:pt-20">
            <div className="aspect-square w-[160px] md:w-[232px] h-[160px] md:h-[232px] shadow-lg rounded-lg overflow-hidden mx-auto md:mx-0">
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
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-medium">Genre</p>
              <h1 className="text-4xl md:text-8xl font-bold my-2 md:my-4 truncate">
                {genre?.name}
              </h1>
              {/* <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                <span className="font-medium flex gap-2 items-center">
                  <img src="/AudioFy-md.svg" alt="" className="w-20 h-7" />
                </span>
              </div> */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                <span className="font-medium">
                  {genre?.songs?.length || 0} songs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 md:px-6 -mt-8 relative z-10">
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
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-neutral-400 text-sm border-b border-neutral-700">
                    <th className="w-10 md:w-14 text-center pb-2">#</th>
                    <th className="text-left pb-2">Title</th>
                    <th className="hidden md:table-cell text-left pb-2">
                      Album
                    </th>
                    <th className="hidden md:table-cell text-left pb-2">
                      Date Added
                    </th>
                    <th className="w-8 md:w-16 text-center pb-2">
                      <IconClock className="w-4 h-4 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {genre.songs.map((song, index) => (
                    <tr
                      key={song._id}
                      className={`text-sm hover:bg-neutral-800 rounded transition-colors group ${
                        isPlaying(song) ? "text-green-500" : "text-neutral-300"
                      }`}
                      onClick={() => handleSongPlay(song)}
                    >
                      <td className="text-center p-2">{index + 1}</td>

                      <td className="py-2">
                        <div className="flex items-center gap-2 md:gap-4 align-middle">
                          <button
                            onClick={() => handleSongPlay(song)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 transition-all"
                          >
                            {isPlaying(song) ? (
                              <IconPlayerPauseFilled className="w-5 h-5" />
                            ) : (
                              <IconPlayerPlayFilled className="w-5 h-5" />
                            )}
                          </button>
                          <div className="w-10 h-10 rounded overflow-hidden bg-neutral-800 flex-shrink-0">
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
                            <p className="font-medium truncate">{song.title}</p>
                            <p className="text-xs text-neutral-400">
                              {song.artist?.name || "Unknown Artist"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell text-neutral-400">
                        {song.album?.name || "-"}
                      </td>
                      <td className="hidden md:table-cell text-neutral-400">
                        {formatDate(song.releaseDate)}
                      </td>
                      <td className="text-center text-neutral-400">
                        {formatDuration(song.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasNextPage && (
                <div ref={loadMoreRef} className="py-4 text-center">
                  Loading more...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
