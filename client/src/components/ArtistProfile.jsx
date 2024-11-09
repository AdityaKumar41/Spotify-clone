import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { Spacer } from "@nextui-org/spacer"
import { Avatar } from "@nextui-org/avatar"
import { IconTrash } from '@tabler/icons-react'
import { useMe } from '../hooks/useUser'
import { graphqlClient } from '../api/app'
import { GetSignedURL } from '../graphql/query/user'
import toast from 'react-hot-toast'
import { useCreateSong, useDeleteSong, useGetSongByArtist } from '../hooks/useSong'
import axios from 'axios'
import { PlayerContext } from '../context/PlayerContext'
import { Select } from "@nextui-org/select"
import { SelectItem } from "@nextui-org/select"

export default function ArtistPage() {
  const { data: user, isLoading: isUserLoading } = useMe();
  const { mutate: createSong } = useCreateSong();
  const artistId = user?.me?.artist?.id;
  const { data: songs, isLoading: isSongsLoading, error: songsError } = useGetSongByArtist(artistId);
  const { mutate: deleteSong } = useDeleteSong();
  const { playWithId } = useContext(PlayerContext);

  const artist = user?.me?.artist;
  const [uploadError, setUploadError] = useState(null);

  // Add state for selected genres
  const [selectedGenres, setSelectedGenres] = useState(new Set([]));

  // If user or artist is not loaded yet, show loading
  if (isUserLoading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  // If no artist found
  if (!artist) {
    return <div className="text-center p-6">No artist profile found.</div>;
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const genreOptions = [
    { label: "Pop", value: "pop" },
    { label: "Rock", value: "rock" },
    { label: "Hip Hop", value: "hip-hop" },
    { label: "R&B", value: "r&b" },
    { label: "Jazz", value: "jazz" },
    { label: "Electronic", value: "electronic" },
    { label: "Classical", value: "classical" },
    { label: "Country", value: "country" },
    { label: "Blues", value: "blues" },
  ];

  const onSubmit = async (data) => {
    setUploadError(null);

    try {
      // 1. Get Signed URL for image upload
      const { getSignedURL: imageSignedURL } = await graphqlClient.request(GetSignedURL, {
        fileName: data.coverImage[0].name,
        fileType: data.coverImage[0].type,
        type: 'coverImage'
      });
      
      // 2. Upload image to S3
      await axios.put(imageSignedURL, data.coverImage[0], {
        headers: {
          "Content-Type": data.coverImage[0].type,
        },
      });

      // 3. Upload audio file
      const { getSignedURL: audioSignedURL } = await graphqlClient.request(GetSignedURL, {
        fileName: data.audioFile[0].name,
        fileType: data.audioFile[0].type,
        type: 'audioFile'
      });
      
      await axios.put(audioSignedURL, data.audioFile[0], {
        headers: {
          "Content-Type": data.audioFile[0].type,
        },
      });

      // 4. Extract the final URLs
      const imageUrl = imageSignedURL.split('?')[0];
      const audioUrl = audioSignedURL.split('?')[0];

      // 5. Get audio duration
      const audio = new Audio();
      audio.src = audioUrl;
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve();
        });
        audio.addEventListener('error', reject);
      });

      const duration = Math.round(audio.duration);

      // Format the date properly
      const formattedDate = new Date(); // YYYY-MM-DD format

      // Convert Set to Array and ensure it's not empty
      const genreArray = Array.from(selectedGenres);
      console.log("Selected genres:", genreArray); // Debug log

      // Create the input object
      const songInput = {
        title: data.title,
        coverImage: imageUrl,
        fileUrl: audioUrl,
        duration: parseInt(duration), // Make sure duration is a number
        releaseDate: formattedDate,
        genre: genreArray
      };

      console.log("Submitting song:", songInput); // Debug log

      // Call the mutation
      const result = await createSong(songInput);
      console.log("Creation result:", result); // Debug log

      toast.success("Song uploaded successfully!");
      reset();
      setSelectedGenres(new Set([]));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      toast.error("Failed to upload song: " + error.message);
    }
  };

  const handleDeleteSong = async (id) => {
    const deleted = await deleteSong(id);
    console.log('Deleted: ', deleted);
    if (deleted) {
      toast.success("Song deleted successfully!");
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#121212] text-white rounded-lg">
      <div className="bg-[#181818] p-6 rounded-lg shadow-xl">
        <div className="flex items-center space-x-4">
          <img 
            src={artist.image} 
            className="w-24 h-24 rounded-full"
            alt={artist.name}
          />
          <div>
            <h3 className="text-2xl font-bold text-white">{artist.name}</h3>
            <p className="text-[#b3b3b3]">Upload your latest track</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input 
            {...register("title", { required: "Song title is required" })}
            placeholder="Enter song title"
            className="w-full bg-[#242424] text-white border-none focus:ring-1 focus:ring-[#1DB954] rounded-md outline-none"
            classNames={{
              input: "text-white",
              label: "text-white",
              inputWrapper: "bg-[#242424]"
            }}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

          <Select
            selectionMode="multiple"
            placeholder="Select genres"
            selectedKeys={selectedGenres}
            onSelectionChange={setSelectedGenres}
            className="w-full"
            classNames={{
              trigger: "bg-[#242424] text-white border-none hover:bg-[#2a2a2a]",
              value: "text-white",
              label: "text-white",
              listbox: "bg-[#242424] text-white",
              popover: "bg-[#242424] border-[#333333]",
              base: "text-white",
              innerWrapper: "text-white",
              selectorIcon: "text-white",
              placeholder: "text-gray-400"
            }}
          >
            {genreOptions.map((genre) => (
              <SelectItem 
                key={genre.value} 
                value={genre.value}
                className="text-white hover:bg-[#2a2a2a]"
              >
                {genre.label}
              </SelectItem>
            ))}
          </Select>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Cover Image</label>
            <Input
              {...register("coverImage", { required: "Cover image is required" })}
              type="file"
              accept="image/*"
              className="w-full bg-[#242424] text-white border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760]"
              classNames={{
                input: "text-black",
                label: "text-black"
              }}
            />
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Audio File</label>
            <Input
              {...register("audioFile", { required: "Audio file is required" })}
              type="file"
              accept="audio/*"
              className="w-full bg-[#242424] text-white border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#1DB954] file:text-white hover:file:bg-[#1ed760]"
              classNames={{
                input: "text-black",
                label: "text-black"
              }}
            />
            {errors.audioFile && <p className="text-red-500 text-sm">{errors.audioFile.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#1DB954] text-white font-semibold py-3 rounded-full hover:bg-[#1ed760] transform hover:scale-105 transition-all"
          >
            Upload Song
          </Button>
        </form>
      </div>

      <Spacer y={6} />

      <div className="bg-[#181818] p-6 rounded-lg shadow-xl">
        <h4 className="text-xl font-bold text-white mb-1">Your Songs</h4>
        <p className="text-[#b3b3b3] text-sm mb-6">Manage your uploaded tracks</p>
        
        {songsError ? (
          <div className="text-red-500">Error loading songs: {songsError.message}</div>
        ) : isSongsLoading ? (
          <div className="text-[#b3b3b3]">Loading songs...</div>
        ) : !songs || songs.length === 0 ? (
          <p className="text-[#b3b3b3]">No songs uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {songs.map((song) => (
              <li key={song.id} className="flex justify-between items-center p-3 bg-[#242424] rounded-lg hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-center space-x-4">
                  <img src={song.coverImage} alt={song.title} className="w-12 h-12 rounded-md object-cover" />
                  <div>
                    <p className="text-white font-medium">{song.title}</p>
                    <button 
                      onClick={() => playWithId(song.id)}
                      className="text-[#1DB954] text-sm hover:text-[#1ed760] hover:underline"
                    >
                      Play
                    </button>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDeleteSong(song.id)}
                  className="bg-transparent hover:bg-[#2a2a2a] text-[#b3b3b3] p-2 rounded-full"
                >
                  <IconTrash size={20} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
