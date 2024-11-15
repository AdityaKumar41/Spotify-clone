import React from "react";
import Navbar from "./Navbar";
import AlbumItems from "./AlbumItems";
import Songitem from "./Songitem";
import { useGetSongs } from "../hooks/useSong";
import { useGetArtists, useGetFollowedArtists } from "../hooks/useArtist";
import { useMe } from "../hooks/useUser";
import { useInView } from "react-intersection-observer";

const DisplayHome = () => {
  const { data: user } = useMe();
  const {
    data: songsData,
    fetchNextPage: fetchNextSongs,
    hasNextPage: hasNextSongs,
    isLoading: isLoadingSongs,
  } = useGetSongs();
  const {
    data: artistsData,
    fetchNextPage: fetchNextArtists,
    hasNextPage: hasNextArtists,
    isLoading: isLoadingArtists,
  } = useGetArtists();
  const {
    data: followedArtists,
    fetchNextPage: fetchNextFollowedArtists,
    hasNextPage: hasNextFollowedArtists,
    isLoading: isLoadingFollowedArtists,
  } = useGetFollowedArtists(user?.me?.id);

  // Intersection Observer for Songs and Artists
  const { ref: songsLoadMoreRef, inView: songsInView } = useInView();
  const { ref: artistsLoadMoreRef, inView: artistsInView } = useInView();

  // Intersection Observer for Followed Artists
  const { ref: followedArtistsLoadMoreRef, inView: followedArtistsInView } =
    useInView();

  // Infinite scroll for songs
  React.useEffect(() => {
    if (songsInView && hasNextSongs && !isLoadingSongs) {
      fetchNextSongs();
    }
  }, [songsInView, fetchNextSongs, hasNextSongs, isLoadingSongs]);

  // Infinite scroll for artists
  React.useEffect(() => {
    if (artistsInView && hasNextArtists && !isLoadingArtists) {
      fetchNextArtists();
    }
  }, [artistsInView, fetchNextArtists, hasNextArtists, isLoadingArtists]);

  // Infinite scroll for followed artists
  React.useEffect(() => {
    if (
      followedArtistsInView &&
      hasNextFollowedArtists &&
      !isLoadingFollowedArtists
    ) {
      fetchNextFollowedArtists();
    }
  }, [
    followedArtistsInView,
    fetchNextFollowedArtists,
    hasNextFollowedArtists,
    isLoadingFollowedArtists,
  ]);

  // Flatten pages for songs and artists
  const allSongs = songsData?.pages.flatMap((page) => page) || [];
  const allArtists = artistsData?.pages.flatMap((page) => page) || [];

  // Filter artists who have songs
  const artistsWithSongs = allArtists.filter((artist) => {
    return allSongs.some((song) => song.artist.id === artist.id);
  });

  return (
    <div className="p-4 md:p-0">
      <Navbar />

      {followedArtists?.pages.length > 0 &&
        !user.me.artist &&
        followedArtists.pages.some((page) => page.length > 0) && (
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl cursor-pointer">
              Followed Artists
            </h1>
            <div className="flex overflow-auto">
              {followedArtists.pages
                .flatMap((page) => page)
                .map((item) => (
                  <AlbumItems
                    key={item.id}
                    name={item.name}
                    desc={item.bio}
                    id={item.id}
                    image={item.image}
                  />
                ))}
              <div
                ref={followedArtistsLoadMoreRef}
                className="w-24 h-24 flex items-center justify-center"
              >
                {isLoadingFollowedArtists && (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                )}
              </div>
            </div>
          </div>
        )}

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl cursor-pointer">
          Featured Charts
        </h1>
        <div className="flex overflow-auto">
          {artistsWithSongs.map((item) => (
            <AlbumItems
              key={item.id}
              name={item.name}
              desc={item.bio}
              id={item.id}
              image={item.image}
            />
          ))}
          <div
            ref={artistsLoadMoreRef}
            className="w-24 h-24 flex items-center justify-center"
          >
            {isLoadingArtists && (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl cursor-pointer">
          Today's biggest hits
        </h1>
        <div className="flex overflow-auto">
          {allSongs.map((item) => (
            <Songitem
              key={item.id}
              name={item.title}
              author={item.artist.name}
              id={item.id}
              image={item.coverImage}
            />
          ))}
          <div
            ref={songsLoadMoreRef}
            className="w-24 h-24 flex items-center justify-center"
          >
            {isLoadingSongs && (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayHome;
