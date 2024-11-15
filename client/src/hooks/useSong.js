import { gql } from "graphql-request";
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { graphqlClient } from "../api/app";

const CREATE_SONG_MUTATION = gql`
  mutation CreateSong($input: CreateSongInput!) {
    createSong(input: $input) {
      id
      title
      duration
      releaseDate
      fileUrl
      coverImage
      genres {
        id
        name
      }
      artist {
        id
        name
      }
    }
  }
`;

const GET_SONGS_QUERY = gql`
  query GetSongs($limit: Int, $offset: Int) {
    getSongs(limit: $limit, offset: $offset) {
      id
      duration
      title
      fileUrl
      coverImage
      artist {
        id
        name
      }
    }
  }
`;

const GET_SONG_BY_ARTIST_QUERY = gql`
  query GetSongByArtist($artistId: ID!, $limit: Int, $offset: Int) {
    getSongByArtist(artistId: $artistId, limit: $limit, offset: $offset) {
      id
      title
      duration
      coverImage
      fileUrl
      releaseDate
      genres {
        id
        name
      }
      artist {
        id
        name
        image
        bio
        facebook
        instagram
        twitter
        followers {
          id
        }
      }
    }
  }
`;

const SEARCH_SONGS_QUERY = gql`
  query SearchSongs($query: String!, $limit: Int, $offset: Int) {
    searchSongs(query: $query, limit: $limit, offset: $offset) {
      id
      title
      duration
      fileUrl
      coverImage
      artist {
        id
        name
        image
      }
    }
  }
`;

const DELETE_SONG_MUTATION = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id)
  }
`;

const GET_GENRES_QUERY = gql`
  query GetGenres {
    getGenres {
      id
      name
    }
  }
`;

const GET_GENRE_QUERY_BY_ID = gql`
  query GetGenre($id: ID!, $limit: Int, $offset: Int) {
    getGenre(id: $id, limit: $limit, offset: $offset) {
      name
      id
      songs {
        coverImage
        duration
        fileUrl
        releaseDate
        title
        artist {
          id
          name
        }
      }
    }
  }
`;

export const useCreateSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      console.log("Mutation input:", input);
      const { data } = await graphqlClient.request(CREATE_SONG_MUTATION, {
        input: {
          title: input.title,
          duration: parseInt(input.duration),
          releaseDate: input.releaseDate,
          fileUrl: input.fileUrl,
          coverImage: input.coverImage,
          genre: input.genre,
        },
      });
      console.log("Mutation response:", data);
      return data.createSong;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["songs", "songsByArtist", artistId],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

export const useGetSongs = () => {
  return useInfiniteQuery({
    queryKey: ["songs"],
    queryFn: async ({ pageParam = 0 }) => {
      const { getSongs } = await graphqlClient.request(GET_SONGS_QUERY, {
        limit: 10,
        offset: pageParam,
      });
      return getSongs;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
  });
};

export const useGetSongByArtist = (artistId) => {
  return useInfiniteQuery({
    queryKey: ["songsByArtist", artistId],
    queryFn: async ({ pageParam = 0 }) => {
      const { getSongByArtist } = await graphqlClient.request(
        GET_SONG_BY_ARTIST_QUERY,
        { artistId, limit: 10, offset: pageParam }
      );
      return getSongByArtist;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
    enabled: !!artistId,
  });
};

export const useSearchSongs = (query) => {
  return useInfiniteQuery({
    queryKey: ["songs", "search", query],
    queryFn: async ({ pageParam = 0 }) => {
      const { searchSongs } = await graphqlClient.request(SEARCH_SONGS_QUERY, {
        query,
        limit: 10,
        offset: pageParam,
      });
      return searchSongs;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
    enabled: !!query,
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { deleteSong } = await graphqlClient.request(DELETE_SONG_MUTATION, {
        id,
      });
      return deleteSong;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs", "songsByArtist"] });
    },
  });
};

export const useGetGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { getGenres } = await graphqlClient.request(GET_GENRES_QUERY);
      return getGenres;
    },
  });
};

export const useGetGenre = (id) => {
  return useInfiniteQuery({
    queryKey: ["genre", id],
    queryFn: async ({ pageParam = 0 }) => {
      const { getGenre } = await graphqlClient.request(GET_GENRE_QUERY_BY_ID, {
        id,
        limit: 10,
        offset: pageParam,
      });
      return getGenre;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.songs.length === 10) {
        return allPages.length * 10;
      }
      return undefined;
    },
    enabled: !!id,
  });
};
