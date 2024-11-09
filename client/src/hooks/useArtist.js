import { gql } from 'graphql-request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '../api/app';

const CREATE_ARTIST_MUTATION = gql`
mutation Mutation($artistName: String!, $bio: String, $profilePicture: String, $facebook: String, $twitter: String, $instagram: String, $website: String, $country: String, $genre: [String!]) {
  createArtist(artistName: $artistName, bio: $bio, profilePicture: $profilePicture, facebook: $facebook, twitter: $twitter, instagram: $instagram, website: $website, country: $country, genre: $genre) {
    id
    
  }
}
`;

export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input) => {
      // Validate input types
      const variables = {
        artistName: String(input.artistName || ''),
        bio: input.bio ? String(input.bio) : null,
        profilePicture: input.profilePicture ? String(input.profilePicture) : null,
        facebook: input.facebook ? String(input.facebook) : null,
        twitter: input.twitter ? String(input.twitter) : null,
        instagram: input.instagram ? String(input.instagram) : null,
        website: input.website ? String(input.website) : null,
        country: input.country ? String(input.country) : null,
        genre: Array.isArray(input.genre) 
          ? input.genre.map(g => String(g)) 
          : []
      };

      // Debug logs
      console.log('Input Types:', {
        artistName: typeof variables.artistName,
        bio: typeof variables.bio,
        profilePicture: typeof variables.profilePicture,
        facebook: typeof variables.facebook,
        twitter: typeof variables.twitter,
        instagram: typeof variables.instagram,
        website: typeof variables.website,
        country: typeof variables.country,
        genre: Array.isArray(variables.genre) ? 'array' : typeof variables.genre
      });

      console.log('Mutation Variables:', JSON.stringify(variables, null, 2));

      return await graphqlClient.request(CREATE_ARTIST_MUTATION, variables);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);
    },
    onError: (error) => {
      console.error('Mutation Error:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
    }
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

  return useQuery({
    queryKey: ["artist", id],
    queryFn: () => 
      graphqlClient.request(GET_ARTIST_QUERY, { getArtistId: id }),
    enabled: !!id,
    onError: (error) => {
      console.error('Query error:', error);
    }
  });
};

export const useFollowArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artistId) => 
      graphqlClient.request(`
        mutation followArtist($artistId: ID!) {
          followArtist(artistId: $artistId)
        }
      `, { artistId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
};

const GET_ARTISTS_QUERY = gql`
  query GetArtists {
    getArtists {
      id
      name
      image
    }
  }
`;

export const useGetArtists = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async() =>{ 
      const {getArtists} = await graphqlClient.request(GET_ARTISTS_QUERY)
      return getArtists;
    },

  });
};
