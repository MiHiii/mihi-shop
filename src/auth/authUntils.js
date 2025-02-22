'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

//service
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'refreshtoken',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw new Error('Access token invalid');
      } else {
        console.log('Access token valid', decoded);
      }
    });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return error;
  }
};

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
  1 - check userId missing?
  2 - get accessToken from header
  3 - verify accessToken
  4 - check user in db
  5 - check keyStore with userId
  6 - Ok => next()
  */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid request');

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keystore');

  //3
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError('Invalid user');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  //4
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid user');
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});
const authentication = asyncHandler(async (req, res, next) => {
  /*
  1 - check userId missing?
  2 - get accessToken from header
  3 - verify accessToken
  4 - check user in db
  5 - check keyStore with userId
  6 - Ok => next()
  */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid request');

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keystore');

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid user');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
