// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { graphqlClient } from "../api/app";
// import { GetCurrentUser, GetUserById } from "../graphql/query/user";
// import { CreateArtist } from "../graphql/mutation/user";

// export const useCreateArtist = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       // Ensure that the correct data is passed to the GraphQL client
//       return await graphqlClient.request(CreateArtist, data);
//     },
//     onSuccess: () => {
//       // Invalidate any queries related to the user so that the data is refreshed
//       queryClient.invalidateQueries("Login_User");
//     },
//     onError: (error) => {
//       console.error("Error creating artist:", error); // Add error handling
//     },
//   });

//   return mutation;
// };

// export const useCurrentUser = () => {
//   const query = useQuery({
//     queryKey: ["Login_User"],
//     queryFn: () => graphqlClient.request(GetCurrentUser),
//   });

//   return { ...query, user: query.data?.getCurrentUser };
// };

// export const useGetUserById = (id) => {
//   const query = useQuery({
//     queryKey: ["Get_User", id],
//     queryFn: () => graphqlClient.request(GetUserById, { id }),
//   });

//   return { ...query, userById: query.data?.getUserById };
// };
