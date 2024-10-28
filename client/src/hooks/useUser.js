import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../api/app"; // Your GraphQL client configuration
import { GetMe } from "../graphql/query/user";

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

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => 
      graphqlClient.request(`
        mutation followUser($userId: ID!) {
          followUser(userId: $userId)
        }
      `, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => 
      graphqlClient.request(`
        mutation unfollowUser($userId: ID!) {
          unfollowUser(userId: $userId)
        }
      `, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};
