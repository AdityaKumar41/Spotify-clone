import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../api/app";
import { GetCurrentUser } from "../graphql/query/user";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["Login_User"],
    queryFn: () => graphqlClient.request(GetCurrentUser),
  });

  return { ...query, user: query.data?.getCurrentUser };
};
