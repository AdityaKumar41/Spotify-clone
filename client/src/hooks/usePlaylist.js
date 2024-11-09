import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../api/graphql";

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => 
      graphqlClient.request(`
        mutation createPlaylist($input: CreatePlaylistInput!) {
          createPlaylist(input: $input) {
            id
            title
            description
            coverImage
          }
        }
      `, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userPlaylists"]);
    },
  });
};

export const useGetPlaylist = (id) => {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: () => 
      graphqlClient.request(`
        query getPlaylist($id: ID!) {
          getPlaylist(id: $id) {
            id
            title
            description
            coverImage
            songs {
              id
              title
              artist {
                id
                name
              }
            }
          }
        }
      `, { id }),
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }) => 
      graphqlClient.request(`
        mutation updatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
          updatePlaylist(id: $id, input: $input) {
            id
            title
            description
            coverImage
          }
        }
      `, { id, input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["playlist", data.id]);
      queryClient.invalidateQueries(["userPlaylists"]);
    },
  });
};
