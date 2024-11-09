import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../api/graphql";

export const useUploadTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => 
      graphqlClient.request(`
        mutation uploadTrack($input: UploadTrackInput!) {
          uploadTrack(input: $input) {
            id
            title
            duration
            fileUrl
            coverImage
          }
        }
      `, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tracks"]);
    },
  });
};

export const useGetTrack = (id) => {
  return useQuery({
    queryKey: ["track", id],
    queryFn: () => 
      graphqlClient.request(`
        query getTrack($id: ID!) {
          getTrack(id: $id) {
            id
            title
            duration
            fileUrl
            coverImage
            artist {
              id
              name
            }
          }
        }
      `, { id }),
  });
};

export const useSaveTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackId) => 
      graphqlClient.request(`
        mutation saveTrack($trackId: ID!) {
          saveTrack(trackId: $trackId)
        }
      `, { trackId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};
