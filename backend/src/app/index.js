const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { type } = require("./graphql/User");
const UserTyp = require("./graphql/User");
const cors = require("cors");
const JWTServices = require("./jwt/jwt");

async function serverInit() {
  const app = express();
  app.use(
    cors({
      origin: [
        "http://localhost:9000",
        "http://localhost:5173",
        "https://8vxrhkz9-9000.inc1.devtunnels.ms",
        "https://spotify-clone-b326.vercel.app",
      ],
      credentials: true,
    })
  );

  app.use(bodyParser.json());
  const graphqlServer = new ApolloServer({
    typeDefs: `
    ${UserTyp.type}
      type Query {
        ${UserTyp.queries}
      }
      type Mutation  {
       ${UserTyp.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...UserTyp.resolvers.Query,
      },
      Mutation: {
        ...UserTyp.resolvers.Mutation,
      },
    },
  });

  await graphqlServer.start();
  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: ({ req }) => {
        return {
          user: req.headers.authorization
            ? JWTServices.VerifyJWT(req.headers.authorization.split(" ")[1])
            : null,
        };
      },
    })
  );

  return app;
}

module.exports = { serverInit };
