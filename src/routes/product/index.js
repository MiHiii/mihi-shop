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

module.exports = router;
