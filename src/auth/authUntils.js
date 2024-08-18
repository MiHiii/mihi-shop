'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
  createTokenPair,
};
