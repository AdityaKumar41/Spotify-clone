export const types = `#graphql
    type Song {
    id: Int!
    title: String!
    artist: Artist!
    duration: Int!
    releaseDate: String!
    fileUrl: String!
    }

    type Artist {
    id: Int!
    name: String!
    songs: [Song!]!
    }
`;
