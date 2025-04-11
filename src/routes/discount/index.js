'use strict';

const express = require('express');
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUntils');
const router = express.Router();

router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.patch(
  '/:discountId',
  asyncHandler(discountController.updateDiscountCode),
);

module.exports = router;
