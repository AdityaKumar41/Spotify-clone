exports.queries = `#graphql
    # Auth related queries
    verifyGoogleToken(token: String!): String
    
    # User queries
    me: User                           # Standard Spotify uses 'me' instead of 'getCurrentUser'
    getUser(id: ID!): User
    searchUsers(query: String!, limit: Int, offset: Int): [User!]!    # Search functionality for users with pagination
    
    # Track/Song queries
    getTrack(id: ID!): Track          # Using 'Track' instead of 'Song' to match Spotify
    getTracks(ids: [ID!]!): [Track!]!  # Get multiple tracks
    searchTracks(query: String!, limit: Int, offset: Int): [Track!]!
    
    # Artist queries
    getArtist(id: ID!): Artist
    getArtists(limit: Int, offset: Int): [Artist!]!
    searchArtists(query: String!, limit: Int, offset: Int): [Artist!]!
    getArtistTopTracks(id: ID!, limit: Int, offset: Int): [Track!]!
    
    # Album queries
    getAlbum(id: ID!): Album
    getAlbums(ids: [ID!]!): [Album!]!
    searchAlbums(query: String!, limit: Int, offset: Int): [Album!]!
    
    # Playlist queries
    getPlaylist(id: ID!): Playlist
    getUserPlaylists(userId: ID!, limit: Int, offset: Int): [Playlist!]!
    getFeaturedPlaylists(limit: Int, offset: Int): [Playlist!]!
    
    # Upload related
    getSignedURLArtist(imageName: String!, imageType: String!): String
    getSignedURL(fileName: String!, fileType: String!): String

    # Song queries
    getSongs(limit: Int, offset: Int): [Song!]!
    getSongByArtist(artistId: ID!, limit: Int, offset: Int): [Song!]!
    searchSongs(query: String!, limit: Int, offset: Int): [Song!]!
    # getNextSong(): Song

    # Genre queries
    getGenres(limit: Int, offset: Int): [Genre!]!
    getGenre(id: ID!, limit: Int, offset: Int): Genre

    # Follow-related queries
    getFollowedArtists(userId: ID!, limit: Int, offset: Int): [Artist!]!
    isFollowingArtist(artistId: ID!): Boolean!
`;
