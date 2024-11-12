import { gql } from "graphql-tag";

// Auth Queries
export const VerifyGoogleToken = gql`
  #graphql
  query verifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`;

// User Queries
export const GetMe = gql`
  #graphql
  query me {
    me {
      id
      email
      username
      profileImage
      artist {
        id
        name
        image
      }
      followedArtists {
        id
      }
    }
  }
`;

export const GetUser = gql`
  #graphql
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      username
      profileImage
      playlists {
        id
        title
      }
    }
  }
`;

export const SearchUsers = gql`
  #graphql
  query searchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      profileImage
    }
  }
`;

// Track Queries
export const GetTrack = gql`
  #graphql
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
`;

export const GetTracks = gql`
  #graphql
  query getTracks($ids: [ID!]!) {
    getTracks(ids: $ids) {
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
`;

export const SearchTracks = gql`
  #graphql
  query searchTracks($query: String!) {
    searchTracks(query: $query) {
      id
      title
      coverImage
      artist {
        id
        name
      }
    }
  }
`;

// Artist Queries
export const GetArtist = gql`
  #graphql
  query getArtist($id: ID!) {
    getArtist(id: $id) {
      id
      name
      bio
      image
      headerImage
      verified
      monthlyListeners
      type
    }
  }
`;

export const GetArtists = gql`
  #graphql
  query getArtists($ids: [ID!]!) {
    getArtists(ids: $ids) {
      id
      name
      image
      verified
    }
  }
`;

export const SearchArtists = gql`
  #graphql
  query searchArtists($query: String!) {
    searchArtists(query: $query) {
      id
      name
      image
      verified
    }
  }
`;

export const GetArtistTopTracks = gql`
  #graphql
  query getArtistTopTracks($id: ID!) {
    getArtistTopTracks(id: $id) {
      id
      title
      duration
      coverImage
      playCount
    }
  }
`;

// Album Queries
export const GetAlbum = gql`
  #graphql
  query getAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      title
      releaseDate
      coverImage
      type
      artist {
        id
        name
      }
      songs {
        id
        title
        duration
      }
    }
  }
`;

export const GetAlbums = gql`
  #graphql
  query getAlbums($ids: [ID!]!) {
    getAlbums(ids: $ids) {
      id
      title
      coverImage
      artist {
        id
        name
      }
    }
  }
`;

export const SearchAlbums = gql`
  #graphql
  query searchAlbums($query: String!) {
    searchAlbums(query: $query) {
      id
      title
      coverImage
      artist {
        id
        name
      }
    }
  }
`;

// Playlist Queries
export const GetPlaylist = gql`
  #graphql
  query getPlaylist($id: ID!) {
    getPlaylist(id: $id) {
      id
      title
      description
      coverImage
      isPublic
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
`;

export const GetUserPlaylists = gql`
  #graphql
  query getUserPlaylists($userId: ID!) {
    getUserPlaylists(userId: $userId) {
      id
      title
      coverImage
      isPublic
    }
  }
`;

export const GetFeaturedPlaylists = gql`
  #graphql
  query getFeaturedPlaylists {
    getFeaturedPlaylists {
      id
      title
      coverImage
      description
    }
  }
`;

// Upload Related Queries
export const GetSignedURLArtist = gql`
  #graphql
  query getSignedURLArtist($imageName: String!, $imageType: String!) {
    getSignedURLArtist(imageName: $imageName, imageType: $imageType)
  }
`;

export const GetSignedURL = gql`
  #graphql
  query getSignedURL($fileName: String!, $fileType: String!) {
    getSignedURL(fileName: $fileName, fileType: $fileType)
  }
`;

export const GetFollowedArtists = gql`
  #graphql
  query getFollowedArtists($userId: ID!) {
    getFollowedArtists(userId: $userId) {
      id
    }
  }
`;

export const IsFollowingArtist = gql`
  #graphql
  query isFollowingArtist($artistId: ID!) {
    isFollowingArtist(artistId: $artistId)
  }
`;