export const mutations = `#graphql
    createUser(username: String!, email: String!, password: String!, profileImage: String): User!
  updateUser(id: Int!, username: String, email: String, password: String, profileImage: String): User!
  deleteUser(id: Int!): User!

  createSong(title: String!, artistId: Int!, duration: Int!, releaseDate: String!, fileUrl: String!): Song!
  updateSong(id: Int!, title: String, artistId: Int, duration: Int, releaseDate: String, fileUrl: String): Song!
  deleteSong(id: Int!): Song!

  createArtist(name: String!): Artist!
  updateArtist(id: Int!, name: String): Artist!
  deleteArtist(id: Int!): Artist!
`;
