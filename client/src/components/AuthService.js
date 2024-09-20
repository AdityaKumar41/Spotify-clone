// src/authService.js
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { config } from "./aws-config";

const poolData = {
  UserPoolId: config.UserPoolId,
  ClientId: config.ClientId,
};

const userPool = new CognitoUserPool(poolData);

export const signUp = (username, password, email) => {
  const attributeList = [{ Name: "email", Value: email }].map(
    (attr) => new CognitoUserAttribute(attr)
  );

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, data) => {
      if (err) {
        reject(err.message || JSON.stringify(err));
      } else {
        resolve(data);
      }
    });
  });
};

export const signIn = (username, password) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err.message || JSON.stringify(err)),
    });
  });
};
