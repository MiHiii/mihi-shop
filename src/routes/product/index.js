'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUntils');
const router = express.Router();

//authentications
router.use(authenticationV2);

//////////////
router.post('', asyncHandler(productController.createProduct));
router.put(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop),
);

///QUERY ///
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/publish/all',
  asyncHandler(productController.getAllPublishForShop),
);

module.exports = router;
