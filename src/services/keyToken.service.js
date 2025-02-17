'use strict';

const { filter } = require('lodash');
const { Types } = require('mongoose');
const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  /*
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  */

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //lv0
      /*
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
      */

      //lv xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static findByUserId = async (userId) => {
    const result = await keytokenModel.findOne({
      user: new Types.ObjectId(userId),
    });

    return result;
  };

  static deleteKeyById = async (userId) => {
    const id = new Types.ObjectId(userId);
    const result = await keytokenModel.deleteOne({ user: id });
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    try {
      // Sửa lại query để tìm trong mảng refreshTokensUsed
      const result = await keytokenModel
        .findOne({
          refreshTokensUsed: {
            $in: [refreshToken],
          },
        })
        .lean();

      return result;
    } catch (error) {
      throw error;
    }
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };
}

module.exports = KeyTokenService;
