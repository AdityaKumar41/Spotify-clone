import { gql } from "graphql-tag";
export const VerifyGoogleAuthToken = gql(`
  #graphql
  query verifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const GetCurrentUser = gql`
  #graphql
  query getCurrentUser {
    getCurrentUser {
      id
      email
      username
      profileImage
    }
  }
`;
