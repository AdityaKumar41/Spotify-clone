import React, { useContext } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { albumsData, assets, songsData } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { useGetSongByArtist } from "../hooks/useSong";
import SpacerArtist from "./SpacerArtist";

const calculateTotalDuration = (songs) => {
  try {
    const totalMinutes = songs.reduce((acc, song) => {
      if (!song.duration) return acc;

      // Handle if duration is already a number (in seconds)
      if (typeof song.duration === 'number') {
        return acc + (song.duration / 60);
      }

      // Handle string format "3:45" or "03:45"
      if (typeof song.duration === 'string') {
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          const [minutes, seconds] = parts.map(Number);
          return acc + minutes + seconds / 60;
        }
      }

      return acc;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return { hours, minutes };
  } catch (error) {
    console.error('Error calculating duration:', error);
    return { hours: 0, minutes: 0 };
  }
};

const DisplayAlbum = () => {
  const { id } = useParams();
  const { data: albumData } = useGetSongByArtist(id);
  const { playWithId } = useContext(PlayerContext);

  if (!albumData || !Array.isArray(albumData) || albumData.length === 0) {
    return (
      <>
        <Navbar />
        <SpacerArtist/>
      </>
    );
  }

  const artistData = albumData[0]?.artist;

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-44 h-44 object-cover rounded"
          src={artistData?.image || '/default-artist-image.jpg'}
          alt={artistData?.name || 'Artist'}
        />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {artistData?.name || 'Unknown Artist'}
          </h2>
          <h4>{artistData?.bio || 'No biography available'}</h4>
          <p className="mt-1">
            <img
              className="inline-block w-5 mr-1"
              src={assets.spotify_logo}
              alt="Spotify Logo"
            />
            <b>Spotify</b> • <b>{albumData.length} songs,</b>
            {(() => {
              const { hours, minutes } = calculateTotalDuration(albumData);
              return `about ${hours ? `${hours} hr` : ''} ${minutes} min`;
            })()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="Clock Icon" />
      </div>
      <hr />
      {Array.isArray(albumData) ? (
        albumData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          >
            <p onClick={() => playWithId(item.id)} className="text-white">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5" src={item.coverImage} alt="" />
              {item.title}
            </p>
            <p className="text-[15px] ">{item.album?.title || albumData.title}</p>
            <p className="text-[15px] hidden sm:block cursor-pointer">
              5 days ago
            </p>
            <p className="text-[15px] text-center">{item.duration}</p>
          </div>
        ))
      ) : null}
    </>
  );
};

export default DisplayAlbum;
