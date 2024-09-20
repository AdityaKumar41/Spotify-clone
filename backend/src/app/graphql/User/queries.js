export const queries = `#graphql
verifyGoogleToken(token: String!): String
        getUser(id: Int!): User
        getCurrentUser: User
        listUsers: [User!]!
        getSong(id: Int!): Song
        listSongs: [Song!]!
        getArtist(id: Int!): Artist
        listArtists: [Artist!]!

`;
