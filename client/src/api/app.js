import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "http://localhost:7000/graphql",
  {
    headers: () => {
      const token = localStorage.getItem("fy_token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  }
);
