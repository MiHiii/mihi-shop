'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUntils');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

//authentications
router.use(authenticationV2);
// return keyStore
//////////////
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post(
  '/shop/refresh-token',
  asyncHandler(accessController.handlerRefreshToken),
);

module.exports = router;
