import { createContext, useEffect, useRef, useState } from "react";
import { useGetSongs } from "../hooks/useSong";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const { data, fetchNextPage, hasNextPage } = useGetSongs();
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { seconds: 0, minute: 0 },
        totalTime: { seconds: 0, minute: 0 },
    });

    // Flatten paginated songs data
    const songs = data?.pages?.flatMap(page => page) || [];

    useEffect(() => {
        if (songs.length > 0 && !track) {
            // setTrack(songs[0]);
        }
    }, [songs]);

    const play = () => {
        if (audioRef.current && track) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        const selectedTrack = songs.find(song => song.id === id);
        if (selectedTrack) {
            setTrack(selectedTrack);
            if (audioRef.current) {
                audioRef.current.src = selectedTrack.fileUrl;
                await audioRef.current.play();
                setPlayStatus(true);
            }
        }
    };

    const previous = async () => {
        if (!track || !songs.length) return;
        
        const currentIndex = songs.findIndex(song => song.id === track.id);
        if (currentIndex > 0) {
            const previousTrack = songs[currentIndex - 1];
            setTrack(previousTrack);
            if (audioRef.current) {
                audioRef.current.src = previousTrack.fileUrl;
                await audioRef.current.play();
                setPlayStatus(true);
            }
        }
    };

    const next = async () => {
        const currentIndex = songs.findIndex(song => song.id === track?.id);
        if (currentIndex < songs.length - 1) {
            const nextTrack = songs[currentIndex + 1];
            setTrack(nextTrack);
            if (audioRef.current) {
                audioRef.current.src = nextTrack.fileUrl;
                await audioRef.current.play();
                setPlayStatus(true);
            }
        } else if (hasNextPage) {
            // Fetch more songs if there’s a next page
            await fetchNextPage();
        }
    };

    const seekSong = (e) => {
        if (audioRef.current && seekBg.current) {
            const clickPosition = e.nativeEvent.offsetX;
            const seekBgWidth = seekBg.current.offsetWidth;
            const newTime = (clickPosition / seekBgWidth) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.ontimeupdate = () => {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;

                if (seekBar.current) {
                    seekBar.current.style.width = `${(currentTime / duration) * 100}%`;
                }

                setTime({
                    currentTime: {
                        minute: Math.floor(currentTime / 60),
                        seconds: Math.floor(currentTime % 60),
                    },
                    totalTime: {
                        minute: Math.floor(duration / 60),
                        seconds: Math.floor(duration % 60),
                    },
                });
            };
        }
    }, [audioRef]);

    useEffect(() => {
        if (audioRef.current) {
            const handleSongEnd = async () => {
                const currentIndex = songs.findIndex(song => song.id === track?.id);
                if (currentIndex < songs.length - 1) {
                    const nextTrack = songs[currentIndex + 1];
                    setTrack(nextTrack);
                    audioRef.current.src = nextTrack.fileUrl;
                    await audioRef.current.play();
                    setPlayStatus(true);
                } else if (hasNextPage) {
                    await fetchNextPage();
                }
            };

            audioRef.current.addEventListener('ended', handleSongEnd);
            
            return () => {
                audioRef.current?.removeEventListener('ended', handleSongEnd);
            };
        }
    }, [audioRef, track, songs, fetchNextPage, hasNextPage]);

    useEffect(() => {
        if ('mediaSession' in navigator && track) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist?.name || 'Unknown Artist',
                album: track.album || 'Unknown Album',
                artwork: [{ src: track.coverImage, sizes: '512x512', type: 'image/jpeg' }],
            });

            navigator.mediaSession.setActionHandler('play', play);
            navigator.mediaSession.setActionHandler('pause', pause);
            navigator.mediaSession.setActionHandler('previoustrack', previous);
            navigator.mediaSession.setActionHandler('nexttrack', next);
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (audioRef.current && details.seekTime) {
                    audioRef.current.currentTime = details.seekTime;
                }
            });
        }
    }, [track, play, pause, previous, next]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
            <audio ref={audioRef} preload="metadata" />
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
