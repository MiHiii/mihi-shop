'use strict';
const DiscountService = require('../services/discount.service');
const { SuccessResponse } = require('../core/success.response');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create discount code success',
      metadata: await DiscountService.createDiscountCode(req.body),
    }).send(res);
  };

  updateDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update discount code success',
      metadata: await DiscountService.updateDiscountCode(
        req.params.discountId,
        req.body,
      ),
    }).send(res);
  };
}
module.exports = new DiscountController();
