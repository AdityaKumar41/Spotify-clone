import { gql } from "graphql-request";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { graphqlClient } from "../api/app";

const CREATE_ARTIST_MUTATION = gql`
  mutation Mutation(
    $artistName: String!
    $bio: String
    $profilePicture: String
    $facebook: String
    $twitter: String
    $instagram: String
    $website: String
    $country: String
    $genre: [String!]
  ) {
    createArtist(
      artistName: $artistName
      bio: $bio
      profilePicture: $profilePicture
      facebook: $facebook
      twitter: $twitter
      instagram: $instagram
      website: $website
      country: $country
      genre: $genre
    ) {
      id
    }
  }
`;

export const useCreateArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const variables = {
        artistName: String(input.artistName || ""),
        bio: input.bio ? String(input.bio) : null,
        profilePicture: input.profilePicture
          ? String(input.profilePicture)
          : null,
        facebook: input.facebook ? String(input.facebook) : null,
        twitter: input.twitter ? String(input.twitter) : null,
        instagram: input.instagram ? String(input.instagram) : null,
        website: input.website ? String(input.website) : null,
        country: input.country ? String(input.country) : null,
        genre: Array.isArray(input.genre)
          ? input.genre.map((g) => String(g))
          : [],
      };

      return await graphqlClient.request(CREATE_ARTIST_MUTATION, variables);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);
    },
    onError: (error) => {
      console.error("Mutation Error:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });
    },
  });
};

export const useGetArtist = (id) => {
  const GET_ARTIST_QUERY = gql`
    query GetArtist($getArtistId: ID!) {
      getArtist(id: $getArtistId) {
        id
        image
        instagram
        name
        bio
        twitter
        facebook
        website
      }
    }
  `;

  return useInfiniteQuery({
    queryKey: ["artist", id],
    queryFn: async ({ pageParam = 0 }) => {
      const { getArtist } = await graphqlClient.request(GET_ARTIST_QUERY, {
        getArtistId: id,
        offset: pageParam,
      });
      return getArtist;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 1) {
        return allPages.length;
      }
      return undefined;
    },
    enabled: !!id,
    onError: (error) => {
      console.error("Query error:", error);
    },
  });
};

export const useFollowArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId) =>
      graphqlClient.request(
        `
        mutation followArtist($artistId: ID!) {
          followArtist(artistId: $artistId)
        }
      `,
        { artistId }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};

const GET_ARTISTS_QUERY = gql`
  query GetArtists($limit: Int, $offset: Int) {
    getArtists(limit: $limit, offset: $offset) {
      id
      name
      image
    }
  }
`;

export const useGetArtists = () => {
  return useInfiniteQuery({
    queryKey: ["artists"],
    queryFn: async ({ pageParam = 0 }) => {
      const { getArtists } = await graphqlClient.request(GET_ARTISTS_QUERY, {
        limit: 10,
        offset: pageParam,
      });
      return getArtists;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
  });
};

const GET_FOLLOWED_ARTISTS_QUERY = gql`
  query Query($userId: ID!, $limit: Int, $offset: Int) {
    getFollowedArtists(userId: $userId, limit: $limit, offset: $offset) {
      id
      image
    }
  }
`;

export const useGetFollowedArtists = (userId) => {
  return useInfiniteQuery({
    queryKey: ["followedArtists", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const { getFollowedArtists } = await graphqlClient.request(
        GET_FOLLOWED_ARTISTS_QUERY,
        { userId, limit: 10, offset: pageParam }
      );
      return getFollowedArtists;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
    enabled: !!userId,
  });
};
