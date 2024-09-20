const { type } = require("./types");
const resolvers = require("./resolvers");
const { mutations } = require("./mutation");
const { queries } = require("./queries");

const UserTyp = {
  type,
  queries,
  mutations,
  resolvers,
};

module.exports = UserTyp;
