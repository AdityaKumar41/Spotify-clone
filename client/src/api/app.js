import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "https://spotify-clone-yi50.onrender.com/graphql",
  {
    headers: () => {
      const token = localStorage.getItem("fy_token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  }
);
