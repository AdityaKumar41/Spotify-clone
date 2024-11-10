import React, { useContext } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { albumsData, assets, songsData } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useGetSongByArtist } from "../hooks/useSong";
import SpacerArtist from "./SpacerArtist";
import {
  IconClock,
  IconPlayerPlayFilled,
  IconHeart,
  IconMusic,
  IconPlaylist,
  IconPlayerPauseFilled,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
} from "@tabler/icons-react";

const getArtistGradient = (artistId) => {
  // Simple array of gradient pairs
  const gradientPairs = [
    ['#1DB954', '#115E2C'], // Spotify green
    ['#E91E63', '#880E4F'], // Pink
    ['#2196F3', '#0D47A1'], // Blue
    ['#FF5722', '#BF360C'], // Deep Orange
    ['#9C27B0', '#4A148C'], // Purple
    ['#FF9800', '#E65100'], // Orange
    ['#00BCD4', '#006064'], // Cyan
    ['#F44336', '#B71C1C'], // Red
    ['#4CAF50', '#1B5E20'], // Green
    ['#3F51B5', '#1A237E'], // Indigo
  ];

  const index = ((parseInt(artistId) || 0) - 1) % gradientPairs.length;
  const [startColor, endColor] = index >= 0 ? gradientPairs[index] : gradientPairs[0];

  return {
    header: `linear-gradient(180deg, ${startColor} 0%, rgba(0,0,0,1) 100%)`,
    solid: startColor // For play button
  };
};

const calculateTotalDuration = (songs) => {
  try {
    const totalSeconds = songs.reduce((acc, song) => {
      return acc + (song.duration || 0);
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    return minutes;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

const formatDate = (timestamp) => {
  try {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

const DisplayAlbum = () => {
  const { id } = useParams();
  const { data: albumData } = useGetSongByArtist(id);
  const { 
    track, 
    playStatus, 
    setTrack,
    audioRef,
    play,
    pause
  } = useContext(PlayerContext);

  const handlePlayAll = async () => {
    if (albumData?.length > 0) {
      const firstSong = albumData[0];
      try {
        setTrack({
          ...firstSong,
          name: firstSong.artist?.name || "Unknown Artist"
        });
        audioRef.current.src = firstSong.fileUrl;
        await audioRef.current.load();
        await audioRef.current.play();
        play();
      } catch (error) {
        console.error("Error in handlePlayAll:", error);
      }
    }
  };

  const handleSongPlay = async (song) => {
    if (!song.fileUrl) return;

    try {
      if (track?.fileUrl === song.fileUrl && playStatus) {
        pause();
        audioRef.current.pause();
      } else {
        setTrack({
          ...song,
          name: song.artist?.name || "Unknown Artist"
        });
        audioRef.current.src = song.fileUrl;
        await audioRef.current.load();
        await audioRef.current.play();
        play();
      }
    } catch (error) {
      console.error("Error in handleSongPlay:", error);
    }
  };

  const isPlaying = (song) => {
    return track?.fileUrl === song.fileUrl && playStatus;
  };

  // Show loading state
  if (!albumData || !Array.isArray(albumData) || albumData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const artistData = albumData[0]?.artist;
  const gradients = getArtistGradient(artistData?.id);

  const headerStyle = {
    background: gradients.header,
    minHeight: "30vh",
  };

  return (
    <>
      <div className="min-h-screen text-white bg-black">
        <Navbar />
        {/* Header Section */}
        <div className="p-4 md:p-6" style={headerStyle}>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 h-full pt-16 md:pt-20">
            <div className="aspect-square w-[140px] md:w-[232px] h-[140px] md:h-[232px] shadow-lg rounded-lg overflow-hidden mx-auto md:mx-0">
              {artistData?.image ? (
                <img
                  src={artistData.image}
                  alt={artistData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <IconMusic className="w-16 md:w-24 h-16 md:h-24 text-white/75" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-medium">Artist</p>
              <h1 className="text-3xl md:text-8xl font-bold my-2 md:my-4 truncate">
                {artistData?.name || 'Unknown Artist'}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm align-middle flex-col md:flex-row">
               <div className="flex items-center gap-2">
               <span className="font-medium">{albumData.length} songs</span>
                <span>•</span>
                <span>{calculateTotalDuration(albumData)} min</span>
               </div>
                <div className="flex items-center gap-4">
                  {artistData?.instagram && (
                    <a
                      href={artistData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <IconBrandInstagram className="w-[22px] h-[22px]" />
                    </a>
                  )}
                  {artistData?.twitter && (
                    <a
                      href={artistData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                      aria-label="Twitter"
                    >
                      <IconBrandTwitter className="w-[22px] h-[22px]" />
                    </a>
                  )}
                  {artistData?.facebook && (
                    <a
                      href={artistData.facebook.startsWith('http') ? artistData.facebook : `https://facebook.com/${artistData.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <IconBrandFacebook className="w-[22px] h-[22px]" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Now with black background */}
        <div className="px-4 md:px-6 -mt-8 relative z-10">
          {albumData.length > 0 && (
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handlePlayAll}
                className="w-14 h-14 flex items-center justify-center rounded-full hover:scale-105 transition-all group"
                style={{ backgroundColor: gradients.solid }} // Apply solid color to play button
              >
                <IconPlayerPlayFilled className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {/* Table section - now with clean background */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-neutral-400 text-sm border-b border-neutral-700">
                  <th className="w-10 md:w-14 text-center pb-2">#</th>
                  <th className="text-left pb-2">Title</th>
                  <th className="hidden md:table-cell text-left pb-2">Album</th>
                  <th className="hidden md:table-cell text-left pb-2">Date added</th>
                  <th className="w-14 pb-2">
                    <IconClock className="w-5 h-5" />
                  </th>
                  <th className="w-14 pb-2"></th> {/* For play button */}
                </tr>
              </thead>
              <tbody>
                {albumData.map((song, index) => (
                  <tr
                    key={song.fileUrl}
                    className={`group hover:bg-white/10 rounded-md text-sm text-neutral-400 
                      ${isPlaying(song) ? "bg-white/20" : ""}`}
                  >
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
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
                        <div className="min-w-0">
                          <div className={`font-medium truncate
                            ${isPlaying(song) ? "text-green-500" : "text-white"}`}>
                            {song.title}
                          </div>
                          <div className="text-sm text-neutral-400 truncate">
                            {song.artist?.name || "Unknown Artist"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-2">{song.album?.title || artistData?.name}</td>
                    <td className="hidden md:table-cell py-2">{formatDate(song.releaseDate)}</td>
                    <td className="py-2 text-right pr-4">
                      {song.duration ? 
                        `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` 
                        : '--:--'}
                    </td>
                    <td className="py-2 w-14">
                      <button
                        onClick={() => handleSongPlay(song)}
                        className={`p-2 rounded-full hover:bg-white/10 transition-all
                          ${!song.fileUrl ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={!song.fileUrl}
                      >
                        {isPlaying(song) ? (
                          <IconPlayerPauseFilled className="w-5 h-5 text-green-500" />
                        ) : (
                          <IconPlayerPlayFilled className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayAlbum;
