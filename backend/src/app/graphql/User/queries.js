exports.queries = `#graphql
    # Auth related queries
    verifyGoogleToken(token: String!): String
    
    # User queries
    me: User                           # Standard Spotify uses 'me' instead of 'getCurrentUser'
    getUser(id: ID!): User
    searchUsers(query: String!): [User!]!    # Search functionality for users
    
    # Track/Song queries
    getTrack(id: ID!): Track          # Using 'Track' instead of 'Song' to match Spotify
    getTracks(ids: [ID!]!): [Track!]!  # Get multiple tracks
    searchTracks(query: String!): [Track!]!
    
    # Artist queries
    getArtist(id: ID!): Artist
    getArtists: [Artist!]!
    searchArtists(query: String!): [Artist!]!
    getArtistTopTracks(id: ID!): [Track!]!
    
    # Album queries
    getAlbum(id: ID!): Album
    getAlbums(ids: [ID!]!): [Album!]!
    searchAlbums(query: String!): [Album!]!
    
    # Playlist queries
    getPlaylist(id: ID!): Playlist
    getUserPlaylists(userId: ID!): [Playlist!]!
    getFeaturedPlaylists: [Playlist!]!
    
    # Upload related
    getSignedURLArtist(imageName: String!, imageType: String!): String
    getSignedURL(fileName: String!, fileType: String!): String

    # Song queries
    getSongs: [Song!]!
    getSongByArtist(artistId: ID!): [Song!]!
    searchSongs(query: String!): [Song!]!

    # Genre queries
    getGenres: [Genre!]!
    getGenre(id: ID!): Genre
`;
