import { gql } from "graphql-tag";

// User Mutations
export const UpdateProfile = gql`
  #graphql
  mutation updateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      email
      profileImage
    }
  }
`;

export const FollowUser = gql`
  #graphql
  mutation followUser($userId: ID!) {
    followUser(userId: $userId)
  }
`;

export const UnfollowUser = gql`
  #graphql
  mutation unfollowUser($userId: ID!) {
    unfollowUser(userId: $userId)
  }
`;

// Playlist Mutations
export const CreatePlaylist = gql`
  #graphql
  mutation createPlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      title
      description
      coverImage
      isPublic
    }
  }
`;

export const UpdatePlaylist = gql`
  #graphql
  mutation updatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      id
      title
      description
      coverImage
      isPublic
    }
  }
`;

export const DeletePlaylist = gql`
  #graphql
  mutation deletePlaylist($id: ID!) {
    deletePlaylist(id: $id)
  }
`;

export const AddTrackToPlaylist = gql`
  #graphql
  mutation addTrackToPlaylist($playlistId: ID!, $trackId: ID!, $position: Int) {
    addTrackToPlaylist(playlistId: $playlistId, trackId: $trackId, position: $position) {
      id
      title
      songs {
        id
        title
      }
    }
  }
`;

export const RemoveTrackFromPlaylist = gql`
  #graphql
  mutation removeTrackFromPlaylist($playlistId: ID!, $trackId: ID!) {
    removeTrackFromPlaylist(playlistId: $playlistId, trackId: $trackId) {
      id
      songs {
        id
      }
    }
  }
`;

export const ReorderPlaylistTracks = gql`
  #graphql
  mutation reorderPlaylistTracks(
    $playlistId: ID!
    $rangeStart: Int!
    $rangeLength: Int!
    $insertBefore: Int!
  ) {
    reorderPlaylistTracks(
      playlistId: $playlistId
      rangeStart: $rangeStart
      rangeLength: $rangeLength
      insertBefore: $insertBefore
    ) {
      id
      songs {
        id
        title
      }
    }
  }
`;

// Library Mutations
export const SaveTrack = gql`
  #graphql
  mutation saveTrack($trackId: ID!) {
    saveTrack(trackId: $trackId)
  }
`;

export const RemoveSavedTrack = gql`
  #graphql
  mutation removeSavedTrack($trackId: ID!) {
    removeSavedTrack(trackId: $trackId)
  }
`;

export const SaveAlbum = gql`
  #graphql
  mutation saveAlbum($albumId: ID!) {
    saveAlbum(albumId: $albumId)
  }
`;

export const RemoveSavedAlbum = gql`
  #graphql
  mutation removeSavedAlbum($albumId: ID!) {
    removeSavedAlbum(albumId: $albumId)
  }
`;

export const FollowArtist = gql`
  #graphql
  mutation followArtist($artistId: ID!) {
    followArtist(artistId: $artistId)
  }
`;

export const UnfollowArtist = gql`
  #graphql
  mutation unfollowArtist($artistId: ID!) {
    unfollowArtist(artistId: $artistId)
  }
`;

// Artist Mutations
export const CreateArtist = gql`
  #graphql
  mutation createArtist($input: CreateArtistInput!) {
    createArtist(input: $input) {
      id
      name
      bio
      image
      type
    }
  }
`;

export const UpdateArtistProfile = gql`
  #graphql
  mutation updateArtistProfile($input: UpdateArtistInput!) {
    updateArtistProfile(input: $input) {
      id
      name
      bio
      image
      type
    }
  }
`;

export const DeleteArtist = gql`
  #graphql
  mutation deleteArtist($id: ID!) {
    deleteArtist(id: $id)
  }
`;

export const VerifyArtist = gql`
  #graphql
  mutation verifyArtist($artistId: ID!) {
    verifyArtist(artistId: $artistId) {
      id
      verified
    }
  }
`;

export const UpdateArtist = gql`
  #graphql
  mutation updateArtist($id: ID!, $input: UpdateArtistInput!) {
    updateArtist(id: $id, input: $input) {
      id
      name
      bio
      image
      type
    }
  }
`;

// Track Mutations
export const UploadTrack = gql`
  #graphql
  mutation uploadTrack($input: UploadTrackInput!) {
    uploadTrack(input: $input) {
      id
      title
      duration
      fileUrl
      coverImage
    }
  }
`;

export const UpdateTrack = gql`
  #graphql
  mutation updateTrack($id: ID!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      id
      title
      duration
      fileUrl
      coverImage
    }
  }
`;

export const DeleteTrack = gql`
  #graphql
  mutation deleteTrack($id: ID!) {
    deleteTrack(id: $id)
  }
`;

// Album Mutations
export const CreateAlbum = gql`
  #graphql
  mutation createAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
      title
      releaseDate
      coverImage
      type
    }
  }
`;

export const UpdateAlbum = gql`
  #graphql
  mutation updateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
      releaseDate
      coverImage
      type
    }
  }
`;

export const DeleteAlbum = gql`
  #graphql
  mutation deleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

// User Management Mutations
export const UpdateUser = gql`
  #graphql
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
      profileImage
    }
  }
`;

export const DeleteUser = gql`
  #graphql
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Song Mutations
export const CreateSong = gql`
  #graphql
  mutation createSong($input: CreateSongInput!) {
    createSong(input: $input) {
      id
      title
      duration
      releaseDate
      fileUrl
      coverImage
    }
  }
`;

export const UpdateSong = gql`
  #graphql
  mutation updateSong($id: ID!, $input: UpdateSongInput!) {
    updateSong(id: $id, input: $input) {
      id
      title
      duration
      releaseDate
      fileUrl
      coverImage
    }
  }
`;

export const DeleteSong = gql`
  #graphql
  mutation deleteSong($id: ID!) {
    deleteSong(id: $id)
  }
`;

