'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUntils');
const router = express.Router();

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct),
);
router.get('', asyncHandler(productController.getAllProducts));
router.get('/:product_id', asyncHandler(productController.getDetailProduct));

//authentications
router.use(authenticationV2);

//////////////
router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.put(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop),
);
router.put(
  '/unpublish/:id',
  asyncHandler(productController.unPublishProductByShop),
);

///QUERY ///
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/publish/all',
  asyncHandler(productController.getAllPublishForShop),
);
router.get(
  '/publish/all',
  asyncHandler(productController.getAllPublishForShop),
);

module.exports = router;
