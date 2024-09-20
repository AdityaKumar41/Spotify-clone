export const type = `#graphql
  type User {
    id: ID!                     # Prisma uses Int for IDs, but GraphQL typically uses ID!
    username: String!
    email: String!
    profileImage: String         # Optional field in Prisma, nullable in GraphQL
    createdAt: String!           # DateTime in Prisma, string in GraphQL
    lastLogin: String            # Optional DateTime in Prisma, nullable String in GraphQL
  }

  type Song {
    id: ID!                      # ID for consistency
    title: String!
    artist: Artist!              # Reference to the Artist type
    duration: Int!
    releaseDate: String!         # DateTime in Prisma, string in GraphQL
    fileUrl: String!
  }

  type Artist {
    id: ID!                      # ID for consistency
    name: String!
    songs: [Song!]               # Relation: Artist has many songs
  }
`;
