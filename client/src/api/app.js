import { GraphQLClient } from "graphql-request";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000/graphql";

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: () => {
    const token = localStorage.getItem("fy_token");
    return {
      authorization: token ? `Bearer ${token}` : "",
    };
  },
});
