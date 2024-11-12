import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../api/app"; // Your GraphQL client configuration
import { GetMe } from "../graphql/query/user";
import { GetFollowedArtists, IsFollowingArtist } from "../graphql/query/user";

// Auth Hooks
// export const useVerifyGoogleToken = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (token) => 
//       graphqlClient.request(`
//         query verifyGoogleToken($token: String!) {
//           verifyGoogleToken(token: $token)
//         }
//       `, { token }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["me"]);
//     },
//   });
// };

// User Hooks
export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => 
      graphqlClient.request(GetMe),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => 
      graphqlClient.request(`
        mutation updateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            id
            username
            email
            profileImage
          }
        }
      `, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};

// Maps to followArtist resolver
export const useFollowArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId) => 
      graphqlClient.request(`
        mutation followArtist($artistId: ID!) {
          followArtist(artistId: $artistId)
        }
      `, { artistId }),
    onSuccess: (_, artistId) => {
      queryClient.invalidateQueries(["followedArtists"]);
      queryClient.invalidateQueries(["isFollowing", artistId]);
      queryClient.invalidateQueries(["me"]);
    },
  });
};

// Maps to unfollowArtist resolver
export const useUnfollowArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId) => 
      graphqlClient.request(`
        mutation unfollowArtist($artistId: ID!) {
          unfollowArtist(artistId: $artistId)
        }
      `, { artistId }),
    onSuccess: (_, artistId) => {
      queryClient.invalidateQueries(["followedArtists"]);
      queryClient.invalidateQueries(["isFollowing", artistId]);
      queryClient.invalidateQueries(["me"]);
    },
  });
};

// Maps to getFollowedArtists resolver
export const useFollowedArtists = (userId, limit, offset) => {
  return useQuery({
    queryKey: ["followedArtists", userId, limit, offset],
    queryFn: async () => {
      const { getFollowedArtists } = await graphqlClient.request(GetFollowedArtists, { userId, limit, offset });
      return getFollowedArtists;
    },
    enabled: !!userId,
  });
};

// Maps to isFollowingArtist resolver
export const useIsFollowingArtist = (artistId) => {
  return useQuery({
    queryKey: ["isFollowing", artistId],
    queryFn: () => 
      graphqlClient.request(IsFollowingArtist, { artistId }),
    enabled: !!artistId,
  });
};
