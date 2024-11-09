import { gql } from "graphql-request";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
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
  query GetSongs {
    getSongs {
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
  query GetSongByArtist($artistId: ID!) {
    getSongByArtist(artistId: $artistId) {
      id
      title
      duration
      coverImage
      fileUrl
      artist {
        id
        name
        image
        bio
      }
    }
  }
`;

const SEARCH_SONGS_QUERY = gql`
  query SearchSongs($query: String!) {
    searchSongs(query: $query) {
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
query GetGenre($getGenreId: ID!) {
  getGenre(id: $getGenreId) {
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
          genre: input.genre
        }
      });
      console.log("Mutation response:", data);
      return data.createSong;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs", "songsByArtist"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });
};

export const useGetSongs = () => {
  return useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const { getSongs } = await graphqlClient.request(GET_SONGS_QUERY);
      return getSongs;
    },
  });
};

export const useGetSongByArtist = (artistId) => {
  return useQuery({
    queryKey: ["songsByArtist", artistId],
    queryFn: async () => {
      const { getSongByArtist } = await graphqlClient.request(
        GET_SONG_BY_ARTIST_QUERY,
        { artistId }
      );
      return getSongByArtist;
    },
  });
};

export const useSearchSongs = (query) => {
  return useQuery({
    queryKey: ["songs", "search", query],
    queryFn: async () => {
      const { searchSongs } = await graphqlClient.request(SEARCH_SONGS_QUERY, {
        query,
      });
      return searchSongs;
    },
    enabled: !!query,
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { deleteSong } = await graphqlClient.request(DELETE_SONG_MUTATION, { id });
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
  return useQuery({
      queryKey: ['genre', id],
      queryFn: async () => {
          try {
              // Notice here: we're using getGenreId as the variable name to match the query
              const { getGenre } = await graphqlClient.request(GET_GENRE_QUERY_BY_ID, { 
                  getGenreId: id  // This needs to match the variable name in the query
              });
              console.log('Genre data received:', getGenre);
              return getGenre;
          } catch (error) {
              console.error('Error fetching genre:', error);
              throw error;
          }
      },
      enabled: !!id
  });
};
