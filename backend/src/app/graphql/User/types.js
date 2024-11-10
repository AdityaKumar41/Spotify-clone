exports.type = `#graphql
  type User {
    id: ID!                      # ID field as a non-nullable String in Prisma
    username: String!            # Unique, non-nullable
    email: String!               # Unique, non-nullable
    profileImage: String         # Optional in Prisma, nullable in GraphQL
    createdAt: String!           # DateTime in Prisma, string in GraphQL
    lastLogin: String            # Optional DateTime in Prisma, nullable String in GraphQL
    playlists: [Playlist]        # Optional playlists, can be null or an empty list
    followedArtists: [Artist!]  # Added for artist following
    savedTracks: [Song!]       # Changed from savedTracks
    savedAlbums: [Album!]       # Changed from savedAlbums
    following: [User!]        # Changed from following
    followers: [User!]          # Changed from followers
    artist: Artist
    # New fields
    firstName: String
    lastName: String
    providerId: String
    isVerified: Boolean
    country: String
    dateOfBirth: String
  }

  type Song {
    id: ID!                      # ID field
    title: String!
    artist: Artist!              # Relation to Artist
    duration: Int!
    releaseDate: String!         # DateTime in Prisma, string in GraphQL
    fileUrl: String!
    playlists: [Playlist!]!      # Relation: Song can belong to multiple playlists
    # Changed relation name
    savedByUsers: [User!]!       # Changed from likedByUsers
    # New fields
    coverImage: String
    lyrics: String
    isExplicit: Boolean
    playCount: Int
    genres: [Genre!]!
  }

  type Artist {
    id: ID!                      # ID field
    name: String!
    bio: String
    image: String
    coverImage: String
    songs: [Song!]!
    albums: [Album!]!
    followers: [User!]!
    type: ArtistType!           # Changed to enum
    isVerified: Boolean!
    facebook: String
    twitter: String
    instagram: String
    website: String
    country: String
    genres: [Genre!]
    # New fields
    headerImage: String
    monthlyListeners: Int
    user: User
    verified: Boolean
  }

  type Playlist { 
    id: ID!                      # ID field
    title: String!               # Updated field name to match Prisma model
    description: String          # Optional field, nullable in GraphQL
    songs: [Song!]!              # Relation: Playlist contains multiple Songs
    user: User!                  # Relation to the User owning the Playlist
    createdAt: String!           # DateTime in Prisma, string in GraphQL
  }

  type Track {
    id: ID!
    title: String!
    artist: Artist!
    duration: Int!
    fileUrl: String!
    album: Album
    createdAt: String!
    savedByUsers: [User!]!       # Added for track saves
  }

  type Album {
    id: ID!
    title: String!
    artist: Artist!
    tracks: [Track!]!
    coverImage: String
    releaseDate: String!
    # Changed relation name
    savedByUsers: [User!]!       # Changed from savedByUsers
    # New fields
    type: String
    genres: [Genre!]!
  }

  type Genre {
    id: ID!
    name: String!
    songs: [Song!]!
    artists: [Artist!]!
    albums: [Album!]!
  }

  input UpdateProfileInput {
    username: String
    email: String
    profileImage: String
  }

  input CreatePlaylistInput {
    title: String!
    description: String
  }

  input UpdatePlaylistInput {
    title: String
    description: String
  }

  input CreateArtistInput {
    artistName: String!
    bio: String
    profilePicture: String
    facebook: String
    twitter: String
    instagram: String
    website: String
    country: String
    genres: [String!]
  }

  input UpdateArtistInput {
    name: String
    bio: String
    image: String
    coverImage: String
    type: ArtistType
    facebook: String
    twitter: String
    instagram: String
    website: String
    country: String
    genres: [String!]
  }

  input UploadTrackInput {
    title: String!
    artistId: ID!
    albumId: ID
    duration: Int!
    fileUrl: String!
  }

  input UpdateTrackInput {
    title: String
    artistId: ID
    albumId: ID
    duration: Int
    fileUrl: String
  }

  input CreateAlbumInput {
    title: String!
    artistId: ID!
    coverImage: String
    releaseDate: String!
  }

  input UpdateAlbumInput {
    title: String
    artistId: ID
    coverImage: String
    releaseDate: String
  }

  input UpdateUserInput {
    username: String
    email: String
    password: String
    profileImage: String
  }

  input CreateSongInput {
    title: String!
    coverImage: String
    duration: Int!
    releaseDate: String!
    fileUrl: String!
    genre: [String!]!
  }

  input UpdateSongInput {
    title: String
    artistId: ID
    duration: Int
    fileUrl: String
  }

  enum ArtistType {
    INDIVIDUAL
    BAND
    GROUP
    ORCHESTRA
    CHOIR
  }
`;
