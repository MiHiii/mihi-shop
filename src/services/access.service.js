'use strict';

const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUntils');
const { getInfoData } = require('../utils/index');
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require('../core/error.response');

//service
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  /*
   check this token used
  */
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    //check token đã sử dụng chưa
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong!! Please login again!');
    }

    //check token hợp lệ không
    console.log({ keyStore });
    console.log({ refreshToken });
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError('Invalid token!');

    //neu hop le thi check shop
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not resgister!');
    }

    //create new token
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //da su dung de lay token moi
      },
    });

    return {
      user,
      tokens,
    };
  };

  static handlerRefreshToken = async (refreshToken) => {
    //check token da su dung chua
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken,
    );
    console.log({ foundToken });
    if (foundToken) {
      //decode xem ai la nguoi su dung
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey,
      );
      console.log({ userId, email });
      //delete token
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong!! Please login again!');
    }

    //No, thì xử lý tiếp
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError('Shop not resgister! 1');
    }

    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );

    //check useId
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not resgister!');
    }

    //create new token
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //da su dung de lay token moi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    // console.log(`dsadsad ${keyStore}`);
    const delKey = await KeyTokenService.deleteKeyById(keyStore);
    // console.log({ delKey });
    return delKey;
  };

  /*
  1 - check email exits?
  2 - match password
  3 - create AT vs RT and save
  4 - generate tokens
  5 - get data return login
  */

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    // 1 - check email exits?
    if (!foundShop) {
      throw new BadRequestError('Error: Shop not found!');
    }

    // 2 - match password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Error: Password not match!');
    }

    // 3 - create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // 4 - generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    //step1: check email exits?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already exists!');
    }
    //step2: create new shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //create privateKey, publicKey
      /*
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });
        */

      //create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Create publicKey failed!');
      }

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );
      console.log(`Create token susscees: `, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     static: 'error',
    //   };
    // }
  };
}

module.exports = AccessService;
