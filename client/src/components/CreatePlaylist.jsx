import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconMusic, IconX } from '@tabler/icons-react';
// import { useCreatePlaylist, useAddSongToPlaylist } from '../hooks/usePlaylist';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
//   const createPlaylist = useCreatePlaylist();
//   const addSongToPlaylist = useAddSongToPlaylist();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const newPlaylist = await createPlaylist.mutateAsync({
//         name: playlistName,
//         description
//       });

//       if (songToAdd) {
//         await addSongToPlaylist.mutateAsync({
//           playlistId: newPlaylist.id,
//           songId: songToAdd.id
//         });
//       }

//       queryClient.invalidateQueries(['playlists']);
//       onClose();
//     } catch (error) {
//       console.error('Error creating playlist:', error);
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md relative">
        <button
        //   onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <IconX size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-[150px] h-[150px] bg-zinc-800 rounded-md flex items-center justify-center">
            {/* {songToAdd?.coverImage ? (
              <img
                src={songToAdd.coverImage}
                alt="Song cover"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <IconMusic size={40} className="text-neutral-400" />
            )} */}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create new playlist
            </h2>
            {/* {songToAdd && (
              <p className="text-sm text-neutral-400">
                Including: {songToAdd.title}
              </p>
            )} */}
          </div>
        </div>

        <form  className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-zinc-800 rounded-md px-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Add an optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 rounded-md px-4 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
            //   disabled={createPlaylist.isLoading}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* {createPlaylist.isLoading ? 'Creating...' : 'Create'} */}
              create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;
