import { IconHome, IconSearch, IconMusic } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useUser";
import { useGetGenres, useSearchSongs } from "../hooks/useSong";
import { useContext, useState, useEffect, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useGetArtists } from "../hooks/useArtist";
import { Skeleton } from "@nextui-org/skeleton";
import { useInView } from 'react-intersection-observer';

export default function Search() {
  const { data: user } = useMe();
  const { playWithId } = useContext(PlayerContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { ref: songsRef, inView: songsInView } = useInView({ threshold: 1.0 });
  const { ref: artistsRef, inView: artistsInView } = useInView({ threshold: 1.0 });

  const {
    data: searchResults,
    fetchNextPage: fetchMoreSongs,
    hasNextPage: hasMoreSongs,
    isLoading: isSearching,
  } = useSearchSongs(searchQuery);

  const { data: genres, isLoading: genresLoading } = useGetGenres();

  const {
    data: artistsData,
    fetchNextPage: fetchMoreArtists,
    hasNextPage: hasMoreArtists,
    isLoading: artistsLoading,
  } = useGetArtists();

  useEffect(() => {
    if (songsInView && hasMoreSongs && !isSearching) {
      fetchMoreSongs();
    }
  }, [songsInView, fetchMoreSongs, hasMoreSongs, isSearching]);

  useEffect(() => {
    if (artistsInView && hasMoreArtists && !artistsLoading) {
      fetchMoreArtists();
    }
  }, [artistsInView, fetchMoreArtists, hasMoreArtists, artistsLoading]);

  const artists = useMemo(() => {
    return artistsData?.pages.flatMap((page) => page) ?? [];
  }, [artistsData]);

  const getGenreColor = (index) => {
    const colors = [
      "#E13300", "#056952", "#8400E7", "#1E3264",
      "#537D1C", "#E1118C", "#B42F95", "#C74B16",
      "#BA5D07", "#0D72EA", "#8D67AB", "#E13300",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen text-white w-full">
      <header className="flex items-center gap-4 p-4">
        <IconHome size={24} onClick={() => navigate("/")} />
        <div className="relative flex-1 max-w-md bg-neutral-800 text-white p-2 rounded-full">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="w-[90%] ml-8 bg-transparent focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to={user?.me?.isArtist ? `/artist/profile` : `/profile`}>
            <img
              className={`rounded-full ${user?.me?.artist ? 'border-2 border-purple-500' : ''}`}
              src={user?.me?.artist?.image || user?.me?.profileImage}
              alt={user?.me?.artist ? 'artist_profile' : 'user_profile'}
              width={40} height={40}
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {searchQuery ? (
          // Search Results Section with Infinite Scroll
          <div>
            <h1 className="text-2xl font-bold mb-6">Search Results</h1>
            {isSearching ? (
              <div>Loading...</div>
            ) : searchResults?.pages?.length > 0 ? (
              <div className="space-y-4">
                {searchResults.pages.flatMap((page) =>
                  page.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-2 hover:bg-neutral-800 rounded cursor-pointer"
                      onClick={() => playWithId(song.id)}
                    >
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-12 h-12 object-cover"
                      />
                      <div>
                        <div className="font-semibold">{song.title}</div>
                        <div className="text-sm text-neutral-400">
                          {song.artist.name}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={songsRef} className="h-4">
                  {hasMoreSongs && isSearching && (
                    <div className="text-center text-white">Loading more songs...</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-neutral">No results found!</div>
            )}
          </div>
        ) : (
          // Browse Categories and Popular Artists Sections (unchanged)
          <>
            <h1 className="text-2xl font-bold mb-6">Browse Genres</h1>
            {genresLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <Skeleton key={index} className="relative overflow-hidden rounded-lg h-48 bg-neutral-800" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {genres?.map((genre, index) => (
                  <Link
                    key={genre.id}
                    to={`/genres/${genre.id}`}
                    state={{ color: getGenreColor(index) }}
                    className="relative overflow-hidden rounded-lg h-48 p-4 transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: getGenreColor(index),
                      backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                    }}
                  >
                    <h2 className="text-3xl font-bold text-white">{genre.name}</h2>
                  </Link>
                ))}
              </div>
            )}
            {/* Popular Artists Section */}
            <h1 className="text-2xl font-bold mb-6 mt-12">Popular Artists</h1>
            {artistsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="flex items-center p-4 bg-neutral-800 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {artists?.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artists/${artist.id}`}
                    className="flex items-center p-4 hover:bg-neutral-800 rounded-lg transition-colors group"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-[60px] h-[60px] rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-lg">{artist.name}</h3>
                      <p className="text-sm text-neutral-400">Artist</p>
                    </div>
                    <IconMusic className="ml-auto w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
                <div ref={artistsRef} className="h-4">
                  {hasMoreArtists && artistsLoading && (
                    <div className="text-center text-white">Loading more artists...</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
