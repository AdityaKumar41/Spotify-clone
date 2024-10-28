exports.mutations = `#graphql
    # User mutations
    updateProfile(input: UpdateProfileInput!): User!
    followUser(userId: ID!): Boolean!
    unfollowUser(userId: ID!): Boolean!
    
    # Playlist mutations
    createPlaylist(input: CreatePlaylistInput!): Playlist!
    updatePlaylist(id: ID!, input: UpdatePlaylistInput!): Playlist!
    deletePlaylist(id: ID!): Boolean!
    addTrackToPlaylist(playlistId: ID!, trackId: ID!, position: Int): Playlist!
    removeTrackFromPlaylist(playlistId: ID!, trackId: ID!): Playlist!
    reorderPlaylistTracks(playlistId: ID!, rangeStart: Int!, rangeLength: Int!, insertBefore: Int!): Playlist!
    
    # Library mutations
    saveTrack(trackId: ID!): Boolean!
    removeSavedTrack(trackId: ID!): Boolean!
    saveAlbum(albumId: ID!): Boolean!
    removeSavedAlbum(albumId: ID!): Boolean!
    followArtist(artistId: ID!): Boolean!
    unfollowArtist(artistId: ID!): Boolean!
    
    # Artist mutations
    createArtist(input: CreateArtistInput!): Artist!
    updateArtistProfile(input: UpdateArtistInput!): Artist!
    deleteArtist(id: ID!): Boolean!
    verifyArtist(artistId: ID!): Artist!
    updateArtist(id: ID!, input: UpdateArtistInput!): Artist!
    
    # Track mutations
    uploadTrack(input: UploadTrackInput!): Track!
    updateTrack(id: ID!, input: UpdateTrackInput!): Track!
    deleteTrack(id: ID!): Boolean!
    
    # Album mutations
    createAlbum(input: CreateAlbumInput!): Album!
    updateAlbum(id: ID!, input: UpdateAlbumInput!): Album!
    deleteAlbum(id: ID!): Boolean!

    # update user
    updateUser(id: ID!, input: UpdateUserInput!): User!

    # delete user
    deleteUser(id: ID!): Boolean!

    # create song
    createSong(input: CreateSongInput!): Song!

    # update song
    updateSong(id: ID!, input: UpdateSongInput!): Song!

    # delete song
    deleteSong(id: ID!): Boolean!

    
`;
