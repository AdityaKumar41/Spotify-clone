import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "https://8vxrhkz9-7000.inc1.devtunnels.ms/graphql",
  {
    headers: () => {
      const token = localStorage.getItem("fy_token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  }
);
