import { IconHome, IconSearch, IconMusic } from "@tabler/icons-react";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useUser";
import { useGetGenres, useSearchSongs } from "../hooks/useSong";
import { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";
import { useGetArtists } from "../hooks/useArtist";

export default function Search() {
    const { data: user } = useMe();
    const {playWithId} = useContext(PlayerContext)
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { data: searchResults, isLoading } = useSearchSongs(searchQuery);
    const { data: genres, isLoading: genresLoading } = useGetGenres();
    const { data: artists, isLoading: artistsLoading } = useGetArtists();
    console.log(genres);

    // Helper function to generate consistent colors for genres
    const getGenreColor = (index) => {
        const colors = [
            '#E13300', '#056952', '#8400E7', '#1E3264',
            '#537D1C', '#E1118C', '#B42F95', '#C74B16',
            '#BA5D07', '#0D72EA', '#8D67AB', '#E13300'
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="flex items-center gap-4 p-4">
                <IconHome size={24} onClick={() => navigate('/')}/>
                
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
                    <div className="text-black w-10 h-10 rounded-full flex items-center justify-center">
                        <Link to={`/profile`}>
                            <img
                                className="rounded-full"
                                src={user?.me?.profileImage}
                                alt="pr_image"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {searchQuery ? (
                    // Search Results Section
                    <div>
                        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : searchResults?.length > 0 ? (
                            <div className="space-y-4">
                                {searchResults.map((song) => (
                                    <div key={song.id} className="flex items-center gap-4 p-2 hover:bg-neutral-800 rounded cursor-pointer" onClick={() => playWithId(song.id)}>
                                        <img 
                                            src={song.coverImage} 
                                            alt={song.title} 
                                            className="w-12 h-12 object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold">{song.title}</div>
                                            <div className="text-sm text-neutral-400">{song.artist.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No results found</div>
                        )}
                    </div>
                ) : (
                    // Updated Browse Categories Section
                    <>
                        <h1 className="text-2xl font-bold mb-6">Browse Genres</h1>

                        {genresLoading ? (
                            <div>Loading genres...</div>
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
                                            backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
                                        }}
                                    >
                                        <div className="h-full flex flex-col justify-between">
                                            <h2 className="text-3xl font-bold text-white">
                                                {genre.name}
                                            </h2>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* New Artists Section */}
                        <h1 className="text-2xl font-bold mb-6 mt-12">Popular Artists</h1>

                        {artistsLoading ? (
                            <div>Loading artists...</div>
                        ) : (
                            <div className="space-y-4">
                                {artists?.map((artist) => (
                                    <Link 
                                        key={artist.id} 
                                        to={`/artists/${artist.id}`}
                                        className="flex items-center p-4 hover:bg-neutral-800 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center flex-1">
                                            <img
                                                src={artist.image}
                                                alt={artist.name}
                                                className="w-[60px] h-[60px] rounded-full object-cover mr-4"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-white text-lg">
                                                    {artist.name}
                                                </h3>
                                                <p className="text-sm text-neutral-400">Artist</p>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconMusic className="w-6 h-6 text-white" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
